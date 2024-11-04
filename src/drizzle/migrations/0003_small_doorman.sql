ALTER TABLE `transactions` MODIFY COLUMN `createdAt` text NOT NULL;--> statement-breakpoint
ALTER TABLE `transactions` MODIFY COLUMN `updatedAt` timestamp DEFAULT (now());