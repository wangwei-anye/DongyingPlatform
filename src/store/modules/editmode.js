const state = {
  status: 'default',  //custom editing
  appDatas: [
    {id: 1, value: 'rksj', name: '人口数据'},
    {id: 2, value: 'xqsj', name: '小区数据'},
    {id: 3, value: 'fwsj', name: '房屋数据'},
    {id: 4, value: 'rcll', name: '人车流量'},
    {id: 5, value: 'tsry', name: '特殊人员'},
    {id: 6, value: 'xqaqph', name: '小区安全排行榜'},
    {id: 7, value: 'ssjk', name: '实时监控'},
    {id: 8, value: 'mjzp', name: '门禁抓拍'},
    {id: 9, value: 'fkjl', name: '访客记录'},
    {id: 10, value: 'ccsj', name: '车场数据'},
    {id: 11, value: 'mjsj', name: '门禁数据'}
  ],
  defaultLayout: [
    {id: 2, value: 'xqsj', name: '小区数据'},
    {id: 3, value: 'fwsj', name: '房屋数据'},
    {id: 1, value: 'rksj', name: '人口数据'},
    {id: 4, value: 'rcll', name: '人车流量'},
    {id: 5, value: 'tsry', name: '特殊人员'},
    {id: 6, value: 'xqaqph', name: '小区安全排行榜'},
    {id: 7, value: 'ssjk', name: '实时监控'},
    {id: 8, value: 'mjzp', name: '门禁抓拍'}
  ],  // 0-7对应的默认模块
  customLayout: [null, null, null, null, null, null, null, null]
}

const mutations = {
  setStatus (state, status) {
    state.status = status;
  },
  setCustomLayout (state, data) {
    state.customLayout[data.id] = data.item;
  },
  initCustomLayout (state, array) {
    state.customLayout = array
  }
}

export default {
  namespaced: true,
  state,
  mutations
}