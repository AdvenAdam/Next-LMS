'use client'
import { cn } from '@/lib/utils'
import axios from 'axios'

import { useConfettiStore } from '@/hooks/use-confetti-store'
import MuxPlayer from '@mux/mux-player-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import toast from 'react-hot-toast'
import { Loader2, Lock } from 'lucide-react'

interface VideoPlayerprops {
  chapterId: string
  title: string
  courseId: string
  nextChapterId?: string
  playbackId?: string
  isLocked: boolean
  completeOnEnd: boolean
}

export const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerprops) => {
  const [isReady, setIsReady] = useState(false)
  return (
    <div className="relative aspect-video">
      {!isLocked && !isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="w-8 h-8 " />
          <p className="text-sm">This Chapter is Lock</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && 'hidden')}
          onCanPlay={() => setIsReady(true)}
          onEnded={() => {}}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  )
}
