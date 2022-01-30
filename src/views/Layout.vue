<template>
  <AppTopnav />
  <AppHeader/>
  <!-- 吸顶导航 -->
  <AppHeaderSticky />
  <div class="main">
    <!-- 二级路由 -->
    <router-view></router-view>
  </div>
  <AppFooter/>
</template>

<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  setup (props) {
    const store = useStore()
    store.dispatch('category/getList')
  },
  components: {
    AppTopnav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  }
}
</script>

<style>

</style>
