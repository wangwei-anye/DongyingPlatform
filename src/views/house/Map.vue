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
	} = createNamespacedHelpers('house')

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
				var precentArr = [];
				var unitNumArr = [];
				var totalNum = 0;
				for(var e in this.houseMap.hs) {
					xArr.push(e);
					yArr.push(this.houseMap.hs[e]);
					totalNum += parseInt(this.houseMap.hs[e]);
					precentArr.push(parseFloat(this.houseMap.rzRate[e] * 100).toFixed(2));
					unitNumArr.push(this.houseMap.xqs[e]);
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
					toolTipFormatter: '{b}<br/>小区户数: {c0}<br/>小区数: {c1}<br/>入住率: {c2}%',
					yDataArr: [{
						name: '小区户数',
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
					}, {
						name: '小区数',
						type: 'bar',
						yAxisIndex: 0,
						data: unitNumArr,
						labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
						barBorderRadius: [0, 25, 25, 0], //（顺时针左上，右上，右下，左下）
						barGap: '-100%',
						itemStyle: ["rgba(0,0,0,0)"]
					}, {
						name: '入住率',
						type: 'bar',
						yAxisIndex: 0,
						data: precentArr,
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
				'houseMap',
				'mapCodeStr'
			])
		},
		methods: {
			...mapMutations([]),
			...mapActions([
				'getEstateMap',
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