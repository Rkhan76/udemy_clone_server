import express from 'express'
import { googleLoginHandler, handleStudentSignin, handleStudentSignup, teacherSignup } from '../controllers/auth'
import { googleLoginMiddleware } from '../middleware/auth'

const router = express.Router()

router.post('/signup', handleStudentSignup)
router.post('/signin', handleStudentSignin)
router.get('/google-login', googleLoginMiddleware, googleLoginHandler)
router.post('/teacher-signup', teacherSignup)


export default router
