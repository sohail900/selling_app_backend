import express from 'express'
import { authController } from '../controller/authController'
const router = express.Router()

router.route('/signup').post(authController.signUp)
router.route('/login').post(authController.login)

export default router
