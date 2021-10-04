import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import ShopState from './ShopState'
import * as types from './mutation-types'

const actions: ActionTree<ShopState, RootState> = {

  async refundOnCancelledOrderUpdate ({ state }) {
    state.refundForAutoCancelledOrders = !state.refundForAutoCancelledOrders
  },
  async updateInventoryConfiguration ({ commit }, payload) {
    commit(types.INVENTORY_CONFIG_UPDATED, { config: payload })
  },
  async updateOrderConfiguration ({ commit }, payload) {
    commit(types.ORDER_CONFIG_UPDATED, { config: payload })
  },
  async updateConnectConfiguration ({ commit }, payload) {
    commit(types.CONNECT_CONFIG_UPDATED, { config: payload })
  }
}
export default actions;