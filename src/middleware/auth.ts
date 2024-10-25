import { Request, Response, NextFunction } from 'express'
import STATUS_CODES from '../httpStatusCode'
import axios from 'axios'
import { oauth2Client } from '../utils/googleConfig'

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
