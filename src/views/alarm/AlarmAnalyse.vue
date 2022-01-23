<template>
	<div class="alarmAnalyse">
		<v-searchBar></v-searchBar>
		<div class="timeTab" @click="selectTime($event)">
			<div class="tab" data-id="180">最近半年</div>
			<div class="tab" data-id="30">最近30天</div>
			<div class="tab" data-id="7">最近7天</div>
			<div class="tab active one" data-id="1">昨天</div>
			<div class="date-select-input">
				<!--<Date-picker id="alarmAnalyse-datePicker" type="daterange" format="yyyy-M-d" @on-change="changeTime" class="datePicker" >
				</Date-picker>-->
				时间:
				<DatePicker class="app-datepicker-travel" type="daterange" placement="bottom-start" :open="caropen" :editable="false" confirm @on-change="carHandleChange" @on-clear="carHandleClear" @on-ok="carHandleOk">
					<div class="date-container" @click="carHandleClick">
						<input type="text" readonly="readonly" :value="cardate[0]">
						<span>至</span>
						<input type="text" readonly="readonly" :value="!cardate[0] ? cardate[0] : cardate[1]">
					</div>
				</DatePicker>
			</div>
			<div class="clear"></div>
		</div>
		<div class="chart">
			<div class="chartBox">
				<div class="title">
					<i class="pie"></i>类别占比
				</div>
				<div class="chartPieType chartTypeBox">
					<v-chartPie :dataArr="pieDataType"></v-chartPie>
				</div>
			</div>
			<div class="chartBox">
				<div class="title">
					<i class="bar"></i>期间内警情统计
				</div>
				<div class="info">
					<div class="total">{{eventStatusCount.total}}<span>起</span></div>
				</div>
				<div class="rate">
					<div class="txt">处置率</div>
					<div ref="doPrecent" class="doPrecent"></div>
					<div class="tipDoPrecent tipBox">
						<div><i></i>未处置</div>
						<div>{{eventStatusCount.unpending}}({{eventStatusCount.unpendingRate}}%)</div>
					</div>
					<div class="unDoPrecent"></div>
					<div class="tipUnDoPrecent tipBox">
						<div><i></i>已处置</div>
						<div>{{eventStatusCount.pending}}({{eventStatusCount.pendingRate}}%)</div>
					</div>
				</div>
				<div class="legend">
					<div><i></i>未处置</div>
					<div><i></i>已处置</div>
					<div class="clear"></div>
				</div>
			</div>
			<div class="chartBox">
				<div class="title">
					<i class="pie"></i>类别占比
				</div>
				<div class="chartPieType">
					<v-chartPie :dataArr="pieDataLevel"></v-chartPie>
				</div>
				<div class="tip">
					<div class="item">
						<div class="colorBg color1">红色告警</div>
						<div><span>{{eventDegreeCount.first_degree}}</span>起</div>
					</div>
					<div class="item">
						<div class="colorBg color2">橙色告警</div>
						<div><span>{{eventDegreeCount.second_degree}}</span>起</div>
					</div>
					<div class="item">
						<div class="colorBg color3">黄色告警</div>
						<div><span>{{eventDegreeCount.third_degree}}</span>起</div>
					</div>
					<div class="item">
						<div class="colorBg color4">蓝色告警</div>
						<div><span>{{eventDegreeCount.fourth_degree}}</span>起</div>
					</div>
				</div>
			</div>
			<div class="clear"></div>
		</div>
		<div class="mapBox">
			<div class="tab-list" @click="tabPage($event)">
				<div class="tab active" data-id="alarmMapTime">趋势走向分析</div>
				<div class="tab" data-id="alarmMapAddress">地域警情比较</div>
			</div>
			<v-alarmMapAddress class="alarmMapAddress"></v-alarmMapAddress>
			<div class="alarmMapTime">
				<v-alarmMapTimeLine></v-alarmMapTimeLine>
				<v-alarmMapTimeBar style="margin-top: 20px;"></v-alarmMapTimeBar>
			</div>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
	import vSearchBar from '@/views/house/SearchBar'
	import vPanel from '@/components/Panel'
	import vChartPie from '@/components/chart/ChartPie'
	import { imgServerAddr } from '../../config'
	import vAlarmMapAddress from '@/views/alarm/AlarmMapAddress'
	import vAlarmMapTimeLine from '@/views/alarm/AlarmMapTimeLine'
	import vAlarmMapTimeBar from '@/views/alarm/AlarmMapTimeBar'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('alarm')

	export default {
		components: {
			vSearchBar,
			vPanel,
			vChartPie,
			vAlarmMapAddress,
			vAlarmMapTimeLine,
			vAlarmMapTimeBar
		},
		name: 'AlarmAnalyse',
		data() {
			return {
				showAddress: "alarmMapTime",
				caropen: false,
      	        cardate: ['', ''],
			}
		},
		methods: {
			carHandleClick() {
				this.caropen = !this.caropen
			},
			carHandleChange(cardate) {
				this.cardate = cardate
			},
			carHandleClear() {
				this.caropen = false;
			},
			carHandleOk() {
				this.caropen = false;
				$(".timeTab .tab").removeClass('active');
				this.updateDay('');
				this.updateStartTime(this.cardate[0]);
				this.updateEndTime(this.cardate[1]);
				if(this.cardate[0] == '') {
					$(".timeTab .one").addClass('active');
					this.updateDay(1);
				}

				this.countEvents();
				this.getMap();
				this.getCompare();
				this.getBar();
				this.updateChangeMapParamFlag();
			},
			selectTime: function(e) {
				if($(e.target).hasClass('tab')) {
					$(e.target).addClass('active').siblings().removeClass('active');
					this.updateDay($(e.target).data('id'));
					this.countEvents();
					this.getMap();
					this.getCompare();
					this.getBar();
					this.cardate = [this.getLastDay($(e.target).data('id')),this.getNowDay()];
					this.updateChangeMapParamFlag();
				}
			},
			getLastDay: function(num) {
				var nowDate = new Date();
				nowDate.setDate(nowDate.getDate() - num);
				return this.formatTime(nowDate.getFullYear()) + '-' + this.formatTime(nowDate.getMonth() + 1) + '-' + this.formatTime(nowDate.getDate());
			},
			getNowDay: function(num) {
				var nowDate = new Date();
				return this.formatTime(nowDate.getFullYear()) + '-' + this.formatTime(nowDate.getMonth() + 1) + '-' + this.formatTime(nowDate.getDate());
			},
			formatTime: function(num) {
				num = num.toString();
				if(num.length < 2){
					return "0"+num;
				}
				return num;
			},
			tabPage: function(e) {
				$(e.target).addClass("active").siblings().removeClass("active");
				if($(e.target).data("id") == 'alarmMapAddress') {
					$(".alarmMapAddress").show();
					$(".alarmMapTime").hide();
				} else {
					$(".alarmMapTime").show();
					$(".alarmMapAddress").hide();
				}
			},
//			changeTime: function(value) {
//				$(".timeTab .tab").removeClass('active');
//				this.updateDay('');
//				this.updateStartTime(value[0]);
//				this.updateEndTime(value[1]);
//				if(value[0] == '' && value[1] == undefined) {
//					$(".timeTab .one").addClass('active');
//					this.updateDay(1);
//				}
//
//				this.countEvents();
//				this.getMap();
//				this.getCompare();
//				this.getBar();
//			},
			...mapMutations([
				'updateDay',
				'updateStartTime',
				'updateEndTime',
				'updateChangeMapParamFlag'
			]),
			...mapActions([
				'getBar',
				'getCompare',
				'getMap',
				'countEvents',
				'initWs'
			])
		},
		computed: {
			...mapGetters([
				'pieDataType',
				'pieDataLevel'
			]),
			...mapState([
				'eventDegreeCount',
				'eventStatusCount',
				'eventTypeCount',
				'day'
			])
		},
		mounted: function() {
			$(".alarmMapAddress").hide();
			this.initWs();
//			this.getMap();
//			this.getCompare();
//			this.getBar();
			
			this.cardate = [this.getLastDay(this.day),this.getNowDay()];
			var arrr = $(".timeTab .tab");
			for (var i = 0; i < arrr.length; i++) {
				if($(arrr[i]).data('id') == this.day){
					$(arrr[i]).addClass('active');
				}else{
					$(arrr[i]).removeClass('active');
				}
			}
		},
		watch: {
			'eventStatusCount': {
				deep: true,
				handler: function(curVal, oldVal) {
					var percentPx = curVal.unpendingRate * 400 / 100;
					percentPx = percentPx + 'px';
					$(this.$refs.doPrecent).css('width', percentPx);
				}
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.alarmAnalyse {
		.mapBox {
			padding-bottom: 20px;
			margin-top: 20px;
			width: 1634px;
			font-size: 18px;
			.tab-list {
				height: 50px;
				.tab {
					width: 150px;
					height: 50px;
					float: left;
					color: #1cb1ff;
					text-align: center;
					line-height: 50px;
					box-sizing: border-box;
					cursor: pointer;
				}
				.tab.active {
					color: #fff;
					line-height: 43px;
					border-top: 4px solid #1cb1ff;
					background-color: rgba(15, 145, 255, 0.1);
					;
				}
			}
		}
		.timeTab {
			padding-right: 40px;
			padding-right: 23px \9\0;
			font-size: 16px;
			color: white;
			.tab {
				cursor: pointer;
				float: right;
				width: 100px;
				height: 36px;
				margin-left: 20px;
				text-align: center;
				line-height: 36px;
				background-color: rgba(28, 177, 255, 0.4);
			}
			.tab.active {
				background-color: rgba(28, 177, 255, 0.9);
			}
			.date-select-input {
				position: relative;
				top: 2px;
				margin-left: 20px;
				float: right;
				color: #1cb1ff;
				.ivu-input {
					font-size: 16px;
				}
			}
		}
		.chart {
			color: white;
			font-size: 20px;
			margin-top: 30px;
			.chartBox {
				background-color: rgba(15, 145, 255, 0.1);
				float: left;
				margin-left: 30px;
				&:nth-child(1){
					margin-left: 0px;
				}
				width: 525px;
				height: 452px;
				.title {
					line-height: 38px;
					height: 38px;
					width: 100%;
					padding-left: 15px;
					background-color: rgba(28, 177, 255, 0.4);
					i {
						width: 30px;
						height: 30px;
						display: inline-block;
						vertical-align: middle;
						margin-right: 10px;
					}
					i.pie {
						background: url(../../assets/image/alarm/chart-circle.png) no-repeat;
					}
					i.bar {
						background: url(../../assets/image/alarm/chart-bar.png) no-repeat;
					}
				}
				.info {
					text-align: center;
					margin-top: 80px;
					font-size: 70px;
					span {
						font-size: 20px;
					}
				}
				.legend {
					font-size: 16px;
					margin-top: 50px;
					div {
						float: left;
						margin-left: 120px;
						i {
							position: relative;
							top: 2px;
							background-size: 100% 100%;
							width: 16px;
							height: 16px;
							margin-right: 15px;
							display: inline-block;
						}
					}
					div:nth-child(1) {
						i {
							background: url(../../assets/image/alarm/point-blue.png) no-repeat;
						}
					}
					div:nth-child(2) {
						i {
							background: url(../../assets/image/alarm/point-green.png) no-repeat;
						}
					}
				}
				.rate {
					width: 400px;
					height: 70px;
					margin: 40px auto 0;
					text-align: center;
					position: relative;
					.txt {
						font-size: 15px;
					}
					.doPrecent {
						margin-top: 10px;
						height: 30px;
						background-color: #1669CE;
						position: absolute;
						left: 0px;
						bottom: 0;
						z-index: 10;
					}
					.tipBox {
						width: 130px;
						height: 54px;
						background: url(../../assets/image/alarm/tipBg.png) no-repeat;
						z-index: 100;
						position: absolute;
						bottom: 27px;
						font-size: 14px;
						padding-top: 5px;
						div {
							position: relative;
							text-align: left;
							padding-left: 30px;
						}
						i {
							position: absolute;
							left: 8px;
							top: 4px;
							background: url(../../assets/image/alarm/point-blue.png) no-repeat;
							background-size: 100% 100%;
							width: 12px;
							height: 12px;
							display: block;
						}
					}
					.doPrecent:hover+.tipDoPrecent {
						display: block;
					}
					.tipDoPrecent {
						display: none;
						left: 30px;
						i {
							position: absolute;
							left: 8px;
							top: 4px;
							background: url(../../assets/image/alarm/point-blue.png) no-repeat;
							background-size: 100% 100%;
							width: 12px;
							height: 12px;
							display: block;
						}
					}
					.unDoPrecent {
						margin-top: 10px;
						width: 400px;
						height: 30px;
						background-color: #17CEB0;
						position: absolute;
						left: 0px;
						bottom: 0;
					}
					.unDoPrecent:hover+.tipUnDoPrecent {
						display: block;
					}
					.tipUnDoPrecent {
						display: none;
						left: 240px;
						i {
							position: absolute;
							left: 8px;
							top: 4px;
							background: url(../../assets/image/alarm/point-green.png) no-repeat;
							background-size: 100% 100%;
							width: 12px;
							height: 12px;
							display: block;
						}
					}
				}
				.chartPieType {
					width: 525px;
					height: 314px;
				}
				.chartTypeBox{
					height: 416px;
				}
				.tip {
					width: 525px;
					width: 455px \9\0;
					height: 100px;
					margin:0 auto;
					display: flex;
					justify-content: space-around;
					
					display: -ms-flexbox;
					-ms-flex-pack: justify;
				
					.item {
						font-size: 14px;
						float: left;
						display: flex;
						justify-content: flex-start;
						flex-direction: column;
						align-items: center;
						
						display: -ms-flexbox;
						-ms-flex-pack: start;
						-ms-flex-align: center;
						-ms-flex-direction: column;
					
						span {
							font-size: 22px;
						}
						.colorBg {
							text-align: center;
							width: 80px;
							height: 23px;
							line-height: 23px;
							border-radius: 10px;
						}
						.color1 {
							background-color: #FC484B;
						}
						.color2 {
							background-color: #E86E2B;
						}
						.color3 {
							background-color: #E8DD2B;
						}
						.color4 {
							background-color: #2BA8E8;
						}
					}
				}
			}
		}
	}
</style>