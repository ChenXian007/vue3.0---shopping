<template>
  <div class='sub-category'>
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 筛选区 -->
      <SubFilter @filter-change="changeFilter"  />
      <div class="goods-list">
        <!-- 排序 -->
        <SubSort @sort-change = sortChange />
        <!-- 列表区 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id" >
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <XtxInfiniteLoading :loading="loading" :finished="finished" @getData = getData />
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import XtxInfiniteLoading from '@/components/library/xtx-infinite-loading.vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'

export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem,
    XtxInfiniteLoading
  },
  setup () {
    const route = useRoute()
    const isAll = ref(true)
    const isAllChange = () => {
      console.log(123)
    }
    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    // 查询参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    // 切换二级类目触发watch
    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === `/category/sub/${newVal}`) {
        goodsList.value = []
        reqParams.page = 1
        reqParams.pageSize = 20
        finished.value = false
      }
    })

    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        reqParams.page++
        if (result.items.length) {
          goodsList.value.push(...result.items)
        } else {
          finished.value = true
        }
        loading.value = false
      })
    }
    // 排序组件
    const sortChange = (sortParams) => {
      finished.value = false
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
    }
    // 筛选组件
    const changeFilter = (filterParams) => {
      console.log(filterParams)
      finished.value = false
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
    }

    return { isAll, isAllChange, loading, finished, getData, goodsList, sortChange, changeFilter }
  }

}
</script>

<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
