<template>
  <div class="safetyset">
    <v-panel title='发案指数标准设置' class='v-panel'>
      <div v-show="!isedit" class="safetyset-edit">
        <Button class="app-button-table" @click="editStatus">
          <Icon type="edit" />
        </Button>
      </div>
      <div v-if="isedit" class="safetyset-content">
        <Table class="stripe-table tmp-table" :columns="editcolumns" :data="data"></Table>
        <div class="content-line1"></div>
        <div class="content-line2"></div>
        <div class="content-line3"></div>
        <div class="content-line4"></div>
      </div>
      <div v-else class="safetyset-content">
        <Table class="stripe-table tmp-table" :columns="columns" :data="data"></Table>
        <div class="content-line1"></div>
        <div class="content-line2"></div>
        <div class="content-line3"></div>
        <div class="content-line4"></div>
      </div>
      <div v-show="isedit" class="safetyset-tool">
        <Button class="app-button-confirm" size="large" @click="editSure">确 定</Button>
        <Button class="app-button-confirm" size="large" @click="editCancle">取 消</Button>
      </div>
    </v-panel>
    <SafetySetModal v-if="modalinfo" @closeModal="modalinfo = false"></SafetySetModal>
  </div>
</template>

<script>
  import vPanel from '@/components/Panel'
  import SafetySetModal from './safetysetmodal'
  import axios from '../../utils/http.js'
  import { province_code, city_code } from '@/config'

  export default {
    name: 'safetyset',
    components: {
      vPanel,
      SafetySetModal
    },
    data () {
      return {
        currentProvince: '',
        currentCity: '',
        isedit: false,
        modalinfo: false,
        columns: [
          { key: 'type', title: '类型' },
          { key: 'subtype', title: '子类型' },
          {
            key: 'weight', title: '权重值',
            render: (h, params) => {
              return h('span', params.row.weight + '%')
            }
          }
        ],
        editcolumns: [
          { key: 'type', title: '类型' },
          { key: 'subtype', title: '子类型' },
          { 
            key: 'weight', title: '权重值',
            render: (h, params) => {
              return h('div', [
                h('InputNumber', {
                  class: 'app-input-number',
                  style: {
                    marginRight: '5px'
                  },
                  attrs: {
                    min: 0,
                    max: 100,
                    value: params.row.weight
                  },
                  on: {
                    'on-change': (value) => {
                      this.tmpdata[params.index].weight = value
                    }
                  }
                }),
                h('span', '%')
              ])
            }
          }
        ],
        data: [
          { type: '案件', subtype: '/', weight: 0 },
          { type: '设备告警处理率', subtype: '/', weight: 0 },
          { type: '安防巡查', subtype: '/', weight: 0 },
          { type: '治安防范体系', subtype: '人防', weight: 0 },
          { type: '', subtype: '物防', weight: 0 },
          { type: '', subtype: '技防', weight: 0 },
          { type: '外来人口', subtype: '/', weight: 0 },
          { type: '重点人员', subtype: '/', weight: 0 }
        ],
        tmpdata: [
          { type: '案件', subtype: '/', weight: 0 },
          { type: '设备告警处理率', subtype: '/', weight: 0 },
          { type: '安防巡查', subtype: '/', weight: 0 },
          { type: '治安防范体系', subtype: '人防', weight: 0 },
          { type: '', subtype: '物防', weight: 0 },
          { type: '', subtype: '技防', weight: 0 },
          { type: '外来人口', subtype: '/', weight: 0 },
          { type: '重点人员', subtype: '/', weight: 0 }
        ]
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
      // 获取发案指数标准
      this.getCaseArisesIndexSearch()
    },
    methods: {
      getCaseArisesIndexSearch () {
        axios.post('/safety/caseArisesIndexSearch.do', {
          province_code: this.currentProvince,
          city_code: this.currentCity
        }).then(response => {
          if(response.data.success) {
            this.data[0].weight = parseInt(response.data.data.casePoliceRate * 100)
            this.data[1].weight = parseInt(response.data.data.caseRate * 100)
            this.data[2].weight = parseInt(response.data.data.nightRate * 100)
            this.data[3].weight = parseInt(response.data.data.civilDefenceRate * 100)
            this.data[4].weight = parseInt(response.data.data.objectDefenceRate * 100)
            this.data[5].weight = parseInt(response.data.data.technicalDefenceRate * 100)
            this.data[6].weight = parseInt(response.data.data.externalPersonRate * 100)
            this.data[7].weight = parseInt(response.data.data.specialPersonRate * 100)
          }
          else {
            console.log('获取发案指数标准失败')
          }
        }).catch(err => {
          console.log('获取发案指数标准失败')
        })
      },
      setCaseArisesIndexStandard () {
        axios.post('/safety/caseArisesIndexStandard.do', {
          province_code: this.currentProvince,
          city_code: this.currentCity,
          casePoliceRate: this.tmpdata[0].weight / 100.0,
          caseRate: this.tmpdata[1].weight / 100.0,
          nightRate: this.tmpdata[2].weight / 100.0,
          civilDefenceRate: this.tmpdata[3].weight / 100.0,
          objectDefenceRate: this.tmpdata[4].weight / 100.0,
          technicalDefenceRate: this.tmpdata[5].weight / 100.0,
          externalPersonRate: this.tmpdata[6].weight / 100.0,
          specialPersonRate: this.tmpdata[7].weight / 100.0
        }).then(response => {
          if(response.data.success) {
            this.isedit = false
            this.getCaseArisesIndexSearch()
          }
          else {
            console.log('设置发案指数标准失败')
          }
        }).catch(err => {
          console.log('设置发案指数标准失败')
        })
      },
      editStatus () {
        this.tmpdata[0].weight = this.data[0].weight
        this.tmpdata[1].weight = this.data[1].weight
        this.tmpdata[2].weight = this.data[2].weight
        this.tmpdata[3].weight = this.data[3].weight
        this.tmpdata[4].weight = this.data[4].weight
        this.tmpdata[5].weight = this.data[5].weight
        this.tmpdata[6].weight = this.data[6].weight
        this.tmpdata[7].weight = this.data[7].weight
        this.isedit = true
      },
      editSure () {
        let tmpvalue = this.tmpdata.reduce(function(previous, current) {
          if (previous.weight) {
            return previous.weight + current.weight
          }
          else {
            return previous + current.weight
          }
        })
        if (tmpvalue != 100) {
          this.modalinfo = true
        }
        else {
          this.setCaseArisesIndexStandard()
        }
      },
      editCancle () {
        this.isedit = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .safetyset {
    padding-top: 30px;
    .safetyset-edit {
      padding: 15px 30px 0 15px; text-align: right;
    }
    .safetyset-content {
      padding: 15px 30px 30px 30px; position: relative;
      .content-line1 {
        position: absolute; width: 600px; height: 1px; border-bottom: 1px dashed #1cb1ff; top: 265px; left: 180px;
      }
      .content-line2 {
        position: absolute; width: 420px; height: 1px; border-bottom: 1px dashed #1cb1ff; top: 322px; left: 360px;
      }
      .content-line3 {
        position: absolute; width: 420px; height: 1px; border-bottom: 1px dashed #1cb1ff; top: 378px; left: 360px;
      }
      .content-line4 {
        position: absolute; width: 1px; height: 108px; border-left: 1px dashed #1cb1ff; top: 268px; left: 360px;
      }
    }
    .safetyset-tool {
      display: flex; justify-content: center; padding-bottom: 30px;
      .app-button-confirm:first-child {
        margin-right: 30px;
      }
    }
  }
</style>