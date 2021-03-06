import types from '~/types'
import mixin from './mixin'

import { createLogger } from '#/lib/logger'

const logger = createLogger('zcoin:network:mint')

export default {
    ...mixin,
    ...({
        namespace: 'Mint',
        collection: 'mint',
        subscriptions: ['mintStatus'],

        mutations: {
            [types.mint.DO_MINT]: 'mint'
        },

        convertToDenominationAmountPair (list, key) {
            let out = {}

            list.forEach((pair) => {
                const { amount } = pair
                out[pair[key]] = amount
            })

            return out
        },

        mint (payload) {
            const { auth, data } = payload
            const { passphrase = null } = auth

            const { denominations } = data
            const denoms = this.convertToDenominationAmountPair(denominations, 'denomination')

            logger.info('MINTING %o', denoms)

            this.send({
                type: 'create',
                data: {
                    denominations: denoms
                },
                auth: {
                    passphrase
                }
            }, {
                onSuccess: types.mint.ON_MINT_SUCCESS,
                onError: types.mint.ON_MINT_ERROR
            })
        }
    })
}
