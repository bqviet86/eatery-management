'use client'

import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload } from 'lucide-react'

import { envConfig } from '~/config'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { toast } from '~/hooks/use-toast'
import { HttpRes } from '~/lib/http'
import { handleErrorApi } from '~/lib/utils'
import { useUploadImageMutation } from '~/queries/useMedia'
import { useGetMeQuery, useUpdateMeMutation } from '~/queries/useAccount'
import {
  AccountResType,
  UpdateMeBody,
  UpdateMeBodyType
} from '~/schemaValidations/account.schema'

export default function UpdateProfileForm() {
  const queryClient = useQueryClient()
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar: envConfig.NEXT_PUBLIC_URL
    }
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>('')

  const avatarPreviewUrlRef = useRef<string>(avatarPreviewUrl)

  const { data: getMeResponse } = useGetMeQuery()
  const uploadImageMutation = useUploadImageMutation()
  const updateMeMutation = useUpdateMeMutation()

  const account = getMeResponse?.payload.data || null

  useEffect(() => {
    if (account) {
      const { name, avatar } = account

      form.reset({ name, ...(avatar && { avatar }) })
      setAvatarPreviewUrl(avatar ?? '')
    }
  }, [form, account])

  const handleChangeInputImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files

    if (!files) return

    const imageFile = files[0]
    const imageUrl = URL.createObjectURL(imageFile)

    setAvatarFile(imageFile)
    setAvatarPreviewUrl(imageUrl)
  }

  useEffect(() => {
    if (avatarPreviewUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreviewUrlRef.current)
    }

    avatarPreviewUrlRef.current = avatarPreviewUrl
  }, [avatarPreviewUrl])

  const onReset = () => {
    form.reset()
    setAvatarFile(null)
    setAvatarPreviewUrl(account?.avatar ?? '')
  }

  const onSubmit = form.handleSubmit(async ({ name }) => {
    if (uploadImageMutation.isPending || updateMeMutation.isPending) return

    try {
      const body: UpdateMeBodyType = { name }

      if (avatarFile) {
        const formData = new FormData()
        formData.append('file', avatarFile)

        const response = await uploadImageMutation.mutateAsync(formData)

        body.avatar = response.payload.data
        setAvatarFile(null)
      }

      const response = await updateMeMutation.mutateAsync(body)

      queryClient.setQueryData<HttpRes<AccountResType>>(
        ['account-me'],
        response
      )
      toast({ description: response.payload.message })
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  })

  return (
    <Form {...form}>
      <form
        noValidate
        className='grid auto-rows-max items-start gap-4 md:gap-8'
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <Card x-chunk='dashboard-07-chunk-0'>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='avatar'
                render={() => (
                  <FormItem>
                    <div className='flex items-start justify-start gap-2'>
                      <Avatar className='aspect-square h-[100px] w-[100px] rounded-md'>
                        <AvatarImage src={avatarPreviewUrl} />
                        <AvatarFallback className='rounded-none'>
                          {account?.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        id='upload-image-profile'
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleChangeInputImage}
                      />
                      <button
                        className='aspect-square w-[100px] rounded-md transition-colors hover:bg-muted'
                        type='button'
                      >
                        <label
                          htmlFor='upload-image-profile'
                          className='flex h-full w-full cursor-pointer items-center justify-center rounded-[inherit] border border-dashed transition-colors hover:border-muted-foreground'
                        >
                          <Upload className='h-4 w-4 text-muted-foreground' />
                          <span className='sr-only'>Upload</span>
                        </label>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='name'>Tên</Label>
                      <Input
                        id='name'
                        type='text'
                        className='w-full'
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className='flex items-center gap-2 md:ml-auto'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button size='sm' type='submit'>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
