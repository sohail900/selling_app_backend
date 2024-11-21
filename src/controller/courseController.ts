import type { Request, Response, NextFunction } from 'express'
import CoursesModel from '../model/courses.model'
import ErrorHandler from '../utils/ErrorHandler'
import PCourseModel from '../model/pcourse.model'
import mongoose from 'mongoose'

const allCoursesController = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    try {
        const courses = await CoursesModel.find()
        resp.status(200).json({ courses })
    } catch (error) {
        next(new ErrorHandler(400, 'Failed to get all courses'))
    }
}

const addCourseController = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const { name, description, price } = req.body
    try {
        // find if course already exists
        const checkCourse = await CoursesModel.findOne({ name })
        if (checkCourse)
            return next(new ErrorHandler(400, 'Course already exists'))

        const course = new CoursesModel({
            name,
            description,
            price,
        })
        await course.save()
        resp.status(201).json({ message: 'Course Added Successfully' })
    } catch (error) {
        next(new ErrorHandler(400, 'Failed to add course'))
    }
}

const removeCourseController = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const { id } = req.query
    try {
        const removedCourse = await CoursesModel.findByIdAndDelete(id)
        if (!removedCourse)
            return next(new ErrorHandler(404, 'Course not found'))
        resp.status(200).json({
            success: true,
            message: 'Course removed successfully',
        })
    } catch (error) {
        next(new ErrorHandler(400, 'Failed to remove course'))
    }
}
const buyCourseController = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const { id, payment } = req.body
    if (
        !mongoose.Types.ObjectId.isValid(id) ||
        !mongoose.Types.ObjectId.isValid(req.userId as string)
    ) {
        next(new ErrorHandler(400, 'Invalid id'))
    }
    try {
        const course = await CoursesModel.findById(id)
        if (!course) return next(new ErrorHandler(404, 'Course not found'))
        if (payment < course.price) {
            return next(
                new ErrorHandler(402, 'Payment is less than course price')
            )
        }
        const alreadyBuyCourse = await PCourseModel.findOne({
            userDetails: req.userId,
        })
        if (alreadyBuyCourse?.purchasedCourse.includes(id)) {
            return next(new ErrorHandler(400, 'Already bought this course'))
        }
        const updateCourse = await PCourseModel.updateOne(
            { userDetails: req.userId },
            {
                $addToSet: { purchasedCourse: id },
                $setOnInsert: { purchasedAt: Date.now() },
            },
            { upsert: true }
        )

        resp.status(200).json({
            message: 'successfully add new course',
            updateCourse,
        })
    } catch (error) {
        console.log(error)
        next(new ErrorHandler(400, 'Failed to buy course'))
    }
}
const purchasedCoursesController = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const userId = req.userId
    try {
        const purchasedCourses = await PCourseModel.findOne({
            userDetails: userId,
        }).populate('purchasedCourse')
        if (!purchasedCourses) {
            next(new ErrorHandler(400, 'No, purchased course'))
        }
        resp.status(200).json({
            success: true,
            purchasedCourses: purchasedCourses?.purchasedCourse,
        })
    } catch (error) {
        next(
            new ErrorHandler(400, 'Failed to see courses, please try again...')
        )
    }
}
export const courseController = {
    addCourseController,
    removeCourseController,
    allCoursesController,
    buyCourseController,
    purchasedCoursesController,
}
