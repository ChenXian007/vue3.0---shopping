<template>
  <div class="xtx-confirm">
    <div class="wrapper" :class="{fade}">
      <div class="header">
        <h3>温馨提示</h3>
        <a
          href="JavaScript:;"
          class="iconfont icon-close-new"
          @click="close"
        ></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>您确认从购物车删除该商品吗？</span>
      </div>
      <div class="footer">
        <XtxButton size="mini" type="gray" @click="close">取消</XtxButton>
        <XtxButton size="mini" type="primary" @click="open">确认</XtxButton>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue'
import XtxButton from './xtx-button.vue'
export default {
  props: {
    title: {
      type: String,
      default: '温馨提示'
    },
    text: {
      type: String,
      default: ''
    },
    submitCallback: {
      type: Function
    },
    cancleCallback: {
      type: Function
    }
  },
  components: {
    XtxButton
  },
  name: 'XtxConfirm',
  setup (props, { emit }) {
    const fade = ref(false)
    onMounted(() => {
      setTimeout(() => {
        fade.value = true
      }, 0)
    })
    const open = () => {
      props.submitCallback()
    }
    const close = () => {
      props.cancleCallback()
    }

    return { open, close, fade }
  }
}
</script>
<style scoped lang="less">
.xtx-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0, 0, 0, 0);
  &.fade {
    transition: all 0.4s;
    background: rgba(0, 0, 0, 0.5);
  }
  background: rgba(0, 0, 0, 0.5);
  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    opacity: 0;
    &.fade {
      transition: all 0.4s;
      transform: translate(-50%, -50%);
      opacity: 1;
    }
    .header,
    .footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .xtx-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
