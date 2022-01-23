<template>
<div class="permission-box">
  <div class="permission-box__hd"><i class="permission-box__icon"></i>角色列表</div>
  <div class="permission-box__bd">
    <div class="permission-box__orn"></div>
    <div class="prole-box">
      <div class="prole-box__hd">
        <Select v-model="curTown" class="v-select" placeholder="选择县区" @on-change="townHandler">
          <Option v-for="item in nTowns" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="curSubdistrict" class="v-select" placeholder="选择派出所" @on-change="subdistrictHandler">
          <Option v-for="item in subdistricts" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <!-- <Select v-model="curUnit" class="v-select" placeholder="选择小区" @on-change="unitHandler">
          <Option v-for="item in units" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select> -->
        <v-button :btnInfo="selectedBtn" @click="roleModalPop"></v-button>
        <v-searchbar @searchHandler="search" placeholder="角色名称搜索" class="permission-box__search"></v-searchbar>
      </div>
      <div class="prole-box__bd">
        <Table class="stripe-table" :columns="tableColumns" :data="tableData"></Table>
      </div>
      <div class="prole-box__fd">
        <v-pagination :pageIndex="current" :pageSize="pageSize" :total="total" @toPage='pageChange'></v-pagination>
      </div>
    </div>
  </div>
  <v-modal v-model="disabledModal">
    <div class="permission-modal">
      <div class="permission-modal__hd">确定禁用该角色？</div>
      <div class="permission-modal__bd">禁用角色后，所有与该角色相关联的用户均被禁用</div>
      <div class="permission-modal__fd">
        <v-button :btnInfo="okbtnStyle" @click="disabledModalOk"></v-button>
        <v-button :btnInfo="cancelbtnStyle" @click="disabledModalCancel"></v-button>
      </div>
    </div>
  </v-modal>
  <v-modal v-model="enabledModal">
    <div class="permission-modal">
      <div class="permission-modal__hd">确定启用该角色？</div>
      <div class="permission-modal__bd">启用角色后，所有与该角色相关联的用户均被启用</div>
      <div class="permission-modal__fd">
        <v-button :btnInfo="okbtnStyle" @click="enabledModalOk"></v-button>
        <v-button :btnInfo="cancelbtnStyle" @click="enabledModalCancel"></v-button>
      </div>
    </div>
  </v-modal>
  <v-modal v-model="createdModal">
    <div class="permission-modal permission-modal2">
      <div class="permission-modal__hd">在该角色下创建用户</div>
      <div class="permission-modal__bd">
        <p class="prole-form-tip">用户将具有该角色对应权限</p>
        <div class="prole-form-group">
          <label for="puserPwd1" class="puser-label-control">帐号</label>
          <input id="puserPwd1" type="text" v-model="created_account" class="puser-input-control">
        </div>
        <div class="prole-form-group">
          <label for="puserPwd2" class="puser-label-control">初始密码</label>
          <input id="puserPwd2" type="password" v-model="created_pwd" class="puser-input-control">
        </div>
      </div>
      <div class="permission-modal__fd">
        <v-button :btnInfo="okbtnStyle" @click="createdModalOk"></v-button>
        <v-button :btnInfo="cancelbtnStyle" @click="createdModalCancel"></v-button>
      </div>
    </div>
  </v-modal>
  <v-modal v-model="selectedModal">
    <div class="permission-modal permission-modal2">
      <div class="permission-modal__hd">用户权限分配</div>
      <div class="permission-modal__bd">
        <div class="prole-listbox">
          <ul class="prole-list">
            <li>
              <label class="prole-list__tit">
                <span class="prole-list__checkbox"><input type="checkbox"><i></i></span>
                <span class="prole-list__label">系统设置</span>
              </label>
              <ul class="prole-two-list">
                <li>
                  <label class="prole-list__tit">
                    <span class="prole-list__checkbox"><input type="checkbox"><i></i></span>
                    <span>治安防范标准设置</span>
                  </label>
                </li>
                <li>
                  <label class="prole-list__tit">
                    <span class="prole-list__checkbox"><input type="checkbox"><i></i></span>
                    <span>云巡更标准设置</span>
                  </label>
                </li>
                <li>
                  <label class="prole-list__tit">
                    <span class="prole-list__checkbox"><input type="checkbox"><i></i></span>
                    <span>发案指数标准设置</span>
                  </label>
                </li>
              </ul>
            </li>
          </ul>
          <ul class="prole-list">
            <li>
              <label class="prole-list__tit">
                <span class="prole-list__checkbox"><input type="checkbox"><i></i></span>
                <span class="prole-list__label">特殊人员添加、删除、修改</span>
              </label>
            </li>
            <li>
              <label class="prole-list__tit">
                <span class="prole-list__checkbox"><input type="checkbox"><i></i></span>
                <span class="prole-list__label">敏感信息屏蔽</span>
              </label>
            </li>
          </ul>
        </div>
      </div>
      <div class="permission-modal__fd">
        <v-button :btnInfo="okbtnStyle"></v-button>
        <v-button :btnInfo="cancelbtnStyle"></v-button>
      </div>
    </div>
  </v-modal>
  <v-modal v-model="roleModal" @on-close="roleModalCloseHandler">
    <div class="prole-modal">
      <div class="prole-modal__border">
        <div class="prole-modal__cor1"></div>
        <div class="prole-modal__cor2"></div>
        <div class="prole-modal__cor3"></div>
        <div class="prole-modal__cor4"></div>
        <div class="prole-modal__bor-top"></div>
        <div class="prole-modal__bor-bottom"></div>
        <div class="prole-modal__bor-left"></div>
        <div class="prole-modal__bor-right"></div>
      </div>
      <div class="prole-modal__con">
        <div class="prole-modal-types" v-show="roleModal_inside">
          <div class="prole-modal-types__tit">新建角色</div>
          <p class="prole-modal-types__tip">选择角色类型、角色范围</p>
          <div class="prole-modal-types__list">
            <Select v-model="newRole.type" class="v-select" @on-change="roleTypeHandler">
              <Option v-for="item in roleTypes" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="prole-modal-btns">
            <v-button :btnInfo="roleOkBtnStyle" @click="typeOkHandler"></v-button>
            <v-button :btnInfo="cancelbtnStyle" @click="typeCancelHandler"></v-button>
          </div>
        </div>
        <div class="prole-modal-names" v-show="!roleModal_inside">
          <div class="prole-modal-names__tit">选择{{ showType.tit }}账户，在弹窗内新增</div>
          <div class="prole-modal-names__con">
            <div class="prole-modal-names__left">
              <Select v-model="newRole.town" v-show="showType.value <= 2" class="v-select" placeholder="选择县区" @on-change="rmTownHandler">
                <Option v-for="item in towns" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Select v-model="newRole.police" v-show="showType.value <= 1" class="v-select" placeholder="选择派出所" @on-change="rmPoliceHandler">
                <Option v-for="item in epolices" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div class="prole-modal-btns">
            <v-button :btnInfo="okbtnStyle" @click="nameOkHandler"></v-button>
            <v-button :btnInfo="cancelbtnStyle" @click="nameCancelHandler"></v-button>
          </div>
        </div>
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

console.log(province_code, city_code)

let RSAUtils = rsa.RSAUtils;
export default {
  name: 'permission_role',
  data () {
    return {
      curTown: -1,
      towns: [],
      curSubdistrict: '',
      subdistricts: [],
      curUnit: '',
      units: [],

      rolename: '',
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
      roleOkBtnStyle: {
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
      roleModal: false,
      disabledModal: false,
      enabledModal: false,

      createdModal: false,
      created_account: '',
      created_pwd: '',

      assginModal: false,
      assignAccount: {},

      selectedModal: false,
      roleModal_inside: true,
      newRole: {
      },
      epolices: [],
      tableColumns: [
        { key: 'rolename',
          title: '角色名称'
        },
        { 
          key: 'status',
          title: '状态',
          render: (h, params) => {
            const color = params.row.status == '1' ? '#1cb1ff' : '#f76037';
            const text = params.row.status == '1' ? '正常' : '禁用';
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
          render: (h, params) => {
            if (params.row.role_type != 1) {
              const text = params.row.status == '1' ? '禁用' : '启用';
              let children = [];
              children.push(h(vButton, {
                props: {
                  btnInfo: Object.assign({text: text}, this.tableBtnStyle)
                },
                on: {
                  click: () => {
                    this.disabledHandler(params.row)
                  }
                }
              }));
              children.push(h(vButton,{
                style: { marginLeft: '20px' },
                props: {
                  btnInfo: Object.assign({text: '创建用户'}, this.tableBtnStyle)
                },
                on: {
                  click: () => {
                    this.createdHandler(params.row)
                  }
                }
              }));
              return h('div',{}, children);
            } else {  //全国超级管理员
              return h('div',{}, '/');
            }
          }
        }
      ],
      tableData: [],
      currentRow: {},
      total: 0,
      pageSize: 5,
      current: 1
    }
  },
  computed: {
    roleTypes () {
      return this.$store.getters['permission/roleTypesList'];
    },
    nTowns () {
      return [{value: -1, label: '全部'}].concat(this.towns);
    },
    showType () {
      let result = 0;
      switch (this.newRole.type) {
        case 1:
          result = {value: 3, tit: '全国'};
          break;
        case 10:
        case 11:
          result = {value: 2, tit: '区县'}; //区县
          break;
        case 19:
        case 20:
          result = {value: 1, tit: '派出所'};
          break;
      }
      return result;
    }
  },
  components: {
    vButton,
    vSearchbar,
    vPagination,
    vModal,
    vAssignModal
  },
  methods: {
    search (value, clearFn) {
      this.rolename = value;
      this.reQuery();
      // clearFn && clearFn();
    },
    pageChange (current) {
      this.queryRolePermissions({
        current: current,
        pageSize: this.pageSize,
        province_code: province_code,
        city_code: city_code,
        town_code: this.curTown,
        township_code: '',
        village_code: '',
        police_code: this.curSubdistrict,
        unit_id: this.curUnit,
        rolename: this.rolename
      });
    },
    disabledHandler (item) {
      this.currentRow = item;
      if (item.status === 1) {  //启用状态
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
    createdHandler (item) {
      this.currentRow = item;
      this.createdModal = true;
    },
    createdModalOk () {
      if (this.created_account === '') {
        this.$Message.error('请填写帐号');
        return;
      }
      if (this.created_pwd === '') {
        this.$Message.error('请填写初始密码');
        return;
      }
       http.post('/account/fetchRSAPublicKey.do?publickey_type=2').then(res => {
        if(res.data.success === true){
          const pke = res.data.data.publicKeyExponent;
          const pkm = res.data.data.publicKeyModulus;
          const key = new RSAUtils.getKeyPair(pke, "", pkm);
          const password = RSAUtils.encryptedString(key, this.created_pwd.trim());
          this.addAccount({
            account: this.created_account,
            password: password,
            role_permission_id: this.currentRow.id
          }).then(data => {
            if (data.status === 1) {
              this.$Message.success(data.msg);
              this.createdModalCancel();
              this.$emit('createdUserHandler');
              this.assginModal = true;
              this.assignAccount = {id: data.data};
            } else {
              this.$Message.error(data.msg);
            }
          });
        }
       });
    },
    createdModalCancel () {
      this.currentRow = {};
      this.createdModal = false;
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

    townHandler (value) {
      this.curSubdistrict = '';
      this.curUnit = '';
      this.units = [];
      this.querySubdistricts(value);
      this.reQuery();
    },
    subdistrictHandler (value) {
      // this.curUnit = ''
      // this.queryUnits(value);
      this.reQuery();
    },
    unitHandler (value) {
      console.log(value);
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
    queryPolices(townCode) {
      let query = 'province_code=' + province_code + '&city_code=' + city_code + '&town_code=' + townCode;
      let _this = this;
      api.getPolice(query, function(res){
        const data = res.data;
        if(data.success === true) {
          _this.epolices = data.data.map(item => ({
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

    queryRolePermissions (params) {
      http.post('/account/rolePermissionManager/selectRolePermissions.do', {
        pageNo: params.current,
        pageSize: params.pageSize,
        province_code: params.province_code,
        city_code: params.city_code,
        town_code: params.town_code == -1 ? '' : params.town_code,
        township_code: params.township_code,
        village_code: params.village_code,
        police_code: params.police_code,
        unit_id: params.unit_id,
        rolename: params.rolename
      }).then(res => {
        if (res.data.success === true) {
          this.current = params.current;
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.items;
        }
      })
    },
    reQuery () {
      this.queryRolePermissions({
        current: this.current,
        pageSize: this.pageSize,
        province_code: province_code,
        city_code: city_code,
        town_code: this.curTown,
        township_code: '',
        village_code: '',
        police_code: this.curSubdistrict,
        unit_id: this.curUnit,
        rolename: this.rolename
      });
    },
    createRole (params) {
      return new Promise((resolve, reject) => {
        http.post('/account/rolePermissionManager/checkRolename.do', {
          province_code: params.province_code,
          city_code: params.city_code,
          town_code: params.town_code,
          township_code: params.township_code,
          village_code: params.village_code,
          role_type_id: params.role_type_id,
          police_code: params.police_code
        }).then(res => {
          if (res.data.success === true && res.data.data > 0) {  //存在
            resolve({status: 0, msg: '角色已存在，请不要重复创建'})
          } else if (res.data.success === true && res.data.data <= 0) {  //不存在
            http.get('/account/rolePermissionManager/insert.do', {
              params: {
                role_type_id: params.role_type_id,
                province_code: params.province_code || '',
                city_code: params.city_code || '',
                town_code: params.town_code || '',
                township_code: params.township_code || '',
                village_code: params.village_code || '',
                unitGroup: params.unitGroup || [],
                rolename: params.rolename || '',
                police_code: params.police_code
              }
            }).then(r => {
              if (r.data.success === true) {
                resolve({status: 1, msg: '角色创建成功'})
              } else {
                resolve({status: 0, msg: r.data.msg})
              }
            });
          } else {  //其他
            resolve({status: 0, msg: res.data.msg})
          }
        });
      });
    },
    addAccount (params) {
      return new Promise((resolve, reject) => {
        http.post('/account/checkAccount.do', {
          account: params.account
        }).then(res => {
          if (res.data.data === 1) { //不存在
            http.post('/account/accountManager/insertAccount.do', {
              account: params.account,
              password: params.password,
              role_permission_id: params.role_permission_id
            }).then(res => {
              if (res.data.success === true) {
                resolve({status: 1, msg: '创建用户成功', data: res.data.data});
              } else {
                resolve({status: 0, msg: res.data.msg, data: res.data.data});
              }
            });
          } else {  //存在
            resolve({status: 0, msg: res.data.msg, data: null});
          }
        });
      })
    },

    updateStatus (params) {
      return http.post('/account/rolePermissionManager/updateStatus.do', {
        id: params.id,
        status: params.status
      })
    },

    roleModalPop () {
      this.roleModal = true;
    },
    roleModalCloseHandler () {
      this.nameCancelHandler();
    },
    roleTypeHandler (value) {
      console.log(value)
      if (value != 1 && value != 2) {
        this.roleOkBtnStyle.text = '下一步';
      } else {
        this.roleOkBtnStyle.text = '确定';
      }
    },
    typeOkHandler (e) {
      if (!this.newRole.type) {
        this.$Message.error('请选择角色类型');
        return;
      }
      const text = e.target.innerText;
      if (text === '下一步') {
        this.roleModal_inside = false;
      } else {
        this.createRole({
          role_type_id: this.newRole.type
        }).then(data => {
          if (data.status === 1) {
            this.$Message.success(data.msg);
            this.typeCancelHandler();
          } else {
            this.$Message.error(data.msg);
          }
        });
      }
    },
    typeCancelHandler () {
      this.roleOkBtnStyle.text = '确定';
      this.roleModal = false;
    },
    checkNewRole () {
      let result = '';
      switch (this.showType.value) {
        case 1: //派出所
          if (!this.newRole.town) {
            result = '请选择区县';
            break;
          }
          if (!this.newRole.police) {
            result = '请选择派出所';
            break;
          }
        case 2:
          if (!this.newRole.town) {
            result = '请选择区县';
          }
          break;
        case 3:
          if (!this.newRole.town) {
            result = '全国帐号';
          }
          break;
      }
      return result;
    },
    nameOkHandler () {
      const result = this.checkNewRole();
      if (result) {
        this.$Message.error(result);
        return;
      }
      console.log(this.newRole);
      
      this.createRole({
        role_type_id: this.newRole.type,
        province_code: this.newRole.province || '',
        city_code: this.newRole.city || '',
        town_code: this.newRole.town || '',
        township_code: this.newRole.subdistrict || '',
        village_code: this.newRole.village || '',
        unitGroup: this.newRole.unit || [],
        rolename: this.newRole.rolename || '',
        police_code: this.newRole.police || ''
      }).then(data => {
        if (data.status === 1) {
          this.$Message.success(data.msg);
          this.nameCancelHandler();
          this.typeCancelHandler();
          this.reQuery();
        } else {
          this.$Message.error(data.msg);
        }
      });
    },
    nameCancelHandler () {
      this.newRole = {
        type: '',
        province: '',
        city: '',
        town: '',
        subdistrict: '',
        village: '',
        unit: [],
        rolename: ''
      };
      this.roleModal_inside = true;
    },
    rmTownHandler (value) {
      this.queryPolices(value);
    },
    rmPoliceHandler (value) {
      console.log(value)
    }
  },
  created () {
    this.queryTowns();
    this.queryRolePermissions({
      current: 1,
      pageSize: this.pageSize,
      province_code: province_code,
      city_code: city_code,
      town_code: '',
      township_code: '',
      village_code: '',
      unit_id: '',
      police_code: '',
      rolename: ''
    });
  }
}
</script>

