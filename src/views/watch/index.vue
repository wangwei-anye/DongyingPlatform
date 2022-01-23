<template>
	<div class="watchindex">
		<!-- 区域搜索 -->
		<div class="search-container">
			县区：
			<Select :value="currentTown" :label-in-value="true" @on-change="selectTown" class="v-select" placeholder="县区">
				<Option v-for="item in townList" :value="item.town_code" :key="item.town_code">{{ item.town_name }}</Option>
			</Select>
			街道办/乡镇：
			<Select :value="currentTownShip" :label-in-value="true" @on-change="selectTownShip" class="v-select" placeholder="街道办/乡镇">
				<Option v-for="item in townShipList" :value="item.township_code" :key="item.township_code">{{ item.township_name }}</Option>
			</Select>
			社区/村：
			<Select :value="currentVillage" :label-in-value="true" @on-change="selectVillage" class="v-select" placeholder="社区/村">
				<Option v-for="item in villageList" :value="item.village_code" :key="item.village_code">{{ item.village_name }}</Option>
			</Select>
			小区：
			<Select :value="currentUnit" :label-in-value="true" @on-change="selectUnit" class="v-select" placeholder="小区">
				<Option v-for="item in unitList" :value="item.unit_id" :key="item.unit_id">{{ item.name }}</Option>
			</Select>
			<v-Button class='v-btn' :btnInfo="btnInfo" @click="btnSearch"></v-Button>
		</div>
		<!-- 治安防范体系 -->
    <v-chart-box boxType="polygon" iconName="prevent" :w="1655" :h="600" boxTitle="治安防范体系" hrefto="">
    	<div class="bar-raddar">
    		<div class="bar-chart" id="bar-chart1"></div>
    		<div class="raddar-chart" id="raddar-chart"></div>
    	</div>
    </v-chart-box>
    <!-- 人防、物防、技防 -->
    <div class="watch-security">
    	<div class="people-security">
		    <v-chart-box boxType="polygon" iconName="prevent" :w="400" :h="480" boxTitle="人防数据" hrefto="/staffdefense">
		    	<ul>
		    		<li>
		    			<i class="icon iconfont icon-font-jingcha"></i>
		    			<label>社区民警：</label>
		    			<b>{{ policecount }}人</b>
		    		</li>
		    		<li>
		    			<i class="icon iconfont icon-font-baoan"></i>
		    			<label>专职保安队伍：</label>
		    			<b>{{ securitycount }}人</b>
		    		</li>
		    		<li>
		    			<i class="icon iconfont icon-font-jiuyuanduiwu"></i>
		    			<label>义务治安巡逻队伍：</label>
		    			<b>{{ teamcount }}人</b>
		    		</li>
		    	</ul>
		    </v-chart-box>
    	</div>
    	<div class="goods-security">
		    <v-chart-box boxType="polygon" iconName="prevent" :w="600" :h="480" boxTitle="物防数据" hrefto="/goodsdefense">
		    	<div class="security-bar-chart" id="bar-chart2"></div>
		    </v-chart-box>
    	</div>
    	<div class="technology-security">
		    <v-chart-box boxType="polygon" iconName="prevent" :w="600" :h="480" boxTitle="技防数据" hrefto="/techdefense">
					<div class="security-bar-chart" id="bar-chart3"></div>
		    </v-chart-box>
    	</div>
    </div>
	</div>
</template>

<script>
  import echarts from 'echarts'
  import vChartBox from '@/components/ChartBox'
  import vButton from '@/components/Button'

  import axios from '../../utils/http.js'
  import { province_code, city_code } from '@/config'

	export default {
		name: 'watchindex',
		components: {
			vChartBox,
			vButton
		},
		data () {
			return {
				btnInfo: {
					text: '查 询'
				},
				tmpArea: '',
				currentProvince: '',
				currentCity: '',
			  townList: [{ town_code: 'all', town_name: '县区' }],
			  currentTown: 'all',
			  townShipList: [{ township_code: 'all', township_name: '街道办/乡镇' }],
			  currentTownShip: 'all',
			  villageList: [{ village_code: 'all', village_name: '社区/村' }],
			  currentVillage: 'all',
			  unitList: [{ unit_id: 'all', name: '小区' }],
			  currentUnit: 'all',
			  chart1: null,
			  chart2: null,
			  chart3: null,
			  chart4: null,
			  policecount: '',
			  securitycount: '',
			  teamcount: ''
			}
		},
		mounted: function () {
			this.currentProvince = this.$store.state.global.accountInfo.rolePermission.province_code
			this.currentCity = this.$store.state.global.accountInfo.rolePermission.city_code
			if (!this.currentProvince) {
				this.currentProvince = province_code
			}
			if (!this.currentCity) {
				this.currentCity = city_code
			}
			this.currentTown = this.$store.state.platform.currentTownCode
			this.currentTownShip = this.$store.state.platform.currentTownShipCode
			this.currentVillage = this.$store.state.platform.currentVillageCode
			this.currentUnit = this.$store.state.platform.currentUnitId

	    let rolePermission = this.$store.state.global.accountInfo.rolePermission;
	    if (rolePermission.town_code && rolePermission.town_code !== '') {
				this.townList = [{ town_code: rolePermission.town_code, town_name: rolePermission.town_name }]
				this.currentTown = rolePermission.town_code
	    }
	    if (rolePermission.township_code && rolePermission.township_code !== '') {
				this.townShipList = [{ township_code: rolePermission.township_code, township_name: rolePermission.township }]
				this.currentTownShip = rolePermission.township_code
	    }
	    if (rolePermission.village_code && rolePermission.village_code !== '') {
				this.villageList = [{ village_code: rolePermission.village_code, village_name: rolePermission.village_name }]
				this.currentVillage = rolePermission.village_code
	    }
			if (this.$store.state.global.accountInfo.rolePermission.roleType.level == 6) {
				let tmparr = []
				if (this.$store.state.global.accountInfo.rolePermission.permiscodes) {
					this.currentUnit = this.$store.state.global.accountInfo.rolePermission.permiscodes
				}
				else {
					this.currentUnit = this.$store.state.global.accountInfo.rolePermission.permiscodeSet[0]
				}
			}
      let level = this.$store.state.global.accountInfo.rolePermission.roleType.level
      switch(level) {
      	// 区县平台
        case 3:
          this.getTownShipList()
          break
        // 乡镇、街道办
        case 4:
          this.getVillageList()
          break
        case 5:
        case 6:
        	this.getUnitList()
          break
        // 市局平台
        default:
          this.getTownList()
         	break
      }

			// 柱状图 - 治安防范体系
			this.chart1 = echarts.init(document.getElementById('bar-chart1'))
			this.chart1.setOption({
				title: {
					text: '小区平均配备数',
					padding: 0,
					textStyle: {
						color: '#fff',
						fontSize: 12
					}
				},
				color:['#186ee1','#00bc5d','#b3c70f'],
		    legend: {
		    	top: 20,
		    	right: 0,
		    	orient: 'vertical',
		      data:['人防', '物防', '技防'],
			    textStyle:{
			      color:'#fff',
			      fontSize:14
    			}
		    },
		    tooltip: {
		      trigger: 'axis',
		      formatter: '{b}<br/>{a0}：{c0}<br/>{a1}：{c1}<br/>{a2}：{c2}',
		      axisPointer: {
		        type: 'line',
		        lineStyle: {
		          color: '#db6c45'
		        }
		      },
		      backgroundColor: '#db6c45'
		    },
		    grid: {
		      left: '40',
		      right: '80',
		      top: '30',
		      bottom: '0',
		      containLabel: true
		    },
		    xAxis : [
		      {
		        type : 'category',
		        data : [],
		        axisLine: {
		          lineStyle: {
		            color: '#7269ac',
		            opacity: 0.25
		          }
		        },
		        axisTick: {
		          interval: 0,
		          inside: true,
		          length: 8,
		          lineStyle: {
		            color: '#7269ac',
		            opacity: 0.25
		          }
		        },
		        axisLabel: {
		          color: '#fff',
		          fontSize: 14
		        }
		      }
		    ],
		    yAxis : [
		      {
		        type : 'value',
						max: function(value) {
						  return value.max > 100 ? 100 : value.max
						},
		        nameTextStyle: {
		          fontSize: 14,
		          color: '#fff'
		        },
		        axisLine: {
		          show: false
		        },
		        axisTick: {
		          show: false
		        },
		        axisLabel: {
		          interval: 2,
		          color: '#fff',
		          fontSize: 14
		        }
		      }
		    ],
		    series : [
		      {
		        name: '人防',
		        type:'bar',
		        barWidth: '20%',
		        itemStyle: {
		          normal: {
		            color: ['#186ee1']
		          }
		        },
		        data:[]
		      },
		      {
		        name: '物防',
		        type:'bar',
		        barWidth: '20%',
		        itemStyle: {
		          normal: {
		            color: ['#00bc5d']
		          }
		        },
		        data:[]
		      },
		      {
		        name: '技防',
		        type:'bar',
		        barWidth: '20%',
		        itemStyle: {
		          normal: {
		            color: ['#b3c70f']
		          }
		        },
		        data:[]
		      }
		    ]
			})
			// 雷达图 - 治安防范体系
			this.chart2 = echarts.init(document.getElementById('raddar-chart'))
			this.chart2.setOption({
		    radar: [
		      {
		        indicator: [
		          { name: '人防', max: 0 },
		          { name: '物防', max: 0 },
		          { name: '技防', max: 0  }
		        ],
		        center: ['50%', '55%'],
		        radius: '80%',
		        startAngle: 90,
		        splitNumber: 6,
		        shape: 'circle',
		        name: {
		          color:'#e8e8e8',
		          fontSize: 14
		        },
		        splitArea: {
		          show: false
		        },
		        splitLine: {
		          show: false
		        },
		        axisLine: {
		          lineStyle: {
		            color: 'rgb(97, 120, 171)'
		          }
		        }
		      }
		    ],
		    series: []
			})
			// 柱状图 - 物防数据
			this.chart3 = echarts.init(document.getElementById('bar-chart2'))
			this.chart3.setOption({
				title: {
					text: '数量',
					padding: 0,
					textStyle: {
						color: '#fff',
						fontSize: 12
					}
				},
		    tooltip: {
		      trigger: 'axis',
		      formatter: '{b}：{c}',
		      axisPointer: {
		        type: 'line',
		        lineStyle: {
		          color: '#db6c45'
		        }
		      },
		      backgroundColor: '#db6c45'
		    },
		    grid: {
		      left: '0',
		      right: '0',
		      top: '30',
		      bottom: '0',
		      containLabel: true
		    },
		    xAxis : [
		      {
		        type : 'category',
		        data : [],
		        axisLine: {
		          lineStyle: {
		            color: '#7269ac',
		            opacity: 0.25
		          }
		        },
		        axisTick: {
		          interval: 0,
		          inside: true,
		          length: 8,
		          lineStyle: {
		            color: '#7269ac',
		            opacity: 0.25
		          }
		        },
		        axisLabel: {
		        	show: false,
		          color: '#fff',
		          fontSize: 14
		        }
		      }
		    ],
		    yAxis : [
		      {
		        type : 'value',
		        nameTextStyle: {
		          fontSize: 14,
		          color: '#fff'
		        },
		        axisLine: {
		          show: false
		        },
		        axisTick: {
		          show: false
		        },
		        axisLabel: {
		          interval: 2,
		          color: '#fff',
		          fontSize: 14
		        }
		      }
		    ],
		    series : [
		      {
		        type:'bar',
		        barWidth: '35%',
		        itemStyle: {
		          normal: {
		            color: ['#dbcf45']
		          }
		        },
		        data:[]
		      }
		    ]
			})
			// 柱状图 - 技防数据
			this.chart4 = echarts.init(document.getElementById('bar-chart3'))
			this.chart4.setOption({
				title: {
					text: '数量',
					padding: 0,
					textStyle: {
						color: '#fff',
						fontSize: 12
					}
				},
		    tooltip: {
		      trigger: 'axis',
		      formatter: '{b}：{c}',
		      axisPointer: {
		        type: 'line',
		        lineStyle: {
		          color: '#db6c45'
		        }
		      },
		      backgroundColor: '#db6c45'
		    },
		    grid: {
		      left: '0',
		      right: '0',
		      top: '30',
		      bottom: '0',
		      containLabel: true
		    },
		    xAxis : [
		      {
		        type : 'category',
		        data : [],
		        axisLine: {
		          lineStyle: {
		            color: '#7269ac',
		            opacity: 0.25
		          }
		        },
		        axisTick: {
		          interval: 0,
		          inside: true,
		          length: 8,
		          lineStyle: {
		            color: '#7269ac',
		            opacity: 0.25
		          }
		        },
		        axisLabel: {
		          show: false,
		          color: '#fff',
		          fontSize: 14,
		          formatter: function (value, index) {
								if(value.length > 4) {
									return value.substr(0, 4) + '\n' + value.substr(4)
								}
								else {
									return value
								}
		          }
		        }
		      }
		    ],
		    yAxis : [
		      {
		        type : 'value',
						max: function(value) {
						  return value.max > 100 ? 100 : value.max
						},
		        nameTextStyle: {
		          fontSize: 14,
		          color: '#fff'
		        },
		        axisLine: {
		          show: false
		        },
		        axisTick: {
		          show: false
		        },
		        axisLabel: {
		          interval: 2,
		          color: '#fff',
		          fontSize: 14
		        }
		      }
		    ],
		    series : [
		      {
		        type:'bar',
		        barWidth: '35%',
		        itemStyle: {
		          normal: {
		            color: ['#45c4db']
		          }
		        },
		        data:[]
		      }
		    ]
			})
			// 获取数据
			// this.getTownList()
			this.getAverageNumber()
			this.getCivilDefence()
			this.getObjectDefence()
			this.getTechnicalDefence()
		},
		methods: {
			// 获取区县
			getTownList: function () {
				axios.post('/option/getTownByField.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity
				}).then(response => {
					if(response.data.success) {
						this.townList = [{ town_code: 'all', town_name: '县区' }].concat(response.data.data)
						this.currentTown = this.$store.state.platform.currentTownCode
						if (this.currentTown != '' && this.currentTown != 'all') {
							this.getTownShipList()
						}
					}
					else {
						console.log('获取区县失败')
					}
				}).catch(err => {
					console.log('获取县区失败')
				})
			},
			// 获取乡镇/街道办
			getTownShipList: function () {
				if (this.currentTown == 'all' || this.currentTown == '')
					return
				axios.post('/option/getTownShipByField.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown
				}).then(response => {
					if(response.data.success) {
						this.townShipList = [{ township_code: 'all', township_name: '街道办/乡镇' }].concat(response.data.data)
						this.currentTownShip = this.$store.state.platform.currentTownShipCode
						if (this.currentTownShip != '' && this.currentTownShip != 'all') {
							this.getVillageList()
						}
					}
					else {
						console.log('获取乡镇/街道办失败')
					}
				}).catch(err => {
					console.log('获取乡镇/街道办失败')
				})
			},
			// 获取村/社区
			getVillageList: function () {
				if (this.currentTownShip == 'all' || this.currentTownShip == '')
					return
				axios.post('/option/getVillageByField.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown,
					township_code: this.currentTownShip
				}).then(response => {
					if(response.data.success) {
						this.villageList = [{ village_code: 'all', village_name: '社区/村' }].concat(response.data.data)
						this.currentVillage = this.$store.state.platform.currentVillageCode
						if (this.currentVillage != '' && this.currentVillage != 'all') {
							this.getUnitList()
						}
					}
					else {
						console.log('获取村/社区失败')
					}
				}).catch(err => {
					console.log('获取村/社区失败')
				})
			},
			// 获取小区
			getUnitList: function () {
				let flag = '', code = ''
				if (this.currentVillage != 'all' && this.currentVillage != '') {
					flag = 'village'
					code = this.currentVillage
				}
				else if (this.currentTownShip != 'all' && this.currentTownShip != '') {
					flag = 'township'
					code = this.currentTownShip
				}
				else if (this.currentTown != 'all' && this.currentTown != '') {
					flag = 'town'
					code = this.currentTown
				}
				else {
					return
				}
				axios.post('/option/selectUnits.do', {
					code: code,
					flag: flag
				}).then(response => {
					if(response.data.success) {
						if (this.$store.state.global.accountInfo.rolePermission.roleType.level == 6) {
							let tmparr = []
							if (this.$store.state.global.accountInfo.rolePermission.permiscodes) {
								tmparr.push(this.$store.state.global.accountInfo.rolePermission.permiscodes)
							}
							else {
								tmparr = this.$store.state.global.accountInfo.rolePermission.permiscodeSet
							}
							this.unitList = response.data.data.filter(item => tmparr.includes(item.unit_id))
							this.currentUnit = tmparr[0]
						}
						else {
							this.unitList = [{ unit_id: 'all', name: '小区' }].concat(response.data.data)
							this.currentUnit = this.$store.state.platform.currentUnitId
						}
					}
					else {
						console.log('获取小区失败')
					}	
				}).catch(err => {
					console.log('获取小区失败')
				})
			},
			// 选择县区
			selectTown: function (obj) {
				if (this.$store.state.global.accountInfo.rolePermission.roleType.level >=3 && this.$store.state.global.accountInfo.rolePermission.roleType.level <= 6) {
					return
				}
				if (obj.value == 'all' || obj.value == '') {
					this.tmpArea = '铜仁市'
				}
				else {
					this.tmpArea = obj.label
				}
				this.currentTown = obj.value
				this.townShipList = [{ township_code: 'all', township_name: '街道办/乡镇' }]
				this.currentTownShip = 'all'
				this.villageList = [{ village_code: 'all', village_name: '社区/村' }]
				this.currentVillage = 'all'
				this.unitList = [{ unit_id: 'all', name: '小区' }]
				this.currentUnit = 'all'
				this.getTownShipList()
				this.getUnitList()
			},
			// 选取街道办/乡镇
			selectTownShip: function (obj) {
				if (this.$store.state.global.accountInfo.rolePermission.roleType.level == 5 || this.$store.state.global.accountInfo.rolePermission.roleType.level == 6) {
					return
				}
				this.currentTownShip = obj.value
				this.tmpArea = obj.label
				this.villageList = [{ village_code: 'all', village_name: '社区/村' }]
				this.currentVillage = 'all'
				this.unitList = [{ unit_id: 'all', name: '小区' }]
				this.currentUnit = 'all'
				this.getVillageList()
				this.getUnitList()
			},
			// 选取社区/村
			selectVillage: function (obj) {
				this.currentVillage = obj.value
				this.tmpArea = obj.label
				this.unitList = [{ unit_id: 'all', name: '小区' }]
				this.currentUnit = 'all'
				this.getUnitList()
			},
			// 选取小区
			selectUnit: function (obj) {
				this.currentUnit = obj.value
				this.tmpArea = obj.label
			},
			// 获取小区平均配备数据
			getAverageNumber: function () {
				axios.post('/safety/unitAverageNumber.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit
				}).then(response => {
					if(response.data.success) {
						let list1 = response.data.data.map(item => item.civilcount)
						let list2 = response.data.data.map(item => item.objectcount)
						let list3 = response.data.data.map(item => item.technicalcount)
						let tmpval = (parseInt(Math.max(...list1.concat(list2, list3)) / 5) + 1) * 5
						tmpval = tmpval > 100 ? 100 : tmpval
						this.chart1.setOption({
							xAxis: [
								{
									data: response.data.data.map(item => item.area)
								}
							],
							yAxis: [
								{
									max: tmpval
								}
							],
							series: [
								{
									name: '人防',
									data: list1
								},
								{
									name: '物防',
									data: list2
								},
								{
									name: '技防',
									data: list3
								}
							]
						})

						let civilcount = 0, objectcount = 0, technicalcount = 0
						for(let i = 0; i < response.data.data.length; i++) {
							civilcount = civilcount + parseInt(response.data.data[i]['civilcount'])
							objectcount = objectcount + parseInt(response.data.data[i]['objectcount'])
							technicalcount = technicalcount + parseInt(response.data.data[i]['technicalcount'])
						}
						civilcount = civilcount > 100 ? 100 : civilcount
						objectcount = objectcount > 100 ? 100 : objectcount
						technicalcount = technicalcount > 100 ? 100 : technicalcount
						let maxcount = Math.max(...[civilcount, objectcount, technicalcount])
						let splitcount = Math.ceil(maxcount / 6.0)
						let tmpseries = []
						tmpseries.push({
			        type: 'radar',
			        data: [
			          {
			            value: [civilcount, objectcount, technicalcount],
			            symbol: 'circle',
			            symbolSize: 5,
			            itemStyle: {
			              normal: {
			                color: '#fff'
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
			                color: 'rgba(78, 0, 255, 0.5)'
			              }
			            }
			          }
			        ]
						})
						for(let j = 5; j > 0; j--) {
							tmpseries.push({
				        type: 'radar',
				        data: [
				          {
				            value: [j * splitcount, j * splitcount, j * splitcount],
				            symbol: 'none',
				            lineStyle: {
				              normal: {
				                opacity: 0
				              }
				            },
				            areaStyle: {
				              normal: {
				                color: 'rgba(97, 120, 171, ' + 0.05 * (6 - j) + ')'
				              }
				            }
				          }
				        ]
							})
						}
						this.chart2.setOption({
							radar: [
					      {
					        indicator: [
					          { name: '人防', max: splitcount * 6 },
					          { name: '物防', max: splitcount * 6 },
					          { name: '技防', max: splitcount * 6  }
					        ]
					      }
							],
							series: tmpseries
						})
					}
					else {
						console.log('获取小区平均配备数据失败')
					}
				}).catch(err => {
					console.log('获取小区平均配备数据失败')
				})
			},
			// 获取人防数据
			getCivilDefence: function () {
				axios.post('/safety/civilDefence.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit
				}).then(response => {
					if(response.data.success) {
						this.policecount = response.data.data.communityPolice
						this.securitycount = response.data.data.fullTimeSecurityTeam
						this.teamcount = response.data.data.compulsorySecurityPatrol
					}
					else {
						console.log('获取人防数据失败')
					}
				}).catch(err => {
					console.log('获取人防数据失败')
				})
			},
			// 获取物防数据
			getObjectDefence: function () {
				axios.post('/safety/objectDefence.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit
				}).then(response => {
					if(response.data.success) {
						let tmpArr = response.data.data.map(item => item.number)
						let tmpval = (parseInt(Math.max(...tmpArr) / 5) + 1) * 5
						tmpval = tmpval > 100 ? 100 : tmpval
						this.chart3.setOption({
							xAxis: [
								{
									data: response.data.data.map(item => item.objectDefenceName)
								}
							],
							yAxis: [
								{
									max: tmpval 
								}
							],
							series: [
								{
									data: tmpArr
								}
							]
						})
					}
					else {
						console.log('获取物防数据失败')
					}
				}).catch(err => {
					console.log('获取物防数据失败')
				})
			},
			// 获取技防数据
			getTechnicalDefence: function () {
				axios.post('/safety/technicalDefence.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit
				}).then(response => {
					if(response.data.success) {
						let tmpArr = response.data.data.map(item => item.number)
						let tmpval = (parseInt(Math.max(...tmpArr) / 5) + 1) * 5
						tmpval = tmpval > 100 ? 100 : tmpval
						this.chart4.setOption({
							xAxis: [
								{
									data: response.data.data.map(item => item.sysTemName)
								}
							],
							yAxis: [
								{
									max: tmpval 
								}
							],
							series: [
								{
									data: tmpArr
								}
							]
						})
					}
					else {
						console.log('获取技防数据失败')
					}
				}).catch(err => {
					console.log('获取技防数据失败')
				})
			},
			// 按区域搜索
			btnSearch: function () {
				this.getAverageNumber()
				this.getCivilDefence()
				this.getObjectDefence()
				this.getTechnicalDefence()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.watchindex {
		padding: 0 0 20px;
	}
	.search-container {
		height: 100px;
		width: 100%; color: #3fa7ff; font-size: 18px; display: flex;	align-items: center; 
		label {
			color: #45c1fb; font-size: 20px; font-weight: bold; display: inline-flex; align-items: center; margin-right: 60px;
			i { font-size: 32px; margin-right: 5px; }
		}
		.v-select {
			width: 160px;
			margin-right: 30px;
		}
		.v-btn{
			margin-left: 50px;
		}
	}
	.bar-raddar {
		display: flex; padding: 10px 15px; height: 100%;
		.bar-chart {
			display: inline-flex; flex: 2; height: 100%;
		}
		.raddar-chart {
			display: inline-flex; flex: 1; height: 100%;
		}
	}
	.watch-security {
		width: 1655px; display: flex; margin-top: 20px; justify-content: space-between;
		.people-security {
			display: inline-flex;
			ul li {
				height: 150px; line-height: 142px; align-items: center;
				text-indent: 30px; color: #fff; border-bottom: 1px solid #6279ac;
				&:last-child { border: 0; }
				i { font-size: 48px; }
				label { font-size: 16px; margin-left: 10px; }
				b { font-size: 24px; }
			}
		}
		.goods-security {
			display: inline-flex;
		}
		.technology-security {
			display: inline-flex;
		}
	}
	.security-bar-chart {
		width: 100%; height: 100%; padding: 10px 10px;
	}
</style>