<template>
	<div class="door-chart">
		<div class="door-chart-left">
			<img src="../../assets/image/kaimen.png" />
			<b>开门次数</b>
			<label>{{ doorcount }}</label>
		</div>
		<div class="door-chart-right"	>
			<v-Label switchAble :tabArr="tabArr" :activeIndex="activeIndex" @switchTabIndex='switchTabIndex' class='label'></v-Label>
			<div class="manflow-chart" id="manflow-chart"></div>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts'
  import vLabel from '@/components/Label'
  import axios from '../../utils/http.js'
	export default {
		name: 'DoorChart',
		components: {
			vLabel
		},
		props: ['params'],
		data () {
			return {
				tabArr: ['实时', '周', '月'],
				activeIndex: 0,
			  doorcount: '',
			  chart: null
			}
		},
		mounted () {
			// 人流量面积图
			this.chart = echarts.init(document.getElementById('manflow-chart'))
			this.chart.setOption({
		    title: {
		      text: '人流量',
		      textStyle: {
		        fontSize: 18,
		        color: '#fff'
		      },
		      left: 20
		    },
		    tooltip: {
		      trigger: 'axis',
		      formatter: '时间：{b}<br/>流量：{c0}',
		      axisPointer: {
		        type: 'line',
		        lineStyle: {
		          color: '#db6c45'
		        }
		      },
		      backgroundColor: '#db6c45'
		    },
		    grid: {
		      left: 15,
		      right: 30,
		      top: 40,
		      bottom: 0,
		      containLabel: true
		    },
		    xAxis : [
		      {
		        type: 'category',
		        axisTick: { show: false },
		        boundaryGap : false,
		        axisLine: {
		          lineStyle: {
		            color: '#fff',
		            width: 2
		          }
		        },
		        axisLabel: {
		          fontSize: 18,
		          color: '#fff'
		        },
		        data : []
		      }
		    ],
		    yAxis : [
		      {
		        type : 'value',
		        axisTick: { show: false },
		        axisLine: {
		          lineStyle: {
		            color: '#fff',
		            width: 2
		          }
		        },
		        axisLabel: {
		          interval: 1,
		          fontSize: 18,
		          color: '#fff'
		        },
		        splitLine: {
		          show: false
		        }
		      }
		    ],
		    series : [
		      {
		        type:'line',
		        smooth: true,
		        areaStyle: {
		          normal: {
		            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		              {
		                offset: 0,
		                color: '#258eb4'
		              },
		              {
		                offset: 1,
		                color: '#00c6ff'
		              }
		            ])
		          }
		        },
		        lineStyle: {
		          normal: {
		            color: '#fff',
		            width: 1
		          }
		        },
		        itemStyle: {
		          normal: {
		            borderColor: '#fff'
		          }
		        },
		        data:[]
		      }
		    ]
			})
		},
		methods: {
			switchTabIndex (index) {
				this.activeIndex = index
				this.$emit('doorcharttab')
			},
			// 获取今日人流量数据（实时统计）
			getDoorTotalCount (params) {
				axios.get('/door/dateCount.do' + params + '&groupType=1').then(response => {
					let totalcount = 0
					for (let i = 0; i < response.data.length; i++) {
						for (let key in response.data[i]) {
							totalcount += response.data[i][key]
						}						
					}
					this.doorcount = totalcount
				}).catch(err => {
					console.log('获取今日人流量数据（实时统计）失败')
				})
			},
			// 获取今日人流量数据（面积图）
			getDoorDateCount: function (params) {
				let groupType = '1'
				if (this.activeIndex == 1) {
					groupType = '2'
				} else if (this.activeIndex == 2) {
					groupType = '3'
				} else {
					groupType = '1'
				}
				let condition = params + '&groupType=' + groupType
				axios.get('/door/dateCount.do' + condition).then(response => {
					let timelist = [], countlist = []
					for (let i = 0; i < response.data.length; i++) {
						for (let key in response.data[i]) {
							if (this.doorgroup == '1' || this.doorgroup == '5') {
								timelist.push(key.substr(11, 2) + ':00')
							}
							else {
								timelist.push(key.substr(5, 5))
							}
							countlist.push(response.data[i][key])
						}						
					}
					this.chart.setOption({
				    xAxis : [
				      {
				        data: timelist
				      }
				    ],
				    yAxis: [
				    	{
				    		max: (parseInt(Math.max(...countlist) / 5) + 1) * 5
				    	}
				    ],
				    series : [
				      {
				        data: countlist
				      }
				    ]
					})
				}).catch(err => {
					console.log('获取今日人流量数据（面积图）失败')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.door-chart {
		display: flex; align-items: center; height: 750px; padding-right: 30px;
		.door-chart-left {
			display: flex; width: 480px; flex-direction: column; align-items: center;
    	b { display: inline-block; font-size: 18px; color: #57e1ff; margin-top: 10px; }
    	label { font-size: 48px; color: #fff; }
		}
		.door-chart-right {
			display: flex; flex: 1; height: 750px; flex-direction: column; align-items: center; justify-content: center;
			.manflow-chart {
				margin-top: 30px; width: 100%; height: 500px;
			}
		}
	}
</style>