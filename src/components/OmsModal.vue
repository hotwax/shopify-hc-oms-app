<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button @click="closeModal"> 
          <ion-icon slot="icon-only" :icon="closeOutline" />
        </ion-button>
      </ion-buttons>
      <ion-title>{{ $t("OMS Name") }}</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-item lines="none">
      <ion-label class="ion-text-wrap">
        {{ $t('The OMS instance name is the string that comes right before your OMS domain. For example, if your URL looks like this: "https://notnaked-oms.hotwax.io", then your OMS name is "notnaked-oms".') }}
        <br /><br />{{ $t('To access UAT environments, replace "oms" with "uat". The UAT name for this example store would be "notnaked-uat".') }}
      </ion-label>
    </ion-item>
  </ion-content>
</template>

<script>
import { 
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonToolbar,
  modalController
} from "@ionic/vue";
import { defineComponent } from "vue";
import { closeOutline } from "ionicons/icons";

export default defineComponent({
  name: "OmsModal",
  components: {
    IonButtons,
    IonButton,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonToolbar
  },
  methods: {
    closeModal() {
      modalController.dismiss({ dismissed: true });
    },
  },
  setup() {
    return {
      closeOutline
    };
  },
});
</script>
