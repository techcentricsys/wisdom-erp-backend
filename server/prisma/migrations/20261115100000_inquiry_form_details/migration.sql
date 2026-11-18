ALTER TABLE "CustomerInquiry"
ADD COLUMN "remarks" TEXT;

ALTER TABLE "InquiryItem"
ADD COLUMN "description" TEXT,
ADD COLUMN "shipmentSchedule" TEXT,
ADD COLUMN "packing" TEXT,
ADD COLUMN "detail" TEXT;
