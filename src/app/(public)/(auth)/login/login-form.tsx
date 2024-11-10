'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { toast } from '~/hooks/use-toast'
import { handleErrorApi } from '~/lib/utils'
import { useLoginMutation } from '~/queries/useAuth'
import { LoginBody, LoginBodyType } from '~/schemaValidations/auth.schema'

export default function LoginForm() {
  const router = useRouter()
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const loginMutation = useLoginMutation()

  const onSubmit = form.handleSubmit((body) => {
    if (loginMutation.isPending) return

    loginMutation.mutate(body, {
      onSuccess: ({ payload: { message } }) => {
        router.push('/manage/dashboard')
        toast({ description: message })
      },
      onError: (error) => handleErrorApi({ error, setError: form.setError })
    })
  })

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Đăng nhập</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className='w-full max-w-[600px] flex-shrink-0 space-y-2'
            noValidate
            onSubmit={onSubmit}
          >
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='m@example.com'
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Password</Label>
                      </div>
                      <Input
                        id='password'
                        type='password'
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
              <Button variant='outline' className='w-full' type='button'>
                Đăng nhập bằng Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
