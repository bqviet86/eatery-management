'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { getAccessTokenFromLS } from '~/lib/utils'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu'
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true
  }
]

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState<boolean>(false)

  useEffect(() => setIsAuth(!!getAccessTokenFromLS()), [])

  return menuItems.map(({ title, href, authRequired }) => {
    if (authRequired !== undefined && isAuth !== authRequired) return null

    return (
      <Link href={href} key={href} className={className}>
        {title}
      </Link>
    )
  })
}
