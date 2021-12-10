<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <header>
        <h1>{{ $t("Welcome to Hotwax Commerce Order Management for Shopify") }}</h1>
      </header>

      <div class="content">
        <ion-card id="instructions">
          <ion-card-content>
            <h1>{{ $t("Getting started checklist") }}</h1>
            <h2>
              {{ $t("Complete the following steps to connect this Shopify store to your HotWax Commerce installation.") }}
            </h2>
            <ol>
              <li>
                {{ $t("Connect this Shopify store to your Hotwax Commerce Instance.") }}
              </li>
              <li>
                {{ $t("Set up and enable your order sync from Shopify to Hotwax Commerce.")}}
              </li>
              <li>
                {{ $t("Set up and enable Shopify to pull in a Hotwax Commerce inventoryfeed.")}}
              </li>
              <li>
                {{ $t("Set up and enable order updates to Shopify (order fulfillment, cancellation, and changes).") }}
              </li>
            </ol>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h1>{{ $t("Connect Hotwax Commerce") }}</h1>
            <h2>
              {{ $t("Connect this Shopify store to your Hotwax Commerce Instance.") }}
            </h2>
            <ion-button @click="() => router.push('/Connect')" expand="block">{{ $t("Set up connection") }}</ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h1>{{ $t("Set up inventory feed") }}</h1>
            <h2>{{ $t("The inventory feed sync to Shopify is currently inactive.") }}</h2>
            <ion-button  @click="() => router.push('/Inventory')" expand="block" fill="outline">{{ $t("Settings") }}</ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h1>{{ $t("Order Updates from Hotwax Commerce") }}</h1>
            <h2>{{ $t("The order update sync to Shopify is currently inactive.") }}</h2>
            <ion-button  @click="() => router.push('/Update')" expand="block" fill="outline">{{ $t("Settings") }}</ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h1>{{ $t("Order Sync to Hotwax Commerce") }}</h1>
            <h2>{{ $t("The order sync to Shopify is currently inactive.") }}</h2>
            <ion-button disabled  @click="() => router.push('/Sync')" expand="block" fill="outline">{{ $t("Settings") }}</ion-button>
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
} from "@ionic/vue";
import { defineComponent } from "vue";
import { useRouter } from 'vue-router';


export default defineComponent({
  name: "Configure",
  components: {
    IonButton,
    IonCard,
    IonCardContent,
    IonContent,
    IonPage,
  },
  setup() {
    const router = useRouter();
    return { router };
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
