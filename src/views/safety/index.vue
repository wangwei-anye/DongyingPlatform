<template>
	<div class="safetyindex">
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
		<!-- 小区户数分布 -->
		<div class="safety-distribute">
			<v-panel title='小区户数分布' class='v-panel'>
				<div class="safety-search">
					<div class="date-select">
						<label>时间</label>
						<DatePicker class="app-datepicker-travel" type="daterange" placement="bottom-start" :open="mapopen" :editable="false" confirm @on-change="mapHandleChange" @on-clear="mapHandleClear" @on-ok="mapHandleOk">
							<div class="date-container" @click="mapHandleClick">
								<input type="text" readonly="readonly" :value="mapdate[0]">
								<span>至</span>
								<input type="text" readonly="readonly" :value="!mapdate[0] ? mapdate[0] : mapdate[1]">
							</div>
						</DatePicker>
					</div>
					<v-Label switchAble :tabArr="tabArr" :activeIndex="mapgroup" class="label" @switchTabIndex="selectMapGroup"></v-Label>
				</div>
				<div class="safety-map">
					<iframe :src="faanmap" width="100%" height="100%" allowtransparency="true" style="border:none; overflow:hidden">
					</iframe>
				</div>
			</v-panel>
		</div>
		<!-- 小区安全指数综合排行 -->
		<div class="safety-ranking">
			<v-panel title='小区安全指数综合排行' class='v-panel'>
				<div class="safety-search">
					<div class="date-select">
						<label>时间</label>
						<div class="date-select-input">
							<DatePicker class="app-datepicker-travel" type="daterange" placement="bottom-start" :open="rankopen" :editable="false" confirm @on-change="rankHandleChange" @on-clear="rankHandleClear" @on-ok="rankHandleOk">
								<div class="date-container" @click="rankHandleClick">
									<input type="text" readonly="readonly" :value="rankdate[0]">
									<span>至</span>
									<input type="text" readonly="readonly" :value="!rankdate[0] ? rankdate[0] : rankdate[1]">
								</div>
							</DatePicker>
						</div>
					</div>
					<v-Label switchAble :tabArr="tabArr" :activeIndex="rankgroup" class="label" @switchTabIndex="selectRankGroup"></v-Label>
				</div>
				<div class="safety-table">
					<Table class="hover-table" :columns="rankcol" :data="rankdata"></Table>
				</div>
				<div class='page-container'>
					<v-pagination :pageSize="8" :total="totalNum" :pageIndex="currentPage" @toPage="toPage" class="pageBar"></v-pagination>
				</div>
			</v-panel>
		</div>
	</div>
</template>

<script>
  import vPanel from '@/components/Panel'
  import vLabel from '@/components/Label'
  import vButton from '@/components/Button'
  import vPagination from '@/components/Pagination'

  import axios from '../../utils/http.js'
  import { province_code, city_code } from '@/config'

	export default {
		name: 'safetyindex',
		components: {
			vPanel,
			vLabel,
			vButton,
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
			  unitList: [{ unit_id: 'all', name: '小区' }],
			  currentUnit: 'all',
			  faanmap: 'static/map/faanmap.html',
				tabArr: ['实时', '周', '月'],
      	rankopen: false,
      	rankdate: ['', ''],
				rankgroup: 0,
      	mapopen: false,
      	mapdate: ['', ''],
				mapgroup: 0,
        rankcol: [
          {
          	key: 'rank', title: '排行', width: 90,
          	render: (h, params) => {
          		return h('span', (this.currentPage - 1) * 10 + params.index + 1)
          	}
          },
          {
          	key: 'unitName', title: '小区', ellipsis: true,
          	render: (h, params) => {
          		return h('span', {
          			attrs: { title: params.row.unitName }
          		}, params.row.unitName)
          	}
          },
          { key: 'casePoliceRate', title: '案件' },
          { key: 'caseRate', title: '告警处置率' },
          { key: 'externalPersonRate', title: '外来人员' },
          { key: 'specialPersonRate', title: '重点人员' },
          {
          	key: 'compositeIndex', title: '综合指数',
          	render: (h, params) => {
          		let tmp = params.row.up == 0 ? 'ivu-icon ivu-icon-arrow-up-c' : 'ivu-icon ivu-icon-arrow-down-c'
          		return h('label', [
              	h('span', params.row.compositeIndex),
              	h('i', { 
              		class: tmp,
              		style: { color: '#e8cb42', marginLeft: '5px' }
              	}, '')
              ])
          	}
          },
          { 
            key: 'detail', title: '详情', width: 90,
            render: (h, params) => {
              return h('i', {
                class: 'ivu-icon ivu-icon-more',
                style: { cursor: 'pointer' },
                on: {
                  click: () => {
                    this.$router.push('/ranking?unitid=' + params.row.unitId + '&unitname=' + params.row.unitName)
                  }
                }
              })
            }
          }
        ],
        rankdata: [],
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
			let tmpmap = 'static/map/faanmap.html?city_code=' + this.currentCity
			tmpmap += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown)
			tmpmap += '&police_code=' + (this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation)
			tmpmap += '&realtime='
			this.faanmap = tmpmap
			this.getRealTimeRanking()
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
				this.rankgroup = 0
				this.ranktime = ''
				this.mapgroup = 0
				this.mapdate = ['', '']
				let tmpmap = 'static/map/faanmap.html?city_code=' + this.currentCity
				tmpmap += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown)
				tmpmap += '&police_code=' + (this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation)
				tmpmap += '&realtime='
				this.faanmap = tmpmap
				this.getRealTimeRanking()
			},
			// 获取实时小区发案指数排行
			getRealTimeRanking: function () {
				axios.post('/safety/unitCaseArisesIndexRealTime.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					police_code: this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit,
					pageNow: this.currentPage
				}).then(response => {
					if(response.data.success) {
						this.totalNum = parseInt(response.data.data[0]['page'].split(',')[2])
						this.rankdata = response.data.data.slice(1)
					}
					else {
						console.log('获取实时小区发案指数排行失败')
					}
				}).catch(err => {
					console.log('获取实时小区发案指数排行失败')
				})
			},
			// 获取最近一周小区发案指数排行
			getWeekRanking: function () {
				axios.post('/safety/unitCaseArisesIndexWeek.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					police_code: this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit,
					pageNow: this.currentPage
				}).then(response => {
					if(response.data.success) {
						this.totalNum = parseInt(response.data.data[0]['page'].split(',')[2])
						this.rankdata = response.data.data.slice(1)
					}
					else {
						console.log('获取最近一周小区发案指数排行失败')
					}
				}).catch(err => {
					console.log('获取最近一周小区发案指数排行失败')
				})
			},
			// 获取最近一个月小区发案指数排行
			getMonthRanking: function () {
				axios.post('/safety/unitCaseArisesIndexMonth.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					police_code: this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit,
					pageNow: this.currentPage
				}).then(response => {
					if(response.data.success) {
						this.totalNum = parseInt(response.data.data[0]['page'].split(',')[2])
						this.rankdata = response.data.data.slice(1)
					}
					else {
						console.log('获取最近一个月小区发案指数排行失败')
					}
				}).catch(err => {
					console.log('获取最近一个月小区发案指数排行失败')
				})
			},
			// 获取时间范围小区发案指数排行
			getDatetimeRanking: function () {
				axios.post('/safety/unitCaseArisesIndexInputTime.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					police_code: this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit,
					pageNow: this.currentPage,
					startTime: this.rankdate[0],
					endTime: this.rankdate[1]
				}).then(response => {
					if(response.data.success) {
						this.totalNum = parseInt(response.data.data[0]['page'].split(',')[2])
						this.rankdata = response.data.data.slice(1)
					}
					else {
						console.log('获取时间范围小区发案指数排行失败')
					}
				}).catch(err => {
					console.log('获取时间范围小区发案指数排行失败')
				})
			},
			// 选择小区户数分布时间
      mapHandleClick () {
        this.mapopen = !this.mapopen
      },
      mapHandleChange (mapdate) {
        this.mapdate = mapdate
      },
      mapHandleClear () {
        this.mapopen = false
      },
      mapHandleOk () {
      	this.mapopen = false
				let tmpmap = 'static/map/faanmap.html?city_code=' + this.currentCity
				tmpmap += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown)
				tmpmap += '&police_code=' + (this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation)
				if (!this.mapdate[0]) {
					this.mapgroup = 0
					tmpmap += '&realtime='
				}
				else {
					this.mapgroup = -1
					tmpmap += '&time=' + this.mapdate[0] + '/' + this.mapdate[1]
				}
				this.faanmap = tmpmap
      },
			// 按天周月选择地图
			selectMapGroup: function (index) {
				this.mapdate = ['', '']
				this.mapgroup = index
				let tmpmap = 'static/map/faanmap.html?city_code=' + this.currentCity
				tmpmap += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown)
				tmpmap += '&police_code=' + (this.currentPoliceStation == 'all' ? '' : this.currentPoliceStation)
				if (index == 0) {
					tmpmap += '&realtime='
				}
				else if (index == 1) {
					tmpmap += '&week='
				}
				else if (index == 2) {
					tmpmap += '&month='
				}
				this.faanmap = tmpmap
			},
			// 选择小区安全指数综合排行时间
      rankHandleClick () {
        this.rankopen = !this.rankopen
      },
      rankHandleChange (rankdate) {
        this.rankdate = rankdate
      },
      rankHandleClear () {
        this.rankopen = false
      },
      rankHandleOk () {
      	this.rankopen = false
				if (!this.rankdate[0]) {
					this.rankgroup = 0
					this.getRealTimeRanking()
				}
				else {
					this.rankgroup = -1
					this.getDatetimeRanking()
				}
      },
			// 按天周月选择
			selectRankGroup: function (index) {
				this.rankdate= ''
				this.rankgroup = index
				if (index == 0) {
					this.getRealTimeRanking()
				}
				else if (index == 1) {
					this.getWeekRanking()
				}
				else if (index == 2) {
					this.getMonthRanking()
				}
			},
			// 跳转页码
			toPage: function (currentPage) {
				this.currentPage = currentPage
				if (this.rankgroup == 0) {
					this.getRealTimeRanking()
				}
				else if (this.rankgroup == 1) {
					this.getWeekRanking()
				}
				else if (this.rankgroup == 2) {
					this.getMonthRanking()
				}
				else {
					this.getDatetimeRanking()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-container {
		width: 100%; height: 100px; color: #3fa7ff; font-size: 18px; display: flex;	align-items: center;
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

	.safety-distribute {
    margin-bottom: 20px;
    .safety-search {
    	width: 100%; display: inline-flex; justify-content: flex-end; align-items: center;
    	padding: 15px 15px; line-height: 32px; font-size: 14px;
    	label { font-size: 16px; color: #1cb1ff; line-height: 16px; font-weight: bold; margin-right: 10px; }
    }
    .safety-map {
    	width: 100%; height: 750px; pointer-events: none;
    }
	}

	.safety-ranking {
    margin-bottom: 20px;
    .safety-search {
    	width: 100%; display: inline-flex; justify-content: flex-end; align-items: center;
    	padding: 15px 15px; line-height: 32px; font-size: 14px;
    	label { font-size: 16px; color: #1cb1ff; line-height: 16px; font-weight: bold; margin-right: 10px; }
    }
    .safety-table {
    	padding: 0 20px 20px 20px;
    }
	}
	.page-container {
		text-align: center; padding-bottom: 20px;
	}
	.date-select {
		display: inline-block; margin-right: 20px;
		.date-select-input {
			display: inline-block; position: relative;
		}
	}
</style>