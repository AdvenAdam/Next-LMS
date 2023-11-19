const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient()

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: 'Computer Science' },
        { name: 'Music' },
        { name: 'Fitness' },
        { name: 'Cooking' },
        { name: 'Photography' },
        { name: 'Action' },
        { name: 'Enginering' },
        { name: 'Language' },
      ],
    })
    console.log('successfully seeded database')
  } catch (error) {
    console.log('🚀 ~ file: seed.ts:9 ~ main ~ error:', error)
  } finally {
    await database.$disconnect()
  }
}

main()
