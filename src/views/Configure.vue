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
import { showToast } from '@/utils'
import { translate } from '@/i18n'
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
      showToast(translate('HotWax Commerce connection settings updated'))
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 732px;
    margin-top: 20px;
    margin-right: auto;
    margin-left: auto;
  }

  #instructions {
    grid-column: span 2;
  }
}
</style>
