CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(100) NOT NULL,
	`image` text NOT NULL,
	`originalPrice` int NOT NULL,
	`discountPrice` int NOT NULL,
	`isOffer` boolean DEFAULT false,
	`zipPath` text NOT NULL,
	`zipMd5` text NOT NULL,
	`description` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(225) NOT NULL,
	`email` varchar(100) NOT NULL,
	`phone` bigint NOT NULL,
	`productId` int NOT NULL,
	`externalId` varchar(225),
	`invoiceId` text,
	`invoiceUrl` text,
	`status` enum('PENDING','SETTLED','FAILED') DEFAULT 'PENDING',
	`createdAt` timestamp DEFAULT NOW(),
	`updatedAt` timestamp DEFAULT NOW(),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(225) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(225) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_productId_products_id_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE no action;