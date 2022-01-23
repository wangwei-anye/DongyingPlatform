<template>
	<div class="police">
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
				<div class="addstaff">
					<img src="../../assets/image/special/icon/tianjia.png" height="38" width="38" alt="" @click="addStaff">
				</div>
			</div>
			<Table class="stripe-table" :columns="columns" :data="data"></Table>
			<div class='page-container'>
				<v-pagination :pageSize="7" :total="totalNum" :pageIndex="currentPage" @toPage="toPage" class="pageBar"></v-pagination>
			</div>
			<!-- 编辑模态框 -->
			<vEdit v-if="showedit" :pno="pno" :police="selectPolice" @editsure="editsure" @editcancle="editcancle"></vEdit>
			<!-- 删除模态框 -->
			<vDelete v-if="showdel" :police="selectPolice" @delsure="delsure" @delcancle="delcancle"></vDelete>
		</div>
		<v-alarmAlert class="alarmAlert" v-show="showPhoto" :photoUrl="photoUrl" @close='showPhoto = false'></v-alarmAlert>
	</div>
</template>

<script>
  import vButton from '@/components/Button'
  import vPagination from '@/components/Pagination'
  import vDelete from '@/views/watch/delete'
  import vEdit from '@/views/watch/edit'
	import vAlarmAlert from '@/views/alarm/AlarmAlert'

  import axios from '../../utils/http.js'
  import { province_code, city_code, imgServerAddr } from '@/config'

	export default {
		name: 'police',
		components: {
			vButton,
			vPagination,
			vDelete,
			vEdit,
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
			  totalNum: 0,
			  currentPage: 1,
        columns: [
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
          { key: 'work_unit', title: '工作单位' },
          { key: 'police_no', title: '警号' },
          { key: 'tel', title: '电话' },
          { 
          	key: 'unit_idList', title: '分管片区',
            render: (h, params) => {
            	let tmparr = params.row.unit_idList.split('#').map(item => item.split(':')[1])
              return h('span', tmparr.toString())
            }
          },
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
	                on: { click: (e) => { this.updStaff(params.row) } }
	              }),
								h('i', {
	                class: 'ivu-icon ivu-icon-close',
	                style: {
	                	fontSize: '20px',
	                	cursor: 'pointer'
	                },
	                on: { click: (e) => { this.delStaff(params.row) } }
	              })
              ])
            }
          }
        ],
        data: [],
        showedit: false,
        showdel: false,
        pno: '',
        selectPolice: null
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

			this.getStaff()
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
				this.getStaff()
			},
			// 获取社区民警
			getStaff: function () {
				axios.post('/safety/policeDetails.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit,
					pageNow: this.currentPage
				}).then(response => {
					if(response.data.success) {
						this.totalNum = parseInt(response.data.data[response.data.data.length - 1].rowCount)
						if (this.totalNum > 0) {
							this.data = response.data.data.slice(0, response.data.data.length - 1)
						}
						else {
							this.data = []
						}
					}
					else {
						console.log('获取县区失败')
					}
				}).catch(err => {
					console.log('获取县区失败')
				})
			},
			// 跳转页码
			toPage: function (currentPage) {
				this.currentPage = currentPage
				this.getStaff()
			},
			// 添加社区民警
			addStaff: function () {
				let police = {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit,
					name: '',
					sex: '0',
					work_unit: '',
					tel: '',
					police_no: '',
					full_image: '',
					image: '',
					unit_idList: ''
				}
				this.pno = ''
				this.selectPolice = police
				this.showedit = true
				this.showdel = false	
			},
			// 编辑社区民警
			updStaff: function (obj) {
				let police = {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit,
					name: obj.name,
					sex: obj.sex,
					work_unit: obj.work_unit,
					tel: obj.tel,
					police_no: obj.police_no,
					full_image: obj.full_image,
					image: obj.image,
					unit_idList: obj.unit_idList
				}
				this.pno = obj.police_no
				this.selectPolice = police
				this.showedit = true
				this.showdel = false
			},
			// 确认编辑
			editsure: function () {
				// 必填项
				if (!this.selectPolice.name.trim()) {
					this.$Message.warning('姓名为必填项')
					return
				}
				if (this.selectPolice.sex != '0' && this.selectPolice.sex != '1') {
					this.$Message.warning('性别为必填项')
					return
				}
				if (!this.selectPolice.police_no.trim()) {
					this.$Message.warning('警号为必填项')
					return
				}
				if (!this.selectPolice.tel.trim()) {
					this.$Message.warning('电话为必填项')
					return
				}
				if (!this.selectPolice.work_unit.trim()) {
					this.$Message.warning('工作单位为必填项')
					return
				}
				if (!this.selectPolice.unit_idList) {
					this.$Message.warning('分管片区为必填项')
					return
				}
				let func = '/safety/addPolice.do'
				if (this.pno) {
					func = '/safety/updatePolice.do'
				}
				let tmplist = ''
				if (this.selectPolice.unit_idList.length > 0) {
					tmplist = this.selectPolice.unit_idList.split('#').map(item => item.split(':')[0]).toString()
				}
				axios.post(func, {
					province_code: this.selectPolice.province_code,
					city_code: this.selectPolice.city_code,
					town_code: this.selectPolice.town_code,
					township_code: this.selectPolice.township_code,
					village_code: this.selectPolice.village_code,
					unit_id: this.selectPolice.unit_id,
					name: this.selectPolice.name,
					sex: this.selectPolice.sex,
					work_unit: this.selectPolice.work_unit,
					tel: this.selectPolice.tel,
					police_no: this.selectPolice.police_no,
					full_image: this.selectPolice.full_image ? this.selectPolice.full_image : '',
					image: this.selectPolice.image,
					unit_idList: tmplist
				}).then(response => {
					if(response.data.success) {
						this.showedit = false
						this.$Message.success(this.pno ? '修改成功' : '添加成功')
						this.currentPage = 1
						this.getStaff()
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
			// 删除社区民警
			delStaff: function (obj) {
				let police = {
					province_code: this.currentProvince,
					city_code: this.currentCity,
					town_code: this.currentTown == 'all' ? '' : this.currentTown,
					township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
					village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
					unit_id: this.currentUnit == 'all' ? '' : this.currentUnit,
					name: obj.name,
					sex: obj.sex,
					work_unit: obj.work_unit,
					tel: obj.tel,
					police_no: obj.police_no,
					full_image: obj.full_image,
					image: obj.image,
					unit_idList: obj.unit_idList
				}
				this.selectPolice = police
				this.showedit = false
				this.showdel = true
			},
			// 确认删除
			delsure: function () {
				this.currentPage = 1
				axios.post('/safety/deletePolice.do', this.selectPolice).then(response => {
					if(response.data.success) {
						this.showdel = false
						this.$Message.success('删除成功')
						this.getStaff()
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main-content {
		height: 900px; padding: 20px 40px; background: rgba(15, 145, 255, .2);
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
	.page-container {
		text-align: center; padding-top: 20px;
	}
</style>