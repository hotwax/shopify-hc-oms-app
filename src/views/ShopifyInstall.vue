<template>
  <ion-page>
    <ion-content>
      <div class="install" v-if="!loader || !session || !code || !shop">
        <ion-list>
          <Logo />
          <ion-item lines="none" class="ion-margin-vertical" v-if="authenticationInProgress">
            <ion-icon slot="start" :icon="cloudDownloadOutline" />
            <ion-label class="ion-text-wrap">
              {{ $t('Installing HotWax Commerce onto your Shopify store...') }}
              <p>{{ $t("You'll be auto redirected to your Shopify store to complete the installation process") }}</p>
            </ion-label>
          </ion-item>
          <ion-item lines="none" class="ion-margin-vertical" v-else-if="syncDetailsToShopify || isAppInstalled">
            <ion-icon slot="start" color="success" :icon="checkmarkCircleOutline" />
            <ion-label class="ion-text-wrap">
              {{ $t('HotWax Commerce is installed on your Shopify store') }}
              <p>{{ shop }}</p>
            </ion-label>
          </ion-item>
          <ion-progress-bar type="indeterminate" v-if="authenticationInProgress"></ion-progress-bar>
          <ion-item lines="none" class="ion-margin-vertical" :disabled="authenticationInProgress" v-if="syncDetailsToShopify || isAppInstalled">
            <ion-icon slot="start" :icon="cloudUploadOutline" />
            <ion-label class="ion-text-wrap" v-if="syncDetailsToShopify">{{ $t('Syncing Shopify store to HotWax Commerce') }}</ion-label>
            <ion-label class="ion-text-wrap" v-if="isAppInstalled">{{ $t('Shopify store synced with HotWax Commerce') }}</ion-label>
          </ion-item>
          <ion-progress-bar type="indeterminate" v-if="syncDetailsToShopify"></ion-progress-bar>
          <ion-item class="ion-item-button ion-margin-vertical" lines="none" button @click="goToLearnMoreDocument()">
            <ion-icon slot="start" :icon="bookOutline" />
            <ion-label class="ion-text-wrap">{{ $t('Learn more about connecting HotWax Commerce with Shopify') }}</ion-label>
          </ion-item>

          <template v-if="isAppInstalled">
            <ion-item>
              <ion-label>{{ $t("OMS") }}</ion-label>
              <ion-input v-model="instanceAddress" :placeholder="$t('notnaked-oms')" @change="isConfigUpdated = false"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label>{{ $t("JWT Token") }}</ion-label>
              <ion-input :placeholder="$t('notnaked-oms')" type="password" v-model="instanceToken" @change="isConfigUpdated = false"></ion-input>
            </ion-item>
            <ion-button :disabled="!instanceAddress || !instanceToken" expand="block" @click="updateConnectConfig" color="dark">
              <ion-label>{{ $t("Finish Setup") }}</ion-label>
              <ion-icon slot="end" :icon="arrowForwardOutline" />
            </ion-button>
            <ion-item button detail lines="none" @click="openOmsModal">
              <ion-label>{{ $t("Find your OMS name") }}</ion-label>
            </ion-item>
            <ion-item detail lines="none">
              <ion-label class="ion-text-wrap">{{ $t("Don't have a HotWax Commerce account? Contact Us") }}</ion-label>
            </ion-item>
          </template>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonProgressBar,
  modalController
} from "@ionic/vue";
import { defineComponent } from "vue";
import { hasError, showToast } from "@/utils";
import { useRouter } from "vue-router";
import { generateAccessToken, getApiKey, setConfiguration, verifyRequest } from "@/services"
import { mapGetters, useStore } from "vuex";
import Logo from '@/components/Logo.vue';
import { loadingController } from '@ionic/vue';
import { arrowForwardOutline, bookOutline, checkmarkCircleOutline, closeCircleOutline, cloudDownloadOutline, cloudUploadOutline } from 'ionicons/icons'
import { translate } from "@/i18n";
import OmsModal from "@/components/OmsModal.vue";

export default defineComponent({
  name: "ShopifyInstall",
  components: {
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonProgressBar,
    Logo
  },
  data() {
    return {
      loader: null as any,
      apiKey: '61a49df39017a4481e2aaf633900cea9',
      session: this.$route.query['session'],
      hmac: this.$route.query['hmac'],
      shop: this.$route.query['shop'],
      host: this.$route.query['host'] as string,
      locale: this.$route.query['locale'] || process.env.VUE_APP_I18N_LOCALE || process.env.VUE_APP_I18N_FALLBACK_LOCALE,
      timestamp: this.$route.query['timestamp'],
      code: this.$route.query['code'],
      state: this.$route.query['state'],
      embedded: this.$route.query['embedded'],
      scopes: '',
      authenticationInProgress: false,
      isAppInstalled: false,
      syncDetailsToShopify: false,
      instanceAddress: '',
      instanceToken: '',
      isConfigUpdated: false,
      payload: {}
    };
  },
  computed: {
    ...mapGetters({
      connectConfig: 'shop/getConfig'
    })
  },
  async mounted() {
    const shop: string = this.shop as string

    if (this.session) {
      this.syncDetailsToShopify = true;
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
              showToast(translate("Failed to get the access scopes"))
              console.error('Failed to get the access scopes')
              return;
            }
          } else if(resp.instanceAddress) {
            // Redirect the user to the oms instance that is configured, otherwise ask for the oms instance name
            window.location.replace(resp.instanceAddress)
          } else {
            console.error('Failed to fetch the instance details')
            this.isAppInstalled = true;
            this.syncDetailsToShopify = false;
            let query = this.$route.fullPath.split("?")[1]
            if(!query.includes('clientId')) {
              query += `&clientId=${apiKey}`
            }

            this.payload = query ? query.split('&').reduce((params: any, param) => {
              const [key, value] = param.split('=')
              params[key] = value
              return params;
            }, {}) : {}

            if(!Object.keys(this.payload).length) {
              this.router.push('/')
            }
          }
        } catch(err: any) {
          this.isAppInstalled = false;
          this.syncDetailsToShopify = false;
          showToast(translate("Failed to verify the request, please try again"))
          console.error('error', err)
          return;
        }
      } else {
        console.error('Api key not found')
        this.isAppInstalled = false;
        this.syncDetailsToShopify = false;
        showToast(translate("Failed to verify the request, please try again"))
        this.router.push('/')
      }
    } else if (this.code) {
      this.syncDetailsToShopify = true;
      const nonce = localStorage.getItem('nonce')

      if(nonce !== this.state) {
        this.syncDetailsToShopify = false;
        this.router.push('/')
        return;
      }

      const apiKey = await this.getApiKey(shop);
      if (apiKey) {
        // this.loader.message = "Fetching token..."
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
          this.syncDetailsToShopify = false;
          showToast(translate('Failed to fetch the token'))
          console.error('err', err)
        }
      } else {
        showToast(translate('Failed to find the api key'))
        console.error('Api key not found')
        this.router.push('/')
        this.syncDetailsToShopify = false;
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
          await this.getApiKey(shop);
          // Check why this condition is required
        } else {
          // TODO Remove this. Fallback
          window.location.assign(redirectUri + "?" + updatedQuery);
        }
      } else {
        this.authenticationInProgress = true
        // Using await as if not used then the loader gets dismissed
        await this.authorise(shop, this.host);
      }
    }
  },
  methods: {
    async verifyRequest() {
      try {
        const payload = this.getQueryParams()

        // this.loader.message = "Verifying request..."
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
    async authorise(shop: any, host: any, verify = true) {
      if(verify) {
        try {
          // Only checking whether the request is valid or not, not checking for the requestAuthorizationCode
          const resp = await this.verifyRequest() as any;
          this.scopes = resp.scopes;
        } catch(err: any) {
          showToast(translate("Failed to verify the request, please try again"))
          console.error('error', err)
          this.authenticationInProgress = false
          return;
        }
      }

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
        this.authenticationInProgress = false
        console.error(message)
        showToast(translate(message))
        this.router.push('/')
      }
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
    },
    async goToLearnMoreDocument() { 
      await this.presentLoader();
      this.loader.message = "Redirecting..."
      window.location.assign('https://docs.hotwax.co/documents/v/learn-shopify/setup-shopify/shopifyintegration')
      this.dismissLoader();
    },
    async updateConnectConfig() {
      try {
        const resp = await setConfiguration(this.payload, {
          'instanceAddress': this.instanceAddress,
          'instanceToken': this.instanceToken
        })
        // TODO Update specific payload
        if (resp.status === 200 && !hasError(resp)) {
          showToast(translate('HotWax Commerce connection settings updated'))
          this.isConfigUpdated = true
          window.location.replace(this.instanceAddress)
        } else {
          throw resp.data
        }
      } catch(error){
        console.error(error)
        showToast(translate("Something went wrong"));
        this.isConfigUpdated = false
      }
    },
    async openOmsModal() {
      const omsModal = await modalController.create({
        component: OmsModal
      });

      omsModal.present();
    }
  },
  ionViewWillLeave() {
    this.dismissLoader();
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    return {
      arrowForwardOutline,
      bookOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      cloudDownloadOutline,
      cloudUploadOutline,
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

ion-list {
  max-width: 375px;
}

.ion-item-button::part(native) {
  background-color: #F5F6F9;
  border-radius: 20px;
}
</style>