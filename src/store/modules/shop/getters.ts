import { GetterTree } from 'vuex'
import ShopState from './ShopState'
import RootState from '@/store/RootState'

const getters: GetterTree <ShopState, RootState> = {
  getShopToken (state) {
    return state.token
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