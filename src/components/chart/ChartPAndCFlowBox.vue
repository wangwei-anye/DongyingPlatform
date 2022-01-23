<template>
	<v-chart-box hrefto="/index/trip" boxType='polygon' iconName='volume_of_flow' :w="355" :h="301" boxTitle="实时人流量&车流量">
		<div class="chartPAndCFlow">
			<div class="txt">人流量：{{totalPeopleNum}} &nbsp;&nbsp;车流量：{{totalCarNum}}</div>
			<v-Label switchAble :tabArr=tabArr :activeIndex='activeIndex' @switchTabIndex='switchTabIndex' class='label'></v-Label>
			<v-chartBar :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
		</div>
	</v-chart-box>
</template>
<script>
	import $ from 'jquery'
	import vLabel from '@/components/Label'
	import vChartBar from '@/components/chart/ChartBar'
	import vChartBox from '@/components/ChartBox'
	
	import { createNamespacedHelpers } from 'vuex'
	const {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('platform')

	export default {
		name: 'ChartPAndCFlow',
		props: {},
		components: {
			vLabel,
			vChartBar,
			vChartBox
		},
		data() {
			return {
				tabArr: ['实时', '周', '月'],
				totalCarNum: 0,
				totalPeopleNum: 0,
				activeIndex: 0
			}
		},
		computed: {
			chartBarDataArr: function() {
				if(this.tabIndexGetter == -1) {
					return;
				}
				var xArr = [];
				var carInArr = [];
				var carOutArr = [];
				var peopleArr = [];
				var tempStr = "";
				var tempTypeStr = "";
				var tempTimeStr = "";
				var selectCarDataArr = [];
				var selectPeopleDataArr = [];
				var totalCar = 0;
				var totalPeople = 0;
				var axisLabelInterval = 0;
				this.activeIndex = this.tabIndexGetter;
				if(this.tabIndexGetter == 0) {
					selectCarDataArr = this.carFlowListGetter;
					selectPeopleDataArr = this.peopleFlowListGetter;
				} else if(this.tabIndexGetter == 1) {
					selectCarDataArr = this.carWeekFlowListGetter;
					selectPeopleDataArr = this.peopleWeekFlowListGetter;
				} else if(this.tabIndexGetter == 2) {
					selectCarDataArr = this.carMonthFlowListGetter;
					selectPeopleDataArr = this.peopleMonthFlowListGetter;
				}
				if(selectPeopleDataArr == null || selectCarDataArr == null) {
					return;
				}
				var e;
				for(var i = 0; i < selectCarDataArr.length; i++) {
					if(this.tabIndexGetter == 0) {
						for(e in selectCarDataArr[i]) {
							tempStr = e.split(" ")[1];
							tempTypeStr = tempStr.split(":")[1];
							tempTimeStr = tempStr.split(":")[0];
							if(tempTypeStr == '1') {
								xArr.push(tempTimeStr + ":00");
								carOutArr.push(selectCarDataArr[i][e]);
							} else {
								carInArr.push(selectCarDataArr[i][e]);
							}
						}
					} else {
						for(e in selectCarDataArr[i]) {
							tempTypeStr = e.split(":")[1];
							tempTimeStr = e.split(":")[0];
							//							tempTimeStr = tempTimeStr.split("-")[2];
							if(tempTypeStr == '1') {
								xArr.push(tempTimeStr);
								carOutArr.push(selectCarDataArr[i][e]);
							} else {
								carInArr.push(selectCarDataArr[i][e]);
							}
						}

					}
				}
				for(var i = 0; i < carOutArr.length; i++) {
					carOutArr[i] += parseInt(carInArr[i]);
					totalCar += parseInt(carOutArr[i]);
				}
				for(var i = 0; i < selectPeopleDataArr.length; i++) {
					for(var e in selectPeopleDataArr[i]) {
						peopleArr.push(selectPeopleDataArr[i][e]);
						totalPeople += parseInt(selectPeopleDataArr[i][e]);
					}
				}

				if(selectCarDataArr.length <= 8) {
					axisLabelInterval = 0;
				} else if(selectCarDataArr.length <= 16) {
					axisLabelInterval = 1;
				} else {
					axisLabelInterval = 3;
				}

				this.totalCarNum = totalCar;
				this.totalPeopleNum = totalPeople;
				var obj = { //柱状图 折线图 数据
					xDataArr: xArr,
					gridBottom: 20,
					gridLeft: 25,
					gridTop: 28,
					axisLabelLen: 5,
					legendArr: ['人流量', '车流量'], //需要提示的标签
					axisLabelInterval: axisLabelInterval,
					yDataArr: [{
							name: '人流量',
							type: 'line',
							yAxisIndex: 0, //这个数据对应的 坐标  0为左边  1为右边
							data: peopleArr,
							symbol: 'none', //节点形状
							symbolColor: '#ff7815', //线条颜色
							areaStyle: [{
								offset: 0,
								color: '#ff7815'
							}, {
								offset: 1,
								color: '#ffffff'
							}] //渐变色
						},
						{
							name: '车流量',
							type: 'line',
							yAxisIndex: 0,
							symbol: 'none',
							symbolColor: '#00c6ff', //线条颜色
							data: carOutArr,
							labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
							areaStyle: [{
								offset: 0,
								color: '#00c6ff'
							}, {
								offset: 1,
								color: '#ffffff'
							}] //渐变色
						}
					],
					yAxis: [{
						name: '数量',
						formatter: '{value}',
						splitLine: true
					}]
				};
				return obj;
			},
			...mapGetters([
				'carFlowListGetter',
				'peopleFlowListGetter',
				'carWeekFlowListGetter',
				'peopleWeekFlowListGetter',
				'carMonthFlowListGetter',
				'peopleMonthFlowListGetter',
				'tabIndexGetter'
			]),
			...mapState([]),
		},
		methods: {
			switchTabIndex: function(index) {
				this.updateTabIndex(index);
			},
			...mapMutations({
				updateTabIndex: 'UPDATE_TAB_INDEX'
			}),
			...mapActions([
				'getCarFlow',
				'getPeopleFlow'
			]),
		},
		mounted: function() {
			this.getCarFlow(1);
			this.getPeopleFlow(1);
			this.getCarFlow(2);
			this.getPeopleFlow(2);
			this.getCarFlow(3);
			this.getPeopleFlow(3);
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.chartPAndCFlow {
		width: 100%;
		height: 100%;
		position: relative;
		.txt {
			color: #fff;
			line-height: 40px;
			text-align: right;
			margin-right: 12px;
		}
		.label {
			position: absolute;
			top: 30px;
			left: 5px;
			z-index: 1;
		}
		.chartbar {
			margin-top: 25px;
			height: 68%;
			width: 100%;
		}
	}
</style>