import express from "express"
import helmet from "helmet"
import cors from "cors"
import rateLimit from "express-rate-limit"
import { logger } from "@repo/logger"

import * as trpcExpress from "@trpc/server/adapters/express"
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi"
import { apiReference } from "@scalar/express-api-reference"

import { serverRouter, createContext } from "@repo/trpc/server"
import { env } from "./env"

export const app = express()

// Security headers
app.use(helmet())

// CORS - only allow your frontend
app.use(cors({
  origin: env.NODE_ENV === "prod"
    ? "https://yourapp.com"  // change this to your domain later
    : "*",
  credentials: true,
}))

// Parse JSON but limit payload size (prevents large payload attacks)
app.use(express.json({ limit: "10kb" }))

// Global rate limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,  // sends RateLimit headers in response
  legacyHeaders: false,
})
app.use(globalLimiter)

// Stricter rate limit for auth routes — prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // only 10 login attempts per 15 minutes
  message: { error: "Too many auth attempts, please try again later" },
})
app.use("/api/auth/login", authLimiter)
app.use("/api/auth/register", authLimiter)

// Health check
app.get("/health", (req, res) => {
  res.json({ message: "Formulate API is healthy", healthy: true })
})

// OpenAPI document
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "Formulate API",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
})

app.get("/openapi.json", (req, res) => {
  res.json(openApiDocument)
})

// Scalar API docs
app.use("/docs", apiReference({ url: "/openapi.json" }))

// REST API via OpenAPI
app.use("/api", createOpenApiExpressMiddleware({
  router: serverRouter,
  createContext,
}))

// tRPC (used by Next.js frontend)
app.use("/trpc", trpcExpress.createExpressMiddleware({
  router: serverRouter,
  createContext,
}))

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Unhandled error", { err })
  res.status(500).json({ error: "Internal server error" })
})

export default app