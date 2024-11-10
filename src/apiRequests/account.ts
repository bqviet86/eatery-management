import http from '~/lib/http'
import {
  AccountResType,
  UpdateMeBodyType
} from '~/schemaValidations/account.schema'

const accountRequest = {
  getMe: () => http.get<AccountResType>('/accounts/me'),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>('/accounts/me', body)
}

export default accountRequest
