import searchBar from '../../API/searchBar'
import {province_code, city_code, city_name} from '@/config.js'

const state = {
	cityCode: '',
	cityName: '',
	townCode: '',
	policeCode: '',
	unitId: '',
	townName: '',
	townshipName: '',
	policeName: '',
	unitName: '',
	townList: [],
	policeCodeList: [],
	unitIdList: [],
	defaultTownCode: '',
	defaultPoliceCode: '',
	defaultUnitId: '',
	routerName: '',
	firstFlag: false,
	sysName: ''
}

const getters = {}

const mutations = {
	updateSysName(state, list) {
		state.sysName = list;
	},
	updateFirstFlag(state, list) {
		state.firstFlag = list;
	},
	updateRouterName(state, list) {
		state.routerName = list;
	},
	updateDefaultTownCode(state, list) {
		state.defaultTownCode = list;
	},
	updateDefaultPoliceCode(state, list) {
		state.defaultPoliceCode = list;
	},
	updateDefaultUnitId(state, list) {
		state.defaultUnitId = list;
	},
	updateTownList(state, list) {
		state.townList = list;
	},
	updatePoliceCodeList(state, list) {
		state.policeCodeList = list;
	},
	updateUnitIdList(state, list) {
		state.unitIdList = list;
	},
	updateCityCode(state, code) {
		state.cityCode = code;
	},
	updateCityName(state, code) {
		state.cityName = code;
	},
	updateTownCode(state, code) {
		state.townCode = code;
	},
	updatePoliceCode(state, code) {
		state.policeCode = code;
	},
	updateUnitId(state, code) {
		state.unitId = code;
	},
	updateTownName(state, code) {
		state.townName = code;
	},
	updateTownshipName(state, code) {
		state.townshipName = code;
	},
	updatePoliceName(state, code) {
		state.policeName = code;
	},
	updateUnitName(state, code) {
		state.unitName = code;
	}
}

const actions = {
	setDefaultFromPlatform({ //从首页 获取 搜索值
		state,
		commit,
		rootState
	}) {
		commit('updateTownList', []);
		commit('updatePoliceCodeList', []);
		commit('updateUnitIdList', []);
		commit('updateTownCode', '');
		commit('updatePoliceCode', '');
		commit('updateUnitId', '');
		commit('updateDefaultTownCode', rootState.platform.currentTownCode == 'all' ? "" : rootState.platform.currentTownCode);
		commit('updateDefaultPoliceCode', rootState.platform.currentPoliceCode == 'all' ? "" : rootState.platform.currentPoliceCode);
		commit('updateDefaultUnitId', rootState.platform.currentUnitId == 'all' ? "" : rootState.platform.currentUnitId);
	},
	search({
		state,
		commit,
		dispatch
	}) {
		if(state.routerName == 'security') {
			dispatch(state.routerName + '/init', {
				router: 'security'
			}, {
				root: true
			}) // 调用其他模块的 actions
		} else if(state.routerName == 'house' || state.routerName == 'population') {
			dispatch(state.routerName + '/init', {}, {
				root: true
			}) // 调用其他模块的 actions
		} else if(state.routerName == 'alarmAnalyse' || state.routerName == 'alarmDetail' || state.routerName == 'alarm') {
			dispatch('alarm/init', {}, {
				root: true
			}) // 调用其他模块的 actions
		}
	},
	initSearchList({
		state,
		commit,
		dispatch,
		rootState
	}, routerName) {
		commit('updateFirstFlag', true);
		commit('updateRouterName', routerName);

		if(state.cityCode == "") {
			commit('updateCityCode', rootState.global.accountInfo.rolePermission.city_code ? rootState.global.accountInfo.rolePermission.city_code : "");
			commit('updateCityName', rootState.global.accountInfo.rolePermission.city_name ? rootState.global.accountInfo.rolePermission.city_name : "");
		}
		if(state.cityCode == "") {
			commit('updateCityCode', city_code);
			commit('updateCityName', city_name);
		}

		if(state.townList.length == 0) {
			dispatch('getTownList');
		} else {
			dispatch('search');
		}
	},
	clear({
		state,
		commit
	}, type) {
		if(type == 'townCode') {
			commit('updateTownCode', '');
			commit('updateTownName', '');
			commit('updateTownList', []);
			commit('updatePoliceCode', '');
			commit('updatePoliceName', '');
			commit('updatePoliceCodeList', []);
			commit('updateUnitId', '');
			commit('updateUnitName', '');
			commit('updateUnitIdList', []);
		}else if(type == 'policeCode') {
			commit('updatePoliceCode', '');
			commit('updatePoliceName', '');
			commit('updatePoliceCodeList', []);
			commit('updateUnitId', '');
			commit('updateUnitName', '');
			commit('updateUnitIdList', []);
		} else if(type == 'unitId') {
			commit('updateUnitId', '');
			commit('updateUnitName', '');
			commit('updateUnitIdList', []);
		}
	},
	getTownList({
		state,
		commit,
		dispatch
	}) {
		searchBar.getTownList({
				city_code: state.cityCode
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					for(var i = response.data.length - 1; i >= 0; i--) {
						if(response.data[i].town_code == '') {
							response.data.splice(i, 1);
						}
					}
					if(response.data.length > 1) {
						response.data.unshift({
							town_code: 'all',
							town_name: '区县'
						});
					}
					commit('updateTownList', response.data);

					if(response.data.length == 1) {
						commit('updateTownCode', response.data[0].town_code);
						commit('updateTownName', response.data[0].town_name);
					} else {
						if(state.firstFlag) {
							if(state.defaultTownCode != "") {
								commit('updateTownCode', state.defaultTownCode);
							} else {
								commit('updateFirstFlag', false);
								dispatch("search");
							}
						}
					}

				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getPoliceList({
		state,
		commit,
		dispatch
	}) {
		searchBar.getPoliceList({
				town_code: state.townCode
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					for(var i = response.data.length - 1; i >= 0; i--) {
						if(response.data[i].id == '') {
							response.data.splice(i, 1);
						}
						response.data[i].police_code = response.data[i].id;
						response.data[i].police_name = response.data[i].police_station;
					}
					if(response.data.length > 1) {
						response.data.unshift({
							police_code: 'all',
							police_name: '派出所'
						});
					}
					commit('updatePoliceCodeList', response.data);

					if(response.data.length == 1) {
						commit('updatePoliceCode', response.data[0].police_code);
						commit('updatePoliceName', response.data[0].police_name);
					} else {
						if(state.firstFlag) {
							if(state.defaultPoliceCode != "") {
								commit('updatePoliceCode', state.defaultPoliceCode);
							} else {
								commit('updateFirstFlag', false);
								dispatch("search");
							}
						}
					}
				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getUnitList({
		state,
		commit,
		dispatch
	}) {
		searchBar.getUnitList({
				police_code: state.policeCode
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					for(var i = response.data.length - 1; i >= 0; i--) {
						if(response.data[i].unit_id == '') {
							response.data.splice(i, 1);
						}
						response.data[i].unit_name = response.data[i].name;
					}
					if(response.data.length > 1) {
						response.data.unshift({
							unit_id: 'all',
							unit_name: '小区'
						});
					}
					commit('updateUnitIdList', response.data);
					if(response.data.length == 1) {
						commit('updateUnitId', response.data[0].unit_id);
						commit('updateUnitName', response.data[0].unit_name);
					}
					if(state.firstFlag) {
						commit('updateFirstFlag', false);
						if(state.defaultUnitId != "") {
							commit('updateUnitId', state.defaultUnitId);
							for(var p = 0; p < state.unitIdList.length; p++) {
								if(state.unitIdList[p].unit_id == state.defaultUnitId) {
									commit("updateUnitName",state.unitIdList[p].unit_name);
								}
							}
						}
						dispatch("search");
					}
				} else {

				}
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