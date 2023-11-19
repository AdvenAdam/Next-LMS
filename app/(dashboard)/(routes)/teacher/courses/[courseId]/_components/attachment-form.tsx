'use client'

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'

import { File, Loader2, PlusCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Attachment, Course } from '@prisma/client'
import { FileUpload } from '@/components/file-upload'

interface AttachmentFormProps {
  initialData: Course & { attachment: Attachment[] }
  courseId: string
}

const formSchema = z.object({
  url: z.string().min(1),
})

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const toggleEdit = () => setIsEditing(!isEditing)

  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachment`, data)
      toast.success('Course updated')
      toggleEdit()
      router.refresh()
    } catch (error) {
      console.log('🚀 image-form  ~ error:', error)
      toast.error('Something went wrong')
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await axios.delete(`/api/courses/${courseId}/attachment/${id}`)
      toast.success('Attachment Deleted')
      router.refresh()
    } catch (error) {
      console.log('🚀 image-form  ~ error:', error)
      toast.error('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medum flex items-center justify-between">
        Course Attachments & Files
        <Button
          variant={'ghost'}
          onClick={toggleEdit}
        >
          {isEditing && 'Cancel'}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a File
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachment.length === 0 && (
            <p className="text-sm text-slate-500 italic">No Attachments yet</p>
          )}
          {initialData.attachment.length > 0 && (
            <div className="spce-y-2">
              {initialData.attachment.map(attachment => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 text-sky-700 border-sky-200 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={url => {
              if (url) {
                onSubmit({ url: url })
              } else {
                toast.error('Something went wrong')
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything you need to share with your students
          </div>
        </div>
      )}
    </div>
  )
}
