import express from 'express'
import { uploadAttachments, uploadImage } from '../controllers/upload.js'
import upload from '../middleware/multer.js'
import { handleAuthMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.patch('/image/:courseId',handleAuthMiddleware, upload.single('image'), uploadImage)
router.post(
  '/attachments/:courseId',
  handleAuthMiddleware,
  upload.single('attachment'),
  uploadAttachments
)

export default router
