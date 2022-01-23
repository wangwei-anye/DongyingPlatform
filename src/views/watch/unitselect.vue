<template>
	<div class="unitselect">
			<div class="title">
				分管小区
			</div>
			<div class="intro">
				<Select :value="currentTown" @on-change="selectTown" class="v-select">
					<Option v-for="item in townList" :value="item.town_code" :key="item.town_code">{{ item.town_name }}</Option>
				</Select>
			</div>
			<div class="intro">
				<Select :value="currentTownShip" @on-change="selectTownShip" class="v-select">
					<Option v-for="item in townShipList" :value="item.township_code" :key="item.township_code">{{ item.township_name }}</Option>
				</Select>
			</div>
			<div class="intro">
				<Select :value="currentVillage" @on-change="selectVillage" class="v-select">
					<Option v-for="item in villageList" :value="item.village_code" :key="item.village_code">{{ item.village_name }}</Option>
				</Select>
			</div>
			<div class="intro" style="text-align:left; padding-left: 60px;">
				请选择小区：
			</div>
			<div class="intro">
				<div class="unitlist">
			    <CheckboxGroup v-model="currentUnit">
		        <p v-for="item in unitList">
		        	<Checkbox :label="item.unit_id + ':' + item.name">
		        	  <span>{{ item.name }}</span>
		          </Checkbox>
		        </p>
			    </CheckboxGroup>
				</div>
			</div>
			<div class="btn">
				<span class="btn-yes" @click="selsure">确定</span>
				<span class="btn-no" @click="selcancle">取消</span>
			</div>
	</div>
</template>

<script>
	import axios from '../../utils/http.js'
  import { province_code, city_code } from '@/config'
	export default {
		name:'unitselect',
		data () {
			return {
				currentProvince: '',
				currentCity: '',
			  townList: [],
			  currentTown: '',
			  townShipList: [],
			  currentTownShip: '',
			  villageList: [],
			  currentVillage: '',
			  unitList: [],
			  currentUnit: []
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
		},
		methods: {
			// 获取区县
			getTownList: function () {
				axios.post('/option/getTownByField.do', {
					province_code: this.currentProvince,
					city_code: this.currentCity
				}).then(response => {
					if(response.data.success) {
						this.townList = [{ town_code: 'all', town_name: '请选择区县' }].concat(response.data.data)
						this.currentTown = 'all'
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
						this.townShipList = [{ township_code: 'all', township_name: '请选择乡镇/街道办' }].concat(response.data.data)
						this.currentTownShip = 'all'
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
						this.villageList = [{ village_code: 'all', village_name: '请选择村/社区' }].concat(response.data.data)
						this.currentVillage = 'all'
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
							this.currentUnit = []
						}
						else {
							this.unitList = response.data.data
							this.currentUnit = []
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
				this.townShipList = [{ township_code: 'all', township_name: '请选择乡镇/街道办' }]
				this.currentTownShip = 'all'
				this.villageList = [{ village_code: 'all', village_name: '请选择村/社区' }]
				this.currentVillage = 'all'
				this.unitList = []
				this.currentUnit = []
				this.getTownShipList()
				this.getUnitList()
			},
			// 选取街道办/乡镇
			selectTownShip: function (value) {
				if (this.$store.state.global.accountInfo.rolePermission.roleType.level == 5 || this.$store.state.global.accountInfo.rolePermission.roleType.level == 6) {
					return
				}
				this.currentTownShip = value
				this.villageList = [{ village_code: 'all', village_name: '请选择村/社区' }]
				this.currentVillage = 'all'
				this.unitList = []
				this.currentUnit = []
				this.getVillageList()
				this.getUnitList()
			},
			// 选取社区/村
			selectVillage: function (value) {
				this.currentVillage = value
				this.unitList = []
				this.currentUnit = []
				this.getUnitList()
			},
			selsure: function () {
				this.$emit('selsure', this.currentUnit)
			},
			selcancle: function () {
				this.$emit('selcancle')
			}
		}
	}
</script>

<style lang='scss' scoped>
	.unitselect {
		width: 400px;
		height: 600px;
		background: url('../../assets/image/special/delete_bg.png') no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: calc(50% - 300px);
		left: calc(50% - 200px);
		text-align: center;
		z-index: 5;
		.title {
			font-size: 22px;
			color: #45c1fb;
			margin-top: 40px;
			margin-bottom: 20px;
		}
		.intro {
			color: #fff;
			font-size: 16px;
			margin-top: 15px;
			.v-select {
				width: 288px;
			}
			.unitlist {
				width: 288px; height: 200px; overflow-x: hidden; overflow-y: auto;
				background: rgba(28, 177, 255, .1); margin-left: 56px;
				p { text-align: left; padding-left: 10px; margin-top: 10px; }
			}
		}
		.btn {
			margin-top: 15px;
			span {
				display: inline-block;
				width: 100px;
				height: 40px;
				line-height: 40px;
				background-color: #1c7bb6;
				color: #fff;
				cursor: pointer;
			}
			.btn-yes {
				margin-right: 80px;
				background-color: #33ace5;
			}
		}
	}
</style>