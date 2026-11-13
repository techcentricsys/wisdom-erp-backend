/*
  Warnings:

  - A unique constraint covering the columns `[serialId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialId]` on the table `ItemCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialId]` on the table `Manufacturer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialId]` on the table `ProductType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialId]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialId]` on the table `UnitOfMeasure` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "serialId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "ItemCategory" ADD COLUMN     "serialId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Manufacturer" ADD COLUMN     "serialId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "ProductType" ADD COLUMN     "serialId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "serialId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "UnitOfMeasure" ADD COLUMN     "serialId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_serialId_key" ON "Item"("serialId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_serialId_key" ON "ItemCategory"("serialId");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_serialId_key" ON "Manufacturer"("serialId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductType_serialId_key" ON "ProductType"("serialId");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_serialId_key" ON "Supplier"("serialId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitOfMeasure_serialId_key" ON "UnitOfMeasure"("serialId");
