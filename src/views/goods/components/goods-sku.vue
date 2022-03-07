<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.name">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            v-if="val.picture"
            :class="{ selected: val.selected,disabled: val.disabled }"
            :src="val.picture"
            @click="changeSku(val, item)"
          />
          <span
            v-else
            :class="{ selected: val.selected,disabled: val.disabled  }"
            @click="changeSku(val, item)"
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>
import powerSet from '@/vender/power-set'
const sp = '⭐️'

const getPathMap = (skus) => {
  const pathMap = new Map()
  skus.forEach((sku) => {
    if (sku.inventory > 0) {
      const valueArr = sku.specs.map((obj) => {
        return obj.valueName
      })
      const subSetArr = powerSet(valueArr)
      subSetArr.forEach((item) => {
        const key = item.join(sp)
        if (pathMap.has(key)) {
          const arr = pathMap.get(key)
          arr.push(sku.id)
          pathMap.set(key, arr)
        } else {
          pathMap.set(key, [sku.id])
        }
      })
    }
  })
  return pathMap
}
const getArr = (specs) => {
  const selectedArr = []
  specs.forEach((item) => {
    const p = item.values.find((val) => val.selected)
    selectedArr.push(p ? p.name : undefined)
  })

  return selectedArr
}

const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((item, i) => {
    const selectedArr = getArr(specs)
    item.values.forEach((val) => {
      if (selectedArr[i] === val.name) return
      selectedArr[i] = val.name
      const str = selectedArr.filter((v) => v).join(sp)

      if (!pathMap.has(str)) {
        val.disabled = true
      } else {
        val.disabled = false
      }
    })
  })
}

const initSelectedStatu = (goods, skuid) => {
  const sku = goods.skus.find(p => p.id === skuid).specs
  goods.specs.forEach((item, i) => {
    const val = item.values.find(p => p.name === sku[i].valueName)
    val.selected = true
  })
}

const changeSkuObj = (goods, pathMap) => {
  const selectedArr = getArr(goods.specs).filter(p => p)
  if (selectedArr.length === goods.specs.length) {
    const skuid = pathMap.get(selectedArr.join(sp))[0]
    const sku = goods.skus.find(p => p.id === skuid)
    return {
      skuId: sku.id,
      price: sku.price,
      oldPrice: sku.oldPrice,
      inventory: sku.inventory,
      specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').replace(' ', '').trim()
    }
  } else {
    return {}
  }
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuid: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    if (props.skuid) {
      initSelectedStatu(props.goods, props.skuid)
    }

    updateDisabledStatus(props.goods.specs, pathMap)

    const changeSku = (val, item) => {
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach((v) => {
          v.selected = false
        })
        val.selected = true
      }
      updateDisabledStatus(props.goods.specs, pathMap)
      const skuObj = changeSkuObj(props.goods, pathMap)
      emit('change', skuObj)
    }
    return { changeSku }
  }
}
</script>

<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
