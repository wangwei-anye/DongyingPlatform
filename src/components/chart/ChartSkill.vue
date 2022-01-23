<template>
	<div class="chartSkill">
		<v-chartBar :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vLabel from '@/components/Label'
	import vChartBar from '@/components/chart/ChartBar'
	import { createNamespacedHelpers } from 'vuex'
	const {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('platform')

	export default {
		name: 'ChartSkill',
		props: {},
		components: {
			vLabel,
			vChartBar
		},
		data() {
			return {}
		},
		computed: {
			chartBarDataArr: function() {
				var xArr = [];
				var yArr = [];
				for(var i = 0; i < this.techDefence.length; i++) {
					xArr.push(this.techDefence[i].sysTemName);
					yArr.push(this.techDefence[i].number);
				}

				var obj = { //柱状图 折线图 数据
					xDataArr: xArr,
					gridTop: 40,
					gridBottom : 50,
					axisLabelLen : 4,
					axisLabelInterval:2,
					legendArr: [], //需要提示的标签
					max:100,
					yDataArr: [{
						name: '数量',
						type: 'bar',
						yAxisIndex: 0,
						data: yArr,
						labelPositon: 'top', //柱条文字 位置  '' 则没有  比如 top inside
						labelSize:10,
						barWidth:10,
						itemStyle: ['#019dff'] //同上
					}],
					yAxis: [{
						name: '',
						formatter: '{value}',
						splitLine: true
					}]
				};
				return obj;
			},
			...mapGetters([]),
			...mapState([
				'techDefence'
			]),
		},
		methods: {
			...mapMutations({
			}),
			...mapActions([
				'getTechDefence',
			]),
		},
		mounted: function() {
			this.getTechDefence();
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.chartSkill {
		width: 100%;
		height: 100%;
		position: relative;
		.chartbar {
			margin-top: 5%;
			height: 95%;
			width: 100%;
		}
	}
</style>