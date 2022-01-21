// 1. 创建一个新的axios实例
// 2. 请求拦截器，如果有token进行头部携带
// 3. 响应拦截器：1. 剥离无效数据  2. 处理token失效
// 4. 导出一个函数，调用当前的axsio实例发请求，返回值promise
import axios from 'axios'
import store from '@/store'
import router from '@/router'
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const request = axios.create({
  baseURL,
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(config => {
  const { profile } = store.state.user
  console.log(profile.token)
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器

request.interceptors.response.use(res => res.data,

  // 错误
  err => {
    if (err.response && err.response.status === 401) {
      // 清空用户模块
      store.commit('user/setUser', {})

      // router.currentRoute, 路由守卫的from，to，都是路由对象。
      // encodeURIComponent用于防止fullpath出现/user?a=1&b=1
      // js模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 是ref响应式数据
      const fullpath = encodeURIComponent(router.currentRoute.value.fullPath)
      router.push(`/login?redirectUrl=${fullpath}`)
      return Promise.reject(err)
    }
  })

export const Request = (url, method, submitData) => {
  return request({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
