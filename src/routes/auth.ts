import express from 'express'
import { handleStudentSignup } from '../controllers/auth'

const router = express.Router()

router.post('/signup', handleStudentSignup)


export default router
