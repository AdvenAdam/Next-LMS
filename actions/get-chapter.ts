import { db } from '@/lib/db'
import {
  Attachment,
  Chapter,
  Course,
  MuxData,
  Purchase,
  UserProgress,
} from '@prisma/client'

interface GetChapterProps {
  courseId: string
  chapterId: string
  userId: string
}

interface GetChapterResult {
  chapter: Chapter | null
  course: Course | null
  muxData: MuxData | null
  attachments: Attachment[]
  nextChapter: Chapter | null
  userProgress: UserProgress | null
  purchase: Purchase | null
}

export const getChapter = async ({
  courseId,
  chapterId,
  userId,
}: GetChapterProps): Promise<GetChapterResult> => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    })

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    })

    if (!chapter || !course) {
      throw new Error('Chapter or course not found')
    }
    let muxData = null
    let attachments: Attachment[] = []
    let nextChapter: Chapter | null = null

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      })
    }

    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId,
        },
      })
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: 'asc',
        },
      })
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    })

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    }
  } catch (error) {
    console.log('🚀 ~ file: get-chapters.ts:15 ~ GET CHAPTER:', error)
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    }
  }
}
