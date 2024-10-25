import { Request, Response } from 'express'
import { PrismaClient, UserRole } from '@prisma/client'
import { signupSchema } from '../zod/auth'
import { hashPassword } from '../utils/auth'
import STATUS_CODE from '../httpStatusCode'
import { ZodError } from 'zod'

const prisma = new PrismaClient()

export const handleStudentSignup = async (
  req: Request<any, any, any>,
  res: Response
) => {
  try {
    const validatedData = signupSchema.parse(req.body)
    const { fullname, email, password } = validatedData

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ success: false, message: 'Email already in use' })
    }

    const hashedPassword = password ? await hashPassword(password) : undefined

    const newUserCreated = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
        roles: { set: [UserRole.STUDENT] },
      },
    })

    const {
      password: password_,
      googleId: googleId_,
      ...newUser
    } = newUserCreated

    return res.status(STATUS_CODE.CREATED).json({
      success: true,
      message: 'Successfully signed up as Student',
      data: newUser,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    console.error('Error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  } finally {
    await prisma.$disconnect()
  }
}
