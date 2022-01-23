<template>
	<div class="ranking">
		<TwoHeader title="小区安全指数"></TwoHeader>
		<div class="contentPage">
			<!-- 小区安全指数 -->
			<div class="estate-ranking">
				<v-panel  title="小区概况" :width="1890" class="v-panel">
					<div class='estate-ranking-title'>
			      <div class="estate-ranking-name"></div>
					</div>
					<div class="estate-ranking-detail">
						<div class="left-top1"></div><div class="left-top2"></div>
						<div class="right-top1"></div><div class="right-top2"></div>
						<div class="left-bottom1"></div><div class="left-bottom2"></div>
						<div class="right-bottom1"></div><div class="right-bottom2"></div>
						<div class="detail-container">
							<div class="detail-search">
								<div class="date-select">
									<label>时间</label>
									<DatePicker class="app-datepicker-travel" type="daterange" placement="bottom-start" :open="radaropen" :editable="false" confirm @on-change="radarHandleChange" @on-clear="radarHandleClear" @on-ok="radarHandleOk">
										<div class="date-container" @click="radarHandleClick">
											<input type="text" readonly="readonly" :value="radardate[0]">
											<span>至</span>
											<input type="text" readonly="readonly" :value="!radardate[0] ? radardate[0] : radardate[1]">
										</div>
									</DatePicker>
								</div>
								<v-Label switchAble :tabArr="tabArr" :activeIndex="radargroup" class="label" @switchTabIndex="selectRadarGroup">
								</v-Label>
							</div>
							<div class="detail-chart" id="raddr-chart"></div>
							<div class="detail-data">
								<Table class="stripe-table" :columns="columns" :data="data"></Table>
							</div>
						</div>
					</div>
					<div>&nbsp;</div>
				</v-panel>
			</div>
			<!-- 社区详情 -->
			<div class="estate-info">
				<v-panel :title="unitname" :width="1890" class="v-panel">
					<div class="estate-info-tab">
				    <Tabs :value="0" class="estate-ranking-tab" @on-click="selectTypeGroup">
			        <TabPane label="综合指数" name="0"></TabPane>
			        <TabPane label="案件" name="1"></TabPane>
			        <TabPane label="告警处理率" name="2"></TabPane>
<!-- 			        <TabPane label="巡更" name="3"></TabPane>
			        <TabPane label="三防" name="4"></TabPane> -->
			        <TabPane label="外来人员" name="5"></TabPane>
			        <TabPane label="重点人员" name="6"></TabPane>
				    </Tabs>
					</div>
					<div class="estate-info-tool">
						<div class="date-select">
							<label>时间</label>
							<div class="date-select-input">
								<DatePicker class="app-datepicker-travel" type="daterange" placement="bottom-start" :open="lineopen" :editable="false" confirm @on-change="lineHandleChange" @on-clear="lineHandleClear" @on-ok="lineHandleOk">
									<div class="date-container" @click="lineHandleClick">
										<input type="text" readonly="readonly" :value="linedate[0]">
										<span>至</span>
										<input type="text" readonly="readonly" :value="!linedate[0] ? linedate[0] : linedate[1]">
									</div>
								</DatePicker>
							</div>
						</div>
						<v-Label switchAble :tabArr="tabArr" :activeIndex="linegroup" class="label" @switchTabIndex="selectLineGroup">
						</v-Label>
					</div>
					<div class="estate-info-chart" id="estate-info-chart"></div>
				</v-panel>
			</div>
		</div>
	</div>
</template>

<script>
  import echarts from 'echarts'
  import TwoHeader from '@/components/section/TwoHeader.vue'
  import vPanel from '@/components/Panel'
  import vLabel from '@/components/Label'

  import axios from '../../utils/http.js'

	export default {
		name: 'ranking',
		components: {
			TwoHeader,
			vPanel,
			vLabel
		},
		data () {
			return {
				unitid: '',
				unitname: '',
				tabArr: ['实时', '周', '月'],
      	radaropen: false,
      	radardate: ['', ''],
				radargroup: 0,
      	lineopen: false,
      	linedate: ['', ''],
				typegroup: '0',
				linegroup: 0,
        columns: [
          { key: 'type', title: '类型' },
          { key: 'rank', title: '安全指数' },
          { 
            key: 'ratio', title: '综合环比',
            render: (h, params) => {
            	if (params.ratio) {
            		let isup = params.row.isup == 0 ? 'ivu-icon ivu-icon-arrow-up-c' : 'ivu-icon ivu-icon-arrow-down-c'
	              return h('label', [
	              	h('i', { 
	              		class: isup,
	              		style: { color: '#e8cb42', marginRight: '3px' }
	              	}, ''),
	              	h('span', params.row.ratio + '%')
	              ])            		
            	}
            	else {
            		return h('span', '')
            	}
            }
          }
        ],
        data: [],
        chart1: null,
        chart2: null
			}
		},
		mounted: function () {
			this.unitid = this.$route.query.unitid
			this.unitname = this.$route.query.unitname
			// 雷达图
			this.chart1 = echarts.init(document.getElementById('raddr-chart'))
			this.chart1.setOption({
		    radar: [
		      {
		        indicator: [
		          { text: '案件', max: 0 },
		          { text: '告警处理率', max: 0 },
		          // { text: '巡更', max: 0 },
		          // { text: '三防', max: 0 },
		          { text: '外来人员', max: 0 },
		          { text: '重点人员', max: 0 }
		        ],
		        center: ['50%', '50%'],
		        radius: '70%',
		        startAngle: 90,
		        splitNumber: 6,
		        shape: 'circle',
		        name: {
		          color:'#bce8ff',
		          fontSize: 18
		        },
		        splitArea: {
		          areaStyle: {
		            color: [
		              'rgba(44, 154, 178, 0.5)',
		              'rgba(44, 154, 178, 0.4)',
		              'rgba(44, 154, 178, 0.3)',
		              'rgba(44, 154, 178, 0.2)',
		              'rgba(44, 154, 178, 0.1)'
		            ]
		          }
		        },
		        axisLine: {
		          lineStyle: {
		            color: 'rgba(32, 105, 162, 1.0)'
		          }
		        },
		        splitLine: {
		          lineStyle: {
		            color: 'rgba(26, 82, 125, 1.0)',
		            type: 'solid'
		          }
		        }
		      }
		    ],
		    series: [
		      {
		        name: '雷达图',
		        type: 'radar',
		        data: [
		          {
		            value: [],
		            symbol: 'circle',
		            symbolSize: 1,
		            itemStyle: {
		              normal: {
		                color: '#8398ce'
		              }
		            },
		            lineStyle: {
		              normal: {
		                type: 'dashed',
		                color: '#8398ce'
		              }
		            },
		            areaStyle: {
		              normal: {
		                color: 'rgba(96, 0, 254, 0.25)'
		              }
		            },
		            label: {
		              normal: {
		                show: true,
		                formatter:function(params) {
		                  return params.value;
		                },
		                fontSize: 18,
		                color: '#fff'
		              }
		            }
		          }
		        ]
		      }
		    ]
			})
			// 面积图
			this.chart2 = echarts.init(document.getElementById('estate-info-chart'))
			this.chart2.setOption({
		    tooltip: {
		      trigger: 'axis',
		      formatter: function (params) {
		        return params[0].value;
		      },
		      axisPointer: {
		        type: 'line',
		        lineStyle: {
		          color: '#fff',
		          type: 'dashed'
		        }
		      },
		      backgroundColor: '#00c6ff'
		    },
		    grid: {
		      left: 10,
		      right: 25,
		      top: 10,
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
		        data : ['00:00','04:00','08:00','12:00','16:00','20:00','24:00']
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
			this.getRealTimeRadar()
			this.getRealTimeLine()
		},
		methods: {
			// 选择小区安全指数时间(雷达图)
      radarHandleClick () {
        this.radaropen = !this.radaropen
      },
      radarHandleChange (radardate) {
        this.radardate = radardate
      },
      radarHandleClear () {
        this.radaropen = false
      },
      radarHandleOk () {
      	this.radaropen = false
				if (!this.radardate[0]) {
					this.radargroup = 0
					this.getRealTimeRadar()
				}
				else {
					this.radargroup = -1
					this.getInputtimeRadar()
				}
      },
			// 小区安全指数按天周月选择(雷达图)
			selectRadarGroup: function (index) {
				this.radardate = ['', '']
				this.radargroup = index
				if (index == 0) {
					this.getRealTimeRadar()
				}
				else if (index == 1) {
					this.getWeekRadar()
				}
				else if (index == 2) {
					this.getMonthRadar()
				}
			},
			// 选择小区安全指数时间(面积图)
      lineHandleClick () {
        this.lineopen = !this.lineopen
      },
      lineHandleChange (linedate) {
        this.linedate = linedate
      },
      lineHandleClear () {
        this.lineopen = false
      },
      lineHandleOk () {
      	this.lineopen = false
				if (!this.linedate[0]) {
					this.linegroup = 0
					this.getRealTimeLine()
				}
				else {
					this.linegroup = -1
					this.getInputtimeLine()
				}
      },
			// 小区安全指数按类型选择(面积图)
			selectTypeGroup: function (name) {
				this.typegroup = name
				this.linedate = ['', '']
				this.linegroup = 0
				this.getRealTimeLine()
			},
			// 小区安全指数按天周月选择(面积图)
			selectLineGroup: function (index) {
				this.linedate = ['', '']
				this.linegroup = index
				if (index == 0) {
					this.getRealTimeLine()
				}
				else if (index == 1) {
					this.getWeekLine()
				}
				else if (index == 2) {
					this.getMonthLine()
				}
			},
			// 获取实时小区安全指数(雷达图)
			getRealTimeRadar: function () {
				axios.post('/safety/unitCaseRealTimeDetailSpider.do', {
					unit_id: this.unitid
				}).then(response => {
					if(response.data.success) {
						let tmparr1 = [], tmparr2 = []
						tmparr1 = [
							response.data.data.casePoliceRate.split(',')[0],
							response.data.data.caseRate.split(',')[0],
							response.data.data.nightRate.split(',')[0],
							response.data.data.threeDefenceRate.split(',')[0],
							response.data.data.externalPersonRate.split(',')[0],
							response.data.data.specialPersonRate.split(',')[0]
						]
						tmparr2 = [
							{
								type: '案件',
								rank: response.data.data.casePoliceRate.split(',')[0] ? response.data.data.casePoliceRate.split(',')[0] : '',
								isup: response.data.data.casePoliceRate.split(',')[1] ? response.data.data.casePoliceRate.split(',')[1] : '',
								ratio: response.data.data.casePoliceRate.split(',')[2] ? response.data.data.casePoliceRate.split(',')[2] : ''
							},
							{
								type: '告警处理率',
								rank: response.data.data.caseRate.split(',')[0] ? response.data.data.caseRate.split(',')[0] : '',
								isup: response.data.data.caseRate.split(',')[1] ? response.data.data.caseRate.split(',')[1] : '',
								ratio: response.data.data.caseRate.split(',')[2] ? response.data.data.caseRate.split(',')[2] : ''
							},
							{
								type: '巡更',
								rank: response.data.data.nightRate.split(',')[0] ? response.data.data.nightRate.split(',')[0] : '',
								isup: response.data.data.nightRate.split(',')[1] ? response.data.data.nightRate.split(',')[1] : '',
								ratio: response.data.data.nightRate.split(',')[2] ? response.data.data.nightRate.split(',')[2] : ''
							},
							{
								type: '三防',
								rank: response.data.data.threeDefenceRate.split(',')[0] ? response.data.data.threeDefenceRate.split(',')[0] : '',
								isup: response.data.data.threeDefenceRate.split(',')[1] ? response.data.data.threeDefenceRate.split(',')[1] : '',
								ratio: response.data.data.threeDefenceRate.split(',')[2] ? response.data.data.threeDefenceRate.split(',')[2] : ''
							},
							{
								type: '外来人员',
								rank: response.data.data.externalPersonRate.split(',')[0] ? response.data.data.externalPersonRate.split(',')[0] : '',
								isup: response.data.data.externalPersonRate.split(',')[1] ? response.data.data.externalPersonRate.split(',')[1] : '',
								ratio: response.data.data.externalPersonRate.split(',')[2] ? response.data.data.externalPersonRate.split(',')[2] : ''
							},
							{
								type: '重点人员',
								rank: response.data.data.specialPersonRate.split(',')[0] ? response.data.data.specialPersonRate.split(',')[0] : '',
								isup: response.data.data.specialPersonRate.split(',')[1] ? response.data.data.specialPersonRate.split(',')[1] : '',
								ratio: response.data.data.specialPersonRate.split(',')[2] ? response.data.data.specialPersonRate.split(',')[2] : ''
							}
						]
						this.chart1.setOption({
					    radar: [
					      {
					        indicator: [
					          { name: '案件', max: Math.max(...tmparr1) },
					          { name: '告警处理率', max: Math.max(...tmparr1) },
					          { name: '巡更', max: Math.max(...tmparr1) },
					          { name: '三防', max: Math.max(...tmparr1) },
					          { name: '外来人员', max: Math.max(...tmparr1) },
					          { name: '重点人员', max: Math.max(...tmparr1) }
					        ]
					      }
					    ],
					    series: [
					      {
					        name: '雷达图',
					        type: 'radar',
					        data: [
					          {
					            value: tmparr1,
					            symbol: 'circle',
					            symbolSize: 1,
					            itemStyle: {
					              normal: {
					                color: '#8398ce'
					              }
					            },
					            lineStyle: {
					              normal: {
					                type: 'dashed',
					                color: '#8398ce'
					              }
					            },
					            areaStyle: {
					              normal: {
					                color: 'rgba(96, 0, 254, 0.25)'
					              }
					            },
					            label: {
					              normal: {
					                show: false
					              }
					            }
					          }
					        ]
					      }
					    ]
						})
						this.data = tmparr2
					}
					else {
						console.log('获取实时小区安全指数失败')
					}
				}).catch(err => {
					console.log('获取实时小区安全指数失败')
				})
			},
			// 获取最近一周小区安全指数(雷达图)
			getWeekRadar: function () {
				axios.post('/safety/unitCaseWeekDetailSpider.do', {
					unit_id: this.unitid
				}).then(response => {
					if(response.data.success) {
						let tmparr1 = [], tmparr2 = []
						tmparr1 = [
							response.data.data.casePoliceRate.split(',')[0],
							response.data.data.caseRate.split(',')[0],
							response.data.data.nightRate.split(',')[0],
							response.data.data.threeDefenceRate.split(',')[0],
							response.data.data.externalPersonRate.split(',')[0],
							response.data.data.specialPersonRate.split(',')[0]
						]
						tmparr2 = [
							{
								type: '案件',
								rank: response.data.data.casePoliceRate.split(',')[0] ? response.data.data.casePoliceRate.split(',')[0] : '',
								isup: response.data.data.casePoliceRate.split(',')[1] ? response.data.data.casePoliceRate.split(',')[1] : '',
								ratio: response.data.data.casePoliceRate.split(',')[2] ? response.data.data.casePoliceRate.split(',')[2] : ''
							},
							{
								type: '告警处理率',
								rank: response.data.data.caseRate.split(',')[0] ? response.data.data.caseRate.split(',')[0] : '',
								isup: response.data.data.caseRate.split(',')[1] ? response.data.data.caseRate.split(',')[1] : '',
								ratio: response.data.data.caseRate.split(',')[2] ? response.data.data.caseRate.split(',')[2] : ''
							},
							{
								type: '巡更',
								rank: response.data.data.nightRate.split(',')[0] ? response.data.data.nightRate.split(',')[0] : '',
								isup: response.data.data.nightRate.split(',')[1] ? response.data.data.nightRate.split(',')[1] : '',
								ratio: response.data.data.nightRate.split(',')[2] ? response.data.data.nightRate.split(',')[2] : ''
							},
							{
								type: '三防',
								rank: response.data.data.threeDefenceRate.split(',')[0] ? response.data.data.threeDefenceRate.split(',')[0] : '',
								isup: response.data.data.threeDefenceRate.split(',')[1] ? response.data.data.threeDefenceRate.split(',')[1] : '',
								ratio: response.data.data.threeDefenceRate.split(',')[2] ? response.data.data.threeDefenceRate.split(',')[2] : ''
							},
							{
								type: '外来人员',
								rank: response.data.data.externalPersonRate.split(',')[0] ? response.data.data.externalPersonRate.split(',')[0] : '',
								isup: response.data.data.externalPersonRate.split(',')[1] ? response.data.data.externalPersonRate.split(',')[1] : '',
								ratio: response.data.data.externalPersonRate.split(',')[2] ? response.data.data.externalPersonRate.split(',')[2] : ''
							},
							{
								type: '重点人员',
								rank: response.data.data.specialPersonRate.split(',')[0] ? response.data.data.specialPersonRate.split(',')[0] : '',
								isup: response.data.data.specialPersonRate.split(',')[1] ? response.data.data.specialPersonRate.split(',')[1] : '',
								ratio: response.data.data.specialPersonRate.split(',')[2] ? response.data.data.specialPersonRate.split(',')[2] : ''
							}
						]
						this.chart1.setOption({
					    radar: [
					      {
					        indicator: [
					          { name: '案件', max: Math.max(...tmparr1) },
					          { name: '告警处理率', max: Math.max(...tmparr1) },
					          { name: '巡更', max: Math.max(...tmparr1) },
					          { name: '三防', max: Math.max(...tmparr1) },
					          { name: '外来人员', max: Math.max(...tmparr1) },
					          { name: '重点人员', max: Math.max(...tmparr1) }
					        ]
					      }
					    ],
					    series: [
					      {
					        name: '雷达图',
					        type: 'radar',
					        data: [
					          {
					            value: tmparr1,
					            symbol: 'circle',
					            symbolSize: 1,
					            itemStyle: {
					              normal: {
					                color: '#8398ce'
					              }
					            },
					            lineStyle: {
					              normal: {
					                type: 'dashed',
					                color: '#8398ce'
					              }
					            },
					            areaStyle: {
					              normal: {
					                color: 'rgba(96, 0, 254, 0.25)'
					              }
					            },
					            label: {
					              normal: {
					                show: false
					              }
					            }
					          }
					        ]
					      }
					    ]
						})
						this.data = tmparr2
					}
					else {
						console.log('获取最近一周小区安全指数失败')
					}
				}).catch(err => {
					console.log('获取最近一周小区安全指数失败')
				})
			},
			// 获取最近一个月小区安全指数(雷达图)
			getMonthRadar: function () {
				axios.post('/safety/unitCaseMonthDetailSpider.do', {
					unit_id: this.unitid
				}).then(response => {
					if(response.data.success) {
						let tmparr1 = [], tmparr2 = []
						tmparr1 = [
							response.data.data.casePoliceRate.split(',')[0],
							response.data.data.caseRate.split(',')[0],
							response.data.data.nightRate.split(',')[0],
							response.data.data.threeDefenceRate.split(',')[0],
							response.data.data.externalPersonRate.split(',')[0],
							response.data.data.specialPersonRate.split(',')[0]
						]
						tmparr2 = [
							{
								type: '案件',
								rank: response.data.data.casePoliceRate.split(',')[0] ? response.data.data.casePoliceRate.split(',')[0] : '',
								isup: response.data.data.casePoliceRate.split(',')[1] ? response.data.data.casePoliceRate.split(',')[1] : '',
								ratio: response.data.data.casePoliceRate.split(',')[2] ? response.data.data.casePoliceRate.split(',')[2] : ''
							},
							{
								type: '告警处理率',
								rank: response.data.data.caseRate.split(',')[0] ? response.data.data.caseRate.split(',')[0] : '',
								isup: response.data.data.caseRate.split(',')[1] ? response.data.data.caseRate.split(',')[1] : '',
								ratio: response.data.data.caseRate.split(',')[2] ? response.data.data.caseRate.split(',')[2] : ''
							},
							{
								type: '巡更',
								rank: response.data.data.nightRate.split(',')[0] ? response.data.data.nightRate.split(',')[0] : '',
								isup: response.data.data.nightRate.split(',')[1] ? response.data.data.nightRate.split(',')[1] : '',
								ratio: response.data.data.nightRate.split(',')[2] ? response.data.data.nightRate.split(',')[2] : ''
							},
							{
								type: '三防',
								rank: response.data.data.threeDefenceRate.split(',')[0] ? response.data.data.threeDefenceRate.split(',')[0] : '',
								isup: response.data.data.threeDefenceRate.split(',')[1] ? response.data.data.threeDefenceRate.split(',')[1] : '',
								ratio: response.data.data.threeDefenceRate.split(',')[2] ? response.data.data.threeDefenceRate.split(',')[2] : ''
							},
							{
								type: '外来人员',
								rank: response.data.data.externalPersonRate.split(',')[0] ? response.data.data.externalPersonRate.split(',')[0] : '',
								isup: response.data.data.externalPersonRate.split(',')[1] ? response.data.data.externalPersonRate.split(',')[1] : '',
								ratio: response.data.data.externalPersonRate.split(',')[2] ? response.data.data.externalPersonRate.split(',')[2] : ''
							},
							{
								type: '重点人员',
								rank: response.data.data.specialPersonRate.split(',')[0] ? response.data.data.specialPersonRate.split(',')[0] : '',
								isup: response.data.data.specialPersonRate.split(',')[1] ? response.data.data.specialPersonRate.split(',')[1] : '',
								ratio: response.data.data.specialPersonRate.split(',')[2] ? response.data.data.specialPersonRate.split(',')[2] : ''
							}
						]
						this.chart1.setOption({
					    radar: [
					      {
					        indicator: [
					          { name: '案件', max: Math.max(...tmparr1) },
					          { name: '告警处理率', max: Math.max(...tmparr1) },
					          { name: '巡更', max: Math.max(...tmparr1) },
					          { name: '三防', max: Math.max(...tmparr1) },
					          { name: '外来人员', max: Math.max(...tmparr1) },
					          { name: '重点人员', max: Math.max(...tmparr1) }
					        ]
					      }
					    ],
					    series: [
					      {
					        name: '雷达图',
					        type: 'radar',
					        data: [
					          {
					            value: tmparr1,
					            symbol: 'circle',
					            symbolSize: 1,
					            itemStyle: {
					              normal: {
					                color: '#8398ce'
					              }
					            },
					            lineStyle: {
					              normal: {
					                type: 'dashed',
					                color: '#8398ce'
					              }
					            },
					            areaStyle: {
					              normal: {
					                color: 'rgba(96, 0, 254, 0.25)'
					              }
					            },
					            label: {
					              normal: {
					                show: false
					              }
					            }
					          }
					        ]
					      }
					    ]
						})
						this.data = tmparr2
					}
					else {
						console.log('获取最近一个月小区安全指数失败')
					}
				}).catch(err => {
					console.log('获取最近一个月小区安全指数失败')
				})
			},
			// 获取时间范围小区安全指数(雷达图)
			getInputtimeRadar: function () {
				axios.post('/safety/unitCaseInputTimeDetailSpider.do', {
					unit_id: this.unitid,
					startTime: this.radardate[0],
					endTime: this.radardate[1]
				}).then(response => {
					if(response.data.success) {
						let tmparr1 = [], tmparr2 = []
						tmparr1 = [
							response.data.data.casePoliceRate.split(',')[0],
							response.data.data.caseRate.split(',')[0],
							response.data.data.nightRate.split(',')[0],
							response.data.data.threeDefenceRate.split(',')[0],
							response.data.data.externalPersonRate.split(',')[0],
							response.data.data.specialPersonRate.split(',')[0]
						]
						tmparr2 = [
							{
								type: '案件',
								rank: response.data.data.casePoliceRate.split(',')[0] ? response.data.data.casePoliceRate.split(',')[0] : '',
								isup: response.data.data.casePoliceRate.split(',')[1] ? response.data.data.casePoliceRate.split(',')[1] : '',
								ratio: response.data.data.casePoliceRate.split(',')[2] ? response.data.data.casePoliceRate.split(',')[2] : ''
							},
							{
								type: '告警处理率',
								rank: response.data.data.caseRate.split(',')[0] ? response.data.data.caseRate.split(',')[0] : '',
								isup: response.data.data.caseRate.split(',')[1] ? response.data.data.caseRate.split(',')[1] : '',
								ratio: response.data.data.caseRate.split(',')[2] ? response.data.data.caseRate.split(',')[2] : ''
							},
							{
								type: '巡更',
								rank: response.data.data.nightRate.split(',')[0] ? response.data.data.nightRate.split(',')[0] : '',
								isup: response.data.data.nightRate.split(',')[1] ? response.data.data.nightRate.split(',')[1] : '',
								ratio: response.data.data.nightRate.split(',')[2] ? response.data.data.nightRate.split(',')[2] : ''
							},
							{
								type: '三防',
								rank: response.data.data.threeDefenceRate.split(',')[0] ? response.data.data.threeDefenceRate.split(',')[0] : '',
								isup: response.data.data.threeDefenceRate.split(',')[1] ? response.data.data.threeDefenceRate.split(',')[1] : '',
								ratio: response.data.data.threeDefenceRate.split(',')[2] ? response.data.data.threeDefenceRate.split(',')[2] : ''
							},
							{
								type: '外来人员',
								rank: response.data.data.externalPersonRate.split(',')[0] ? response.data.data.externalPersonRate.split(',')[0] : '',
								isup: response.data.data.externalPersonRate.split(',')[1] ? response.data.data.externalPersonRate.split(',')[1] : '',
								ratio: response.data.data.externalPersonRate.split(',')[2] ? response.data.data.externalPersonRate.split(',')[2] : ''
							},
							{
								type: '重点人员',
								rank: response.data.data.specialPersonRate.split(',')[0] ? response.data.data.specialPersonRate.split(',')[0] : '',
								isup: response.data.data.specialPersonRate.split(',')[1] ? response.data.data.specialPersonRate.split(',')[1] : '',
								ratio: response.data.data.specialPersonRate.split(',')[2] ? response.data.data.specialPersonRate.split(',')[2] : ''
							}
						]
						this.chart1.setOption({
					    radar: [
					      {
					        indicator: [
					          { name: '案件', max: Math.max(...tmparr1) },
					          { name: '告警处理率', max: Math.max(...tmparr1) },
					          { name: '巡更', max: Math.max(...tmparr1) },
					          { name: '三防', max: Math.max(...tmparr1) },
					          { name: '外来人员', max: Math.max(...tmparr1) },
					          { name: '重点人员', max: Math.max(...tmparr1) }
					        ]
					      }
					    ],
					    series: [
					      {
					        name: '雷达图',
					        type: 'radar',
					        data: [
					          {
					            value: tmparr1,
					            symbol: 'circle',
					            symbolSize: 1,
					            itemStyle: {
					              normal: {
					                color: '#8398ce'
					              }
					            },
					            lineStyle: {
					              normal: {
					                type: 'dashed',
					                color: '#8398ce'
					              }
					            },
					            areaStyle: {
					              normal: {
					                color: 'rgba(96, 0, 254, 0.25)'
					              }
					            },
					            label: {
					              normal: {
					                show: false
					              }
					            }
					          }
					        ]
					      }
					    ]
						})
						this.data = tmparr2
					}
					else {
						console.log('获取时间范围小区安全指数失败')
					}
				}).catch(err => {
					console.log('获取时间范围小区安全指数失败')
				})
			},
			// 获取实时小区安全指数(面积图)
			getRealTimeLine: function () {
				axios.post('/safety/unitCaseRealTimeDetailWave.do', {
					unit_id: this.unitid
				}).then(response => {
					if(response.data.success) {
						let xdata = [], sdata = []
						for (let key in response.data.data) {
							xdata.push(key)
							sdata.push(response.data.data[key].split(',')[this.typegroup])
						}
						this.chart2.setOption({
					    xAxis : [
					      {
					        data: xdata
					      }
					    ],
					    yAxis: [
					    	{
					    		max: (parseInt(Math.max(...sdata) / 5) + 1) * 5
					    	}
					    ],
					    series : [
					      {
					        data: sdata
					      }
					    ]
						})
					}
					else {
						console.log('获取实时小区安全指数失败')
					}
				}).catch(err => {
					console.log('获取实时小区安全指数失败')
				})
			},
			// 获取最近一周小区安全指数(面积图)
			getWeekLine: function () {
				axios.post('/safety/unitCaseWeekDetailWave.do', {
					unit_id: this.unitid
				}).then(response => {
					if(response.data.success) {
						let xdata = [], sdata = []
						for (let key in response.data.data) {
							xdata.push(key)
							sdata.push(response.data.data[key].split(',')[this.typegroup])
						}
						this.chart2.setOption({
					    xAxis : [
					      {
					        data: xdata
					      }
					    ],
					    yAxis: [
					    	{
					    		max: (parseInt(Math.max(...sdata) / 5) + 1) * 5
					    	}
					    ],
					    series : [
					      {
					        data: sdata
					      }
					    ]
						})
					}
					else {
						console.log('获取最近一周小区安全指数失败')
					}
				}).catch(err => {
					console.log('获取最近一周小区安全指数失败')
				})
			},
			// 获取最近一个月小区安全指数(面积图)
			getMonthLine: function () {
				axios.post('/safety/unitCaseMonthDetailWave.do', {
					unit_id: this.unitid
				}).then(response => {
					if(response.data.success) {
						let xdata = [], sdata = []
						for (let key in response.data.data) {
							xdata.push(key)
							sdata.push(response.data.data[key].split(',')[this.typegroup])
						}
						this.chart2.setOption({
					    xAxis : [
					      {
					        data: xdata
					      }
					    ],
					    yAxis: [
					    	{
					    		max: (parseInt(Math.max(...sdata) / 5) + 1) * 5
					    	}
					    ],
					    series : [
					      {
					        data: sdata
					      }
					    ]
						})
					}
					else {
						console.log('获取最近一个月小区安全指数失败')
					}
				}).catch(err => {
					console.log('获取最近一个月小区安全指数失败')
				})
			},
			// 获取时间范围小区安全指数(面积图)
			getInputtimeLine: function () {
				axios.post('/safety/unitCaseInputTimeDetailWave.do', {
					unit_id: this.unitid,
					startTime: this.linedate[0],
					endTime: this.linedate[1]
				}).then(response => {
					if(response.data.success) {
						let xdata = [], sdata = []
						for (let key in response.data.data) {
							xdata.push(key)
							sdata.push(response.data.data[key].split(',')[this.typegroup])
						}
						this.chart2.setOption({
					    xAxis : [
					      {
					        data: xdata
					      }
					    ],
					    yAxis: [
					    	{
					    		max: (parseInt(Math.max(...sdata) / 5) + 1) * 5
					    	}
					    ],
					    series : [
					      {
					        data: sdata
					      }
					    ]
						})
					}
					else {
						console.log('获取时间范围小区安全指数失败')
					}
				}).catch(err => {
					console.log('获取时间范围小区安全指数失败')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ranking {
		width: 1920px; height: 1080px; background: url(../../assets/image/appBg.jpg) no-repeat;	position: relative;
		position: relative;
		.contentPage {
			position: absolute;
			top: 90px;
			bottom: 0;
			left: 0;
			right: 0;
			overflow-x: hidden;
			overflow-y: auto;
		}
		.contentPage::-webkit-scrollbar {
			display: none;
		}
	}
	.estate-ranking {
		padding: 20px 15px 0 15px;
		.estate-ranking-title {
			width: 100%; height: 57px;
			background-image: url('../../assets/image/securityCount-logo.png'); background-repeat: no-repeat;
			.estate-ranking-name { 
				display:inline-block; font-size: 18px; color: #1cb1ff; padding-left: 57px; padding-top: 6px;
			}
		}
	}
	.estate-ranking-detail {
		margin: 5px 45px 15px 45px; padding: 5px 5px;
		position: relative; border-top: 1px solid #009dff; border-bottom: 1px solid #009dff;
		.left-top1 { width: 10px; height: 5px; position: absolute; top: -3px; left: 0; background-color: #1cb1ff; }
		.left-top2 { width: 5px; height: 10px; position: absolute; top: 0; left: 0; background-color: #1cb1ff; }
		.right-top1 { width: 10px; height: 5px; position: absolute; top: -3px; right: 0; background-color: #1cb1ff; }
		.right-top2 { width: 5px; height: 10px; position: absolute; top: 0; right: 0; background-color: #1cb1ff; }
		.left-bottom1 { width: 10px; height: 5px; position: absolute; bottom: -3px; left: 0; background-color: #1cb1ff; }
		.left-bottom2 { width: 5px; height: 10px; position: absolute; bottom: 0; left: 0; background-color: #1cb1ff; }
		.right-bottom1 { width: 10px; height: 5px; position: absolute; bottom: -3px; right: 0; background-color: #1cb1ff; }
		.right-bottom2 { width: 5px; height: 10px; position: absolute; bottom: 0; right: 0; background-color: #1cb1ff; }
		.detail-container {
			background: linear-gradient(90deg, rgba(10, 45, 103, .25), rgba(2, 148, 232, .25)); display: flex; flex-wrap: wrap;
			.detail-search {
	    	width: 100%; display: inline-flex; justify-content: flex-end; align-items: center;
	    	padding: 15px 15px; line-height: 32px; font-size: 14px;
	    	label { font-size: 16px; color: #1cb1ff; line-height: 16px; font-weight: bold; margin-right: 10px; }
			}
			.detail-chart {
				display: inline-flex; flex: 1; margin-left: 15px; margin-right: 15px; height: 400px;
			}
			.detail-data {
				display: inline-flex; width: 450px; margin-left: 15px; margin-right: 15px; padding: 15px 15px;
				.stripe-table {
					width: 100%;
				}
			}
		}
	}
	.estate-info {
		padding: 20px 15px 0 15px; margin-bottom: 20px;
		.estate-info-tab {
			border-bottom: 2px solid #1e589d; padding: 0 60px;
		}
		.estate-info-tool {
    	width: 100%; display: inline-flex; justify-content: flex-end; align-items: center;
    	padding: 15px 15px; line-height: 32px; font-size: 14px;
    	label { font-size: 16px; color: #1cb1ff; line-height: 16px; font-weight: bold; margin-right: 10px; }
		}
		.estate-info-chart {
			height: 600px; padding: 10px 60px 20px 60px;
		}
	}
	.date-select {
		display: inline-block; margin-right: 20px;
		.date-select-input {
			display: inline-block; position: relative;
			label { margin-left: 10px; }
		}
	}
</style>