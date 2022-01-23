import axios from '../utils/http.js'


//房屋状态
function getHouseState(data, cb, errorCb) {
  axios.post('house/queryRoomQuantity.do', data).then(cb).catch(errorCb);
}

//小区分布
function getEstateMap(data, cb, errorCb) {
  axios.post('house/queryByParam.do', data).then(cb).catch(errorCb);
}

//房屋状态 By Date
function getHouseDateState(data, cb, errorCb) {
  axios.post('house/queryOCCRate.do', data).then(cb).catch(errorCb);
}

//房屋商用数据
function getHouseBusiness(data, cb, errorCb) {
  axios.post('house/querySyRoomQuantity.do', data).then(cb).catch(errorCb);
}

//市县镇村查询小区
function getUnitByCode(data, cb, errorCb) {
  axios.post('option/selectUnits.do', data).then(cb).catch(errorCb);
}

//查询楼栋
function getBuilding(data, cb, errorCb) {
  axios.post('option/selectBuildingsByUnitId.do', data).then(cb).catch(errorCb);
}

function getRoomList(data, cb, errorCb) {
  axios.post('house/roomList.do', data).then(cb).catch(errorCb);
}

function getRoomDetail(data, cb, errorCb) {
  axios.post('house/roomDetail.do', data).then(cb).catch(errorCb);
}

function getRoomMember(data, cb, errorCb) {
  axios.post('house/roomMember.do', data).then(cb).catch(errorCb);
}



export default {
  getHouseState,
  getEstateMap,
  getHouseDateState,
  getRoomList,
  getBuilding,
  getRoomDetail,
  getRoomMember,
  getHouseBusiness,
  getUnitByCode
}
