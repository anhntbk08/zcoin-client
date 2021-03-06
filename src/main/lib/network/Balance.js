import mixin from './mixin'

export default {
    ...mixin,
    ...({
        namespace: 'Balance',
        initialRequestType: 'get',
        collection: 'balance',
        subscriptions: ['balance']
    })
}
