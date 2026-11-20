-- AlterTable
ALTER TABLE "User" ADD COLUMN     "baseRole" TEXT NOT NULL DEFAULT 'Local User',
ADD COLUMN     "canCreateMaster" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "failedLogins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "managerId" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "baseRole" TEXT NOT NULL DEFAULT 'Local User',
ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "RoleScreenPermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "screenLabel" TEXT NOT NULL,
    "canAccess" BOOLEAN NOT NULL DEFAULT false,
    "canView" BOOLEAN NOT NULL DEFAULT false,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RoleScreenPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterAccount" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "tag" TEXT,
    "description" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "website" TEXT,
    "taxId" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postCode" TEXT,
    "originCountry" TEXT,
    "factoryAddress" TEXT,
    "factoryCity" TEXT,
    "factoryPostCode" TEXT,
    "factoryCountry" TEXT,
    "contacts" JSONB,
    "salesperson" TEXT,
    "commercialPerson" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetail" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "bankType" TEXT NOT NULL DEFAULT 'PRIMARY',
    "bankName" TEXT NOT NULL,
    "branch" TEXT,
    "accountNo" TEXT,
    "accountTitle" TEXT,
    "address" TEXT,
    "country" TEXT,
    "city" TEXT,
    "postCode" TEXT,
    "swiftCode" TEXT,
    "iban" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoleScreenPermission_roleId_idx" ON "RoleScreenPermission"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleScreenPermission_roleId_screenLabel_key" ON "RoleScreenPermission"("roleId", "screenLabel");

-- CreateIndex
CREATE UNIQUE INDEX "MasterAccount_code_key" ON "MasterAccount"("code");

-- CreateIndex
CREATE INDEX "MasterAccount_type_idx" ON "MasterAccount"("type");

-- CreateIndex
CREATE INDEX "MasterAccount_createdBy_idx" ON "MasterAccount"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "MasterAccount_type_name_key" ON "MasterAccount"("type", "name");

-- CreateIndex
CREATE INDEX "BankDetail_accountId_idx" ON "BankDetail"("accountId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleScreenPermission" ADD CONSTRAINT "RoleScreenPermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterAccount" ADD CONSTRAINT "MasterAccount_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetail" ADD CONSTRAINT "BankDetail_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "MasterAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
