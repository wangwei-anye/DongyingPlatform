<template>
	<div class="chartSecurityPlatform">
		<v-Label switchAble :tabArr=tabArr :activeIndex=0 @switchTabIndex='switchTabIndex' class='label'></v-Label>
		<v-chartBar  :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vLabel from '@/components/Label'
	import vChartBar from '@/components/chart/ChartBar'
	import {formatTime} from '@/utils/util'
	import {province_code, city_code, city_name} from '@/config.js'
	
	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('security')
	
	export default {
		name: 'ChartSecurityPlatform',
		props: {},
		components: {
			vLabel,
			vChartBar
		},
		data() {
			return {
				tabIndex : 0,
				tabArr: ['实时', '周', '月'],
			}
		},
		computed: {
			chartBarDataArr: function(){
				var xArr = [];
				var totalNumArr = [];
				var rateArr = [];
				var selectArr = [];
				var axisLabelInterval = 0;
				if(this.tabIndex == 0){
					selectArr = this.securityArr;
				}else if(this.tabIndex == 1){
					selectArr = this.securityWeekArr;
				}else{
					selectArr = this.securityMonthArr;
				}
				for (var i = 0; i < selectArr.length; i++) {
					if(this.tabIndex == 2){
					    xArr.push(selectArr[i].time.substr(5,5));
					}else{
						xArr.push(selectArr[i].time);
					}
					
					totalNumArr.push(selectArr[i].completeNum);
					rateArr.push(selectArr[i].precent);
				}
				if(selectArr.length <= 6){
					axisLabelInterval = 0;
				}else if(selectArr.length <= 12){
					axisLabelInterval = 1;
				}else if(selectArr.length <= 18){
					axisLabelInterval = 2;
				}else{
					axisLabelInterval = 3;
				}
				var obj = { //柱状图 折线图 数据
					xDataArr: xArr,
					legendArr: ['巡查次数', '合格率'], //需要提示的标签
					axisLabelInterval:axisLabelInterval,
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
							barBorderRadius: [15, 15, 0, 0], //（顺时针左上，右上，右下，左下）
							itemStyle: [{
								offset: 0,
								color: '#54ddff'
							}, {
								offset: 1,
								color: '#3f65f7'
							}] //同上
						}
					],
					yAxis: [{
							name: '次数',
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
			])
		},
		methods: {
			switchTabIndex: function(index) {
				this.tabIndex = index;
				if(index == 0){
				}else if(index == 1){
					var nowDate = new Date();
					var nowStr = formatTime(nowDate.getFullYear())+"/"+formatTime(nowDate.getMonth()+1)+"/"+formatTime(nowDate.getDate());
					nowDate.setDate(-7);
					var lastStr = formatTime(nowDate.getFullYear())+"/"+formatTime(nowDate.getMonth()+1)+"/"+formatTime(nowDate.getDate());
				}else{
					var nowDate = new Date();
					var nowStr = formatTime(nowDate.getFullYear())+"/"+formatTime(nowDate.getMonth()+1)+"/"+formatTime(nowDate.getDate());
					nowDate.setMonth(-1);
					var lastStr = formatTime(nowDate.getFullYear())+"/"+formatTime(nowDate.getMonth()+1)+"/"+formatTime(nowDate.getDate());
				}
			},
			...mapMutations([]),
			...mapActions([
				'getSecurityData',
				'getSecurityWeekData',
				'getSecurityMonthData'
			])
		},
		mounted: function() {
			var param = {
				city_code: city_code,
				town_code: this.$store.state.platform.currentTownCode=='all'?'':this.$store.state.platform.currentTownCode,
				township_code: this.$store.state.platform.currentTownShipCode=='all'?'':this.$store.state.platform.currentTownShipCode,
				village_code: this.$store.state.platform.currentVillageCode=='all'?'':this.$store.state.platform.currentVillageCode,
				unit_id: this.$store.state.platform.currentUnitId=='all'?'':this.$store.state.platform.currentUnitId,
			};
			this.getSecurityData(param);
			this.getSecurityWeekData(param);
			this.getSecurityMonthData(param);
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.chartSecurityPlatform {
		width: 100%;
		height: 100%;
		position: relative;
		.label {
			position: absolute;
			top: 8px;
			left: 10px;
			z-index: 99;
		}
		.chartbar {
			position: absolute;
			top: 16px;
			height: 95%;
			width: 100%;
		}
	}
</style>