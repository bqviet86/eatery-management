import { useMutation } from '@tanstack/react-query'

import mediaRequest from '~/apiRequests/media'

export const useUploadImageMutation = () => {
  return useMutation({
    mutationFn: mediaRequest.uploadImage
  })
}
