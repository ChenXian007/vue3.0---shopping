<template>
  <div class='xtx-goods-page' v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem  :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem  :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem  to="/">{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
            <GoodsImage :images = 'goods.mainPictures' />
            <GoodsSales />
        </div>
        <div class="spec">
            <GoodsName :goods="goods" />
            <GoodsSku :goods="goods"  @change="changeSku"/>
            <XtxNumbox v-model:num="num" :max='goods.inventory' @change='changefn' :label="'数量'"/>
            <xtx-button :type="'primary'" style="margin-top:20px" @click="insertCart" >加入购物车</xtx-button>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :id="goods.id"  />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <div class="goods-warn"></div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot :type="1" />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import { findGoods } from '@/api/product'
import { nextTick, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import XtxNumbox from '@/components/library/xtx-numbox.vue'
import XtxButton from '@/components/library/xtx-button.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/message'
export default {
  name: 'XtxGoodsPage',
  setup (props, { emit }) {
    const store = useStore()
    const goods = useGoods()
    const changeSku = (sku) => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      currSku.value = sku
    }

    const changefn = (nv) => {
      console.log(nv, num.value)
    }
    const currSku = ref(null)

    const insertCart = () => {
      if (currSku.value.skuId) {
        const { skuId, inventory: stock, specsText: attrsText, price: nowPrice } = currSku.value
        const { id, name, price, mainPictures } = goods.value
        store.dispatch('cart/insertCart', {
          skuId,
          stock,
          attrsText,
          id,
          name,
          price,
          nowPrice,
          picture: mainPictures[0],
          selected: true,
          isEffective: true,
          count: num.value
        }).then(() => {
          Message({ type: 'success', text: '添加购物车成功' })
        })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }
    provide('goods', goods)
    const num = ref(1)
    return { goods, changeSku, num, changefn, insertCart }
  },
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, XtxNumbox, XtxButton, GoodsTabs, GoodsHot }
}
const useGoods = () => {
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (nv) => {
    if (nv && route.path === `/product/${nv}`) {
      findGoods(route.params.id).then((res) => {
        goods.value = null
        nextTick(() => {
          goods.value = res.result
        })
      })
    }
  }, {
    immediate: true
  })
  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
