import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import compression from "compression"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import morgan from "morgan"
import path from "path";
import fs from "node:fs"

import apiRouter from "./routes";
import { errorResponse } from "./middlewares/error.middleware";
import { rateLimiter } from "./middlewares/rate-limit.middleware";
import { FRONTEND_ORIGIN } from "./constant";
import swaggerUi from "swagger-ui-express"
import YAML from "yaml"

dotenv.config()

const PORT = 8000

const app = express()

app.use(cors({
    credentials: true,
    origin: FRONTEND_ORIGIN,
    exposedHeaders: "X-Filename"
}))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))

app.use(rateLimiter)

app.use(compression())

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(helmet());

//serve static file for image
app.use(express.static(path.join(__dirname, "..", "public")));

// cookie middleware
app.use(cookieParser())

// api router 
app.use(apiRouter)

// ping API
app.get("/api/v1/ping", (req, res) => {
    res.status(200).json({ message: "PING!", time: new Date() })
})

// error response middleware
app.use(errorResponse)

app.listen(PORT, () => {
    // winstonLogger.info
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});