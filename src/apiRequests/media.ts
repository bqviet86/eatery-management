import http from '~/lib/http'
import { UploadImageResType } from '~/schemaValidations/media.schema'

const mediaRequest = {
  uploadImage: (body: FormData) =>
    http.post<UploadImageResType>('/media/upload', body)
}

export default mediaRequest
