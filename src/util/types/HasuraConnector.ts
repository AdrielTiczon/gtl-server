interface HasuraParams {
  query: string
  variables?: Record<string, unknown>
}

interface HasuraResponse {
  data: {
    users: HasuraUsersResponse[]
    add_user: HasuraAddUserResponse
    insert_token: HasuraInsertTokenResponse
  }
}

type HasuraUsersResponse = {
  id: string
  name: string
  auth_identifier: string
}

type HasuraAddUserResponse = {
  id: string
  name: string
  auth_identifier: string
}

type HasuraInsertTokenResponse = {
  session_id: string
}

export {
  HasuraParams,
  HasuraResponse,
  HasuraUsersResponse,
  HasuraAddUserResponse,
}
