import type { Request, Response, NextFunction } from "express"
import ProductService from "../services/products.service"
import { StatusCodes } from "http-status-codes"

export default class ProducstController {

    static async list(_req: Request, res: Response, next: NextFunction) {
        try {
            const products = await ProductService.list()
            return res
                .status(StatusCodes.OK)
                .send({ data: products, message: "Successfully" })

        } catch (error) {
            next(error)
        }
    }

    static async listPrivate(_req: Request, res: Response, next: NextFunction) {
        try {
            const products = await ProductService.listPrivate()
            return res
                .status(StatusCodes.OK)
                .send({ data: products, message: "Successfully" })

        } catch (error) {
            next(error)
        }
    }

    static async getOffer(_req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ProductService.getOffer()
            return res
                .status(StatusCodes.OK)
                .send({ data, message: "Successfully" })

        } catch (error) {
            next(error)
        }
    }

    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params as unknown as { id: number }
            const data = await ProductService.get(params.id)

            return res
                .status(StatusCodes.OK)
                .send({ data, message: "Successfully" })

        } catch (error) {
            next(error)
        }
    }

    static async add(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await ProductService.add(req)
            return res
                .status(StatusCodes.OK)
                .send({ data, message: "Successfully added new product" })

        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params as unknown as { id: number }
            await ProductService.update(params.id, req)

            return res
                .status(StatusCodes.CREATED)
                .send({
                    data: null,
                    message: `Successfully update product with id ${params.id}`
                })

        } catch (error) {
            next(error)
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params as unknown as { id: number }

            await ProductService.remove(params.id)
            return res
                .status(StatusCodes.NO_CONTENT)
                .json({ data: null, message: `Successfully remove product with id ${params.id}` })

        } catch (error) {
            next(error)
        }
    }
}