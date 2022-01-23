<template>
	<div>
		<div class="echarts"></div>
	</div>
</template>
<script>
	import echarts from 'echarts/lib/echarts'
	import 'echarts/lib/chart/pie'
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/legend'
	export default {
		name: 'iAlarm',
		props: {
			dataArr: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		data() {
			return {
				pie: null,
				list: [{
						value: 0,
						name: '红色告警',
						color: '#ff4444'
					},
					{
						value: 0,
						name: '橙色告警',
						color: '#ff4f00'
					},
					{
						value: 0,
						name: '黄色告警',
						color: '#ffae00'
					},
					{
						value: 0,
						name: '蓝色告警',
						color: '#007eff'
					}
				],
			}
		},
		methods: {
			initOption() {
				const legendData = this.list.map(item => item.name)
				const colorData = this.list.map(item => item.color)
				const seriesData = this.list.map(item => {
					return {
						value: item.value,
						name: item.name
					}
				})
				return {
					series: [{
						name: '告警等级',
						type: 'pie',
						radius: ['70%', '85%'],
						hoverOffset: 5,
						color: colorData,
						data: seriesData,
						avoidLabelOverlap: false,
						silent: true,
						label: {
							normal: {
								show: false,
								position: 'center',
								// formatter: '{p|{d}}%\n{b}',
								formatter: function(params) {
									var percent = params.percent.toFixed(2);
									var text = params.name;
									return '{p|' + percent + '}%\n' + text;
								},
								fontSize: 16,
								color: '#fff',
								rich: {
									p: {
										fontSize: 25,
										color: '#fff'
									}
								}
							},
							emphasis: {
								show: true
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				}
			},
			animate() {
				let dataIndex = -1
				let len = this.list.length
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					this.pie.dispatchAction({
						type: 'downplay',
						seriesIndex: 0,
						dataIndex
					})
					dataIndex = (dataIndex + 1) % len
					this.pie.dispatchAction({
						type: 'highlight',
						seriesIndex: 0,
						dataIndex
					})
				}, 1500)
			}
		},
		mounted() {
			this.list[0].value = this.dataArr.first_degree;
			this.list[1].value = this.dataArr.second_degree;
			this.list[2].value = this.dataArr.third_degree;
			this.list[3].value = this.dataArr.fourth_degree;
			this.pie = echarts.init(this.$el.querySelector('.echarts'));
			this.pie.setOption(this.initOption(this.list), true);
			this.animate();
		},
		watch: {
			dataArr(val, oldVal) {
				this.list[0].value = val.first_degree;
				this.list[1].value = val.second_degree;
				this.list[2].value = val.third_degree;
				this.list[3].value = val.fourth_degree;
				this.pie = echarts.init(this.$el.querySelector('.echarts'));
				this.pie.setOption(this.initOption(this.list), true);
				this.animate();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.echarts {
		width: 120px;
		height: 130px;
		margin: 0 auto;
	}
</style>