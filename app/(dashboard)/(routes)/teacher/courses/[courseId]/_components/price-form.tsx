'use client'

import { useState } from 'react'
import * as z from 'zod'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Course } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/format'

interface PriceFormProps {
  initialData: Course
  courseId: string
}

const formSchema = z.object({
  price: z.coerce.number(),
})

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const toggleEdit = () => setIsEditing(!isEditing)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price || undefined,
    },
  })

  const { isSubmitting, isValid } = form.formState
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, data)
      toast.success('Course updated')
      toggleEdit()
      router.refresh()
    } catch (error) {
      console.log('🚀 description-form :59 ~ error:', error)
      toast.error('Something went wrong')
    }
  }
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medum flex items-center justify-between">
        Course Price
        <Button
          variant={'ghost'}
          onClick={toggleEdit}
        >
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit price
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.price?.toString().length && 'text-slate-500 italic'
          )}
        >
          {initialData.price?.toString().length
            ? formatPrice(initialData.price)
            : 'No price set'}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      type="number"
                      step={0.01}
                      placeholder="set a price for your course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
