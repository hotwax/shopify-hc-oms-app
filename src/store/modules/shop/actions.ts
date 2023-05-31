import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import ShopState from './ShopState'
import * as types from './mutation-types'
import { getConfiguration, setConfiguration, } from '@/services'
import { hasError, showToast } from '@/utils'
import { getSessionToken } from "@shopify/app-bridge-utils";
import createApp from "@shopify/app-bridge";
import { translate } from '@/i18n'

const actions: ActionTree<ShopState, RootState> = {
  setShopToken({ commit }, payload) {
    commit(types.SHOP_TOKEN_UPDATED, { token: payload.token })
  },
  async setConfiguration ({ commit, state }, payload) {
    let resp;

    // TODO Improve this code
    const app = createApp({
      apiKey: state.config.clientId,
      host: state.config.host,
    });
    const sessionToken = await getSessionToken(app);

    try {
      resp = await setConfiguration({
        'session': sessionToken,
        'clientId': state.config.clientId,
        'shop': state.shop,
        'instanceAddress': payload.instanceAddress,
        'instanceToken': payload.instanceToken
      })
      // TODO Update specific payload
      if (resp.status === 200 && !hasError(resp)) {
        commit(types.CONFIG_UPDATED, { config: payload })
        showToast(translate('HotWax Commerce connection settings updated'))
      } else {
        showToast(translate("Something went wrong"));
        return Promise.reject(resp);
      }
    } catch(error){
      console.error(error)
      showToast(translate("Something went wrong"));
      return Promise.reject(resp);
    }
    return resp;
  },
  async getConfiguration ({ commit }, payload) {
    let resp;

    try {
      resp = await getConfiguration(payload)
      if (resp.status === 200 && !hasError(resp)) {
        commit(types.CONFIG_UPDATED, { config: { ...resp.data, clientId: payload.clientId, host: payload.host } })
      } else {
        showToast(translate("Something went wrong while getting current configuration"));
      }
    } catch(error){
      console.error(error)
      showToast(translate("Something went wrong while getting current configuration"));
    }
    return resp;
  },
  setShop({ commit }, payload) {
    commit(types.SHOP_UPDATED, { shop: payload.shop })
  }
}
export default actions;