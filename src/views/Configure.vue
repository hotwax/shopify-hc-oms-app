<template>
  <ion-page>
    <ion-content class="ion-padding">
      <header>
        <h1>{{ $t("Welcome to Hotwax Commerce Order Management for Shopify") }}</h1>
      </header>
      <div class="content">
        <ion-card>
          <ion-card-content>
            <h2>{{ $t("Enter connection information to make sure your Shopify store can talk to your HotWax Commerce instance.") }}</h2>
            <ion-item>
              <ion-label position="floating" >{{ $t("HotWax Commerce URL") }}</ion-label>
              <ion-input v-model="instanceAddress" placeholder="https://oms.hotwax.io" @change="isConfigUpdated = false">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" >{{ $t("Shared API Token") }}</ion-label>
              <ion-input type="password" v-model="instanceToken" @change="isConfigUpdated = false"></ion-input>
            </ion-item>
            <ion-button :disabled="!instanceAddress || !instanceToken" expand="block" @click="updateConnectConfig">
              <ion-icon slot="start" :icon="saveOutline" />
              <ion-label> {{ $t("SAVE") }}</ion-label>
            </ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h2>If you have any questions or need further assistance, please contact us at <a href="mailto:support@hotwax.co">support@hotwax.co</a></h2>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonPage,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from 'vue-router';
import { mapGetters, useStore } from "vuex";
import { saveOutline } from 'ionicons/icons'
import { setConfiguration } from "@/services";
import { hasError, showToast } from "@/utils";
import { translate } from "@/i18n";

export default defineComponent({
  name: "Configure",
  components: {
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonPage,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
  },
  computed: {
    ...mapGetters({
      connectConfig: 'shop/getConfig'
    })
  },
  data() {
    return {
      instanceAddress: '',
      instanceToken: '',
      isConfigUpdated: false,
      payload: {}
    }
  },
  mounted() {
    const queryParams = this.$route.fullPath.split("?")[1]
    this.payload = queryParams ? queryParams.split('&').reduce((params: any, param) => {
      const [key, value] = param.split('=')
      params[key] = value
      return params;
    }, {}) : {}

    if(!Object.keys(this.payload).length) {
      this.router.push('/')
    }
  },
  methods: {
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
    }
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    return { router, saveOutline, store };
  }
});
</script>

<style scoped>
@media (min-width: 732px) {
  header {
    text-align: center;
  }

  .content {
    max-width: 732px;
    margin-top: 20px;
    margin-right: auto;
    margin-left: auto;
  }

}
</style>
