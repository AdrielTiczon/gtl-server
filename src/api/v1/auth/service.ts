import axios, {AxiosPromise} from 'axios'
import jwt from 'jsonwebtoken'

import HasuraConnector from '@util/helpers/HasuraConnector/HasuraConnector'
import {HasuraAddUserResponse, HasuraParams, HasuraUsersResponse} from '@util/types/HasuraConnector'
import {AuthResponse, AuthSession, AuthUser, GithubUserResponse, oAuthProviders} from '@util/types/Auth'
import {CHECK_EXISTING_USER, CREATE_NEW_USER, INSERT_NEW_TOKEN} from './queries/auth'

/**
 *  Handles the auth data between hasura and oauth
 */
class AuthService {
  /**
   * @param {object} session
   * @return {object}
   */
  parseOAuth(session: AuthSession): AuthUser {
    const {provider, response} = session
    const lookup = {
      [oAuthProviders.GOOGLE]: (p: string, r: AuthResponse) => this.#googleAuthHandler(p, r),
      [oAuthProviders.GITHUB]: async (p: string, r: AuthResponse) => await this.#githubAuthHandler(p, r),
    }
    return lookup[provider](provider, response)
  }

  /**
     * @param {string} provider
     * @param {object} response
     * @return {object}
     */
  #googleAuthHandler(provider: string, response: AuthResponse): AuthUser {
    const {id_token: token} = response
    const decodedJWT = jwt.decode(token)
    const {name, email} = decodedJWT as jwt.JwtPayload
    return {
      name,
      provider,
      auth_identifier: email,
    }
  }

  /**
     * @param {string} provider
     * @param {object} response
     * @return {object}
     */
  async #githubAuthHandler(provider: string, response: AuthResponse): Promise<AuthUser> {
    const {access_token: token} = response as jwt.JwtPayload
    const {data: {id, name}} = await this.#getGithubUserInfo(token)
    return {
      name,
      provider,
      auth_identifier: id.toString(),
    }
  }

  /**
   * function thats gets the github user info
   * @param {string} token
   * @return {promise}
   */
  #getGithubUserInfo(token: string): AxiosPromise<GithubUserResponse> {
    return axios.get('https://api.github.com/user', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`,
      },
    })
  }

  /**
   * @param {object} user
   */
  async verifyUser(user: AuthUser): Promise<HasuraUsersResponse> {
    const {auth_identifier: identifier, provider, name} = user

    const users = await this.#checkExistingUser(identifier, provider)

    if (users.length > 0) return users[0]

    const newUser = await this.#createNewUser(identifier, provider, name)

    return newUser
  }

  /**
   * @param {string} identifier
   * @param {string} provider
   * @return {object}
   */
  async #checkExistingUser(identifier, provider: string): Promise<HasuraUsersResponse[]> {
    const params = {
      query: CHECK_EXISTING_USER,
      variables: {
        identifier,
        provider,
      },
    }

    const {
      data: {
        data: {
          users,
        },
      }} = await HasuraConnector.submit(params)

    return users
  }

  /**
   * @param {string} identifier
   * @param {string} provider
   * @param {string} name
   * @return {objec}
   */
  async #createNewUser(identifier: string, provider: string, name: string): Promise<HasuraAddUserResponse> {
    const params: HasuraParams = {
      query: CREATE_NEW_USER,
      variables: {
        name,
        identifier: identifier.toString(),
        provider,
      },
    }
    const {data: {data: {add_user: users}}} = await HasuraConnector.submit(params)
    return users
  }

  /**
   *
   * @param {object} user
   * @param {string} sessionId
   */
  async generateToken(user: HasuraUsersResponse, sessionId: string) {
    if (!user) return null

    const hasGeneratedToken = this.#generateGameTokens(user, sessionId)

    if (!hasGeneratedToken) return null

    const basicToken = this.#generateBasicToken(sessionId)

    return basicToken
  }

  /**
   * @param {string} sessionId
   * @return {string}
   */
  #generateBasicToken(sessionId: string): string {
    const tokenInfo = {
      'sId': sessionId,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['basic token'],
        'x-hasura-default-role': 'basic token',
      },
    }
    const token = jwt.sign(tokenInfo, process.env.JWT_AT_SECRET as string, {algorithm: 'HS256', expiresIn: '5m'})
    return token
  }

  /**
   * @param {object} user
   * @param {string} sessionId
   * @return {string}
   */
  async #generateGameTokens(user: HasuraUsersResponse, sessionId: string): Promise<boolean> {
    const tokenInfo = {
      'uid': user.id,
      'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': ['player', 'basic token'],
        'x-hasura-default-role': 'player',
      },
    }
    const accessToken = jwt.sign(tokenInfo, process.env.JWT_AT_SECRET as string, {algorithm: 'HS256', expiresIn: '7d'})
    const refreshToken = jwt.sign(tokenInfo, process.env.JWT_RT_SECRET as string, {algorithm: 'HS256', expiresIn: '30d'})

    const params: HasuraParams = {
      query: INSERT_NEW_TOKEN,
      variables: {
        'access_token': accessToken,
        'refresh_token': refreshToken,
        'session_id': sessionId,
        'user_id': user.id,
      },
    }
    const {data: {data: {insert_token: insertToken}}} = await HasuraConnector.submit(params)

    if (insertToken.session_id) return true

    return false
  }
}

export default AuthService

