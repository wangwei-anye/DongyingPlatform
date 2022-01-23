<template>
  <div class="device-page">
    <div class="syssetting-box">
      <div class="syssetting-box__hd"><i class="syssetting-box__icon"></i>设备管理</div>
      <div class="syssetting-box__bd">
        <div class="syssetting-box__orn"></div>
        <div class="device-box">
          <div class="device-box__hd">
            <span class="label">选择区域：</span>
            <Select v-model="curTown" class="v-select" placeholder="选择县区"  @on-change="townHandler">
              <Option v-for="item in nTowns" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="curPolice" class="v-select" placeholder="选择派出所" @on-change="policeHandler">
              <Option v-for="item in polices" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="curUnit" class="v-select" placeholder="选择小区">
              <Option v-for="item in units" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <v-button :btnInfo="selectedBtn" @click="submitFn"></v-button>
            <v-searchbar @searchHandler="search" placeholder="小区查询" class="device-box__search"></v-searchbar>
          </div>
          <div class="device-box__bd">
            <div class="table">
              <div class="table__hd">
                <form enctype="multipart/form-data" ref="myForm"></form>
                <div>小区名称：<input type="text" class="input-control" :value="curUnitInfo.name" readonly></div>
                <div>地址：<input type="text" class="input-control" :value="curUnitInfo.addr" readonly></div>
                <div>监控点位数量：<input type="text" class="input-control" :value="curUnitInfo.cameraNum" readonly></div>
                <div class="btn-group">
                  <button title="导入" class="btn-export"><input id="export" ref="filetarget" @change="fileChange" type="file" accept=".xls,.xlsx"></button>
                  <button title="添加" class="btn-add"></button>
                  <button title="删除" class="btn-delete" @click="multiDelete"></button>
                  <button title="修改" class="btn-edit" @click="selectedModifyFn"></button>
                </div>
              </div>
              <Table class="stripe-table" :columns="tableColumns" :data="tableData" @on-selection-change="selectedChange"></Table>
            </div>
          </div>
          <div class="device-box__fd">
            <v-pagination :pageIndex="current" :pageSize="pageSize" :total="total" @toPage='pageChange'></v-pagination>
          </div>
        </div>
      </div>
    </div>
    <v-modal v-model="showPop">
      <div class="device-pop">
        <div class="hd">添加摄像头</div>
        <div class="bd">
          <div class="form-row">
            <div class="form-group">
              <label>摄像头名称：</label>
              <input type="text" placeholder="请输入摄像头名称">
            </div>
            <div class="form-group">
              <label>摄像头IP：</label>
              <input type="text" placeholder="请输入摄像头IP">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>服务器IP：</label>
              <input style="width:300px;" type="text" placeholder="请输入服务器IP">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>账号：</label>
              <input type="text" placeholder="请输入摄像头账号">
            </div>
            <div class="form-group">
              <label>密码：</label>
              <input type="text" placeholder="请输入摄像头密码">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>经度：</label>
              <input type="text" placeholder="请输入摄像头经度">
            </div>
            <div class="form-group">
              <label>纬度：</label>
              <input type="text" placeholder="请输入摄像头纬度">
            </div>
          </div>
        </div>
        <div class="fd">
          <a href="javascript:;">确定</a>
          <a href="javascript:;" @click="cancelPop">取消</a>
        </div>
      </div>
    </v-modal>
  </div>
</template>
<script>
import vButton from '@/components/Button'
import vSearchbar from '@/components/Searchbar'
import vPagination from '@/components/Pagination'
import vModal from '@/components/Modal'
import { province_code, city_code } from '@/config'
import api from '@/API/platform'
import http from '@/utils/http'
import $ from 'jquery';
export default {
  name: 'device',
  data () {
    return {
      curTown: '',
      towns: [],
      curPolice: '',
      polices: [],
      curUnit: '',
      units: [],
      selectedBtn: {
        text: '查询',
        styles: {
          width: '100px',
          height: '40px',
          border: '0',
          backgroundColor: '#e7cc44',
          hoverColor: '#efcf4f',
          fontSize: '16px',
          color: '#0b1c49',
          borderRadius: '2px'
        }
      },
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        { 
          type: 'index',
          width: 80,
          align: 'center',
          title: '序号'
        },
        { 
          key: 'device_id',
          title: '摄像头ID'
        },
        {
          key: 'device_name',
          title: '摄像头名称'
        },
        { 
          key: 'action',
          title: '操作',
          render: (h, params) => {
            let children = [];
            children.push(h('button', {
              'class': 'btn-delete',
              attrs: {
                title: '删除'
              },
              on: {
                click: () => {
                  this.singleDelete(params.row);
                }
              }
            }))
            children.push(h('button', {
              'class': 'btn-edit',
              style: {
                marginLeft: '5px'
              },
              attrs: {
                title: '修改'
              },
              on: {
                click: () => {
                  this.modifyFn(params.row);
                }
              }
            }))
            return h('div',{}, children);
          }
        }
      ],
      tableData: [
      ],
      curUnitInfo: {},
      selectedArr: [],
      current: 1,
      total: 0,
      pageSize: 7,
      showPop: false
    }
  },
  computed: {
    nTowns () {
      return [{value: -1, label: '全部'}].concat(this.towns);
    }
  },
  components: {
    vButton,
    vSearchbar,
    vPagination,
    vModal
  },
  methods: {
    townHandler(value) {
      this.polices = [];
      this.units = [];
      this.queryPolices(value);
    },
    policeHandler(value) {
      this.units = [];
      this.queryUnits(value);
    },
    submitFn () {
      if(this.curTown === '' || this.curTown === -1) {
        this.$Message.warning('请选择县区');
        return;
      }
      if(this.curPolice === '') {
        this.$Message.warning('请选择派出所');
        return;
      }
      if(this.curUnit === '') {
        this.$Message.warning('请选择小区');
        return;
      }
      this.searchDeviceData({
        town_code: this.curTown,
        police_code: this.curPolice,
        unit_id: this.curUnit,
        pageNow: 1
      });
    },
    search (value, clearFn) {
      console.log(value);
      clearFn && clearFn();
    },
    pageChange (current) {
      this.searchDeviceData({
        town_code: this.curTown,
        police_code: this.curPolice,
        unit_id: this.curUnit,
        pageNow: current
      });
    },
    selectedChange (selection) {
      this.selectedArr = selection.map(item => item.device_id);
    },
    cancelPop() {
      this.showPop = false;
    },
    searchDeviceData(params) {
      let curTown = params.curTown > 0 ? params.curTown : ''
      http.get('/safety/deviceDataSearch.do', {
        params: {
          province_code: province_code,
          city_code: city_code,
          town_code: curTown || '',
          township_code: params.township_code || '',
          village_code: params.village_code || '',
          police_code: params.police_code || '',
          unit_id: params.unit_id,
          pageNow: params.pageNow,
          pageSize: this.pageSize
        }
      }).then(res => {
        const data = res.data;
        if(data.success === true) {
          const result = data.data.deviceData;
          this.curUnitInfo = {
            uid: result.unit_id,
            name: result.unit_name,
            addr: result.address,
            cameraNum: result.monitorNumber
          }
          this.tableData = result.deviceList;
          this.current = params.pageNow;
          this.total = data.data.rowCount;
        }
      })
    },
    deleteDevice(uid, dids) {
      var idstr = dids.map(item => 'ids='+item).join('&');
      http.get('/safety/deleteDeviceData.do?unit_id=' + uid + '&' + idstr).then(res => {
        const data = res.data;
        if(data.success === true) {
          this.$Message.success('删除成功');
          this.searchDeviceData({
            town_code: this.curTown,
            police_code: this.curPolice,
            unit_id: this.curUnit,
            pageNow: 1
          });
        }else{
          this.$Message.error(data.data);
        }
      })
    },
    queryTowns () {
      let query = 'province_code=' + province_code + '&city_code=' + city_code;
      let _this = this;
      api.getTown(query, function(res){
        const data = res.data;
        if(data.success === true) {
          _this.towns = data.data.map(item => {
            return {
              value: item.town_code,
              label: item.town_name
            }
          });
        }
      });
    },
    queryPolices (townCode) {
      let query = 'province_code=' + province_code + '&city_code=' + city_code + '&town_code=' + townCode;
      let _this = this;
      api.getPolice(query, function(res){
        const data = res.data;
        if(data.success === true) {
          _this.polices = data.data.map(item => ({
            value: item.id,
            label: item.police_station
          }))
        }
      });
    },
    queryUnits (pid) {
      let query = 'province_code=' + province_code + '&city_code=' + city_code + '&town_code=' + this.curTown + '&police_code=' + pid;
      let _this = this;
      api.getUnitByPolice(query, function(res){
        const data = res.data;
        if(data.success === true) {
          _this.units = data.data.map(item => ({
            value: item.unit_id,
            label: item.name
          }))
        }
      })
    },
    multiDelete() {
      if(this.selectedArr.length > 0) {
        this.deleteDevice(this.curUnitInfo.uid, this.selectedArr);
      }else{
        this.$Message.warning('请选择要删除的设备');
      }
    },
    singleDelete(item) {
      this.deleteDevice(this.curUnitInfo.uid, [item.id]);
    },
    modifyFn(item) {
      console.log(item);
      this.$Message.success('点击了修改');
      this.showPop = true;
    },
    selectedModifyFn(){
      console.log(123)
    },
    importData(params) {
      let formData = new FormData();
      formData.append('province_code', province_code);
      formData.append('city_code', city_code);
      formData.append('town_code', params.town_code || '');
      formData.append('township_code', params.township_code || '');
      formData.append('village_code', params.village_code || '');
      formData.append('police_code', params.police_code || '');
      formData.append('unit_id', params.unit_id || '');
      formData.append('company_type', 1);
      formData.append('excelFile', params.excelFile);

      const config = {
        transformRequest: [function (data, headers) {
          return data;
        }],
        headers:{'Content-Type':'multipart/form-data'}
      }

      http.post('/safety/importDeviceExcel.do', formData, config).then(({data}) => {
        if(data.data === '导入成功') {
          this.$Message.success('导入成功');
          this.searchDeviceData({
            town_code: this.curTown,
            police_code: this.curPolice,
            unit_id: this.curUnit,
            pageNow: 1
          });
        }else{
          this.$Message.error('导入失败');
        }
        this.$refs.filetarget.value = '';
      });
    },
    fileChange(e) {
      const file = e.target.files[0];
      if(this.curTown === '' || this.curTown === -1) {
        this.$Message.warning('请选择县区');
        return;
      }
      if(this.curPolice === '') {
        this.$Message.warning('请选择派出所');
        return;
      }
      if(!this.curUnitInfo.uid) {
        this.$Message.warning('请选择小区查询后导入');
        return;
      }
      this.importData({
        tonw_code: this.curTown,
        police_code: this.curPolice,
        unit_id: this.curUnitInfo.uid,
        excelFile: file
      })
    }
  },
  created() {
    this.queryTowns();
    //this.searchDeviceData({pageNow: 1});
  }
}
</script>
<style lang="scss" scoped>
.device-page{
  padding: 20px 0 50px 0;
}
.syssetting-box{
  margin: 0 27px;
  background: rgba(15, 145, 255, .1);
  color: #fff;
  &__hd{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #074a81;
    background: url(../../assets/image/permission-hd.png) no-repeat 0 0;
    font-size: 18px;
  }
  &__icon{
    display: inline-block;
    width: 24px;
    height: 24px;
    background: url(../../assets/image/permission-hd-icon.png) no-repeat;
    vertical-align: middle;
    margin: 0 12px;
  }
  &__bd{
    position: relative;
    padding: 30px 50px 22px;
  }
  &__orn{
    position: absolute;
    right: 26px;
    bottom: 0;
    width: 22px;
    height: 22px;
    background: rgba(7, 74, 129, .23);
    &:before{
      content: '';
      position: absolute;
      right: -26px;
      top: 0;
      width: 22px;
      height: 22px;
      background: #074a81;
    }
    &:after{
      content: '';
      position: absolute;
      right: -4px;
      bottom: 2px;
      width: 1060px;
      height: 1px;
      background: #074a81;
    }
  }
  .v-select{
    width: 146px;
    margin-right: 30px;
  }
}
.device-box{
  &__hd{
    position: relative;
    .label{
      font-size: 18px;
      color: #1cb1ff;
      display: inline-block;
      vertical-align: middle;
    }
    .button{
      vertical-align: middle;
    }
  }
  &__bd{
    margin-top: 25px;
  }
  &__fd{
    margin-top: 30px;
    text-align: center;
  }
  &__search{
    position: absolute;
    top: 0;
    right: 0;
  }
  .table{
    border: 1px solid #125f9d;
    &__hd{
      padding: 0 80px;
      height: 84px;
      background: rgba(12, 62, 130, 0.6);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      .input-control{
        width: 164px;
        height: 32px;
        border: 1px solid #1cb1ff;
        background: rgba(28, 177, 255, 0.1);
        font-size: 16px;
        padding: 0 8px;
        color: #1cb1ff;
      }
      .btn-group{
        font-size: 0;
      }
      button[class^="btn-"]{
        width: 38px;
        height: 38px;
        border: 0;
        outline: none;
        cursor: pointer;
        background-color: transparent;
        background-image: url(../../assets/image/device-btns.png);
        background-repeat: no-repeat;
        margin-left: 10px;
        vertical-align: middle;
      }
      .btn-export{
        background-position: 0 0;
        margin-left: 0;
      }
      #export {
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        outline: none;
      }
      .btn-add{
        background-position: -48px 0;
      }
      .btn-delete{
        background-position: -96px 0;
      }
      .btn-edit{
        background-position: -144px 0;
      }
    }
  }
}
.device-pop{
  position: absolute;
  top: 50%;
  left: 50%;
  width: 704px;
  height: 436px;
  background: url(../../assets/image/device-box.png) no-repeat;
  transform: translate(-50%, -50%);
  >.hd{
    font-size: 22px;
    color: #4fc7ff;
    text-align: center;
    margin-top: 35px;
  }
  .form-row{
    margin-top: 20px;
    margin-left: 20px;
    overflow: hidden;
  }
  .form-group{
    float: left;
    font-size: 16px;
    color: #4fc7ff;
    >label{
      display: inline-block;
      width: 110px;
      text-align: right;
    }
    >input{
      background: rgba(28, 177, 255, .1);
      height: 32px;
      border: 1px solid #2a7fce;
      color: #fff;
      padding: 0 5px;
      outline: none;
    }
    ::-moz-placeholder{
      color: #fff;
    }
    ::placeholder{
      color: #fff;
    }
  }
  >.fd{
    margin-top: 60px;
    display: flex;
    justify-content: center;
    >a {
      display: block;
      width: 100px;
      height: 36px;
      background: #40c7ff;
      border-radius: 2px;
      color: #fff;
      font-size: 16px;
      text-align: center;
      line-height: 36px;
      margin: 0 60px;
    }
  }
}

</style>

