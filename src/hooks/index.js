import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export const useLazyData = (apiFn) => {
  const target = ref(null)
  const result = ref([])
  // 这儿不是在监听一个null吗
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        apiFn().then((data) => {
          result.value = data.result
        })
      }
    }
  )

  return { target, result }
}
