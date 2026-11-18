CREATE TYPE "CustomerInquiryStatus" AS ENUM ('OPEN', 'OFFERED', 'CANCELLED');

CREATE TABLE "CustomerInquiry" (
    "inquiryNo" TEXT NOT NULL,
    "inquiryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" TEXT NOT NULL,
    "salespersonId" TEXT,
    "commercialPersonId" TEXT,
    "incoterm" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "portLoading" TEXT,
    "portDestination" TEXT,
    "status" "CustomerInquiryStatus" NOT NULL DEFAULT 'OPEN',
    "cancelDate" TIMESTAMP(3),
    "cancelReason" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CustomerInquiry_pkey" PRIMARY KEY ("inquiryNo")
);

CREATE TABLE "InquiryItem" (
    "id" TEXT NOT NULL,
    "inquiryNo" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "unit" TEXT NOT NULL,
    "shippingMode" TEXT,
    "paymentTerm" TEXT,
    "manufacturer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "InquiryItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SupplierRateSheet" (
    "id" TEXT NOT NULL,
    "inquiryNo" TEXT NOT NULL,
    "inquiryItemId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "quotedRate" DECIMAL(18,4) NOT NULL,
    "commissionPct" DECIMAL(7,4) NOT NULL DEFAULT 0,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SupplierRateSheet_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CustomerInquiry_customerId_idx" ON "CustomerInquiry"("customerId");
CREATE INDEX "CustomerInquiry_salespersonId_idx" ON "CustomerInquiry"("salespersonId");
CREATE INDEX "CustomerInquiry_commercialPersonId_idx" ON "CustomerInquiry"("commercialPersonId");
CREATE INDEX "CustomerInquiry_createdById_idx" ON "CustomerInquiry"("createdById");
CREATE INDEX "CustomerInquiry_inquiryDate_idx" ON "CustomerInquiry"("inquiryDate");
CREATE INDEX "CustomerInquiry_status_idx" ON "CustomerInquiry"("status");
CREATE INDEX "InquiryItem_inquiryNo_idx" ON "InquiryItem"("inquiryNo");
CREATE INDEX "InquiryItem_productId_idx" ON "InquiryItem"("productId");
CREATE UNIQUE INDEX "SupplierRateSheet_inquiryItemId_supplierId_key" ON "SupplierRateSheet"("inquiryItemId", "supplierId");
CREATE INDEX "SupplierRateSheet_inquiryNo_idx" ON "SupplierRateSheet"("inquiryNo");
CREATE INDEX "SupplierRateSheet_supplierId_idx" ON "SupplierRateSheet"("supplierId");

ALTER TABLE "CustomerInquiry" ADD CONSTRAINT "CustomerInquiry_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CustomerInquiry" ADD CONSTRAINT "CustomerInquiry_salespersonId_fkey"
    FOREIGN KEY ("salespersonId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CustomerInquiry" ADD CONSTRAINT "CustomerInquiry_commercialPersonId_fkey"
    FOREIGN KEY ("commercialPersonId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CustomerInquiry" ADD CONSTRAINT "CustomerInquiry_createdById_fkey"
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InquiryItem" ADD CONSTRAINT "InquiryItem_inquiryNo_fkey"
    FOREIGN KEY ("inquiryNo") REFERENCES "CustomerInquiry"("inquiryNo") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InquiryItem" ADD CONSTRAINT "InquiryItem_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SupplierRateSheet" ADD CONSTRAINT "SupplierRateSheet_inquiryNo_fkey"
    FOREIGN KEY ("inquiryNo") REFERENCES "CustomerInquiry"("inquiryNo") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SupplierRateSheet" ADD CONSTRAINT "SupplierRateSheet_inquiryItemId_fkey"
    FOREIGN KEY ("inquiryItemId") REFERENCES "InquiryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SupplierRateSheet" ADD CONSTRAINT "SupplierRateSheet_supplierId_fkey"
    FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
