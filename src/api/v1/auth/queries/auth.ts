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

export {
  checkExistingUser as CHECK_EXISTING_USER,
  createNewUser as CREATE_NEW_USER,
}
