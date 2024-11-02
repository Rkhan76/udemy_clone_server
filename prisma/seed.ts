import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.category.createMany({
      data : [
      { name: 'Computer Science' },
      { name: 'Data Science' },
      { name: 'Web Development' },
      { name: 'Mobile Development' },
      { name: 'AI & Machine Learning' },
      { name: 'Cloud Computing' },
      { name: 'Cybersecurity' },
      { name: 'Blockchain' },
      { name: 'UI/UX Design' },
      { name: 'Business & Finance' },
      { name: 'Marketing & SEO' },
    ]
    })

    console.log('successfull seed')
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1) // Exit the process with failure
  } finally {
    await prisma.$disconnect() // Ensure the client is disconnected
  }
}

main().catch((e) => {
  console.error('Unexpected error:', e)
  process.exit(1)
})
