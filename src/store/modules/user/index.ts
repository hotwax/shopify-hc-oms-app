import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import { Module } from 'vuex'
import UserState from './UserState'
import RootState from '@/store/RootState'

const userModule: Module<UserState, RootState> = {
    namespaced: true,
    state: {
      token: '',
      current: null,
      inventoryFeed: {
        host: '',
        port: '',
        userName: '',
        password: '',
        privateKey: '',
        directory: '',
        fileName: '',
        pollingFrequency: ''
      },
      orderUpdates: {
        refundForAutoCancelledOrders: false
      },
      orderSync: {
        templateShipmentMap: '',
        uploadShipmentMap: ''
      }
    },
    getters,
    actions,
    mutations,
}

export default userModule;

// TODO
// store.registerModule('user', userModule);
