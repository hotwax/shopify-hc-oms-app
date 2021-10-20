import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import ShopState from './ShopState'
import * as types from './mutation-types'
import services from '@/services'
import { hasError, showToast } from '@/utils'

const actions: ActionTree<ShopState, RootState> = {
  async setConfiguration ({ commit }, payload) {
    let resp;

    try {
      resp = await services.setConfiguration(payload)
      console.log(resp)
      // resp.data.response.numFound tells the number of items in the response
      if (resp.status === 200 && !hasError(resp)) {
        console.log(resp.data)
        // let products = resp.data;
        // const totalProductsCount = resp.data.response.numFound;

        // if (payload.viewIndex && payload.viewIndex > 0) products = state.products.list.concat(products)
        // commit(types.CONFIG_UPDATED, { config: payload })
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
  }
}
export default actions;