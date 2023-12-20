import { db } from '@/lib/db'
import { promises } from 'dns'

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    })

    const publishedChapterIds = publishedChapters.map(chapter => chapter.id)
    const validCompletedChapter = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    })

    const progressPercentage =
      (validCompletedChapter / publishedChapterIds.length) * 100

    return progressPercentage
  } catch (error) {
    console.log('🚀 ~ file: get-progress.tsx:11 ~ GET PROGRESS:', error)
    return 0
  }
}