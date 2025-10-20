'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { experienceSchema, ExperienceSchemaType } from '@/schemas/user/experience'
import { tryCatch } from '@/hooks/use-try-catch'
import { createExperienceAction } from '@/server/actions/user/experience'
import { Slider } from '@/components/ui/slider-tooltip'

const CreateExperienceForm = () => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  //   Form Zod validation.
  const form = useForm<ExperienceSchemaType>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      rating: 3,
      comment: '',
    },
  })

  // Data for the slider
  const emojis = ['😡', '🙁', '😐', '🙂', '😍']
  const labels = ['Awful', 'Poor', 'Okay', 'Good', 'Amazing']

  //   call server action to submit form
  function onSubmit(values: ExperienceSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createExperienceAction(values))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset({
          rating: 3, // Reset to the default value
          comment: '',
        })
        // We'll keep the redirect, but you can change this path as needed
        router.push('/')
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Rating Slider */}
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate your experience</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Slider
                    value={[field.value]} // Slider expects an array
                    onValueChange={(value) => {
                      field.onChange(value[0]) // Update the form state with the new rating
                    }}
                    min={1}
                    max={5}
                    step={1}
                    showTooltip
                    tooltipContent={(value) => labels[value - 1]}
                    aria-label="Rate your experience"
                  />
                </FormControl>
                <span className="text-2xl">{emojis[field.value - 1]}</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Comment Textarea */}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about your experience..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Please wait...
            </>
          ) : (
            <>
              <PlusIcon />
              Create Rating
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateExperienceForm
