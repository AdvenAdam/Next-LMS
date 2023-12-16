'use client'

import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import ConfirmModal from '@/components/modals/confirm-modals'
import { useRouter } from 'next/navigation'

interface ActionsProps {
  disabled: Boolean
  courseId: string
  isPublished: Boolean
}
const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/courses/${courseId}`)
      toast.success('Course Deleted')
      router.refresh()
      router.push(`/teacher/courses`)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  const onPush = async () => {
    try {
      setIsLoading(true)
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`)
        toast.success('Course UnPublish')
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`)
        toast.success('Course Publish')
      }
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPush}
        disabled={Boolean(disabled) || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'UnPublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button
          size="sm"
          disabled={isLoading}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
export default Actions
