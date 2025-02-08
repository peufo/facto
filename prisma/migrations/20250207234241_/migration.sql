/*
  Warnings:

  - You are about to drop the column `absoluteX` on the `ToolModel` table. All the data in the column will be lost.
  - You are about to drop the column `absoluteY` on the `ToolModel` table. All the data in the column will be lost.
  - You are about to drop the column `relatifX` on the `ToolModel` table. All the data in the column will be lost.
  - You are about to drop the column `relatifY` on the `ToolModel` table. All the data in the column will be lost.
  - You are about to drop the column `sizeX` on the `ToolModel` table. All the data in the column will be lost.
  - You are about to drop the column `sizeY` on the `ToolModel` table. All the data in the column will be lost.
  - Added the required column `height` to the `ToolModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `ToolModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `ToolModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `ToolModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ToolModel` DROP COLUMN `absoluteX`,
    DROP COLUMN `absoluteY`,
    DROP COLUMN `relatifX`,
    DROP COLUMN `relatifY`,
    DROP COLUMN `sizeX`,
    DROP COLUMN `sizeY`,
    ADD COLUMN `height` INTEGER NOT NULL,
    ADD COLUMN `width` INTEGER NOT NULL,
    ADD COLUMN `x` INTEGER NOT NULL,
    ADD COLUMN `y` INTEGER NOT NULL;
