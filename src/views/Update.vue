<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-fab >
        <ion-fab-button color="medium" href="/configure">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab> 
      <h2 class="header">{{ $t("Updates from HotWax Commerce") }}</h2>
      <div class="content">
        <ion-button expand="block" @click="saveRefundStatus()">
          <ion-icon slot="start" :icon="saveOutline"/>
          <ion-label> {{ $t("SAVE") }}</ion-label>
        </ion-button>
        <ion-card>
          <ion-card-content>
            <ion-item lines="none">
              <h2>{{ $t("Automatically refund cancelled orders via Shopify.") }}</h2>
              <ion-toggle slot="end" name="Switch" @ionChange="refundStatusChanged()" :checked="refundOnOrderCancelled"></ion-toggle>
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
import { mapGetters, useStore } from "vuex";
import { showToast } from '@/utils';

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
  data () {
    return {
      status: false
    }
  },
  computed: {
    ...mapGetters({
      refundOnOrderCancelled: 'shop/getRefundStatus'
    })
  },
  created () {
    this.status = this.refundOnOrderCancelled;
  },
  methods: {
    refundStatusChanged () {
      this.status = !this.status;
    },
    saveRefundStatus () {
      this.store.commit('shop/shop/REFUND_STATUS_CHANGED', {status: this.status})
      showToast('HotWax Commerce refund status updated')
    }
  },
  setup() {
    const store = useStore();
    return {
      showToast,
      store,
      arrowBackOutline,
      saveOutline
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