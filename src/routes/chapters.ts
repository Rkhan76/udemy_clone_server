import { Router } from 'express'
import { handleCreateChapter, handleFetchChapter, handleReorder, handleUpdateChapter } from '../controllers/chapters'
import { handleAuthMiddleware } from '../middleware/auth'


const router = Router()

router.post('/:courseId',handleAuthMiddleware, handleCreateChapter)
router.put('/reorder/:courseId', handleAuthMiddleware , handleReorder)
router.get('/:courseId/:chapterId', handleAuthMiddleware, handleFetchChapter)
router.patch("/:courseId/:chapterId", handleAuthMiddleware, handleUpdateChapter)

export default router
