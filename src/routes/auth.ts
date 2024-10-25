import express from 'express'
import { googleLoginHandler, handleStudentSignin, handleStudentSignup } from '../controllers/auth'
import { googleLoginMiddleware } from '../middleware/auth'

const router = express.Router()

router.post('/signup', handleStudentSignup)
router.post('/signin', handleStudentSignin)
router.get('/google-login', googleLoginMiddleware, googleLoginHandler)


export default router
