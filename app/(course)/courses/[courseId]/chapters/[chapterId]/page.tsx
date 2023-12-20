import { getChapter } from '@/actions/get-chapter'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import Banner from '@/components/banner'
import { Preview } from '@/components/preview'

import { CourseEnrollButton } from './_components/course-enroll-button'
import { VideoPlayer } from './_components/video-player'
import { File } from 'lucide-react'

const ChapterIdPage = async ({
  params,
}: {
  params: { chapterId: string; courseId: string }
}) => {
  const { userId } = auth()
  if (!userId) {
    return redirect('/')
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId: params.courseId,
    chapterId: params.chapterId,
  })

  if (!chapter || !course) {
    return redirect('/')
  }

  const isLocked = !chapter.isFree && !purchase
  const completeOnEnd = !!purchase && !userProgress?.isCompleted

  const ChapterBanner = () => {
    return (
      <>
        {userProgress?.isCompleted && (
          <Banner
            variant={'success'}
            label="You already completed this chapter."
          />
        )}
        {isLocked && (
          <Banner
            variant={'warning'}
            label="You need to purchase this course to view this chapter."
          />
        )}
      </>
    )
  }

  const ChapterVideo = () => {
    return (
      <div className="p-4">
        <VideoPlayer
          chapterId={chapter.id}
          title={chapter.title}
          courseId={params.courseId}
          nextChapterId={nextChapter?.id}
          playbackId={muxData?.playbackId!}
          isLocked={isLocked}
          completeOnEnd={completeOnEnd}
        />
      </div>
    )
  }

  return (
    <div>
      <ChapterBanner />
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <ChapterVideo />
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
          {purchase ? (
            // TODO: add Progress course
            <></>
          ) : (
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price!}
            />
          )}
        </div>
        <Separator />
        <div className="">
          <Preview value={chapter.description!} />
        </div>
        {!!attachments && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map(attachment => (
                <a
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                >
                  <File />
                  <p className="line-clamp-1">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default ChapterIdPage
