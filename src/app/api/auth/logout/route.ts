import { cookies } from 'next/headers'

import authRequest from '~/apiRequests/auth'
import { HttpError } from '~/lib/http'

export async function POST() {
  const cookieStore = cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')

  if (!accessToken || !refreshToken) {
    return Response.json(
      { message: 'Không nhận được access token hoặc refresh token' },
      { status: 200 }
    )
  }

  try {
    const { payload } = await authRequest.sLogout({
      accessToken,
      refreshToken
    })

    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      const { payload } = error
      return Response.json(payload, { status: 200 })
    }

    return Response.json(
      { message: 'Lỗi khi gọi API đến server backend' },
      { status: 200 }
    )
  }
}
