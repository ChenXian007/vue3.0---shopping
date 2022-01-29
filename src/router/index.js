import { createRouter, createWebHashHistory } from 'vue-router'
const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')
const Category = () => import('@/views/category')
const Sub = () => import('@/views/category/sub')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: Category },
      { path: '/category/sub/:id', component: Sub }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
