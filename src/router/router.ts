import express from 'express'

import { authController, courseController } from '../controller/index'
import { auth } from '../middleware/auth'
import { isAdmin } from '../middleware/isAdmin'

const router = express.Router()

router.route('/signup').post(authController.signUp)
router.route('/login').post(authController.login)
router.route('/refresh-token').get(authController.generateNewToken)
router.route('/all-courses').get(courseController.allCoursesController)
router
    .route('/add-courses')
    .post(auth, isAdmin, courseController.addCourseController)
router
    .route('/remove-courses')
    .delete(auth, isAdmin, courseController.removeCourseController)

router.route('/courses').get(auth, async (req, resp) => {
    resp.status(200).json({ message: 'courses' })
})
router.route('/buy-course').post(auth, courseController.buyCourseController)
router
    .route('/purchased-courses')
    .get(auth, courseController.purchasedCoursesController)
export default router
