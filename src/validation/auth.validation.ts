import { z, ZodType } from "zod";

export class AuthValidation {
    static readonly REGISTER: ZodType = z.object({
        username: z.string().min(1).max(225).regex(/^\S*$/, { message: "Whitespace not allowed" }),
        email: z.string().email().max(100),
        password: z.string().min(1).max(225)
    })

    static readonly LOGIN: ZodType = z.object({
        email: z.string().email().max(100),
        password: z.string().min(1).max(225)
    })

    static readonly UPDATE: ZodType = z.object({
        username: z.string()
            .min(1).max(225)
            .regex(/^\S*$/, { message: "Whitespace not allowed" }),
        email: z.string().email().max(100),
        password: z.string().optional()
    })

}