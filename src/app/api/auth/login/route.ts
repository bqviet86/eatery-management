import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

import authRequest from '~/apiRequests/auth'
import { LoginBodyType, TokenPayload } from '~/schemaValidations/auth.schema'
import { HttpError } from '~/lib/http'

export async function POST(req: Request) {
  const body = (await req.json()) as LoginBodyType
  const cookieStore = cookies()

  try {
    const { payload } = await authRequest.sLogin(body)
    const { accessToken, refreshToken } = payload.data
    const { exp: accessTokenExp } = jwtDecode<TokenPayload>(accessToken)
    const { exp: refreshTokenExp } = jwtDecode<TokenPayload>(refreshToken)

    cookieStore.set('accessToken', accessToken, {
      path: '/',
      expires: accessTokenExp * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      expires: refreshTokenExp * 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    })

    return Response.json(payload)
  } catch (error) {
    if (error instanceof HttpError) {
      const { status, payload } = error
      return Response.json(payload, { status })
    }

    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}
