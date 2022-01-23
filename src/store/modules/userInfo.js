import userInfo from '@/API/userInfo'
import * as types from '../mutation_types'
import * as utils from '@/utils/util'
import {province_code, city_code, city_name} from '@/config.js'

const state = {
	userId: sessionStorage.getItem('userId'),
	userName: sessionStorage.getItem('userName'),
	houseUserId: sessionStorage.getItem('houseUserId'),
	idCode: '',
	userDetail: {},
	userHouse: {},
	userCar: {},
	userPhone: {},
	isHide: false,
	userRecord: [],
	scale: 0
}

const getters = {
	recordDatum: state => {
		// 车辆接口数据为空, 车辆暂未覆盖
		let userRecord = state.userRecord.slice();
		userRecord.map(item => {
			item.people.map(i => {
				i.time = utils.millisec_to_time(i.start_time).formatTime.split(' ')[1];
				i.zone = i.unit_name;
				i.door = i.door_name;
			})
		})
		return userRecord;
	}
}

const mutations = {
	[types.ADD_RECORD_SCALE](state) {
		state.scale++;
	},
	[types.UPDATE_SCALE](state, id) {
	   state.scale = id;
	},
	[types.UPDATE_USER_ID](state, id) {
		sessionStorage.setItem('userId', id);
		state.userId = id;
	},
	[types.UPDATE_USER_NAME](state, id) {
		sessionStorage.setItem('userName', id);
		state.userName = id;
	},
	[types.UPDATE_HOUSE_USER_ID](state, id) {
		sessionStorage.setItem('houseUserId', id);
		state.houseUserId = id;
	},
	[types.UPDATE_IDCODE](state, code) {
		state.idCode = code;
	},
	[types.GET_USER_DETAIL](state, data) {
		state.userDetail = data;
	},
	[types.GET_USER_HOUSE](state, data) {
		state.userHouse = data;
	},
	[types.GET_USER_CAR](state, data) {
		state.userCar = data;
	},
	[types.GET_USER_PHONE](state, data) {
		state.userPhone = data;
	},
	[types.MUTATE_PHONE_SHOW](state, index) {
		state.userPhone[index]['show'] = !state.userPhone[index]['show'];
	},
	[types.GET_USER_RECORD](state, data) {
		if(data[0] == 'clear'){  
			state.userRecord = [];
		}else{
			state.userRecord = state.userRecord.concat(data.reverse());
		}
	}
}

const actions = {
	updateUserId({
		state,
		getters,
		commit
	}, param) {
		commit(types.UPDATE_USER_ID, param.userId);
	},
	updateScale({
		state,
		getters,
		commit
	}, param) {
		commit(types.GET_USER_RECORD, ['clear']);
		commit(types.UPDATE_SCALE, 0);
	},
	updateUserName({
		state,
		getters,
		commit
	}, param) {
		commit(types.UPDATE_USER_NAME, param.userName);
	},
	updateHouseUserId({
		state,
		getters,
		commit
	}, param) {
		commit(types.UPDATE_HOUSE_USER_ID, param.houseUserId);
	},
	getUserDetail({
		state,
		getters,
		commit
	}) {

		userInfo.getUserDetail(
			'user_id=' + state.userId + '&houseUserId=' + state.houseUserId + '&user_name=' + state.userName + '&isHide=' + state.isHide,
			response => {
				commit(types.GET_USER_DETAIL, response.data.data);
			},
			error => {
				console.log(error)
			}
		)
	},
	getUserHouse({
		getters,
		commit
	}) {
		userInfo.getUserHouse(
			'province_code='+province_code+'&user_id=' + state.userId + '&houseUserId=' + state.houseUserId, // 默认查询用户在铜仁市下所有的房屋
			response => {
				if(response.data.data) {
					let houseInfo = response.data.data.houseInfo;

					//新增图片轮播效果
					let groupSize = 5; //一组最多展现图片的数量
					for(let i = 0, len1 = houseInfo.length; i < len1; i++) {
						let result = [];
						for(let j = 0, len2 = houseInfo[i].housePeople.length; j < len2; j += groupSize) {
							result.push(houseInfo[i].housePeople.slice(j, j + groupSize));
						}
						houseInfo[i].housePeople = result;
					}
					commit(types.GET_USER_HOUSE, houseInfo);
				}

			},
			error => {
				console.log(error)
			}
		)
	},
	getUserCar({
		getters,
		commit
	}) {
		userInfo.getUserCar(
			'user_id=' + state.userId + '&houseUserId=' + state.houseUserId,
			response => {
				let carInfo = response.data.data.carInfo;
				commit(types.GET_USER_CAR, carInfo);
			},
			error => {
				console.log(error)
			}
		)
	},
	getUserPhone({
		getters,
		commit
	}) {
		userInfo.getUserPhone(
			'user_id=' + state.userId + '&houseUserId=' + state.houseUserId,
			response => {
				let phoneInfo = response.data.data.phoneInfo;
				phoneInfo.map(item => item.show = false);
				commit(types.GET_USER_PHONE, phoneInfo);
			},
			error => {
				console.log(error)
			}
		)
	},
	getSingleUserRecord({
		commit
	}, startToEnd) {
		let start_time = startToEnd.start_time,
			end_time = startToEnd.end_time;

		let query = 'user_id=' + state.userId + '&start_time=' + encodeURI(start_time) + '&end_time=' + encodeURI(end_time);
		userInfo.getUserRecord(
			query,
			response => {
				commit(types.GET_USER_RECORD, response.data);
				commit(types.ADD_RECORD_SCALE);
			},
			error => console.log(error)
		)
	},
	getRecordByInterval({
		commit,
		state,
		dispatch
	}) {
		let scale = state.scale;

		let base_now = Date.now(),
			millisecsPerDay = 24 * 60 * 60 * 1000,
			interval = 9 * millisecsPerDay, // 开始时间和结束时间间隔 9 天
			base_target = base_now - interval;

		let now = base_now - scale * (interval + millisecsPerDay),
			target = base_target - scale * (interval + millisecsPerDay);

		let end_time = utils.millisec_to_time(now).formatTime.split(' ')[0] + ' 00:00:00',
			start_time = utils.millisec_to_time(target).formatTime.split(' ')[0] + ' 23:59:59';

		dispatch('getSingleUserRecord', {
			end_time,
			start_time
		});
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}