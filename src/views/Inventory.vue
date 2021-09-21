<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-fab >
        <ion-fab-button color="medium" href="/Install">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab> 
      <h2 class="header">{{ $t("Inventory feed from HotWax Commerce") }}</h2>
      <div class="content">
        <ion-button expand="block">
          <ion-icon slot="start" :icon="saveOutline"/>
          <ion-label> {{ $t("SAVE") }}</ion-label>
        </ion-button>
        <ion-card>
          <ion-card-content>
            <h2>{{ $t("HotWax Commerce provides an inventory feed by dropping an XML file on an SFTP server. Set up your Shopify's store connection to the SFTP server to receive the inventory feed.") }}</h2>
            <ion-item>
              <ion-label position="floating" >{{ $t("Host") }}</ion-label>
              <ion-input ></ion-input>
            </ion-item> 
            <ion-item>
              <ion-label position="floating" >{{ $t("Port") }}</ion-label>
              <ion-input ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" >{{ $t("User Name") }}</ion-label>
              <ion-input ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" >{{ $t("Password") }}</ion-label>
              <ion-input></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating" >{{ $t("Private Key") }}</ion-label>
              <ion-input clear-input placeholder="Input text">
              </ion-input>
            </ion-item>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h2>{{ $t("Set up where to find the inventory feed on the SFTP server.") }}</h2>
            <ion-item>
              <ion-label position="floating" >{{ $t("Directory") }}</ion-label>
              <ion-input ></ion-input>
            </ion-item> 
            <ion-item>
              <ion-label position="floating" >{{ $t("File Name") }}</ion-label>
              <ion-input ></ion-input>
            </ion-item>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h2>{{ $t("Set up how frequently you want Shopify to look for the inventory feed file. You should schedule this similarity to your settings for HotWax Commerce dropping the file.") }}</h2>
            <ion-item>
              <ion-label>{{ $t("Polling Frequency") }}</ion-label>
              <ion-select value="15 min">
                <!-- TODO: We can add more select options here -->
                <ion-select-option value="15 min">15 min</ion-select-option>
                <ion-select-option value="30 min">30 min</ion-select-option>
              </ion-select>
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
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption
  
} from "@ionic/vue";
import { defineComponent } from "vue";
import { arrowBackOutline, saveOutline} from 'ionicons/icons'

export default defineComponent({
  name: "Inventory",
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
    IonSelect,
    IonSelectOption
  },
  setup() {
    return {
       arrowBackOutline,
       saveOutline,
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