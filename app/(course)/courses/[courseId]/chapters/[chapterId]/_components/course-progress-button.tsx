'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useConfettiStore } from '@/hooks/use-confetti-store'

import { CheckCircle, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface CourseProgressButtonProps {
  chapterId: string
  courseId: string
  isCompleted?: boolean
  nextChapterId?: string
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter()
  const confetti = useConfettiStore()
  const [isLoading, setIsLoading] = useState(false)

  const onClick = async () => {
    try {
      setIsLoading(true)

      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      )

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen()
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }

      toast.success('Success!, Progress Updated.')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  const Icon = isCompleted ? PlayCircle : CheckCircle
  return (
    <Button
      type="button"
      variant={isCompleted ? 'outline' : 'success'}
      className="w-full md:w-auto"
      disabled={isLoading}
      onClick={onClick}
    >
      {isCompleted ? 'Continue' : 'Mark as Completed'}
      <Icon className="w-4 h-4 ml-2" />
    </Button>
  )
}
