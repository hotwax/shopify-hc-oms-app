<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-fab >
        <ion-fab-button color="medium" href="/Install">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab> 
      <h2>{{ $t("Connect HotWax Commerce") }}</h2>
      <div>
        <ion-card>
          <ion-card-content>
            <h2>{{ $t("Enter connection information to make sure your Shopify store can talk to your HotWax Commerce instance.") }}</h2>
            <ion-item>
              <ion-label position="floating" >{{ $t("HotWax Commerce URL") }}</ion-label>
              <ion-input clear-input placeholder="Input text" >
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" >{{ $t("Shared API Token") }}</ion-label>
              <ion-input ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" >{{ $t("Site Code") }}</ion-label>
              <ion-input></ion-input>
            </ion-item>
            <ion-button expand="block">
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
  setup() {
    return {
       arrowBackOutline,
       saveOutline,
       closeOutline
    };
  }
});
</script>