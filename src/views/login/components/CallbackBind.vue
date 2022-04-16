<template>
  <Form
    ref="formCom"
    v-slot="{ errors }"
    :validation-schema="mySchema"
    autocomplete="off"
    class="xtx-form"
  >
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi,{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <!-- item -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" v-model="form.mobile" class="input"  name="mobile" type="text" placeholder="绑定的手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <!-- item -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}" v-model="form.code" class="input"  name="code" type="text" placeholder="短信验证码" />
        <span @click="send" class="code">{{time==0?'发送验证码':`${time}后发送`}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
// import { userQQBind } from '@/api/user'
// import { useStore } from 'vuex'
import { ref, reactive, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import QC from 'qc'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import Message from '@/components/library/message'
export default {
  name: 'CallbackBind',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: {
    Form, Field
  },
  setup (props, { emit }) {
    // const store = useStore()

    const nickname = ref('null')
    const avatar = ref('null')
    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 表单校验对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code

    }
    // 表单元素
    const formCom = ref(null)

    if (QC.Login.check()) {
      QC.api('get_user_info').success((res) => {
        avatar.value = res.data.figureurl_1
        nickname.value = res.data.nickname
      })
    }
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

    const time = ref(0)
    // 获取验证码
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      // 13911111111 246810
      if (valid === true) {
        if (time.value === 0) {
          try {
            await userQQBindCode(form.mobile)
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
    // 绑定手机号
    const submit = async () => {
      const valid = mySchema.mobile()
      if (valid) {
        const obj = {
          unionId: props.unionId,
          ...form
        }
        const data = await userQQBindLogin(obj)
        // 1. 存储用户信息
        const { id, account, avatar, mobile, nickname, token } = data.result
        store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
        // 合并购物车
        store.dispatch('cart/mergeLocalCart').then(() => {
          // 2. 跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 3. 成功提示
          Message({ type: 'success', text: 'QQ绑定成功' })
        })
      } else {
        // 4. 成功提示
        Message({ type: 'success', text: 'QQ绑定失败' })
      }
    }
    return { nickname, avatar, formCom, form, mySchema, time, send, submit }
  }
}
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
