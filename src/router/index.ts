import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Configure from '../views/Configure.vue'
import Install from '@/views/Install.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/install'
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
