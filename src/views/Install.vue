<template>
  <ion-page>
    <ion-content>
      <div class="install" v-if="!loader">
        <!-- Commented form tag as when using it the install page reloads again and
        then redirect to shopify -->
        <form>
          <ion-list>
            <Logo />
            <ion-item>
              <ion-label position="floating">{{ $t('Shop') }}</ion-label>
              <ion-input
                v-model="shopOrigin"
                name="shopOrigin"
                type="text"
                required
              />
            </ion-item>
          </ion-list>
          <div class="ion-padding">
            <ion-button type="submit" expand="block" @click="install(shopOrigin)">
              {{ $t('Install') }}
            </ion-button>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  onIonViewDidEnter
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Redirect } from "@shopify/app-bridge/actions";
import createApp from "@shopify/app-bridge";
import { showToast } from "@/utils";
import { useRouter } from "vue-router";
import { generateAccessToken, getApiKey } from "@/services"
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useStore } from "vuex";
import Logo from '@/components/Logo.vue';
import { loadingController } from '@ionic/vue';



export default defineComponent({
  name: "Install",
  components: {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    Logo
  },
  data() {
    return {
      loader: null as any,
      apiKey: '',
      shopOrigin: '',
      session: this.$route.query['session'],
      hmac: this.$route.query['hmac'],
      shop: this.$route.query['shop'],
      host: this.$route.query['host'] as string,
      locale: this.$route.query['locale'] || process.env.VUE_APP_I18N_LOCALE || process.env.VUE_APP_I18N_FALLBACK_LOCALE,
      timestamp: this.$route.query['timestamp'],
      code: this.$route.query['code'],
      state: this.$route.query['state'],
      embedded: this.$route.query['embedded']
    };
  },
  async mounted() {
    this.presentLoader();
    const shop: string = this.shop as string || this.shopOrigin
    this.store.dispatch('shop/setShop', {
      "shop": shop
    })
    if (this.session) {
      const apiKey = await this.getApiKey(shop);
      if (apiKey) {
        const app = createApp({
          apiKey,
          host: this.host,
        });
        const sessionToken = await getSessionToken(app);
        this.store.dispatch('shop/setShopToken', {
          "token": sessionToken
        })

        const resp = await this.store.dispatch('shop/getConfiguration', {
          "session": sessionToken,
          "clientId": apiKey,
          "shop": shop,
          "host": this.host
        })
        this.dismissLoader();
        if (resp.status) {
          this.$router.push("/configure");
        }
      } else {
        console.error('Api key not found')
        this.router.push('/')
      }
    } else if (this.code) {
      const apiKey = await this.getApiKey(shop);
      if (apiKey) {
        // TODO handle error case
        const resp = await generateAccessToken({
          "code": this.code,
          "shop": shop,
          "clientId": apiKey,
          "host": this.host,
          "hmac": this.hmac,
          "timestamp": this.timestamp,
          "state": this.state
        });
        // TODO: Add error message to the UI when status is false or there is some error in the resp
        if (resp) {
          const appURL = `https://${shop}/admin/apps/${apiKey}`;
          window.location.assign(appURL);
        }
      } else {
        console.error('Api key not found')
        this.router.push('/')
      }
    } else if (this.shop || this.host) {
      const query = JSON.parse(JSON.stringify(this.$route.query))
      if (this.embedded === "1") {
        // escape iframe
        // TODO Check if shop is missing when only getting the host
        delete query.embedded
        const updatedQuery = new URLSearchParams(query).toString()
        const redirectUri = process.env.VUE_APP_SHOPIFY_REDIRECT_URI;
        const url = new URL(decodeURIComponent(shop.startsWith("https") ? shop : `https://${shop}/`));
        if (url.hostname === location.hostname) {
          const apiKey = await this.getApiKey(shop);
          const app = await createApp({
            apiKey,
            host: this.host,
          });
          // Redirecting to same page, escaping iframe and removing embedded parameter
          Redirect.create(app).dispatch(Redirect.Action.REMOTE, redirectUri + "?" + updatedQuery);
        } else {
          // TODO Remove this. Fallback
          window.location.assign(redirectUri + "?" + updatedQuery);
        }
      } else {
        this.authorise(shop, this.host);
      }
    }
  },
  methods: {
    install(shopOrigin: any) {
      this.authorise(shopOrigin, undefined);
    },
    async authorise(shop: any, host: any) {
      const redirectUri = process.env.VUE_APP_SHOPIFY_REDIRECT_URI;
      const scopes = process.env.VUE_APP_SHOPIFY_SCOPES;
      const apiKey = await this.getApiKey(shop);
      if (apiKey) {
        const permissionUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;
        if (window.top == window.self) {
          window.location.assign(permissionUrl);
        } else {
          const app = createApp({
            apiKey,
            host,
          });
          Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl);
        }
      } else {
        console.error('Api key not found')
        this.router.push('/')
      }
      this.dismissLoader();
    },
    async getApiKey(shop: string) {
      let apiKey = this.apiKey;
      if (!apiKey) {
        // TODO update as per the API. API key will be setup in environment for the public app only
        // We will get the apiKey for custom apps, when unavailable
        const resp = await getApiKey({
          "shop": shop,
          "appTypeId": process.env.VUE_APP_SHOPIFY_APP_TYPE
        });
        if (resp.status == 200 && resp.data.apiKey) {
          this.apiKey = resp.data.apiKey
          apiKey = resp.data.apiKey
        }
      }
      return apiKey;
    },
    async presentLoader() {
      this.loader = await loadingController
        .create({
          message: this.$t("Processing request..."),
          translucent: true
        });
      await this.loader.present();
    },
    dismissLoader() {
      if (this.loader) {
        this.loader.dismiss();
      }
    }
  },
  beforeUnmount () {
    this.dismissLoader();
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    return {
      router,
      store,
      showToast,
    };
  },
});
</script>

<style scoped>
.install {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

form {
  max-width: 375px;
}
</style>