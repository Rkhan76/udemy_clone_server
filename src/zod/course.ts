import { z } from "zod"

export const createCourseSchema = z.object({
  title: z.string().min(1, { message: 'Min one letter is required' }),
})

export type CreateCourseSchemaType = z.infer<typeof createCourseSchema>
