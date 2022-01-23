<template>
	<div class="chartSpecialPerson">
		<v-Label switchAble :tabArr=tabArr :activeIndex=0 @switchTabIndex='switchTabIndex' class='label'></v-Label>
		<v-chartBar  :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vLabel from '@/components/Label'
	import vChartBar from '@/components/chart/ChartBar'
	export default {
		name: 'ChartSpecialPerson',
		props: {},
		components: {
			vLabel,
			vChartBar
		},
		data() {
			return {
				tabArr: ['实时', '周', '月'],
				chartBarDataArr: { //柱状图 折线图 数据
					xDataArr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', ],
					legendArr: ['巡更次数', '合格率'], //需要提示的标签
					yDataArr: [{
							name: '合格率',
							type: 'line',
							yAxisIndex: 1,
							symbol: 'circle',
							symbolColor: '#ffe116', //线条颜色
							data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
							areaStyle: [], //无色,
						},
						{
							name: '巡更次数',
							type: 'bar',
							yAxisIndex: 0,
							data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
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
				}
			}
		},
		methods: {
			switchTabIndex: function() {

			}
		},
		mounted: function() {}
	}
</script>
<style lang="scss" scoped="scoped">
	.chartSpecialPerson {
		width: 100%;
		height: 100%;
		position: relative;
		.label {
			position: absolute;
			top: 8px;
			left: 10px;
		}
		.chartbar {
			position: absolute;
			top: 16px;
			height: 95%;
			width: 100%;
		}
	}
</style>