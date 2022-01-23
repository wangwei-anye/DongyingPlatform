import recordAPI from '../../API/record'
import { millisec_to_time, formatTime } from '@/utils/util.js'
import { imgServerAddr, alarmAddr } from '../../config'
import $ from 'jquery'

const state = {
	userId: '',
	IDcard: '',
	startTime: '',
	endTime: '',
	unitId: '',
	doorId: '',
	openDoor: '',
	doorRecordList: [],
	carRecordList: [],
	parkNo: '', //车场
	alarmTotalNum: 0,
	carTotalNum: 0,
	doorTotalNum: 0,
	alarmCurrentPage: 1,
	carCurrentPage: 1,
	doorCurrentPage: 1,
	pageSize: 7,
	unitList: [],
	doorList: [],
	carList: [],
	alarmList: [],
	openDoorType: [{
			code: "",
			name: '开门方式'
		},
		{
			code: "1",
			name: '一键开门'
		},
		{
			code: "2",
			name: '自动开门'
		},
		{
			code: "3",
			name: '亮屏开门'
		},
		{
			code: "4",
			name: '摇一摇'
		},
		{
			code: "5",
			name: '人脸识别'
		},
		{
			code: "9",
			name: '按键开门'
		},
		{
			code: "10",
			name: '手机蓝牙开门'
		},
		{
			code: "11",
			name: '手机NFC开门'
		},
		{
			code: "12",
			name: '手机WIFI开门'
		},
		{
			code: "13",
			name: 'IC/NFC卡开门'
		},
		{
			code: "15",
			name: '身份证开门'
		},
		{
			code: "21",
			name: '密码开门'
		},
		{
			code: "22",
			name: '呼叫远程开门'
		}
	]
}

const getters = {}

const mutations = {
	updateAlarmList(state, code) {
		state.alarmList = code;
	},
	updateCarList(state, code) {
		state.carList = code;
	},
	updateDoorList(state, code) {
		state.doorList = code;
	},
	updateCarRecordList(state, code) {
		state.carRecordList = code;
	},
	updateParkNo(state, code) {
		state.parkNo = code;
	},
	updateStartTime(state, code) {
		state.startTime = code;
	},
	updateEndTime(state, code) {
		state.endTime = code;
	},
	updateUnitId(state, code) {
		state.unitId = code;
	},
	updateOpenDoor(state, code) {
		state.openDoor = code;
	},
	updateUnitList(state, code) {
		state.unitList = code;
	},
	updateUserId(state, code) {
		state.userId = code;
	},
	updateDoorRecordList(state, code) {
		state.doorRecordList = code;
	},
	updateDoorTotalNum(state, code) {
		state.doorTotalNum = code;
	},
	updateCarTotalNum(state, code) {
		state.carTotalNum = code;
	},
	updateAlarmTotalNum(state, code) {
		state.alarmTotalNum = code;
	},
	updateCarCurrentPage(state, code) {
		state.carCurrentPage = code;
	},
	updateDoorCurrentPage(state, code) {
		state.doorCurrentPage = code;
	},
	updateAlarmCurrentPage(state, code) {
		state.alarmCurrentPage = code;
	},
	updatePageSize(state, code) {
		state.pageSize = code;
	},
	updateIDcard(state, code) {
		state.IDcard = code;
	},
}

const actions = {
	doorRecord({
		state,
		commit,
		rootState
	}) {
		recordAPI.doorRecord({
				user_id: state.userId,
				start_time: state.startTime,
				end_time: state.endTime,
				unit_id: state.unitId,
				open_door: state.openDoor,
				pageNo: state.doorCurrentPage,
				pageSize: state.pageSize
			},
			response => {
				response = response.data;
				if(response.items) {
					for(var i = 0; i < response.items.length; i++) {
						response.items[i].date = millisec_to_time(response.items[i].start_time).formatTime.split(" ")[0];
						response.items[i].time = millisec_to_time(response.items[i].start_time).formatTime.split(" ")[1];
						if(response.items[i].picurl && response.items[i].picurl.length > 32) {
							response.items[i].picurl = response.items[i].picurl.split(',')[0];
						}

						for(var j = 0; j < state.openDoorType.length; j++) {
							if(state.openDoorType[j].code == response.items[i].open_door) {
								response.items[i].open_door_name = state.openDoorType[j].name;
							}
						}
					}
					commit('updateDoorTotalNum', response.totalCount);
					commit('updateDoorRecordList', response.items);
				} else {}
			},
			error => {
				console.log(error)
			}
		);
	},
	carRecord({
		state,
		commit,
		rootState
	}) {
		recordAPI.carRecord({
				user_id: state.userId,
				start_time: state.startTime,
				end_time: state.endTime,
				unit_id: state.unitId,
				parkNo: state.parkNo,
				pageNo: state.carCurrentPage,
				pageSize: state.pageSize
			},
			response => {
				response = response.data;
				if(response.items) {
					for(var i = 0; i < response.items.length; i++) {
						response.items[i].io_type_name = response.items[i].io_type == '1' ? "出" : "入";
						var dateNow = new Date(response.items[i].io_time);
						response.items[i].date = dateNow.getFullYear() + "-" + formatTime(dateNow.getMonth() + 1) + '-' + formatTime(dateNow.getDate());
						response.items[i].time = formatTime(dateNow.getHours()) + "-" + formatTime(dateNow.getMinutes()) + '-' + formatTime(dateNow.getSeconds());
					}
					commit('updateCarTotalNum', response.totalCount);
					commit('updateCarRecordList', response.items);
				} else {}
			},
			error => {
				console.log(error)
			}
		);
	},
	queryUnitById({
		state,
		commit,
		rootState
	}) {
		if(state.userId == '') {
			return;
		}
		recordAPI.queryUnitById({
				user_id: state.userId
			},
			response => {
				response = response.data;
				if(response.code == '0000') {
					commit('updateUnitList', response.data);
				} else {}
			},
			error => {
				console.log(error)
			}
		);
	},
	queryCarByUnit({
		state,
		commit,
		rootState
	}) {
		if(state.userId == '') {
			return;
		}
		recordAPI.queryCarByUnit({
				unit_id: state.unitId
			},
			response => {
				response = response.data;
				if(response.code == '0000') {
					commit('updateCarList', response.data);
				} else {}
			},
			error => {
				console.log(error)
			}
		);
	},
	queryDoorByUnit({
		state,
		commit,
		rootState
	}) {
		if(state.userId == '') {
			return;
		}
		recordAPI.queryDoorByUnit({
				unit_id: state.unitId
			},
			response => {
				response = response.data;
				if(response.code == '0000') {
					commit('updateDoorList', response.data);
				} else {}
			},
			error => {
				console.log(error)
			}
		);
	},
	getAlarmRecord({
		state,
		commit,
		dispatch,
		rootState
	}) {
		let token = rootState.global.accountInfo.token;
		$.ajax({
			url: alarmAddr + '/fetch_alarm_history',
			type: 'post',
			data: JSON.stringify({
				"Command": "Query_people_event_list",
				"Token": token,
				"var": {
					'user_id': state.IDcard,
					'start_time': state.startTime,
					'end_time': state.endTime,
				},
				"currentPage": state.alarmCurrentPage,
				"offset": state.pageSize
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true') {
					for (var i = 0; i < jsonData.Result.length; i++) {
						jsonData.Result[i].date = jsonData.Result[i].create_time.split(" ")[0];
						jsonData.Result[i].time = jsonData.Result[i].create_time.split(" ")[1];
					}
					commit('updateAlarmTotalNum', jsonData.TotalNumber);
					commit('updateAlarmList', jsonData.Result);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}