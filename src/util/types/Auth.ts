enum oAuthProviders {
  GOOGLE = 'google',
  GITHUB = 'github',
}

type AuthUser = {
  auth_identifier: string
  name: string
  provider: string
}

type AuthSession = {
  provider: string
  response: AuthResponse
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuthResponse = Record<string, any>

type GithubUserResponse = {
  id: number
  name: string
}

export {
  oAuthProviders,
  AuthUser,
  AuthSession,
  AuthResponse,
  GithubUserResponse,
}
