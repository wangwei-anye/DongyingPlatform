<template>
  <div class="logdata-page">
    <div class="syssetting-box">
      <div class="syssetting-box__hd"><i class="syssetting-box__icon"></i>日志数据</div>
      <div class="syssetting-box__bd">
        <div class="syssetting-box__orn"></div>
        <div class="logdata-box">
          <div class="logdata-box__hd">
            <div class="form-group">
              <label>账号：</label>
              <input type="text" class="input-control" v-model="account">
            </div>
            <div class="form-group">
              <label>IP：</label>
              <input type="text" class="input-control" v-model="ip">
            </div>
            <div class="form-group">
              <label>模块：</label>
              <Select v-model="curMod" class="v-select" placeholder="全部模块"  @on-change="modHandler">
                <Option v-for="item in Mods" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Select v-model="curLog" class="v-select" placeholder="全部模块"  @on-change="logHandler">
                <Option v-for="item in Logs" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="form-group">
              <label>时间：</label>
              <DatePicker :value="dateArr" type="daterange" placement="bottom-end" placeholder="选择日期" @on-change="dateChange" style="width: 250px"></DatePicker>
            </div>
            <div class="button-group">
              <v-button :btnInfo="selectedBtn" @click="submitFn"></v-button>
              <v-button :btnInfo="clearBtn" @click="clearFn"></v-button>
            </div>
          </div>
          <div class="logdata-box__bd">
            <Table class="stripe-table" :columns="tableColumns" :data="tableData"></Table>
          </div>
          <div class="logdata-box__fd">
            <v-pagination :pageIndex="current" :pageSize="pageSize" :total="total" @toPage='pageChange'></v-pagination>
          </div>
        </div>
      </div>
    </div> 
  </div>
</template>
<script>
import vButton from '@/components/Button'
import vPagination from '@/components/Pagination'
import http from '@/utils/http'
import { province_code, city_code } from '@/config'
export default {
  name: 'logdata',
  data () {
    return {
      account: '',
      ip: '',
      curMod: '',
      Mods: [],
      curLog: '',
      Logs: [],
      startTime: '',
      endTime: '',
      dateArr: [],
      current: 1,
      pageSize: 10,
      total: 0,
      tableColumns: [
        {key: 'index', title: '#'},
        {key: 'date', title: '日期-时间'},
        {key: 'account', title: '账号'},
        {key: 'ip', title: 'IP'},
        {key: 'mod', title: '模块'},
        {key: 'detail', title: '详情'},
        {key: 'status', title: '状态'}
      ],
      tableData: [],
      selectedBtn: {
        text: '检索',
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
      }
    }
  },
  computed: {
    clearBtn () {
      return Object.assign({}, this.selectedBtn, {text: '清除'})
    }
  },
  methods: {
    modHandler (value) {
      this.Logs = [];
      (value > 0) && this.getLogs(value);
    },
    logHandler (value) {
      console.log(value)
    },
    dateChange(date) {
      this.dateArr = date;
      this.startTime = date[0];
      this.endTime = date[1];
    },
    submitFn () {
      this.queryLogs({
        account: this.account,
        ip: this.ip,
        first_operate_module_id: this.curMod,
        second_operate_module_id: this.curLog,
        start_time: this.startTime,
        end_time: this.endTime,
        pageSize: this.pageSize,
        current: 1
      })
    },
    clearFn() {
      this.account = '';
      this.ip = '';
      this.curMod = '';
      this.curLog = '';
      this.Logs = [];
      this.startTime = '';
      this.endTime = '';
      this.dateArr = [];
      this.queryLogs({
        account: this.account,
        ip: this.ip,
        first_operate_module_id: this.curMod,
        second_operate_module_id: this.curLog,
        start_time: this.startTime,
        end_time: this.endTime,
        pageSize: this.pageSize,
        current: 1
      });
    },
    pageChange (current) {
      this.queryLogs({
        account: this.account,
        ip: this.ip,
        first_operate_module_id: this.curMod,
        second_operate_module_id: this.curLog,
        start_time: this.startTime,
        end_time: this.endTime,
        pageSize: this.pageSize,
        current: current
      })
    },
    getMods() {
      http.get('/operatelog/selectOperateLogFirstModule.do').then(res => {
        const data = res.data;
        if(data.success === true) {
          this.Mods = data.data.map(item => ({label: item.name, value: item.id}));
          this.Mods.unshift({label: '全部模块', value: -1});
        }
      });
    },
    getLogs(mid) {
      http.get('/operatelog/selectOperateLogSecondModule.do?operate_module_id=' + mid).then(res => {
        const data = res.data;
        if(data.success === true) {
          this.Logs = data.data.map(item => ({label: item.name, value: item.id}));
          this.Logs.unshift({label: '全部模块', value: -1});
        }
      })
    },
    queryLogs(params) {
      http.get('/operatelog/selectOperateLogList.do', {
        params: {
          province_code: params.province_code || province_code,
          city_code: params.city_code || city_code,
          town_code: params.town_code || '',
          account: params.account,
          ip: params.ip,
          first_operate_module_id: params.first_operate_module_id,
          second_operate_module_id: params.second_operate_module_id,
          start_time: params.start_time,
          end_time: params.end_time,
          pageSize: params.pageSize,
          pageNo: params.current
        }
      }).then(res => {
        const data = res.data;
        if(data.success === true) {
          this.current = params.current;
          this.total = data.data.totalCount;
          this.tableData = data.data.items.map((item, index) => ({
            index: ((params.current-1) * params.pageSize) + index + 1,
            date: this.formatTime(item.create_time),
            account: item.account,
            ip: item.ip,
            mod: item.name,
            detail: item.describe,
            status: item.state ? '成功' : '失败'
          }))
        }
      })
    },
    formatTime(timestamp) {
      let date = new Date(timestamp);
      let year = date.getFullYear()
      let month = ((date.getMonth() + 1) + '').padStart(2, '0');
      let day = (date.getDate() + '').padStart(2, '0');
      let hours = (date.getHours() + '').padStart(2, '0');
      let minutes = (date.getMinutes() + '').padStart(2, '0');
      let seconds = (date.getSeconds() + '').padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  },
  created() {
    this.getMods();
    this.queryLogs({
      account: this.account,
      ip: this.ip,
      first_operate_module_id: this.curMod,
      second_operate_module_id: this.curLog,
      start_time: this.startTime,
      end_time: this.endTime,
      pageSize: this.pageSize,
      current: 1
    });
  },
  components: {
    vButton,
    vPagination
  }
}
</script>
<style lang="scss" scoped>
.logdata-page{
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
.logdata-box{
  .form-group{
    display: inline-block;
    vertical-align: middle;
    height: 40px;
    >label{
      display: inline-block;
      font-size: 18px;
      color: #1cb1ff;
      vertical-align: middle;
    }
  }
  .input-control{
    height: 40px;
    width: 150px;
    background: rgba(28, 177, 255, .1);
    border: 1px solid #1cb1ff;
    outline: none;
    color: #fff;
    padding: 8px;
    font-size: 16px;
    vertical-align: middle;
  }
  &__hd{
    .button-group{
      float: right;
      .button{
        margin-left: 10px;
      }
    }
  }
  &__bd{
    margin-top: 25px;
  }
  &__fd{
    margin-top: 30px;
    text-align: center;
  }
}
</style>
