<template>
  <LoginHeader>联合登录</LoginHeader>
    <section class="container" v-if="isBind">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section >
  <section class="container" v-else>
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-bind" />
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
        href="javascript:;"
      >
        <i class="iconfont icon-edit" />
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <CallbackBind :unionId='unionId'  />
    </div>
    <div class="tab-content" v-else>
      <CallbackPatch :unionId='unionId' />
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import LoginHeader from './components/login-header.vue'
import LoginFooter from './components/login-footer.vue'
import CallbackBind from './components/CallbackBind.vue'
import CallbackPatch from './components/CallbackPatch.vue'
import { userQQLogin } from '@/api/user'
import Message from '@/components/library/message'
import QC from 'qc'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'PageCallback',
  components: {
    LoginHeader, LoginFooter, CallbackBind, CallbackPatch
  },

  setup (props) {
    const unionId = ref(null)
    const store = useStore()
    const router = useRouter()
    const isBind = ref(true)
    const hasAccount = ref(true)
    if (QC.Login.check()) {
      QC.Login.getMe(function (openId) {
        userQQLogin(openId).then(res => {
          // 成功
          // 1. 存储信息
          const { id, account, nickname, avatar, token, mobile } = res.result
          store.commit('user/setUser', {
            id,
            account,
            nickname,
            avatar,
            token,
            mobile
          })
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 2. 跳转
            const path = store.state.user.redirectUrl
            router.push(path)
            // 3. 提示
            Message({ type: 'success', text: 'QQ登录成功' })
          })
        }).catch(e => {
          isBind.value = false
        })
      })
    }
    return { hasAccount, isBind, unionId }
  }
}
</script>

<style scoped lang='less'>
.container {

  padding: 25px 0;
  position: relative;
  height: 730px;
}

  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
    }
  }

.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
</style>
