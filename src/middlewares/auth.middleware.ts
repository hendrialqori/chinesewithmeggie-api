import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { AuthenticationError } from "../utils/errors";
import { SECRET_KEY } from "../constant";
import { StatusCodes } from "http-status-codes";
import { JWTPaylod } from "../@types";

export async function accessValidation(req: Request, _res: Response, next: NextFunction) {
    try {
        // header
        const authorization = req.headers.authorization
        // token
        const token = authorization.split(" ")[1]
        // verify token
        const currentUser = jwt.verify(token, SECRET_KEY) as JWTPaylod['user']

        (req as Request & JWTPaylod).user = currentUser

        next()

    } catch (error) {
        next(new AuthenticationError(StatusCodes.UNAUTHORIZED, "Unauthorized"))
    }
}