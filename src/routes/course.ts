import express from 'express'
import { handleCreateCourse, handleFetchCourseById, handleUpdateCourse } from '../controllers/course'
import { handleAuthMiddleware } from '../middleware/auth'



const router = express.Router()

router.post('/create',handleAuthMiddleware, handleCreateCourse)
router.get('/:courseId', handleAuthMiddleware, handleFetchCourseById)
router.patch('/:courseId', handleAuthMiddleware, handleUpdateCourse)


export default router
