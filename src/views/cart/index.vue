<template>
  <div class="xtx-cart-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>购物车</XtxBreadItem>
      </XtxBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <XtxCheckbox
                  :modelValue="$store.getters['cart/ischeckAll']"
                  @change="checkAll"
                  >全选</XtxCheckbox
                >
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>
          <!-- 有效商品 -->
          <tbody>
            <tr v-if="$store.getters['cart/validList'].length === 0">
              <td colspan="6">
                <CartNone  />
              </td>
            </tr>
            <tr
              v-for="good in $store.getters['cart/validList']"
              :key="good.skuId"
            >
              <td>
                <XtxCheckbox
                  :modelValue="good.selected"
                  @change="($event) => checkOne(good.skuId, $event)"
                />
              </td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${good.id}`"
                    ><img :src="good.picture" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ good.name }}</p>
                    <!-- 选择规格组件 -->
                    <CartSku @change="$event=>updateCartSku(good.skuId,$event)" :skuId="good.skuId" :attrsText="good.attrsText"/>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ good.nowPrice }}</p>
                <p v-if="good.price - good.nowPrice > 0">
                  比加入时降价
                  <span class="red">&yen;{{ good.price - good.nowPrice }}</span>
                </p>
              </td>
              <td class="tc">
                <XtxNumbox :max="good.stock" :num="good.count" @change="$event => changeCount(good.skuId,$event)" />
              </td>
              <td class="tc">
                <p class="f16 red">
                  &yen;{{
                    (Math.round(good.nowPrice * 100) * good.count) / 100
                  }}
                </p>
              </td>
              <td class="tc">
                <p><a href="javascript:;">移入收藏夹</a></p>
                <p><a class="green" href="javascript:;" @click="deleteCart(good.skuId)">删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
          <!-- 无效商品 -->
          <tbody>
            <tr>
              <td colspan="6"><h3 class="tit">失效商品</h3></td>
            </tr>
            <tr
              v-for="good in $store.getters['cart/invalidList']"
              :key="good.skuId"
            >
              <td><XtxCheckbox style="color: #eee" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${good.id}`"
                    ><img :src="good.picture" alt=""
                  /></RouterLink>
                  <div>
                    <p class="name ellipsis">{{ good.name }}</p>
                    <p class="attr">{{ good.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ good.nowPrice }}</p>
              </td>
              <td class="tc">{{ good.count }}</td>
              <td class="tc">
                <p>
                  &yen;{{
                    (Math.round(good.nowPrice * 100) * good.count) / 100
                  }}
                </p>
              </td>
              <td class="tc">
                <p><a class="green" href="javascript:;" >删除</a></p>
                <p><a href="javascript:;">找相似</a></p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <XtxCheckbox
            @change="checkAll"
            :modelValue="$store.getters['cart/ischeckAll']"
            >全选</XtxCheckbox
          >
          <a href="javascript:;" @click="batchDeleteCart()" >删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a href="javascript:;" @click="batchDeleteCart(true)">清空失效商品</a>
        </div>
        <div class="total">
          共 {{ $store.getters["cart/validCount"] }} 件商品，已选择
          {{ $store.getters["cart/seleteCount"] }} 件，商品合计：
          <span class="red">¥{{ $store.getters["cart/seleteAmount"] }}</span>
          <XtxButton type="primary" @click="goCheckout">下单结算</XtxButton>
        </div>
      </div>
      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>
<script>
import GoodRelevant from '@/views/goods/components/goods-relevant'
import { useStore } from 'vuex'
import CartNone from './component/cart-none.vue'
import Comfirm from '@/components/library/comfirm'
import CartSku from './component/cart-sku.vue'
import Message from '@/components/library/message'
import { useRouter } from 'vue-router'
export default {
  name: 'XtxCartPage',

  setup (props, { emit }) {
    const store = useStore()
    const router = useRouter()
    // 单选
    const checkOne = (skuId, selected) => {
      store.dispatch('cart/updateCart', { skuId, selected })
    }
    // 改变数量
    const changeCount = (skuId, count) => {
      store.dispatch('cart/updateCart', { skuId, count })
    }
    // 全选
    const checkAll = (selected) => {
      store.dispatch('cart/checkAllCart', selected)
    }
    // 单个删除
    const deleteCart = (skuId) => {
      Comfirm({ text: '确认删除' }).then(() => {
        store.dispatch('cart/deleteCart', skuId)
      }).catch(e => {
        console.log(e)
      })
    }
    // 批量删除
    const batchDeleteCart = (isClear) => {
      Comfirm({ text: '确认删除' }).then(skuId => {
        store.dispatch('cart/batchDeleteCart', skuId)
      }).catch(e => {
        console.log(e)
      })
    }

    // 改变sku
    const updateCartSku = (oldSku, newSku) => {
      store.dispatch('cart/updateCartSku', { oldSku, newSku })
    }
    // 去结算
    const goCheckout = () => {
      if (store.getters['cart/seleteList'].length === 0) {
        return Message({ text: '至少选中一件商品才能结算' })
      }
      if (!store.state.user.profile.token) {
        Comfirm({ text: '下单结算需要登录，您是否去登录？' }).then(() => {
          // 点击确认
          router.push('/member/checkout')
        })
      } else {
        router.push('/member/checkout')
      }
    }
    return { checkOne, checkAll, deleteCart, batchDeleteCart, changeCount, updateCartSku, goCheckout }
  },
  components: { GoodRelevant, CartNone, CartSku }
}
</script>
<style scoped lang="less">
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}
.goods {
  display: flex;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
  }
  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;
    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;
  .xtx-checkbox {
    color: #999;
  }
  .batch {
    a {
      margin-left: 20px;
    }
  }
  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}
.xtx-cart-page {
  .cart {
    background: #fff;
    color: #666;
    table {
      border-spacing: 0;
      border-collapse: collapse;
      line-height: 24px;
      th,
      td {
        padding: 10px;
        border-bottom: 1px solid #f5f5f5;
        &:first-child {
          text-align: left;
          padding-left: 30px;
          color: #999;
        }
      }
      th {
        font-size: 16px;
        font-weight: normal;
        line-height: 50px;
      }
    }
  }
}
</style>
