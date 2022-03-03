import { Request } from '@/utils/request'

export const findAllCategory = () => {
  return Request('/home/category/head', 'get')
}

/**
 * 获取单个顶级分类信息
 * @param {String} id - 顶级分类ID
 */
export const findTopCategory = (id) => {
  console.log(id)
  return Request('/category', 'get', { id })
}

/**
 * 获取二级分类筛选条件数据
 * @param {String} id - 二级分类ID
 */
export const findSubCategoryFilter = (id) => {
  return Request('/category/sub/filter', 'get', { id })
}

/**
 * 获取分类下的商品（带筛选条件）
 * @param {Object} params - 可参考接口文档
 */

export const findSubCategoryGoods = (data) => {
  return Request('/category/goods/temporary', 'post', data)
}
