import { z } from 'zod'

export const signupSchema = z.object({
  fullname: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
  roles: z.array(z.enum(['0', '1', '2'])).optional(),
})


export type SignupSchemaType = z.infer<typeof signupSchema>

export const signinSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
})

export type SigninSchemaType = z.infer<typeof signinSchema>

export const teacherSignupSchema = z.object({
  id: z.string()
})

export type TeacherSignupSchemaType = z.infer<typeof teacherSignupSchema>

export interface TokenPayload {
  id: string
  fullname: string
  email: string
  roles: string[]
}

