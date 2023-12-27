import { getDashboardCourses } from '@/actions/get-dashboard-courses'
import { CoursesList } from '@/components/courses-list'
import { Button } from '@/components/ui/button'
import { UserButton, auth } from '@clerk/nextjs'
import { Ban, Check, CheckCircle, Clock } from 'lucide-react'
import { redirect } from 'next/navigation'
import { InfoCard } from './_components/info-card'
import { TryButton } from '@/components/try-button'
import { Separator } from '@/components/ui/separator'

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
      <Separator />
      <h1>Try Button</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
          <div className="relative w-full aspect-video rounded-md overflow-hidden space-y-5">
            <p className="text-lg md:text-base font-medium group-hover:text-sky-700 transition">
              Size
            </p>
            <TryButton label="size default" />
            <TryButton
              label="size sm"
              size="sm"
            />
            <TryButton
              label="size lg"
              size="lg"
            />
          </div>
        </div>
        <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
          <p className="text-lg md:text-base font-medium group-hover:text-sky-700 transition pb-5">
            Variant
          </p>
          <div className="relative w-full aspect-video rounded-md overflow-scroll space-y-5">
            <TryButton label="variant default" />
            <TryButton
              label="variant success"
              variant="success"
            />
            <TryButton
              label="variant error"
              variant="destructive"
            />
            <TryButton
              label="variant secondary"
              variant="secondary"
            />
          </div>
        </div>
        <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
          <div className="relative w-full aspect-video rounded-md overflow-hidden space-y-5">
            <p className="text-lg md:text-base font-medium group-hover:text-sky-700 transition">
              Icon
            </p>
            <TryButton
              label="Icon Start"
              variant={'success'}
              icon={CheckCircle}
            />
            <TryButton
              label="Icon End"
              variant={'destructive'}
              iconPosition="end"
              icon={Ban}
            />
          </div>
        </div>
        <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
          <p className="text-lg md:text-base font-medium group-hover:text-sky-700 transition mb-5">
            Tooltip
          </p>
          <div className="relative w-full aspect-video rounded-md overflow-hidden  grid grid-cols-2">
            <TryButton
              label="atas"
              tooltipText="atas"
              tooltipPosition="top"
            />
            <TryButton
              label="bawah"
              tooltipText="bawah"
              tooltipPosition="bottom"
            />
            <TryButton
              label="kanan"
              tooltipText="kanan"
              tooltipPosition="right"
            />
            <TryButton
              label="kiri"
              tooltipText="kiri"
              tooltipPosition="left"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
