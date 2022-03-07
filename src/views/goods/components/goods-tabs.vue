<template>
    <div class="goods-tabs">
    <nav>
      <a @click="activename ='GoodsDetail'" :class="{active:activename === 'GoodsDetail'}" href="javascript:;">商品详情</a>
      <a @click="activename ='GoodsComment'" :class="{active:activename === 'GoodsComment'}" href="javascript:;">商品评价<span>({{goods.commentCount}})</span></a>
    </nav>
    <!-- 切换内容的地方 -->
    <component :is='activename'></component>
  </div>
</template>

<script>
import GoodsDetail from './goods-detail.vue'
import GoodsComment from './goods-comment.vue'
import { ref, inject } from 'vue'

export default {
  name: 'GoodsTabs',
  components: {
    GoodsDetail,
    GoodsComment
  },
  setup (props, { emit }) {
    const activename = ref('GoodsDetail')
    const goods = inject('goods')

    return { activename, goods }
  }
}
</script>

<style scoped lang='less'>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
