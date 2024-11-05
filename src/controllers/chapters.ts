import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import STATUS_CODE from '../httpStatusCode'

const prisma = new PrismaClient()

export const handleCreateChapter = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params
    const { id } = req.userDetails
    const { title } = req.body

       const userId = id

    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and user authentication are required.',
      })
    }

    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Title is required and must be a valid string.',
      })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      })
    }

    if (course.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add chapters to this course.',
      })
    }

    const lastChapter = await prisma.chapter.findFirst({
        where:{
            courseId: courseId,
        },
        orderBy:{
            position: "desc"
        }
    })

    const newPosition = lastChapter ? lastChapter.position +1 : 1;
    
    const newChapter = await prisma.chapter.create({
      data: {
        title,
        courseId,
        position: newPosition
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Chapter created successfully.',
      data: newChapter,
    })
  } catch (error) {
    console.log('[CHAPTERS]', error)
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong with the server.',
    })
  }
}

export const handleReorder = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params
    const { id: userId } = req.userDetails
    const list = req.body.list // Change this line to extract the list correctly

    console.log(userId, 'userId is here')
    console.log(list, 'list is here')
    console.log(courseId, 'course id is here')

    if (!courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and user authentication are required.',
      })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      })
    }

    if (course.userId !== userId) {
      return res.status(403).json({
        success: false,
        message:
          'You do not have permission to reorder chapters for this course.',
      })
    }

    if (!Array.isArray(list)) {
      // Check if list is an array
      return res.status(400).json({
        success: false,
        message: 'Invalid input format: expected an array of chapters.',
      })
    }

    for (let item of list) {
      await prisma.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Reordered Successfully',
    })
  } catch (error) {
    console.error('[Reorder]', error)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with the server',
    })
  }
}

export const handleFetchChapter = async (req: Request, res: Response) => {
  const { courseId, chapterId } = req.params
  const { id: userId } = req.userDetails


  console.log(courseId)
  console.log(chapterId, "chapterID")
  console.log(userId, "userid")

  try {
    if (!courseId || !chapterId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID, Chapter ID, and user ID are required.',
      })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      })
    }

    if (course.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this chapter.',
      })
    }

    const chapter = await prisma.chapter.findUnique({
      where: { 
        id: chapterId,
        courseId: courseId
    },
    include:{
        muxData: true
    }

    })

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found.',
      })
    }

    return res.status(200).json({
      success: true,
      message: "successfully fetch chapter data",
      chapter,
    })
  } catch (error) {
    console.error('[Fetch Chapter]', error)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with the server.',
    })
  }
}

export const handleUpdateChapter = async (req: Request, res: Response) => {
  try {
    const { courseId, chapterId } = req.params
    const { userId } = req.userDetails
    const values = req.body

    // Find the course to verify ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.',
      })
    }

    // Check if the authenticated user is the course owner
    if (course.userId !== userId) {
      return res.status(403).json({
        success: false,
        message:
          'You do not have permission to update chapters for this course.',
      })
    }

    // Find the chapter to ensure it exists
    const existingChapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    })

    if (!existingChapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found.',
      })
    }

    // Update the chapter with provided fields
    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        ...values,
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Chapter updated successfully.',
      chapter: updatedChapter,
    })
  } catch (error) {
    console.log('[CHAPTER_UPDATE]', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}




