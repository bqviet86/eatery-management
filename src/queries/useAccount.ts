import { useMutation, useQuery } from '@tanstack/react-query'

import accountRequest from '~/apiRequests/account'

export const useGetMeQuery = () => {
  return useQuery({
    queryKey: ['account-me'],
    queryFn: accountRequest.getMe
  })
}

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountRequest.updateMe
  })
}
