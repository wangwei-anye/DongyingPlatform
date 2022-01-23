<template>
	<div ref='chartId' class="chartBar"></div>
</template>

<script>
	import echarts from 'echarts'
	export default {
		name: 'ChartBar',
		props: {
			dataArr: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		data() {
			return {}
		},
		methods: {
			setChart: function() {
				var chart_pie = echarts.init(this.$refs.chartId);
				var option = {
					color: this.dataArr.colorArr,
					series: [{
						name: '类别占比',
						type: 'pie',
						radius: this.dataArr.radius,
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center',
								formatter: "{b}\n{c}\n({d}%)"
							},
							emphasis: {
								show: true,
								textStyle: {
									fontSize: '22',
									fontWeight: 'normal'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: this.dataArr.data
					}]
				};
				if(this.dataArr.legendArr) {
					option.legend = {
						orient: 'vertical',
						x: 'left',
						data: this.dataArr.legendArr,
						textStyle: {
							color: '#fff'
						}
					}
				}
				chart_pie.setOption(option);
			}
		},
		mounted: function() {
			this.setChart();
		},
		watch: {
			'dataArr': function(culVal, oldVal) {
				this.setChart();
			}
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.chartBar {
		width: 100%;
		height: 100%;
	}
</style>