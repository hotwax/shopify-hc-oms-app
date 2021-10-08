<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-fab >
        <ion-fab-button color="medium" href="/configure">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab> 
      <h2 class="header">{{ $t("Connect HotWax Commerce") }}</h2>
      <div class="content">
        <ion-card>
          <ion-card-content>
            <h2>{{ $t("Enter connection information to make sure your Shopify store can talk to your HotWax Commerce instance.") }}</h2>
            <ion-item>
              <ion-label position="floating" >{{ $t("HotWax Commerce URL") }}</ion-label>
              <ion-input clear-input placeholder="$t(Input text)" v-model="connectConfig.url">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" >{{ $t("Shared API Token") }}</ion-label>
              <ion-input v-model="connectConfig.token"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" >{{ $t("Site Code") }}</ion-label>
              <ion-input v-model="connectConfig.code"></ion-input>
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
  IonFab,
  IonFabButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  
} from "@ionic/vue";
import { defineComponent } from "vue";
import { arrowBackOutline, saveOutline, closeOutline } from 'ionicons/icons'
import { mapGetters, useStore } from "vuex";
import { showToast } from '@/utils'
import { translate } from '@/i18n'

export default defineComponent({
  name: "Connect",
  components: {
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
  },
  computed: {
    ...mapGetters({
      connectConfig: 'shop/getConnectConfig'
    })
  },
  methods: {
    updateConnectConfig () {
      this.store.dispatch('shop/updateConnectConfiguration', this.connectConfig)
      showToast(translate('HotWax Commerce connection settings updated'))
    }
  },
  setup() {
    const store = useStore();
    
    return {
      showToast,
      store,
      arrowBackOutline,
      saveOutline,
      closeOutline
    };
  }
});
</script>
<style scoped>
  .content {
    max-width: 407px;
    margin-top: 30px;
    margin-right: auto;
    margin-left: auto;
  }
  .header{
    text-align: center;
  }
</style>