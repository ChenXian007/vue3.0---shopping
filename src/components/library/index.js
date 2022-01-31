import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets//images/200.png'
export default {
  install (app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    app.component(XtxSkeleton.name, XtxSkeleton)
    app.component(XtxCarousel.name, XtxCarousel)
    app.component(XtxMore.name, XtxMore)
    useLazyLoad(app)
  }
}
const useLazyLoad = (app) => {
  app.directive('lazy', {
    // insert中可以拿到真实dom
    mounted (el, binding) {
      // 创建一个observer， 回调进入和离开可视区都会触发
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        // 第一次触发取消监听
        if (isIntersecting) {
          observer.unobserve(el)
          // 图片错误请求默认图片
          el.onerror = () => {
            el.src = defaultImg
          }
          // 把指令的路径赋值给src
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      // 开启监听
      observer.observe(el)
    }
  })
}
