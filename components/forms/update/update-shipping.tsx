'use client'

import React, { useId, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SaveAllIcon, SparklesIcon } from 'lucide-react'
import { tryCatch } from '@/hooks/use-try-catch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { Province, ShippingAddressType } from '@/lib/generated/prisma'
import { PhoneInput } from '@/components/ui/phone-input'
import { CountryDropdown } from '@/components/ui/country-input'
import { shippingSchema, ShippingSchemaType } from '@/schemas/user/shipping'
import { updateShippingAddressAction } from '@/server/actions/user/shipping'

export interface UpdateShippingFormProps {
  data: {
    id: string
    label: string
    type: string
    fullName: string
    phoneNumber: string
    country: string | null
    city: string
    postalCode: string
    suburb: string
    province: string
    streetAddress: string
    streetAddress2: string | null
    isDefault: boolean
  }
}

const UpdateShippingForm = ({ data }: UpdateShippingFormProps) => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  // switch id
  const id = useId()
  const switchId = useId()
  //   Form Zod validation.
  const form = useForm<ShippingSchemaType>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      label: data.label,
      type: data.type as ShippingSchemaType['type'],
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      country: data.country as ShippingSchemaType['country'],
      city: data.city,
      postalCode: data.postalCode,
      suburb: data.suburb,
      province: data.province as ShippingSchemaType['province'],
      streetAddress: data.streetAddress,
      streetAddress2: data.streetAddress2 ?? '',
      isDefault: data.isDefault,
    },
  })
  //   call server action to update data
  function onSubmit(values: ShippingSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateShippingAddressAction(values, data.id))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/account/shipping')
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* label */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Home" {...field} />
              </FormControl>
              <FormDescription>Give the address a label for quick access.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a address type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Type</SelectLabel>
                    {Object.keys(ShippingAddressType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* fullname */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* phoneNumber */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    value={field.value}
                    onChange={field.onChange}
                    defaultCountry="ZA"
                    international
                    countryCallingCodeEditable={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <CountryDropdown
                placeholder="Country"
                defaultValue={field.value}
                onChange={(country) => {
                  field.onChange(country.alpha3) // store alpha3 in DB
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* city */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* postalCode */}
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* suburb */}
        <FormField
          control={form.control}
          name="suburb"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suburb</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* province */}
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Province</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a province" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Province</SelectLabel>
                    {Object.keys(Province).map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* street */}
        <FormField
          control={form.control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streetAddress2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address 2</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* isDefault */}
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => {
            const fieldId = `${switchId}-isDefault`
            return (
              <FormItem>
                <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                  <FormControl>
                    <Switch
                      id={fieldId}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                      aria-describedby={`${id}-description`}
                    />
                  </FormControl>

                  <div className="flex grow items-center gap-3">
                    <SparklesIcon />

                    <div className="grid grow gap-2">
                      <Label htmlFor={id}>
                        Default{' '}
                        <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                          (address)
                        </span>
                      </Label>
                      <p id={`${id}-description`} className="text-muted-foreground text-xs">
                        Always ship to this address.
                      </p>
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              Please wait...
              <Spinner />
            </>
          ) : (
            <>
              Update Address
              <SaveAllIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateShippingForm
