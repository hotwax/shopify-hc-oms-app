import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import UserState from './UserState'

const actions: ActionTree<UserState, RootState> = {

  async refundOnCancelledOrderUpdate ({ state }) {
    state.refundForAutoCancelledOrders = !state.refundForAutoCancelledOrders
  }

}
export default actions;