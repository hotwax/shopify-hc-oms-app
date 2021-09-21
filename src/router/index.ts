import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Install from '../views/Install.vue'
import Connect from '../views/Connect.vue'
import Inventory from '../views/Inventory.vue'
import Sync from '../views/Sync.vue'
import Update from '../views/Update.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/install'
  },
  {
    path: '/install',
    name: 'Install',
    component: Install
  },
  {
    path: '/connect',
    name: 'Connect',
    component: Connect
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory
  },
  {
    path: '/sync',
    name: 'Sync',
    component: Sync
  },
  {
    path: '/update',
    name: 'Update',
    component: Update
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
