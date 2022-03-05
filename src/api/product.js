import { Request } from '@/utils/request'

export const findGoods = (id) => {
  return Request('/goods', 'get', { id })
}
