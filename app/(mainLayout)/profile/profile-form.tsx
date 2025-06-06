'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'next-auth'
import { useState } from 'react'
import { toast } from 'sonner'

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: '昵称至少需要2个字符',
  }).max(30, {
    message: '昵称不能超过30个字符',
  }),
  email: z.string().email({
    message: '请输入有效的邮箱地址',
  }),
  image: z.string().url({
    message: '请输入有效的图片URL',
  }).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name ?? '',
      email: user.email ?? '',
      image: user.image ?? '',
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('更新失败')
      }

      toast.success('个人信息更新成功')
    } catch (error) {
      console.error('更新失败', error)
      toast.error('更新失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel>头像</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={field.value} alt={user.name || '用户头像'} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <Input
                    placeholder="输入头像URL"
                    {...field}
                    className="max-w-xs"
                  />
                </div>
              </FormControl>
              <FormDescription>
                输入图片URL来更新你的头像
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>昵称</FormLabel>
              <FormControl>
                <Input placeholder="输入你的昵称" {...field} />
              </FormControl>
              <FormDescription>
                这是你的公开显示名称
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input placeholder="输入你的邮箱" {...field} />
              </FormControl>
              <FormDescription>
                用于接收通知和找回密码
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : '保存更改'}
        </Button>
      </form>
    </Form>
  )
} 