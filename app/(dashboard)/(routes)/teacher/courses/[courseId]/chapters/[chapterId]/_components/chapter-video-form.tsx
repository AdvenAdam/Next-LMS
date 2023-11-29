'use client'

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import MuxPlayer from '@mux/mux-player-react'
import { Pencil, PlusCircle, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Chapter, MuxData } from '@prisma/client'
import { FileUpload } from '@/components/file-upload'

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null }
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
})

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing(!isEditing)

  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, data)
      toast.success('Chapter updated')
      toggleEdit()
      router.refresh()
    } catch (error) {
      console.log('🚀 image-form :59 ~ error:', error)
      toast.error('Something went wrong')
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medum flex items-center justify-between">
        Course Image
        <Button
          variant={'ghost'}
          onClick={toggleEdit}
        >
          {isEditing && 'Cancel'}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId || ''} />
          </div>
        ))}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={url => {
              if (url) {
                onSubmit({ videoUrl: url })
              } else {
                toast.error('Something went wrong')
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            {"Upload this chapter's video"}
          </div>
        </div>
      )}
      {!isEditing && initialData.videoUrl && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  )
}