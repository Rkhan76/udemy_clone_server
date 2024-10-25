import { z } from 'zod'

export const signupSchema = z.object({
  fullname: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().optional(),
  roles: z.array(z.enum(['0', '1', '2'])).optional(),
})


export type SignupSchemaType = z.infer<typeof signupSchema>
