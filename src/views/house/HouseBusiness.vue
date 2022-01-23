<template>
	<div class="houseBusiness">
		<div class="chartBox">
			<v-chartBar  :dataArr=chartBarDataArr></v-chartBar>
		</div>
		<div style="clear: both;"></div>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vChartBar from '@/components/chart/ChartBar'
	
	import { createNamespacedHelpers } from 'vuex'
	const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('house')
	
	
	export default {
		name: 'HouseBusiness',
		props: {
		},
		components: {
			vChartBar,
		},
		data() {
			return {
			}
		},
		computed: {
			chartBarDataArr:function(){
				var xArr = [];
				var yArr = [];
				for(var e in this.houseBusiness.sy){
					xArr.push(e);
					yArr.push(this.houseBusiness.sy[e]);
				}
				var obj = {
					xDataArr: xArr,
					axisLabelLen : 6,
					gridBottom : 40,
					xPosition: 'top',
					yDataArr: [{
						name: '数量',
						type: 'bar',
						yAxisIndex: 0,
						data: yArr,
						labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
						itemStyle: ['#ff6000']
					}],
					yAxis: [{
						name: '数量',
						formatter: '{value}',
						splitLine: true,
					}]
				}
				return obj;
			},
			...mapState([
				'houseBusiness',
			]),
			...mapGetters([
			])
		},
		methods: {
			...mapMutations([
			]),
			...mapActions([
				'getHouseBusiness',
			])
		},
		mounted: function() {
//			this.getHouseBusiness();
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.houseBusiness {
		padding: 30px 0;
		color: #3DA9FF;
		width: 100%;
		.chartBox {
			margin: 0 auto;
			width: 1420px;
			height: 430px;
			box-sizing: border-box;
		}
	}
</style>