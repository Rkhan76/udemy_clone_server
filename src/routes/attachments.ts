import express from 'express'
import { deleteAttachment } from '../controllers/attachments' // Adjust the import path as necessary

const router = express.Router()

// DELETE /api/v1/upload/attachments/:id
router.delete('/:id', deleteAttachment)

export default router
