-- CreateTable
CREATE TABLE "DebitNote" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "debitNoteDate" TEXT NOT NULL,
    "shipmentNo" TEXT NOT NULL,
    "shipDate" TEXT,
    "invNo" TEXT,
    "invDate" TEXT,
    "lcNo" TEXT,
    "lcDate" TEXT,
    "supplier" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "remarks" TEXT,
    "totalCommissionAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebitNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebitNoteLine" (
    "id" TEXT NOT NULL,
    "debitNoteNo" TEXT NOT NULL,
    "productId" TEXT,
    "product" TEXT NOT NULL,
    "description" TEXT,
    "detail" TEXT,
    "shipQty" DECIMAL(65,30) NOT NULL,
    "unit" TEXT NOT NULL,
    "scRate" DECIMAL(65,30) NOT NULL,
    "indRate" DECIMAL(65,30) NOT NULL,
    "diffRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "opAmt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "commPct" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "commAmt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "otherAmt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalComm" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebitNoteLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionReceipt" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "receiptDate" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "refNo" TEXT,
    "remarks" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommissionReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommissionReceiptLine" (
    "id" TEXT NOT NULL,
    "receiptNo" TEXT NOT NULL,
    "debitNoteNo" TEXT NOT NULL,
    "paidAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommissionReceiptLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DebitNote_no_key" ON "DebitNote"("no");

-- CreateIndex
CREATE UNIQUE INDEX "DebitNote_shipmentNo_key" ON "DebitNote"("shipmentNo");

-- CreateIndex
CREATE INDEX "DebitNote_supplier_idx" ON "DebitNote"("supplier");

-- CreateIndex
CREATE INDEX "DebitNote_customer_idx" ON "DebitNote"("customer");

-- CreateIndex
CREATE INDEX "DebitNote_createdBy_idx" ON "DebitNote"("createdBy");

-- CreateIndex
CREATE INDEX "DebitNoteLine_debitNoteNo_idx" ON "DebitNoteLine"("debitNoteNo");

-- CreateIndex
CREATE UNIQUE INDEX "CommissionReceipt_no_key" ON "CommissionReceipt"("no");

-- CreateIndex
CREATE INDEX "CommissionReceipt_supplier_idx" ON "CommissionReceipt"("supplier");

-- CreateIndex
CREATE INDEX "CommissionReceipt_createdBy_idx" ON "CommissionReceipt"("createdBy");

-- CreateIndex
CREATE INDEX "CommissionReceiptLine_debitNoteNo_idx" ON "CommissionReceiptLine"("debitNoteNo");

-- CreateIndex
CREATE UNIQUE INDEX "CommissionReceiptLine_receiptNo_debitNoteNo_key" ON "CommissionReceiptLine"("receiptNo", "debitNoteNo");

-- AddForeignKey
ALTER TABLE "DebitNote" ADD CONSTRAINT "DebitNote_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebitNoteLine" ADD CONSTRAINT "DebitNoteLine_debitNoteNo_fkey" FOREIGN KEY ("debitNoteNo") REFERENCES "DebitNote"("no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionReceipt" ADD CONSTRAINT "CommissionReceipt_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionReceiptLine" ADD CONSTRAINT "CommissionReceiptLine_receiptNo_fkey" FOREIGN KEY ("receiptNo") REFERENCES "CommissionReceipt"("no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommissionReceiptLine" ADD CONSTRAINT "CommissionReceiptLine_debitNoteNo_fkey" FOREIGN KEY ("debitNoteNo") REFERENCES "DebitNote"("no") ON DELETE RESTRICT ON UPDATE CASCADE;
