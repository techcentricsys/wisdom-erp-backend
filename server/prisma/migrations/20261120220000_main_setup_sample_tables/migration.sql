-- CreateTable
CREATE TABLE "SampleReceive" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "receiveDate" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "remarks" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SampleReceive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleReceiveItem" (
    "id" TEXT NOT NULL,
    "receiveNo" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(65,30) NOT NULL,
    "unit" TEXT NOT NULL,
    "packSize" TEXT,
    "batchNo" TEXT NOT NULL,
    "mfgDate" TEXT,
    "expDate" TEXT,
    "origin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SampleReceiveItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleIssue" (
    "id" TEXT NOT NULL,
    "no" TEXT NOT NULL,
    "issueDate" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "remarks" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SampleIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleIssueItem" (
    "id" TEXT NOT NULL,
    "issueNo" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "batchNo" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SampleIssueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetupMasterItem" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "swift" TEXT,
    "portUse" TEXT,
    "currencyCode" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetupMasterItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MailSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "senderName" TEXT NOT NULL DEFAULT '',
    "senderEmail" TEXT NOT NULL DEFAULT '',
    "host" TEXT NOT NULL DEFAULT '',
    "port" TEXT NOT NULL DEFAULT '',
    "security" TEXT NOT NULL DEFAULT 'TLS',
    "username" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL DEFAULT '',
    "signature" TEXT NOT NULL DEFAULT '',
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MailSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SampleReceive_no_key" ON "SampleReceive"("no");

-- CreateIndex
CREATE INDEX "SampleReceive_supplier_idx" ON "SampleReceive"("supplier");

-- CreateIndex
CREATE INDEX "SampleReceive_createdBy_idx" ON "SampleReceive"("createdBy");

-- CreateIndex
CREATE INDEX "SampleReceiveItem_receiveNo_idx" ON "SampleReceiveItem"("receiveNo");

-- CreateIndex
CREATE INDEX "SampleReceiveItem_product_batchNo_unit_idx" ON "SampleReceiveItem"("product", "batchNo", "unit");

-- CreateIndex
CREATE UNIQUE INDEX "SampleIssue_no_key" ON "SampleIssue"("no");

-- CreateIndex
CREATE INDEX "SampleIssue_customer_idx" ON "SampleIssue"("customer");

-- CreateIndex
CREATE INDEX "SampleIssue_createdBy_idx" ON "SampleIssue"("createdBy");

-- CreateIndex
CREATE INDEX "SampleIssueItem_issueNo_idx" ON "SampleIssueItem"("issueNo");

-- CreateIndex
CREATE INDEX "SampleIssueItem_product_batchNo_unit_idx" ON "SampleIssueItem"("product", "batchNo", "unit");

-- CreateIndex
CREATE INDEX "SetupMasterItem_kind_idx" ON "SetupMasterItem"("kind");

-- CreateIndex
CREATE INDEX "SetupMasterItem_createdBy_idx" ON "SetupMasterItem"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "SetupMasterItem_kind_name_key" ON "SetupMasterItem"("kind", "name");

-- AddForeignKey
ALTER TABLE "SampleReceive" ADD CONSTRAINT "SampleReceive_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleReceiveItem" ADD CONSTRAINT "SampleReceiveItem_receiveNo_fkey" FOREIGN KEY ("receiveNo") REFERENCES "SampleReceive"("no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleIssue" ADD CONSTRAINT "SampleIssue_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleIssueItem" ADD CONSTRAINT "SampleIssueItem_issueNo_fkey" FOREIGN KEY ("issueNo") REFERENCES "SampleIssue"("no") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetupMasterItem" ADD CONSTRAINT "SetupMasterItem_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

