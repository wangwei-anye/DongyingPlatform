import axios from '../utils/http.js'

function getUserDetail(query, cb, errorCb) {
  axios.get('/search/user/searchUserDetail.do?' + query).then(cb).catch(errorCb);
}

function getUserHouse(query, cb, errorCb) {
  axios.get('/search/user/searchUserHouse.do?' + query).then(cb).catch(errorCb);
}

function getUserCar(query, cb, errorCb) {
  axios.get('/search/user/searchUserCar.do?' + query).then(cb).catch(errorCb);
}

function getUserPhone(query, cb, errorCb) {
  axios.get('/search/user/searchUserPhone.do?' + query).then(cb).catch(errorCb);
}

function getUserRecord(query, cb, errorCb) {
  axios.get('/search/user/searchUserRecord.do?' + query).then(cb).catch(errorCb);
}

export default {
  getUserDetail,
  getUserHouse,
  getUserCar,
  getUserPhone,
  getUserRecord
}
