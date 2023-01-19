import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import ShopState from './ShopState'
import * as types from './mutation-types'
import { getConfiguration, setConfiguration, } from '@/services'
import { hasError } from '@/utils'
import { getSessionToken } from "@shopify/app-bridge-utils";
import createApp from "@shopify/app-bridge";

const actions: ActionTree<ShopState, RootState> = {
  setShopToken({ commit }, payload) {
    commit(types.SHOP_TOKEN_UPDATED, { token: payload.token })
  },
  async setConfiguration ({ commit, state }, payload) {
    let resp;

    console.log("token", state.token);
    // TODO Improve this code
    const app = createApp({
      apiKey: state.config.clientId,
      host: state.config.host,
    });
    const sessionToken = await getSessionToken(app);
    console.log("sessionToken", sessionToken);

    try {
      resp = await setConfiguration({
        'session': sessionToken,
        'clientId': state.config.clientId,
        'shop': state.shop,
        'instanceAddress': payload.url,
        'instanceToken': payload.token
      })
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
        commit(types.CONFIG_UPDATED, { config: { ...resp.data, clientId: payload.clientId, host: payload.host } })
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