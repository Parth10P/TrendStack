/*
  Warnings:

  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add name column as nullable first
ALTER TABLE `users` ADD COLUMN `name` VARCHAR(191) NULL;

-- Update existing rows: set name to username if name is null
UPDATE `users` SET `name` = `username` WHERE `name` IS NULL;

-- AlterTable: Make name column NOT NULL
ALTER TABLE `users` MODIFY COLUMN `name` VARCHAR(191) NOT NULL;
