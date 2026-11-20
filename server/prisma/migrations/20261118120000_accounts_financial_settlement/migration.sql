CREATE TABLE "DebitNote" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "debitNoteDate" TIMESTAMP(3) NOT NULL,
    "shipmentNo" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "totalCommissionAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DebitNote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DebitNoteLine" (
    "id" TEXT NOT NULL,
    "debitNoteId" TEXT NOT NULL,
    "productId" TEXT,
    "product" TEXT NOT NULL,
    "shipQty" DECIMAL(18,4) NOT NULL,
    "unit" TEXT NOT NULL,
    "scRate" DECIMAL(18,4) NOT NULL,
    "indRate" DECIMAL(18,4) NOT NULL,
    "diffRate" DECIMAL(18,4) NOT NULL,
    "opAmt" DECIMAL(18,2) NOT NULL,
    "commPct" DECIMAL(7,4) NOT NULL,
    "commAmt" DECIMAL(18,2) NOT NULL,
    "otherAmt" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalComm" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DebitNoteLine_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommissionReceipt" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "receiptDate" TIMESTAMP(3) NOT NULL,
    "supplierId" TEXT NOT NULL,
    "refNo" TEXT,
    "remarks" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CommissionReceipt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CommissionReceiptLine" (
    "id" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "debitNoteId" TEXT NOT NULL,
    "paidAmount" DECIMAL(18,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CommissionReceiptLine_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FinancialDocumentCounter" (
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FinancialDocumentCounter_pkey" PRIMARY KEY ("key")
);

CREATE UNIQUE INDEX "DebitNote_no_key" ON "DebitNote"("no");
CREATE UNIQUE INDEX "DebitNote_shipmentNo_key" ON "DebitNote"("shipmentNo");
CREATE INDEX "DebitNote_supplierId_idx" ON "DebitNote"("supplierId");
CREATE INDEX "DebitNote_customerId_idx" ON "DebitNote"("customerId");
CREATE INDEX "DebitNote_debitNoteDate_idx" ON "DebitNote"("debitNoteDate");
CREATE INDEX "DebitNote_createdBy_idx" ON "DebitNote"("createdBy");
CREATE INDEX "DebitNoteLine_debitNoteId_idx" ON "DebitNoteLine"("debitNoteId");
CREATE UNIQUE INDEX "CommissionReceipt_no_key" ON "CommissionReceipt"("no");
CREATE INDEX "CommissionReceipt_supplierId_idx" ON "CommissionReceipt"("supplierId");
CREATE INDEX "CommissionReceipt_receiptDate_idx" ON "CommissionReceipt"("receiptDate");
CREATE INDEX "CommissionReceipt_createdBy_idx" ON "CommissionReceipt"("createdBy");
CREATE UNIQUE INDEX "CommissionReceiptLine_receiptId_debitNoteId_key" ON "CommissionReceiptLine"("receiptId", "debitNoteId");
CREATE INDEX "CommissionReceiptLine_debitNoteId_idx" ON "CommissionReceiptLine"("debitNoteId");

ALTER TABLE "DebitNote" ADD CONSTRAINT "DebitNote_shipmentNo_fkey" FOREIGN KEY ("shipmentNo") REFERENCES "TradeShipment"("no") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DebitNote" ADD CONSTRAINT "DebitNote_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "MasterAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DebitNote" ADD CONSTRAINT "DebitNote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "MasterAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "DebitNote" ADD CONSTRAINT "DebitNote_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DebitNoteLine" ADD CONSTRAINT "DebitNoteLine_debitNoteId_fkey" FOREIGN KEY ("debitNoteId") REFERENCES "DebitNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommissionReceipt" ADD CONSTRAINT "CommissionReceipt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "MasterAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CommissionReceipt" ADD CONSTRAINT "CommissionReceipt_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CommissionReceiptLine" ADD CONSTRAINT "CommissionReceiptLine_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "CommissionReceipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommissionReceiptLine" ADD CONSTRAINT "CommissionReceiptLine_debitNoteId_fkey" FOREIGN KEY ("debitNoteId") REFERENCES "DebitNote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
