<template>
<div class="permission-modal permission-modal2">
  <div class="permission-modal__hd">用户权限分配</div>
  <div class="permission-modal__bd">
    <div class="prole-listbox">
      <ul class="prole-list" v-for="item in list" :key="item.id">
        <li>
          <label class="prole-list__tit">
            <span class="prole-list__checkbox"><input type="checkbox" v-model="item.checked" @change="inputChange(item)"><i :class="{light: item.selectedSome}"></i></span>
            <span class="prole-list__label">{{ item.name }}</span>
          </label>
          <ul class="prole-two-list" v-if="item.children.length > 0">
            <li v-for="subitem in item.children" :key="subitem.id">
              <label class="prole-list__tit">
                <span class="prole-list__checkbox"><input type="checkbox" v-model="subitem.checked" @change="inputChange(subitem)"><i></i></span>
                <span>{{ subitem.name }}</span>
              </label>
            </li>
          </ul>
        </li>
      </ul>
      <!-- <ul class="prole-list">
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
      </ul> -->
    </div>
  </div>
  <div class="permission-modal__fd">
    <v-button :btnInfo="okbtnStyle" @click="okFn"></v-button>
    <v-button :btnInfo="cancelbtnStyle" @click="cancelFn"></v-button>
  </div>
</div>
</template>
<script>
import vButton from '@/components/Button'
import http from '@/utils/http'
export default {
  name: 'assign-modal',
  props: {
    account: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
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
      list: [],
      vaList: {}
    }
  },
  watch: {
    account (val, oldVal) {
      if (val.id && val.id != oldVal.id) {
        this.selectFuncTypeList(val.id);
      }
    }
  },
  methods: {
    okFn () {
      let result = [];
      this.list.forEach(item => {
        if (item.checked) {
          item.children.forEach(subItem => {
            if (subItem.checked) {
              result.push(item.id + ':'+subItem.id);
            }
          });
        }
      });
      this.addFuncPermission({
        id: this.account.id,
        funcIds: result.join(',')
      }).then(res => {
        this.$emit('on-success', res);
      });
    },
    cancelFn () {
      this.$emit('on-close');
    },
    selectFuncTypeList (id) {
      http.post('/account/selectFuncTypeList.do', {
        id: id
      }).then(res => {
        if (res.data.success === true) {
          this.list = this.formatList(res.data.data.funcList);
          this.vaList = res.data.data.validList;
          this.initList();
        }
      })
    },
    inputChange (item) {
      if (item.checked) {
        if (item.children) {
          item.children.forEach(elem => {
            elem.checked = true;
          });
        }
      } else {
        item.selectedSome = false;
        if (item.children) {
          item.children.forEach(elem => {
            elem.checked = false;
          });
        }
      }
      if (item.pid) {
        this.list.forEach(elem => {
          if (elem.id == item.pid) {
            const selectedArr = elem.children.filter(subElem => subElem.checked);
            if (selectedArr.length > 0 && selectedArr.length < elem.children.length) {
              elem.checked = true;
              elem.selectedSome = true;
            } else if (selectedArr.length === elem.children.length) {
              elem.checked = true;
              elem.selectedSome = false;
            } else {
              elem.checked = false;
              elem.selectedSome = false;
            }
          }
        });
      }
    },
    formatList (list) {
      const result = list.map(item => {
        const subArr = item.subList.map(subItem => {
          return {
            id: subItem.id,
            name: subItem.name,
            checked: false,
            pid: subItem.parent_id
          }
        });
        return {
          id: item.id,
          name: item.name,
          children: subArr,
          checked: false
        }
      });
      return result;
    },
    checkChild () {
      this.list.forEach(item => {
        const selectedArr = item.children.filter(subItem => subItem.checked);
        if (selectedArr.length > 0 && selectedArr.length < item.children.length) {
          item.checked = true;
          item.selectedSome = true;
        } else if (selectedArr.length === item.children.length && selectedArr.length !== 0) {
          item.checked = true;
          item.selectedSome = false;
        } else {
          item.checked = false;
          item.selectedSome = false;
        }
      });
    },
    initList () {
      if (this.vaList) {
        Object.keys(this.vaList).forEach(key => {
          this.list.forEach(item => {
            if(item.id == key) {
              this.vaList[key].forEach(sid => {
                item.children.find(i => {
                  if (i.id == sid) {
                    i.checked = true;
                  }
                });
              });
              this.checkChild();
            }
          })
        });
      }
    },
    addFuncPermission (params) {
      return http.post('/account/insertOrUpdateFuncPermission.do', {
        id: params.id,
        funcIds: params.funcIds
      })
    }
  },
  components: {
    vButton
  }
}
</script>
