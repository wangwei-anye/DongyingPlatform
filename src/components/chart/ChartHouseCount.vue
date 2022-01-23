<template>
	<div class="chartHouseCount">
		<v-Label switchAble :tabArr=tabArr :activeIndex=0 @switchTabIndex='switchTabIndex' class='label'></v-Label>
		<v-chartBar  :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vLabel from '@/components/Label'
	import vChartBar from '@/components/chart/ChartBar'
	
	
	import { createNamespacedHelpers } from 'vuex'
	const {mapState, mapMutations, mapActions} = createNamespacedHelpers('house')
	
	export default {
		name: 'ChartHouseCount',
		props: {},
		components: {
			vLabel,
			vChartBar
		},
		data() {
			return {
				tabArr: ['月', '半年', '年'],
				dateIndex:0
			}
		},
		computed: {
			chartBarDataArr() {
				var xArr = [];
				var yArr1 = [];
				var yArr2 = [];
				var selectArr = [];
				if(this.dateIndex == 0){
					selectArr = this.$store.state.house.houseDateState.mOccRate;
				}else if(this.dateIndex == 1){
					selectArr = this.$store.state.house.houseDateState.hyOccRate;
				}else if(this.dateIndex == 2){
					selectArr = this.$store.state.house.houseDateState.yOccRate;
				}
				for (var i = 0; i < selectArr.length; i++) {
					xArr.push(selectArr[i].time);
					yArr1.push(selectArr[i].occ);
					yArr2.push(selectArr[i].occrate);
				}
				var axisLabelInterval = 0;
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
					legendArr: ['入住率', '入住量'], //需要提示的标签
					yDataArr: [{
							name: '入住率',
							type: 'line',
							yAxisIndex: 1,
							symbol: 'circle',
							symbolColor: '#ffe116', //线条颜色
							data: yArr2,
							areaStyle: [], //无色,
						},
						{
							name: '入住量',
							type: 'bar',
							yAxisIndex: 0,
							data: yArr1,
							labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
							itemStyle: ['#019dff'] //同上
						}
					],
					yAxis: [{
							name: '入住率',
							formatter: '{value}',
						},
						{
							name: '入住量',
							formatter: '{value} %',
						}
					]
				}
				return obj;
			},
			...mapState([
				'houseDateState'
			])
		},
		methods: {
			...mapMutations([
			]),
			...mapActions([
				'getHouseDateState'
			]),
			switchTabIndex:function(index){
				this.dateIndex = index;
			}
		},
		mounted: function() {
//			this.getHouseDateState();
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.chartHouseCount {
		width: 100%;
		height: 100%;
		position: relative;
		.label {
			position: absolute;
			top: 8px;
			left: 30px;
			z-index: 999;
		}
		.chartbar {
			position: absolute;
			top: 16px;
			height: 95%;
			width: 100%;
		}
	}
</style>