<template>
  <div class="xtx-pagination">
    <a href="javascript:;" v-if="myCurrengPage <= 1" class="disabled">上一页</a>
    <a v-else href="javascript:;" @click="changePage(myCurrengPage-1)" >上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a v-for="i in pager.btnArr" :key="i"  href="javascript:;" @click="changePage(i)" :class="{active: myCurrengPage === i}">{{i}}</a>
    <span v-if="pager.end < pager.pageTotal ">...</span>
    <a href="javascript:;" v-if="myCurrengPage >= pager.pageTotal" class="disabled">下一页</a>
    <a v-else href="javascript:;" @click="changePage(myCurrengPage + 1)">下一页</a>
  </div>
</template>
<script>
import { ref, computed, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 1
    },
    currengPage: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    const myCurrengPage = ref(1)

    const myTotal = ref(100)
    const myPageSize = ref(10)

    // 按钮个数
    const btnCount = 5

    // 计算属性
    const pager = computed(() => {
      // 总页数
      const pageTotal = Math.ceil(myTotal.value / myPageSize.value)
      let start = myCurrengPage.value - Math.floor(btnCount / 2)
      let end = start + btnCount - 1
      if (start < 1) {
        start = 1
        end = (start + btnCount - 1) > pageTotal ? pageTotal : (start + btnCount - 1)
      }
      if (end > pageTotal) {
        end = pageTotal
        start = (end - btnCount + 1) < 1 ? 1 : (end - btnCount + 1)
      }
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return {
        pageTotal,
        start,
        end,
        btnArr
      }
    }

    )
    watch(props, () => {
      myCurrengPage.value = props.currengPage

      myTotal.value = props.total // ...
      myPageSize.value = props.pageSize // ...
      console.log(myTotal.value, myPageSize.value)
    }, { immediate: true })

    const changePage = (page) => {
      emit('current-change', page)
    }
    return { myCurrengPage, pager, changePage }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
