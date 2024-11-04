import {
    mysqlTable, mysqlEnum, int, bigint,
    varchar, text, timestamp, boolean
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { STATUS } from '../constant';

const USERS = "users" as const
const PRODDUCTS = "products" as const
const TRANSACTIONS = "transactions" as const

export const users = mysqlTable(USERS, {
    id: int("id").primaryKey().autoincrement(),
    username: varchar("username", { length: 225 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    password: varchar("password", { length: 225 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow()
})

export const products = mysqlTable(PRODDUCTS, {
    id: int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 100 }).notNull(),
    image: text("image").notNull(),
    originalPrice: int("originalPrice").notNull(),
    discountPrice: int("discountPrice").notNull(),
    isOffer: boolean("isOffer").default(false),
    zipPath: text("zipPath").notNull(),
    zipMd5: text("zipMd5").notNull(),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow()
})

// export const productsRelations = relations(products, ({ many }) => ({
//     transactions: many(transactions),
// }))

export const transactions = mysqlTable(TRANSACTIONS, {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 225 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    phone: bigint("phone", { mode: "number" }).notNull(),
    productId: int("productId")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    externalId: varchar("externalId", { length: 225 }), // from invoice xendit
    invoiceId: text("invoiceId"), // from invoice xendit
    invoiceUrl: text("invoiceUrl"), // from invoice xendit
    status: mysqlEnum("status", STATUS).default("PENDING"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt")
})

export const transactionsRelations = relations(transactions, ({ one }) => ({
    product: one(products, {
        fields: [transactions.productId],
        references: [products.id]
    })
}))