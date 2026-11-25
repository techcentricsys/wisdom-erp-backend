-- Upgrade the legacy settlement tables in place. The previous release already created
-- these tables with foreign-key IDs and timestamp dates; keep their rows while
-- changing them to the text-based shape used by the current Prisma models.

ALTER TABLE "DebitNote" DROP CONSTRAINT IF EXISTS "DebitNote_shipmentNo_fkey";
ALTER TABLE "DebitNote" DROP CONSTRAINT IF EXISTS "DebitNote_supplierId_fkey";
ALTER TABLE "DebitNote" DROP CONSTRAINT IF EXISTS "DebitNote_customerId_fkey";
ALTER TABLE "DebitNote" DROP CONSTRAINT IF EXISTS "DebitNote_createdBy_fkey";
ALTER TABLE "DebitNoteLine" DROP CONSTRAINT IF EXISTS "DebitNoteLine_debitNoteId_fkey";
ALTER TABLE "CommissionReceipt" DROP CONSTRAINT IF EXISTS "CommissionReceipt_supplierId_fkey";
ALTER TABLE "CommissionReceipt" DROP CONSTRAINT IF EXISTS "CommissionReceipt_createdBy_fkey";
ALTER TABLE "CommissionReceiptLine" DROP CONSTRAINT IF EXISTS "CommissionReceiptLine_receiptId_fkey";
ALTER TABLE "CommissionReceiptLine" DROP CONSTRAINT IF EXISTS "CommissionReceiptLine_debitNoteId_fkey";

-- Resolve legacy account IDs to their names before removing those ID columns.
UPDATE "DebitNote" AS dn
SET "supplierId" = COALESCE(ma."name", dn."supplierId")
FROM "MasterAccount" AS ma
WHERE ma."id" = dn."supplierId";

UPDATE "DebitNote" AS dn
SET "customerId" = COALESCE(ma."name", dn."customerId")
FROM "MasterAccount" AS ma
WHERE ma."id" = dn."customerId";

UPDATE "CommissionReceipt" AS cr
SET "supplierId" = COALESCE(ma."name", cr."supplierId")
FROM "MasterAccount" AS ma
WHERE ma."id" = cr."supplierId";

-- Replace child foreign keys to internal IDs with their stable document numbers.
UPDATE "DebitNoteLine" AS line
SET "debitNoteId" = dn."no"
FROM "DebitNote" AS dn
WHERE line."debitNoteId" = dn."id";

UPDATE "CommissionReceiptLine" AS line
SET "receiptId" = receipt."no"
FROM "CommissionReceipt" AS receipt
WHERE line."receiptId" = receipt."id";

UPDATE "CommissionReceiptLine" AS line
SET "debitNoteId" = dn."no"
FROM "DebitNote" AS dn
WHERE line."debitNoteId" = dn."id";

DROP INDEX IF EXISTS "DebitNote_supplierId_idx";
DROP INDEX IF EXISTS "DebitNote_customerId_idx";
DROP INDEX IF EXISTS "DebitNote_debitNoteDate_idx";
DROP INDEX IF EXISTS "DebitNote_createdBy_idx";
DROP INDEX IF EXISTS "DebitNoteLine_debitNoteId_idx";
DROP INDEX IF EXISTS "CommissionReceipt_supplierId_idx";
DROP INDEX IF EXISTS "CommissionReceipt_receiptDate_idx";
DROP INDEX IF EXISTS "CommissionReceipt_createdBy_idx";
DROP INDEX IF EXISTS "CommissionReceiptLine_receiptId_debitNoteId_key";
DROP INDEX IF EXISTS "CommissionReceiptLine_debitNoteId_idx";

ALTER TABLE "DebitNote" RENAME COLUMN "supplierId" TO "supplier";
ALTER TABLE "DebitNote" RENAME COLUMN "customerId" TO "customer";
ALTER TABLE "DebitNote" ALTER COLUMN "debitNoteDate" TYPE TEXT
USING to_char("debitNoteDate", 'YYYY-MM-DD');
ALTER TABLE "DebitNote"
  ADD COLUMN "shipDate" TEXT,
  ADD COLUMN "invNo" TEXT,
  ADD COLUMN "invDate" TEXT,
  ADD COLUMN "lcNo" TEXT,
  ADD COLUMN "lcDate" TEXT;

ALTER TABLE "DebitNoteLine" RENAME COLUMN "debitNoteId" TO "debitNoteNo";
ALTER TABLE "CommissionReceipt" RENAME COLUMN "supplierId" TO "supplier";
ALTER TABLE "CommissionReceipt" ALTER COLUMN "receiptDate" TYPE TEXT
USING to_char("receiptDate", 'YYYY-MM-DD');
ALTER TABLE "CommissionReceiptLine" RENAME COLUMN "receiptId" TO "receiptNo";
ALTER TABLE "CommissionReceiptLine" RENAME COLUMN "debitNoteId" TO "debitNoteNo";

-- Match the current Prisma Decimal precision while preserving existing values.
ALTER TABLE "DebitNote"
  ALTER COLUMN "totalCommissionAmount" TYPE DECIMAL(65,30)
  USING "totalCommissionAmount"::DECIMAL(65,30);
ALTER TABLE "DebitNoteLine"
  ALTER COLUMN "shipQty" TYPE DECIMAL(65,30) USING "shipQty"::DECIMAL(65,30),
  ALTER COLUMN "scRate" TYPE DECIMAL(65,30) USING "scRate"::DECIMAL(65,30),
  ALTER COLUMN "indRate" TYPE DECIMAL(65,30) USING "indRate"::DECIMAL(65,30),
  ALTER COLUMN "diffRate" TYPE DECIMAL(65,30) USING "diffRate"::DECIMAL(65,30),
  ALTER COLUMN "opAmt" TYPE DECIMAL(65,30) USING "opAmt"::DECIMAL(65,30),
  ALTER COLUMN "commPct" TYPE DECIMAL(65,30) USING "commPct"::DECIMAL(65,30),
  ALTER COLUMN "commAmt" TYPE DECIMAL(65,30) USING "commAmt"::DECIMAL(65,30),
  ALTER COLUMN "otherAmt" TYPE DECIMAL(65,30) USING "otherAmt"::DECIMAL(65,30),
  ALTER COLUMN "totalComm" TYPE DECIMAL(65,30) USING "totalComm"::DECIMAL(65,30);
ALTER TABLE "CommissionReceiptLine"
  ALTER COLUMN "paidAmount" TYPE DECIMAL(65,30)
  USING "paidAmount"::DECIMAL(65,30);

ALTER TABLE "DebitNoteLine"
  ALTER COLUMN "diffRate" SET DEFAULT 0,
  ALTER COLUMN "opAmt" SET DEFAULT 0,
  ALTER COLUMN "commPct" SET DEFAULT 0,
  ALTER COLUMN "commAmt" SET DEFAULT 0,
  ALTER COLUMN "otherAmt" SET DEFAULT 0,
  ALTER COLUMN "totalComm" SET DEFAULT 0;

CREATE INDEX "DebitNote_supplier_idx" ON "DebitNote"("supplier");
CREATE INDEX "DebitNote_customer_idx" ON "DebitNote"("customer");
CREATE INDEX "DebitNote_createdBy_idx" ON "DebitNote"("createdBy");
CREATE INDEX "DebitNoteLine_debitNoteNo_idx" ON "DebitNoteLine"("debitNoteNo");
CREATE INDEX "CommissionReceipt_supplier_idx" ON "CommissionReceipt"("supplier");
CREATE INDEX "CommissionReceipt_createdBy_idx" ON "CommissionReceipt"("createdBy");
CREATE INDEX "CommissionReceiptLine_debitNoteNo_idx" ON "CommissionReceiptLine"("debitNoteNo");
CREATE UNIQUE INDEX "CommissionReceiptLine_receiptNo_debitNoteNo_key"
  ON "CommissionReceiptLine"("receiptNo", "debitNoteNo");

ALTER TABLE "DebitNote"
  ADD CONSTRAINT "DebitNote_createdBy_fkey"
  FOREIGN KEY ("createdBy") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DebitNoteLine"
  ADD CONSTRAINT "DebitNoteLine_debitNoteNo_fkey"
  FOREIGN KEY ("debitNoteNo") REFERENCES "DebitNote"("no")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommissionReceipt"
  ADD CONSTRAINT "CommissionReceipt_createdBy_fkey"
  FOREIGN KEY ("createdBy") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CommissionReceiptLine"
  ADD CONSTRAINT "CommissionReceiptLine_receiptNo_fkey"
  FOREIGN KEY ("receiptNo") REFERENCES "CommissionReceipt"("no")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CommissionReceiptLine"
  ADD CONSTRAINT "CommissionReceiptLine_debitNoteNo_fkey"
  FOREIGN KEY ("debitNoteNo") REFERENCES "DebitNote"("no")
  ON DELETE RESTRICT ON UPDATE CASCADE;
