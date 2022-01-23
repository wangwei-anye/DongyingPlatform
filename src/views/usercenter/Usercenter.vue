<template>
  <div class="usercenter-page">
    <div class="syssetting-box">
      <div class="syssetting-box__hd"><i class="syssetting-box__icon"></i>用户信息</div>
      <div class="syssetting-box__bd">
        <div class="syssetting-box__orn"></div>
        <div class="usercenter-base">
          <div class="usercenter-base__pic">
            <div class="cornor">
              <div class="c1"></div>
              <div class="c2"></div>
              <div class="c3"></div>
              <div class="c4"></div>
            </div>
            <div class="photo">
              <img src="" alt="">
            </div>
          </div>
          <div class="usercenter-base__info">
            <p>
              <label>用户名：</label>
              <span class="value">{{ uname }}</span>
              <a href="javascript:;" class="usercenter-edit" @click="modifyUsernameModal(true)"></a>
            </p>
            <p>
              <label>帐　号：</label>
              <span class="value">{{ account }}</span>
              <a href="javascript:;" class="usercenter-modified" @click="modifyPasswordModal(true)">修改密码</a>
            </p>
            <p>
              <label>角　色：</label>
              <span class="value">{{ rolename }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="usercenter-list">
      <div class="hd"><i></i>登录历史</div>
      <div class="bd">
        <ul>
          <li v-for="item in items" :key="item.id"><time>{{ formatTime(item.login_time) }}</time><span>IP地址：{{ item.ip }}</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import http from '@/utils/http';
import { createNamespacedHelpers } from 'vuex';
const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform');
export default {
  name: 'usercenter',
  data() {
    return {
      items: []
    }
  },
  computed: {
    uid() {
      return this.$store.state.global.accountInfo.id;
    },
    uname() {
      return this.$store.state.global.accountInfo.username;
    },
    account() {
      return this.$store.state.global.accountInfo.account;
    },
    rolename() {
      return this.$store.state.global.accountInfo.rolePermission.rolename;
    }
  },
  methods: {
    getLogs(id) {
      http.get('/account/selectLoginHistory.do?id='+id).then(res => {
        const data = res.data;
        if(data.success === true) {
          this.items = data.data;
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
    },
    ...mapMutations({
      modifyPasswordModal: 'MODIFY_PASSWORD_MODAL',
      modifyUsernameModal: 'MODIFY_USERNAME_MODAL',
      modifyLogoutModal: 'MODIFY_LOGOUT_MODAL',
      updateShowSearch: 'UPDATE_SHOW_SEARCH',
      updateKeyWord: 'UPDATE_KEY_WORD'
    })
  },
  created() {
    this.getLogs(this.uid);
  }
}
</script>
<style lang="scss" scoped>
.usercenter-page{
  padding: 20px 0 50px 0;
}
.usercenter-base{
  width: 100%;
  height: 304px;
  overflow: hidden;
  background: rgba(15, 145, 255, .1);
  &__pic{
    float: left;
    margin-top: 50px;
    margin-left: 70px;
    position: relative;
    width: 180px;
    height: 204px;
    >.cornor{
      position: absolute;
      top: 3px;
      right: 3px;
      bottom: 3px;
      left: 3px;
      border: 1px solid #1757a4;
      >.c1{
        position: absolute;
        top:-2px;
        left:-2px;
        width: 14px;
        height: 14px;
        overflow: hidden;
        &:before{
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 14px;
          background: #137fcb;
        }
        &:after{
          content: "";
          position: absolute;
          top:0;
          left: 0;
          width: 14px;
          height: 5px;
          background: #137fcb;
        }
      }
      >.c2{
        position: absolute;
        top:-2px;
        right:-2px;
        width: 14px;
        height: 14px;
        overflow: hidden;
        &:before{
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 5px;
          height: 14px;
          background: #137fcb;
        }
        &:after{
          content: "";
          position: absolute;
          top:0;
          right: 0;
          width: 14px;
          height: 5px;
          background: #137fcb;
        }
      }
      >.c3{
        position: absolute;
        bottom:-2px;
        left:-2px;
        width: 14px;
        height: 14px;
        overflow: hidden;
        &:before{
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 14px;
          background: #137fcb;
        }
        &:after{
          content: "";
          position: absolute;
          bottom:0;
          left: 0;
          width: 14px;
          height: 5px;
          background: #137fcb;
        }
      }
      >.c4{
        position: absolute;
        bottom:-2px;
        right:-2px;
        width: 14px;
        height: 14px;
        overflow: hidden;
        &:before{
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 5px;
          height: 14px;
          background: #137fcb;
        }
        &:after{
          content: "";
          position: absolute;
          bottom:0;
          right: 0;
          width: 14px;
          height: 5px;
          background: #137fcb;
        }
      }
    }
    >.photo{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
      width: 160px;
      height: 184px;
      border: 1px solid #25a5ff;
      box-shadow: 0 0 10px rgba(49, 170, 233, .5);
      background: rgba(15, 145, 255, .22) url(../../assets/image/usercenter-default.png) no-repeat center center;
      >img{
        width: 100%;
        height: 100%;
      }
    }
  }
  &__info{
    margin-top: 50px;
    margin-left: 65px;
    float: left;
    font-size: 22px;
    color: #0093f0;
    >p{
      line-height: 65px;
    }
    .value{
      color: #fff;
    }
    .usercenter-edit{
      display: inline-block;
      width: 24px;
      height: 24px;
      vertical-align: middle;
      background: url(../../assets/image/usercenter-edit.png) no-repeat center center;
    }
    .usercenter-modified{
      color: #0093f0;
      font-size: 16px;
      text-decoration: underline;
      margin-left: 1em;
    }
  }
}
.usercenter-list{
  margin: 0 27px;
  color: #fff;
  overflow: hidden;
  >.hd{
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 20px;
    color: #1cb1ff;
    i{
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00c0ff;
      box-shadow: 0 0 5px #00c0ff;
      vertical-align: middle;
      margin-right: 25px;
      margin-left: 28px;
    }
  }
  >.bd{
    ul{
      list-style: none;
      font-size: 16px;
    }
    li{
      position: relative;
      height: 48px;
      line-height: 48px;
      padding-left: 60px;
      &:after{
        content: "";
        position: absolute;
        top: 50%;
        left: 28px;
        width: 8px;
        height: 8px;
        background: #2d9bff;
        margin-top: -4px;
      }
      &:nth-of-type(odd) {
        background: rgba(2, 67, 126, .25);
      }
      span{
        margin-left: 5em;
      }
    }
  }
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
}
</style>

