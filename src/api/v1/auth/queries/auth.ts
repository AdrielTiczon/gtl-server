const checkExistingUser = `
  query checkExistingUser($identifier: String!, $provider: String!) {
    users(where: {auth_identifier: {_eq: $identifier}, provider: {_eq: $provider}}) {
      id
      name
      auth_identifier
    }
  }`

const createNewUser = `
  mutation createUser($identifier: String!, $name: String!, $provider: String!) {
    add_user: insert_users_one(object: {name: $name, auth_identifier: $identifier, provider: $provider}) {
      name
      id
      auth_identifier
    }
  }`

const insertUserToken = `
  mutation insertUserToken($access_token: String!, $refresh_token: String!, $session_id: String!, $user_id: uuid!) {
    insert_token: insert_u_token_one(object: {
      access_token: $access_token,
      refresh_token: $refresh_token,
      session_id: $session_id,
      user_id: $user_id,
      claimed: false
      }) {
      session_id
    }
  }
`

export {
  checkExistingUser as CHECK_EXISTING_USER,
  createNewUser as CREATE_NEW_USER,
  insertUserToken as INSERT_NEW_TOKEN,
}
