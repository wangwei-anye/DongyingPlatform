import securityAPI from '../../API/security'
import {province_code, city_code, city_name} from '@/config.js'

const state = {
	tabIndex: 0,
	securityData: {},
	securityWeekData: {},
	securityMonthData: {},
	percentMap: {},
	mapCodeStr: "",
	securitySet: {
		'00-02':0,
		'02-04':0,
		'04-06':0,
		'06-08':0,
		'08-10':0,
		'10-12':0,
		'12-14':0,
		'14-16':0,
		'16-18':0,
		'18-20':0,
		'20-22':0,
		'22-24':0,
	},
	totalNum: 0
}

const getters = {
	securitySetData: (state, getters, rootState) => {
		var arr = [];
		for(var e in state.securitySet) {
			if('total' == e) {
				continue;
			}
			arr.push({
				time: e,
				num: state.securitySet[e]
			});
		}
		return arr;
	},
	address: (state, getters, rootState) => {
		return rootState.searchBar.cityName + rootState.searchBar.townName + rootState.searchBar.townshipName + rootState.searchBar.villageName + rootState.searchBar.unitName;
	},
	securityCount: (state, getters) => {
		var obj = {};
		var tempObj = {};
		if(state.tabIndex == 0) {
			tempObj = state.securityData;
		} else if(state.tabIndex == 1) {
			tempObj = state.securityWeekData;
		} else if(state.tabIndex == 2) {
			tempObj = state.securityMonthData;
		}
		if(tempObj && tempObj.thirteen) {
			var tempArr = tempObj.thirteen.split(',');
			obj = {
				estateNum: tempArr[0],
				planNum: tempArr[1],
				completeNum: tempArr[2],
				completeRate: tempArr[1] == 0 ? 0 : tempArr[2] / tempArr[1],
				unDoNum: tempArr[3],
				unDoRate: tempArr[1] == 0 ? 0 : tempArr[3] / tempArr[1],
				loseNum: tempArr[4],
				loseRate: tempArr[1] == 0 ? 0 : tempArr[4] / tempArr[1],
				lateNum: tempArr[5],
				lateRate: tempArr[1] == 0 ? 0 : tempArr[5] / tempArr[1]
			}
		}
		return obj;
	},
	securityArr: (state, getters) => {
		var arr = [];
		var tempArr = [];
		var codeArr = {
			'one': '02:00',
			'two': '04:00',
			'three': '06:00',
			'four': '08:00',
			'five': '10:00',
			'six': '12:00',
			'seven': '14:00',
			'eight': '16:00',
			'nine': '18:00',
			'ten': '20:00',
			'eleven': '22:00',
			'twelve': '24:00'
		};
		for(var e in state.securityData) {
			if('thirteen' == e) {
				continue;
			}
			tempArr = state.securityData[e].split(',');
			arr.push({
				time: codeArr[e],
				totalNum: tempArr[0],
				completeNum: tempArr[1],
				unDoNum: tempArr[2],
				loseNum: tempArr[3],
				lateNum: tempArr[4],
				precent: tempArr[5].substring(0, tempArr[5].length - 1),
				type: 'ok'
			});
		}
		return arr;
	},
	securityWeekArr: (state, getters) => {
		var arr = [];
		var tempArr = [];
		for(var e in state.securityWeekData) {
			if('thirteen' == e) {
				continue;
			}
			tempArr = state.securityWeekData[e].split(',');
			arr.push({
				time: e,
				completeNum: tempArr[0],
				unDoNum: tempArr[1],
				loseNum: tempArr[2],
				lateNum: tempArr[3],
				precent: tempArr[4].substring(0, tempArr[4].length - 1),
			});
		}
		return arr;
	},
	securityMonthArr: (state, getters) => {
		var arr = [];
		var tempArr = [];
		for(var e in state.securityMonthData) {
			if('thirteen' == e) {
				continue;
			}
			tempArr = state.securityMonthData[e].split(',');
			arr.push({
				time: e,
				completeNum: tempArr[0],
				unDoNum: tempArr[1],
				loseNum: tempArr[2],
				lateNum: tempArr[3],
				precent: tempArr[4].substring(0, tempArr[4].length - 1),
			});
		}
		return arr;
	}
}

const mutations = {
	updateTotalNum(state, code) {
		state.totalNum = code;
	},
	updateSecuritySet(state, code) {
		state.securitySet = code;
	},
	updateMapCodeStr(state, code) {
		state.mapCodeStr = code;
	},
	updateTabIndex(state, obj) {
		state.tabIndex = obj;
	},
	updateSecurityData(state, obj) {
		state.securityData = obj;
	},
	updateSecurityWeekData(state, obj) {
		state.securityWeekData = obj;
	},
	updateSecurityMonthData(state, obj) {
		state.securityMonthData = obj;
	},
	updatePercentMap(state, obj) {
		state.percentMap = obj;
	}

}

const actions = {
	init({
		state,
		commit,
		dispatch,
		rootState
	}, paramObj) {
		var param = {};
		//安防巡更页面
		if(paramObj.router == 'security') {
			param = {
				city_code: rootState.searchBar.cityCode,
				town_code: rootState.searchBar.townCode,
				township_code: rootState.searchBar.townshipCode,
				village_code: rootState.searchBar.villageCode,
				unit_id: rootState.searchBar.unitId
			};
			commit('updateMapCodeStr', 'city_code=' + rootState.searchBar.cityCode + "&town_code=" + rootState.searchBar.townCode + "&township_code=" + rootState.searchBar.townshipCode + "&village_code=" + rootState.searchBar.villageCode);
			dispatch('getPercent');
		} else { //首页
			param = {
				city_code: city_code,
				town_code: rootState.platform.currentTownCode == 'all' ? '' : rootState.platform.currentTownCode,
				township_code: rootState.platform.currentTownShipCode == 'all' ? '' : rootState.platform.currentTownShipCode,
				village_code: rootState.platform.currentVillageCode == 'all' ? '' : rootState.platform.currentVillageCode,
				unit_id: rootState.platform.currentUnitId == 'all' ? '' : rootState.platform.currentUnitId,
			};
		}
		dispatch('getSecurityData', param);
		dispatch('getSecurityWeekData', param);
		dispatch('getSecurityMonthData', param);
	},
	initMap({
		state,
		commit,
		dispatch,
		rootState
	}) {
		commit('updateMapCodeStr', 'city_code=' + rootState.searchBar.cityCode + "&town_code=" + rootState.searchBar.townCode + "&township_code=" + rootState.searchBar.townshipCode + "&village_code=" + rootState.searchBar.villageCode);
	},
	getSecurityData({
		state,
		commit,
		rootState
	}, param) {
		securityAPI.getSecurityData(param,
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateSecurityData', response.data);
				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getSecurityWeekData({
		state,
		commit,
		rootState
	}, param) {
		securityAPI.getSecurityWeekData(param,
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateSecurityWeekData', response.data);
				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getSecurityMonthData({
		state,
		commit,
		rootState
	}, param) {
		securityAPI.getSecurityMonthData(param,
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateSecurityMonthData', response.data);
				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getPercent({
		state,
		commit,
		rootState
	}) {
		securityAPI.getPercent({
				city_code: rootState.searchBar.cityCode,
				town_code: rootState.searchBar.townCode,
				township_code: rootState.searchBar.townshipCode,
				village_code: rootState.searchBar.villageCode,
				unit_id: rootState.searchBar.unitId
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updatePercentMap', response.data);
				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	querySecurity({
		state,
		commit,
		rootState
	}) {
		securityAPI.querySecurity({
				city_code: rootState.searchBar.cityCode
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit("updateTotalNum", response.data['total']);
					commit("updateSecuritySet", response.data);
				} else {}
			},
			error => {
				console.log(error)
			}
		);
	},
	saveSecurity({
		state,
		commit,
		rootState
	},param) {
		securityAPI.saveSecurity({
				province_code:'',
				city_code : rootState.searchBar.cityCode,
				one: param.one,
				two: param.two,
				three: param.three,
				four: param.four,
				five: param.five,
				six: param.six,
				seven: param.seven,
				eight:param.eight,
				nine: param.nine,
				ten: param.ten,
				eleven: param.eleven,
				twelve: param.twelve,
				total: param.total,
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
				} else {}
			},
			error => {
				console.log(error)
			}
		);
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}