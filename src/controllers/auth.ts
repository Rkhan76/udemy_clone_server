import { Request, Response } from 'express'
import { PrismaClient, UserRole } from '@prisma/client'
import { signinSchema, signupSchema, teacherSignupSchema } from '../zod/auth'
import { generateToken, hashPassword, verifyPassword } from '../utils/auth'
import STATUS_CODE from '../httpStatusCode'
import { ZodError } from 'zod'

const prisma = new PrismaClient()

export const handleStudentSignup = async (req: Request, res: Response) => {
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

    const { password: _, googleId: __, ...newUser } = newUserCreated

    return res.status(STATUS_CODE.CREATED).json({
      success: true,
      message: 'Successfully signed up as Student',
      data: newUser,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      })
    }
    console.error('Error:', error)
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error',
    })
  } finally {
    await prisma.$disconnect()
  }
}

export const handleStudentSignin = async (req: Request, res: Response) => {
  try {
    const validatedData = signinSchema.parse(req.body)
    const { email, password } = validatedData

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (!existingUser) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'You are not registered',
      })
    }

    const passwordVerify = await verifyPassword(
      password,
      existingUser.password as string
    )

    if (!passwordVerify) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid password',
      })
    }

    const { id, fullname, roles } = existingUser
    const token = await generateToken({ id, fullname, email, roles })

    if (!token) {
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Something went wrong while generating token',
      })
    }

    return res.status(STATUS_CODE.OK).json({
      success: true,
      message: 'Successfully signed in',
      user: { id, fullname, email, roles, token },
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      })
    }
    console.error('Error:', error)
    return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error',
    })
  } finally {
    await prisma.$disconnect()
  }
}

export const googleLoginHandler = async (req: Request, res: Response) => {
  const { email, name, googleId } = res.locals.userData

  if (!email || !googleId) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing email or Google ID',
    })
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      if (!existingUser.googleId) {
        return res.status(409).json({
          success: false,
          message: 'Email is already in use with a different login method',
        })
      }

      const token = await generateToken({
        id: existingUser.id,
        fullname: existingUser.fullname,
        email: existingUser.email,
        roles: existingUser.roles,
      })

    

      return res.status(200).json({
        success: true,
        message: 'Successfully logged in',
        user: {
          id: existingUser.id,
          fullname: existingUser.fullname,
          email: existingUser.email,
          roles: existingUser.roles,
          token,
        },
      })
    }

    const newUser = await prisma.user.create({
      data: {
        fullname: name,
        email,
        password: null,
        googleId,
        roles: { set: [UserRole.STUDENT] },
      },
    })

    if (!newUser) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while registering the user',
      })
    }

    // Generate token for the new user
    const token = await generateToken({
      id: newUser.id,
      fullname: newUser.fullname,
      email: newUser.email,
      roles: newUser.roles,
    })

   

    if (!token) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while generating the token',
      })
    }

    // Successful signup and login
    return res.status(201).json({
      success: true,
      message: 'Successfully signed up and logged in',
      user: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        roles: newUser.roles,
        token,
      },
    })
  } catch (err) {
    console.error('Error handling Google login:', err)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    })
  }
}



export const teacherSignup = async (req: Request, res: Response) => {
  try {
    const validatedData = teacherSignupSchema.parse(req.body)
    const { id } = validatedData

    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.roles.includes(UserRole.TEACHER)) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered as a teacher',
        user,
      })
    }

    // Update roles to include TEACHER
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { roles: [...user.roles, UserRole.TEACHER] },
    })

    // Generate a new token with the updated roles
    const token = await generateToken({
      id: updatedUser.id,
      fullname: updatedUser.fullname,
      email: updatedUser.email,
      roles: updatedUser.roles,
    })

    if (!token) {
      return res.status(500).json({
        success: false,
        message: 'Something went wrong while generating the token',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Successfully registered as a teacher',
      user: {
        id: updatedUser.id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        roles: updatedUser.roles,
        token,
      },
    })
  } catch (error: any) {
    console.error('Error during teacher registration:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    })
  }
}




