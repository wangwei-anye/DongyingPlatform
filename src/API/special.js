import axios from '../utils/http.js'


function getTownList(data, cb, errorCb) {
  axios.post('option/getTownByField.do', data).then(cb).catch(errorCb);
}

function getTownShipList(data, cb, errorCb) {
  axios.post('option/getTownShipByField.do', data).then(cb).catch(errorCb);
}

function getVillageList(data, cb, errorCb) {
  axios.post('option/getVillageByField.do', data).then(cb).catch(errorCb);
}

function getUnitByCode(data, cb, errorCb) {
    axios.post('option/selectUnits.do', data).then(cb).catch(errorCb);
}

function getUnitList(data, cb, errorCb) {
  axios.post('option/getUnitByField.do', data).then(cb).catch(errorCb);
}

function getSpecialStat(data, cb, errorCb) {
	axios.post('speicalPerson/queryByBigCategory.do', data).then(cb).catch(errorCb);
}

function getSpecialMap(data, cb, errorCb) {
	axios.post('speicalPerson/queryByUnit.do', data).then(cb).catch(errorCb);
}

function getSpecialData(data, cb, errorCb) {
	axios.post('speicalPerson/queryByParam.do', data).then(cb).catch(errorCb);
}

function getSpecialList(data, cb, errorCb) {
	axios.post('speicalPerson/querySpeicalPersonByPage.do', data).then(cb).catch(errorCb);
}

function addSpecialUsr(data, cb, errorCb) {
	axios.post('speicalPerson/addSpeicalPerson.do', data).then(cb).catch(errorCb);
}

function updateSpecialUsr(data, cb, errorCb) {
	axios.post('speicalPerson/updateSpeicalPerson.do', data).then(cb).catch(errorCb);
}

function delSpecialUsr(data, cb, errorCb) {
	axios.post('speicalPerson/deleteSpeicalPerson.do', data).then(cb).catch(errorCb);
}

export default {
  getTownList,
  getTownShipList,
  getVillageList,
  getUnitList,
  getUnitByCode,
  getSpecialStat,
  getSpecialMap,
  getSpecialData,
  getSpecialList,
  addSpecialUsr,
  updateSpecialUsr,
  delSpecialUsr
}
