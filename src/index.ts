import './config/dbConfig'

import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import rateLimit from 'express-rate-limit'

import { errorMiddleware } from './middleware/errorMiddleware'
import router from './router/router'

dotenv.config()
const app = express()
const server = http.createServer(app)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: 'Too many requests, please try again later.',
    },
})

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(limiter)

// routes
app.use('/api/v1', router)
app.use(errorMiddleware)

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
