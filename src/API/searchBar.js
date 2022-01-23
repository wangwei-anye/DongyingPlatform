import axios from '../utils/http.js'


function getTownList(data, cb, errorCb) {
  axios.post('option/getTownByField.do', data).then(cb).catch(errorCb);
}


function getPoliceList(data, cb, errorCb) {
  axios.post('/account/rolePermissionManager/selectPoliceS.do', data).then(cb).catch(errorCb);
}

function getUnitList(data, cb, errorCb) {
  axios.post('/account/rolePermissionManager/selectUnitByPolice.do', data).then(cb).catch(errorCb);
}

//查询楼栋
function getBuilding(data, cb, errorCb) {
  axios.post('account/rolePermissionManager/selectBuildingsByUnitId.do', data).then(cb).catch(errorCb);
}

export default {
  getTownList,
  getPoliceList,
  getUnitList,
  getBuilding
}
