import { db } from '@/lib/db'
import { Category, Chapter, Course } from '@prisma/client'
import { tree } from 'next/dist/build/templates/app-page'
import { getProgress } from './get-progress'

type CourseWithProgressWithCategory = Course & {
  category: Category
  chapters: Chapter[]
  progress: number | null
}

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[]
  coursesInProgress: CourseWithProgressWithCategory[]
}
export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const purchasedCourse = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    })

    const courses = purchasedCourse.map(
      purchase => purchase.course
    ) as CourseWithProgressWithCategory[]

    for (let course of courses) {
      const progress = await getProgress(userId, course.id)
      course['progress'] = progress
    }

    const completedCourses = courses.filter(course => course.progress === 100)
    const coursesInProgress = courses.filter(
      course => (course.progress ?? 0) < 100
    )

    return {
      completedCourses,
      coursesInProgress,
    }
  } catch (error) {
    console.log(
      '🚀 ~ file: get-dashboard-courses.ts:19 ~ GET_DASHBOARD_ERROR:',
      error
    )
    return {
      completedCourses: [],
      coursesInProgress: [],
    }
  }
}
