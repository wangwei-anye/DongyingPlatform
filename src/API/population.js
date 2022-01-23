import axios from '../utils/http.js'


function getDistribution(data, cb, errorCb) {
  axios.post('populationManager/distribution.do', data).then(cb).catch(errorCb);
}

function getData(data, cb, errorCb) {
  axios.post('populationManager/data.do', data).then(cb).catch(errorCb);
}

function getList(data, cb, errorCb) {
  axios.post('populationManager/list.do', data).then(cb).catch(errorCb);
}

export default {
  getDistribution,
  getData,
  getList
}
