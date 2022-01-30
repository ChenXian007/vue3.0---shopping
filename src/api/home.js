import { Request } from '@/utils/request'

export const findBrand = (limit = 6) => {
  return Request('/home/brand', 'get', { limit })
}

/**
 * 获取广告图
 * @returns Promise
 */
export const findBanner = () => {
  return Request('/home/banner', 'get')
}

export const findNew = () => {
  return Request('home/new', 'get')
}

export const findHot = () => {
  return Request('home/hot', 'get')
}
