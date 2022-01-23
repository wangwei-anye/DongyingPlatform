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
		watch: {
			'dataArr': function(culVal, oldVal) {
				this.setChart();
			}
		},
		mounted: function() {
			this.setChart();
		},
		methods: {
			setChart: function() {
				if(!this.dataArr.hasOwnProperty('yDataArr')) {
					return;
				}
				var axisLabelLen = this.dataArr.axisLabelLen;
				var seriesArr = [];
				for(let i = 0; i < this.dataArr.yDataArr.length; i++) {
					if(this.dataArr.yDataArr[i].type == 'line') {
						seriesArr.push({
							name: this.dataArr.yDataArr[i].name,
							type: this.dataArr.yDataArr[i].type,
							yAxisIndex: this.dataArr.yDataArr[i].yAxisIndex,
							data: this.dataArr.yDataArr[i].data,
							symbol: this.dataArr.yDataArr[i].symbol,
							smooth: true,
							itemStyle: {
								normal: {
									color: this.dataArr.yDataArr[i].symbolColor ? this.dataArr.yDataArr[i].symbolColor : "#fff", //节点颜色
								}
							},
							lineStyle: {
								normal: {
									width: 1, //连线粗细
									color: this.dataArr.yDataArr[i].symbolColor ? this.dataArr.yDataArr[i].symbolColor : "#fff" //连线颜色
								}
							},
						});
						if(this.dataArr.yDataArr[i].areaStyle.length == 1) {
							seriesArr[seriesArr.length - 1].areaStyle = {
								normal: {
									color: this.dataArr.yDataArr[i].areaStyle[0]
								}
							}
						} else if(this.dataArr.yDataArr[i].areaStyle.length > 1) {
							seriesArr[seriesArr.length - 1].areaStyle = {
								normal: {
									color: new echarts.graphic.LinearGradient(0, 0, 0, 1, this.dataArr.yDataArr[i].areaStyle)
								}
							}
						}
					} else if(this.dataArr.yDataArr[i].type == 'bar') {
						seriesArr.push({
							name: this.dataArr.yDataArr[i].name,
							type: this.dataArr.yDataArr[i].type,
							data: this.dataArr.yDataArr[i].data,
							barWidth: this.dataArr.yDataArr[i].barWidth ? '' : 20,
							label: this.dataArr.yDataArr[i].labelPositon == '' ? {} : {
								normal: {
									show: true,
									position: this.dataArr.yDataArr[i].labelPositon,
									color: this.dataArr.yDataArr[i].labelColor ? this.dataArr.yDataArr[i].labelColor : "#ccc",
									fontSize: this.dataArr.yDataArr[i].labelSize ? this.dataArr.yDataArr[i].labelSize : 15
								}
							},
							lineStyle: {
								normal: {
									width: 1, //连线粗细
									color: "#ccc" //连线颜色
								}
							},
							itemStyle: {
								normal: {
									barBorderRadius: this.dataArr.yDataArr[i].barBorderRadius ? this.dataArr.yDataArr[i].barBorderRadius : [0, 0, 0, 0], //（顺时针左上，右上，右下，左下）
								}
							}
						});
						if(this.dataArr.yDataArr[i].itemStyle.length == 1) {
							seriesArr[seriesArr.length - 1].itemStyle.normal.color = this.dataArr.yDataArr[i].itemStyle[0];
						} else if(this.dataArr.yDataArr[i].itemStyle.length > 1) {
							if(this.dataArr.isXchangeY) {
								seriesArr[seriesArr.length - 1].itemStyle.normal.color = new echarts.graphic.LinearGradient(1, 0, 0, 0, this.dataArr.yDataArr[i].itemStyle);
							} else {
								seriesArr[seriesArr.length - 1].itemStyle.normal.color = new echarts.graphic.LinearGradient(0, 0, 0, 1, this.dataArr.yDataArr[i].itemStyle);
							}
						}
						if(this.dataArr.yDataArr[i].barGap){
							seriesArr[seriesArr.length - 1].barGap = this.dataArr.yDataArr[i].barGap;
						}
					}
				}
				
				var maxSplitNumber = 1;
				for(let i = 0; i < this.dataArr.yDataArr.length; i++) {
					for (var j = 0; j < this.dataArr.yDataArr[i].data.length; j++) {
						maxSplitNumber = Math.max(this.dataArr.yDataArr[i].data[j],maxSplitNumber);
					}
				}
				if(maxSplitNumber > 5){
					maxSplitNumber = 5;
				}

				var yAxisArr = [];
				for(let i = 0; i < this.dataArr.yAxis.length; i++) {
					yAxisArr.push({
						type: 'value',
						name: this.dataArr.yAxis[i].name,
						splitNumber: maxSplitNumber,
						axisLabel: {
							formatter: this.dataArr.yAxis[i].formatter,
							textStyle: this.dataArr.yAxis[i].axisLabel ? this.dataArr.yAxis[i].axisLabel : {
								color: '#ccc',
								fontWeight: 50,
								fontSize: 10,
							}
						},
						axisLine: {
							show: true,
							onZero: true,
							lineStyle: {
								color: '#ccc',
							},
							textStyle: {
								color: '#ccc',
								fontWeight: 100,
								fontSize: 12,
							}
						},
						splitLine: {
							show: this.dataArr.yAxis[i].splitLine ? this.dataArr.yAxis[i].splitLine : false,
							lineStyle: {
								color: 'rgba(255,255,255,0.5)',
								width: 1,
								type: 'dashed'
							},
						},
					});
					if(this.dataArr.max){
						yAxisArr[yAxisArr.length-1].max = function(value) {
						  return value.max > 100 ? 100 : value.max
						}
					}
				}
				var chart_bar = echarts.init(this.$refs.chartId);
				var xAxisArr = [{
					type: 'category',
					data: this.dataArr.xDataArr,
					axisPointer: {
						type: 'shadow'
					},
					axisLine: {
						show: true,
						onZero: true,
						lineStyle: {
							color: '#ccc',
						}
					},
					axisLabel: {
						interval: this.dataArr.axisLabelInterval ? this.dataArr.axisLabelInterval : 0,
						rotate: this.dataArr.rotate ? this.dataArr.rotate : 0,
						textStyle: this.dataArr.xAxisLabel ? this.dataArr.xAxisLabel : {
							color: '#ccc',
							fontWeight: 100,
							fontSize: 12,
						},
						formatter: function(value, index) {
							var len = axisLabelLen ? axisLabelLen : 100;
							if(value.length > len) {
								return value.substr(0, len) + '\n' + value.substr(len)
							} else {
								return value
							}
						}
					}
				}];
				if(this.dataArr.isXchangeY) {
					var temp = xAxisArr;
					xAxisArr = yAxisArr;
					yAxisArr = temp;
					xAxisArr[0].position = this.dataArr.xPosition ? this.dataArr.xPosition : 'bottom';
				}

				var option = {
					grid: {
						top: this.dataArr.gridTop ? this.dataArr.gridTop : 50,
						bottom: this.dataArr.gridBottom ? this.dataArr.gridBottom : 30,
						left: this.dataArr.gridLeft ? this.dataArr.gridLeft : 40,
						right: this.dataArr.gridRight ? this.dataArr.gridRight : (this.dataArr.yAxis.length == 1 ? 10 : 40),
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'item'
						},
						formatter:this.dataArr.toolTipFormatter ? this.dataArr.toolTipFormatter : "",
					},
					legend: {
						data: this.dataArr.legendArr,
						right: '10',
						top: '-5',
						textStyle: {
							color: '#fff',
							fontWeight: 100,
							fontSize: 12,
						}
					},
					xAxis: xAxisArr,
					yAxis: yAxisArr,
					series: seriesArr
				};
				chart_bar.setOption(option);
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