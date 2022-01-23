<template>
	<div class="alarmRecord">
		<div class='title'>
			<img src="../../assets/image/securityCount-logo.png" />
			<div class="name">记录查询</div>
		</div>
		<div class="searchBar">
			<div class="txt">时间：</div>
			<DatePicker class="app-datepicker-travel" type="datetimerange" placement="bottom-start" :open="caropen" :editable="false" confirm @on-change="carHandleChange" @on-clear="carHandleClear" @on-ok="carHandleOk">
				<div class="date-container" @click="carHandleClick">
					<input type="text" readonly="readonly" :value="cardate[0]">
					<span>至</span>
					<input type="text" readonly="readonly" :value="!cardate[0] ? cardate[0] : cardate[1]">
				</div>
			</DatePicker>
			<v-Button @click='startSearch()' class='btn'></v-Button>
		</div>
		<i-table :data="alarmList" class="border-table" :columns="tableColumns1"></i-table>
		<div class='pageBarBox'>
			<v-pagination :total=alarmTotalNum :pageIndex=alarmCurrentPage :pageSize=7 @toPage='changePage' class='pageBar'></v-pagination>
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
		name: 'AlarmRecord',
		props: {
			IDcard: {
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
						title: '告警级别',
						key: 'alarm_degree',
						align: 'center',
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
								color = "#007eff";
							} else if(row.alarm_degree == 'fourth_degree') {
								text = '蓝色告警';
								color = "#ffae00";
							}
							return h('div', {
								style: {
									width: '100px',
									height: "30px",
									display:"inline-block",
									color:"#fff",
									textAlign:"center",
									lineHeight:"30px",
									backgroundColor: color
								},
							}, text);
						}
					},
					{
						title: '告警地址',
						key: 'alarm_address',
						align: 'center',
					},
					{
						title: '抓拍图像',
						key: 'picurl',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Img', {
									attrs: {
										src: imgServerAddr + '/' + params.row.event_image_id  + "?p=0", 
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
				'alarmList',
				'alarmCurrentPage',
				'alarmTotalNum'
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
				this.updateAlarmCurrentPage(currentPage);
				this.getAlarmRecord();
			},
			toMore: function() {
			},
			startSearch: function() {
				this.updateAlarmCurrentPage(1);
				this.getAlarmRecord();
			},
			changeSex: function(code) {},
			changeType: function(code) {},
			...mapMutations([
				'updateAlarmCurrentPage',
				'updateStartTime',
				'updateEndTime',
				'updateIDcard',
			]),
			...mapActions([
				'getAlarmRecord',
			]),
		},
		mounted: function() {
			this.updateIDcard(this.IDcard);
			this.getAlarmRecord();
		}
	}
</script>

<style lang="scss">
	.alarmRecord {
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
				.ivu-input{
					font-size: 16px;
				}
			}
			.btn{
				position: absolute;
				top: -5px;
				left: 520px;
				float: left;
			}
			.more{
				cursor: pointer;
				position: absolute;
				top: 0px;
				right: 0px;
				color: #FEDD40;
			}
		}
	}
</style>