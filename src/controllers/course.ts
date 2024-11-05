import { Request, Response } from 'express'
import { createCourseSchema } from '../zod/course'
import { PrismaClient } from '@prisma/client'
import {z} from 'zod'
import STATUS_CODE from '../httpStatusCode'

const prisma = new PrismaClient()

export const handleCreateCourse = async (req: Request, res: Response) => {
  try {
    const validatedData = createCourseSchema.parse(req.body)
    const { title } = validatedData
     const userId = req.userDetails?.id

    const course = await prisma.course.create({
      data: {
        title,
        userId,
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course,
    })
  } catch (error) {
    console.error('[COURSES]', error)

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors, 
      })
    }else{
      return res.status(500).json({
          success: false,
          message: 'Something went wrong in server',
        })
    }

    
  
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }


export const handleFetchCourseById = async (req: Request, res: Response) => {
  const { courseId } = req.params
  const { id } = req.userDetails

  const userId = id

  if(!userId) {
    return res.status(STATUS_CODE.UNAUTHORIZED).json({
      success: false,
      message: "You not authorized to make change in course"
    })
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapters:{
          orderBy:{
            position: 'asc'
          }
        },
        attachments: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    return res.status(200).json({ 
      success: true,
      message: "Successfully fetch the course",
      course: course })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

export const handleUpdateCourse = async(req:Request, res:Response)=>{
  try{
    const { courseId } = req.params
    const {userId} = req.userDetails
    const values = req.body

    console.log(values)

    const course = await prisma.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    })

    return res.status(STATUS_CODE.OK).json({
      success: true,
      message: "successfully update the course",
      course: course
    })

  }catch(error){
    console.log("[COURSE_ID]", error)
    return res.status(500).json({ error: "Internal Server error"})
  }
}




