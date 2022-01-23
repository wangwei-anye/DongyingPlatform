import axios from '../utils/http.js'

function getPublicKey(type, cb, errorCb) {
  axios.get('account/fetchRSAPublicKey.do?publickey_type=' + type).then(cb).catch(errorCb);
}

function login(data, cb, errorCb) {
  axios.post('account/login.do', data).then(cb).catch(errorCb);
}

function getAccountInfo(cb, errorCb) {
  axios.get('/account/getAccountByToken.do').then(cb).catch(errorCb);
}

function logout(cb, errorCb) {
  axios.get('/account/quit.do').then(cb).catch(errorCb);
}

export default {
  getPublicKey,
  login,
  getAccountInfo,
  logout
}
