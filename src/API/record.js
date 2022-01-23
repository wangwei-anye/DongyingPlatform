import axios from '../utils/http.js'

function doorRecord(data, cb, errorCb) {
  axios.post('/door/record.do', data).then(cb).catch(errorCb);
}

function queryUnitById(data, cb, errorCb) {
  axios.post('/unit/queryUnitById.do', data).then(cb).catch(errorCb);
}

function carRecord(data, cb, errorCb) {
  axios.post('/car/record.do', data).then(cb).catch(errorCb);
}
//车场
function queryCarByUnit(data, cb, errorCb) {
  axios.post('/unit/queryCarByUnit.do', data).then(cb).catch(errorCb);
}
//门禁
function queryDoorByUnit(data, cb, errorCb) {
  axios.post('/unit/queryDoorByUnit.do', data).then(cb).catch(errorCb);
}


export default {
  doorRecord,
  carRecord,
  queryUnitById,
  queryCarByUnit,
  queryDoorByUnit
}
