import { MutationTree } from 'vuex'
import ShopState from './ShopState'
import * as types from './mutation-types'

const mutations: MutationTree <ShopState> = {
  [types.SHOP_TOKEN_CHANGED] (state, payload) {
    state.token = payload.newToken
  },
  [types.REFUND_STATUS_CHANGED] (state, payload) {
    state.refundForAutoCancelledOrders = payload.status;
  },
  [types.ORDER_CONFIG_UPDATED] (state, payload) {
    state.orderSync = payload.config;
  },
  [types.INVENTORY_CONFIG_UPDATED] (state, payload) {
    state.inventoryFeed = payload.config;
  },
  [types.CONNECT_CONFIG_UPDATED] (state, payload) {
    state.connectConfig = payload.config;
  }
}
export default mutations;