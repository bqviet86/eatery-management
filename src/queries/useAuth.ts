import { useMutation } from '@tanstack/react-query'

import authRequest from '~/apiRequests/auth'

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authRequest.login
  })
}
