/*
  Warnings:

  - Made the column `validFrom` on table `ToolVersion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `ToolVersion` MODIFY `validFrom` DATETIME(3) NOT NULL;
