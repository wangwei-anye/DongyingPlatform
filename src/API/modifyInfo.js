import axios from '../utils/http.js'

function modifyUsername(data, cb, errorCb) {
  axios.post('/account/updateUserName.do', data).then(cb).catch(errorCb);
}

function modifyPassword(data, cb, errorCb) {
  axios.post('/account/updatePassword.do', data).then(cb).catch(errorCb);
}

export default {
  modifyUsername,
  modifyPassword
}
