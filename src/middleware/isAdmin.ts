import SignUpModel from '../model/signup.model'
import ErrorHandler from '../utils/ErrorHandler'

import type { NextFunction, Request, Response } from 'express'

export const isAdmin = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const userId = req.userId
    if (!userId) return next(new ErrorHandler(400, 'User not found'))
    try {
        const user = await SignUpModel.findById(userId)
        if (user?.role === 'user')
            return next(new ErrorHandler(401, 'Unauthorized access'))
        next()
    } catch (error) {
        next(new ErrorHandler(400, 'Failed to check user role'))
    }
}
