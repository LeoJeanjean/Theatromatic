import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/scene',
      name: 'scene',
      component: () => import('../views/Scene.vue')
    },
    {
      path: '/scenario',
      name: 'scenario',
      component: () => import('../views/ScenarioView.vue')
    },
    {
      path: '/personnages',
      name: 'personnages',
      component: () => import('../views/Characters.vue')
    }
  ]
})

export default router
