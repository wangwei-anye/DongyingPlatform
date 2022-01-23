let domModal = {}
let allDoms = new Map()
domModal.install = function (Vue, options) {
  Vue.directive('transfer-dom', {
    inserted (el, binding, vnode) {
      let target = binding.value
      let source = el.parentNode
      let targetDom = document.querySelector(target)
      targetDom.appendChild(el)
      if (!allDoms.has(el)) {
        allDoms.set(el, {
          source: source,
          target: target,
          targetDom: targetDom
        })
      }
    },
    update (el, binding, vnode, oldVnode) {},
    componentUpdated (el, binding, vnode, oldVnode) {},
    unbind (el, binding, vnode) {
      allDoms.delete(el)
      el.parentNode.removeChild(el)
    }
  })
}
export default domModal