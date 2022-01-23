// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import iView from 'iview'
import transferDom from '@/utils/transfer-dom'
import clickOutside from '@/utils/clickoutside'
import 'iview/dist/styles/iview.css'
import '@/sass/Select.scss'
import '@/assets/css/common.scss'
// 图标字体样式
import '@/assets/css/iconfont.scss'
// 表格组件样式
import '@/assets/css/Table.scss'
// 时间轴组件样式
import '@/assets/css/TimeLine.scss'
// 标签页组件样式
import '@/assets/css/Tab.scss'
// 折叠面板组件样式
import '@/assets/css/Collapse.scss'
// 日期选择器组件样式
import '@/assets/css/DatePicker.scss'
// 按钮组件样式
import '@/assets/css/Button.scss'
// 输入框组件样式
import '@/assets/css/Input.scss'
// 模态框组件样式
import '@/assets/css/Modal.scss'
//覆写iview datepicker
import '@/sass/DatePicker.scss'

Vue.use(iView)

Vue.config.productionTip = false


Vue.use(iView);
Vue.use(transferDom);
Vue.use(clickOutside)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
