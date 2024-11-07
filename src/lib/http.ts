import { redirect } from 'next/navigation'
import urlJoin from 'url-join'

import { envConfig } from '~/config'
import { normalizePath } from '~/lib/utils'
import { LoginResType } from '~/schemaValidations/auth.schema'

type HttpRes<Payload = any> = {
  status: number
  payload: Payload
}

class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }

  constructor({ message, status, payload }: HttpRes & { message?: string }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS = ENTITY_ERROR_STATUS
  payload: EntityErrorPayload

  constructor(payload: EntityErrorPayload) {
    super({ status: ENTITY_ERROR_STATUS, payload })
    this.payload = payload
  }
}

const isClient = typeof window !== 'undefined'
let clientLogoutRequest: Promise<Response> | null = null

type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string
}

const request = async <Res>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options?: CustomOptions
) => {
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl || envConfig.NEXT_PUBLIC_URL
  const optionsBody = options?.body
  const isFormData = optionsBody instanceof FormData
  const baseHeaders: HeadersInit = isFormData
    ? {}
    : { 'Content-Type': 'application/json' }

  if (isClient) {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  let body: string | FormData | undefined = undefined

  if (isFormData) {
    body = optionsBody
  } else if (optionsBody) {
    body = JSON.stringify(optionsBody)
  }

  const fullUrl = urlJoin(baseUrl, url)

  const response = await fetch(fullUrl, {
    ...options,
    method,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
  })
  const payload = (await response.json()) as Res
  const data: HttpRes<Res> = {
    status: response.status,
    payload,
  }

  if (!response.ok) {
    switch (response.status) {
      case ENTITY_ERROR_STATUS:
        throw new EntityError(data.payload as EntityErrorPayload)
      case AUTHENTICATION_ERROR_STATUS: {
        if (isClient) {
          if (clientLogoutRequest === null) {
            clientLogoutRequest = fetch('/api/auth/logout', {
              method: 'POST',
              headers: baseHeaders,
              body: null,
            })

            try {
              await clientLogoutRequest
            } finally {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              clientLogoutRequest = null
              location.href = '/login'
            }
          }
        } else {
          const accessToken = (
            (options?.headers as any).Authorization as string
          ).split(' ')[1]
          redirect(`/logout?accessToken=${accessToken}`)
        }

        break
      }
      default:
        throw new HttpError(data)
    }
  }

  if (isClient && response.ok) {
    const normalizePathUrl = normalizePath(url)

    if (['api/auth/login'].includes(normalizePathUrl)) {
      const { accessToken, refreshToken } = (payload as LoginResType).data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    }

    if (['api/auth/logout'].includes(normalizePathUrl)) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  return data
}

type HttpOptions = Omit<CustomOptions, 'body'>

const http = {
  get: <Res>(url: string, options?: HttpOptions) =>
    request<Res>('GET', url, options),
  post: <Res>(url: string, body?: any, options?: HttpOptions) =>
    request<Res>('POST', url, { ...options, body }),
  put: <Res>(url: string, body?: any, options?: HttpOptions) =>
    request<Res>('PUT', url, { ...options, body }),
  patch: <Res>(url: string, body?: any, options?: HttpOptions) =>
    request<Res>('PATCH', url, { ...options, body }),
  delete: <Res>(url: string, options?: HttpOptions) =>
    request<Res>('DELETE', url, options),
}

export type { HttpRes }

export { HttpError, EntityError, isClient }

export default http
