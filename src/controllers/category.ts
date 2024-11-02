import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()


export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
        orderBy:{
            name: 'asc'
        }
    })
    return res.status(200).json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return res.status(500).json({ message: 'Failed to fetch categories' })
  }
}
