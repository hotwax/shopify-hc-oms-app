import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import ShopState from './ShopState'
import * as types from './mutation-types'
import { getConfiguration, setConfiguration, } from '@/services'
import { hasError } from '@/utils'

const actions: ActionTree<ShopState, RootState> = {
  setShopToken({ commit }, payload) {
    commit(types.SHOP_TOKEN_UPDATED, { token: payload.token })
  },
  async setConfiguration ({ commit }, payload) {
    let resp;

    try {
      resp = await setConfiguration(payload)
      // TODO Update specific payload
      if (resp.status === 200 && !hasError(resp)) {
        commit(types.CONFIG_UPDATED, { config: payload })
      } else {
        // TODO
      }
    } catch(error){
      console.log(error)
      // TODO showToast(translate("Something went wrong"));
    }
    // TODO Handle specific error
    return resp;
  },
  async getConfiguration ({ commit }, payload) {
    let resp;

    try {
      resp = await getConfiguration(payload)
      if (resp.status === 200 && !hasError(resp)) {
        commit(types.CONFIG_UPDATED, { config: resp.data })
      } else {
        //showing error whenever getting no products in the response or having any other error
        // showToast(translate("Product not found"));
      }
    } catch(error){
      console.log(error)
      // showToast(translate("Something went wrong"));
    }
    // TODO Handle specific error
    return resp;
  },
  setShop({ commit }, payload) {
    commit(types.SHOP_UPDATED, { shop: payload.shop })
  }
}
export default actions;