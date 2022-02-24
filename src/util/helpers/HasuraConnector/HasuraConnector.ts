import {HasuraParams, HasuraResponse} from '@util/types/HasuraConnector'
import axios, {AxiosPromise} from 'axios'

/**
 * Connector to Hasura
 */
class HasuraConnector {
  /**
   * @param {Object} params containing query and variables
   * @return {promise} Promise call to hasura
   */
  static submit(params: HasuraParams): AxiosPromise<HasuraResponse> {
    const {query, variables} = params

    return axios.post(
        `${process.env.HASURA_URL}`,
        {query, variables},
        {
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': `${process.env.HASURA_SECRET}`,
          },
        }
    )
  }
}

export default HasuraConnector
