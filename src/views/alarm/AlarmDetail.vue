<template>
	<div class="alarmDetailVue">
		<v-panel title='告警详情' class='v-panel'>
			<i-table :data="alarmDetailList" class="border-table" :columns="tableColumns1"></i-table>
			<div class='pageBarBox'>
				<v-pagination :total=totalNum :pageIndex=currentPage :pageSize=8 @toPage='changePage' class='pageBar'></v-pagination>
			</div>
			<div class="selectAddressDiv" v-show="searchDivShow">
				<div class="addressTxt">县区</div>
				<Select class="v-select" @on-change='changeTownCode' label-in-value :value="townCode" placeholder="县区">
					<Option v-for="item in townList" :value="item.town_code" :key="item.town_code">{{ item.town_name }}</Option>
				</Select>
				<div class="addressTxt">派出所</div>
				<Select class="v-select" @on-change='changePoliceCode' label-in-value :value="policeCode" placeholder="社区/村">
					<Option v-for="item in policeCodeList" :value="item.police_code" :key="item.police_code">{{ item.police_name }}</Option>
				</Select>
				<div class="addressTxt">小区</div>
				<Select class="v-select" @on-change='changeUnitId' label-in-value :value="unitId" placeholder="小区">
					<Option v-for="item in unitIdList" :value="item.unit_id" :key="item.unit_id">{{ item.unit_name }}</Option>
				</Select>
				<div class="clear"></div>
				<div class="btn" @click="closeSearch">搜索</div>
			</div>
		</v-panel>
		<v-alarmRemark v-show="showRemark" class="alarmRemark" @close="closeRemark"></v-alarmRemark>
		<v-alarmPending v-show="showPending" class="alarmPending" @close="closePending"></v-alarmPending>
		<v-alarmAlert class="alarmAlert" v-show="showAlert" :photoUrl=photoUrl @close='closeAlert'></v-alarmAlert>
	</div>
</template>

<script>
	import $ from 'jquery'
	import vPanel from '@/components/Panel'
	import vAlarmAlert from '@/views/alarm/AlarmAlert'
	import vAlarmRemark from '@/views/alarm/AlarmRemark'
	import vAlarmPending from '@/views/alarm/AlarmPending'
	import vPagination from '@/components/Pagination'
	import { imgServerAddr } from '../../config'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('alarm')

	export default {
		components: {
			vAlarmAlert,
			vAlarmRemark,
			vAlarmPending,
			vPanel,
			vPagination
		},
		name: 'AlarmDetail',
		data() {
			return {
				showAlert: false, //是否弹出照片
				photoUrl: '', //照片地址
				searchDivShow: false,
				tableColumns1: [{
						title: 'alarm_degree',
						key: 'alarm_degree',
						align: 'center',
						width:'180px',
						renderHeader: (h, params) => {
							return h('select', {
								style: {
									color: "white",
									width: '120px',
									height: "35px",
									backgroundColor: '#144387',
									border: "1px solid #1cb1ff"
								},
								attrs: {
									placeholder: '告警级别',
									value: ''
								},
								on: {
									change: (e) => {
										this.updateAlarmLevel($(e.target).val());
										this.queryList();
									}
								}
							}, [
								h('option', {
									attrs: {
										key: '',
										value: ''
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, '告警级别'),
								h('option', {
									attrs: {
										key: 'first_degree',
										value: 'first_degree'
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, '红色告警'),
								h('option', {
									attrs: {
										key: 'second_degree',
										value: 'second_degree'
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, '橙色告警'),
								h('option', {
									attrs: {
										key: 'third_degree',
										value: 'third_degree'
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, '黄色告警'),
								h('option', {
									attrs: {
										key: 'fourth_degree',
										value: 'fourth_degree'
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, '蓝色告警'),
							])
						},
						render: (h, params) => {
							let row = params.row;
							let color = "";
							let text = "";
							if(row.alarm_degree == 'first_degree') {
								text = '红色告警';
								color = "#ff4444";
							} else if(row.alarm_degree == 'second_degree') {
								text = '橙色告警';
								color = "#ff4f00";
							} else if(row.alarm_degree == 'third_degree') {
								text = '黄色告警';
								color = "#ffae00";
							} else if(row.alarm_degree == 'fourth_degree') {
								text = '蓝色告警';
								color = "#007eff";
							}
							return h('div', {}, [
								h('span', {
									style: {
										width: '20px',
										height: "20px",
										display: "inline-block",
										color: "#fff",
										textAlign: "center",
										lineHeight: "30px",
										backgroundColor: color,
										position: "relative",
										top: '5px'
									},
								}, ),
								h('span', {
									style: {
										color: color
									},
								}, "     " + text)
							]);
						}
					},
					{
						title: '事件类别',
						key: 'event_type',
						align: 'center',
						renderHeader: (h, params) => {
							var typeArr = [];
							typeArr.push(h('option', {
								attrs: {
									key: '',
									value: ''
								},
								style: {
									backgroundColor: "#1479bd"
								}
							}, '事件类别'));
							for(var e in this.eventTypeObj) {
								typeArr.push(h('option', {
									attrs: {
										key: e,
										value: e
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, this.eventTypeObj[e]));
							}
							return h('select', {
								style: {
									color: "white",
									width: '120px',
									height: "35px",
									backgroundColor: '#144387',
									border: "1px solid #1cb1ff"
								},
								attrs: {
									placeholder: '事件类别',
									value: ''
								},
								on: {
									change: (e) => {
										this.updateEventType($(e.target).val());
										this.queryList();
									}
								}
							}, typeArr)
						}
					},
					{
						title: ' 事件描述',
						key: 'case_desc_html',
						align: 'left',
						type: 'html',
						className: 'demo-table-info-column'
					},
					{
						title: '发生时间',
						key: 'create_time',
						align: 'left',
						className: 'demo-table-info-column'
					},
					{
						title: '发生地点',
						key: 'position',
						align: 'left',
						renderHeader: this.showAddress,
						className: 'demo-table-info-column',
						width:'200px'
					},
					{
						title: '事件图片',
						key: 'event_image_id',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Img', {
									attrs: {
										src: params.row.event_image_id
									},
									style: {
										width: '80px',
										height: '60px',
									},
									on: {
										click: () => {
											this.showPhoto(params.row.event_image_id);
										},
										error: (e) => {
											$(e.target).attr('src', require('../../assets/image/alarm/noAlarm.png'));
										},
									}
								}, 'View'),
							]);
						}
					},
					{
						title: '操作状态',
						key: 'pending_name',
						align: 'center',
						renderHeader: (h, params) => {
							return h('select', {
								style: {
									color: "white",
									width: '120px',
									height: "35px",
									backgroundColor: '#144387',
									border: "1px solid #1cb1ff"
								},
								attrs: {
									placeholder: '操作/状态',
									value: ''
								},
								on: {
									change: (e) => {
										this.updatePendingStatus($(e.target).val());
										this.updateCurrentPage(1);
										this.queryList();
									}
								}
							}, [
								h('option', {
									attrs: {
										key: '',
										value: ''
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, '操作/状态'),
								h('option', {
									attrs: {
										key: 'pending',
										value: 'pending'
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, '已处置'),
								h('option', {
									attrs: {
										key: 'unpending',
										value: 'unpending'
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, '未处置'),
							])
						},
						render: (h, params) => {
							let color = params.row.pending_status == "unpending" ? "#ffda2e" : "#1cb1ff";
							let cursor = params.row.pending_status == "unpending" ? "pointer" : "auto";

							return h('div', [
								h('span', {
									style: {
										width: '60px',
										height: '60px',
										cursor: cursor,
										color: color
									},
									on: {
										click: () => {
											if(params.row.pending_status == "unpending"){
												this.showPendingWindow(params.row);
											}
										}
									}
								}, params.row.pending_name),
							]);
						}
					},
					{
						title: '处置人员/时间',
						key: 'pending_info',
						align: 'center',
						type: 'html',
						className: 'demo-table-info-column',
						width:'200px'
					},
					{
						title: '备注',
						key: 'more',
						align: 'center',
						width:'120px',
						render: (h, params) => {
							return h('div', [
								h('span', {
									style: {
										width: '60px',
										height: '60px',
										cursor: 'pointer',
										color: "#ffda2e"
									},
									on: {
										click: () => {
											this.showRemarkWindow(params.row);
										}
									}
								}, params.row.more),
							]);
						}
					}
				],
			}
		},
		computed: {
			...mapState([
				'totalNum',
				'currentPage',
				'townList',
				'policeCodeList',
				'unitIdList',
				'townCode',
				'policeCode',
				'unitId',
				'showPending',
				'showRemark',
				'eventTypeObj'
			]),
			...mapGetters([
				'alarmDetailList',
			])
		},
		methods: {
			showPhoto: function(url) {
				this.photoUrl = url;
				this.showAlert = true;
			},
			closeAlert: function() {
				this.showAlert = !this.showAlert;
			},
			showRemarkWindow: function(item) {
				this.updateSelectItem(item);
				this.updateShowRemark(true);
			},
			closeRemark: function() {
				this.updateShowRemark(false);
			},
			showPendingWindow: function(item) {
				this.updateSelectItem(item);
				this.updateShowPending(true);
			},
			closePending: function() {
				this.updateShowPending(false);
			},
			changeTownCode: function(val) {
				var code = val.value;
				var label = val.label;
				if(code == 'all') {
					code = "";
					label = "";
					this.updateTownCode(code);
					this.clear('policeCode');
				} else if(code != '') {
					this.updateTownCode(code);
					this.clear('policeCode');
					var that = this;
					this.getPoliceList()
				}
			},
			changePoliceCode: function(val) {
				var code = val.value;
				var label = val.label;
				if(code == 'all') {
					code = "";
					label = "";
					this.updatePoliceCode(code);
					this.clear('unitId');
				} else if(code != '') {
					this.updatePoliceCode(code);
					this.clear('unitId');
					var that = this;
					this.getUnitList();
				}
			},
			changeUnitId: function(val) {
				var code = val.value;
				var label = val.label;
				if(code == 'all') {
					code = "";
					label = "";
					this.updateUnitId(code);
				} else if(code != '') {
					this.updateUnitId(code);
				}
			},
			changeSex: function(code) {
				this.updateSex(code);
			},
			changeType: function(code) {
				this.updatePopulationType(code);
			},
			...mapMutations([
				'updatePendingStatus',
				'updateEventType',
				'updateAlarmLevel',
				'updateCurrentPage',
				'updateTownCode',
				'updateTownshipCode',
				'updatePoliceCode',
				'updateUnitId',
				'updateSelectItem',
				'updateShowPending',
				'updateShowRemark'
			]),
			...mapActions([
				'initWs',
				'queryList',
				'getTownList',
				'getTownShipList',
				'getPoliceList',
				'getUnitList',
				'getBuilding',
				'clear',
			]),
			changePage: function(currentPage) {
				this.updateCurrentPage(currentPage);
				this.queryList();
			},
			closeSearch: function() {
				this.searchDivShow = !this.searchDivShow;
				this.queryList();
			},
			showAddress: function(h, params) {
				return h('div', {
					style: {
						position:'relative',
						color: "white",
						width: '120px',
						height: "35px",
					}
				}, [
					h('div', {
						style: {
							color: "white",
							width: '120px',
							height: "35px",
							lineHeight: "35px",
							backgroundColor: '#144387',
							border: "1px solid #1cb1ff",
							paddingLeft: '5px',
							zIndex:1,
							cursor:'default'
							
						},
						on: {
							click: () => {
								this.searchDivShow = !this.searchDivShow;
							}
						}
					}, "发生地点", ),
					h('Img', {
						attrs: {
							src: require('../../assets/image/alarm/arrow-down.png')
						},
						style: {
							position:'absolute',
							left:'103px',
							top:'13px',
							zIndex:100,
							width: '10px',
							height: '10px',
							pointerEvents:'none'
						},
					}, 'View')
				])
			}
		},
		mounted: function() {
			this.initWs();
		}
	}
</script>

<style lang="scss">
	.alarmDetailVue {
		.demo-table-info-column {
			text-align: left;
			line-height: 30px;
			span {
				line-height: 30px;
			}
		}
		select {
			color: white;
			border: 1px solid #06619f;
			background: url(../../assets/image/alarm/arrow-down.png) no-repeat;
			background-position: 95% 48%;
			background-size: 10px 10px;
			appearance: none;
			-moz-appearance: none;
			-webkit-appearance: none;
			padding-left: 5px;
			background-color: #032A51;
		}
		margin-top: 20px;
		color: white;
		font-size: 16px;
		.v-panel {
			position: relative;
			padding-bottom: 10px;
			.selectAddressDiv {
				position: absolute;
				top: 95px;
				left: 753px;
				width: 318px;
				height: 272px;
				background-color: #1479bd;
				.addressTxt {
					margin-top: 10px;
					width: 110px;
					float: left;
					height: 40px;
					line-height: 40px;
					padding-left: 10px;
				}
				.v-select {
					margin-top: 10px;
					width: 200px;
					float: left;
					background-color: #1479bd;
				}
				.v-select .ivu-select-dropdown {
					background-color: rgba(24, 83, 144, 1);
				}
				.btn {
					cursor: pointer;
					width: 100px;
					height: 36px;
					text-align: center;
					line-height: 36px;
					margin: 15px auto 0;
					background-color: #1cb1ff;
				}
			}
			.pageBarBox {
				margin: 40px 0;
				text-align: center;
			}
		}
	}
</style>