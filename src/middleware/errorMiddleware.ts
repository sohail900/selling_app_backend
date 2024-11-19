import type { Request, Response, NextFunction } from 'express'
import ErrorHandler from '../utils/ErrorHandler'

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ErrorHandler) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        })
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        })
    }
}
