<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'xtx-checkbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const checked = ref(props.modelValue)
    const changeChecked = () => {
      checked.value = !checked.value
      emit('update:modelValue', checked.value)
      emit('change', checked.value)
    }
    return { checked, changeChecked }
  }
}
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
