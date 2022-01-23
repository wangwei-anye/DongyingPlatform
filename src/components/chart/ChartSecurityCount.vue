<template>
	<div class="chartSecurityCount">
		<div class="time">时间：<span>{{timeTxt}}</span></div>
		<v-Label switchAble :tabArr=tabArr :activeIndex=0 @switchTabIndex='switchTabIndex' class='label'></v-Label>
		<v-chartBar :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vLabel from '@/components/Label'
	import vChartBar from '@/components/chart/ChartBar'
	import { formatTime } from '@/utils/util'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('security')

	export default {
		name: 'ChartSecurityCount',
		props: {},
		components: {
			vLabel,
			vChartBar
		},
		data() {
			return {
				tabArr: ['实时', '周', '月'],
				timeTxt: '00:00-24:00'
			}
		},
		computed: {
			chartBarDataArr: function() {
				var xArr = [];
				var totalNumArr = [];
				var rateArr = [];
				var selectArr = [];
				var axisLabelInterval = 0;
				if(this.tabIndex == 0) {
					selectArr = this.securityArr;
				} else if(this.tabIndex == 1) {
					selectArr = this.securityWeekArr;
				} else {
					selectArr = this.securityMonthArr;
				}
				for(var i = 0; i < selectArr.length; i++) {
					xArr.push(selectArr[i].time);
					totalNumArr.push(selectArr[i].completeNum);
					rateArr.push(selectArr[i].precent);
				}
				if(selectArr.length <= 8){
					axisLabelInterval = 0;
				}else if(selectArr.length <= 16){
					axisLabelInterval = 1;
				}else{
					axisLabelInterval = 2;
				}
				var obj = { //柱状图 折线图 数据
					xDataArr: xArr,
					axisLabelInterval: axisLabelInterval,
					legendArr: ['巡查次数', '合格率'], //需要提示的标签
					yDataArr: [{
							name: '合格率',
							type: 'line',
							yAxisIndex: 1,
							symbol: 'circle',
							symbolColor: '#ffe116', //线条颜色
							data: rateArr,
							areaStyle: [], //无色,
						},
						{
							name: '巡查次数',
							type: 'bar',
							yAxisIndex: 0,
							data: totalNumArr,
							labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
							itemStyle: ['#019dff'] //同上
						}
					],
					yAxis: [{
							name: '巡查次数',
							formatter: '{value}',
						},
						{
							name: '合格率',
							formatter: '{value} %',
						}
					]
				};
				return obj;
			},
			...mapGetters([
				'securityArr',
				'securityWeekArr',
				'securityMonthArr'
			]),
			...mapState([
				'tabIndex'
			])
		},
		methods: {
			switchTabIndex: function(index) {
				this.updateTabIndex(index);
				if(index == 0) {
					this.timeTxt = '00:00-24:00';
				} else if(index == 1) {
					var nowDate = new Date();
					var nowStr = formatTime(nowDate.getFullYear()) + "/" + formatTime(nowDate.getMonth() + 1) + "/" + formatTime(nowDate.getDate());
					nowDate.setDate(-7);
					var lastStr = formatTime(nowDate.getFullYear()) + "/" + formatTime(nowDate.getMonth() + 1) + "/" + formatTime(nowDate.getDate());
					this.timeTxt = lastStr + '-' + nowStr;
				} else {
					var nowDate = new Date();
					var nowStr = formatTime(nowDate.getFullYear()) + "/" + formatTime(nowDate.getMonth() + 1) + "/" + formatTime(nowDate.getDate());
					nowDate.setMonth(-1);
					var lastStr = formatTime(nowDate.getFullYear()) + "/" + formatTime(nowDate.getMonth() + 1) + "/" + formatTime(nowDate.getDate());
					this.timeTxt = lastStr + '-' + nowStr;
				}
			},
			...mapMutations([
				'updateTabIndex'
			]),
			...mapActions([
				'getSecurityData',
				'getSecurityWeekData',
				'getSecurityMonthData'
			])
		},
		mounted: function() {
//			var param = {
//				city_code: this.$store.state.searchBar.cityCode,
//				town_code: this.$store.state.searchBar.townCode,
//				township_code: this.$store.state.searchBar.townshipCode,
//				village_code: this.$store.state.searchBar.villageCode,
//				unit_id: this.$store.state.searchBar.unitId
//			};
//			this.getSecurityData(param);
//			this.getSecurityWeekData(param);
//			this.getSecurityMonthData(param);
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.chartSecurityCount {
		width: 100%;
		height: 100%;
		position: relative;
		.label {
			position: absolute;
			top: 8px;
			left: 250px;
			z-index: 999;
		}
		.chartbar {
			position: absolute;
			top: 16px;
			height: 95%;
			width: 100%;
		}
		.time {
			font-size: 16px;
			position: absolute;
			top: 12px;
			left: 20px;
			span {
				border: 1px solid #019DFF;
				color: #019DFF;
				border-radius: 8px;
				padding: 2px 4px;
			}
		}
	}
</style>