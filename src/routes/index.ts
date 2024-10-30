import express from 'express';
import AuthController from '../controllers/auth.controller';
import ProductsController from '../controllers/products.controller';
import PaymentController from '../controllers/payment.controller';
import TransactionsController from '../controllers/transaction.controller';
import { accessValidation } from '../middlewares/auth.middleware';
import { fileUpload } from '../configs/file-upload';

const apiRouter = express.Router()
const ROUTE = "/api/v1"

const uploadHandlers = fileUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "zip", maxCount: 1 }
])

// auth
apiRouter.post(`${ROUTE}/auth/register`, AuthController.register)
apiRouter.post(`${ROUTE}/auth/login`, AuthController.login)

// products
apiRouter.get(`${ROUTE}/product/list/public`, ProductsController.list)
apiRouter.get(`${ROUTE}/product/offer/public`, ProductsController.getOffer)

apiRouter.get(`${ROUTE}/product/list`, accessValidation, ProductsController.listPrivate)
apiRouter.get(`${ROUTE}/product/:id`, accessValidation, ProductsController.get)
apiRouter.post(`${ROUTE}/product/add`, [accessValidation, uploadHandlers], ProductsController.add)
apiRouter.put(`${ROUTE}/product/:id/update`, [accessValidation, uploadHandlers], ProductsController.update)
apiRouter.delete(`${ROUTE}/product/:id/remove`, accessValidation, ProductsController.remove)

//transactions
apiRouter.get(`${ROUTE}/transaction/list`, accessValidation, TransactionsController.list)
apiRouter.get(`${ROUTE}/transaction/export`, accessValidation, TransactionsController.exportCsv)
apiRouter.get(`${ROUTE}/transaction/:id`, accessValidation, TransactionsController.get)

// payment
apiRouter.post(`${ROUTE}/payment/invoice/create`, PaymentController.createInvoice)
apiRouter.post(`${ROUTE}/payment/webhook`, PaymentController.webhook)
apiRouter.get(`${ROUTE}/payment/email/sender`, PaymentController.emailSender)
apiRouter.get(`${ROUTE}/download/:encrypted`, PaymentController.downloadZip)

export default apiRouter

