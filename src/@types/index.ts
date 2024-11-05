import { users, products, transactions } from "../model/schema"

export type Query = {
    page: number;
    limit: number
    start_date: string;
    end_date: string
}

export type JWTPaylod = {
    user: {
        id: number;
        email: string
        username: string
        createdAt: Date | string
        updatedAt?: Date | string
    }
}

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

export type Product = typeof products.$inferSelect
export type InsertProduct = typeof products.$inferInsert

export type Transaction = typeof transactions.$inferSelect
export type InsertTransaction = typeof transactions.$inferInsert & {
    externalId?: string
    invoiceId?: string;
    invoiceUrl?: string
}

