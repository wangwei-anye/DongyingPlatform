<template>
	<div class="techdefense">
		<TwoHeader title="技防数据"></TwoHeader>
		<div class="contentPage">
			<v-panel title="技防数据" class="v-panel" :width="1864">
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
					<div class="table-detail" v-for="item, index in datalist">
						<div class="left-top1"></div><div class="left-top2"></div>
						<div class="right-top1"></div><div class="right-top2"></div>
						<div class="left-bottom1"></div><div class="left-bottom2"></div>
						<div class="right-bottom1"></div><div class="right-bottom2"></div>
						<div class="detail-container">
					    <Collapse class="safety-collapse">
				        <Panel>
				        	<b class="icon iconfont icon-font-juzhudizhi"></b>
				        	<label>{{ item[0].unit_name }}</label>
				        	<div slot="content">
	                  <div class="tech-tool">
	                    <Button v-if="techindex != index" class="app-button-table" @click="setTechDefense(index, item.slice(1))">
	                      <Icon type="edit" />
	                    </Button>
	                  </div>
			            	<div class="collape-list">
			            		<div class="collape-list-itemodd">类目</div>
			            		<div class="collape-list-itemeven">实际数量</div>
			            		<div class="collape-list-itemodd">类目</div>
			            		<div class="collape-list-itemeven">实际数量</div>
			            		<template v-for="obj, i in item.slice(1)">
				            		<div class="collape-list-itemodd">{{ obj.defence_name }}</div>
				            		<div class="collape-list-itemeven collape-list-empty">
				            			<label v-if="techindex != index">{{ obj.defence_count }}</label>
				            			<InputNumber class="app-input-number" v-if="techindex == index" v-model="techdata[i].defence_count" :min="0" :max="999999999" :precision="0" style="width: 120px;"></InputNumber>
				            		</div>		            			
			            		</template>
			            	</div>
	                  <div class="tool-button" v-if="techindex == index">
	                    <Button class="app-button-confirm" @click="submitTech(item[0].unit_id)">确 认</Button>
	                    <Button class="app-button-confirm" @click="techindex = -1">取 消</Button>
	                  </div>
				        	</div>
				        </Panel>
					    </Collapse>
						</div>
					</div>
					<!-- 分页 -->
					<div class='page-container'>
						<v-pagination :pageSize="7" :total="totalNum" :pageIndex="currentPage" @toPage="toPage" class="pageBar">
						</v-pagination>
					</div>
				</div>
			</v-panel>
		</div>
    <v-password-modal />
    <v-username-modal />
    <v-logout-modal />
	</div>
</template>

<script>
  import TwoHeader from '@/components/section/TwoHeader.vue'
  import vButton from '@/components/Button'
  import vPagination from '@/components/Pagination'
  import vPanel from '@/components/Panel'
	import vPasswordModal from '@/components/section/PasswordModal'
	import vUsernameModal from '@/components/section/UsernameModal'
	import vLogoutModal from '@/components/section/LogoutModal'

  import axios from '../../utils/http.js'
  import { province_code, city_code } from '@/config'

	export default {
		name: 'techdefense',
		components: {
			TwoHeader,
			vButton,
			vPagination,
			vPanel,
	    vPasswordModal,
	    vUsernameModal,
	    vLogoutModal
		},
		data () {
			return {
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
        techindex: -1,
        techdata: []
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
			this.getTechList()	
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
				this.getTechList()
			},
			// 跳转页码
			toPage: function(currentPage) {
				this.currentPage = currentPage
				this.getTechList()
			},
			// 获取技防数据详情
			getTechList: function () {
				let params = '?province_code=' + this.currentProvince + '&city_code=' + this.currentCity
				params +=  (this.currentTown == 'all' ? '' : '&town_code=' + this.currentTown)
				params += (this.currentTownShip == 'all' ? '' : '&township_code=' + this.currentTownShip)
				params += (this.currentVillage == 'all' ? '' : '&village_code=' + this.currentVillage)
				params += (this.currentUnit == 'all' ? '' : '&unit_id=' + this.currentUnit)
				params += '&pageNow=' + this.currentPage
				axios.get('/safety/technicalSecurityTotalSearch.do' + params).then(response => {
					if(response.data.success) {
						this.totalNum = parseInt(response.data.data[0][0]['rowCount'])
						this.datalist = response.data.data.slice(1)
						this.techindex = -1
					}
					else {
						console.log('获取技防数据详情失败')
					}
				}).catch(err => {
					console.log('获取技防数据详情失败')
				})				
			},
      // 技防数据设置
      setTechDefense: function (index, tmparr) {
        this.techdata = tmparr.map(item => { return { defence_name: item.defence_name, defence_count: parseInt(item.defence_count) } })
        this.techindex = index
      },
      submitTech: function (unit_id) {
        let str = 'province_code=' + this.currentProvince + '&city_code=' + this.currentCity
        str += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown)
        str += '&township_code=' + (this.currentTownShip == 'all' ? '' : this.currentTownShip)
        str += '&village_code=' + (this.currentVillage == 'all' ? '' : this.currentVillage)
        str += '&unit_id=' + unit_id
        for (let i = 0; i < this.techdata.length; i++) {
          str += '&defenceName=' + this.techdata[i].defence_name + '_' + this.techdata[i].defence_count
        }
        axios.post('/safety/updateTechnicalSecurityTotal.do?' + str).then(response => {
          if (response.data.success) {
            this.getTechList()
          }
          else {
            console.log('物防标准设置失败')
          }
        }).catch(err => {
          console.log('物防标准设置失败')
        })
      }
		}
	}
</script>

<style lang="scss" scoped>
	.techdefense {
		width: 1920px; height: 1080px; background: url(../../assets/image/appBg.jpg) no-repeat;	position: relative;
		position: relative;
		.contentPage {
			position: absolute; top: 90px; bottom: 0; left: 0; right: 0; 
			overflow-x: hidden; overflow-y: auto; padding: 30px 30px;
		}
		.contentPage::-webkit-scrollbar {
			display: none;
		}
	}
	.main-content {
		padding: 0 228px;
		.search-container {
			width: 100%; color: #3fa7ff; font-size: 18px; display: flex;	align-items: center; padding: 20px 0;
			.v-select {
				width: 160px;
				margin-right: 30px;
			}
			.v-btn{
				margin-left: 30px;
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
      .tech-tool {
        display: flex; align-items: center; justify-content: flex-end; margin-bottom: 10px;
        label {
          font-size: 16px; color: #1cb1ff;
        }
      }
			.collape-list {
				width: 100%; color: #fff; font-size: 18px; display: flex; flex-wrap: wrap;
				border-left: 2px solid #125f9d; border-top: 2px solid #125f9d; margin-top: 10px;
				.collape-list-itemodd {
					background-color: rgba(12, 62, 130, .5); width: 18%; padding: 15px 0;
					border-right: 2px solid #125f9d; border-bottom: 2px solid #125f9d; text-align: center;
				}
				.collape-list-itemeven {
					background-color: rgba(12, 62, 130, .5); width: 32%;  padding: 15px 0;
					border-right: 2px solid #125f9d; border-bottom: 2px solid #125f9d; text-align: center;
				}
				.collape-list-empty {
					background-color: transparent; color: #1cb1ff;
				}
			}
      .tool-button {
        text-align: center; margin-top: 15px;
        .app-button-confirm:first-child {
          margin-right: 30px;
        }
      }
		}
	}
	.page-container {
		text-align: center; padding-bottom: 20px;
	}
</style>