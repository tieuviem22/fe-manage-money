import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [ 
  {
    path: '/manage',
    name: 'manage',
    redirect: '/manage/general',
    component: import('../components/layout/UserLayout.vue'),
    children: [
      {
        path: '/manage/note',
        name: 'note',
        component: import('../components/Note.vue'),
      },
      {
          path: '/manage/general',
          name: 'general',
          component: import('../components/GeneralManage.vue'),
      },
      {
          path: '/manage/profile',
          name: 'profile',
          component: import('../components/Profile.vue'),
      },
    ]
  },
  {
    path: '/',
    redirect:'/manage/note',
  },
  {
    path: '/home',
    name:'home',
    component: HomeView
  },
  {
    path: '/home',
    name: 'home',
    component: import('../views/IntroPage.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterPage.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
