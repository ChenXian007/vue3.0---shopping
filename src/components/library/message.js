import Message from './xtx-message.vue'
import { createVNode, render } from 'vue'
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)
let timer = null
export default ({ text, type }) => {
  const VNode = createVNode(Message, { text, type })
  render(VNode, div)
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 2000)
}
