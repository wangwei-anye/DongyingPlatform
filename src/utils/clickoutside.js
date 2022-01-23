/*eslint-disable */ 
const nodeList = []
const ctx = '@@clickoutsideContext'

let startClick
let seed = 0

document.addEventListener('mousedown', e => (startClick = e))
document.addEventListener('mouseup', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick))
})

export default {
  install (Vue, options) {
    Vue.directive('click-outside', {
      bind(el, binding, vnode) {
        nodeList.push(el)
        const id = seed++
        const documentHandler = function (mouseup = {}, mousedown = {}) {
          if (!vnode.context ||
            !mouseup.target ||
            !mousedown.target ||
            el.contains(mouseup.target) ||
            el.contains(mousedown.target) ||
            el === mouseup.target) return
    
          if (binding.expression &&
            el[ctx].methodName &&
            vnode.context[el[ctx].methodName]) {
            vnode.context[el[ctx].methodName]()
          } else {
            el[ctx].bindingFn && el[ctx].bindingFn()
          }
        };
        el[ctx] = {
          id,
          documentHandler,
          methodName: binding.expression,
          bindingFn: binding.value
        }
      },
    
      update(el, binding) {
        el[ctx].methodName = binding.expression
        el[ctx].bindingFn = binding.value
      },
    
      unbind(el) {
        let len = nodeList.length
    
        for (let i = 0; i < len; i++) {
          if (nodeList[i][ctx].id === el[ctx].id) {
            nodeList.splice(i, 1)
            break
          }
        }
      }
    })
  }
}
/*eslint-enable */


