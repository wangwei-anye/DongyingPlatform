<template>
	<div class="tripindex">
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
      小区：
      <Select :value="currentUnit" @on-change="selectUnit" class="v-select" placeholder="小区">
        <Option v-for="item in unitList" :value="item.unit_id" :key="item.unit_id">{{ item.name }}</Option>
      </Select>
			<v-Button class='v-btn' :btnInfo="btnInfo" @click="btnSearch"></v-Button>
		</div>
		<!-- 今日人车流量 -->
		<div class="trip-totalflow">
			<v-panel title='今日人车流量' class='v-panel'>
				<div class="map-chart">
					<!-- 图表 -->
					<div class="trip-chart">
						<div class="trip-chart-title">
              今日人流量（人次）
            </div>
						<div class="trip-chart-detail" id="trip-chart-detail1"></div>
					</div>
          <div class="trip-chart">
            <div class="trip-chart-title">
              今日车流量（人次）
            </div>
            <div class="trip-chart-detail" id="trip-chart-detail2"></div>
          </div>
				</div>
			</v-panel>
		</div>
		<!-- 实时车流量 -->
		<div class="trip-carflow">
			<v-panel title='实时车流量' class='v-panel'>
				<div class="carflow-search">
					<label>时间</label>
					<DatePicker class="app-datepicker-travel" type="daterange" placement="bottom-start" :open="caropen" :editable="false" confirm @on-change="carHandleChange" @on-clear="carHandleClear" @on-ok="carHandleOk">
						<div class="date-container" @click="carHandleClick">
							<input type="text" readonly="readonly" :value="cardate[0]">
							<span>至</span>
							<input type="text" readonly="readonly" :value="!cardate[0] ? cardate[0] : cardate[1]">
						</div>
					</DatePicker>
			    <Tabs v-model="cargroup" class="app-tabs-travel" @on-click="selectCar">
			      <TabPane label="实时" name="1"></TabPane>
			      <TabPane label="昨天" name="5"></TabPane>
			      <TabPane label="最近7天" name="2"></TabPane>
			      <TabPane label="最近30天" name="3"></TabPane>
			      <TabPane label="最近半年" name="4"></TabPane>
			    </Tabs>
				</div>
				<div class="chart-data">
					<!-- 图表 -->
					<div class="carflow-chart">
						<div class="carflow-photo">
							<div class="carflow-jinchang">
								<img src="../../assets/image/jinchang.png" />
								<b>今日进场</b>
								<label>{{ carincount }}</label>
							</div>
							<div class="carflow-chuchang">
								<img src="../../assets/image/chuchang.png" />
								<b>今日出场</b>
								<label>{{ caroutcount }}</label>
							</div>
						</div>
						<div class="carflow-chart" id="carflow-chart"></div>
					</div>
					<!-- 表格 -->
					<div class="carflow-data">
						<Table class="hover-table" :columns="carcol" :data="cardata"></Table>
						<v-pagination :pageSize="6" :total="cartotal" :pageIndex="carpage" @toPage="toCarPage" class="pageBar" style="margin-top: 20px; text-align: center;"></v-pagination>
					</div>
				</div>
			</v-panel>
		</div>
    <!-- 实时人流量、门禁记录、抓拍图像记录 -->
    <div class="door-detail">
      <Tabs :value="tabvalue" class="staff-defense-tab" style="height: initial;" @on-click="toggleTab">
        <TabPane label="实时人流量" name="0"></TabPane>
        <TabPane label="门禁记录" name="1"></TabPane>
        <TabPane label="抓拍图像记录" name="2"></TabPane>
      </Tabs>
      <div class="door-detail-content">
        <DoorChart v-show="tabvalue == '0'" ref="chart" @doorcharttab="doorcharttab"></DoorChart>
        <DoorRecord v-show="tabvalue == '1'" ref="record" @recordclick="recordclick"></DoorRecord>
        <DoorPhoto v-show="tabvalue == '2'" ref="photo" @photoclick="photoclick"></DoorPhoto>
      </div>
    </div>
		<v-alarmAlert class="alarmAlert" v-show="showPhoto" :photoUrl="photoUrl" @close='showPhoto = false'></v-alarmAlert>
	</div>
</template>

<script>
  import echarts from 'echarts'
  import vButton from '@/components/Button'
  import vPanel from '@/components/Panel'
  import vLabel from '@/components/Label'
  import vPagination from '@/components/Pagination'
	import vAlarmAlert from '@/views/alarm/AlarmAlert'
  import DoorChart from './DoorChart'
  import DoorRecord from './DoorRecord'
  import DoorPhoto from './DoorPhoto'

  import axios from '../../utils/http.js'
  import { province_code, city_code, imgServerAddr } from '@/config'

	export default {
		name: 'tripindex',
		components: {
			vButton,
			vPanel,
			vLabel,
			vPagination,
			vAlarmAlert,
      DoorChart,
      DoorRecord,
      DoorPhoto
		},
		data () {
      return {
				showPhoto: false,
				photoUrl: '',
				btnInfo: {
					text: '查 询'
				},
        currentProvince: '',
        currentCity: '',
        townList: [{ town_code: 'all', town_name: '区县' }],
        currentTown: 'all',
        policeStationList: [{ id: 'all', police_station: '派出所' }],
        currentPoliceStation: 'all',
        unitList: [{ unit_id: 'all', name: '小区' }],
        currentUnit: 'all',
			  params: '',
			  timer: null,
			  chart1: null,
			  chart2: null,
			  chart3: null,
      	caropen: false,
      	cardate: ['', ''],
			  cargroup: '1',
			  carincount: '',
			  caroutcount: '',
			  carpage: 1,
				cartotal: 0,
        carcol: [
          {
          	key: 'io_time', title: '日期 - 时间', width: 135,
            render: (h, params) => {
            	let date = new Date(params.row.io_time)
            	let nowtime1 = '', nowtime2 = ''
            	nowtime1 += date.getFullYear() + '/'
            	nowtime1 += (date.getMonth() >= 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '/'
            	nowtime1 += (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate())
            	nowtime2 += (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()) + ':'
            	nowtime2 += (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()) + ':'
            	nowtime2 += date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
              return h('label', [
              	h('span', nowtime1),
              	h('br'),
              	h('span', nowtime2)
              ])
            }
          },
          {
          	key: 'user_name', title: '用户名', width: 108, ellipsis: true,
            render: (h, params) => {
              return h('span', {
              	attrs: { title: params.row.user_name }
              }, params.row.user_name)
            }
          },
          {
          	key: 'unit_name', title: '小区', ellipsis: true,
            render: (h, params) => {
              return h('span', {
              	attrs: { title: params.row.unit_name }
              }, params.row.unit_name)
            }
          },
          {
          	key: 'park_name', title: '车场', ellipsis: true,
            render: (h, params) => {
              return h('span', {
              	attrs: { title: params.row.park_name }
              }, params.row.park_name)
            }
          },
          { key: 'plate_num_cn', title: '车牌', width: 120 },
          { 
            key: 'io_type', title: '通行情况', width: 108,
            render: (h, params) => {
              return h('span', params.row.io_type == 0 ? '进场': '出场')
            }
          },
          { 
            key: 'io_picture_path', title: '抓拍图片', width: 108,
            render: (h, params) => {
              return h('img', {
                attrs: { src: params.row.io_picture_path, alt: '暂无图片' },
                style: { verticalAlign: 'middle', width: '36px', height: '36px' },
                on: {
                	click: () => {
                		this.showPhoto = true
                		this.photoUrl = params.row.io_picture_path
                	}
                }
              })
            }
          }
        ],
        cardata: [],
        tabvalue: '0'
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
			this.currentUnit = this.$store.state.platform.currentUnitId

	    let rolePermission = this.$store.state.global.accountInfo.rolePermission;
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
        // 派出所平台
        case 4:
        case 5:
        case 6:
        	this.getUnitList()
          break
        // 市局平台
        default:
          this.getTownList()
         	break
      }

			// 今日人流量柱状图
			this.chart1 = echarts.init(document.getElementById('trip-chart-detail1'))
			this.chart1.setOption({
		    grid: {
		      left: '0',
		      right: '20',
		      bottom: '0',
		      top: '0',
		      containLabel: true
		    },
		    tooltip: {
		    	padding: [4, 8],
		      trigger: 'axis',
		      formatter: '{b}<br/>人流量：{c0}<br/>小区数量：{c1}',
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
		          fontSize: 16,
		          fontWeight: 'bold',
		          color: '#00d1fe'
		        },
		        axisPointer: {
		          show: true,
		          type: 'line',
		          label: {
		          	textStyle: {
		          		fontSize: 16
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
		        type:'bar',
		        name: 'recordCount',
		        barWidth: '62%',
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
		        data:[]
		      },
		      {
		        type:'bar',
		        name: 'unitCount',
		        barWidth: '40%',
		        barGap: '-100%',
		        silent: true,
		        itemStyle: {
		          normal: {
		            color: 'transparent'
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
		      }
		    ]
			})
			// 今日车流量柱状图
			this.chart2 = echarts.init(document.getElementById('trip-chart-detail2'))
			this.chart2.setOption({
		    grid: {
		      left: '0',
		      right: '20',
		      bottom: '0',
		      top: '0',
		      containLabel: true
		    },
		    tooltip: {
		    	padding: [4, 8],
		      trigger: 'axis',
		      formatter: '{b}<br/>车流量：{c0}<br/>进场流量：{c1}<br/>出场流量：{c2}<br/>小区数量：{c3}',
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
		          fontSize: 16,
		          fontWeight: 'bold',
		          color: '#00d1fe'
		        },
		        axisPointer: {
		          show: true,
		          type: 'line',
		          label: {
		          	textStyle: {
		          		fontSize: 16
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
		        type:'bar',
		        name: 'recordCount',
		        barWidth: '62%',
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
		        data:[]
		      },
		      {
		        type:'bar',
		        name: 'carInCount',
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
		        name: 'carOutCount',
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
		        name: 'unitCount',
		        barWidth: '40%',
		        barGap: '-100%',
		        silent: true,
		        itemStyle: {
		          normal: {
		            color: 'transparent'
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
		      }
		    ]
			})
			// 车流量面积图
			this.chart3 = echarts.init(document.getElementById('carflow-chart'))
			this.chart3.setOption({
		    title: {
		      text: '车流量',
		      textStyle: {
		        fontSize: 18,
		        color: '#fff'
		      },
		      left: 20
		    },
		    color:['#186ee1','#b3c70f'],
		    legend: {
		      data:['进场', '出场'],
          selectedMode: false,
			    textStyle:{
			      color:'#fff',
			      fontSize:14
    			}
		    },
		    tooltip: {
		      trigger: 'axis',
		      formatter: '时间：{b}<br/>进场：{c0}<br/>出场：{c1}',
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
		        name: '进场',
		        smooth: true,
            symbol: 'none',
		        areaStyle: {
		          normal: {
		            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		              {
		                offset: 0,
		                color: 'rgba(37, 142, 180, 1)'
		              },
		              {
		                offset: 1,
		                color: 'rgba(0, 198, 255, 1)'
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
		      },
		      {
		        type:'line',
		        name: '出场',
		        smooth: true,
            symbol: 'none',
		        areaStyle: {
		          normal: {
		            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		              {
		                offset: 0,
		                color: 'rgba(255, 255, 255, .5)'
		              },
		              {
		                offset: 1,
		                color: 'rgba(255, 120, 21, .5)'
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
			// 获取数据
      this.params = '?province_code=' + this.currentProvince + '&city_code=' + this.currentCity
      this.params += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown)
      this.params += '&police_code=' + (this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation)
      this.params += '&unit_id=' + (this.currentUnit == 'all' ? '' : this.currentUnit)

			this.getCarRegionCount()
			this.getCarTotalCount()
			this.getCarDateCount()
			this.getCarRecord()

			this.getDoorRegionCount()
      this.$refs.chart.getDoorTotalCount(this.params)
      this.$refs.chart.getDoorDateCount(this.params)

      this.$refs.record.getDoorRecord(this.params)
      this.$refs.photo.getDoorPhoto(this.params)

			let _this = this
			this.timer = window.setInterval(function () {
				_this.getCarTotalCount()
        _this.$refs.chart.getDoorTotalCount(_this.params)
			}, 10000)
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
      // 获取小区
      getUnitList: function () {
        axios.post('/account/rolePermissionManager/selectUnitByPolice.do', {
          province_code: this.currentProvince,
          city_code: this.currentCity,
          town_code: this.currentTown == 'all' ? '' : this.currentTown,
          police_station: this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation
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
      // 选择区县
      selectTown: function (value) {
        this.currentTown = value
        this.policeStationList = [{ id: 'all', police_station: '派出所' }]
        this.currentPoliceStation = 'all'
        this.unitList = [{ unit_id: 'all', name: '小区' }]
        this.currentUnit = 'all'
        this.getPoliceStationList()
      },
      // 选取派出所
      selectPoliceStation: function (value) {
        this.currentPoliceStation = value
        this.unitList = [{ unit_id: 'all', name: '小区' }]
        this.currentUnit = 'all'
        this.getUnitList()
      },
      // 选取小区
      selectUnit: function (value) {
        this.currentUnit = value
      },
			// 按区域搜索
			btnSearch: function () {
				window.clearInterval(this.timer)
        this.params = '?province_code=' + this.currentProvince + '&city_code=' + this.currentCity
        this.params += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown)
        this.params += '&police_code=' + (this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation)
        this.params += '&unit_id=' + (this.currentUnit == 'all' ? '' : this.currentUnit)

      	this.cardate = ['', '']
			  this.cargroup = '1'
			  this.carpage = 1
				this.getCarRegionCount()
				this.getCarTotalCount()
				this.getCarDateCount()
				this.getCarRecord()

        this.getDoorRegionCount()
        this.$refs.chart.getDoorTotalCount(this.params)
        this.$refs.chart.getDoorDateCount(this.params)

	      this.$refs.record.getDoorRecord(this.params)
	      this.$refs.photo.getDoorPhoto(this.params)

        let _this = this
        this.timer = window.setInterval(function () {
          _this.getCarTotalCount()
          _this.$refs.chart.getDoorTotalCount(_this.params)
        }, 10000)
			},
			// 获取今日人流量数据（柱状图）
			getDoorRegionCount: function () {
				let groupType = 1
				if (this.currentTown != 'all' && this.currentTown != '') {
					groupType = 2
				}
				if (this.currentPoliceStation != 'all' && this.currentPoliceStation != '') {
					groupType = 3
				}
				if (this.currentUnit != 'all' && this.currentUnit != '') {
					groupType = 4
				}
				axios.get('/door/regionCount.do' + this.params + '&groupType=' + groupType).then(response => {
					let arealist = [], recordcount = [], tmparr = [], unitcount = []
					for(let key in response.data) {
						tmparr.push({ name: key, yAxis: key })
						arealist.push(key)
						recordcount.push(response.data[key]['recordCount'])
						unitcount.push(response.data[key]['unitCount'])
					}
					this.chart1.setOption({
				    xAxis : [
				      {
				        max: (parseInt(Math.max(...recordcount) / 5) + 1) * 5
				      }
				    ],
						yAxis: [
							{
								data: arealist
							}
						],
						series: [
							{
								name: 'recordCount',
								data: recordcount
							},
							{
								name: 'unitCount',
								data: unitcount,
								markLine: {
									data: tmparr
								}
							}
						]
					})
				}).catch(err => {
					console.log('获取今日人流量数据（柱状图）失败')
				})
			},
			// 获取今日车流量数据（柱状图）
			getCarRegionCount: function () {
				let groupType = 1
				if (this.currentTown != 'all' && this.currentTown != '') {
					groupType = 2
				}
				if (this.currentPoliceStation != 'all' && this.currentPoliceStation != '') {
					groupType = 3
				}
				if (this.currentUnit != 'all' && this.currentUnit != '') {
					groupType = 4
				}
				axios.get('/car/regionCount.do' + this.params + '&groupType=' + groupType).then(response => {
					let arealist = [], recordcount = [], tmparr = [], carincount = [], caroutcount = [], unitcount = []
					for(let key in response.data) {
						tmparr.push({ name: key, yAxis: key })
						arealist.push(key)
						recordcount.push(response.data[key]['recordCount'])
						carincount.push(response.data[key]['carInCount'])
						caroutcount.push(response.data[key]['carOutCount'])
						unitcount.push(response.data[key]['unitCount'])
					}
					this.chart2.setOption({
				    xAxis : [
				      {
				      	max: (parseInt(Math.max(...recordcount) / 5) + 1) * 5
				      }
				    ],
						yAxis: [
							{
								data: arealist
							}
						],
						series: [
							{
								name: 'recordCount',
								data: recordcount
							},
							{
								name: 'carInCount',
								data: carincount
							},
							{
								name: 'carOutCount',
								data: caroutcount
							},
							{
								name: 'unitCount',
								data: unitcount,
								markLine: {
									data: tmparr
								}
							}
						]
					})
				}).catch(err => {
					console.log('获取今日车流量数据（柱状图）失败')
				})
			},
			// 获取今日车流量数据（实时统计）
			getCarTotalCount: function () {
				axios.get('/car/dateCount.do' + this.params + '&groupType=1').then(response => {
					let incount = 0, outcount = 0
					for (let i = 0; i < response.data.length; i++) {
						for (let key in response.data[i]) {
							if (key.substr(14, 1) == 0) {
								incount += response.data[i][key]
							}
							else {
								outcount += response.data[i][key]
							}
						}						
					}
					this.carincount = incount
					this.caroutcount = outcount
				}).catch(err => {
					console.log('获取今日车流量数据（实时统计）失败')
				})
			},
			// 获取今日车流量数据（面积图）
			getCarDateCount: function () {
				let condition = this.params + '&groupType=' + this.cargroup
				if (this.cargroup == '6') {
					condition += '&start_time=' + this.cardate[0] + ' 00:00:00' + '&end_time=' + this.cardate[1] + ' 23:59:59'
				}
				axios.get('/car/dateCount.do' + condition).then(response => {
					let timelist = [], incountlist = [], outcountlist = []
					for (let i = 0; i < response.data.length; i++) {
						for (let key in response.data[i]) {
							if (this.cargroup == '1' || this.cargroup == '5') {
								if (key.substr(14, 1) == 0) {
									timelist.push(key.substr(11, 2) + ':00')
									incountlist.push(response.data[i][key])
								}
								else {
									outcountlist.push(response.data[i][key])
								}
							}
							else {
								if (key.substr(11, 1) == 0) {
									timelist.push(key.substr(5, 5))
									incountlist.push(response.data[i][key])
								}
								else {
									outcountlist.push(response.data[i][key])
								}
							}
						}						
					}
					this.chart3.setOption({
				    xAxis : [
				      {
				        data: timelist
				      }
				    ],
				    yAxis: [
				    	{
				    		max: (parseInt(Math.max(...incountlist.concat(outcountlist)) / 5) + 1) * 5
				    	}
				    ],
				    series : [
				      {
				      	name: '进场',
				        data: incountlist
				      },
				      {
				      	name: '出场',
				        data: outcountlist
				      }
				    ]
					})
				}).catch(err => {
					console.log(err)
					console.log('获取今日车流量数据（面积图）失败')
				})
			},
			// 获取今日车流量数据（表格）
			getCarRecord: function () {
				let condition = this.params + '&pageNo=' + this.carpage + '&pageSize=6'
				let nowdate = new Date()
				let startdate = '', enddate = ''
				enddate = nowdate.getFullYear() + '-' + (nowdate.getMonth() + 1) + '-' + nowdate.getDate() + ' 23:59:59'
				if (this.cargroup == '1') {
					startdate = nowdate.getFullYear() + '-' + (nowdate.getMonth() + 1) + '-' + nowdate.getDate() + ' 00:00:00'
				}
				else if (this.cargroup == '2') {
					nowdate.setDate(nowdate.getDate() - 7)
					startdate = nowdate.getFullYear() + '-' + (nowdate.getMonth() + 1) + '-' + nowdate.getDate() + ' 00:00:00'
				}
				else if (this.cargroup == '3') {
					nowdate.setDate(nowdate.getDate() - 30)
					startdate = nowdate.getFullYear() + '-' + (nowdate.getMonth() + 1) + '-' + nowdate.getDate() + ' 00:00:00'
				}
				else if (this.cargroup == '4') {
					nowdate.setDate(nowdate.getDate() - 180)
					startdate = nowdate.getFullYear() + '-' + (nowdate.getMonth() + 1) + '-' + nowdate.getDate() + ' 00:00:00'
				}
				else if (this.cargroup == '5') {
					nowdate.setDate(nowdate.getDate() - 1)
					startdate = nowdate.getFullYear() + '-' + (nowdate.getMonth() + 1) + '-' + nowdate.getDate() + ' 00:00:00'
					enddate = nowdate.getFullYear() + '-' + (nowdate.getMonth() + 1) + '-' + nowdate.getDate() + ' 23:59:59'
				}
				else if (this.cargroup == '6') {
					startdate = this.cardate[0] + ' 00:00:00'
					enddate = this.cardate[1] + ' 23:59:59'
				}
				condition += '&start_time=' + startdate + '&end_time=' + enddate
				axios.get('/car/record.do' + condition).then(response => {
					this.cartotal = response.data.totalCount
					this.cardata = response.data.items
				}).catch(err => {
					console.log('获取今日车流量数据（表格）失败')
				})
			},
			toCarPage: function (currentPage) {
				this.carpage = currentPage
				this.getCarRecord()
			},
			// 获取今日车流量数据（日期选择）
      carHandleClick () {
        this.caropen = !this.caropen
      },
      carHandleChange (cardate) {
        this.cardate = cardate
      },
      carHandleClear () {
        this.caropen = false
      },
      carHandleOk () {
        this.caropen = false
        this.cargroup = '6'
        this.carpage = 1
				this.getCarDateCount()
				this.getCarRecord()
      },
			// 获取今日车流量数据（标签页）
			selectCar: function (name) {
				this.cargroup = name
				this.carpage = 1
				this.cardate = ['', '']
				this.getCarDateCount()
				this.getCarRecord()
			},
      // 切换标签页
      toggleTab: function (tab) {
        this.tabvalue = tab
      },
      // 切换实时周月
      doorcharttab: function () {
        this.$refs.chart.getDoorDateCount(this.params)
      },
      // 门禁记录查询
      recordclick: function () {
      	this.$refs.record.getDoorRecord(this.params)
      },
      // 抓拍图像记录查询
      photoclick: function () {
      	this.$refs.photo.getDoorPhoto(this.params)
      }
		},
		destroyed: function () {
			window.clearInterval(this.timer)
		}
	}
</script>

<style lang='scss' scoped>
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

	.trip-totalflow {
    margin-bottom: 20px;
		.map-chart { display: flex; }
		.trip-chart {
			display: inline-flex; flex: 1; flex-direction: column; padding: 15px 15px;
			.trip-chart-title { line-height: 36px; font-size: 18px; color: #fff; font-weight: bold; padding-left: 30px; }
			.trip-chart-detail { height: 700px; margin-bottom: 14px; }
		}
	}

	.trip-carflow {
    margin-bottom: 20px;
    .carflow-search {
    	display: flex; margin-top: 15px; justify-content: flex-end; align-items: center;
    	label {
    		font-size: 16px; color: #1cb1ff; margin-right: 10px;
    	}
    }
		.chart-data { display: flex; align-items: center; height: 800px; }
		.carflow-chart {
			display: inline-flex; flex: 1; flex-direction: column;
			.carflow-photo {
				text-align: center; margin-bottom: 24px;
        .carflow-jinchang {
        	display: inline-block; width: 250px; height: 250px; text-align: center; margin-right: 15px;
        	b { display: inline-block; width: 100%; font-size: 18px; color: #57e1ff; margin-top: 10px; }
        	label { font-size: 48px; color: #fff; }
        }
        .carflow-chuchang {
        	display: inline-block; width: 250px; height: 250px; text-align: center; margin-left: 15px;
        	b { display: inline-block; width: 100%; font-size: 18px; color: #ffda2e; margin-top: 10px; }
        	label { font-size: 48px; color: #fff; }
        }
			}
			.carflow-tool { line-height: 24px; text-align: center; font-size: 14px; }
			.carflow-chart { height: 350px; }
		}
		.carflow-data { display: inline-flex; flex-direction: column; height: 800px; flex: 1; padding: 15px 15px; }
	}

	.trip-manflow {
    margin-bottom: 20px;
    .manflow-search {
    	display: flex; margin-top: 15px; justify-content: flex-end; align-items: center;
    	label {
    		font-size: 16px; color: #1cb1ff; margin-right: 10px;
    	}
    }
		.chart-data { display: flex; align-items: center; height: 800px; }
		.manflow-chart {
			display: inline-flex; flex: 1; flex-direction: column;
			.manflow-photo {
				text-align: center; margin-bottom: 24px;
        .manflow-kaimen {
        	display: inline-block; width: 280px; height: 250px; text-align: center; margin-right: 15px;
        	b { display: inline-block; width: 100%; font-size: 18px; color: #57e1ff; margin-top: 10px; }
        	label { font-size: 48px; color: #fff; }
        }
			}
			.manflow-tool { line-height: 24px; text-align: center; font-size: 14px; }
			.manflow-chart { height: 350px; }
		}
		.manflow-data { display: inline-flex; flex-direction: column; height: 800px; flex: 1; padding: 15px 15px; }
	}

  .door-detail {
    margin-right: 20px; margin-bottom: 15px;
    .door-detail-content {
      height: 750px; padding: 15px 15px; background: rgba(15, 145, 255, .2);
    }
  }
</style>