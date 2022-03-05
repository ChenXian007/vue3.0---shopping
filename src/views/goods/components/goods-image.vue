<template>
  <div class="goods-image">
      <!-- 中图 -->
    <div class="middle" ref="target">
        <img :src="images[currIndex]" alt="">
        <div v-show="!isOutside"  class="layer" :style="layerPos"></div>
    </div>
    <!-- 大图 -->
    <div class="large" v-show="!isOutside" :style="[{backgroundImage:`url(${images[currIndex]})`},largeImagePos]"></div>
    <!-- 小图 -->
    <ul class="small">
      <li v-for="(img,i) in images" :key="img" :class="{active:i===currIndex}">
        <img @mouseenter="currIndex=i" :src="img" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const currIndex = ref(0)
    const target = ref(null)
    const layerPos = reactive({
      top: 0,
      left: 0
    })
    const largeImagePos = reactive({ backgroundPositionX: 0, backgroundPositionY: 0 })
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    watch([elementX, elementY], () => {
      const pos = { x: 0, y: 0 }
      if (elementX.value < 100) {
        pos.x = 0
      } else if (elementX.value > 300) {
        pos.x = 200
      } else {
        pos.x = elementX.value - 100
      }
      if (elementY.value < 100) {
        pos.y = 0
      } else if (elementY.value > 300) {
        pos.y = 200
      } else {
        pos.y = elementY.value - 100
      }
      layerPos.left = pos.x + 'px'
      largeImagePos.backgroundPositionX = -2 * pos.x + 'px'
      layerPos.top = pos.y + 'px'
      largeImagePos.backgroundPositionY = -2 * pos.y + 'px'
    })
    return { currIndex, isOutside, target, layerPos, largeImagePos }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
    .large {
        position: absolute;
        top: 0;
        left: 412px;
        width: 400px;
        height: 400px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        background-repeat: no-repeat;
        background-size: 800px 800px;
        background-color: #f8f8f8;
    }
  .middle {
    position: relative;
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    cursor: move;
    .layer {
        position: absolute;
        left: 0;
        top: 0;
        width: 200px;
        height: 200px;
        background: rgba(0,0,0,.2);

    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,&.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
