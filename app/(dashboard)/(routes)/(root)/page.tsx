import { getDashboardCourses } from '@/actions/get-dashboard-courses'
import { CoursesList } from '@/components/courses-list'
import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import { Check, Clock } from 'lucide-react'
import { redirect } from 'next/navigation'
import { InfoCard } from './_components/info-card'

export default async function Dashboard() {
  const { userId } = auth()
  if (!userId) {
    return redirect('/')
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  )

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItem={coursesInProgress.length}
        />
        <InfoCard
          icon={Check}
          label="Completed"
          variant="success"
          numberOfItem={completedCourses.length}
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  )
}
