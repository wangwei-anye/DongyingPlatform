import populationAPI from '../../API/population'
import { apiAddr } from '../../config'
const state = {
	distribution: [],
	populationData: {
		populationCount: 0,
		sex: {
			womanRate: 0,
			manRate: 0,
			'女': 0,
			'男': 0
		},
		populationType: {
			flow: 0,
			residence: 0
		}
	},
	list: [],
	name: "",
	minAge: "",
	maxAge: "",
	sex: "",
	id_code: "",
	telephone: "",
	population_type: "",
	totalNum: 0,
	pageIndex: 1,
	pageSize: 8,
	mapCodeStr: ""
}

const getters = {
	address: (state, getters, rootState) => {
		return rootState.searchBar.cityName + rootState.searchBar.townName + rootState.searchBar.policeName + rootState.searchBar.unitName;
	},
	exportDataPath: (state, getters, rootState) => {
		var isHide = true;
		var permissions = rootState.global.accountInfo.func_permissions;
		var tempArr = permissions.split(',');
		for(var i = 0; i < tempArr.length; i++) {
			if(tempArr[i] == '3:8') {
				isHide = false;
			}
		}
		var str = apiAddr + '/down/downUserExcel.do?' + 'city_code=' + rootState.searchBar.cityCode + '&' +
			'town_code=' + rootState.searchBar.townCode + '&' +
			'police_code=' + rootState.searchBar.policeCode + '&' +
			'unit_id=' + rootState.searchBar.unitId + '&' +
			'name=' + state.name + '&' +
			'minAge=' + state.minAge + '&' +
			'maxAge=' + state.maxAge + '&' +
			'sex=' + state.sex + '&' +
			'id_code=' + state.id_code + '&' +
			'telephone=' + state.telephone + '&' +
			'population_type=' + state.population_type + '&' +
			'roomCode=' + '' + '&' +
			'isHide=' + isHide + '&' +
			'userGroup=' + '' + '&' +
			'isCheck=' + 0;
		return str;
	},
	populationRateData: (state, getters) => {
		if(state.populationData.sex && state.populationData.sex != null && state.populationData.sex != 'null') {
			state.populationData.sex.womanNum = state.populationData.sex['女'];
			state.populationData.sex.manNum = state.populationData.sex['男'];
			if(state.populationData.populationCount == 0) {
				state.populationData.sex.womanRate = 0;
				state.populationData.sex.manRate = 0;
			} else {
				let totalPersonNum = parseInt(state.populationData.sex['女']) + parseInt(state.populationData.sex['男']);
				if(totalPersonNum == 0) {
					state.populationData.sex.womanRate = 0;
					state.populationData.sex.manRate = 0;
				} else {
					state.populationData.sex.womanRate = parseFloat((state.populationData.sex['女'] / totalPersonNum * 100).toFixed(1));
					state.populationData.sex.manRate = parseFloat((state.populationData.sex['男'] / totalPersonNum * 100).toFixed(1));
				}
			}
		} else {
			state.populationData.sex = {
				womanRate: 0,
				manRate: 0,
				womanNum: 0,
				manNum: 0
			};
		}
		if(state.populationData.populationType) {
			if(state.populationData.populationCount == 0) {
				state.populationData.populationType.flowRate = 0;
				state.populationData.populationType.residenceRate = 0;
			} else {
				state.populationData.populationType.flowRate = parseFloat(parseFloat(state.populationData.populationType.flow / state.populationData.populationCount * 100).toFixed(1));
				state.populationData.populationType.residenceRate = parseFloat(parseFloat(state.populationData.populationType.residence / state.populationData.populationCount * 100).toFixed(1));
			}
		}
		return state.populationData;
	}
}

const mutations = {
	updateMapCodeStr(state, code) {
		state.mapCodeStr = code;
	},
	updateDistribution(state, obj) {
		state.distribution = obj;
	},
	updateData(state, obj) {
		state.populationData = obj;
	},
	updateList(state, obj) {
		state.list = obj;
	},
	updatePageIndex(state, obj) {
		state.pageIndex = obj;
	},
	updateTotalNum(state, obj) {
		state.totalNum = obj;
	},
	updateName(state, obj) {
		state.name = obj;
	},
	updateMinAge(state, obj) {
		state.minAge = obj;
	},
	updateMaxAge(state, obj) {
		state.maxAge = obj;
	},
	updateSex(state, obj) {
		state.sex = obj;
	},
	updateIdCode(state, obj) {
		state.id_code = obj;
	},
	updateTelephone(state, obj) {
		state.telephone = obj;
	},
	updatePopulationType(state, obj) {
		state.population_type = obj;
	}
}

const actions = {
	init({
		state,
		commit,
		dispatch,
		rootState
	}) {
		commit('updateMapCodeStr', 'city_code=' + rootState.searchBar.cityCode + "&town_code=" + rootState.searchBar.townCode + "&township_code=" + rootState.searchBar.townshipCode + "&police_code=" + rootState.searchBar.policeCode);
		dispatch("getDistribution");
//		dispatch("getList");
        commit('updateTotalNum', 0);
		commit('updateList', []);
		dispatch("getData");
	},
	initMap({
		state,
		commit,
		dispatch,
		rootState
	}) {
		commit('updateMapCodeStr', 'city_code=' + rootState.searchBar.cityCode + "&town_code=" + rootState.searchBar.townCode + "&township_code=" + rootState.searchBar.townshipCode + "&police_code=" + rootState.searchBar.policeCode);
	},
	updateUserId({
		state,
		commit,
		dispatch
	}, obj) {
		dispatch('userInfo/updateUserId', {
			userId: obj.userId
		}, {
			root: true
		});

		dispatch('userInfo/updateUserName', {
			userName: obj.userName
		}, {
			root: true
		});

		dispatch('userInfo/updateHouseUserId', {
			houseUserId: obj.houseUserId
		}, {
			root: true
		});
	},
	getList({
		state,
		commit,
		rootState
	}) {
		var isHide = true;
		var permissions = rootState.global.accountInfo.func_permissions;
		var tempArr = permissions.split(',');
		for(var i = 0; i < tempArr.length; i++) {
			if(tempArr[i] == '3:8') {
				isHide = false;
			}
		}
		populationAPI.getList({
				city_code: rootState.searchBar.cityCode,
				town_code: rootState.searchBar.townCode,
				township_code: rootState.searchBar.townshipCode,
				police_code: rootState.searchBar.policeCode,
				unit_id: rootState.searchBar.unitId,
				name: state.name,
				minAge: state.minAge,
				maxAge: state.maxAge,
				sex: state.sex,
				id_code: state.id_code,
				telephone: state.telephone,
				population_type: state.population_type,
				roomCode: '',
				isHide: isHide,
				pageNo: state.pageIndex,
				pageSize: state.pageSize
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					for(var i = 0; i < response.data.items.length; i++) {
						response.data.items[i].more = '...';
						response.data.items[i].address = response.data.items[i].unit_name + "<br/>" + response.data.items[i].building_name + response.data.items[i].room_name;
						if(response.data.items[i].population_type == 0) {
							response.data.items[i].population_type = '常住人口';
						} else {
							response.data.items[i].population_type = '流动人口';
						}
					}
					commit('updateTotalNum', response.data.totalCount);
					commit('updateList', response.data.items);
				} else {}
			},
			error => {
				console.log(error)
			}
		);
	},
	getDistribution({
		state,
		commit,
		rootState
	}) {
		populationAPI.getDistribution({
				city_code: rootState.searchBar.cityCode,
				town_code: rootState.searchBar.townCode,
				township_code: rootState.searchBar.townshipCode,
				police_code: rootState.searchBar.policeCode,
				unit_id: rootState.searchBar.unitId
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateDistribution', response.data);
				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getData({
		state,
		commit,
		rootState
	}) {
		populationAPI.getData({
				city_code: rootState.searchBar.cityCode,
				town_code: rootState.searchBar.townCode,
				police_code: rootState.searchBar.policeCode,
				unit_id: rootState.searchBar.unitId
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateData', response.data);
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