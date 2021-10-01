<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-fab >
        <ion-fab-button color="medium" href="/configure">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab> 
      <h2 class="header">{{ $t("Order Sync") }}</h2>
      <div class="content">
        <ion-card>
          <ion-card-content>
            <h1>{{ $t("Shipping Method Mapping") }}</h1>
            <h2>{{ $t("Map any configured shipping methods to those set up in your HotWax Commerce instance.") }}</h2>
            <ion-item>
              <ion-label>{{ $t("Template shipment map") }}</ion-label>
              <ion-button fill="outline" color="dark" expand="block">{{ $t("Download") }}
                <ion-icon slot="end" :icon="downloadOutline"/>
              </ion-button>
            </ion-item>
            <ion-item>
              <ion-label>{{ $t("Upload shipment map") }}</ion-label>
              <ion-button color="default" fill="outline" expand="block">{{ $t("Upload") }}
                <ion-icon slot="end" :icon="cloudUploadOutline"/>
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
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage
} from "@ionic/vue";
import { defineComponent } from "vue";
import { arrowBackOutline, downloadOutline, cloudUploadOutline } from 'ionicons/icons'

export default defineComponent({
  name: "Sync",
  components: {
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    IonLabel,
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