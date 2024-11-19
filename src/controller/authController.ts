import jwt from 'jsonwebtoken'

import SignUpModel from '../model/signup.model'
import ErrorHandler from '../utils/ErrorHandler'

import type { Request, Response, NextFunction } from 'express'

const generateToken = ({ age, id }: { age: string; id: any }) => {
    const token = jwt.sign({ id }, process.env.TOKEN as string, {
        expiresIn: age,
    })
    return token
}
// signUp controller
const signUp = async (req: Request, resp: Response, next: NextFunction) => {
    const { fullname, email, password, role } = req.body
    try {
        const checkUser = await SignUpModel.findOne({ email })
        if (checkUser) {
            return next(new ErrorHandler(400, 'Email Already Exists'))
        }

        const user = new SignUpModel({
            fullname,
            email,
            password,
            role,
        })
        await user.save()
        resp.status(200).json({ message: 'SignUp Successful', user })
    } catch (err) {
        next(new ErrorHandler(400, 'Failed to Signup'))
    }
}
// login controller
const login = async (req: Request, resp: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
        const user = await SignUpModel.findOne({ email })
        if (!user) {
            return next(new ErrorHandler(400, 'Invalid credentials'))
        }
        const isPasswordCorrect = await Bun.password.verify(
            password,
            user?.password
        )
        if (!isPasswordCorrect) {
            return next(new ErrorHandler(400, 'Invalid credentials'))
        }

        const token = generateToken({
            age: '10m',
            id: user._id as any,
        })
        const refreshToken = generateToken({
            age: '20m',
            id: user._id as any,
        })
        resp.cookie('authToken', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 10,
        })
        resp.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 20,
        })
        resp.status(200).json({ success: true, message: 'successfully login' })
    } catch (err) {
        next(new ErrorHandler(400, 'Failed to Login'))
    }
}

// refresh token controller
const generateNewToken = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const token = req.cookies.refreshToken
    if (!token) return next(new ErrorHandler(400, 'Token not found!!'))
    //
    try {
        const decode: any = jwt.verify(process.env.TOKEN as string, token)
        const id = decode.id
        const authToken = generateToken({
            age: '10m',
            id,
        })
        const refreshToken = generateToken({
            age: '20m',
            id,
        })
        resp.cookie('authToken', authToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 10,
        })
        resp.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 20,
        })
    } catch (error) {
        next(new ErrorHandler(401, 'Unauthenticated user'))
    }
}
export const authController = {
    signUp,
    login,
}
