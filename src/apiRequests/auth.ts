import http from '~/lib/http'
import { LoginBodyType, LoginResType } from '~/schemaValidations/auth.schema'

const authRequest = {
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: ''
    }),
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body)
}

export default authRequest
