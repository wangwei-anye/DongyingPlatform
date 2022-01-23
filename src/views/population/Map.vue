<template>
	<div class="houseMap">
		<div class="map">
			<div>
				经济开发区：<span>{{totalNum}}</span>户
			</div>
		</div>
		<div class="chartBox">
			<v-chartBar :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vChartBar from '@/components/chart/ChartBar'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('population')

	export default {
		name: 'houseMap',
		props: {},
		components: {
			vChartBar
		},
		data() {
			return {
				panelStyle: {
					'width': this.w + 'px'
				},
				totalNum:0
			}
		},
		computed: {
			chartBarDataArr() {
				var xArr = [];
				var yArr = [];
				var unitNumArr = [];
				var FlowPeopleArr = [];
				var residencePeopleArr = [];
				var totalNum = 0;
				for (var i = 0; i < this.distribution.length; i++) {
					xArr.push(this.distribution[i].name);
					yArr.push(this.distribution[i].people_count);
					totalNum += parseInt(this.distribution[i].people_count);
					unitNumArr.push(this.distribution[i].unit_count);
					FlowPeopleArr.push(this.distribution[i].flow_count);
					residencePeopleArr.push(this.distribution[i].residence_count);
				}
				this.totalNum = totalNum;
				var obj = {
					gridLeft: 120,
					gridRight: 80,
					isXchangeY: true,
					xDataArr: xArr,
					xAxisLabel: {
						color: '#00d1fe',
						fontWeight: 100,
						fontSize: 14,
					},
					xPosition: 'top',
					legendArr: [], //需要提示的标签
					toolTipFormatter: '{b}<br/>人口数量: {c0}<br/>小区数: {c1}<br/>流动人口数量: {c2}<br/>常住人口数量: {c3}',
					yDataArr: [{
						name: '人口数量',
						type: 'bar',
						yAxisIndex: 0,
						data: yArr,
						labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
						barBorderRadius: [0, 25, 25, 0], //（顺时针左上，右上，右下，左下）
						barGap: '-100%',
						itemStyle: [{
							offset: 0,
							color: '#54ddff'
						}, {
							offset: 1,
							color: '#3f65f7'
						}]
					},{
						name: '小区数',
						type: 'bar',
						yAxisIndex: 0,
						data: unitNumArr,
						labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
						barBorderRadius: [0, 25, 25, 0], //（顺时针左上，右上，右下，左下）
						barGap: '-100%',
						itemStyle: ["rgba(0,0,0,0)"]
					},{
						name: '流动人口数量',
						type: 'bar',
						yAxisIndex: 0,
						data: FlowPeopleArr,
						labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
						barBorderRadius: [0, 25, 25, 0], //（顺时针左上，右上，右下，左下）
						barGap: '-100%',
						itemStyle: ["rgba(0,0,0,0)"]
					},{
						name: '常住人口数量',
						type: 'bar',
						yAxisIndex: 0,
						data: residencePeopleArr,
						labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
						barBorderRadius: [0, 25, 25, 0], //（顺时针左上，右上，右下，左下）
						barGap: '-100%',
						itemStyle: ["rgba(0,0,0,0)"]
					}],
					yAxis: [{
						name: '',
						formatter: '{value}',
						splitLine: true,
						axisLabel: {
							color: '#fff',
							fontWeight: 100,
							fontSize: 20,
						}
					}]
				}
				return obj;
			},
			...mapState([
				'distribution',
				'mapCodeStr'
			])
		},
		methods: {
			...mapMutations([]),
			...mapActions([
				'getDistribution',
				'initMap'
			])
		},
		mounted: function() {
		},
		watch: {
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.houseMap {
		width: 100%;
		color: #3DA9FF;
		height: 360px;
		.map {
			pointer-events: none;
			width: 807px;
			height: 317px;
			box-sizing: border-box;
			float: left;
			div{
				margin-top: 118px;
				font-size: 38px;
				color: #009bfe;
				margin-left: 120px;
				span{
					color: #ffdd40;
					font-size: 60px;
				}
			}
		}
		.chartBox {
			width: 807px;
			height: 317px;
			float: left;
			box-sizing: border-box;
		}
	}
</style>