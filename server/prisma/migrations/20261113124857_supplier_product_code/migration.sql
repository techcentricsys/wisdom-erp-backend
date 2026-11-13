/*
  Warnings:

  - A unique constraint covering the columns `[supplierId,supplierProductCode]` on the table `ItemSupplier` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ItemSupplier" ADD COLUMN     "supplierProductCode" TEXT;

-- CreateIndex
CREATE INDEX "ItemSupplier_supplierProductCode_idx" ON "ItemSupplier"("supplierProductCode");

-- CreateIndex
CREATE UNIQUE INDEX "ItemSupplier_supplierId_supplierProductCode_key" ON "ItemSupplier"("supplierId", "supplierProductCode");
