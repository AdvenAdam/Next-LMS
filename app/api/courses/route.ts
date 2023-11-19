import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { title } from 'process'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    const { title } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', {
        status: 401,
      })
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log('🚀 ~ file: route.ts:5  Courses ~ error:', error)
    return new NextResponse('Internal Error', {
      status: 500,
    })
  }
}
