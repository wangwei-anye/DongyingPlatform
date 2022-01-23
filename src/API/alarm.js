import axios from '../utils/http.js'
import { alarmAddr } from '../config'

function getAlarmAnalysis(data, cb, errorCb) {
	axios.post(alarmAddr + '/alarm_count_analysis_compare', data).then(cb).catch(errorCb);
}

export default {
	getAlarmAnalysis
}