<template>
	<div class="force">
		<div ref='forceCanvas' class="forceCanvas" style="width: 1275px;height: 371px;"></div>
	</div>
</template>
<script>
	import $ from 'jquery'
	import echarts from 'echarts'

	export default {
		name: 'Force',
		props: {
			data: {
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
			setData: function(data) {
				$(".force").hide();
				setTimeout(function(){
					$(".force").show();
				},1000);
				var nodes = data.nodes;
				var edges = data.edges;
				for(var i = 0; i < nodes.length; i++) {
					nodes[i].category = '1';
					nodes[i].symbolSize = '80';
					nodes[i].ignore = true;
					nodes[i].flag = true;
					nodes[i].itemStyle = {
						normal:{
							color:'#1BB1FE'
						}
					}
					
				}
				var myChart = echarts.init(this.$refs.forceCanvas, "macarons");
				var option = {
					series: [{
						itemStyle: {
							normal: {
								label: {
									position: 'top',
									show: true,
									textStyle: {
										color: '#fff'
									}
								},
							},
						},
						force: {
							initLayout: 'circular', //初始布局
							repulsion: 2110, //斥力大小
						},
						draggable : false,
						animation: false,
						name: "",
						type: 'graph', //关系图类型
						layout: 'force', //引力布局
						roam: 'move', //可以拖动
						slient:true,
						useWorker: false,
						minRadius: 135,
						maxRadius: 165,
						scaling: 1.7,
						nodes: nodes,
						edges:edges
					}]
				}
				myChart.setOption(option);
			}
		},
		watch: {
			'data':function(curVal,oldVal){
				this.setData(curVal);
			}
		},
		mounted: function() {
			this.setData(this.data);
		}

	}
</script>
<style lang="scss" scoped="scoped">
	.force {
		.forceCanvas {
			margin: 0 auto;
		}
	}
</style>