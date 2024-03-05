<template>
  <ion-page>
    <ion-content>
      <div class="install" v-if="!loader">
        <!-- Commented form tag as when using it the install page reloads again and
        then redirect to shopify -->
        <form @keyup.enter="install(shopOrigin)">
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
            <ion-button expand="block" @click.stop="install(shopOrigin)" @keyup.prevent>
              {{ $t('Install') }}
            </ion-button>
          </div>
        </form>
      </div>

      <div v-if="session && !loader">
        <form>
          <ion-list>
            <Logo />
            <ion-item>
              <ion-label position="floating">{{ $t('OMS') }}</ion-label>
              <ion-input
                v-model="oms"
                name="oms"
                type="text"
                required
              />
            </ion-item>
          </ion-list>
          <div class="ion-padding">
            <ion-button expand="block" @click.stop="redirect()">
              {{ $t('Redirect') }}
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import { hasError, showToast } from "@/utils";
import { useRouter } from "vue-router";
import { generateAccessToken, getApiKey, getInstance, verifyRequest } from "@/services"
import { useStore } from "vuex";
import Logo from '@/components/Logo.vue';
import { loadingController } from '@ionic/vue';

export default defineComponent({
  name: "ShopifyInstall",
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
      apiKey: 'ec8cec8c4299d0ea17269da567eebc28',
      shopOrigin: '',
      session: this.$route.query['session'],
      hmac: this.$route.query['hmac'],
      shop: this.$route.query['shop'],
      host: this.$route.query['host'] as string,
      locale: this.$route.query['locale'] || process.env.VUE_APP_I18N_LOCALE || process.env.VUE_APP_I18N_FALLBACK_LOCALE,
      timestamp: this.$route.query['timestamp'],
      code: this.$route.query['code'],
      state: this.$route.query['state'],
      embedded: this.$route.query['embedded'],
      oms: ''
    };
  },
  async mounted() {
    const shop: string = this.shop as string || this.shopOrigin

    if (this.session) {
      console.log('this.$route.query', this.$route, JSON.stringify(this.$route.query))
      const apiKey = await this.getApiKey(shop);
      if (apiKey) {
        const resp = await getInstance(this.$route.fullPath.split("?")[1])
        this.dismissLoader();
        if (resp.status) {
          // Redirect the user to the oms instance that is configured, otherwise ask for the oms instance name
          this.$router.push("/configure");
        }
      } else {
        console.error('Api key not found')
        this.router.push('/')
      }
    } else if (this.code) {
      const nonce = localStorage.getItem('nonce')

      if(nonce !== this.state) {
        console.error('Failed to authenticate the redirect request')
        this.router.push('/')
        return;
      }

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
        console.log('access token generated')
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
      console.log('this.$route.query', JSON.stringify(this.$route.query))
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
          // Check why this condition is required
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
      try {
        const resp = await verifyRequest({ clientId: this.apiKey, shop, hmac: this.hmac, timestamp: this.timestamp, host: this.host })
        console.log('resp in verify request', JSON.stringify(resp.data))

        if(hasError(resp) || resp.data.requestAuthorizationCode != 'true') {
          throw resp.data
        }
      } catch(err: any) {
        console.error('error', err)
        return;
      }

      const redirectUri = process.env.VUE_APP_SHOPIFY_REDIRECT_URI;
      const scopes = process.env.VUE_APP_SHOPIFY_SCOPES;
      const apiKey = await this.getApiKey(shop);
      if (apiKey) {
        const nonce = this.generateNonce();
        const permissionUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${nonce}`;
        if (window.top == window.self) {
          window.location.assign(permissionUrl);
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
          console.log('api key', resp)
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
    },
    generateNonce() {
      // Generating a strong cryptographic value of length 15
      const value = crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(15)) : (crypto as any).randomBytes(length);
      const nonce = value.map((byte: number) => byte % 10).join('');

      // storing it in localStorage as we need to use this value when user returns with a code
      localStorage.setItem('nonce', nonce);

      return nonce;
    },
    redirect() {
      if(this.oms) {
        window.location.assign(`https://${this.oms}.hotwax.io/commerce`);
      } else {
        showToast('Please enter instance name before procedding')
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