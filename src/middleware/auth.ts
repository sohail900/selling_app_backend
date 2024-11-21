import jwt from 'jsonwebtoken'
import ErrorHandler from '../utils/ErrorHandler'

import type { NextFunction, Request, Response } from 'express'

export const auth = (req: Request, resp: Response, next: NextFunction) => {
    const token = req.cookies.authToken
    if (!token) return next(new ErrorHandler(401, 'Unauthenticated user'))

    try {
        const decode: any = jwt.verify(token, process.env.TOKEN as string)
        const id = decode.id
        req.userId = id
        next()
    } catch (error) {
        next(new ErrorHandler(401, 'Unauthenticated user'))
    }
}
