import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import Mux from '@mux/mux-node'
import { NextResponse } from 'next/server'

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
)
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId } = params

    if (!userId) {
      return new NextResponse('Unauthorized', {
        status: 401,
      })
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    })

    if (!course) {
      return new NextResponse('Not Found', {
        status: 404,
      })
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId)
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
      },
    })

    return NextResponse.json(deletedCourse)
  } catch (error) {
    console.log('[COURSEID] DELETE ERROR:', error)
    return new NextResponse('Internal Error', {
      status: 500,
    })
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const data = await req.json()
    console.log('🚀 ~ file: route.ts:72 ~ data:', data)

    if (!userId) {
      return new NextResponse('Unauthorized', {
        status: 401,
      })
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: {
        ...data,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log('[COURSEID] PATCH ERROR:', error)
    return new NextResponse('Internal Error', {
      status: 500,
    })
  }
}
