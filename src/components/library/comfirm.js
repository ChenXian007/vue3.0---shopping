import Confirm from './xtx-confirm.vue'
import { createVNode, render } from 'vue'
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

export default ({ title, text }) => {
  return new Promise((resolve, reject) => {
    const submitCallback = () => {
      resolve()
      render(null, div)
    }
    const cancleCallback = () => {
      reject(new Error('点击取消'))
      render(null, div)
    }
    const VNode = createVNode(Confirm, { title, text, submitCallback, cancleCallback })
    render(VNode, div)
  })
}
