import { Request } from '@/utils/request'

export const findBrand = (limit = 6) => {
  return Request('/home/brand', 'get', { limit })
}
