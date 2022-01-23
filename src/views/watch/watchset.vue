<template>
  <div class="watchset">
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
      <v-Button name="" class='v-btn' :btnInfo="btnInfo" @click="btnSearch"></v-Button>
    </div>
    <v-panel title='治安防范标准设置' class='v-panel'>
      <div class="watchset-content">
        <!-- 操作栏 -->
        <div class="watchset-tool">
          <label @click="showGoodSetModal = true">物防类目设置</label>
          <label @click="showTechSetModal = true">技防类目设置</label>
        </div>
        <!-- 表格数据 -->
        <div class="table-detail" v-for="item, index in listdata">
          <div class="left-top1"></div><div class="left-top2"></div>
          <div class="right-top1"></div><div class="right-top2"></div>
          <div class="left-bottom1"></div><div class="left-bottom2"></div>
          <div class="right-bottom1"></div><div class="right-bottom2"></div>
          <div class="detail-container">
            <Collapse class="safety-collapse">
              <Panel>
                <b class="icon iconfont icon-font-juzhudizhi"></b>
                <label>{{ item.unit_name }}</label>
                <div slot="content">
                  <!-- 人防标准设置 -->
                  <div class="goods-tool">
                    <label>人防标准设置</label>
                    <Button v-if="staffindex != index" class="app-button-table" @click="setStaffDefense(index, item.civilDefenceMap)">
                      <Icon type="edit" />
                    </Button>
                  </div>
                  <div class="collape-list">
                    <div class="collape-list-itemequal" style="width: 160px; flex: initial;">小区名称</div>
                    <div class="collape-list-itemequal" style="width: 160px; flex: initial;">小区类型</div>
                    <div class="collape-list-itemequal" style="width: 160px; flex: initial;">小区户数</div>
                    <div class="collape-list-itemequal" style="width: 160px; flex: initial;">小区人口</div>
                    <div class="collape-list-itemequal">计划片区民警(人数)</div>
                    <div class="collape-list-itemequal">计划专职保安队伍(人数)</div>
                    <div class="collape-list-itemequal">计划义务巡逻队伍(人数)</div>
                  </div>
                  <div class="collape-list" style="margin-top: -2px;">
                    <div class="collape-list-itemequal collape-list-note" style="width: 160px; flex: initial;" :title="item.unit_name"><label>{{ item.unit_name }}</label></div>
                    <div class="collape-list-itemequal collape-list-note" style="width: 160px; flex: initial;">{{ item.civilDefenceMap.unit_type }}</div>
                    <div class="collape-list-itemequal collape-list-note" style="width: 160px; flex: initial;">{{ item.civilDefenceMap.unit_number }}</div>
                    <div class="collape-list-itemequal collape-list-note" style="width: 160px; flex: initial;">{{ item.civilDefenceMap.unit_population }}</div>
                    <div class="collape-list-itemequal collape-list-empty">
                      <label v-if="staffindex != index">{{ item.civilDefenceMap.police_plan }}</label>
                      <InputNumber class="app-input-number" v-if="staffindex == index" v-model="staffdata.police_plan" :min="0" :max="999999999" :precision="0" style="width: 120px;"></InputNumber>
                    </div>
                    <div class="collape-list-itemequal collape-list-empty">
                      <label v-if="staffindex != index">{{ item.civilDefenceMap.securityteam_plan }}</label>
                      <InputNumber class="app-input-number" v-if="staffindex == index" v-model="staffdata.securityteam_plan" :min="0" :max="999999999" :precision="0" style="width: 120px;"></InputNumber>
                    </div>
                    <div class="collape-list-itemequal collape-list-empty">
                      <label v-if="staffindex != index">{{ item.civilDefenceMap.securitypatrol_plan }}</label>
                      <InputNumber class="app-input-number" v-if="staffindex == index" v-model="staffdata.securitypatrol_plan" :min="0" :max="999999999" :precision="0" style="width: 120px;"></InputNumber>
                    </div>
                  </div>
                  <div class="tool-button" v-if="staffindex == index">
                    <Button class="app-button-confirm" @click="submitStaff(item.unit_id)">确 定</Button>
                    <Button class="app-button-confirm" @click="staffindex = -1">取 消</Button>
                  </div>
                  <!-- 物防标准设置 -->
                  <div class="goods-tool">
                    <label>物防标准设置</label>
                    <Button v-if="goodsindex != index" class="app-button-table" @click="setGoodsDefense(index, item.objectDefenceList)">
                      <Icon type="edit" />
                    </Button>
                  </div>
                  <div class="collape-list" >
                    <div class="collape-list-itemodd">类目</div>
                    <div class="collape-list-itemeven">计划数量</div>
                    <div class="collape-list-itemodd">类目</div>
                    <div class="collape-list-itemeven">计划数量</div>
                    <template v-for="obj, i in item.objectDefenceList">
                      <div class="collape-list-itemodd">{{ obj.defence_name }}</div>
                      <div class="collape-list-itemeven collape-list-empty">
                        <label v-if="goodsindex != index">{{ obj.defence_count }}</label>
                        <InputNumber class="app-input-number" v-if="goodsindex == index" v-model="goodsdata[i].defence_count" :min="0" :max="999999999" :precision="0" style="width: 120px;"></InputNumber>
                      </div>    
                    </template>
                  </div>
                  <div class="tool-button" v-if="goodsindex == index">
                    <Button class="app-button-confirm" @click="submitGoods(item.unit_id)">确 定</Button>
                    <Button class="app-button-confirm" @click="goodsindex = -1">取 消</Button>
                  </div>
                  <!-- 技防标准设置 -->
                  <div class="tech-tool">
                    <label>技防标准设置</label>
                    <Button v-if="techindex != index" class="app-button-table" @click="setTechDefense(index, item.technicalDefenceList)">
                      <Icon type="edit" />
                    </Button>
                  </div>
                  <div class="collape-list" >
                    <div class="collape-list-itemodd">类目</div>
                    <div class="collape-list-itemeven">计划数量</div>
                    <div class="collape-list-itemodd">类目</div>
                    <div class="collape-list-itemeven">计划数量</div>
                    <template v-for="obj, i in item.technicalDefenceList">
                      <div class="collape-list-itemodd">{{ obj.defence_name }}</div>
                      <div class="collape-list-itemeven collape-list-empty">
                        <label v-if="techindex != index">{{ obj.defence_count }}</label>
                        <InputNumber class="app-input-number" v-if="techindex == index" v-model="techdata[i].defence_count" :min="0" :max="999999999" :precision="0" style="width: 120px;"></InputNumber>
                      </div>    
                    </template>
                  </div>
                  <div class="tool-button" v-if="techindex == index">
                    <Button class="app-button-confirm" @click="submitTech(item.unit_id)">确 认</Button>
                    <Button class="app-button-confirm" @click="techindex = -1">取 消</Button>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
        <!-- 分页 -->
        <div class='page-container'>
          <v-pagination :pageSize="7" :total="totalNum" :pageIndex="currentPage" @toPage="toPage" class="pageBar"></v-pagination>
        </div>
      </div>
    </v-panel>
    <GoodSetModal v-if="showGoodSetModal" @closeModal="closeGoodSetModal">
    </GoodSetModal>
    <TechSetModal v-if="showTechSetModal" @closeModal="closeTechSetModal">
    </TechSetModal>
  </div>
</template>

<script>
  import vPanel from '@/components/Panel'
  import vButton from '@/components/Button'
  import vPagination from '@/components/Pagination'
  import GoodSetModal from './goodsetmodal'
  import TechSetModal from './techsetmodal'
  import axios from '../../utils/http.js'
  import { province_code, city_code } from '@/config'
  export default {
    name: 'watchset',
    components: {
      vPanel,
      vButton,
      vPagination,
      GoodSetModal,
      TechSetModal
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
        showGoodSetModal: false,
        showTechSetModal: false,
        currentPage: 1,
        totalNum: 0,
        listdata: [],
        staffindex: -1,
        staffdata: { police_plan: 0, securityteam_plan: 0, securitypatrol_plan: 0 },
        goodsindex: -1,
        goodsdata: [],
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
      this.getSecurityDefenceStandardSearch()
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
      // 按区域搜索
      btnSearch: function () {
        this.getSecurityDefenceStandardSearch()
      },
      // 获取治安防范标准
      getSecurityDefenceStandardSearch: function () {
        axios.post('/safety/securityDefenceStandardSearch.do', {
          province_code: this.currentProvince,
          city_code: this.currentCity,
          town_code: this.currentTown == 'all' ? '' : this.currentTown,
          township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
          village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
          unit_id: this.currentUnit == 'all' ? '' : this.currentUnit,
          pageNow: this.currentPage
        }).then(response => {
          if (response.data.success) {
            this.listdata = response.data.data
            if (this.listdata.length > 0) {
              this.totalNum = this.listdata[0].rowCount
            }
            else {
              this.totalNum = 0
            }
          }
          else {
            console.log('获取治安防范标准失败')
          }
        }).catch(err => {
          console.log('获取治安防范标准失败')
        })
      },
      closeGoodSetModal: function () {
        this.getSecurityDefenceStandardSearch()
        this.showGoodSetModal = false
      },
      closeTechSetModal: function () {
        this.getSecurityDefenceStandardSearch()
        this.showTechSetModal = false
      },
      // 跳转页码
      toPage: function (currentPage) {
        this.currentPage = currentPage
        this.getSecurityDefenceStandardSearch()
      },
      // 人防标准设置
      setStaffDefense: function (index, tmparr) {
        this.staffdata.police_plan = parseInt(tmparr.police_plan)
        this.staffdata.securityteam_plan = parseInt(tmparr.securityteam_plan)
        this.staffdata.securitypatrol_plan = parseInt(tmparr.securitypatrol_plan)
        this.staffindex = index
      },
      submitStaff: function (unit_id) {
        axios.post('/safety/civilDefenceStandard.do', {
          province_code: this.currentProvince,
          city_code: this.currentCity,
          town_code: this.currentTown == 'all' ? '' : this.currentTown,
          township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
          village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
          unit_id: unit_id,
          police_plan: this.staffdata.police_plan,
          securityteam_plan: this.staffdata.securityteam_plan,
          securitypatrol_plan: this.staffdata.securitypatrol_plan
        }).then(response => {
          if (response.data.success) {
            this.getCivilDefenceStandardSearch(unit_id)
          }
          else {
            console.log('人防标准设置失败')
          }
        }).catch(err => {
          console.log('人防标准设置失败')
        })
      },
      // 人防标准查询
      getCivilDefenceStandardSearch: function (unit_id) {
        axios.post('/safety/civilDefenceStandardSearch.do', {
          province_code: this.currentProvince,
          city_code: this.currentCity,
          town_code: this.currentTown == 'all' ? '' : this.currentTown,
          township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
          village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
          unit_id: unit_id
        }).then(response => {
          if (response.data.success) {
            this.listdata[this.staffindex].civilDefenceMap = response.data.data
            this.staffindex = -1
          }
          else {
            console.log('人防标准查询失败')
          }
        }).catch(err => {
          console.log('人防标准查询失败')
        })
      },
      // 物防标准设置
      setGoodsDefense: function (index, tmparr) {
        this.goodsdata = tmparr.map(item => { return { defence_name: item.defence_name, defence_count: parseInt(item.defence_count) } })
        this.goodsindex = index
      },
      submitGoods: function (unit_id) {
        let str = 'province_code=' + this.currentProvince + '&city_code=' + this.currentCity
        str += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown)
        str += '&township_code=' + (this.currentTownShip == 'all' ? '' : this.currentTownShip)
        str += '&village_code=' + (this.currentVillage == 'all' ? '' : this.currentVillage)
        str += '&unit_id=' + unit_id
        for (let i = 0; i < this.goodsdata.length; i++) {
          str += '&defenceName=' + this.goodsdata[i].defence_name + '_' + this.goodsdata[i].defence_count
        }
        axios.post('/safety/objectDefenceStandard.do?' + str).then(response => {
          if (response.data.success) {
            this.getObjectDefenceStandardSearch(unit_id)
          }
          else {
            console.log('物防标准设置失败')
          }
        }).catch(err => {
          console.log('物防标准设置失败')
        })
      },
      // 物防标准查询
      getObjectDefenceStandardSearch: function (unit_id) {
        axios.post('/safety/objectDefenceStandardSearch.do', {
          province_code: this.currentProvince,
          city_code: this.currentCity,
          town_code: this.currentTown == 'all' ? '' : this.currentTown,
          township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
          village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
          unit_id: unit_id
        }).then(response => {
          if (response.data.success) {
            this.listdata[this.goodsindex].objectDefenceList = response.data.data
            this.goodsindex = -1
          }
          else {
            console.log('物防标准查询失败')
          }
        }).catch(err => {
          console.log('物防标准查询失败')
        })
      },
      // 技防标准设置
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
        axios.post('/safety/technicalDefenceStandard.do?' + str).then(response => {
          if (response.data.success) {
            this.getTechnicalDefenceStandardSearch(unit_id)
          }
          else {
            console.log('技防标准设置失败')
          }
        }).catch(err => {
          console.log('技防标准设置失败')
        })
      },
      // 技防标准查询
      getTechnicalDefenceStandardSearch: function (unit_id) {
        axios.post('/safety/technicalDefenceStandardSearch.do', {
          province_code: this.currentProvince,
          city_code: this.currentCity,
          town_code: this.currentTown == 'all' ? '' : this.currentTown,
          township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
          village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
          unit_id: unit_id
        }).then(response => {
          if (response.data.success) {
            this.listdata[this.techindex].technicalDefenceList = response.data.data
            this.techindex = -1
          }
          else {
            console.log('物防标准查询失败')
          }
        }).catch(err => {
          console.log('物防标准查询失败')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .watchset {
    padding-top: 15px;
    .watchset-content {
      padding: 15px 30px;
    }
    .search-container {
      width: 100%; height: 48px; margin-bottom: 15px; color: #3fa7ff; font-size: 18px; display: flex; align-items: center;
      .v-select {
        width: 160px;
        margin-right: 30px;
      }
      .v-btn{
        margin-left: 50px;
      }
    }
    .watchset-tool {
      padding: 0 0 10px 0; text-align: right; font-size: 16px; color: #e8cc44;
      label {
        margin-left: 15px; cursor: pointer;
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
        .goods-tool, .tech-tool {
          display: flex; align-items: center; justify-content: space-between; margin-top: 20px; margin-bottom: 10px;
          label {
            font-size: 16px; color: #1cb1ff;
          }
        }
        .collape-list {
          width: 100%; color: #fff; font-size: 18px; display: flex; flex-wrap: wrap;
          border-left: 2px solid #125f9d; border-top: 2px solid #125f9d;
          .collape-list-itemodd {
            background-color: rgba(12, 62, 130, .5); width: 18%; display: inline-flex; height: 54px;
            border-right: 2px solid #125f9d; border-bottom: 2px solid #125f9d; align-items: center; justify-content: center;
          }
          .collape-list-itemeven {
            background-color: rgba(12, 62, 130, .5); width: 32%; display: inline-flex; height: 54px;
            border-right: 2px solid #125f9d; border-bottom: 2px solid #125f9d; align-items: center; justify-content: center;
          }
          .collape-list-itemequal {
            display: inline-flex; background-color: rgba(12, 62, 130, .5); flex: 1; height: 54px;
            border-right: 2px solid #125f9d; border-bottom: 2px solid #125f9d; align-items: center; justify-content: center;
          }
          .collape-list-note {
            background-color: transparent; color: #fff; padding: 0 5px;
            label {
              overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
            }
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
      text-align: center; margin-top: 15px;
    }
  }
</style>