import axios from '../utils/http.js'

function getTown(query, cb, errorCb) {
  axios.get('/option/getTownByField.do?' + query).then(cb).catch(errorCb);
}

function getTownShip(query, cb, errorCb) {
  axios.get('/option/getTownShipByField.do?' + query).then(cb).catch(errorCb);
}

function getVillage(query, cb, errorCb) {
  axios.get('/option/getVillageByField.do?' + query).then(cb).catch(errorCb);
}

//根据区县获取派出所列表
function getPolice(query, cb, errorCb) {
    axios.get('/account/rolePermissionManager/selectPoliceS.do?' + query).then(cb).catch(errorCb);
}

//根据派出所获取小区列表
function getUnitByPolice(query, cb, errorCb) {
    axios.get('/account/rolePermissionManager/selectUnitByPolice.do?' + query).then(cb).catch(errorCb);
}

function getUnit(query, cb, errorCb) {
  axios.get('/option/getUnitByField.do?' + query).then(cb).catch(errorCb);
}

function getCarFlow(data, cb, errorCb) {
  axios.post('/car/dateCount.do', data).then(cb).catch(errorCb);
}

function getPeopleFlow(data, cb, errorCb) {
  axios.post('/door/dateCount.do', data).then(cb).catch(errorCb);
}

function getVistor(data, cb, errorCb) {
  axios.post('/door/visitorCount.do', data).then(cb).catch(errorCb);
}

function getTechDefence(data, cb, errorCb) {
  axios.post('/safety/technicalDefence.do', data).then(cb).catch(errorCb);
}

//车场数据
function getUnitCarData(data, cb, errorCb) {
  axios.post('/unit/carData.do', data).then(cb).catch(errorCb);
}

function getCivilDefense(query, cb, errorCb) {
  axios.get('/safety/civilDefence.do?' + query).then(cb).catch(errorCb)
}

function getUnitData(query, cb, errorCb) {
  axios.get('/unit/queryUnitByType.do?' + query).then(cb).catch(errorCb)
}

function getPopulationStatistics(query, cb, errorCb) {
  axios.get('/populationManager/populationStatistics.do?' + query).then(cb).catch(errorCb)
}

function getStateRooms(query, cb, errorCb) {
  axios.get('/house/stateRooms.do?' + query).then(cb).catch(errorCb)
}

function getObjectDefence(query, cb, errorCb) {
  axios.get('/safety/objectDefence.do?' + query).then(cb).catch(errorCb)
}

function getSpecialPerson(query, cb, errorCb) {
  axios.get('/speicalPerson/queryByCategory.do?' + query).then(cb).catch(errorCb)
}

function getSafetyExponent(query, cb, errorCb) {
  axios.get('/safety/unitCaseArisesIndexRealTime.do?' + query).then(cb).catch(errorCb)
}

function getCarDateCount(query, cb, errorCb) {
  axios.get('/car/dateCount.do?' + query).then(cb).catch(errorCb);
}

function getPersonDateCount(query, cb, errorCb) {
  axios.get('/door/dateCount.do?' + query).then(cb).catch(errorCb);
}

//直接根据区县，乡镇，居委会查找小区列表
function getUnitByCode(data, cb, errorCb) {
    axios.post('option/selectUnits.do', data).then(cb).catch(errorCb);
}

function getCustomLayout() {
  return axios.get('/modular/getModuleAccount.do')
}

function postCustomLayout(array){
  return axios.post('/modular/editModuleAccount.do', {
    modelPlace: encodeURIComponent(JSON.stringify(array))
  })
}

export default {
  getTown,
  getTownShip,
  getVillage,
  getPolice,
  getUnitByPolice,
  getUnit,
  getCarFlow,
  getPeopleFlow,
  getTechDefence,
  getCivilDefense,
  getUnitData,
  getPopulationStatistics,
  getStateRooms,
  getObjectDefence,
  getSpecialPerson,
  getSafetyExponent,
  getCarDateCount,
  getUnitCarData,
  getPersonDateCount,
  getUnitByCode,
  getCustomLayout,
  postCustomLayout,
  getVistor
}
