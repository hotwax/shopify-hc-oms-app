import { GetterTree } from 'vuex'
import UserState from './UserState'
import RootState from '@/store/RootState'

const getters: GetterTree <UserState, RootState> = {
  isAuthenticated (state) {
    return !!state.token;
  },
  isUserAuthenticated(state) {
    return state.token && state.current
  },
  getUserToken (state) {
    return state.token
  },
  getUserProfile (state) {
    return state.current
  },
  getRefundStatus (state) {
    return state.refundForAutoCancelledOrders;
  },
  getInventoryConfig (state) {
    return state.inventoryFeed;
  },
  getConnectConfig (state) {
    return state.connectConfig;
  },
  getOrderConfig (state) {
    return state.orderSync;
  }
}
export default getters;