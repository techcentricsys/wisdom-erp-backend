ALTER TABLE "CustomerInquiry"
ADD COLUMN "salespersonMasterId" TEXT,
ADD COLUMN "commercialPersonMasterId" TEXT;

CREATE INDEX "CustomerInquiry_salespersonMasterId_idx"
ON "CustomerInquiry"("salespersonMasterId");

CREATE INDEX "CustomerInquiry_commercialPersonMasterId_idx"
ON "CustomerInquiry"("commercialPersonMasterId");

ALTER TABLE "CustomerInquiry"
ADD CONSTRAINT "CustomerInquiry_salespersonMasterId_fkey"
FOREIGN KEY ("salespersonMasterId") REFERENCES "SetupMasterItem"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CustomerInquiry"
ADD CONSTRAINT "CustomerInquiry_commercialPersonMasterId_fkey"
FOREIGN KEY ("commercialPersonMasterId") REFERENCES "SetupMasterItem"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
