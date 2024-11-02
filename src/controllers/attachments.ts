import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client' // Adjust the import path as necessary
import cloudinary from '../utils/cloudinary.js' // Adjust the import path as necessary

const prisma = new PrismaClient()

export const deleteAttachment = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    // Find the attachment by ID
    const attachment = await prisma.attachment.findUnique({
      where: { id },
    })

    // Check if the attachment was found
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found.',
      })
    }

    // Safely extract the public ID from the URL for Cloudinary deletion
    if (!attachment.url) {
      return res.status(500).json({
        success: false,
        message: 'Attachment URL is missing.',
      })
    }

    // // Extract the public ID from the URL
    // const publicId = attachment.url.split('/').pop()?.split('.')[0]
    // if (publicId) {
    //   await cloudinary.uploader.destroy(publicId) // Delete from Cloudinary
    // } else {
    //   return res.status(500).json({
    //     success: false,
    //     message: 'Could not extract public ID from URL.',
    //   })
    // }

    // Delete the attachment from the database
    await prisma.attachment.delete({
      where: { id },
    })

    res.status(200).json({
      success: true,
      message: 'Attachment deleted successfully.',
    })
  } catch (error) {
    console.error('Delete attachment error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting attachment.',
    })
  }
}
