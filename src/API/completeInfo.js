import axios from '../utils/http.js'

function completeAccount(data, cb, errorCb) {
  axios.post('/account/updateCompleteAccount.do?', data).then(cb).catch(errorCb);
}

export default {
  completeAccount
}
