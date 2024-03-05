import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import ShopifyInstall from '@/views/ShopifyInstall.vue';
import Configure from '@/views/Configure.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/shopify-install'
  },
  {
    path: '/shopify-install',
    name: 'Shopify Install',
    component: ShopifyInstall
  },
  {
    path: '/configure',
    name: 'Configure',
    component: Configure
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
