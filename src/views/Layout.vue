<template>
  <AppTopnav />
  <AppHeader/>
  <div class="main">
    <router-view></router-view>
  </div>
  <AppFooter/>
</template>

<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
export default {
  setup (props) {

  },
  components: {
    AppTopnav,
    AppHeader,
    AppFooter
  }
}
</script>

<style></style>
