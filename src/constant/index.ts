//.env
export const PRODUCTION_MODE = process.env.NODE_ENV === "production"

export const PORT = process.env.PORT
export const SECRET_KEY = process.env.SECRET_KEY
export const DATABASE_URL = process.env.DATABASE_URL
export const SERVER_ORIGIN = process.env.SERVER_ORIGIN
export const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN

export const CIPHER_ALGORITHM = process.env.CIPHER_ALGORITHM
export const CIPHER_PASSWORD = process.env.CIPHER_PASSWORD

export const SUCCESS_PAYMENT_URL = process.env.SUCCESS_PAYMENT_URL
export const FAILED_PAYMENT_URL = process.env.FAILED_PAYMENT_URL
export const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY
export const XENDIT_CALLBACK_TOKEN = process.env.XENDIT_CALLBACK_TOKEN

export const EMAIL_SERVER_USER = process.env.EMAIL_SERVER_USER
export const EMAIL_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD
export const EMAIL_SENDER_FROM = process.env.EMAIL_SENDER_FROM
export const EMAIL_SENDER_TO = process.env.EMAIL_SENDER_TO
export const EMAIL_SENDER_SUBJECT = process.env.EMAIL_SENDER_SUBJECT

export const MAX_IMAGE_SIZE = 3000000 //3mb
export const ALLOWS_MIME_TYPE = ["image/png", "image/jpg", "image/jpeg"] as const
export const STATUS = ["PENDING", "SETTLED", "FAILED"] as const