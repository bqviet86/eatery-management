import http from '~/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType
} from '~/schemaValidations/auth.schema'

const authRequest = {
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: ''
    }),
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  logout: () => http.post('/api/auth/logout', null, { baseUrl: '' }),
  sLogout: ({
    accessToken,
    refreshToken
  }: LogoutBodyType & { accessToken: string }) =>
    http.post(
      '/auth/logout',
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
}

export default authRequest
