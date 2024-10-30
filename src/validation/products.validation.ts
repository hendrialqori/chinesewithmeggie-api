import { z, ZodType } from "zod"

const onlyDigits = /[^0-9DMY/]/g

export class ProductsValidation {
    static readonly ADD: ZodType = z.object({
        title: z.string().max(100, { message: "Max 100 characters" }).nullish(),
        originalPrice: z.string()
            .min(1)
            .refine((price) => !onlyDigits.test(price), "Invalid input, Please enter a valid number")
            .transform((price) => Number(price)),
        discountPrice: z.string()
            .min(1)
            .refine((price) => !onlyDigits.test(price), "Invalid input, Please enter a valid number")
            .transform((price) => Number(price)),
        isOffer: z.enum(["1", "0"]).transform((isOffer) => Boolean(Number(isOffer.toString()))), // 1 = true, 0 = false
        description: z.string().min(1)
    })

}