import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      list: topCategory.map(item => ({ name: item }))
    }
  },
  // 加载数据成功后需要修改list所以需要mutations函数
  mutations: {
    setList (state, headCategory) {
      state.list = headCategory
    },
    // 显示
    show (state, id) {
      const category = state.list.find(item => item.id === id)
      category.open = true
    },
    // 隐藏
    hide (state, id) {
      const category = state.list.find(item => item.id === id)
      category.open = false
    }
  },
  actions: {
    async  getList ({ commit }) {
      const { result } = await findAllCategory()
      result.forEach(item => {
        item.open = false
      })
      commit('setList', result)
    }
  }
}
