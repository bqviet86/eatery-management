import { useMutation } from '@tanstack/react-query'

import authRequest from '~/apiRequests/auth'

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authRequest.login
  })
}

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authRequest.logout
  })
}
