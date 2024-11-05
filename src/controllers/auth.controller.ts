import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes"
import { InsertUser } from "../@types";
import AuthService from "../services/auth.service";

export default class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as InsertUser
            const response = await AuthService.register(request)

            return res
                .status(StatusCodes.CREATED)
                .send({ data: response, message: "Successfully add new user:)" })

        } catch (error) {
            next(error)
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as Omit<InsertUser, 'username'>
            const data = await AuthService.login(request, res)

            return res
                .status(StatusCodes.OK)
                .send({ data, message: "Login successfully!" })

        } catch (error) {
            next(error)
        }
    }

    static async credential(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.credential(req)
            return res
                .status(StatusCodes.OK)
                .send({ data: result, message: "Success" })
        } catch (error) {
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.update(req)
            return res
                .status(StatusCodes.CREATED)
                .send({ data: result, message: "Update profile success!" })

        } catch (error) {
            next(error)
        }
    }
}