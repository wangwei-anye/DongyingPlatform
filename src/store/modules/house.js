import houseAPI from '../../API/house'
const state = {
	buildingList: [],
	buildingName: "",
	buildingId: "",
	unitIdList: [],
	unitId: '',
	unitName: '',

	houseState: {
		zxqs: 0,
		zhs: 0,
		zlyRate: 0,
		zzRate: 0,
		fzRate: 0,
		syRate: 0,
		kzRate: 0,
		qtRate: 0
	},
	houseMap: {
		hs: {}
	},
	houseDateState: {
		mOccRate: [],
		hyOccRate: [],
		yOccRate: []
	},
	roomList: [],
	roomDetail: {},
	userInfo: {
		basename: '',
		userList: [],
		rlist: []
	},
	errorMsg: '',
	houseBusiness: {},
	mapCodeStr:""
}

const getters = {
	address: (state, getters, rootState) => {
		return rootState.searchBar.cityName + rootState.searchBar.townName + rootState.searchBar.policeName + rootState.searchBar.unitName;
	},
	roomListData: (state, getters) => {
		var arr = [];
		for(var i = 0; i < state.roomList.length; i++) {
			arr.push({
				floor: state.roomList[i].room_code.substr(-4, 2),
				code: state.roomList[i].room_code.substr(-4),
				roomCode: state.roomList[i].room_code,
				type: state.roomList[i].use_status
			});
		}
		var newArr = [];
		var flag = false;
		for(var i = 0; i < arr.length; i++) {
			flag = false;
			for(var p = 0; p < newArr.length; p++) {
				if(newArr[p].floor == arr[i].floor) {
					newArr[p].arr.push(arr[i]);
					flag = true;
					break;
				}
			}
			if(!flag) {
				newArr.push({
					arr: [arr[i]],
					floor: arr[i].floor
				});
			}
		}
		for(var i = 0; i < newArr.length; i++) {
			newArr[i].arr.sort(function(a, b) {
				return a.code - b.code;
			});
		}
		newArr.sort(function(a, b) {
			return a.floor - b.floor;
		});
		return newArr;
	},
	roomTypeNum: (state, getters) => {
		var typeNumObj = {
			'自住':0,
			'出租':0,
			'商用':0,
			'其他':0,
			'空置':0
		};
		for(var i = 0; i < state.roomList.length; i++) {
			typeNumObj[state.roomList[i].use_status] ++;
		}
		return typeNumObj;
	}
}

const mutations = {
	updateMapCodeStr(state, code) {
		state.mapCodeStr = code;
	},
	updateHouseBusiness(state, code) {
		state.houseBusiness = code;
	},
	updateErrorMsg(state, code) {
		state.errorMsg = code;
	},
	updateUserInfo(state, code) {
		state.userInfo = code;
	},
	updateUnitId(state, code) {
		state.unitId = code;
	},
	updateUnitName(state, code) {
		state.unitName = code;
	},
	updateBuildingId(state, code) {
		state.buildingId = code;
	},
	updateBuildingName(state, code) {
		state.buildingName = code;
	},
	updateUnitIdList(state, list) {
		state.unitIdList = list;
	},
	updateRoomDetail(state, obj) {
		if(obj != null && obj != 'null') {
			state.roomDetail = obj;
		}
	},
	updateBuildingList(state, obj) {
		if(obj != null && obj != 'null') {
			state.buildingList = obj;
		}
	},
	updateHouseDateState(state, obj) {
		if(obj != null && obj != 'null') {
			state.houseDateState = obj;
		}
	},
	updateHouseMap(state, obj) {
		state.houseMap = obj;
	},
	updateHouseState(state, obj) {
		if(obj != null && obj != 'null') {
			state.houseState = obj;
		}
	},
	updateRoomList(state, obj) {
		if(obj != null && obj != 'null') {
			state.roomList = obj;
		}
	}
}

const actions = {
	init({
		state,
		commit,
		dispatch,
		rootState
	}) {
		commit('updateMapCodeStr', 'city_code=' + rootState.searchBar.cityCode + "&town_code=" + rootState.searchBar.townCode + "&police_code=" + rootState.searchBar.policeCode);
		dispatch('getEstateMap');
		dispatch('getHouseDateState');
		dispatch('getHouseState');
		dispatch('getHosueUnitList');
		dispatch('getHouseBusiness');
	},
	initMap({
		state,
		commit,
		dispatch,
		rootState
	}) {
		commit('updateMapCodeStr', 'city_code=' + rootState.searchBar.cityCode + "&town_code=" + rootState.searchBar.townCode  + "&police_code=" + rootState.searchBar.policeCode);
	},
	updateUserId({
		state,
		commit,
		dispatch
	}, userId) {
		dispatch('userInfo/updateUserId', {
			userId: userId
		}, {
			root: true
		});
	},
	getHosueUnitList({
		state,
		commit,
		rootState,
		dispatch
	}) {
		var param = {};
		if(rootState.searchBar.unitId != '') {
			var arr = [{name: rootState.searchBar.unitName, unit_id: rootState.searchBar.unitId}];
			commit('updateUnitIdList', arr);
			commit("updateUnitId",rootState.searchBar.unitId);
			commit("updateUnitName",rootState.searchBar.unitName);
			dispatch("getBuilding");
			return;
		}
		if(rootState.searchBar.policeCode != '') {
			param = {
				flag:'police',
				code:rootState.searchBar.policeCode
			};
			dispatch('getUnitByCode',param);
			return;
		}
		if(rootState.searchBar.townCode != '') {
			param = {
				flag:'town',
				code:rootState.searchBar.townCode
			};
			dispatch('getUnitByCode',param);
			return;
		}
		if(rootState.searchBar.cityCode != '') {
			param = {
				flag:'city',
				code:rootState.searchBar.cityCode
			};
			dispatch('getUnitByCode',param);
			return;
		}
	},
	getUnitByCode({
		state,
		commit,
		rootState
	},param) {
		houseAPI.getUnitByCode(param,
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateUnitIdList', response.data);
				} else {}
			},
			error => {
				console.log(error)
			}
		);
	},
	getBuilding({
		state,
		commit,
		rootState
	}) {
		houseAPI.getBuilding({
				unit_id: state.unitId
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateBuildingList', response.data);
				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getRoomList({
		state,
		commit,
		rootState
	}) {
		houseAPI.getRoomList({
			    city_code: rootState.searchBar.cityCode,
				unit_id: state.unitId,
				buildingCode: state.buildingId
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateRoomList', response.data);
				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getRoomDetail({
		state,
		commit,
		rootState
	}, roomCode) {
		houseAPI.getRoomDetail({
			    city_code: rootState.searchBar.cityCode,  
				unit_id: state.unitId,
				buildingCode: state.buildingId,
				roomCode: roomCode
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					response.data.roomCode = roomCode;
					commit('updateRoomDetail', response.data);
				} else {
					commit('updateRoomDetail', {
						roomCode: roomCode
					});
				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getRoomMember({
		state,
		commit,
		rootState
	}, roomCode) {
		commit('updateErrorMsg', '');
		houseAPI.getRoomMember({
			    city_code: rootState.searchBar.cityCode,  
				unit_id: state.unitId,
				buildingCode: state.buildingId,
				roomCode: roomCode
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateUserInfo', response.data);
					if(response.data == null) {
						commit('updateErrorMsg', '该用户没有数据');
					}
				} else {
					commit('updateErrorMsg', '请求错误');
				}
			},
			error => {
				commit('updateErrorMsg', '请求错误');
			}
		);
	},
	getEstateMap({
		state,
		commit,
		rootState
	}) {
		houseAPI.getEstateMap({
				city_code: rootState.searchBar.cityCode,
				town_code: rootState.searchBar.townCode,
				police_code: rootState.searchBar.policeCode,
				unit_id: rootState.searchBar.unitId
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					if(response.data != null){
						commit('updateHouseMap', response.data);
					}
				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getHouseDateState({
		state,
		commit,
		rootState
	}) {
		houseAPI.getHouseDateState({
				city_code: rootState.searchBar.cityCode,
				town_code: rootState.searchBar.townCode,
				police_code: rootState.searchBar.policeCode,
				unit_id: rootState.searchBar.unitId
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateHouseDateState', response.data);
				} else {

				}
			},
			error => {
				console.log(error)
			}
		);
	},
	getHouseBusiness({
		state,
		commit,
		rootState
	}, roomCode) {
		houseAPI.getHouseBusiness({
				city_code: rootState.searchBar.cityCode,
				town_code: rootState.searchBar.townCode,
				police_code: rootState.searchBar.policeCode,
				unit_id: rootState.searchBar.unitId
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					if(response.data && response.data.sy){
						commit('updateHouseBusiness', response.data);
					}
				} else {}
			},
			error => {
				console.log(error)
			}
		);
	},
	getHouseState({
		state,
		commit,
		rootState
	}) {
		houseAPI.getHouseState({
				city_code: rootState.searchBar.cityCode,
				town_code: rootState.searchBar.townCode,
				police_code: rootState.searchBar.policeCode,
				unit_id: rootState.searchBar.unitId
			},
			response => {
				response = response.data;
				if(response.code === '0000') {
					commit('updateHouseState', response.data);
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