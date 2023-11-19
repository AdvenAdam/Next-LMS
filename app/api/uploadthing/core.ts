import { auth } from '@clerk/nextjs'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { Course } from '@prisma/client'
const f = createUploadthing()
const handleAuth = () => {
  const { userId } = auth()
  console.log('🚀 ~ file: core.ts:7 ~ handleAuth ~ userId:', userId)
  if (!userId) {
    throw new Error('Unauthorized')
  } else {
    console.log('🚀 ~ file: core.ts:7 ~ handleAuth ~ userId:', userId)
    return { userId }
  }
}

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileSize: '16MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
