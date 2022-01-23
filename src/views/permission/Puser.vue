<template>
<div class="permission-box">
  <div class="permission-box__hd"><i class="permission-box__icon"></i>用户管理</div>
  <div class="permission-box__bd">
    <div class="permission-box__orn"></div>
    <div class="puser-box">
      <div class="puser-box__hd">
        <Select v-model="curTown" class="v-select" placeholder="选择县区" @on-change="townHandler">
          <Option v-for="item in nTowns" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="curSubdistrict" class="v-select" placeholder="选择派出所" @on-change="subdistrictHandler">
          <Option v-for="item in subdistricts" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <v-searchbar @searchHandler="search" placeholder="用户名称/账户查询" class="permission-box__search"></v-searchbar>
      </div>
      <div class="puser-box__bd">
        <Table class="stripe-table" :columns="tableColumns" :data="tableData"></Table>
      </div>
      <div class="puser-box__fd">
        <v-pagination :pageIndex="current" :pageSize="pageSize" :total="total" @toPage='pageChange'></v-pagination>
      </div>
    </div>
  </div>
  <v-modal v-model="disabledModal">
    <div class="permission-modal">
      <div class="permission-modal__hd">确定禁用该用户？</div>
      <div class="permission-modal__bd">禁用用户后，该用户不可使用本系统</div>
      <div class="permission-modal__fd">
        <v-button :btnInfo="okbtnStyle" @click="disabledModalOk"></v-button>
        <v-button :btnInfo="cancelbtnStyle" @click="disabledModalCancel"></v-button>
      </div>
    </div>
  </v-modal>
  <v-modal v-model="enabledModal">
    <div class="permission-modal">
      <div class="permission-modal__hd">确定启用该用户？</div>
      <div class="permission-modal__bd">启用账户后，账户可重新使用本系统</div>
      <div class="permission-modal__fd">
        <v-button :btnInfo="okbtnStyle" @click="enabledModalOk"></v-button>
        <v-button :btnInfo="cancelbtnStyle" @click="enabledModalCancel"></v-button>
      </div>
    </div>
  </v-modal>
  <v-modal v-model="modifiedModal">
    <div class="permission-modal">
      <div class="permission-modal__hd">为该账户重设密码</div>
      <div class="permission-modal__bd">
        <label for="puserPwd" class="puser-label-control">新密码</label>
        <input id="puserPwd" type="text" class="puser-input-control" v-model="newPwd">
        <p class="red">不能为纯数字、字母或字符，不能包含空格，8-22个字符</p>
      </div>
      <div class="permission-modal__fd">
        <v-button :btnInfo="okbtnStyle" @click="modifiedModalOk"></v-button>
        <v-button :btnInfo="cancelbtnStyle" @click="modifiedModalCancel"></v-button>
      </div>
    </div>
  </v-modal>
  <v-modal v-model="deletedModal">
    <div class="permission-modal">
      <div class="permission-modal__hd">确定删除该用户？</div>
      <div class="permission-modal__fd">
        <v-button :btnInfo="okbtnStyle" @click="deletedModalOk"></v-button>
        <v-button :btnInfo="cancelbtnStyle" @click="deletedModalCancel"></v-button>
      </div>
    </div>
  </v-modal>
  <v-modal v-model="assginModal">
    <v-assign-modal :account="assignAccount" @on-success="successAssginModal" @on-close="closeAssginModal"></v-assign-modal>
  </v-modal>
</div>
</template>
<script>
import vButton from '@/components/Button'
import vSearchbar from '@/components/Searchbar'
import vPagination from '@/components/Pagination'
import vModal from '@/components/Modal'
import vAssignModal from './AssignModal'
import http from '@/utils/http'
import rsa from '../../utils/RSA'
import { province_code, city_code } from '@/config'
import api from '@/API/platform'

let RSAUtils = rsa.RSAUtils;
export default {
  name: 'permission_role',
  props: {
    update: {
      type: Boolean
    }
  },
  data () {
    return {
      curTown: -1,
      towns: [],
      curSubdistrict: '',
      subdistricts: [],
      curUnit: '',
      units: [],
      name: '',
      selectedBtn: {
        text: '新建角色',
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
      okbtnStyle: {
        text: '确定',
        styles: {
          width: '100px',
          height: '36px',
          border: '0',
          backgroundColor: '#40c7ff',
          hoverColor: '#40c7ff',
          fontSize: '16px',
          color: '#fff',
          borderRadius: '2px'
        }
      },
      cancelbtnStyle: {
        text: '取消',
        styles: {
          width: '100px',
          height: '36px',
          border: '0',
          backgroundColor: '#1c7bb6',
          hoverColor: '#1c7bb6',
          fontSize: '16px',
          color: '#fff',
          borderRadius: '2px'
        }
      },
      tableBtnStyle: {
        styles: {
          width: '106px',
          height: '32px',
          border: '1px solid #01a3fe',
          backgroundColor: 'rgba(1, 163, 254, .1)',
          hoverColor: 'rgba(1, 163, 254, .5)',
          fontSize: '16px',
          color: '#1cb1ff',
          borderRadius: '4px'
        }
      },
      disabledModal: false,
      enabledModal: false,
      modifiedModal: false,
      newPwd: '',
      deletedModal: false,
      assginModal: false,
      assignAccount: {},
      tableColumns: [
        { key: 'username', title: '名称' },
        { key: 'account', title: '账户' },
        { key: 'rolename', title: '角色' },
        { 
          key: 'status',
          title: '状态',
          render: (h, params) => {
            const color = params.row.status === 1 ? '#1cb1ff' : '#f76037';
            const text = params.row.status === 1 ? '正常' : '禁用';
            return h(
              'span',
              {
                style: {
                  color: color
                }
              },
              text
            )
          }
        },
        { 
          key: 'action',
          title: '操作',
          width: 560,
          render: (h, params) => {
            const text = params.row.status == '1' ? '禁用' : '启用';
            let children = [];
            children.push(h(vButton, {
              style: { marginLeft: '0px' },
              props: {
                btnInfo: Object.assign({text: '分配资源'}, this.tableBtnStyle)
              },
              on: {
                click: () => {
                  this.assignedHandler(params.row)
                }
              }
            }));
            children.push(h(vButton, {
              style: { marginLeft: '20px' },
              props: {
                btnInfo: Object.assign({text: '重设密码'}, this.tableBtnStyle)
              },
              on: {
                click: () => {
                  this.resetedHandler(params.row)
                }
              }
            }));
            children.push(h(vButton, {
              style: { marginLeft: '20px' },
              props: {
                btnInfo: Object.assign({text: text}, this.tableBtnStyle)
              },
              on: {
                click: () => {
                  this.toggleHandler(params.row)
                }
              }
            }));
            children.push(h(vButton, {
              style: { marginLeft: '20px' },
              props: {
                btnInfo: Object.assign({text: '删除'}, this.tableBtnStyle)
              },
              on: {
                click: () => {
                  this.deletedHandler(params.row)
                }
              }
            }))
            return h('div',{}, children);
          }
        }
      ],
      currentRow: {},
      tableData: [],
      total: 0,
      pageSize: 5,
      current: 1
    }
  },
  components: {
    vButton,
    vSearchbar,
    vPagination,
    vModal,
    vAssignModal
  },
  computed: {
    nTowns () {
      return [{value: -1, label: '全部'}].concat(this.towns);
    },
  },
  watch: {
    update (val, oldVal) {
      if (val != oldVal) {
        this.reQuery();
      }
    }
  },
  methods: {
    search (value, clearFn) {
      this.name = value;
      this.queryAccountList({
        current: this.current,
        pageSize: this.pageSize,
        province_code: province_code,
        city_code: city_code,
        town_code: this.curTown,
        township_code: '',
        village_code: '',
        police_code: this.curSubdistrict,
        unit_id: this.curUnit,
        account: '',
        username: '',
        name: this.name
      });
      // clearFn && clearFn();
    },
    pageChange (current) {
      this.queryAccountList({
        current: current,
        pageSize: this.pageSize,
        province_code: province_code,
        city_code: city_code,
        town_code: this.curTown,
        township_code: '',
        village_code: '',
        police_code: this.curSubdistrict,
        unit_id: this.curUnit,
        account: '',
        username: '',
        name: this.name
      });
    },
    assignedHandler (item) {
      this.assignAccount = item;
      this.assginModal = true;
    },
    successAssginModal (res) {
      if (res.data.success === true){
        this.$Message.success('权限分配成功');
        this.closeAssginModal();
      } else {
        this.$Message.error(res.data.msg);
      }
    },
    closeAssginModal () {
      this.assignAccount = {};
      this.assginModal = false;
    },
    resetedHandler (item) {
      console.log(item)
      this.currentRow = item;
      this.modifiedModal = true;
    },
    modifiedModalOk () {
      if (this.newPwd === '') {
        this.$Message.error('请填写新密码');
        return;
      }
      http.post('/account/fetchRSAPublicKey.do?publickey_type=3').then(res => {
        if(res.data.success === true){
          const pke = res.data.data.publicKeyExponent;
          const pkm = res.data.data.publicKeyModulus;
          const key = new RSAUtils.getKeyPair(pke, "", pkm);
          const password = RSAUtils.encryptedString(key, this.newPwd.trim());
          this.updatePassword({
            id: this.currentRow.id,
            password: password
          }).then(res => {
            if(res.data.success === true){
              this.$Message.success('重设密码成功');
              this.modifiedModalCancel();
            } else {
              this.$Message.error(res.data.msg);
            }
          });
        }
      });
    },
    modifiedModalCancel () {
      this.currentRow = {};
      this.newPwd = '';
      this.modifiedModal = false;
    },
    toggleHandler (item) {
      this.currentRow = item;
      if(item.status == 1) {  //正常状态
        this.disabledModal = true;
      } else {  //禁用状态
        this.enabledModal = true;
      }
    },
    disabledModalOk () {
      this.updateStatus({
        id: this.currentRow.id,
        status: 2
      }).then(res => {
        if(res.data.success === true) {
          this.disabledModalCancel();
          this.$Message.success('禁用成功');
          this.reQuery();
        }else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    disabledModalCancel () {
      this.currentRow = {};
      this.disabledModal = false;
    },
    enabledModalOk () {
      this.updateStatus({
        id: this.currentRow.id,
        status: 1
      }).then(res => {
        if(res.data.success === true) {
          this.enabledModalCancel();
          this.$Message.success('启用成功');
          this.reQuery();
        }
      });
    },
    enabledModalCancel () {
      this.currentRow = {};
      this.enabledModal = false;
    },
    deletedHandler (item) {
      this.currentRow = item;
      this.deletedModal = true;
    },
    deletedModalOk () {
      this.deleteAccount({
        id: this.currentRow.id,
        status: 0
      }).then(res => {
        if(res.data.success === true) {
          this.deletedModalCancel();
          this.$Message.success('删除成功');
          this.reQuery();
        }
      })
    },
    deletedModalCancel () {
      this.currentRow = {};
      this.deletedModal = false;
    },

    townHandler (value) {
      this.curSubdistrict = '';
      this.subdistricts = [];
      this.querySubdistricts(value);
      this.reQuery();
    },
    subdistrictHandler (value) {
      this.reQuery();
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
    querySubdistricts (townCode) {
      let query = 'province_code=' + province_code + '&city_code=' + city_code + '&town_code=' + townCode;
      let _this = this;
      api.getPolice(query, function(res){
        const data = res.data;
        if(data.success === true) {
          _this.subdistricts = data.data.map(item => ({
            value: item.id,
            label: item.police_station
          }))
        }
      });
    },
    queryUnits (policeCode) {
      let query = 'province_code=' + province_code + '&city_code=' + city_code + '&town_code=' + this.curTown + '&police_code=' + policeCode;
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

    queryAccountList (params) {
      http.post('/account/accountManager/selectAccountList.do', {
        pageNo: params.current,
        pageSize: params.pageSize,
        province_code: params.province_code,
        city_code: params.city_code,
        town_code: params.town_code == -1 ? '' : params.town_code,
        township_code: params.township_code,
        village_code: params.village_code,
        police_code: params.police_code,
        unit_id: params.unit_id,
        account: params.account,
        username: params.username,
        name: params.name
      }).then(res => {
        if (res.data.success === true) {
          this.current = params.current;
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.items;
        }
      })
    },
    reQuery () {
      this.queryAccountList({
        current: this.current,
        pageSize: this.pageSize,
        province_code: province_code,
        city_code: city_code,
        town_code: this.curTown,
        township_code: '',
        village_code: '',
        police_code: this.curSubdistrict,
        unit_id: this.curUnit,
        account: '',
        username: '',
        name: this.name
      });
    },

    updateStatus (params) {
      return http.post('/account/updateStatus.do', {
        id: params.id,
        status: params.status
      })
    },
    deleteAccount (params) {
      return http.post('/account/accountManager/deleteAccount.do', {
        id: params.id,
        status: params.status
      });
    },
    updatePassword (params) {
      return http.post('/account/updatePassword.do', {
        id: params.id,
        oldPassword: params.oldPassword || '',
        password: params.password
      })
    }
  },
  created () {
    this.queryTowns();
    this.queryAccountList({
      current: 1,
      pageSize: this.pageSize,
      province_code: province_code,
      city_code: city_code,
      town_code: '',
      township_code: '',
      village_code: '',
      unit_id: '',
      account: '',
      username: '',
      name: ''
    });
  }
}
</script>

