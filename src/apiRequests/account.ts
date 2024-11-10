import http from '~/lib/http'
import { AccountResType } from '~/schemaValidations/account.schema'

const accountRequest = {
  getMe: () => http.get<AccountResType>('/accounts/me')
}

export default accountRequest
