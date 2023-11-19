import { generateComponents } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'
import { UTApi } from 'uploadthing/server'
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>()
