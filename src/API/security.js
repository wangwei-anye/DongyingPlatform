import axios from '../utils/http.js'

function getPercent(data, cb, errorCb) {
  axios.post('safety/patrolPercentOfPassHistogram.do', data).then(cb).catch(errorCb);
}

function getSecurityData(data, cb, errorCb) {
  axios.post('safety/nightPatrolData.do', data).then(cb).catch(errorCb);
}

function getSecurityWeekData(data, cb, errorCb) {
  axios.post('safety/nightPatrolWeekData.do', data).then(cb).catch(errorCb);
}

function getSecurityMonthData(data, cb, errorCb) {
  axios.post('safety/nightPatrolMonthData.do', data).then(cb).catch(errorCb);
}

function querySecurity(data, cb, errorCb) {
  axios.post('safety/nightPatrolStandardSearch.do', data).then(cb).catch(errorCb);
}

function saveSecurity(data, cb, errorCb) {
  axios.post('safety/nightPatrolStandard.do', data).then(cb).catch(errorCb);
}

export default {
  getSecurityData,
  getSecurityWeekData,
  getSecurityMonthData,
  getPercent,
  querySecurity,
  saveSecurity
}
