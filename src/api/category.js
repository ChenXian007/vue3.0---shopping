import { Request } from '@/utils/request'

export const findAllCategory = () => {
  return Request('/home/category/head', 'get')
}
