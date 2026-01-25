-- CreateTable
CREATE TABLE `Process` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Commit` (
    `id` VARCHAR(191) NOT NULL,
    `changes` JSON NOT NULL,
    `snapshot` JSON NULL,
    `processId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Commit_processId_idx`(`processId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Connection` (
    `id` VARCHAR(191) NOT NULL,
    `attributeKey` VARCHAR(191) NOT NULL,
    `fromId` VARCHAR(191) NOT NULL,
    `toId` VARCHAR(191) NOT NULL,

    INDEX `Connection_fromId_attributeKey_idx`(`fromId`, `attributeKey`),
    INDEX `Connection_toId_attributeKey_idx`(`toId`, `attributeKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attribute` (
    `key` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NULL,
    `type` ENUM('LENGTH', 'MASS', 'TIME', 'TEMPERATURE', 'PRESSURE', 'SPEED', 'CURRENCY', 'COUNT', 'CUSTOM', 'DEPENDENCY', 'REFERENCE') NOT NULL DEFAULT 'CUSTOM',
    `unit` VARCHAR(191) NULL,
    `options` JSON NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Commit` ADD CONSTRAINT `Commit_processId_fkey` FOREIGN KEY (`processId`) REFERENCES `Process`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Connection` ADD CONSTRAINT `Connection_attributeKey_fkey` FOREIGN KEY (`attributeKey`) REFERENCES `Attribute`(`key`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Connection` ADD CONSTRAINT `Connection_fromId_fkey` FOREIGN KEY (`fromId`) REFERENCES `Commit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Connection` ADD CONSTRAINT `Connection_toId_fkey` FOREIGN KEY (`toId`) REFERENCES `Commit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
