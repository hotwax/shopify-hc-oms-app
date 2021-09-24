<template>
  <ion-page>
    <ion-content>
      <form @submit="install(shopOrigin)">
        <ion-list>
          <img src="../assets/images/hc.png" />
          <ion-item>
            <ion-label position="floating">Shop</ion-label>
            <ion-input
              v-model="shopOrigin"
              name="shopOrigin"
              type="text"
              required
            ></ion-input>
          </ion-item>
        </ion-list>
        <div class="ion-padding">
          <ion-button type="submit" expand="block">
            Install
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
} from "@ionic/vue";
import { defineComponent } from "vue";
import { Redirect } from "@shopify/app-bridge/actions";
import createApp from "@shopify/app-bridge";
import { showToast } from "@/utils";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Install",
  components: {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
  },
  data() {
    return {
      apiKey: "",
      shopOrigin: "hc-sandbox.myshopify.com",
    };
  },
  methods: {
    install(shopOrigin: any, shop: any, host: any, session: any, code: any) {
      this.authorise(shopOrigin, undefined, this.apiKey);
      {
        if (session) {
          this.showToast.hideLoading();
          this.router.navigate(["/"]);
        } else if (code) {
          const appURL = `https://${shop}/admin/apps/${this.apiKey}`;
          window.location.assign(appURL);
        } else if (shop || host) {
          this.authorise(shop, host, this.apiKey);
        } else {
          this.showToast.hideLoading();
        }
      }
    },
    authorise(shop: any, host: any, apiKey: any) {
      const redirectUri = process.env.SHOPIFY_REDIRECT_URI;
      const permissionUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=read_products,read_content&redirect_uri=${redirectUri}`;
      if (window.top == window.self) {
        window.location.assign(permissionUrl);
      } else {
        const app = createApp({
          apiKey: apiKey,
          host,
        });
        Redirect.create(app).dispatch(Redirect.Action.REMOTE, permissionUrl);
      }
    },
  },
  setup() {
    const router = useRouter();
    return {
      router,
      showToast,
    };
  },
});
</script>

<style scoped></style>
