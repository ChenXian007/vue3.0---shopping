<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form
      ref="formCom"
      class="form"
      v-slot="{ errors }"
      :validation-schema="mySchema"
      autocomplete="off"
    >
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.account }"
              v-model="form.account"
              name="account"
              type="text"
              placeholder="请输入用户名"
            />
          </div>
          <div v-if="errors.account" class="error">
            <i class="iconfont icon-warning" />{{ errors.account }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field
              :class="{ error: errors.password }"
              v-model="form.password"
              name="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <div v-if="errors.password" class="error">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field
              :class="{ error: errors.mobile }"
              type="text"
              v-model="form.mobile"
              name="mobile"
              placeholder="请输入手机号"
            />
          </div>
          <div v-if="errors.mobile" class="error">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field
              :class="{ error: errors.code }"
              type="password"
              v-model="form.code"
              name="code"
              placeholder="请输入验证码"
            />
            <span class="code" @click="send">{{
              time === 0 ? "发送验证码" : `${time}秒后发送`
            }}</span>
          </div>
          <div v-if="errors.code" class="error">
            <i class="iconfont icon-warning" />{{ errors.code }}
          </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <xtx-checkbox v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
      >
        <img
          src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
          alt=""
        />
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
  <router-link to="/">测试</router-link>
</template>

<script>
import { reactive, ref, watch, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import {
  userAccountLogin,
  userMobileLoginMsg,
  userMobileLogin
} from '@/api/user'
import Message from '@/components/library/message'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useIntervalFn } from '@vueuse/shared'
export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup (props, { emit }) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const isMsgLogin = ref(false)
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 重置数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 如果是没有销毁Field组件，之前的校验结果是不会清除  例如：v-show切换的
      // Form组件提供了一个 resetForm 函数清除校验结果
      formCom.value.resetForm()
    })
    // const { proxy } = getCurrentInstance()
    const login = async () => {
      const valid = await formCom.value.validate()
      if (valid) {
        let data = null
        try {
          if (!isMsgLogin.value) {
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          } else {
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          }

          // 成功
          // 1. 存储信息
          const { id, account, nickname, avatar, token, mobile } = data.result
          store.commit('user/setUser', {
            id,
            account,
            nickname,
            avatar,
            token,
            mobile
          })
          // 合并购物车
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 2. 跳转
            router.push(route.query.redirectUrl || '/')
            // 3. 提示
            Message({ type: 'success', text: '登录成功' })
          })
        } catch (e) {
          // 失败提示
          if (e.response.data) {
            Message({
              type: 'error',
              text: e.response.data.message || '登录失败'
            })
          }
        }

        // proxy.$message({ text: '请输入用户名', type: 'success' })
        // Message({ text: '请输入用户名', type: 'error' })
      }
    }
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code
    }

    const time = ref(0)
    const { pause, resume } = useIntervalFn(
      () => {
        console.log(1)
        time.value--
        if (time.value <= 0) {
          pause()
        }
      },
      1000,
      { immediate: false }
    )

    onUnmounted(() => {
      pause()
    })

    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      // 13911111111 246810
      if (valid === true) {
        if (time.value === 0) {
          try {
            await userMobileLoginMsg(form.mobile)
            Message({ type: 'success', text: '验证码已经发送' })
            time.value = 10
            resume()
          } catch (error) {
            console.log(error)
          }
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }

    return { form, isMsgLogin, mySchema, formCom, login, send, time }
  }
}
</script>

<style scoped lang="less">
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
