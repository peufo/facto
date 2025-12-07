-- CreateTable
CREATE TABLE `Tool` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ToolVersion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nodeId` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `path` VARCHAR(191) NOT NULL,
    `validFrom` DATETIME(3) NULL,
    `validTo` DATETIME(3) NULL,
    `name` VARCHAR(191) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `x` INTEGER NOT NULL,
    `y` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ToolVersion_path_idx`(`path`),
    INDEX `ToolVersion_validTo_path_idx`(`validTo`, `path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ToolVersion` ADD CONSTRAINT `ToolVersion_nodeId_fkey` FOREIGN KEY (`nodeId`) REFERENCES `Tool`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ToolVersion` ADD CONSTRAINT `ToolVersion_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Tool`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
