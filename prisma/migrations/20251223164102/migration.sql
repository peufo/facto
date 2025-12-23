/*
  Warnings:

  - You are about to drop the `_flow` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Process` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_flow` DROP FOREIGN KEY `_flow_A_fkey`;

-- DropForeignKey
ALTER TABLE `_flow` DROP FOREIGN KEY `_flow_B_fkey`;

-- AlterTable
ALTER TABLE `Process` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_flow`;

-- CreateTable
CREATE TABLE `State` (
    `id` VARCHAR(191) NOT NULL,
    `processId` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `State_createdById_key`(`createdById`),
    INDEX `State_processId_idx`(`processId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_InputStates` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_InputStates_AB_unique`(`A`, `B`),
    INDEX `_InputStates_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FieldValueToState` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FieldValueToState_AB_unique`(`A`, `B`),
    INDEX `_FieldValueToState_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `State` ADD CONSTRAINT `State_processId_fkey` FOREIGN KEY (`processId`) REFERENCES `Process`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `State` ADD CONSTRAINT `State_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Commit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InputStates` ADD CONSTRAINT `_InputStates_A_fkey` FOREIGN KEY (`A`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_InputStates` ADD CONSTRAINT `_InputStates_B_fkey` FOREIGN KEY (`B`) REFERENCES `State`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FieldValueToState` ADD CONSTRAINT `_FieldValueToState_A_fkey` FOREIGN KEY (`A`) REFERENCES `FieldValue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FieldValueToState` ADD CONSTRAINT `_FieldValueToState_B_fkey` FOREIGN KEY (`B`) REFERENCES `State`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
