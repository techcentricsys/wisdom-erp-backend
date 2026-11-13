-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "baseRole" TEXT NOT NULL DEFAULT 'Local User',
ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "baseRole" TEXT NOT NULL DEFAULT 'Local User',
ADD COLUMN     "canCreateMaster" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "failedLogins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "managerId" TEXT;

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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleScreenPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoleScreenPermission_roleId_idx" ON "RoleScreenPermission"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleScreenPermission_roleId_screenLabel_key" ON "RoleScreenPermission"("roleId", "screenLabel");

-- AddForeignKey
ALTER TABLE "RoleScreenPermission" ADD CONSTRAINT "RoleScreenPermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
