<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-fab >
        <ion-fab-button color="medium" href="/Install">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab> 
      <h2>{{ $t("Updates from HotWax Commerce") }}</h2>
      <ion-button expand="block">
        <ion-icon slot="start" :icon="saveOutline"/>
        <ion-label> {{ $t("SAVE") }}</ion-label>
      </ion-button>
      <div>
        <ion-card>
          <ion-card-content>
            <ion-item lines="none">
              <h2>{{ $t("Automatically refund cancelled orders via Shopify.") }}</h2>
              <ion-toggle slot="end" name="Switch" checked></ion-toggle>
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
  IonPage,
  IonToggle
} from "@ionic/vue";
import { defineComponent } from "vue";
import { arrowBackOutline, saveOutline } from 'ionicons/icons'

export default defineComponent({
  name: "Update",
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
    IonPage,
    IonToggle
  },
  setup() {
    return {
       arrowBackOutline,
       saveOutline
    };
  }
});
</script>