<template>
	<div class="activeRecord">
		<div class='title'>
			<img src="../../assets/image/securityCount-logo.png" />
			<div class="name">记录查询</div>
		</div>
		<div class="searchBar">
			<div class="txt">时间：</div>
			<!--<DatePicker type="datetimerange" class='date-select-input' placeholder="选择时间" @on-change="changeTime"></DatePicker><br>-->
			<DatePicker class="app-datepicker-travel" type="datetimerange" placement="bottom-start" :open="caropen" :editable="false" confirm @on-change="carHandleChange" @on-clear="carHandleClear" @on-ok="carHandleOk">
				<div class="date-container" @click="carHandleClick">
					<input type="text" readonly="readonly" :value="cardate[0]">
					<span>至</span>
					<input type="text" readonly="readonly" :value="!cardate[0] ? cardate[0] : cardate[1]">
				</div>
			</DatePicker>
			<v-Button @click='startSearch()' class='btn'></v-Button>
		</div>
		<i-table :data='doorRecordList' class="border-table" :columns="tableColumns1"></i-table>
		<div class='pageBarBox'>
			<v-pagination :total=doorTotalNum :pageIndex=doorCurrentPage :pageSize=7 @toPage='changePage' class='pageBar'></v-pagination>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
	import { imgServerAddr } from '../../config'
	import vButton from '@/components/Button'
	import vPagination from '@/components/Pagination'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('record')

	export default {
		components: {
			vButton,
			vPagination
		},
		name: 'ActiveRecord',
		props: {
			userId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				caropen: false,
      	        cardate: ['', ''],
				tableColumns1: [{
						title: '日期',
						key: 'date',
						align: 'center',
					},
					{
						title: '时间',
						key: 'time',
						align: 'center',
					},
					{
						title: '小区',
						key: 'unit_name',
						align: 'center',
						renderHeader: (h, params) => {
							var optionArr = [
								h('option', {
									attrs: {
										key: '',
										value: '',
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, '小区')
							];
							for(var i = 0; i < this.unitList.length; i++) {
								var option = h('option', {
									attrs: {
										key: this.unitList[i].unit_id,
										value: this.unitList[i].unit_id
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, this.unitList[i].unit_name);
								optionArr.push(option);
							}
							return h('select', {
								style: {
									color: "white",
									width: '180px',
									height: "35px",
									backgroundColor: '#144387',
									border: "1px solid #1cb1ff"
								},
								attrs: {
									placeholder: '小区',
									value: ''
								},
								on: {
									change: (e) => {
										this.updateUnitId($(e.target).val());
										this.doorRecord();
										this.queryDoorByUnit();
									}
								}
							}, optionArr)
						},
					},
					{
						title: '门禁',
						key: 'door_name',
						align: 'center',
						renderHeader: (h, params) => {
							var optionArr = [
								h('option', {
									attrs: {
										key: '',
										value: '',
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, '门禁')
							];
							for(var i = 0; i < this.doorList.length; i++) {
								var option = h('option', {
									attrs: {
										key: this.doorList[i].door_code,
										value: this.doorList[i].door_code
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, this.doorList[i].door_name);
								optionArr.push(option);
							}
							return h('select', {
								style: {
									color: "white",
									width: '180px',
									height: "35px",
									backgroundColor: '#144387',
									border: "1px solid #1cb1ff"
								},
								attrs: {
									placeholder: '门禁',
									value: ''
								},
								on: {
									change: (e) => {
										this.updateDoorId($(e.target).val());
										this.doorRecord();
									}
								}
							}, optionArr)
						},
					},
					{
						title: '开门方式',
						key: 'open_door_name',
						align: 'center',
						renderHeader: (h, params) => {
							var optionArr = [];
							for(var i = 0; i < this.openDoorType.length; i++) {
								var option = h('option', {
									attrs: {
										key: this.openDoorType[i].code,
										value: this.openDoorType[i].code
									},
									style: {
										backgroundColor: "#1479bd"
									}
								}, this.openDoorType[i].name);
								optionArr.push(option);
							}
							return h('select', {
								style: {
									color: "white",
									width: '180px',
									height: "35px",
									backgroundColor: '#144387',
									border: "1px solid #1cb1ff"
								},
								attrs: {
									placeholder: '开门方式',
									value: ''
								},
								on: {
									change: (e) => {
										this.updateOpenDoor($(e.target).val());
										this.doorRecord();
									}
								}
							}, optionArr)
						},
					},
					{
						title: '抓拍图像',
						key: 'picurl',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Img', {
									attrs: {
										src: imgServerAddr + '/' + params.row.picurl + "?p=0",
									},
									style: {
										width: '80px',
										height: '60px',
									},
								}, 'View'),
							]);
						}
					},
				]
			}
		},
		computed: {
			...mapState([
				'unitList',
				'openDoorType',
				'doorRecordList',
				'doorList',
				'doorCurrentPage',
				'doorTotalNum'
			]),
			...mapGetters([

			])
		},
		methods: {
			carHandleClick() {
				this.caropen = !this.caropen;
			},
			carHandleChange(cardate) {
				this.cardate = cardate;
			},
			carHandleClear() {
				this.caropen = false;
			},
			carHandleOk() {
				this.caropen = false;
				this.updateStartTime(this.cardate[0]);
				this.updateEndTime(this.cardate[1]);
			},
			changePage: function(currentPage) {
				this.updateDoorCurrentPage(currentPage);
				this.doorRecord();
			},
			toMore: function() {},
			startSearch: function() {
				this.updateDoorCurrentPage(1);
				this.doorRecord();
			},
//			changeTime: function(value) {
//				this.updateStartTime(value[0]);
//				this.updateEndTime(value[1]);
//			},
			changeSex: function(code) {},
			changeType: function(code) {},
			...mapMutations([
				'updateDoorCurrentPage',
				'updateDoorId',
				'updateStartTime',
				'updateEndTime',
				'updateUnitId',
				'updateUserId',
				'updateOpenDoor'
			]),
			...mapActions([
				'queryUnitById',
				'doorRecord',
				'queryDoorByUnit'
			]),
		},
		mounted: function() {
			this.updateUserId(this.userId);
			this.queryUnitById();
			this.doorRecord();
		}
	}
</script>

<style lang="scss">
	.activeRecord {
		margin-top: 100px;
		color: #3fa7ff;
		font-size: 16px;
		.pageBarBox {
			margin: 27px 0;
			text-align: center;
			.pageBar {}
		}
		.title {
			width: 800px;
			position: absolute;
			left: 2px;
			top: 60px;
			.name {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				position: absolute;
				display: inline-block;
				left: 60px;
				bottom: 28px;
				font-size: 16px;
			}
		}
		.border-table {
			margin-left: 50px;
			width: 1760px;
		}
		.searchBar {
			width: 1640px;
			position: absolute;
			left: 170px;
			top: 70px;
			.txt {
				position: absolute;
				top: 2px;
				left: 10px;
			}
			.app-datepicker-travel{
				position: absolute;
				top: -2px;
				left: 70px;
				font-size: 16px;
				.date-container{
					input{
						width: 168px;
					}
				}
			}
			.date-select-input {
				position: absolute;
				top: -2px;
				left: 60px;
				color: #333;
				width: 400px;
				height: 50px;
				.ivu-input {
					font-size: 16px;
				}
			}
			.btn {
				position: absolute;
				top: -5px;
				left: 520px;
				float: left;
			}
			.more {
				cursor: pointer;
				position: absolute;
				top: 0px;
				right: 0px;
				color: #FEDD40;
			}
		}
	}
</style>