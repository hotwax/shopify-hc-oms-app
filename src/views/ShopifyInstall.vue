<template>
  <ion-page>
    <ion-content>
      <div class="install" v-if="!loader || !session">
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
      scopes: ''
    };
  },
  async mounted() {
    await this.presentLoader();
    const shop: string = this.shop as string || this.shopOrigin

    if (this.session) {
      const apiKey = await this.getApiKey(shop);
      if (apiKey) {
        try {
          const resp = await this.verifyRequest();

          // When having requestAuthorizationCode as true, it means that the permissions/access-scopes are changed and thus need to re-auth the app
          if(resp.requestAuthorizationCode == 'true') {
            this.scopes = resp.scopes

            if(this.scopes) {
              await this.authorise(shop, undefined, false);
            } else {
              this.dismissLoader();
              showToast("Failed to get the access scopes")
              console.error('Failed to get the access scopes')
              return;
            }
          } else if(resp.instanceAddress) {
            // Redirect the user to the oms instance that is configured, otherwise ask for the oms instance name
            window.location.replace(resp.instanceAddress)
          } else {
            console.error('Failed to fetch the instance details')
            let query = this.$route.fullPath.split("?")[1]
            if(!query.includes('clientId')) {
              query += `&clientId=${apiKey}`
            }
            this.$router.push(`/configure?${query}`);
          }
        } catch(err: any) {
          this.dismissLoader();
          showToast("Failed to verify the request, please try again")
          console.error('error', err)
          return;
        }
      } else {
        console.error('Api key not found')
        this.router.push('/')
      }
    } else if (this.code) {
      this.loader.message = "Verifying request..."
      const nonce = localStorage.getItem('nonce')

      if(nonce !== this.state) {
        console.error('Failed to authenticate the redirect request')
        this.router.push('/')
        return;
      }

      const apiKey = await this.getApiKey(shop);
      if (apiKey) {
        this.loader.message = "Fetching token..."
        const payload = this.getQueryParams()

        try {
          const resp = await generateAccessToken({
            ...payload,
            clientId: apiKey
          });
          // TODO: Add error message to the UI when status is false or there is some error in the resp
          if (!hasError(resp)) {
            // Making this redirection to get the browser session value
            const appURL = `https://${shop}/admin/apps/${apiKey}`;
            window.location.assign(appURL);
          } else {
            throw resp.data
          }
        } catch(err) {
          showToast('Failed to fetch the token')
          console.error('err', err)
        }
      } else {
        showToast('Failed to find the api key')
        console.error('Api key not found')
        this.router.push('/')
      }
      this.dismissLoader()
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
          // Check why this condition is required
        } else {
          // TODO Remove this. Fallback
          window.location.assign(redirectUri + "?" + updatedQuery);
        }
      } else {
        // Using await as if not used then the loader gets dismissed
        await this.authorise(shop, this.host);
      }
      this.dismissLoader()
    }
    this.dismissLoader()
  },
  methods: {
    async verifyRequest() {
      try {
        const payload = this.getQueryParams()

        this.loader.message = "Verifying request..."
        const resp = await verifyRequest({
          ...payload,
          clientId: this.apiKey
        })

        if(hasError(resp)) {
          throw resp.data
        } else {
          return Promise.resolve({ requestAuthorizationCode: resp.data?.requestAuthorizationCode, scopes: resp.data?.accessScopes, instanceAddress: resp.data?.instanceAddress })
        }
      } catch(err: any) {
        return Promise.reject(err);
      }
    },
    install(shopOrigin: any) {
      this.authorise(shopOrigin, undefined);
    },
    async authorise(shop: any, host: any, verify = true) {
      await this.presentLoader();

      if(verify) {
        try {
          // Only checking whether the request is valid or not, not checking for the requestAuthorizationCode
          const resp = await this.verifyRequest();
          this.scopes = resp.scopes;
        } catch(err: any) {
          this.dismissLoader();
          showToast("Failed to verify the request, please try again")
          console.error('error', err)
          return;
        }
      }

      this.loader.message = "Redirecting..."

      const redirectUri = process.env.VUE_APP_SHOPIFY_REDIRECT_URI;
      const apiKey = await this.getApiKey(shop);
      if (apiKey && this.scopes) {
        const nonce = this.generateNonce();
        const permissionUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${this.scopes}&redirect_uri=${redirectUri}&state=${nonce}`;
        if (window.top == window.self) {
          window.location.assign(permissionUrl);
        }
      } else {
        let message = 'Api key not found'
        if(!this.scopes) {
          message = 'Access scopes not found'
        }
        console.error(message)
        showToast(message)
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
      if(this.loader) {
        return;
      }
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
        this.loader = null
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
    getQueryParams() {
      const queryParams = this.$route.fullPath.split("?")[1]
      return queryParams ? queryParams.split('&').reduce((params: any, param) => {
        const [key, value] = param.split('=')
        params[key] = value
        return params;
      }, {}) : {}
    }
  },
  ionViewWillLeave() {
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