import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')
const Category = () => import('@/views/category')
const Sub = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods')
const Login = () => import('@/views/login')
const LoginCallback = () => import('@/views/login/callback.vue')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: Category },
      { path: '/category/sub/:id', component: Sub },
      { path: '/product/:id', component: Goods }
    ]
  }, {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallback
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    return { left: 0, top: 0 }
  }

})

export default router
