import { type Request, type Response } from "express";
import bycript from "bcrypt"
import jwt from "jsonwebtoken"
import { eq } from "drizzle-orm";
import { db } from "../model/db";
import { users as usersTable } from "../model/schema";
import { Validation } from "../validation/validation";
import { AuthValidation } from "../validation/auth.validation";
import { ResponseError } from "../utils/errors";
import { JWTPaylod, type InsertUser } from "../@types";
import { SECRET_KEY } from "../constant";
import { MySqlColumn } from "drizzle-orm/mysql-core";
import { StatusCodes } from "http-status-codes";

export default class AuthService {

    static async login(request: Omit<InsertUser, 'username'>, response: Response) {

        // administratorMeggie
        const loginRequest = Validation.validate(AuthValidation.LOGIN, request)

        const user = await AuthService.checkUser(usersTable.email, loginRequest.email)
        if (!user) {
            throw new ResponseError(404, 'Email not found!')
        }

        // password match checker
        const isPasswordValid = await bycript.compare(loginRequest.password, user.password)

        if (!isPasswordValid) {
            throw new ResponseError(400, "Wrong password!")
        }

        // generate jwt token
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt
        }
        const expiresIn = 60 * 60 * 24 * 7 // 7 days

        const token = jwt.sign(payload, SECRET_KEY, {
            expiresIn
            // expiresIn: //1 minute
        })

        return { ...payload, access_token: token }
    }

    static async register(request: InsertUser) {

        const registerRequest = Validation.validate(AuthValidation.REGISTER, request)

        const checkEmail = await AuthService.checkUser(usersTable.email, registerRequest.email)
        const checkUsername = await AuthService.checkUser(usersTable.username, registerRequest.username)

        if (checkUsername) {
            throw new ResponseError(400, "Username already exists!")
        }
        if (checkEmail) {
            throw new ResponseError(400, "Email already exists!")
        }

        // Number of salt rounds (the higher, the more secure but slower the hash generation) 
        const saltRounds = await bycript.genSalt(10)
        // hashing password
        const hashingPassword = await bycript.hash(registerRequest.password, saltRounds)
        // store data for new user
        const newUser = {
            username: registerRequest.username,
            email: registerRequest.email,
            password: hashingPassword
        }

        const insertNewUser =
            await db
                .insert(usersTable)
                .values(newUser)
                .$returningId()

        return { ...insertNewUser[0], ...registerRequest }
    }

    static async credential(req: Request) {
        const { id: userId } = (req as Request & JWTPaylod).user
        const user = await AuthService.checkUser(usersTable.id, userId)
        if (!user) {
            throw new ResponseError(StatusCodes.NOT_FOUND, "User not found")
        }

        const data = { id: user.id, username: user.username, email: user.email }
        return data
    }

    static async update(req: Request) {
        const { id: userId } = (req as Request & JWTPaylod).user
        const body = req.body as InsertUser
        // validation
        const updateRequest = Validation.validate(AuthValidation.UPDATE, body)
        // check if user exist or not
        const user = await AuthService.checkUser(usersTable.id, userId)
        if (!user) {
            throw new ResponseError(StatusCodes.NOT_FOUND, "User not found")
        }

        // hard copy update request
        const payload = structuredClone(user)
        delete user.password

        // if user change username
        if (updateRequest.username !== user.username) {
            payload.username = updateRequest.username
        }

        // if user change username
        if (updateRequest.email !== user.email) {
            payload.email = updateRequest.email
        }

        //if user change password
        if (updateRequest.password) {
            // Number of salt rounds (the higher, the more secure but slower the hash generation) 
            const saltRounds = await bycript.genSalt(10)
            // hashing password
            const hashingPassword = await bycript.hash(updateRequest.password, saltRounds)

            payload.password = hashingPassword
        }

        await db.update(usersTable).set(payload).where(eq(usersTable.id, userId))

        return { username: payload.username, email: payload.email }
    }

    private static async checkUser<T extends {}>(column: MySqlColumn, value: T) {
        const [result] = await db.select().from(usersTable).where(eq(column, value))
        return result
    }
}