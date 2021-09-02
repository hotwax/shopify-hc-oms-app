<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <header>
        <h1>Welcome to Hotwax Commerce Order Management for Shopify</h1>
      </header>

      <div class="content">
        <ion-card id="instructions">
          <ion-card-content>
            <h1>Getting started checklist</h1>
            <h2>Complete the following steps to connect this Shopify store to your Deck Commerce installation.</h2>
            <ol>
              <li>Connect this shopify store to your Hotwax Commerce Instance.</li>
              <li>Set up and enable your order sync from Shopify to Hotwax Commerce.</li>
              <li>Set up and enable Shopify to pull in a Hotwax Commerce inventory feed.</li>
              <li>Set up and enable order updates to Shopify (order fulfillment, cancellation, and changes).</li>
            </ol>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h1>Connect Hotwax Commerce</h1>
            <h2>Connect this Shopify store to your Hotwax Commerce instance.</h2>
            <ion-button expand="block">Set up connection</ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h1>Set up inventory feed</h1>
            <h2>The inventory feed sync to Shopify is currently inactive.</h2>
            <ion-button expand="block" fill="outline">Settings</ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h1>Order Updates from Hotwax Commerce</h1>
            <h2>The order update sync to Shopify is currently inactive.</h2>
            <ion-button expand="block" fill="outline">Settings</ion-button>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <h1>Order Sync to Hotwax Commerce</h1>
            <h2>The order sync to Shopify is currently inactive.</h2>
            <ion-button expand="block" fill="outline">Settings</ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonButton, IonCard, IonCardContent, IonContent, IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
 name: 'Install',
 components: {
   IonButton,
   IonCard,
   IonCardContent,
   IonContent,
   IonPage,
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
