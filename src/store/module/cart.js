import { getNewCartGoods, mergeLocalCart, findCartList, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'
export default {
  namespaced: true,
  state () {
    return {
      list: []
    }
  },
  getters: {
    // 无效列表
    invalidList (state, getters) {
      return state.list.filter(v => v.stock <= 0 || !v.isEffective)
    },
    // 有效列表
    validList (state, getters) {
      return state.list.filter(v => v.stock > 0 && v.isEffective)
    },
    // 总件数
    validCount (state, getters) {
      return getters.validList.reduce((av, cv) => av + cv.count, 0)
    },
    // 总金额
    validAmount (state, getters) {
      return getters.validList.reduce((av, cv) => av + Math.round(cv.nowPrice * 100) * cv.count, 0) / 100
    },
    // 选中商品列表
    seleteList (state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 选中商品件数
    seleteCount (state, getters) {
      return getters.seleteList.reduce((av, cv) => av + cv.count, 0)
    },
    // 选中商品总价
    seleteAmount (state, getters) {
      return getters.seleteList.reduce((av, cv) => av + Math.round(cv.nowPrice * 100) * cv.count, 0) / 100
    },
    // 是否全选
    ischeckAll (state, getters) {
      return getters.seleteList.length === getters.validList.length && getters.seleteList.length !== 0
    }
  },
  mutations: {

    // 设置购物车列表
    setCartList (state, list) {
      state.list = list
    },
    deleteCart (state, pl) {
      const index = state.list.findIndex(v => v.skuId === pl)
      state.list.splice(index, 1)
    },
    insertCart (state, pl) {
      const index = state.list.findIndex(v => v.skuId === pl.skuId)

      if (index >= 0) {
        const count = state.list[index].count
        pl.count += count
        state.list.splice(index, 1)
      }
      state.list.unshift(pl)
    },
    updataCart (state, pl) {
      const target = state.list.find(v => v.skuId === pl.skuId)
      for (const key in pl) {
        if (pl[key] !== null && pl[key] !== undefined && pl[key] !== '') {
          target[key] = pl[key]
        }
      }
    }

  },
  actions: {
    // 合并本地购物车
    async mergeLocalCart (ctx) {
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = ctx.getters.validList.map(({ skuId, selected, count }) => {
        return { skuId, selected, count }
      })
      await mergeLocalCart(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setCartList', [])
    },
    // 更新sku
    updateCartSku (ctx, { oldSku, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
        // 登陆
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSku)
          deleteCart([oldSku]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
          }).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
        // 未登陆
          // 1. 获取旧的商品信息
          const oldGood = ctx.state.list.find(item => item.skuId === oldSku)
          // 2. 删除旧的商品
          ctx.commit('deleteCart', oldSku)
          // 3. 合并一条新的商品信息
          const { skuId, price: nowPrice, inventory: stock, specsText: attrsText } = newSku
          const newGoods = { ...oldGood, skuId, nowPrice, stock, attrsText }
          // 4. 去插入即可
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart (ctx, isclear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          const ids = ctx.getters[isclear ? 'invalidList' : 'seleteList'].map(item => item.skuId)
          // 登陆
          deleteCart(ids).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
        // 未登陆
          ctx.getters[isclear ? 'invalidList' : 'seleteList'].forEach(good => {
            ctx.commit('deleteCart', good.skuId)
          })
          resolve()
        }
      })
    },
    // 全选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
        // 登陆
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart(selected, ids).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
        // 未登陆
          ctx.getters.validList.forEach(good => {
            ctx.commit('updataCart', { skuId: good.skuId, selected })
          })
          resolve()
        }
      })
    },

    // 单选 改变数量
    updateCart (ctx, pl) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          updateCart(pl).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        // 登陆
        } else {
        // 未登陆
          ctx.commit('updataCart', pl)
          resolve()
        }
      })
    },
    // 删除
    deleteCart (ctx, pl) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登陆
          deleteCart([pl]).then(() => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登陆
          ctx.commit('deleteCart', pl)
          resolve()
        }
      })
    },
    // 添加
    insertCart (ctx, pl) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登陆
          insertCart({ skuId: pl.skuId, count: pl.count }).then(r => {
            return findCartList()
          }).then((data) => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登陆
          ctx.commit('insertCart', pl)
          resolve()
        }
      })
    },
    findCartList (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
          findCartList().then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
        } else {
          // 未登陆
          const promises = ctx.state.list.map(item => {
            return getNewCartGoods(item.skuId)
          })

          Promise.all(promises).then((dataList) => {
            dataList.forEach((v, i) => {
              ctx.commit('updataCart', { ...v.result, skuId: ctx.state.list[i].skuId })
            })
            resolve()
          }).catch(e => {
            reject(e)
          })
        }
      })
    }

  }
}
