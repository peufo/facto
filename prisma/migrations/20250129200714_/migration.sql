-- CreateTable
CREATE TABLE `ToolModel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `parentId` INTEGER NULL,
    `sizeX` INTEGER NOT NULL,
    `sizeY` INTEGER NOT NULL,
    `relatifX` INTEGER NOT NULL,
    `relatifY` INTEGER NOT NULL,
    `absoluteX` INTEGER NOT NULL,
    `absoluteY` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ToolModel` ADD CONSTRAINT `ToolModel_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `ToolModel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
