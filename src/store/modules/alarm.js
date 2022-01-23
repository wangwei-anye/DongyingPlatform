import { sendMsg, isConnected, listen, initWS } from '@/utils/alarmCenterWS.js'
import { formatTime } from '@/utils/util.js'
import searchBar from '../../API/searchBar'
import alarm from '../../API/alarm'
import { imgServerAddr, alarmAddr } from '../../config'
import { province_code, city_code, city_name } from '@/config.js'
import $ from 'jquery'

const state = {
	intervalNum: 0,
	currentPage: 1,
	pageSize: 5,
	detailSize: 8,
	platformSize: 9,
	alarmList: [],
	selectItem: {},
	totalNum: 0,
	eventType: '', // 查询类型
	alarmLevel: '', // 告警等级
	pendingStatus: '', // 状态
	day: 1,
	startTime: "",
	endTime: "",
	inter: 0, //定时器
	cityCode: '',
	townCode: '',
	policeCode: '',
	unitId: '',
	townList: [],
	policeCodeList: [],
	unitIdList: [],
	showPending: false,
	showRemark: false,
	messageList: [],
	messageTotalNum: 0,
	messageCurrentPage: 1,
	messagePageSize: 2,
	routerName: '',
	eventDegreeCount: {
		first_degree: 0,
		second_degree: 0,
		third_degree: 0,
		fourth_degree: 0
	},
	eventStatusCount: {
		total: 0,
		unpendingRate: 0,
		pendingRate: 0,
		unpending: 0,
		pending: 0
	},
	eventTypeCount: {
		people: 0,
		car: 0,
		flow: 0,
		stalker: 0,
		crossborder: 0
	},
	totalAlarmNum: 0,
	alarmChange: [],
	alarmMap: [],
	alarmBar: [],
	changeMapParamFlag: false, // 切换参数  触发地图请求
	eventTypeObj: {
		people: "人黑名单告警",
		car: "车黑名单告警",
		flow: "人流告警",
		stalker: "尾随告警",
		crossborder: "周界告警",
	},
	eventColorArr: ['#FEC04F', '#DFF1E3', '#1A7AB7', '#178FCE', '#2BA8E8', '#E86E2B', '#33CDE5', '#18A3B8', '#1788CE', '#2E9DE4', '#2F66E4', '#18C8E0'],
	initFirst: true
}

const getters = {
	mapCodeStr: (state, getters, rootState) => {
		let token = rootState.global.accountInfo.token;
		return 'city_code=' + rootState.searchBar.cityCode + "&town_code=" + rootState.searchBar.townCode  + "&police_code=" + rootState.searchBar.policeCode + "&token=" + token + "&days=" + state.day + "&start_time=" + state.startTime + "&end_time=" + state.endTime;
	},
	pieDataType: (state, getters, rootState) => {
		var obj = {};
		obj.data = [];
		obj.legendArr = [];
		for(var e in state.eventTypeObj) {
			if(state.eventTypeCount[e] != undefined) {
				obj.data.push({
					value: state.eventTypeCount[e],
					name: state.eventTypeObj[e],
				});
				obj.legendArr.push(state.eventTypeObj[e]);
			}
		}
		obj.colorArr = state.eventColorArr;
		obj.radius = ['38%', '52%'];
		return obj;
	},
	pieDataLevel: (state, getters, rootState) => {
		var obj = {};
		obj.data = [{
			value: state.eventDegreeCount.first_degree,
			name: "红色告警",
		}, {
			value: state.eventDegreeCount.second_degree,
			name: "橙色告警",
		}, {
			value: state.eventDegreeCount.third_degree,
			name: "黄色告警",
		}, {
			value: state.eventDegreeCount.fourth_degree,
			name: "蓝色告警",
		}];
		obj.radius = ['50%', '70%'];
		obj.colorArr = ['#FC484B', '#E86E2B', '#E8DD2B', '#2BA8E8'];
		return obj;
	},
	alarmDetailList: (state, getters, rootState) => {
		var arr = [];
		for(var i = 0; i < state.alarmList.length; i++) {
			var pending_user_name = "";
			if(state.alarmList[i].pending_user_info.Rows && state.alarmList[i].pending_user_info.Rows.length > 0 && state.alarmList[i].pending_user_info.Rows[0].username != null) {
				pending_user_name = state.alarmList[i].pending_user_info.Rows[0].username;
			}
			var pending_time = "";
			if(state.alarmList[i].pending_time != null) {
				pending_time = state.alarmList[i].pending_time;
			}
			var eventType = state.eventTypeObj[state.alarmList[i].event_type];
			var pending_name = "已处置";
			if(state.alarmList[i].pending_status == "unpending") {
				pending_name = "未处置";
			}
			var case_desc = "";
			if(state.alarmList[i].info && state.alarmList[i].info.case_desc && (state.alarmList[i].info.case_desc == undefined || state.alarmList[i].info.case_desc == '')) {
				case_desc = "";
			}
			var des = '';
			if(state.alarmList[i].info && state.alarmList[i].info.case_desc) {
				des = state.alarmList[i].info.case_desc.split('\n');
			}
			if(des.length == 2) {
				var des2 = des[0].split(' ');
				if(des2.length <= 2) {
					case_desc = des[0] + '<br>' + des[1];
				} else {
					if(des2[1].length > 20) {
						des2[1] = des2[1].substr(0, 20) + "...";
					}
					case_desc = des2[0] + ' <span style="color:#F66420;">' + des2[1] + '</span> ' + des2[2] + '<br>' + des[1];
				}
			} else if(des.length == 1) {
				var des2 = des[0].split(' ');
				if(des2.length == 3) {
					case_desc = des2[0] + ' <span style="color:#F66420;">' + des2[1] + '</span> ' + des2[2];
				} else if(des2.length == 2) {
					case_desc = des2[0] + ' <span style="color:#F66420;">' + des2[1] + '</span>';
				} else {
					case_desc = des2[0];
				}
			}

			arr.push({
				item_id: state.alarmList[i].item_id,
				event_type: eventType,
				alarm_degree: state.alarmList[i].alarm_degree,
				create_time: state.alarmList[i].create_time,
				case_desc: state.alarmList[i].info.case_desc,
				case_desc_html: case_desc,
				position: state.alarmList[i].info.position,
				event_image_id: imgServerAddr + '/' + state.alarmList[i].event_image_id + "?p=0",
				pending_status: state.alarmList[i].pending_status,
				pending_name: pending_name,
				pending_user_id: state.alarmList[i].pending_user_id,
				pending_time: pending_time,
				pending_user_name: pending_user_name,
				pending_info: pending_user_name + "</br>" + pending_time,
				more: state.alarmList[i].pending_status == "unpending" ? "" : "查看详情",
			});
		}
		if(arr.length == 0 && state.routerName == 'alarm') {
			for(var i = 0; i < 5; i++) {
				arr.push({
					item_id: '',
					event_type: '暂无告警信息',
					alarm_degree: 'first_degree',
					create_time: '',
					case_desc: '',
					case_desc_html: '',
					position: '',
					event_image_id: require('../../assets/image/alarm/noAlarm.png'),
					pending_status: '',
					pending_name: '',
					pending_time: '',
					pending_user_name: '',
				});
			}
		}

		return arr;
	}
}

const mutations = {
	updateInitFirst(state, initFirst) {
		state.initFirst = initFirst;
	},
	updateEventTypeObj(state, eventTypeObj) {
		state.eventTypeObj = eventTypeObj;
	},
	updateChangeMapParamFlag(state) {
		state.changeMapParamFlag = !state.changeMapParamFlag;
	},
	updateAlarmMap(state, alarmMap) {
		state.alarmMap = alarmMap;
	},
	updateAlarmBar(state, alarmBar) {
		state.alarmBar = alarmBar;
	},
	updateAlarmChange(state, alarmChange) {
		state.alarmChange = alarmChange;
	},
	updateTotalAlarmNum(state, totalAlarmNum) {
		state.totalAlarmNum = totalAlarmNum;
	},
	updateStartTime(state, startTime) {
		state.startTime = startTime;
	},
	updateEndTime(state, endTime) {
		state.endTime = endTime;
	},
	updateDay(state, day) {
		state.day = day;
	},
	updateEventDegreeCount(state, eventDegree) {
		state.eventDegreeCount = eventDegree;
	},
	updateEventStatusCount(state, eventStatus) {
		state.eventStatusCount = eventStatus;
	},
	updateEventTypeCount(state, eventType) {
		state.eventTypeCount = eventType;
	},
	updateRouterName(state, routerName) {
		state.routerName = routerName;
	},
	updatePendingStatus(state, pendingStatus) {
		state.pendingStatus = pendingStatus;
	},
	updateAlarmLevel(state, alarmLevel) {
		state.alarmLevel = alarmLevel;
	},
	updateCurrentPage(state, currentPage) {
		state.currentPage = currentPage;
	},
	updateMessageCurrentPage(state, messageCurrentPage) {
		state.messageCurrentPage = messageCurrentPage;
	},
	updateMessagePageSize(state, messagePageSize) {
		state.messagePageSize = messagePageSize;
	},
	updateMessageTotalNum(state, messageTotalNum) {
		state.messageTotalNum = messageTotalNum;
	},
	updateMessageList(state, messageList) {
		state.messageList = messageList;
	},
	updateShowRemark(state, showRemark) {
		state.showRemark = showRemark;
	},
	updateShowPending(state, showPending) {
		state.showPending = showPending;
	},
	updateSelectItem(state, selectItem) {
		state.selectItem = selectItem;
	},
	updateTotalNum(state, totalNum) {
		state.totalNum = totalNum;
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
	updateTownCode(state, code) {
		state.townCode = code;
	},
	updatePoliceCode(state, code) {
		state.policeCode = code;
	},
	updateUnitId(state, code) {
		state.unitId = code;
	},
	updateMapCodeStr(state, code) {
		state.mapCodeStr = code;
	},
	updateInter: function(state, obj) {
		state.inter = obj;
	},
	updateEventType: function(state, obj) {
		state.eventType = obj;
	},
	updateIntervalNum: function(state, obj) {
		state.intervalNum = obj;
	},
	updateRootLevel: function(state, obj) {
		state.rootLevel = obj;
	},
	updateRootCode: function(state, obj) {
		state.rootCode = obj;
	},
	updateAlarmList: function(state, obj) {
		state.alarmList = obj;
	},
}

const actions = {
	init({
		state,
		commit,
		dispatch,
		rootState
	}) {
		if(state.routerName == 'alarmAnalyse') {
			dispatch('countEvents');
			dispatch('getMap');
			dispatch('getCompare');
			dispatch('getBar');
			commit('updateChangeMapParamFlag');
		} else {
			dispatch('queryList');
		}

		if(state.routerName == 'alarm') {
			commit('updateChangeMapParamFlag');
			dispatch('queryTotalAlarmNum');
		}
	},
	initWs({
		state,
		commit,
		dispatch,
		rootState
	}) {
		dispatch('initOnlyOne');
		if(state.routerName == 'alarmDetail' || state.routerName == 'platform' || state.routerName == 'zone') { //其他2个页面 有searchBar init初始化
			dispatch('queryList');
		}
		if(state.routerName == 'platform' || state.routerName == 'zone'){
			dispatch('countEventsToday');
		}
	},
	initOnlyOne({
		state,
		commit,
		dispatch,
		rootState
	}) {
		if(!state.initFirst) {
			return;
		}
		commit('updateInitFirst', false);
		if(!isConnected) {
			let token = rootState.global.accountInfo.token;
			initWS(token, rootState.platform.province_code, rootState.searchBar.cityCode, rootState.searchBar.townCode, rootState.searchBar.policeCode, rootState.searchBar.unitId);
		    dispatch('listenWs');
		}
		dispatch('getAlarmType');
	},
	listenWs({
		state,
		commit,
		dispatch
	}) {
		listen(function(res) {
			console.log('收到消息');
			if(state.routerName == 'platform') {
				dispatch('queryList');
			}
			if(state.routerName == 'alarm') {
				dispatch('queryList');
				dispatch('queryTotalAlarmNum');
			}
			if(state.routerName == 'alarmDetail') {
				dispatch('queryList');
			}
		});
	},
	setRouterName({
		state,
		commit,
		dispatch,
		rootState
	}, routerName) {
		commit('updateRouterName', routerName);
		commit('updateEventType', '');
		commit('updateAlarmLevel', '');
		commit('updatePendingStatus', '');

		commit('updateTownCode', '');
		commit('updateTownList', []);
		commit('updatePoliceCode', '');
		commit('updatePoliceCodeList', []);
		commit('updateUnitId', '');
		commit('updateUnitIdList', []);
		
		if(state.routerName == 'alarmDetail') {
			commit('updateTownCode', rootState.platform.currentTownCode == 'all' ? "" : rootState.platform.currentTownCode);
			commit('updatePoliceCode', rootState.platform.currentPoliceCode == 'all' ? "" : rootState.platform.currentPoliceCode);
			commit('updateUnitId', rootState.platform.currentUnitId == 'all' ? "" : rootState.platform.currentUnitId);
			dispatch('getTownList');
		}

	},
	queryList({
		state,
		commit,
		rootState,
		dispatch
	}) {
		if(state.routerName == 'platform' || state.routerName == 'zone'){
			dispatch('queryAlarmListPlatform');
		}else{
			dispatch('queryAlarmList');
		}
	},
	pengdingItem({
		state,
		commit,
		rootState,
		dispatch
	}) {
		$.ajax({
			url: alarmAddr + '/alarm/',
			type: 'post',
			data: JSON.stringify({
				"Token": rootState.global.accountInfo.token,
				"Command": "UpdateEventPendingStatus",
				"key": "modify_event_pending_status",
				"var": {
					"item_id": state.selectItem.item_id,
					"pending_status": "pending",
					"pending_user_id": rootState.global.accountInfo.username
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true') {
					dispatch('queryList');
					commit('updateShowPending', false);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	countEventsToday({
		state,
		commit,
		rootState
	}) {
		var dateNow = new Date();
		let startTime = dateNow.getFullYear() + "-" + formatTime(dateNow.getMonth() + 1) + "-" + formatTime(dateNow.getDate()) + " 00:00:00";
		$.ajax({
			url: alarmAddr + '/alarm/',
			type: 'post',
			data: JSON.stringify({
				"Token": rootState.global.accountInfo.token,
				"Command": "CountEventsToday",
				"currentPage": "0",
				"offset": "0",
				"days": '',
				"var": {
					'province_code': rootState.platform.province_code,
					'city_code': rootState.platform.city_code,
					'town_code': rootState.platform.currentTownCode == 'all' ? "" : rootState.platform.currentTownCode,
					'subdistrict_code': '',
					'village_code': '',
					'police_code': rootState.platform.currentPoliceCode == 'all' ? "" : rootState.platform.currentPoliceCode,
					"estate_code": rootState.platform.currentUnitId == 'all' ? "" : rootState.platform.currentUnitId,
					"start_time": startTime,
					"end_time": '',
					"alarm_degree": '',
					"pending_status": '',
					"event_type": '',
					"item_id": "",
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true') {
					commit('updateEventDegreeCount', jsonData.EventDegree);
					jsonData.EventStatus.total = jsonData.EventStatus.pending + jsonData.EventStatus.unpending;
					if(jsonData.EventStatus.total == 0) {
						jsonData.EventStatus.pendingRate = 0;
					} else {
						jsonData.EventStatus.pendingRate = parseFloat(jsonData.EventStatus.pending / jsonData.EventStatus.total * 100).toFixed(2);
					}
					if(jsonData.EventStatus.total == 0) {
						jsonData.EventStatus.unpendingRate = 100;
					} else {
						jsonData.EventStatus.unpendingRate = parseFloat(jsonData.EventStatus.unpending / jsonData.EventStatus.total * 100).toFixed(2);
					}
					commit('updateEventStatusCount', jsonData.EventStatus);
					commit('updateEventTypeCount', jsonData.EventType);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	countEvents({
		state,
		commit,
		rootState
	}) {
		$.ajax({
			url: alarmAddr + '/alarm/',
			type: 'post',
			data: JSON.stringify({
				"Token": rootState.global.accountInfo.token,
				"Command": "CountEventsToday",
				"currentPage": "0",
				"offset": "0",
				"days": state.day,
				"var": {
					'province_code': rootState.platform.province_code,
					'city_code': rootState.searchBar.cityCode,
					'town_code': rootState.searchBar.townCode,
					'subdistrict_code': '',
					'village_code': '',
					'police_code': rootState.searchBar.policeCode,
					"estate_code": rootState.searchBar.unitId,
					"start_time": state.startTime,
					"end_time": state.endTime,
					"alarm_degree": '',
					"pending_status": '',
					"event_type": '',
					"item_id": "",
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true') {
					commit('updateEventDegreeCount', jsonData.EventDegree);
					jsonData.EventStatus.total = jsonData.EventStatus.pending + jsonData.EventStatus.unpending;
					if(jsonData.EventStatus.total == 0) {
						jsonData.EventStatus.pendingRate = 0;
					} else {
						jsonData.EventStatus.pendingRate = parseFloat(jsonData.EventStatus.pending / jsonData.EventStatus.total * 100).toFixed(2);
					}
					if(jsonData.EventStatus.total == 0) {
						jsonData.EventStatus.unpendingRate = 100;
					} else {
						jsonData.EventStatus.unpendingRate = parseFloat(jsonData.EventStatus.unpending / jsonData.EventStatus.total * 100).toFixed(2);
					}
					commit('updateEventStatusCount', jsonData.EventStatus);
					commit('updateEventTypeCount', jsonData.EventType);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	addRemark({
		state,
		commit,
		rootState,
		dispatch
	}, remarkTxt) {
		$.ajax({
			url: alarmAddr + '/alarm/',
			type: 'post',
			data: JSON.stringify({
				"Token": rootState.global.accountInfo.token,
				"Command": "AddEventRemark",
				"key": "modify_event_remark",
				"var": {
					"event_item_id": state.selectItem.item_id,
					"remark": remarkTxt,
					"recorder_id": rootState.global.accountInfo.username
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true') {
					dispatch('queryRemarkList');
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	queryAlarmListPlatform({
		state,
		commit,
		rootState
	}) {
		$.ajax({
			url: alarmAddr + '/alarm/',
			type: 'post',
			data: JSON.stringify({
				"Token": rootState.global.accountInfo.token,
				"Command": "QueryAlarm",
				'key': 'Query_event_list',
				"currentPage": state.currentPage - 1,
				"offset": state.platformSize,
				"var": {
					'province_code': rootState.platform.province_code,
					'city_code': rootState.platform.city_code,
					'town_code': rootState.platform.currentTownCode == 'all' ? "" : rootState.platform.currentTownCode,
					'subdistrict_code': '',
					'village_code': '',
					'police_code': rootState.platform.currentPoliceCode == 'all' ? "" : rootState.platform.currentPoliceCode,
					"estate_code": rootState.platform.currentUnitId == 'all' ? "" : rootState.platform.currentUnitId,
					"start_time": '',
					"end_time": '',
					"alarm_degree": '',
					"pending_status": '',
					"event_type": '',
					"item_id": "",
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true') {
					commit('updateAlarmList', jsonData.Rows);
					commit('updateTotalNum', jsonData.TotalNumber);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	queryAlarmList({
		state,
		commit,
		rootState
	}) {
		var offset = state.pageSize;
		if(state.routerName == 'alarmDetail'){
			offset = state.detailSize;
		}else if(state.routerName == 'platform' || state.routerName == 'zone'){
			offset = state.platformSize;
		}
		$.ajax({
			url: alarmAddr + '/alarm/',
			type: 'post',
			data: JSON.stringify({
				"Token": rootState.global.accountInfo.token,
				"Command": "QueryAlarm",
				'key': 'Query_event_list',
				"currentPage": state.currentPage - 1,
				"offset": offset,
				"var": {
					'province_code': rootState.platform.province_code,
					'city_code': rootState.platform.city_code,
					'town_code': state.routerName == 'alarmDetail' ? state.townCode : rootState.searchBar.townCode,
					'subdistrict_code': '',
					'village_code': '',
					'police_code': state.routerName == 'alarmDetail' ? state.policeCode : rootState.searchBar.policeCode,
					"estate_code": state.routerName == 'alarmDetail' ? state.unitId : rootState.searchBar.unitId,
					"start_time": state.startTime,
					"end_time": state.endTime,
					"alarm_degree": state.alarmLevel,
					"pending_status": state.pendingStatus,
					"event_type": state.eventType,
					"item_id": "",
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true') {
					commit('updateAlarmList', jsonData.Rows);
					commit('updateTotalNum', jsonData.TotalNumber);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	queryTotalAlarmNum({
		state,
		commit,
		rootState
	}) {
		var dateNow = new Date();
		let startTime = dateNow.getFullYear() + "-" + formatTime(dateNow.getMonth() + 1) + "-" + formatTime(dateNow.getDate()) + " 00:00:00";
		$.ajax({
			url: alarmAddr + '/alarm/',
			type: 'post',
			data: JSON.stringify({
				"Token": rootState.global.accountInfo.token,
				"Command": "CountEventsTodayTongRen",
				'key': 'Query_event_list_count',
				"var": {
					'province_code': rootState.platform.province_code,
					'city_code': rootState.searchBar.cityCode,
					'town_code': state.routerName == 'alarmDetail' ? state.townCode : rootState.searchBar.townCode,
					'subdistrict_code': '',
					'village_code': '',
					'police_code': state.routerName == 'alarmDetail' ? state.policeCode : rootState.searchBar.policeCode,
					"estate_code": state.routerName == 'alarmDetail' ? state.unitId : rootState.searchBar.unitId,
					"start_time": startTime,
					"end_time": "",
					"alarm_degree": "",
					"pending_status": "",
					"event_type": "",
					"item_id": ""
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true') {
					commit('updateTotalAlarmNum', jsonData.Rows);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	queryRemarkList({
		state,
		commit,
		rootState
	}) {
		$.ajax({
			url: alarmAddr + '/alarm/',
			type: 'post',
			data: JSON.stringify({
				"Token": rootState.global.accountInfo.token,
				"Command": "QueryAlarm",
				'key': 'Query_remark_list',
				"currentPage": state.messageCurrentPage - 1,
				"offset": state.messagePageSize,
				'var': {
					"event_item_id": state.selectItem.item_id,
					"start_time": "",
					"end_time": "",
					"recorder_id": '',
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true') {
					commit('updateMessageList', jsonData.Rows);
					commit('updateMessageTotalNum', jsonData.TotalNumber);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	getAlarmType({
		state,
		commit,
		dispatch,
		rootState
	}) {
		let token = rootState.global.accountInfo.token;
		$.ajax({
			url: alarmAddr + '/alarm/',
			type: 'post',
			data: JSON.stringify({
				"Command": "QueryAlarmTypes",
				"Token": token
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true') {
					commit('updateEventTypeObj', jsonData.Result);
				} else {
				}
			},
			error: function(xhr, type, errorThrown) {
			}
		})
	},
	getMap({
		state,
		commit,
		dispatch,
		rootState
	}) {
		let token = rootState.global.accountInfo.token;
		$.ajax({
			url: alarmAddr + '/alarm_count_analysis_compare',
			type: 'post',
			data: JSON.stringify({
				"Command": "CountAlarmAreaCompare",
				"Token": token,
				"var": {
					'province_code': rootState.platform.province_code,
					'city_code': rootState.searchBar.cityCode,
					'town_code': rootState.searchBar.townCode,
					'subdistrict_code': '',
					'village_code': '',
					'police_code': rootState.searchBar.policeCode,
					"estate_code": rootState.searchBar.unitId,
					"alarm_degree": "",
					"pending_status": "",
					"event_type": "",
					"item_id": "",
					"days": state.day,
					'start_time': state.startTime,
					'end_time': state.endTime
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true' && jsonData.Result instanceof Array) {
					commit('updateAlarmMap', jsonData.Result);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	getCompare({
		state,
		commit,
		dispatch,
		rootState
	}) {
		let token = rootState.global.accountInfo.token;
		$.ajax({
			url: alarmAddr + '/alarm_count_analysis_compare',
			type: 'post',
			data: JSON.stringify({
				"Command": "CountAlarmTrend",
				"Token": token,
				"var": {
					'province_code': rootState.platform.province_code,
					'city_code': rootState.searchBar.cityCode,
					'town_code': rootState.searchBar.townCode,
					'subdistrict_code': '',
					'village_code': '',
					'police_code': rootState.searchBar.policeCode,
					"estate_code": rootState.searchBar.unitId,
					"alarm_degree": "",
					"pending_status": "",
					"event_type": "",
					"item_id": "",
					"days": state.day,
					'start_time': state.startTime,
					'end_time': state.endTime
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true' && jsonData.Result instanceof Array) {
					commit('updateAlarmChange', jsonData.Result);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	getBar({
		state,
		commit,
		dispatch,
		rootState
	}) {
		let token = rootState.global.accountInfo.token;
		$.ajax({
			url: alarmAddr + '/alarm_count_analysis_compare',
			type: 'post',
			data: JSON.stringify({
				"Command": "CountAlarmHotTimePeriod",
				"Token": token,
				"var": {
					'province_code': rootState.platform.province_code,
					'city_code': rootState.searchBar.cityCode,
					'town_code': rootState.searchBar.townCode,
					'subdistrict_code': '',
					'village_code': '',
					'police_code': rootState.searchBar.policeCode,
					"estate_code": rootState.searchBar.unitId,
					"alarm_degree": "",
					"pending_status": "",
					"event_type": "",
					"item_id": "",
					"days": state.day,
					'start_time': state.startTime,
					'end_time': state.endTime
				}
			}),
			success: function(jsonData) {
				if(jsonData.ResultCode == 'true' && jsonData.Result instanceof Array) {
					commit('updateAlarmBar', jsonData.Result);
				}
			},
			error: function(xhr, type, errorThrown) {}
		})
	},
	clear({
		state,
		commit
	}, type) {
		if(type == 'townCode') {
			commit('updateTownCode', '');
			commit('updateTownList', []);
			commit('updatePoliceCode', '');
			commit('updatePoliceCodeList', []);
			commit('updateUnitId', '');
			commit('updateUnitIdList', []);
		}else if(type == 'policeCode') {
			commit('updatePoliceCode', '');
			commit('updatePoliceCodeList', []);
			commit('updateUnitId', '');
			commit('updateUnitIdList', []);
		} else if(type == 'unitId') {
			commit('updateUnitId', '');
			commit('updateUnitIdList', []);
		}
	},
	getTownList({
		state,
		commit,
		dispatch
	}) {
		if(state.cityCode == "") {
			commit('updateCityCode', city_code);
		}
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
					if(response.data.length == 1 || state.townCode != '') {
						dispatch('getPoliceList');
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
						if(response.data[i].police_code == '') {
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
					if(response.data.length == 1 || state.policeCode != '') {
						dispatch('getUnitList');
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
					}
					if(response.data.length > 1) {
						response.data.unshift({
							unit_id: 'all',
							unit_name: '小区'
						});
					}
					commit('updateUnitIdList', response.data);
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