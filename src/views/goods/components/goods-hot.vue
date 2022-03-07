<template>
  <div class="goods-hot">
    <h3>{{title}}</h3>
    <div v-if="goodsList">
      <GoodsItem v-for="item in goodsList" :key="item.id" :goods="item"/>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/views/category/components/goods-item.vue'
import { findHotGoods } from '@/api/product'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
const getGoodsList = (type) => {
  const goodsList = ref([])
  const route = useRoute()
  findHotGoods({ id: route.params.id, type }).then(data => {
    goodsList.value = data.result
  })

  return goodsList
}
export default {
  name: 'GoodsHot',
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  components: { GoodsItem },
  setup (props, { emit }) {
    const types = { 1: '24小时热销榜', 2: '周热销榜', 3: '总热销榜' }
    const title = types[props.type]
    const goodsList = getGoodsList(props.type)
    return { goodsList, title }
  }

}
</script>
<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  ::v-deep .goods-item {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
