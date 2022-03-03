<template>
  <div class='sub-sort'>
    <div class="sort">
      <a :class="{active: sortParams.sortField === null}" @click="sortGood(null)" href="javascript:;" >默认排序</a>
      <a :class="{active: sortParams.sortField === 'publishTime'}" @click="sortGood('publishTime')"  href="javascript:;">最新商品</a>
      <a :class="{active: sortParams.sortField === 'orderNum'}" @click="sortGood('orderNum')"  href="javascript:;">最高人气</a>
      <a :class="{active: sortParams.sortField === 'evaluateNum'}" @click="sortGood('evaluateNum')" href="javascript:;">评论最多</a>
      <a href="javascript:;"  @click="sortGood('price')">
        价格排序
        <i class="arrow up" :class="{active:sortParams.sortField === 'price' && sortParams.sortMethod === 'asc'}"  />
        <i class="arrow down" :class="{active:sortParams.sortField === 'price' && sortParams.sortMethod === 'desc'}" />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @change="changeCheck" v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox @change="changeCheck" v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import XtxCheckbox from '@/components/library/xtx-checkbox.vue'
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  components: {
    XtxCheckbox
  },
  setup (props, { emit }) {
    const sortParams = reactive({
      inventory: false,
      onlyDiscount: false,
      sortField: null,
      sortMethod: null
    })
    const sortGood = (flag) => {
      if (flag === 'price') {
        sortParams.sortField = flag
        if (sortParams.sortMethod == null) {
          sortParams.sortMethod = 'desc'
          return
        }
        sortParams.sortMethod = sortParams.sortMethod === 'asc' ? 'desc' : 'asc'
      } else {
        if (sortParams.sortField === flag) {
          return
        }
        sortParams.sortField = flag
        sortParams.sortMethod = null
      }
      emit('sort-change', sortParams)
    }
    const changeCheck = () => {
      emit('sort-change', sortParams)
    }
    return { sortParams, sortGood, changeCheck }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all .3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
            &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
