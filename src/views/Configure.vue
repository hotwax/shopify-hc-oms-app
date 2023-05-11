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
              <ion-input v-model="connectConfig.instanceAddress">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" >{{ $t("Shared API Token") }}</ion-label>
              <ion-input type="password" v-model="connectConfig.instanceToken"></ion-input>
            </ion-item>
            <ion-button expand="block" @click="updateConnectConfig">
              <ion-icon slot="start" :icon="saveOutline" />
              <ion-label> {{ $t("SAVE") }}</ion-label>
            </ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card v-if="connectConfig.instanceAddress && connectConfig.instanceToken">
          <ion-card-content>
            <h2>{{ $t("Your connection request has been received and will be processed in the next 24 hours.") }}</h2>
          </ion-card-content>
        </ion-card>
        <ion-card v-if="connectConfig.instanceAddress && connectConfig.instanceToken">
          <ion-card-content>
            <h2>{{ $t("Manage your sync with Shopify") }}</h2>
            <p>{{ $t("Complete the following steps to see products and orders of this Shopify store in HotWax Commerce app.") }}</p>
            <ol>
              <li>Go to the <a href="https://job-manager.hotwax.io">Job manager</a></li>
              <li>Open initial load</li>
              <li>Import products in bulk</li>
              <li>Import orders in bulk</li>
            </ol>
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
  methods: {
    updateConnectConfig() {
      this.store.dispatch('shop/setConfiguration', this.connectConfig)
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
