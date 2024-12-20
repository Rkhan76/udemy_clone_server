import bcrypt from 'bcrypt'
import { TokenPayload } from '../zod/auth'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

if (!JWT_SECRET) {
  throw new Error('JWT secret not provided')
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

export const generateToken = ({
  id,
  fullname,
  email,
  roles,
}: TokenPayload): string => {
  try {
    const payload = { id, fullname, email, roles }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
    return token
  } catch (error) {
    console.error('Error generating token:', error)
    throw new Error('Could not generate token')
  }
}

