import { Request, Response, NextFunction } from 'express'
import STATUS_CODES from '../httpStatusCode'
import axios from 'axios'
import { oauth2Client } from '../utils/googleConfig'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config() 

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET as string



export const googleLoginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const code = req.query.code as string

  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const userRes = await axios.get(
      'https://www.googleapis.com/oauth2/v1/userinfo',
      {
        params: { alt: 'json', access_token: tokens.access_token },
      }
    )

   
    const { email, name} = userRes.data

    res.locals.userData = { email, name, googleId: tokens.id_token }

    next()
  } catch (err) {
    console.error('Google login error:', err)
    res.status(500).json({
      message: 'Internal Server Error',
    })
  }
}


export const handleAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
   

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.' })
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    req.userDetails = decoded

    next() 
  } catch (error) {
    console.log(error, ' : erros ')
    res.status(401).json({ message: 'Invalid token.' })
  }
}







