<template>
	<div class="securityMap">
		<div class="map">
			<iframe class="mapIframe"  width="100%" height="100%" marginheight="0" marginwidth="0" style="border:none; overflow:hidden">
		    </iframe>
		</div>
		<div class="chartBox">
			<v-chartBar  :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
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
	} = createNamespacedHelpers('security')
	
	export default {
		name: 'SecurityMap',
		props: {
		},
		components: {
			vChartBar
		},
		data() {
			return {
			}
		},
		computed: {
			chartBarDataArr: function(){
				var xArr = [];
				var yArr = [];
				for (var e in this.percentMap) {
					xArr.push(e);
					yArr.push(this.percentMap[e]);
				}
				var obj = { //柱状图 折线图 数据
					gridLeft:120,
					gridRight:80,
					isXchangeY: true,
					xDataArr: xArr,
					xAxisLabel:{
						color: '#00d1fe',
						fontWeight: 100,
						fontSize: 14,
					},
					xPosition: 'top',
					legendArr: [], //需要提示的标签
					yDataArr: [{
						name: '合格率',
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
						axisLabel:{
							color: '#fff',
							fontWeight: 100,
							fontSize: 20,
						}
					}]
				};
				return obj;
			},
			...mapGetters([
			]),
			...mapState([
				'percentMap',
				'mapCodeStr'
			])
		},
		methods: {
			...mapMutations([]),
			...mapActions([
				'getPercent',
				'initMap'
			])
		},
		mounted: function() {
//			this.getPercent();
			var that = this;
			this.initMap().then(function(){
				$(".mapIframe").attr('src', "static/map/xungengmap.html?" + that.mapCodeStr);
			});
		},
		watch: {
			'mapCodeStr': function(curVal, oldVal) {
				$(".mapIframe").attr('src', "static/map/xungengmap.html?" + curVal);
			},
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.securityMap {
		width: 100%;
		color: #3DA9FF;
		height: 815px;
		.map{
			pointer-events: none;
			width: 807px;
			height: 772px;
			box-sizing: border-box;
			float: left;
		}
		.chartBox {
			width: 807px;
			height: 772px;
			float: left;
			box-sizing: border-box;
		}
	}
</style>