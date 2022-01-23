<template>
	<div class="alarmMapAddress">
		<div class="map">
			<iframe class="mapIframe" width="100%" height="100%" marginheight="0" marginwidth="0" style="border:none; overflow:hidden">
		   </iframe>
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
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('alarm')

	export default {
		name: 'AlarmMapAddress',
		props: {},
		components: {
			vChartBar
		},
		data() {
			return {
				panelStyle: {
					'width': this.w + 'px'
				},
			}
		},
		computed: {
			chartBarDataArr() {
				var xArr = [];
				var yArr = [];
				for (var i = 0; i < this.alarmMap.length; i++) {
					xArr.push(this.alarmMap[i].address);
					yArr.push(this.alarmMap[i].num);
				}
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
					yDataArr: [{
						name: '警情数',
						type: 'bar',
						yAxisIndex: 0,
						data: yArr,
						labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
						barBorderRadius: [0, 15, 15, 0], //（顺时针左上，右上，右下，左下）
						itemStyle: [{
							offset: 0,
							color: '#54ddff'
						}, {
							offset: 1,
							color: '#3f65f7'
						}]
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
			...mapGetters([
				'mapCodeStr',
			]),
			...mapState([
				'alarmMap',
				'changeMapParamFlag'
			])
		},
		methods: {
			...mapMutations([]),
			...mapActions([
				'initMap'
			])
		},
		mounted: function() {
			$(".mapIframe").attr('src', "static/map/areamap.html?" + this.mapCodeStr);
		},
		watch: {
			'changeMapParamFlag': function(curVal, oldVal) {
				$(".mapIframe").attr('src', "static/map/areamap.html?" + this.mapCodeStr);
			},
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.alarmMapAddress {
		width: 1634px;
		color: #3DA9FF;
		height: 820px;
		background-color: rgba(15, 145, 255, 0.1);
		.map {
			pointer-events: none;
			width: 808px;
			height: 820px;
			box-sizing: border-box;
			float: left;
		}
		.chartBox {
			width: 808px;
			height: 820px;
			float: left;
			box-sizing: border-box;
		}
	}
</style>