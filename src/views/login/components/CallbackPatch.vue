<template>
  <Form
    ref="formCom"
    v-slot="{ errors }"
    :validation-schema="mySchema"
    autocomplete="off"
    class="xtx-form"
  >
  <!-- item -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{err:errors.account}" v-model="form.account" name='account'  class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account"  class="error">{{errors.account}}</div>
    </div>
  <!-- item -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" v-model="form.mobile" name='mobile' class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
  <!-- item -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}" v-model="form.code" name='code' class="input" type="text" placeholder="请输入验证码" />
        <span @click="send" class="code">{{time === 0 ? '发送验证码' : `${time}后发送`}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
  <!-- item -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.password}" v-model="form.password" name='password' class="input" type="password" placeholder="请输入密码" />
      </div>
      <div v-if="errors.password" class="error">{{errors.password}}</div>
    </div>
  <!-- item -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.rePassword}" v-model="form.rePassword" name='rePassword' class="input" type="password" placeholder="请确认密码" />
      </div>
      <div v-if="errors.rePassword" class="error">{{errors.rePassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { ref, reactive, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import Message from '@/components/library/message'

export default {
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  name: 'CallbackPatch',
  components: { Form, Field },
  setup (props, { emit }) {
    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null
    })
    // 表单校验对象
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }
    // 表单元素
    const formCom = ref(null)

    // 倒计时
    const time = ref(0)
    const { pause, resume } = useIntervalFn(
      () => {
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

    // 获取验证码
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      // 13911111111 246810
      if (valid === true) {
        if (time.value === 0) {
          try {
            await userQQPatchCode(form.mobile)
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

    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = formCom.value.validate()
      if (valid) {
        try {
          const data = await userQQPatchLogin({ unionId: props.unionId, ...form })
          // 1.存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 合并购物车
          store.dispatch('cart/mergeLocalCart').then(() => {
            // 2. 跳转到来源页或者首页
            router.push(store.state.user.redirectUrl)
            // 3. 成功提示
            Message({ type: 'success', text: 'QQ完善信息成功' })
          })
        } catch (error) {
          Message({ type: 'error', text: '完善信息失败' })
        }
      }
    }

    return { formCom, mySchema, form, send, time, submit }
  }
}
</script>

<style scoped lang="less">
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
