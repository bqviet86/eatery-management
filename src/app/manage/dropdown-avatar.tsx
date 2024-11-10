'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { useGetMeQuery } from '~/queries/useAccount'
import { useLogoutMutation } from '~/queries/useAuth'
import { handleErrorApi } from '~/lib/utils'

export default function DropdownAvatar() {
  const router = useRouter()

  const { data: getMeResponse } = useGetMeQuery()
  const logoutMutation = useLogoutMutation()

  const account = getMeResponse?.payload.data || null

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      router.push('/')
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='overflow-hidden rounded-full'
        >
          {account && (
            <Avatar>
              <AvatarImage
                src={account.avatar ?? undefined}
                alt={account.name}
              />
              <AvatarFallback>
                {account.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {account && (
          <>
            <DropdownMenuLabel>{account.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href={'/manage/setting'}>Cài đặt</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
