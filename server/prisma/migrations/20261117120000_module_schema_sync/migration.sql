-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_itemId_fkey";

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "cancelDate" TEXT,
ADD COLUMN     "commercialPerson" TEXT,
ADD COLUMN     "customer" TEXT,
ADD COLUMN     "incoterm" TEXT,
ADD COLUMN     "indentNo" TEXT,
ADD COLUMN     "portDestination" TEXT,
ADD COLUMN     "portLoading" TEXT,
ADD COLUMN     "refNo" TEXT,
ADD COLUMN     "salesperson" TEXT,
ADD COLUMN     "supplierAccountId" TEXT,
ADD COLUMN     "supplierName" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "supplierId" DROP NOT NULL,
ALTER COLUMN "totalAmount" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "PurchaseOrderItem" ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "indentItemId" TEXT,
ADD COLUMN     "indentQty" DECIMAL(65,30),
ADD COLUMN     "manufacturer" TEXT,
ADD COLUMN     "packing" TEXT,
ADD COLUMN     "productName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "unit" TEXT,
ALTER COLUMN "itemId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "offerDate" TEXT NOT NULL,
    "validityDate" TEXT NOT NULL,
    "inquiryNo" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "customerId" TEXT,
    "supplier" TEXT NOT NULL,
    "supplierId" TEXT,
    "salesperson" TEXT,
    "salespersonId" TEXT,
    "commercialPerson" TEXT,
    "portLoading" TEXT,
    "portDestination" TEXT,
    "partialShipment" TEXT NOT NULL DEFAULT 'Allowed',
    "transShipment" TEXT NOT NULL DEFAULT 'Allowed',
    "shipmentPeriod" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'US DOLLAR',
    "incoterm" TEXT,
    "insurance" TEXT,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "denyDate" TEXT,
    "denyReason" TEXT,
    "approvalStatus" TEXT NOT NULL DEFAULT 'Pending',
    "approvedBy" TEXT,
    "approvalDate" TEXT,
    "approvalRemark" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferItem" (
    "id" TEXT NOT NULL,
    "offerNo" TEXT NOT NULL,
    "productId" TEXT,
    "product" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "supplier" TEXT,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unit" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "commission" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "shippingMode" TEXT,
    "paymentTerm" TEXT,
    "manufacturer" TEXT,
    "packing" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfferItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indent" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "indentDate" TEXT NOT NULL,
    "validityDate" TEXT NOT NULL,
    "offerNo" TEXT NOT NULL,
    "offerDate" TEXT,
    "refNo" TEXT,
    "customer" TEXT NOT NULL,
    "customerId" TEXT,
    "supplier" TEXT NOT NULL,
    "supplierId" TEXT,
    "salesperson" TEXT,
    "salespersonId" TEXT,
    "commercialPerson" TEXT,
    "portLoading" TEXT,
    "portDestination" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'US DOLLAR',
    "incoterm" TEXT,
    "insurance" TEXT,
    "shippingAgent" TEXT,
    "shippingMark" TEXT,
    "partialShipment" TEXT NOT NULL DEFAULT 'Allowed',
    "transShipment" TEXT NOT NULL DEFAULT 'Allowed',
    "shipmentPeriod" TEXT,
    "bankType" TEXT NOT NULL DEFAULT 'Bank',
    "specialNote" TEXT,
    "instruction" TEXT,
    "remarks" TEXT,
    "checklist" JSONB,
    "printWithLogo" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "cancelDate" TEXT,
    "poStatus" TEXT NOT NULL DEFAULT 'PO Pending',
    "shipStatus" TEXT NOT NULL DEFAULT 'Not Shipped',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Indent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IndentItem" (
    "id" TEXT NOT NULL,
    "indentNo" TEXT NOT NULL,
    "productId" TEXT,
    "product" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unit" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "commissionPct" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "shippingMode" TEXT,
    "paymentTerm" TEXT,
    "manufacturer" TEXT,
    "packing" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IndentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeShipment" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "shipmentDate" TEXT NOT NULL,
    "lotNo" TEXT,
    "indentNo" TEXT NOT NULL,
    "indentDate" TEXT,
    "lcNo" TEXT,
    "lcDate" TEXT,
    "lcExpiry" TEXT,
    "lcBank" TEXT,
    "lcAccountNo" TEXT,
    "supplier" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "salesperson" TEXT,
    "commercialPerson" TEXT,
    "invoiceNo" TEXT,
    "invoiceDate" TEXT,
    "blNo" TEXT,
    "blDate" TEXT,
    "shipmentRemarks" TEXT,
    "otherRemarks" TEXT,
    "finalRemarks" TEXT,
    "readyForDebitNote" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeShipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeShipmentItem" (
    "id" TEXT NOT NULL,
    "shipmentNo" TEXT NOT NULL,
    "productId" TEXT,
    "product" TEXT NOT NULL,
    "description" TEXT,
    "indentQty" DECIMAL(65,30),
    "shippedQty" DECIMAL(65,30) NOT NULL,
    "unit" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradeShipmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentDocument" (
    "id" TEXT NOT NULL,
    "indentNo" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "confNo" TEXT,
    "confDate" TEXT,
    "shipmentDate" TEXT,
    "arrivalDate" TEXT,
    "payDocType" TEXT,
    "payDocNo" TEXT,
    "payDocDate" TEXT,
    "paymentTerm" TEXT,
    "bankAccountNo" TEXT,
    "bankName" TEXT,
    "latestShipDate" TEXT,
    "expShipDate" TEXT,
    "invoiceNo" TEXT,
    "invoiceDate" TEXT,
    "blNo" TEXT,
    "blDate" TEXT,
    "vessel" TEXT,
    "sealNo" TEXT,
    "containerNo" TEXT,
    "grossWeight" TEXT,
    "cbm" TEXT,
    "blArrivalDate" TEXT,
    "blIssuePlace" TEXT,
    "loadType" TEXT NOT NULL DEFAULT 'FCL',
    "batchNo" TEXT,
    "mfgDate" TEXT,
    "expiryDate" TEXT,
    "reEvalDate" TEXT,
    "trackNo" TEXT,
    "documents" JSONB,
    "history" JSONB,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipmentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Offer_no_key" ON "Offer"("no");

-- CreateIndex
CREATE INDEX "Offer_inquiryNo_idx" ON "Offer"("inquiryNo");

-- CreateIndex
CREATE INDEX "Offer_status_idx" ON "Offer"("status");

-- CreateIndex
CREATE INDEX "Offer_approvalStatus_idx" ON "Offer"("approvalStatus");

-- CreateIndex
CREATE INDEX "Offer_createdBy_idx" ON "Offer"("createdBy");

-- CreateIndex
CREATE INDEX "OfferItem_offerNo_idx" ON "OfferItem"("offerNo");

-- CreateIndex
CREATE UNIQUE INDEX "Indent_no_key" ON "Indent"("no");

-- CreateIndex
CREATE INDEX "Indent_offerNo_idx" ON "Indent"("offerNo");

-- CreateIndex
CREATE INDEX "Indent_status_idx" ON "Indent"("status");

-- CreateIndex
CREATE INDEX "Indent_poStatus_idx" ON "Indent"("poStatus");

-- CreateIndex
CREATE INDEX "Indent_createdBy_idx" ON "Indent"("createdBy");

-- CreateIndex
CREATE INDEX "IndentItem_indentNo_idx" ON "IndentItem"("indentNo");

-- CreateIndex
CREATE UNIQUE INDEX "TradeShipment_no_key" ON "TradeShipment"("no");

-- CreateIndex
CREATE INDEX "TradeShipment_indentNo_idx" ON "TradeShipment"("indentNo");

-- CreateIndex
CREATE INDEX "TradeShipment_readyForDebitNote_idx" ON "TradeShipment"("readyForDebitNote");

-- CreateIndex
CREATE INDEX "TradeShipment_createdBy_idx" ON "TradeShipment"("createdBy");

-- CreateIndex
CREATE INDEX "TradeShipmentItem_shipmentNo_idx" ON "TradeShipmentItem"("shipmentNo");

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentDocument_indentNo_key" ON "ShipmentDocument"("indentNo");

-- CreateIndex
CREATE INDEX "ShipmentDocument_indentNo_idx" ON "ShipmentDocument"("indentNo");

-- CreateIndex
CREATE INDEX "ShipmentDocument_createdBy_idx" ON "ShipmentDocument"("createdBy");

-- CreateIndex
CREATE INDEX "PurchaseOrder_indentNo_idx" ON "PurchaseOrder"("indentNo");

-- CreateIndex
CREATE INDEX "PurchaseOrder_supplierAccountId_idx" ON "PurchaseOrder"("supplierAccountId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_status_idx" ON "PurchaseOrder"("status");

-- CreateIndex
CREATE INDEX "PurchaseOrder_createdById_idx" ON "PurchaseOrder"("createdById");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_indentItemId_idx" ON "PurchaseOrderItem"("indentItemId");

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierAccountId_fkey" FOREIGN KEY ("supplierAccountId") REFERENCES "MasterAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_indentNo_fkey" FOREIGN KEY ("indentNo") REFERENCES "Indent"("no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_indentItemId_fkey" FOREIGN KEY ("indentItemId") REFERENCES "IndentItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferItem" ADD CONSTRAINT "OfferItem_offerNo_fkey" FOREIGN KEY ("offerNo") REFERENCES "Offer"("no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indent" ADD CONSTRAINT "Indent_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IndentItem" ADD CONSTRAINT "IndentItem_indentNo_fkey" FOREIGN KEY ("indentNo") REFERENCES "Indent"("no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeShipment" ADD CONSTRAINT "TradeShipment_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TradeShipmentItem" ADD CONSTRAINT "TradeShipmentItem_shipmentNo_fkey" FOREIGN KEY ("shipmentNo") REFERENCES "TradeShipment"("no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentDocument" ADD CONSTRAINT "ShipmentDocument_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
