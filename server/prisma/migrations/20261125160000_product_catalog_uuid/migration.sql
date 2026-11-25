CREATE TABLE IF NOT EXISTS "ProductType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ProductType_name_key" ON "ProductType"("name");

CREATE TABLE IF NOT EXISTS "UnitOfMeasure" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UnitOfMeasure_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "UnitOfMeasure_code_key" ON "UnitOfMeasure"("code");

CREATE TABLE IF NOT EXISTS "Manufacturer" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Manufacturer_code_key" ON "Manufacturer"("code");
CREATE INDEX IF NOT EXISTS "Manufacturer_code_idx" ON "Manufacturer"("code");
CREATE INDEX IF NOT EXISTS "Manufacturer_name_idx" ON "Manufacturer"("name");

CREATE TABLE IF NOT EXISTS "ItemSupplier" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "supplierProductCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ItemSupplier_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ItemSupplier_itemId_supplierId_key" ON "ItemSupplier"("itemId", "supplierId");
CREATE UNIQUE INDEX IF NOT EXISTS "ItemSupplier_supplierId_supplierProductCode_key" ON "ItemSupplier"("supplierId", "supplierProductCode");
CREATE INDEX IF NOT EXISTS "ItemSupplier_itemId_idx" ON "ItemSupplier"("itemId");
CREATE INDEX IF NOT EXISTS "ItemSupplier_supplierId_idx" ON "ItemSupplier"("supplierId");
CREATE INDEX IF NOT EXISTS "ItemSupplier_supplierProductCode_idx" ON "ItemSupplier"("supplierProductCode");

CREATE TABLE IF NOT EXISTS "ItemManufacturer" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ItemManufacturer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ItemManufacturer_itemId_manufacturerId_key" ON "ItemManufacturer"("itemId", "manufacturerId");
CREATE INDEX IF NOT EXISTS "ItemManufacturer_itemId_idx" ON "ItemManufacturer"("itemId");
CREATE INDEX IF NOT EXISTS "ItemManufacturer_manufacturerId_idx" ON "ItemManufacturer"("manufacturerId");

ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "productTypeId" TEXT;
ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "defaultUomId" TEXT;
ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "casNumber" TEXT;
ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "packing" TEXT;
ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "hsCode" TEXT;
ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "grade" TEXT;
ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "origin" TEXT;
ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "createdById" TEXT;
