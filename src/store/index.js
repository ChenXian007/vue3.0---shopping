import { createStore } from 'vuex'
import user from './module/user'
import cart from './module/cart'
import category from './module/category'
import createPersistedstate from 'vuex-persistedstate'
export default createStore({
  modules: {
    user,
    cart,
    category
  },
  plugins: [
    createPersistedstate({
      key: 'erabbit-client-pc-store',
      paths: ['user', 'cart']
    })
  ]
})
