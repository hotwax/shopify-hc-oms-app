import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Configure from '../views/Configure.vue'
import Install from '@/views/Install.vue'
import ShopifyInstall from '@/views/ShopifyInstall.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/shopify-install'
  },
  {
    path: '/configure',
    name: 'Configure',
    component: Configure
  },
  {
    path: '/install',
    name: 'Install',
    component: Install
  },
  {
    path: '/shopify-install',
    name: 'Shopify Install',
    component: ShopifyInstall
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
