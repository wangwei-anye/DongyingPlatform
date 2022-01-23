<template>
	<v-chart-box hrefto="index/trip" boxType='polygon' iconName='vistor' :w="355" :h="301" boxTitle="访客数据">
		<div class="chartVistor">
			<v-Label switchAble :tabArr=tabArr :activeIndex=0 @switchTabIndex='switchTabIndex' class='label'></v-Label>
			<v-chartBar :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
		</div>
	</v-chart-box>
</template>
<script>
	import $ from 'jquery'
	import vLabel from '@/components/Label'
	import vChartBar from '@/components/chart/ChartBar'
	import vChartBox from '@/components/ChartBox'
	import { formatTime } from '@/utils/util'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('platform')

	export default {
		name: 'ChartVistor',
		props: {},
		components: {
			vLabel,
			vChartBar,
			vChartBox
		},
		data() {
			return {
				tabArr: ['实时', '周'],
			}
		},
		computed: {
			chartBarDataArr: function() {
				var xArr = [];
				var yArr = [];
				var rateArr = [];
				var axisLabelInterval = 0;
				var selectArr = [];
				if(this.vistor_tabIndex == 0) {
					selectArr = this.vistorList;
					for(var i = 0; i < selectArr.length; i++) {
						for(var item in selectArr[i]) {
							xArr.push(item.split(' ')[1]);
							yArr.push(selectArr[i][item]);
						}
					}
				} else if(this.vistor_tabIndex == 1) {
					selectArr = this.vistorWeekList;
					for(var i = 0; i < selectArr.length; i++) {
						for(var item in selectArr[i]) {
							xArr.push(item);
							yArr.push(selectArr[i][item]);
						}
					}
				}

				if(this.vistor_tabIndex == 0 && xArr.length <= 8) {
					axisLabelInterval = 0;
				} else if(this.vistor_tabIndex == 0 && xArr.length <= 16) {
					axisLabelInterval = 1;
				} else if(this.vistor_tabIndex == 0){
					axisLabelInterval = 2;
				} else{
					axisLabelInterval = 1;
				}

				var obj = { //柱状图 折线图 数据
					xDataArr: xArr,
					axisLabelInterval: axisLabelInterval,
					yDataArr: [{
						name: '人数',
						type: 'bar',
						yAxisIndex: 0,
						data: yArr,
						labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
						itemStyle: ['#019dff'] //同上
					}],
					yAxis: [{
						name: '人数',
						formatter: '{value}',
					}]
				};
				return obj;
			},
			...mapGetters([]),
			...mapState([
				'vistor_tabIndex',
				'vistorList',
				'vistorWeekList'
			])
		},
		methods: {
			switchTabIndex: function(index) {
				this.updateVistorTabIndex(index);
			},
			...mapMutations({
				updateVistorTabIndex: 'UPDATE_VISTOR_TAB_INDEX'
			}),
			...mapActions([
				'getVistor',
			]),
		},
		mounted: function() {
			this.getVistor(1);
			this.getVistor(2);
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.chartVistor {
		width: 100%;
		height: 100%;
		position: relative;
		.label {
			position: absolute;
			top: 8px;
			left: 10px;
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