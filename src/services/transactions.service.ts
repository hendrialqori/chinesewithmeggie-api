import { Buffer } from "node:buffer";
import type { Request, Response } from "express";
import { eq, gte, lte, desc, sql, and, type SQL } from "drizzle-orm";
import { db } from "../model/db";
import radash from "radash"
import dayjs from "dayjs"
import {
    transactions as transactionsTable,
    products as productsTable
} from "../model/schema";
import { Query, type InsertTransaction, Transaction } from "../types";
import { Validation } from "../validation/validation";
import { TransactionsValidation } from "../validation/transactions.validation";
import { ResponseError } from "../utils/errors";

import { mkConfig, generateCsv, asString } from "export-to-csv";


export class TransactionService {
    private static COLUMN = {
        id: transactionsTable.id,
        name: transactionsTable.name,
        email: transactionsTable.email,
        phone: transactionsTable.phone,
        status: transactionsTable.status,
        product: {
            id: productsTable.id,
            title: productsTable.title,
            image: productsTable.image,
            originalPrice: productsTable.originalPrice,
            discountPrice: productsTable.discountPrice,
            description: productsTable.description
        },
        externalId: transactionsTable.externalId,
        invoiceId: transactionsTable.invoiceId,
        invoiceUrl: transactionsTable.invoiceUrl,
        createdAt: transactionsTable.createdAt,
        updatedAt: transactionsTable.updatedAt
    }

    private static MOCK_CSV = {
        tanggal: transactionsTable.createdAt,
        email: transactionsTable.email,
        phone: transactionsTable.phone,
        status_pembayaran: transactionsTable.status,
        nama_produk: productsTable.title,
        harga_produk: productsTable.discountPrice,
        invoice_url: transactionsTable.invoiceUrl
    }

    static async list(request: Request) {
        const query = request.query as unknown as Query
        const page = Number(query.page)
        const limit = Number(query.limit)
        const offset = Number((page - 1) * limit)
        const start_date = query.start_date ? new Date(query.start_date) : undefined
        const end_date = query.end_date ? dayjs(query.end_date).add(1, "day").toDate() : undefined

        // Placeholder condition incase we don't have any filters
        const condition = [] as SQL<unknown>[]

        // if start_date & end_date not null, add to condition
        if (start_date && end_date) {
            const start_date_filter = gte(transactionsTable.createdAt, start_date)
            const end_date_filter = lte(transactionsTable.createdAt, end_date)
            condition.push(start_date_filter, end_date_filter)
        }
        // spread condition array with and
        const whereClause = condition.length ? and(...condition) : undefined

        // transactions query
        const transactions = await db
            .select(TransactionService.COLUMN)
            .from(transactionsTable)
            .innerJoin(productsTable, eq(transactionsTable.productId, productsTable.id))
            .orderBy(desc(transactionsTable.createdAt))
            .where(whereClause)
            .limit(limit)
            .offset(offset)

        // COUNT all rows transaction table
        const counts = await db
            .select({ count: sql<number>`count(*)` })
            .from(transactionsTable)
            .where(whereClause)

        const totalTransaction = counts[0].count

        const meta = {
            page,
            limit,
            from: offset + 1,
            to: Math.min(limit * page, totalTransaction),
            total_row: totalTransaction
        }

        return {
            transactions,
            meta
        }
    }

    static async get(id: number) {
        const transactions =
            await db.select(TransactionService.COLUMN)
                .from(transactionsTable)
                .innerJoin(productsTable,
                    eq(transactionsTable.productId, productsTable.id))
                .where(eq(transactionsTable.id, id))

        const transaction = transactions[0]

        if (!radash.isObject(transaction)) {
            throw new ResponseError(404, `Transaction not found with id ${id}`)
        }
        return transaction
    }

    static async add(request: Request) {
        const body = request.body as InsertTransaction
        const transactionRequest = Validation.validate(TransactionsValidation.ADD, body)

        const newtransaction =
            await db.insert(transactionsTable).values(transactionRequest).$returningId()

        return { ...newtransaction[0], ...transactionRequest }
    }

    static async updateStatus(id: number, request: Request) {
        const body = request.body as Pick<Transaction, "status">
        const transactionRequest = Validation.validate(TransactionsValidation.UPDATE_STATUS, body)

        // check is there transaction with id = [id]
        await TransactionService.get(id)

        const updateStatusTransaction = {
            status: transactionRequest.status
        } as unknown as InsertTransaction

        await db.update(transactionsTable)
            .set(updateStatusTransaction)
            .where(eq(transactionsTable.id, id))

    }

    static async remove(id: number) {
        // check is there transaction with id
        await TransactionService.get(id)
        // and then, remove from db
        await db.delete(transactionsTable)
            .where(eq(transactionsTable.id, id))
    }

    static async exportCsv(req: Request, res: Response) {
        // query params
        const query = req.query as unknown as Query

        const start_date = query.start_date ? new Date(query.start_date) : undefined
        const end_date = query.end_date ? dayjs(query.end_date).add(1, "day").toDate() : undefined
        const condition = [] as SQL<unknown>[]

        if (start_date && end_date) {
            const start_date_filter = gte(transactionsTable.createdAt, start_date)
            const end_date_filter = lte(transactionsTable.createdAt, end_date)
            condition.push(start_date_filter, end_date_filter)
        }

        // spread condition array with and
        const whereClause = condition.length ? and(...condition) : undefined

        // transaction data from db
        const transactions = await
            db.select(TransactionService.MOCK_CSV).from(transactionsTable)
                .innerJoin(productsTable, eq(transactionsTable.productId, productsTable.id))
                .where(whereClause)

        // csv config
        const config = mkConfig({ useKeysAsHeaders: true })
        // mock data
        const mockData = transactions.map((trx) => ({ ...trx, tanggal: new Date(trx.tanggal).toString() }))
        // filename
        const filename = `${Date.now()}-${config.filename}.csv`;
        // generate csv
        const csv = generateCsv(config)(mockData)
        // csv buffer
        const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

        res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
        res.setHeader("Content-Type", "text/csv")

        res.send(Buffer.from(csvBuffer).toString())
    }
}
