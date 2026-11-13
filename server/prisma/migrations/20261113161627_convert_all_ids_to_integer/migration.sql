/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Attendance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `AuditLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AuditLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userId` column on the `AuditLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `BankAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `BankAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `accountId` column on the `BankAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Batch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Batch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `BreakdownLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `BreakdownLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CostCenter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CostCenter` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `departmentId` column on the `CostCenter` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Delivery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Delivery` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `customerId` column on the `Delivery` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `salesOrderId` column on the `Delivery` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dispatchScheduleId` column on the `Delivery` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Department` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `DispatchSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `DispatchSchedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `vehicleId` column on the `DispatchSchedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `driverId` column on the `DispatchSchedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Driver` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Driver` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `employeeId` column on the `Driver` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `departmentId` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `FinancialTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `FinancialTransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `journalEntryId` column on the `FinancialTransaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `GoodsReceipt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `GoodsReceipt` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `receivedById` column on the `GoodsReceipt` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `GoodsReceiptItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `GoodsReceiptItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locationId` column on the `GoodsReceiptItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `batchId` column on the `GoodsReceiptItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Invoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `salesOrderId` column on the `Invoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deliveryId` column on the `Invoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serialId` on the `Item` table. All the data in the column will be lost.
  - The `id` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `categoryId` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `createdById` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `defaultUomId` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `productTypeId` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ItemCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serialId` on the `ItemCategory` table. All the data in the column will be lost.
  - The `id` column on the `ItemCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parentId` column on the `ItemCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ItemManufacturer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ItemManufacturer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ItemSupplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ItemSupplier` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `JournalEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `JournalEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `JournalLine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `JournalLine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `costCenterId` column on the `JournalLine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Machine` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Machine` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MachineOutput` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MachineOutput` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `machineId` column on the `MachineOutput` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locationId` column on the `MachineOutput` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `batchId` column on the `MachineOutput` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MaintenanceSchedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MaintenanceSchedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MaintenanceWorkOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MaintenanceWorkOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `maintenanceScheduleId` column on the `MaintenanceWorkOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Manufacturer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serialId` on the `Manufacturer` table. All the data in the column will be lost.
  - The `id` column on the `Manufacturer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `MaterialConsumption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MaterialConsumption` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locationId` column on the `MaterialConsumption` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `batchId` column on the `MaterialConsumption` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `customerId` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `supplierId` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `invoiceId` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bankAccountId` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Payroll` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Payroll` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Permission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProductType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serialId` on the `ProductType` table. All the data in the column will be lost.
  - The `id` column on the `ProductType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProductionLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProductionLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `machineId` column on the `ProductionLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProductionOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProductionOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `productionPlanId` column on the `ProductionOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `salesOrderId` column on the `ProductionOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `machineId` column on the `ProductionOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProductionPlan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProductionPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `createdById` column on the `ProductionPlan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PurchaseOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PurchaseOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `createdById` column on the `PurchaseOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PurchaseOrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PurchaseOrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PurchaseRequisition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PurchaseRequisition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `requestedById` column on the `PurchaseRequisition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `supplierId` column on the `PurchaseRequisition` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PurchaseRequisitionItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PurchaseRequisitionItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Quotation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Quotation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `QuotationItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `QuotationItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Reel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Reel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `productionOrderId` column on the `Reel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `machineId` column on the `Reel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemId` column on the `Reel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Role` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RolePermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RolePermission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RoleScreenPermission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RoleScreenPermission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SalarySlip` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SalarySlip` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `payrollId` column on the `SalarySlip` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SalesOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SalesOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `quotationId` column on the `SalesOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SalesOrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SalesOrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Shift` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Shift` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Shipment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Shipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `vehicleId` column on the `Shipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `driverId` column on the `Shipment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SparePart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SparePart` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemId` column on the `SparePart` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SparePartConsumption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SparePartConsumption` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Stock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locationId` column on the `Stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `batchId` column on the `Stock` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `StockMovement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `StockMovement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `locationId` column on the `StockMovement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `batchId` column on the `StockMovement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `goodsReceiptId` column on the `StockMovement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `productionOrderId` column on the `StockMovement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `StockTransfer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `StockTransfer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `fromLocationId` column on the `StockTransfer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `toLocationId` column on the `StockTransfer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `batchId` column on the `StockTransfer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serialId` on the `Supplier` table. All the data in the column will be lost.
  - The `id` column on the `Supplier` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SupplierInvoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SupplierInvoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `purchaseOrderId` column on the `SupplierInvoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SystemLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SystemLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UnitOfMeasure` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serialId` on the `UnitOfMeasure` table. All the data in the column will be lost.
  - The `id` column on the `UnitOfMeasure` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `companyId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `managerId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UserRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserRole` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Vehicle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Warehouse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Warehouse` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `WarehouseLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `WarehouseLocation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `WasteEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `WasteEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `productionOrderId` column on the `WasteEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `itemId` column on the `WasteEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `machineId` column on the `WasteEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `employeeId` on the `Attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `Batch` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `machineId` on the `BreakdownLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `bankAccountId` on the `FinancialTransaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `purchaseOrderId` on the `GoodsReceipt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `goodsReceiptId` on the `GoodsReceiptItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `GoodsReceiptItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `warehouseId` on the `GoodsReceiptItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customerId` on the `Invoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `ItemManufacturer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `manufacturerId` on the `ItemManufacturer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `ItemSupplier` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `supplierId` on the `ItemSupplier` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `journalEntryId` on the `JournalLine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `accountId` on the `JournalLine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productionOrderId` on the `MachineOutput` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `MachineOutput` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `warehouseId` on the `MachineOutput` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `machineId` on the `MaintenanceSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `machineId` on the `MaintenanceWorkOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productionOrderId` on the `MaterialConsumption` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `MaterialConsumption` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `warehouseId` on the `MaterialConsumption` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productionOrderId` on the `ProductionLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `ProductionOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `supplierId` on the `PurchaseOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `purchaseOrderId` on the `PurchaseOrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `PurchaseOrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `purchaseRequisitionId` on the `PurchaseRequisitionItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `PurchaseRequisitionItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customerId` on the `Quotation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `quotationId` on the `QuotationItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `QuotationItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `RolePermission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `permissionId` on the `RolePermission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `RoleScreenPermission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `employeeId` on the `SalarySlip` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `customerId` on the `SalesOrder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `salesOrderId` on the `SalesOrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `SalesOrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `deliveryId` on the `Shipment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `maintenanceWorkOrderId` on the `SparePartConsumption` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sparePartId` on the `SparePartConsumption` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `Stock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `warehouseId` on the `Stock` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `StockMovement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `warehouseId` on the `StockMovement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fromWarehouseId` on the `StockTransfer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `toWarehouseId` on the `StockTransfer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `StockTransfer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `supplierId` on the `SupplierInvoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `UserRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `UserRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `warehouseId` on the `WarehouseLocation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_itemId_fkey";

-- DropForeignKey
ALTER TABLE "BreakdownLog" DROP CONSTRAINT "BreakdownLog_machineId_fkey";

-- DropForeignKey
ALTER TABLE "CostCenter" DROP CONSTRAINT "CostCenter_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_dispatchScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_salesOrderId_fkey";

-- DropForeignKey
ALTER TABLE "DispatchSchedule" DROP CONSTRAINT "DispatchSchedule_driverId_fkey";

-- DropForeignKey
ALTER TABLE "DispatchSchedule" DROP CONSTRAINT "DispatchSchedule_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "FinancialTransaction" DROP CONSTRAINT "FinancialTransaction_bankAccountId_fkey";

-- DropForeignKey
ALTER TABLE "FinancialTransaction" DROP CONSTRAINT "FinancialTransaction_journalEntryId_fkey";

-- DropForeignKey
ALTER TABLE "GoodsReceipt" DROP CONSTRAINT "GoodsReceipt_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "GoodsReceipt" DROP CONSTRAINT "GoodsReceipt_receivedById_fkey";

-- DropForeignKey
ALTER TABLE "GoodsReceiptItem" DROP CONSTRAINT "GoodsReceiptItem_batchId_fkey";

-- DropForeignKey
ALTER TABLE "GoodsReceiptItem" DROP CONSTRAINT "GoodsReceiptItem_goodsReceiptId_fkey";

-- DropForeignKey
ALTER TABLE "GoodsReceiptItem" DROP CONSTRAINT "GoodsReceiptItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "GoodsReceiptItem" DROP CONSTRAINT "GoodsReceiptItem_locationId_fkey";

-- DropForeignKey
ALTER TABLE "GoodsReceiptItem" DROP CONSTRAINT "GoodsReceiptItem_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_deliveryId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_salesOrderId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_defaultUomId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_productTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ItemCategory" DROP CONSTRAINT "ItemCategory_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ItemManufacturer" DROP CONSTRAINT "ItemManufacturer_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemManufacturer" DROP CONSTRAINT "ItemManufacturer_manufacturerId_fkey";

-- DropForeignKey
ALTER TABLE "ItemSupplier" DROP CONSTRAINT "ItemSupplier_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemSupplier" DROP CONSTRAINT "ItemSupplier_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "JournalLine" DROP CONSTRAINT "JournalLine_accountId_fkey";

-- DropForeignKey
ALTER TABLE "JournalLine" DROP CONSTRAINT "JournalLine_costCenterId_fkey";

-- DropForeignKey
ALTER TABLE "JournalLine" DROP CONSTRAINT "JournalLine_journalEntryId_fkey";

-- DropForeignKey
ALTER TABLE "MachineOutput" DROP CONSTRAINT "MachineOutput_batchId_fkey";

-- DropForeignKey
ALTER TABLE "MachineOutput" DROP CONSTRAINT "MachineOutput_itemId_fkey";

-- DropForeignKey
ALTER TABLE "MachineOutput" DROP CONSTRAINT "MachineOutput_locationId_fkey";

-- DropForeignKey
ALTER TABLE "MachineOutput" DROP CONSTRAINT "MachineOutput_machineId_fkey";

-- DropForeignKey
ALTER TABLE "MachineOutput" DROP CONSTRAINT "MachineOutput_productionOrderId_fkey";

-- DropForeignKey
ALTER TABLE "MachineOutput" DROP CONSTRAINT "MachineOutput_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceSchedule" DROP CONSTRAINT "MaintenanceSchedule_machineId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceWorkOrder" DROP CONSTRAINT "MaintenanceWorkOrder_machineId_fkey";

-- DropForeignKey
ALTER TABLE "MaintenanceWorkOrder" DROP CONSTRAINT "MaintenanceWorkOrder_maintenanceScheduleId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialConsumption" DROP CONSTRAINT "MaterialConsumption_batchId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialConsumption" DROP CONSTRAINT "MaterialConsumption_itemId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialConsumption" DROP CONSTRAINT "MaterialConsumption_locationId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialConsumption" DROP CONSTRAINT "MaterialConsumption_productionOrderId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialConsumption" DROP CONSTRAINT "MaterialConsumption_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bankAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionLog" DROP CONSTRAINT "ProductionLog_machineId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionLog" DROP CONSTRAINT "ProductionLog_productionOrderId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionOrder" DROP CONSTRAINT "ProductionOrder_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionOrder" DROP CONSTRAINT "ProductionOrder_machineId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionOrder" DROP CONSTRAINT "ProductionOrder_productionPlanId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionOrder" DROP CONSTRAINT "ProductionOrder_salesOrderId_fkey";

-- DropForeignKey
ALTER TABLE "ProductionPlan" DROP CONSTRAINT "ProductionPlan_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseRequisition" DROP CONSTRAINT "PurchaseRequisition_requestedById_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseRequisition" DROP CONSTRAINT "PurchaseRequisition_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseRequisitionItem" DROP CONSTRAINT "PurchaseRequisitionItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseRequisitionItem" DROP CONSTRAINT "PurchaseRequisitionItem_purchaseRequisitionId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_customerId_fkey";

-- DropForeignKey
ALTER TABLE "QuotationItem" DROP CONSTRAINT "QuotationItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "QuotationItem" DROP CONSTRAINT "QuotationItem_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "Reel" DROP CONSTRAINT "Reel_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Reel" DROP CONSTRAINT "Reel_machineId_fkey";

-- DropForeignKey
ALTER TABLE "Reel" DROP CONSTRAINT "Reel_productionOrderId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "RoleScreenPermission" DROP CONSTRAINT "RoleScreenPermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "SalarySlip" DROP CONSTRAINT "SalarySlip_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "SalarySlip" DROP CONSTRAINT "SalarySlip_payrollId_fkey";

-- DropForeignKey
ALTER TABLE "SalesOrder" DROP CONSTRAINT "SalesOrder_customerId_fkey";

-- DropForeignKey
ALTER TABLE "SalesOrder" DROP CONSTRAINT "SalesOrder_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "SalesOrderItem" DROP CONSTRAINT "SalesOrderItem_itemId_fkey";

-- DropForeignKey
ALTER TABLE "SalesOrderItem" DROP CONSTRAINT "SalesOrderItem_salesOrderId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_deliveryId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "SparePart" DROP CONSTRAINT "SparePart_itemId_fkey";

-- DropForeignKey
ALTER TABLE "SparePartConsumption" DROP CONSTRAINT "SparePartConsumption_maintenanceWorkOrderId_fkey";

-- DropForeignKey
ALTER TABLE "SparePartConsumption" DROP CONSTRAINT "SparePartConsumption_sparePartId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_batchId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_batchId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_goodsReceiptId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_itemId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_locationId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_productionOrderId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "StockTransfer" DROP CONSTRAINT "StockTransfer_batchId_fkey";

-- DropForeignKey
ALTER TABLE "StockTransfer" DROP CONSTRAINT "StockTransfer_fromLocationId_fkey";

-- DropForeignKey
ALTER TABLE "StockTransfer" DROP CONSTRAINT "StockTransfer_fromWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "StockTransfer" DROP CONSTRAINT "StockTransfer_itemId_fkey";

-- DropForeignKey
ALTER TABLE "StockTransfer" DROP CONSTRAINT "StockTransfer_toLocationId_fkey";

-- DropForeignKey
ALTER TABLE "StockTransfer" DROP CONSTRAINT "StockTransfer_toWarehouseId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierInvoice" DROP CONSTRAINT "SupplierInvoice_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "SupplierInvoice" DROP CONSTRAINT "SupplierInvoice_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseLocation" DROP CONSTRAINT "WarehouseLocation_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "WasteEntry" DROP CONSTRAINT "WasteEntry_itemId_fkey";

-- DropForeignKey
ALTER TABLE "WasteEntry" DROP CONSTRAINT "WasteEntry_machineId_fkey";

-- DropForeignKey
ALTER TABLE "WasteEntry" DROP CONSTRAINT "WasteEntry_productionOrderId_fkey";

-- DropIndex
DROP INDEX "Item_serialId_key";

-- DropIndex
DROP INDEX "ItemCategory_serialId_key";

-- DropIndex
DROP INDEX "Manufacturer_serialId_key";

-- DropIndex
DROP INDEX "ProductType_serialId_key";

-- DropIndex
DROP INDEX "Supplier_serialId_key";

-- DropIndex
DROP INDEX "UnitOfMeasure_serialId_key";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "employeeId",
ADD COLUMN     "employeeId" INTEGER NOT NULL,
ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER,
ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "accountId",
ADD COLUMN     "accountId" INTEGER,
ADD CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD CONSTRAINT "Batch_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BreakdownLog" DROP CONSTRAINT "BreakdownLog_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "machineId",
ADD COLUMN     "machineId" INTEGER NOT NULL,
ADD CONSTRAINT "BreakdownLog_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Company" DROP CONSTRAINT "Company_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Company_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CostCenter" DROP CONSTRAINT "CostCenter_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" INTEGER,
ADD CONSTRAINT "CostCenter_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER,
DROP COLUMN "salesOrderId",
ADD COLUMN     "salesOrderId" INTEGER,
DROP COLUMN "dispatchScheduleId",
ADD COLUMN     "dispatchScheduleId" INTEGER,
ADD CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "DispatchSchedule" DROP CONSTRAINT "DispatchSchedule_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vehicleId",
ADD COLUMN     "vehicleId" INTEGER,
DROP COLUMN "driverId",
ADD COLUMN     "driverId" INTEGER,
ADD CONSTRAINT "DispatchSchedule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "employeeId",
ADD COLUMN     "employeeId" INTEGER,
ADD CONSTRAINT "Driver_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "departmentId",
ADD COLUMN     "departmentId" INTEGER,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FinancialTransaction" DROP CONSTRAINT "FinancialTransaction_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "bankAccountId",
ADD COLUMN     "bankAccountId" INTEGER NOT NULL,
DROP COLUMN "journalEntryId",
ADD COLUMN     "journalEntryId" INTEGER,
ADD CONSTRAINT "FinancialTransaction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GoodsReceipt" DROP CONSTRAINT "GoodsReceipt_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "purchaseOrderId",
ADD COLUMN     "purchaseOrderId" INTEGER NOT NULL,
DROP COLUMN "receivedById",
ADD COLUMN     "receivedById" INTEGER,
ADD CONSTRAINT "GoodsReceipt_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GoodsReceiptItem" DROP CONSTRAINT "GoodsReceiptItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "goodsReceiptId",
ADD COLUMN     "goodsReceiptId" INTEGER NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
DROP COLUMN "warehouseId",
ADD COLUMN     "warehouseId" INTEGER NOT NULL,
DROP COLUMN "locationId",
ADD COLUMN     "locationId" INTEGER,
DROP COLUMN "batchId",
ADD COLUMN     "batchId" INTEGER,
ADD CONSTRAINT "GoodsReceiptItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
DROP COLUMN "salesOrderId",
ADD COLUMN     "salesOrderId" INTEGER,
DROP COLUMN "deliveryId",
ADD COLUMN     "deliveryId" INTEGER,
ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
DROP COLUMN "serialId",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER,
DROP COLUMN "createdById",
ADD COLUMN     "createdById" INTEGER,
DROP COLUMN "defaultUomId",
ADD COLUMN     "defaultUomId" INTEGER,
DROP COLUMN "productTypeId",
ADD COLUMN     "productTypeId" INTEGER,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ItemCategory" DROP CONSTRAINT "ItemCategory_pkey",
DROP COLUMN "serialId",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "parentId",
ADD COLUMN     "parentId" INTEGER,
ADD CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ItemManufacturer" DROP CONSTRAINT "ItemManufacturer_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
DROP COLUMN "manufacturerId",
ADD COLUMN     "manufacturerId" INTEGER NOT NULL,
ADD CONSTRAINT "ItemManufacturer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ItemSupplier" DROP CONSTRAINT "ItemSupplier_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
DROP COLUMN "supplierId",
ADD COLUMN     "supplierId" INTEGER NOT NULL,
ADD CONSTRAINT "ItemSupplier_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "JournalLine" DROP CONSTRAINT "JournalLine_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "journalEntryId",
ADD COLUMN     "journalEntryId" INTEGER NOT NULL,
DROP COLUMN "accountId",
ADD COLUMN     "accountId" INTEGER NOT NULL,
DROP COLUMN "costCenterId",
ADD COLUMN     "costCenterId" INTEGER,
ADD CONSTRAINT "JournalLine_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Machine_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MachineOutput" DROP CONSTRAINT "MachineOutput_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productionOrderId",
ADD COLUMN     "productionOrderId" INTEGER NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
DROP COLUMN "machineId",
ADD COLUMN     "machineId" INTEGER,
DROP COLUMN "warehouseId",
ADD COLUMN     "warehouseId" INTEGER NOT NULL,
DROP COLUMN "locationId",
ADD COLUMN     "locationId" INTEGER,
DROP COLUMN "batchId",
ADD COLUMN     "batchId" INTEGER,
ADD CONSTRAINT "MachineOutput_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MaintenanceSchedule" DROP CONSTRAINT "MaintenanceSchedule_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "machineId",
ADD COLUMN     "machineId" INTEGER NOT NULL,
ADD CONSTRAINT "MaintenanceSchedule_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MaintenanceWorkOrder" DROP CONSTRAINT "MaintenanceWorkOrder_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "machineId",
ADD COLUMN     "machineId" INTEGER NOT NULL,
DROP COLUMN "maintenanceScheduleId",
ADD COLUMN     "maintenanceScheduleId" INTEGER,
ADD CONSTRAINT "MaintenanceWorkOrder_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Manufacturer" DROP CONSTRAINT "Manufacturer_pkey",
DROP COLUMN "serialId",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MaterialConsumption" DROP CONSTRAINT "MaterialConsumption_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productionOrderId",
ADD COLUMN     "productionOrderId" INTEGER NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
DROP COLUMN "warehouseId",
ADD COLUMN     "warehouseId" INTEGER NOT NULL,
DROP COLUMN "locationId",
ADD COLUMN     "locationId" INTEGER,
DROP COLUMN "batchId",
ADD COLUMN     "batchId" INTEGER,
ADD CONSTRAINT "MaterialConsumption_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER,
DROP COLUMN "supplierId",
ADD COLUMN     "supplierId" INTEGER,
DROP COLUMN "invoiceId",
ADD COLUMN     "invoiceId" INTEGER,
DROP COLUMN "bankAccountId",
ADD COLUMN     "bankAccountId" INTEGER,
ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Permission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductType" DROP CONSTRAINT "ProductType_pkey",
DROP COLUMN "serialId",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductionLog" DROP CONSTRAINT "ProductionLog_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productionOrderId",
ADD COLUMN     "productionOrderId" INTEGER NOT NULL,
DROP COLUMN "machineId",
ADD COLUMN     "machineId" INTEGER,
ADD CONSTRAINT "ProductionLog_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductionOrder" DROP CONSTRAINT "ProductionOrder_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productionPlanId",
ADD COLUMN     "productionPlanId" INTEGER,
DROP COLUMN "salesOrderId",
ADD COLUMN     "salesOrderId" INTEGER,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
DROP COLUMN "machineId",
ADD COLUMN     "machineId" INTEGER,
ADD CONSTRAINT "ProductionOrder_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductionPlan" DROP CONSTRAINT "ProductionPlan_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "createdById",
ADD COLUMN     "createdById" INTEGER,
ADD CONSTRAINT "ProductionPlan_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PurchaseOrder" DROP CONSTRAINT "PurchaseOrder_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "supplierId",
ADD COLUMN     "supplierId" INTEGER NOT NULL,
DROP COLUMN "createdById",
ADD COLUMN     "createdById" INTEGER,
ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PurchaseOrderItem" DROP CONSTRAINT "PurchaseOrderItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "purchaseOrderId",
ADD COLUMN     "purchaseOrderId" INTEGER NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD CONSTRAINT "PurchaseOrderItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PurchaseRequisition" DROP CONSTRAINT "PurchaseRequisition_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "requestedById",
ADD COLUMN     "requestedById" INTEGER,
DROP COLUMN "supplierId",
ADD COLUMN     "supplierId" INTEGER,
ADD CONSTRAINT "PurchaseRequisition_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PurchaseRequisitionItem" DROP CONSTRAINT "PurchaseRequisitionItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "purchaseRequisitionId",
ADD COLUMN     "purchaseRequisitionId" INTEGER NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD CONSTRAINT "PurchaseRequisitionItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "QuotationItem" DROP CONSTRAINT "QuotationItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "quotationId",
ADD COLUMN     "quotationId" INTEGER NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD CONSTRAINT "QuotationItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Reel" DROP CONSTRAINT "Reel_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productionOrderId",
ADD COLUMN     "productionOrderId" INTEGER,
DROP COLUMN "machineId",
ADD COLUMN     "machineId" INTEGER,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER,
ADD CONSTRAINT "Reel_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Role" DROP CONSTRAINT "Role_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER NOT NULL,
DROP COLUMN "permissionId",
ADD COLUMN     "permissionId" INTEGER NOT NULL,
ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RoleScreenPermission" DROP CONSTRAINT "RoleScreenPermission_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER NOT NULL,
ADD CONSTRAINT "RoleScreenPermission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SalarySlip" DROP CONSTRAINT "SalarySlip_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "payrollId",
ADD COLUMN     "payrollId" INTEGER,
DROP COLUMN "employeeId",
ADD COLUMN     "employeeId" INTEGER NOT NULL,
ADD CONSTRAINT "SalarySlip_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SalesOrder" DROP CONSTRAINT "SalesOrder_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
DROP COLUMN "quotationId",
ADD COLUMN     "quotationId" INTEGER,
ADD CONSTRAINT "SalesOrder_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SalesOrderItem" DROP CONSTRAINT "SalesOrderItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "salesOrderId",
ADD COLUMN     "salesOrderId" INTEGER NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD CONSTRAINT "SalesOrderItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Shift_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "deliveryId",
ADD COLUMN     "deliveryId" INTEGER NOT NULL,
DROP COLUMN "vehicleId",
ADD COLUMN     "vehicleId" INTEGER,
DROP COLUMN "driverId",
ADD COLUMN     "driverId" INTEGER,
ADD CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SparePart" DROP CONSTRAINT "SparePart_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER,
ADD CONSTRAINT "SparePart_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SparePartConsumption" DROP CONSTRAINT "SparePartConsumption_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "maintenanceWorkOrderId",
ADD COLUMN     "maintenanceWorkOrderId" INTEGER NOT NULL,
DROP COLUMN "sparePartId",
ADD COLUMN     "sparePartId" INTEGER NOT NULL,
ADD CONSTRAINT "SparePartConsumption_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
DROP COLUMN "warehouseId",
ADD COLUMN     "warehouseId" INTEGER NOT NULL,
DROP COLUMN "locationId",
ADD COLUMN     "locationId" INTEGER,
DROP COLUMN "batchId",
ADD COLUMN     "batchId" INTEGER,
ADD CONSTRAINT "Stock_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
DROP COLUMN "warehouseId",
ADD COLUMN     "warehouseId" INTEGER NOT NULL,
DROP COLUMN "locationId",
ADD COLUMN     "locationId" INTEGER,
DROP COLUMN "batchId",
ADD COLUMN     "batchId" INTEGER,
DROP COLUMN "goodsReceiptId",
ADD COLUMN     "goodsReceiptId" INTEGER,
DROP COLUMN "productionOrderId",
ADD COLUMN     "productionOrderId" INTEGER,
ADD CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StockTransfer" DROP CONSTRAINT "StockTransfer_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "fromWarehouseId",
ADD COLUMN     "fromWarehouseId" INTEGER NOT NULL,
DROP COLUMN "fromLocationId",
ADD COLUMN     "fromLocationId" INTEGER,
DROP COLUMN "toWarehouseId",
ADD COLUMN     "toWarehouseId" INTEGER NOT NULL,
DROP COLUMN "toLocationId",
ADD COLUMN     "toLocationId" INTEGER,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER NOT NULL,
DROP COLUMN "batchId",
ADD COLUMN     "batchId" INTEGER,
ADD CONSTRAINT "StockTransfer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_pkey",
DROP COLUMN "serialId",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SupplierInvoice" DROP CONSTRAINT "SupplierInvoice_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "supplierId",
ADD COLUMN     "supplierId" INTEGER NOT NULL,
DROP COLUMN "purchaseOrderId",
ADD COLUMN     "purchaseOrderId" INTEGER,
ADD CONSTRAINT "SupplierInvoice_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SystemLog" DROP CONSTRAINT "SystemLog_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UnitOfMeasure" DROP CONSTRAINT "UnitOfMeasure_pkey",
DROP COLUMN "serialId",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UnitOfMeasure_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "companyId",
ADD COLUMN     "companyId" INTEGER,
DROP COLUMN "managerId",
ADD COLUMN     "managerId" INTEGER,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "roleId",
ADD COLUMN     "roleId" INTEGER NOT NULL,
ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Warehouse" DROP CONSTRAINT "Warehouse_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "WarehouseLocation" DROP CONSTRAINT "WarehouseLocation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "warehouseId",
ADD COLUMN     "warehouseId" INTEGER NOT NULL,
ADD CONSTRAINT "WarehouseLocation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "WasteEntry" DROP CONSTRAINT "WasteEntry_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "productionOrderId",
ADD COLUMN     "productionOrderId" INTEGER,
DROP COLUMN "itemId",
ADD COLUMN     "itemId" INTEGER,
DROP COLUMN "machineId",
ADD COLUMN     "machineId" INTEGER,
ADD CONSTRAINT "WasteEntry_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Attendance_employeeId_idx" ON "Attendance"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_employeeId_date_key" ON "Attendance"("employeeId", "date");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "Batch_itemId_idx" ON "Batch"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_itemId_batchNo_key" ON "Batch"("itemId", "batchNo");

-- CreateIndex
CREATE INDEX "BreakdownLog_machineId_idx" ON "BreakdownLog"("machineId");

-- CreateIndex
CREATE INDEX "Delivery_customerId_idx" ON "Delivery"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_employeeId_key" ON "Driver"("employeeId");

-- CreateIndex
CREATE INDEX "FinancialTransaction_bankAccountId_idx" ON "FinancialTransaction"("bankAccountId");

-- CreateIndex
CREATE INDEX "GoodsReceipt_purchaseOrderId_idx" ON "GoodsReceipt"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "GoodsReceiptItem_goodsReceiptId_idx" ON "GoodsReceiptItem"("goodsReceiptId");

-- CreateIndex
CREATE INDEX "GoodsReceiptItem_itemId_idx" ON "GoodsReceiptItem"("itemId");

-- CreateIndex
CREATE INDEX "GoodsReceiptItem_warehouseId_idx" ON "GoodsReceiptItem"("warehouseId");

-- CreateIndex
CREATE INDEX "GoodsReceiptItem_batchId_idx" ON "GoodsReceiptItem"("batchId");

-- CreateIndex
CREATE INDEX "Invoice_customerId_idx" ON "Invoice"("customerId");

-- CreateIndex
CREATE INDEX "Item_productTypeId_idx" ON "Item"("productTypeId");

-- CreateIndex
CREATE INDEX "Item_defaultUomId_idx" ON "Item"("defaultUomId");

-- CreateIndex
CREATE INDEX "Item_createdById_idx" ON "Item"("createdById");

-- CreateIndex
CREATE INDEX "ItemManufacturer_itemId_idx" ON "ItemManufacturer"("itemId");

-- CreateIndex
CREATE INDEX "ItemManufacturer_manufacturerId_idx" ON "ItemManufacturer"("manufacturerId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemManufacturer_itemId_manufacturerId_key" ON "ItemManufacturer"("itemId", "manufacturerId");

-- CreateIndex
CREATE INDEX "ItemSupplier_itemId_idx" ON "ItemSupplier"("itemId");

-- CreateIndex
CREATE INDEX "ItemSupplier_supplierId_idx" ON "ItemSupplier"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemSupplier_itemId_supplierId_key" ON "ItemSupplier"("itemId", "supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemSupplier_supplierId_supplierProductCode_key" ON "ItemSupplier"("supplierId", "supplierProductCode");

-- CreateIndex
CREATE INDEX "JournalLine_journalEntryId_idx" ON "JournalLine"("journalEntryId");

-- CreateIndex
CREATE INDEX "JournalLine_accountId_idx" ON "JournalLine"("accountId");

-- CreateIndex
CREATE INDEX "MachineOutput_productionOrderId_idx" ON "MachineOutput"("productionOrderId");

-- CreateIndex
CREATE INDEX "MachineOutput_itemId_idx" ON "MachineOutput"("itemId");

-- CreateIndex
CREATE INDEX "MaintenanceSchedule_machineId_idx" ON "MaintenanceSchedule"("machineId");

-- CreateIndex
CREATE INDEX "MaintenanceWorkOrder_machineId_idx" ON "MaintenanceWorkOrder"("machineId");

-- CreateIndex
CREATE INDEX "MaterialConsumption_productionOrderId_idx" ON "MaterialConsumption"("productionOrderId");

-- CreateIndex
CREATE INDEX "MaterialConsumption_itemId_idx" ON "MaterialConsumption"("itemId");

-- CreateIndex
CREATE INDEX "Payment_customerId_idx" ON "Payment"("customerId");

-- CreateIndex
CREATE INDEX "Payment_supplierId_idx" ON "Payment"("supplierId");

-- CreateIndex
CREATE INDEX "ProductionLog_productionOrderId_idx" ON "ProductionLog"("productionOrderId");

-- CreateIndex
CREATE INDEX "ProductionLog_machineId_idx" ON "ProductionLog"("machineId");

-- CreateIndex
CREATE INDEX "ProductionOrder_itemId_idx" ON "ProductionOrder"("itemId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_supplierId_idx" ON "PurchaseOrder"("supplierId");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_purchaseOrderId_idx" ON "PurchaseOrderItem"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "PurchaseOrderItem_itemId_idx" ON "PurchaseOrderItem"("itemId");

-- CreateIndex
CREATE INDEX "PurchaseRequisition_supplierId_idx" ON "PurchaseRequisition"("supplierId");

-- CreateIndex
CREATE INDEX "PurchaseRequisition_requestedById_idx" ON "PurchaseRequisition"("requestedById");

-- CreateIndex
CREATE INDEX "PurchaseRequisitionItem_purchaseRequisitionId_idx" ON "PurchaseRequisitionItem"("purchaseRequisitionId");

-- CreateIndex
CREATE INDEX "PurchaseRequisitionItem_itemId_idx" ON "PurchaseRequisitionItem"("itemId");

-- CreateIndex
CREATE INDEX "Quotation_customerId_idx" ON "Quotation"("customerId");

-- CreateIndex
CREATE INDEX "QuotationItem_quotationId_idx" ON "QuotationItem"("quotationId");

-- CreateIndex
CREATE INDEX "QuotationItem_itemId_idx" ON "QuotationItem"("itemId");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "RoleScreenPermission_roleId_idx" ON "RoleScreenPermission"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleScreenPermission_roleId_screenLabel_key" ON "RoleScreenPermission"("roleId", "screenLabel");

-- CreateIndex
CREATE INDEX "SalarySlip_employeeId_idx" ON "SalarySlip"("employeeId");

-- CreateIndex
CREATE INDEX "SalesOrder_customerId_idx" ON "SalesOrder"("customerId");

-- CreateIndex
CREATE INDEX "SalesOrderItem_salesOrderId_idx" ON "SalesOrderItem"("salesOrderId");

-- CreateIndex
CREATE INDEX "SalesOrderItem_itemId_idx" ON "SalesOrderItem"("itemId");

-- CreateIndex
CREATE INDEX "Shipment_deliveryId_idx" ON "Shipment"("deliveryId");

-- CreateIndex
CREATE INDEX "SparePartConsumption_maintenanceWorkOrderId_idx" ON "SparePartConsumption"("maintenanceWorkOrderId");

-- CreateIndex
CREATE INDEX "SparePartConsumption_sparePartId_idx" ON "SparePartConsumption"("sparePartId");

-- CreateIndex
CREATE INDEX "Stock_itemId_idx" ON "Stock"("itemId");

-- CreateIndex
CREATE INDEX "Stock_warehouseId_idx" ON "Stock"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_itemId_warehouseId_locationId_batchId_key" ON "Stock"("itemId", "warehouseId", "locationId", "batchId");

-- CreateIndex
CREATE INDEX "StockMovement_itemId_idx" ON "StockMovement"("itemId");

-- CreateIndex
CREATE INDEX "StockMovement_warehouseId_idx" ON "StockMovement"("warehouseId");

-- CreateIndex
CREATE INDEX "StockTransfer_fromWarehouseId_idx" ON "StockTransfer"("fromWarehouseId");

-- CreateIndex
CREATE INDEX "StockTransfer_toWarehouseId_idx" ON "StockTransfer"("toWarehouseId");

-- CreateIndex
CREATE INDEX "StockTransfer_itemId_idx" ON "StockTransfer"("itemId");

-- CreateIndex
CREATE INDEX "SupplierInvoice_supplierId_idx" ON "SupplierInvoice"("supplierId");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE INDEX "WarehouseLocation_warehouseId_idx" ON "WarehouseLocation"("warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseLocation_warehouseId_code_key" ON "WarehouseLocation"("warehouseId", "code");

-- CreateIndex
CREATE INDEX "WasteEntry_productionOrderId_idx" ON "WasteEntry"("productionOrderId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemSupplier" ADD CONSTRAINT "ItemSupplier_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemSupplier" ADD CONSTRAINT "ItemSupplier_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemManufacturer" ADD CONSTRAINT "ItemManufacturer_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemManufacturer" ADD CONSTRAINT "ItemManufacturer_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisition" ADD CONSTRAINT "PurchaseRequisition_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisition" ADD CONSTRAINT "PurchaseRequisition_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisitionItem" ADD CONSTRAINT "PurchaseRequisitionItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseRequisitionItem" ADD CONSTRAINT "PurchaseRequisitionItem_purchaseRequisitionId_fkey" FOREIGN KEY ("purchaseRequisitionId") REFERENCES "PurchaseRequisition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderItem" ADD CONSTRAINT "PurchaseOrderItem_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptItem" ADD CONSTRAINT "GoodsReceiptItem_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptItem" ADD CONSTRAINT "GoodsReceiptItem_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "GoodsReceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptItem" ADD CONSTRAINT "GoodsReceiptItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptItem" ADD CONSTRAINT "GoodsReceiptItem_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "WarehouseLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptItem" ADD CONSTRAINT "GoodsReceiptItem_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoice" ADD CONSTRAINT "SupplierInvoice_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierInvoice" ADD CONSTRAINT "SupplierInvoice_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCategory" ADD CONSTRAINT "ItemCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_defaultUomId_fkey" FOREIGN KEY ("defaultUomId") REFERENCES "UnitOfMeasure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarehouseLocation" ADD CONSTRAINT "WarehouseLocation_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "WarehouseLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_goodsReceiptId_fkey" FOREIGN KEY ("goodsReceiptId") REFERENCES "GoodsReceipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "WarehouseLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfer" ADD CONSTRAINT "StockTransfer_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfer" ADD CONSTRAINT "StockTransfer_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES "WarehouseLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfer" ADD CONSTRAINT "StockTransfer_fromWarehouseId_fkey" FOREIGN KEY ("fromWarehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfer" ADD CONSTRAINT "StockTransfer_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfer" ADD CONSTRAINT "StockTransfer_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES "WarehouseLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransfer" ADD CONSTRAINT "StockTransfer_toWarehouseId_fkey" FOREIGN KEY ("toWarehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionPlan" ADD CONSTRAINT "ProductionPlan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_productionPlanId_fkey" FOREIGN KEY ("productionPlanId") REFERENCES "ProductionPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionOrder" ADD CONSTRAINT "ProductionOrder_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionLog" ADD CONSTRAINT "ProductionLog_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionLog" ADD CONSTRAINT "ProductionLog_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialConsumption" ADD CONSTRAINT "MaterialConsumption_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialConsumption" ADD CONSTRAINT "MaterialConsumption_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialConsumption" ADD CONSTRAINT "MaterialConsumption_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "WarehouseLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialConsumption" ADD CONSTRAINT "MaterialConsumption_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialConsumption" ADD CONSTRAINT "MaterialConsumption_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineOutput" ADD CONSTRAINT "MachineOutput_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineOutput" ADD CONSTRAINT "MachineOutput_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineOutput" ADD CONSTRAINT "MachineOutput_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "WarehouseLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineOutput" ADD CONSTRAINT "MachineOutput_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineOutput" ADD CONSTRAINT "MachineOutput_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineOutput" ADD CONSTRAINT "MachineOutput_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteEntry" ADD CONSTRAINT "WasteEntry_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteEntry" ADD CONSTRAINT "WasteEntry_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteEntry" ADD CONSTRAINT "WasteEntry_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reel" ADD CONSTRAINT "Reel_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reel" ADD CONSTRAINT "Reel_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reel" ADD CONSTRAINT "Reel_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "ProductionOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrder" ADD CONSTRAINT "SalesOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrder" ADD CONSTRAINT "SalesOrder_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrderItem" ADD CONSTRAINT "SalesOrderItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrderItem" ADD CONSTRAINT "SalesOrderItem_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_dispatchScheduleId_fkey" FOREIGN KEY ("dispatchScheduleId") REFERENCES "DispatchSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_salesOrderId_fkey" FOREIGN KEY ("salesOrderId") REFERENCES "SalesOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchSchedule" ADD CONSTRAINT "DispatchSchedule_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispatchSchedule" ADD CONSTRAINT "DispatchSchedule_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalarySlip" ADD CONSTRAINT "SalarySlip_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalarySlip" ADD CONSTRAINT "SalarySlip_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCenter" ADD CONSTRAINT "CostCenter_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "CostCenter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceSchedule" ADD CONSTRAINT "MaintenanceSchedule_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceWorkOrder" ADD CONSTRAINT "MaintenanceWorkOrder_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceWorkOrder" ADD CONSTRAINT "MaintenanceWorkOrder_maintenanceScheduleId_fkey" FOREIGN KEY ("maintenanceScheduleId") REFERENCES "MaintenanceSchedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakdownLog" ADD CONSTRAINT "BreakdownLog_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparePart" ADD CONSTRAINT "SparePart_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparePartConsumption" ADD CONSTRAINT "SparePartConsumption_maintenanceWorkOrderId_fkey" FOREIGN KEY ("maintenanceWorkOrderId") REFERENCES "MaintenanceWorkOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparePartConsumption" ADD CONSTRAINT "SparePartConsumption_sparePartId_fkey" FOREIGN KEY ("sparePartId") REFERENCES "SparePart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleScreenPermission" ADD CONSTRAINT "RoleScreenPermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
