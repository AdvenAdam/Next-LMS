'use client'

import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import ConfirmModal from '@/components/modals/confirm-modals'
import { useRouter } from 'next/navigation'

interface ChapterActionsProps {
  disabled: Boolean
  courseId: string
  chapterId: string
  isPublished: Boolean
}
const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const onDelete = async () => {
    try {
      setIsLoading(true)
      console.log('🚀 ~ file: chapter-actions.tsx:29 ~ onDelete ~ true:', true)
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
      toast.success('Chapter Deleted')
      router.refresh()
      router.push(`/teacher/courses/${courseId}`)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => {}}
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
export default ChapterActions
