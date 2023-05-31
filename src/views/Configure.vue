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
              <ion-input v-model="connectConfig.instanceAddress" placeholder="your-oms.hotwax.io" @change="isConfigUpdated = false">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" >{{ $t("Shared API Token") }}</ion-label>
              <ion-input type="password" v-model="connectConfig.instanceToken" @change="isConfigUpdated = false"></ion-input>
            </ion-item>
            <ion-button :disabled="!connectConfig.instanceAddress || !connectConfig.instanceToken" expand="block" @click="updateConnectConfig">
              <ion-icon slot="start" :icon="saveOutline" />
              <ion-label> {{ $t("SAVE") }}</ion-label>
            </ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card v-if="isConfigUpdated && connectConfig.instanceAddress && connectConfig.instanceToken">
          <ion-card-content>
            <h2>{{ $t("Your instance is ready to use.") }}</h2>
          </ion-card-content>
        </ion-card>
        <ion-card v-if="connectConfig.instanceAddress && connectConfig.instanceToken">
          <ion-card-content>
            <h2>{{ $t("Manage your sync with Shopify") }}</h2>
            <p>{{ $t("Complete the following steps to see products and orders of this Shopify store in HotWax Commerce app.") }}</p>
            <ol>
              <li>Go to the <a :href="connectConfig.instanceAddress.startsWith('https') ? connectConfig.instanceAddress : 'https://' + connectConfig.instanceAddress + '/commerce/control/FindShopifyShop' " target="_blank">Shopify Shop page</a> of the Order Management System (OMS).</li>
              <li>Select your Shop and edit access scope, setting it to "Shopify shop read and write access".</li>
              <li>Go to the <a href="https://job-manager.hotwax.io" target="_blank">Job manager</a></li>
              <li>Open the "Initial load" page</li>
              <li>Select the "Import Products in Bulk" function, and run the import.</li>
              <li>Open the "Miscellaneous Jobs" page</li>
              <li>Select the "Process bulk imported files" function and run it.</li>
              <li>Return to the "Initial Load" page.</li>
              <li>Select the "Import Orders in Bulk" function</li>
              <li>Input the last Shopify order ID to import orders from and run the import.</li>
              <li>Open the "Miscellaneous Jobs" page</li>
              <li>Select the "Process bulk imported files" function and run it.</li>
              <li>Go to the Order Management System (OMS) to view your <a :href="connectConfig.instanceAddress.startsWith('https') ? connectConfig.instanceAddress : 'https://' + connectConfig.instanceAddress + '/commerce/control/FindProduct'" target="_blank">products</a> and <a :href="connectConfig.instanceAddress.startsWith('https') ? connectConfig.instanceAddress : 'https://' + connectConfig.instanceAddress + '/commerce/control/FindOrder'" target="_blank">orders</a>.</li>
            </ol>
            <p>To know more: Watch this <a href="https://www.youtube.com/watch?v=UpbwX8rYnVk" target="_blank">demo video</a> of how to use HotWax and Shopify integration through the Job Manager.</p>
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
      isConfigUpdated: false
    }
  },
  methods: {
    async updateConnectConfig() {
      this.store.dispatch('shop/setConfiguration', this.connectConfig)
          .then(() => this.isConfigUpdated = true)
          .catch(() => this.isConfigUpdated = false)
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
