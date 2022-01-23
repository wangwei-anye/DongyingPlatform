<template>
	<div class="watchteam">
		<div class="main-content">
			<!-- 区域搜索 -->
			<div class="search-container">
				县区：
				<Select :value="currentTown" @on-change="selectTown" class="v-select" placeholder="县区">
					<Option v-for="item in townList" :value="item.town_code" :key="item.town_code">{{ item.town_name }}</Option>
				</Select>
				街道办/乡镇：
				<Select :value="currentTownShip" @on-change="selectTownShip" class="v-select" placeholder="街道办/乡镇">
					<Option v-for="item in townShipList" :value="item.township_code" :key="item.township_code">{{ item.township_name }}</Option>
				</Select>
				社区/村：
				<Select :value="currentVillage" @on-change="selectVillage" class="v-select" placeholder="社区/村">
					<Option v-for="item in villageList" :value="item.village_code" :key="item.village_code">{{ item.village_name }}</Option>
				</Select>
				小区：
				<Select :value="currentUnit" @on-change="selectUnit" class="v-select" placeholder="小区">
					<Option v-for="item in unitList" :value="item.unit_id" :key="item.unit_id">{{ item.name }}</Option>
				</Select>
				<v-Button class='v-btn' :btnInfo="btnInfo" @click="btnSearch"></v-Button>
			</div>
			<!-- 表格数据 -->
			<div class="table-detail" v-for="item in datalist">
				<div class="left-top1"></div><div class="left-top2"></div>
				<div class="right-top1"></div><div class="right-top2"></div>
				<div class="left-bottom1"></div><div class="left-bottom2"></div>
				<div class="right-bottom1"></div><div class="right-bottom2"></div>
				<div class="detail-container">
			    <Collapse class="safety-collapse">
		        <Panel>
		        	<b class="icon iconfont icon-font-juzhudizhi"></b>
		        	<label>{{ item[0].unitName }}</label>
		        	<b class="icon iconfont icon-font-jiuyuanduiwu"></b>
		        	<label>义务治安巡逻队伍（{{ item[0].fullTimeCount }}人）</label>
		        	<div slot="content">
								<div class="addwatchteam">
									<img src="../../assets/image/special/icon/tianjia.png" height="38" width="38" alt="" @click="addWatchteam(item[0].unitId)">
								</div>
			        	<Table class="stripe-table" :columns="tablecols" :data="changeData(item)"></Table>
		        	</div>
		        </Panel>
			    </Collapse>
				</div>
			</div>
			<div class='page-container'>
				<v-pagination :pageSize="7" :total="totalNum" :pageIndex="currentPage" @toPage="toPage" class="pageBar">
				</v-pagination>
			</div>
		</div>
		<WatchteamEdit v-if="showedit" :idcard="idcard" :watchteam="selectWatchteam" @editsure="editsure" @editcancle="editcancle">
		</WatchteamEdit>
		<WatchteamDelete v-if="showdel" :watchteam="selectWatchteam" @delsure="delsure" @delcancle="delcancle"></WatchteamDelete>
		<v-alarmAlert class="alarmAlert" style="position: absolute;" v-show="showPhoto" :photoUrl="photoUrl" @close='showPhoto = false'></v-alarmAlert>
	</div>
</template>

<script>
  import vButton from '@/components/Button'
  import vPagination from '@/components/Pagination'
  import WatchteamEdit from '@/views/watch/watchteamedit'
  import WatchteamDelete from '@/views/watch/watchteamdelete'
	import vAlarmAlert from '@/views/alarm/AlarmAlert'

  import axios from '../../utils/http.js'
  import { province_code, city_code, imgServerAddr } from '@/config'

	export default {
		name: 'watchteam',
		components: {
			vButton,
			vPagination,
			WatchteamEdit,
			WatchteamDelete,
			vAlarmAlert
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
			  townList: [{ town_code: 'all', town_name: '县区' }],
			  currentTown: 'all',
			  townShipList: [{ township_code: 'all', township_name: '街道办/乡镇' }],
			  currentTownShip: 'all',
			  villageList: [{ village_code: 'all', village_name: '社区/村' }],
			  currentVillage: 'all',
			  unitList: [{ unit_id: 'all', name: '小区' }],
			  currentUnit: 'all',
			  datalist: [],
			  totalNum: 0,
			  currentPage: 1,
        tablecols: [
          { 
            key: 'image', title: '照片',
            render: (h, params) => {
              return h('img', {
                attrs: { src: imgServerAddr + '/' + params.row.image + '?p=0', alt: '暂无图片' },
                style: { verticalAlign: 'middle', width: '64px', height: '64px', lineHeight: '64px' },
                on: {
                	click: () => {
                		this.showPhoto = true
                		this.photoUrl = imgServerAddr + '/' + params.row.image + '?p=0'
                	}
                }
              })
            }
          },
          { key: 'name', title: '姓名' },
          {
          	key: 'sex', title: '性别',
            render: (h, params) => {
              return h('span', params.row.sex == 0 ? '男' : '女')
            }
          },
          { key: 'id_card', title: '身份证' },
          { key: 'tel', title: '电话号码' },
          { 
            key: 'more', title: '操作',
            render: (h, params) => {
              return h('div', [
								h('i', {
	                class: 'ivu-icon ivu-icon-edit',
	                style: {
	                	fontSize: '20px',
	                	cursor: 'pointer',
	                	marginRight: '20px'
	                },
	                on: { click: (e) => { this.updWatchteam(params.row) } }
	              }),
								h('i', {
	                class: 'ivu-icon ivu-icon-close',
	                style: {
	                	fontSize: '20px',
	                	cursor: 'pointer'
	                },
	                on: { click: (e) => { this.delWatchteam(params.row) } }
	              })
              ])
            }
          }
        ],
        showedit: false,
        showdel: false,
        idcard: '',
        selectWatchteam: null
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
			// 获取数据
			// this.getTownList()
			this.getWatchTeamList()
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
			selectTown: function (value) {
				if (this.$store.state.global.accountInfo.rolePermission.roleType.level >=3 && this.$store.state.global.accountInfo.rolePermission.roleType.level <= 6) {
					return
				}

				this.currentTown = value
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
			selectTownShip: function (value) {
				if (this.$store.state.global.accountInfo.rolePermission.roleType.level == 5 || this.$store.state.global.accountInfo.rolePermission.roleType.level == 6) {
					return
				}

				this.currentTownShip = value
				this.villageList = [{ village_code: 'all', village_name: '社区/村' }]
				this.currentVillage = 'all'
				this.unitList = [{ unit_id: 'all', name: '小区' }]
				this.currentUnit = 'all'
				this.getVillageList()
				this.getUnitList()
			},
			// 选取社区/村
			selectVillage: function (value) {
				this.currentVillage = value
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
				this.getWatchTeamList()
			},
			// 跳转页码
			toPage: function(currentPage) {
				this.currentPage = currentPage
				this.getWatchTeamList()
			},
			// 获取义务治安巡逻队伍详情
			getWatchTeamList: function () {
				axios.post('/safety/compulsorySecurityPatrolDetails.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit,
					pageNow: this.currentPage
				}).then(response => {
					if(response.data.success) {
						this.totalNum = parseInt(response.data.data[0][0]['page'].split(',')[2])
						this.datalist = response.data.data.slice(1)
					}
					else {
						console.log('获取义务治安巡逻队伍详情失败')
					}
				}).catch(err => {
					console.log('获取义务治安巡逻队伍详情失败')
				})				
			},
			// 添加治安巡逻队员
			addWatchteam: function (unitid) {
				let watchteam = {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: unitid,
					name: '',
					sex: '0',
					id_card: '',
					tel: '',
					image: '',
					full_image: '',
					creator_name: this.$store.state.global.accountInfo.account
				}
				this.idcard = ''
				this.selectWatchteam = watchteam
				this.showedit = true
				this.showdel = false
			},
			// 修改治安巡逻队员
			updWatchteam: function (obj) {
				let watchteam = {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: obj.unitid,
					name: obj.name,
					sex: obj.sex,
					id_card: obj.id_card,
					tel: obj.tel,
					image: obj.image,
					full_image: obj.full_image,
					creator_name: this.$store.state.global.accountInfo.account
				}
				this.idcard = obj.id_card
				this.selectWatchteam = watchteam
				this.showedit = true
				this.showdel = false
			},
			// 删除治安巡逻队员
			delWatchteam: function (obj) {
				let watchteam = {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: obj.unitid,
					name: obj.name,
					sex: obj.sex,
					id_card: obj.id_card,
					tel: obj.tel,
					image: obj.image,
					full_image: obj.full_image,
					creator_name: this.$store.state.global.accountInfo.account
				}
				this.selectWatchteam = watchteam
				this.showedit = false
				this.showdel = true
			},
			// 确认编辑
			editsure: function () {
				// 必填项
				if (!this.selectWatchteam.name.trim()) {
					this.$Message.warning('姓名为必填项')
					return
				}
				if (this.selectWatchteam.sex != '0' && this.selectWatchteam.sex != '1') {
					this.$Message.warning('性别为必填项')
					return
				}
				if (!this.selectWatchteam.id_card.trim()) {
					this.$Message.warning('身份证为必填项')
					return
				}
				if (!this.selectWatchteam.tel.trim()) {
					this.$Message.warning('电话为必填项')
					return
				}
				let func = '/safety/addCompulsorySecurityPatrol.do'
				if (this.idcard) {
					func = '/safety/updateCompulsorySecurityPatrol.do'
				}
				axios.post(func, {
					province_code: this.selectWatchteam.province_code,
					city_code: this.selectWatchteam.city_code,
					town_code: this.selectWatchteam.town_code,
					township_code: this.selectWatchteam.township_code,
					village_code: this.selectWatchteam.village_code,
					unit_id: this.selectWatchteam.unit_id,
					name: this.selectWatchteam.name,
					sex: this.selectWatchteam.sex,
					id_card: this.selectWatchteam.id_card,
					tel: this.selectWatchteam.tel,
					full_image: this.selectWatchteam.full_image ? this.selectWatchteam.full_image : '',
					image: this.selectWatchteam.image,
					creator_name: this.selectWatchteam.creator_name
				}).then(response => {
					if(response.data.success) {
						this.showedit = false
						this.$Message.success(this.idcard ? '修改成功' : '添加成功')
						this.currentPage = 1
						this.getWatchTeamList()
					}
					else {
						this.$Message.error(response.data.msg)
					}
				}).catch(err => {
					this.$Message.error(response.data.msg)
				})
			},
			// 取消编辑
			editcancle: function () {
				this.showedit = false
			},
			// 确认删除
			delsure: function () {
				axios.post('/safety/deleteCompulsorySecurityPatrol.do', this.selectWatchteam).then(response => {
					if(response.data.success) {
						this.showdel = false
						this.$Message.success('删除成功')
						this.getWatchTeamList()
					}
					else {
						this.$Message.error('删除失败')
					}
				}).catch(err => {
					this.$Message.error('删除失败')
				})
			},
			// 取消删除
			delcancle: function () {
				this.showdel = false
			},
			// 转换数据
			changeData: function (arr) {
				let tmparr = arr.slice(1)
				tmparr = tmparr.map(item => { item.unitid = arr[0].unitId; return item })
				return tmparr
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main-content {
		height: 900px; padding: 15px 40px; background: rgba(15, 145, 255, .2); overflow: auto;
	  &::-webkit-scrollbar {
	  	width: 8px;
	  }
	  &::-webkit-scrollbar-button {
	  	display: none;
	  }
	  &::-webkit-scrollbar-track {
	  	border-radius: 4px; background-color: #0e5897;
	  }
	  &::-webkit-scrollbar-thumb {
	  	border-radius: 4px; background-color: #1cb1ff;
	  }
		.search-container {
			width: 100%; height: 48px; margin-bottom: 20px;
			color: #3fa7ff; font-size: 18px; display: flex;	align-items: center;
			.v-select {
				width: 160px;
				margin-right: 30px;
			}
			.v-btn{
				margin-left: 50px;
			}
			.addstaff {
				display: inline-flex; flex: 1; justify-content: flex-end;
				img { cursor: pointer; }
			}
		}
	}
	.table-detail {
		margin-bottom: 20px; padding: 5px 5px;
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
			background: linear-gradient(0deg, rgba(0, 165, 255, .2), rgba(23, 87, 166, .2)); padding: 20px 120px;
			.addwatchteam {
				text-align: right; margin-bottom: 5px; margin-top: -15px;
				img { cursor: pointer; }
			}
		}
	}
	.page-container {
		text-align: center;
	}
</style>