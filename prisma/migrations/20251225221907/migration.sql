/*
  Warnings:

  - You are about to drop the column `createdById` on the `State` table. All the data in the column will be lost.
  - You are about to drop the `_InputStates` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[inputId]` on the table `State` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inputId` to the `State` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `State` DROP FOREIGN KEY `State_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `_InputStates` DROP FOREIGN KEY `_InputStates_A_fkey`;

-- DropForeignKey
ALTER TABLE `_InputStates` DROP FOREIGN KEY `_InputStates_B_fkey`;

-- DropIndex
DROP INDEX `State_createdById_key` ON `State`;

-- AlterTable
ALTER TABLE `State` DROP COLUMN `createdById`,
    ADD COLUMN `inputId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_InputStates`;

-- CreateTable
CREATE TABLE `_StatesToCommit` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_StatesToCommit_AB_unique`(`A`, `B`),
    INDEX `_StatesToCommit_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `State_inputId_key` ON `State`(`inputId`);

-- AddForeignKey
ALTER TABLE `State` ADD CONSTRAINT `State_inputId_fkey` FOREIGN KEY (`inputId`) REFERENCES `Commit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StatesToCommit` ADD CONSTRAINT `_StatesToCommit_A_fkey` FOREIGN KEY (`A`) REFERENCES `Commit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_StatesToCommit` ADD CONSTRAINT `_StatesToCommit_B_fkey` FOREIGN KEY (`B`) REFERENCES `State`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
