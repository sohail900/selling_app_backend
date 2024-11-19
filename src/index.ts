import './config/dbConfig'

import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'

import { errorMiddleware } from './middleware/errorMiddleware'
import router from './router/router'

dotenv.config()
const app = express()
const server = http.createServer(app)

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// routes
app.use('/api/v1', router)
app.use(errorMiddleware)

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
