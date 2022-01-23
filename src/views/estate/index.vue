<template>
	<div class="estateindex">
		<!-- 区域搜索 -->
		<div class="search-container">
			区县：
			<Select :value="currentTown" @on-change="selectTown" class="v-select" placeholder="区县">
				<Option v-for="item in townList" :value="item.town_code" :key="item.town_code">{{ item.town_name }}</Option>
			</Select>
			派出所：
			<Select :value="currentPoliceStation" @on-change="selectPoliceStation" class="v-select" placeholder="派出所">
				<Option v-for="item in policeStationList" :value="item.id" :key="item.id">{{ item.police_station }}</Option>
			</Select>
			<v-Button class='v-btn' :btnInfo="btnInfo" @click="btnSearch"></v-Button>
		</div>
		<!-- 小区分布 -->
		<div class="estate-distribute">
			<v-panel title='小区分布' class='v-panel'>
				<div class="map-chart">
					<!-- 地图 -->
					<div class="estate-totalcount">
	    	    经济开发区：<label>{{ estatecount }}</label>&thinsp;个小区
					</div>
					<!-- 图表 -->
					<div class="estate-chart" id="estate-bar-chart"></div>
				</div>
			</v-panel>
		</div>
		<!-- 小区概况 -->
		<div class="estate-survey">
			<v-panel title='小区概况' class='v-panel'>
				<div class='estate-survey-title'>
		      <div class="estate-survey-name"></div>
		      <div class="estate-survey-count"><small>小区总数：</small>{{ estatecount }}</div>
				</div>
				<!-- 小区概况仪表图 -->
				<div class="estate-survey-content">
					<div class="estate-survey-chart">
						<div class="chart-detail" id="estate-survey-chart1"></div>
					</div>
					<div class="estate-survey-chart">
						<div class="chart-detail" id="estate-survey-chart2"></div>
					</div>
					<div class="estate-survey-chart">
						<div class="chart-detail" id="estate-survey-chart3"></div>
					</div>
				</div>
			</v-panel>
		</div>
		<!-- 小区列表 -->
		<div class="estate-list">
			<v-panel  title='小区列表' class='v-panel'>
				<div class="estate-search">
					<vSearchbar placeholder="请输入小区名称" @searchHandler="searchUnit"></vSearchbar>
				</div>
				<div class="estate-detail" v-if="!unitList || unitList.length == 0">
					<div class="left-top1"></div><div class="left-top2"></div>
					<div class="right-top1"></div><div class="right-top2"></div>
					<div class="left-bottom1"></div><div class="left-bottom2"></div>
					<div class="right-bottom1"></div><div class="right-bottom2"></div>
					<div class="detail-container" style="color: #fff; text-align: center; font-size: 16px;">
						小区不存在，请重新输入
					</div>
				</div>
				<div class="estate-detail" v-for="item in unitList">
					<div class="left-top1"></div><div class="left-top2"></div>
					<div class="right-top1"></div><div class="right-top2"></div>
					<div class="left-bottom1"></div><div class="left-bottom2"></div>
					<div class="right-bottom1"></div><div class="right-bottom2"></div>
					<div class="detail-container">
						<div class="detail-info">
							<label>
								<i class="icon iconfont icon-font-xiaoqu"></i>
								<b :title="item.unit_name">{{ item.unit_name }}</b>
							</label>
							<span v-if="item.unit_type == 1">小区类型：开放式</span>
							<span v-else-if="item.unit_type == 2">小区类型：封闭式</span>
							<span v-else>小区类型：混合式</span>
							<span>地址：<b :title="item.address">{{ item.address }}</b></span>
							<span>经纬度：{{ item.lng }}，{{ item.lat }}</span>
						</div>
						<div class="detail-other">
							<i class="icon iconfont icon-font-fangwu"></i>
							<label>房屋数量（户）</label>
							<span>{{ item.house_count }}</span>
						</div>
						<div class="detail-other">
							<i class="icon iconfont icon-font-shiyourenkou"></i>
							<label>人口数量（人）</label>
							<span>{{ item.population_count }}</span>
						</div>
						<div class="detail-other">
							<i class="icon iconfont icon-font-70"></i>
							<label>用电量（kwh）</label>
							<span>{{ item.electric_count }}</span>
						</div>
						<div class="detail-other">
							<i class="icon iconfont icon-font-shuifei"></i>
							<label>用水量（t）</label>
							<span>{{ item.water_count }}</span>
						</div>
						<div class="detail-other">
							<i class="icon iconfont icon-font-tianranqi"></i>
							<label>天然气（m<sup>3</sup>）</label>
							<span>{{ item.gas_count }}</span>
						</div>
					</div>
				</div>
				<div class='page-container'>
					<v-pagination :pageSize="3" :total="totalNum" :pageIndex="currentPage" @toPage="toPage" class="pageBar"></v-pagination>
				</div>
			</v-panel>
		</div>
	</div>
</template>

<script>
  import echarts from 'echarts'
  import vButton from '@/components/Button'
  import vPanel from '@/components/Panel'
  import vSearchbar from '@/components/Searchbar'
  import vPagination from '@/components/Pagination'

  import axios from '../../utils/http.js'
  import { province_code, city_code } from '@/config'

	export default {
		name: 'estateindex',
		components:{
			vButton,
			vPanel,
			vSearchbar,
			vPagination
		},
		data () {
			return {
				btnInfo: {
					text: '查 询'
				},
				currentProvince: '',
				currentCity: '',
			  townList: [{ town_code: 'all', town_name: '区县' }],
			  currentTown: 'all',
			  policeStationList: [{ id: 'all', police_station: '派出所' }],
			  currentPoliceStation: 'all',
			  unitList: [],
			  currentUnit: 'all',
			  estatecount: 0,
			  chart1: null,
			  chart2: null,
			  chart3: null,
			  chart4: null,
			  currentUnitName: '',
			  currentPage: 1,
				totalNum: 0
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
			this.currentPoliceStation = this.$store.state.platform.currentPoliceCode
			
	    let rolePermission = this.$store.state.global.accountInfo.rolePermission
	    if (rolePermission.town_code && rolePermission.town_code !== '') {
				this.townList = [{ town_code: rolePermission.town_code, town_name: rolePermission.town_name }]
				this.currentTown = rolePermission.town_code
	    }
	    if (rolePermission.police_code && rolePermission.police_code !== '') {
				this.policeStationList = [{ id: rolePermission.police_code, police_station: rolePermission.police_name }]
				this.currentPoliceStation = rolePermission.police_code
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
          this.getPoliceStationList()
          break
        // 市局平台
        default:
          this.getTownList()
         	break
      }

			// 小区分布柱状图
			this.chart1 = echarts.init(document.getElementById('estate-bar-chart'))
			this.chart1.setOption({
		    grid: {
		      left: '0',
		      right: '20',
		      bottom: '10',
		      top: '10',
		      containLabel: true
		    },
		    tooltip: {
		    	padding: [4, 8],
		      trigger: 'axis',
		      formatter: '{b}<br/>小区数量：{c0}<br/>房屋数量：{c1}<br/>人口数量：{c2}',
		      axisPointer: {
		        type: 'line'
		      },
		      backgroundColor: 'rgba(219, 108, 69, .8)'
		    },
		    yAxis : [
		      {
		        type : 'category',
		        data : [],
		        axisLine: {
		          lineStyle: {
		            color: '#79dcfd',
		            width: 1	
		          }
		        },
		        axisTick: {
		          show: false
		        },
		        axisLabel: {
		          fontSize: 14,
		          color: '#00d1fe'
		        },
		        axisPointer: {
		          show: true,
		          type: 'line',
		          label: {
		          	textStyle: {
		          		fontSize: 14
		          	}
		          },
		          lineStyle: {
		            width: 0
		          }
		        }
		      }
		    ],
		    xAxis : [
		      {
		        position: 'top',
		        type : 'value',
		        axisLine: {
		          show: false
		        },
		        axisTick: {
		          show: false
		        },
		        axisLabel: {
		          fontSize: 16,
		          color: '#fff'
		        },
		        splitLine: {
		          show: false
		        }
		      }
		    ],
		    series : [
		      {
		        type:'bar',
		        name: 'unitcount',
		        barWidth: '40%',
		        silent: true,
		        itemStyle: {
		          normal: {
		            barBorderRadius: [0, 100, 100, 0],
		            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
		              {
		                offset: 0,
		                color: '#00559d'
		              },
		              {
		                offset: 1,
		                color: '#0fa8d0'
		              }
		            ])
		          }
		        },
		        data:[],
		        markLine: {
		        	symbolSize: 1,
		        	label: {
		        		normal: {
		        			show: false
		        		}
		        	},
		          lineStyle: {
		          	normal: {
			            color: '#959595',
			            type: 'dashed'			          		
		          	}
		          },
		        	data: []
		        }
		      },
		      {
		        type:'bar',
		        name: 'roomcount',
		        barWidth: '40%',
		        barGap: '-100%',
		        silent: true,
		        itemStyle: {
		          normal: {
		            color: 'transparent'
		          }
		        },
		        data:[]
		      },
		      {
		        type:'bar',
		        name: 'peoplecount',
		        barWidth: '40%',
		        barGap: '-100%',
		        silent: true,
		        itemStyle: {
		          normal: {
		            color: 'transparent'
		          }
		        },
		        data:[]
		      }
		    ]
			})
      // 仪表盘 - 混合式
      this.chart2 = echarts.init(document.getElementById('estate-survey-chart1'))
			this.chart2.setOption({
		    series: [
		      {
		        type: 'gauge',
		        radius: '100%',
		        axisLine: {
		          lineStyle: {
		            color: [[0, '#1eb2ff'], [1, '#005399']],
		            width: 30
		          }
		        },
		        splitLine: {
		          length: 25,
		          lineStyle: {
		            color: '#fff',
		            width: 4
		          }
		        },
		        axisTick: {
		          length: 10,
		          lineStyle: {
		            color: '#fff',
		            width: 2
		          }
		        },
		        axisLabel: {
		          distance: 10,
		          color: '#fff',
		          fontSize: 20
		        },
		        pointer: {
		          width: 5
		        },
		        itemStyle: {
		          normal: {
		            color: '#ffda2e'
		          }
		        },
		        title: {
		          offsetCenter: [0, '90%'],
		          rich: {
		            a: {
		              color: '#1cb1ff',
		              fontSize: 18,
		              padding: [0, 0, 10, 0]
		            },
		            b: {
		              color: '#fff',
		              fontSize: 36,
		              padding: [0, 0, 0, 0]
		            },
		            c: {
		              color: '#fff',
		              fontSize: 18,
		              padding: [0, 0, 10, 2]
		            }
		          }
		        },
		        detail: {
		          formatter: '{value}{a|%}',
		          offsetCenter: [0, '45%'],
		          color: '#ffda2e',
		          fontSize: 48,
		          rich: {
		            a: {
		              color: '#ffda2e',
		              fontSize: 18,
		              padding: [0, 0, 15 , 2]
		            }
		          }
		        },
		        data: [{value: 0, name: '{a|混合式：}{b|}{c|个}'}]
		      }
		    ],
		    graphic: {
		      elements: [
		        {
		          type: 'circle',
		          left: 'center',
		          top: 'center',
		          shape: { r: 36 },
		          style: { fill: '#00569c'}
		        },
		        {
		          type: 'circle',
		          left: 'center',
		          top: 'center',
		          shape: { r: 18 },
		          style: { fill: '#1cb1ff'}
		        }
		      ]
		    }
			})
      // 仪表盘 - 开放式
      this.chart3 = echarts.init(document.getElementById('estate-survey-chart2'))
			this.chart3.setOption({
		    series: [
		      {
		        type: 'gauge',
		        radius: '100%',
		        axisLine: {
		          lineStyle: {
		            color: [[0, '#1eb2ff'], [1, '#005399']],
		            width: 30
		          }
		        },
		        splitLine: {
		          length: 25,
		          lineStyle: {
		            color: '#fff',
		            width: 4
		          }
		        },
		        axisTick: {
		          length: 10,
		          lineStyle: {
		            color: '#fff',
		            width: 2
		          }
		        },
		        axisLabel: {
		          distance: 10,
		          color: '#fff',
		          fontSize: 20
		        },
		        pointer: {
		          width: 5
		        },
		        itemStyle: {
		          normal: {
		            color: '#ffda2e'
		          }
		        },
		        title: {
		          offsetCenter: [0, '90%'],
		          rich: {
		            a: {
		              color: '#1cb1ff',
		              fontSize: 18,
		              padding: [0, 0, 10, 0]
		            },
		            b: {
		              color: '#fff',
		              fontSize: 36,
		              padding: [0, 0, 0, 0]
		            },
		            c: {
		              color: '#fff',
		              fontSize: 18,
		              padding: [0, 0, 10, 2]
		            }
		          }
		        },
		        detail: {
		          formatter: '{value}{a|%}',
		          offsetCenter: [0, '45%'],
		          color: '#ffda2e',
		          fontSize: 48,
		          rich: {
		            a: {
		              color: '#ffda2e',
		              fontSize: 18,
		              padding: [0, 0, 15 , 2]
		            }
		          }
		        },
		        data: [{value: 0, name: '{a|开放式：}{b|}{c|个}'}]
		      }
		    ],
		    graphic: {
		      elements: [
		        {
		          type: 'circle',
		          left: 'center',
		          top: 'center',
		          shape: { r: 36 },
		          style: { fill: '#00569c'}
		        },
		        {
		          type: 'circle',
		          left: 'center',
		          top: 'center',
		          shape: { r: 18 },
		          style: { fill: '#1cb1ff'}
		        }
		      ]
		    }
			})
      // 仪表盘 - 封闭式
      this.chart4 = echarts.init(document.getElementById('estate-survey-chart3'))
			this.chart4.setOption({
		    series: [
		      {
		        type: 'gauge',
		        radius: '100%',
		        axisLine: {
		          lineStyle: {
		            color: [[0, '#1eb2ff'], [1, '#005399']],
		            width: 30
		          }
		        },
		        splitLine: {
		          length: 25,
		          lineStyle: {
		            color: '#fff',
		            width: 4
		          }
		        },
		        axisTick: {
		          length: 10,
		          lineStyle: {
		            color: '#fff',
		            width: 2
		          }
		        },
		        axisLabel: {
		          distance: 10,
		          color: '#fff',
		          fontSize: 20
		        },
		        pointer: {
		          width: 5
		        },
		        itemStyle: {
		          normal: {
		            color: '#ffda2e'
		          }
		        },
		        title: {
		          offsetCenter: [0, '90%'],
		          rich: {
		            a: {
		              color: '#1cb1ff',
		              fontSize: 18,
		              padding: [0, 0, 10, 0]
		            },
		            b: {
		              color: '#fff',
		              fontSize: 36,
		              padding: [0, 0, 0, 0]
		            },
		            c: {
		              color: '#fff',
		              fontSize: 18,
		              padding: [0, 0, 10, 2]
		            }
		          }
		        },
		        detail: {
		          formatter: '{value}{a|%}',
		          offsetCenter: [0, '45%'],
		          color: '#ffda2e',
		          fontSize: 48,
		          rich: {
		            a: {
		              color: '#ffda2e',
		              fontSize: 18,
		              padding: [0, 0, 15 , 2]
		            }
		          }
		        },
		        data: [{value: 0, name: '{a|封闭式：}{b|}{c|个}'}]
		      }
		    ],
		    graphic: {
		      elements: [
		        {
		          type: 'circle',
		          left: 'center',
		          top: 'center',
		          shape: { r: 36 },
		          style: { fill: '#00569c'}
		        },
		        {
		          type: 'circle',
		          left: 'center',
		          top: 'center',
		          shape: { r: 18 },
		          style: { fill: '#1cb1ff'}
		        }
		      ]
		    }
			})
			// 获取数据
			this.getDistribution()
			this.getStatistics()
			this.getList()
		},
		methods: {
			// 获取区县
			getTownList: function () {
				axios.post('/option/getTownByField.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity
				}).then(response => {
					if(response.data.success) {
						this.townList = [{ town_code: 'all', town_name: '区县' }].concat(response.data.data)
						this.currentTown = this.$store.state.platform.currentTownCode
						if (this.currentTown != '' && this.currentTown != 'all') {
							this.getTownShipList()
						}
					}
					else {
						console.log('获取区县失败')
					}
				}).catch(err => {
					console.log('获取区县失败')
				})
			},
			// 获取派出所
			getPoliceStationList: function () {
				axios.post('/account/rolePermissionManager/selectPoliceS.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown
				}).then(response => {
					if(response.data.success) {
						this.policeStationList = [{ id: 'all', police_station: '派出所' }].concat(response.data.data)
						this.currentPoliceStation = this.$store.state.platform.currentPoliceCode
					}
					else {
						console.log('获取派出所失败')
					}
				}).catch(err => {
					console.log('获取派出所失败')
				})
			},
			// 选择区县
			selectTown: function (value) {
				this.currentTown = value
				this.policeStationList = [{ id: 'all', police_station: '派出所' }]
				this.currentPoliceStation = 'all'
				this.getPoliceStationList()
			},
			// 选取派出所
			selectPoliceStation: function (value) {
				this.currentPoliceStation = value
			},
			// 按区域搜索
			btnSearch: function () {
				this.currentUnitName = ''
				this.getDistribution()
				this.getStatistics()
				this.getList()
			},
			// 获取小区分布数据
			getDistribution: function () {
				axios.post('/unit/distribution.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					police_station: this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation
				}).then(response => {
					if(response.data.success) {
						this.chart1.setOption({
					    xAxis : [
					      {
					        max: (parseInt(Math.max(...response.data.data.map(item => item.count)) / 5) + 1) * 5
					      }
					    ],
							yAxis: [{
								data: response.data.data.map(item => item.name)
							}],
							series: [
								{
									name: 'unitcount',
									data: response.data.data.map(item => item.count),
									markLine: {
										data: response.data.data.map((item) => {return {name: item.name, yAxis: item.name}})
									}
								},
								{
									name: 'roomcount',
									data: response.data.data.map(item => item.room_count)
								},
								{
									name: 'peoplecount',
									data: response.data.data.map(item => item.people_count)
								}
							]
						})						
					}
					else {
						console.log('获取小区分布数据失败')
					}
				}).catch(err => {
					console.log('获取小区分布数据失败')
				})
			},
			// 获取小区概况数据
			getStatistics: function () {
				axios.post('/unit/statistics.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					police_station: this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation
				}).then(response => {
					if(response.data.success) {
						this.estatecount = response.data.data.totalCount
						let percount1 = 1.0
						// 混合式
						if (response.data.data.totalCount <= 0) {
							percount1 = 0
						}
						else {
							percount1 = (percount1 * response.data.data.unitTypeCount.otherUnit / response.data.data.totalCount).toFixed(4)
						}
						this.chart2.setOption({
							series: [{
								axisLine: {
									lineStyle: {
										color: [[percount1, '#1eb2ff'], [1, '#005399']]
									}
								},
								data: [{value: (percount1 * 100).toFixed(2), name: '{a|混合式：}{b|' + response.data.data.unitTypeCount.otherUnit +'}{c|个}'}]
							}]
						})
						let percount2 = 1.0
						// 开放式
						if (response.data.data.totalCount <= 0) {
							percount2 = 0
						}
						else {
							percount2 = (percount2 * response.data.data.unitTypeCount.openUnit / response.data.data.totalCount).toFixed(4)
						}
						this.chart3.setOption({
							series: [{
								axisLine: {
									lineStyle: {
										color: [[percount2, '#1eb2ff'], [1, '#005399']]
									}
								},
								data: [{value: (percount2 * 100).toFixed(2), name: '{a|开放式：}{b|' + response.data.data.unitTypeCount.openUnit +'}{c|个}'}]
							}]
						})
						let percount3 = 0
						if (response.data.data.totalCount > 0) {
							percount3 = (1.0 - percount1 - percount2).toFixed(4)
						}
						// 封闭式
						this.chart4.setOption({
							series: [{
								axisLine: {
									lineStyle: {
										color: [[percount3, '#1eb2ff'], [1, '#005399']]
									}
								},
								data: [{value: (percount3 * 100).toFixed(2), name: '{a|封闭式：}{b|' + response.data.data.unitTypeCount.closeUnit +'}{c|个}'}]
							}]
						})
					}
					else {
						console.log('获取小区概况数据失败')
					}
				}).catch(err => {
					console.log('获取小区概况数据失败')
				})
			},
			// 获取小区列表数据
			getList: function () {
				axios.post('/unit/list.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					police_code: this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation,
					unit_name: this.currentUnitName,
					pageNo: this.currentPage,
					pageSize: 3
				}).then(response => {
					if(response.data.success) {
						if (this.currentUnit != 'all' && this.currentUnit != '') {
							this.totalNum = 1
							let self = this
							this.unitList = response.data.data.items.filter(function(element) {
								return element.unit_id == self.currentUnit
							})
						}
						else {
							this.totalNum = response.data.data.totalCount
							this.unitList = response.data.data.items
						}
					}
					else {
						console.log('获取小区列表数据失败')
					}
				}).catch(err => {
					console.log('获取小区列表数据失败')
				})
			},
			// 搜索小区
			searchUnit: function (name) {
				this.currentUnitName = name
				this.currentPage = 1
				this.getList()
			},
			toPage: function (currentPage) {
				this.currentPage = currentPage
				this.getList()
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.search-container {
		width: 100%; height: 100px; color: #3fa7ff; font-size: 18px; display: flex;	align-items: center;
		.v-select {
			width: 160px;
			margin-right: 30px;
		}
		.v-btn{
			margin-left: 50px;
		}
	}
	.estate-distribute {
		margin-bottom: 20px;
		.map-chart { display: flex; }
		.estate-totalcount {
			display: inline-flex; height: 480px; flex: 1; padding-left: 80px; align-items: center; font-size: 38px; color: #009bfe;
			label { color: #ffdd40; font-size: 60px; }
		}
		.estate-chart { display: inline-flex; height: 480px; flex: 1; }
	}

	.estate-survey {
		margin-bottom: 20px;
		.estate-survey-title {
			width: 100%; height: 57px;
			background-image: url('../../assets/image/securityCount-logo.png'); background-repeat: no-repeat;
			.estate-survey-name { 
				display:inline-block; font-size: 18px; color: #1cb1ff; padding-left: 57px; padding-top: 6px;
			}
			.estate-survey-count {
				display: inline-block; float: right; line-height: 57px; color: #fff; font-size: 36px; margin-right: 30px;
				small { font-size: 50%; }
			}
		}
		.estate-survey-content {
			width: 100%; display: flex; padding: 30px 0 50px 0;
			.estate-survey-chart {
				display: inline-flex; flex: 1;
				.chart-detail { width: 100%; height:400px; }
			}
		}
	}
	.estate-list {
		margin-bottom: 20px;
		.estate-search {
			padding: 20px 20px; text-align: right;
		}
	}
	.estate-detail {
		margin: 0 20px 20px 20px; padding: 5px 5px;
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
			background: linear-gradient(0deg, rgba(0, 165, 255, .4), rgba(23, 87, 166, .4)); display: flex;
      .detail-info {
      	width: 450px; display: inline-flex; flex-direction: column; color: #ffda2e; font-size: 18px;
      	padding: 15px 15px; position: relative; font-weight:bold;
      	label {
      		font-size: 30px; font-weight: bold; margin-bottom: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
      		i { font-size: 48px; font-weight: normal; margin-right: 5px; }
      	}
      	span {
      		overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
      	}
      	&:before {
      		content: ''; width: 1px; height: 62%; background-color: rgba(28, 177, 255, .4);
      		position: absolute; right: 1px; top: 19%;
      	}
      }
      .detail-other {
      	display: inline-flex; flex-direction: column; flex: 1; text-align: center; align-items: center;
      	i { font-size: 64px; color: #1cb1ff; }
      	label { font-size: 18px; color: #1cb1ff; }
      	span { color: #fff; font-size: 30px; }
      }
		}
	}
	.page-container {
		text-align: center; padding-bottom: 20px;
	}
</style>