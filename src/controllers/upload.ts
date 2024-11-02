import { Request, Response } from 'express'
import cloudinary from '../utils/cloudinary.js'
import { PrismaClient } from '@prisma/client'
import STATUS_CODE from '../httpStatusCode'
import { getResourceType } from '../utils/getResourceType.js'

const prisma = new PrismaClient()

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params
    const file = req.file

    if (!file) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'File is required.',
      })
    }

    if (!courseId) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'Course ID is required.',
      })
    }

    // Upload the file to Cloudinary as a stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error uploading to Cloudinary.',
          })
        }

        // Update the course with the Cloudinary URL
        const course = await prisma.course.update({
          where: { id: courseId },
          data: {
            imageUrl: result?.secure_url,
            updatedAt: new Date(),
          },
        })

        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Image uploaded and course updated successfully!',
          data: course,
        })
      }
    )

    // Send the file buffer to Cloudinary
    uploadStream.end(file.buffer)
  } catch (err) {
    console.error(err)
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error uploading the file.',
      error: err,
    })
  }
}

export const uploadAttachments = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params
    const file = req.file

    if (!file) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'File is required.',
      })
    }

    if (!courseId) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'Course ID is required.',
      })
    }

    // Set appropriate resource type based on file type
    const resourceType = getResourceType(file.mimetype)

    // Upload the file to Cloudinary as a stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error)
          return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Error uploading to Cloudinary.',
          })
        }

        // Check if result.secure_url is defined
        if (!result?.secure_url) {
          return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Uploaded file URL is not available.',
          })
        }

        // Save the file details to the database
        const attachment = await prisma.attachment.create({
          data: {
            name: file.originalname,
            url: result.secure_url, // Now guaranteed to be a string
            courseId: courseId,
          },
        })

        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'File uploaded successfully!',
          data: attachment,
        })
      }
    )

    // Send the file buffer to Cloudinary
    uploadStream.end(file.buffer)
  } catch (err) {
    console.error(err)
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error uploading the file.',
      error: err,
    })
  }
}

