import axios from '../utils/http.js'

function getSearchPersonList(data, cb, errorCb) {
    axios.post('searchManager/getPersonSearchResults.do', data).then(cb).catch(errorCb);
}

function getSearchCarList(data, cb, errorCb) {
    axios.post('searchManager/getCarSearchResults.do', data).then(cb).catch(errorCb);
}

function getSearchPlaceList(data, cb, errorCb) {
    axios.post('searchManager/getPlaceSearchResults.do', data).then(cb).catch(errorCb);
}

function getSearchAllList(data, cb, errorCb) {
    axios.post('searchManager/getAllSearchResults.do', data).then(cb).catch(errorCb);
}

export default {
    getSearchPersonList,
    getSearchCarList,
    getSearchPlaceList,
    getSearchAllList
}
