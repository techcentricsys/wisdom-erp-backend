import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { IndentsAccess } from '../indents/indents.access.js';
import { FinancialSettlementService } from './financial-settlement.service.js';

describe('FinancialSettlementService updates', () => {
  const user = { id: 'user-1', baseRole: 'Super Admin' };
  const access = {
    assertScreenPermission: vi.fn().mockResolvedValue(undefined),
    resolveScopeUserIds: vi.fn().mockResolvedValue(null),
  } as unknown as IndentsAccess;

  beforeEach(() => vi.clearAllMocks());

  it('updates debit note lines and persists description and detail', async () => {
    const updatedRow = {
      id: 'dn-1', no: '6022600001', totalCommissionAmount: 12,
      receiptLines: [], lines: [{ product: 'Rod', shipQty: 2, scRate: 5, indRate: 4, diffRate: 1, opAmt: 2, commPct: 100, commAmt: 10, otherAmt: 0, totalComm: 12 }],
    };
    const tx = {
      debitNote: {
        findUnique: vi.fn().mockResolvedValue({ id: 'dn-1', shipmentNo: '5022600001', createdBy: user.id, receiptLines: [] }),
        update: vi.fn().mockResolvedValue(updatedRow),
      },
      tradeShipment: {
        findUnique: vi.fn().mockResolvedValue({
          no: '5022600001', readyForDebitNote: true, supplier: 'Supplier A', customer: 'Customer A',
          items: [{ productId: 'product-1', product: 'Rod', shippedQty: 10 }],
        }),
      },
      masterAccount: {
        findFirst: vi.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id, name: where.type === 'Supplier' ? 'Supplier A' : 'Customer A' })),
      },
      debitNoteLine: { deleteMany: vi.fn().mockResolvedValue({ count: 1 }) },
    };
    const prisma = {
      $transaction: vi.fn((callback: (client: any) => unknown) => callback(tx)),
    } as unknown as PrismaService;
    const service = new FinancialSettlementService(prisma, access);

    await service.updateDebitNote(user, 'dn-1', {
      shipmentNo: '5022600001', debitNoteDate: '2026-11-20', supplierId: 'supplier-1', customerId: 'customer-1',
      lines: [{ productId: 'product-1', product: 'Rod', description: 'Steel rod', detail: 'Grade A', shipQty: 2, unit: 'KG', scRate: 5, indRate: 4, commPct: 100, otherAmt: 0 }],
    });

    expect(tx.debitNoteLine.deleteMany).toHaveBeenCalledWith({ where: { debitNoteId: 'dn-1' } });
    expect(tx.debitNote.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'dn-1' },
      data: expect.objectContaining({
        lines: { create: [expect.objectContaining({ description: 'Steel rod', detail: 'Grade A' })] },
      }),
    }));
  });

  it('rejects a debit note edit that would reduce commission below already received', async () => {
    const debitNoteModel = {
      findUnique: vi.fn().mockResolvedValue({ id: 'dn-1', shipmentNo: '5022600001', createdBy: user.id, receiptLines: [{ paidAmount: 20 }] }),
      update: vi.fn(),
    };
    const tx = {
      debitNote: debitNoteModel,
      tradeShipment: { findUnique: vi.fn().mockResolvedValue({ no: '5022600001', readyForDebitNote: true, supplier: 'Supplier A', customer: 'Customer A', items: [{ productId: 'product-1', product: 'Rod', shippedQty: 10 }] }) },
      masterAccount: { findFirst: vi.fn().mockImplementation(({ where }) => Promise.resolve({ id: where.id, name: where.type === 'Supplier' ? 'Supplier A' : 'Customer A' })) },
      debitNoteLine: { deleteMany: vi.fn() },
    };
    const prisma = { $transaction: vi.fn((callback: (client: any) => unknown) => callback(tx)) } as unknown as PrismaService;
    const service = new FinancialSettlementService(prisma, access);

    await expect(service.updateDebitNote(user, 'dn-1', {
      shipmentNo: '5022600001', debitNoteDate: '2026-11-20', supplierId: 'supplier-1', customerId: 'customer-1',
      lines: [{ productId: 'product-1', product: 'Rod', shipQty: 1, unit: 'KG', scRate: 5, indRate: 5, commPct: 0, otherAmt: 0 }],
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(tx.debitNoteLine.deleteMany).not.toHaveBeenCalled();
  });

  it('rejects a receipt edit that exceeds the debit note balance excluding this receipt', async () => {
    const tx = {
      commissionReceipt: {
        findUnique: vi.fn().mockResolvedValue({ id: 'receipt-1', supplierId: 'supplier-1', createdBy: user.id, lines: [{ debitNoteId: 'dn-1', paidAmount: 30 }] }),
        update: vi.fn(),
      },
      debitNote: {
        findMany: vi.fn().mockResolvedValue([{
          id: 'dn-1', no: '6022600001', debitNoteDate: new Date('2026-11-01'), totalCommissionAmount: 100,
          receiptLines: [{ receiptId: 'receipt-1', paidAmount: 30 }, { receiptId: 'other-receipt', paidAmount: 10 }],
        }]),
      },
      commissionReceiptLine: { deleteMany: vi.fn() },
    };
    const prisma = { $transaction: vi.fn((callback: (client: any) => unknown) => callback(tx)) } as unknown as PrismaService;
    const service = new FinancialSettlementService(prisma, access);

    await expect(service.updateReceipt(user, 'receipt-1', {
      receiptDate: '2026-11-20', supplierId: 'supplier-1', lines: [{ debitNoteId: 'dn-1', paidAmount: 95 }],
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(tx.commissionReceiptLine.deleteMany).not.toHaveBeenCalled();
  });
});
