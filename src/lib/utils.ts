import { UseFormSetError } from 'react-hook-form'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { toast } from '~/hooks/use-toast'
import { EntityError, HttpError } from '~/lib/http'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizePath(path: string) {
  return path.startsWith('/') ? path.slice(1) : path
}

export function handleErrorApi({
  error,
  setError
}: {
  error: any
  setError?: UseFormSetError<any>
}) {
  if (error instanceof EntityError && setError) {
    const { errors } = error.payload
    errors.forEach(({ field, message }, index) =>
      setError(field, { message }, { shouldFocus: index === 0 })
    )
  } else {
    toast({
      title: 'Lỗi',
      description:
        error instanceof HttpError
          ? error.payload.message
          : 'Lỗi không xác định',
      variant: 'destructive'
    })
  }
}

const isBrowser = typeof window !== 'undefined'

// export function getUserFromLS() {
//   const result = localStorage.getItem('user')
//   return result ? (JSON.parse(result) as User) : null
// }

export function getAccessTokenFromLS() {
  return isBrowser ? localStorage.getItem('accessToken') : null
}

export function setAccessTokenToLS(token: string) {
  if (isBrowser) localStorage.setItem('accessToken', token)
}

export function removeAccessTokenFromLS() {
  if (isBrowser) localStorage.removeItem('accessToken')
}

export function getRefreshTokenFromLS() {
  return isBrowser ? localStorage.getItem('refreshToken') : null
}

export function setRefreshTokenToLS(token: string) {
  if (isBrowser) localStorage.setItem('refreshToken', token)
}

export function removeRefreshTokenFromLS() {
  if (isBrowser) localStorage.removeItem('refreshToken')
}
