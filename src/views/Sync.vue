<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-fab >
        <ion-fab-button color="medium" href="/Install">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab> 
      <h2>Order Sync</h2>
      <div>
        <ion-card>
          <ion-card-content>
            <h1>{{ $t("Shipping Method Mapping") }}</h1>
            <h2>{{ $t("Map any configured shipping methods to those set up in your Deck Commerce instance.") }}</h2>
            <ion-item>
              <ion-label>{{ $t("Template shipment map") }}</ion-label>
              <ion-button color="light" expand="block">
                <ion-label> {{ $t("SAVE") }}</ion-label>
                <ion-icon :icon="downloadOutline"/>
              </ion-button>
            </ion-item>
            <ion-item>
              <ion-label>{{ $t("Upload shipment map") }}</ion-label>
              <ion-button color="light" expand="block">
                <ion-label> {{ $t("Upload") }}</ion-label>
                <ion-icon :icon="cloudUploadOutline"/>
              </ion-button>
            </ion-item>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonPage
} from "@ionic/vue";
import { defineComponent } from "vue";
import { arrowBackOutline, downloadOutline, cloudUploadOutline } from 'ionicons/icons'

export default defineComponent({
  name: "Sync",
  components: {
    IonCard,
    IonCardContent,
    IonContent,
    IonPage
  },
  setup() {
    return {
       arrowBackOutline,
       downloadOutline,
       cloudUploadOutline
    };
  }
});
</script>