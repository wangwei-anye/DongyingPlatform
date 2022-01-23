<template>
  <div class="permission-page">
    <v-prole @createdUserHandler="createdUserSuccess"></v-prole>
    <v-puser :update="updatedPuser"></v-puser>
    <v-password-modal />
    <v-username-modal />
    <v-logout-modal />
  </div>
</template>
<script>
import vTwoHeader from '@/components/section/TwoHeader'
import vProle from './Prole.vue'
import vPuser from './Puser.vue'
import http from '@/utils/http'
import vPasswordModal from '@/components/section/PasswordModal'
import vUsernameModal from '@/components/section/UsernameModal'
import vLogoutModal from '@/components/section/LogoutModal'
export default {
  name: 'permission',
  data () {
    return {
      provinces: [
        {value: '0', label: '全部'}
      ],
      updatedPuser: false
    }
  },
  components: {
    vTwoHeader,
    vProle,
    vPuser,
    vPasswordModal,
    vUsernameModal,
    vLogoutModal
  },
  methods: {
    search (value, clearFn) {
      console.log(value)
      clearFn && clearFn();
    },
    createdUserSuccess () {
      this.updatedPuser = !this.updatedPuser;
    }
  },
  created () {
    this.$store.dispatch('permission/setRoleTypes');
  }
}
</script>

<style lang="scss">
.permission-page{
  width: 100%;
  height: 1080px;
  overflow: hidden;
  overflow-y: auto;
  padding-bottom: 50px;
  .permission-box{
    margin-top: 20px;
  }
}
.header{
  height: 90px;
  background: #ccc;
}
.permission-box{
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
.prole-box{
  font-size: 16px;
  &__hd{
    position: relative;
  }
  &__bd{
    margin-top: 25px;
  }
  &__fd{
    margin-top: 45px;
    text-align: center;
  }
}
.permission-box__search.v-searchbar{
  position: absolute;
  top: 0;
  right: 0;
}
.puser-box{
  font-size: 16px;
  &__hd{
    position: relative;
  }
  &__bd{
    margin-top: 25px;
  }
  &__fd{
    margin-top: 45px;
    text-align: center;
  }
}
.permission-modal{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 483px;
  height: 276px;
  background: url(../../assets/image/permission-modal.png) no-repeat;
  font-size: 16px;
  color: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  &__hd{
    font-size: 22px;
    color: #4fc7ff;
  }
  &__bd{
    margin-top: 5px;
    >p.red{
      margin-top: 5px;
      margin-left: 90px;
      line-height: normal;
      width: 260px;
      color: #9f3a38;
      font-size: 14px;
    }
  }
  &__fd{
    margin-top: 15px;
    .button{
      margin: 0 40px;
    }
  }
}
.permission-modal2 {
  height: 326px;
  background-image: url(../../assets/image/permission-modal2.png);
}
.prole-form-tip{
  font-size: 14px;
  color: #4e97c5;
  text-align: center;
}
.prole-form-group{
  margin-top: 20px;
}
.puser-label-control {
  display: inline-block;
  width: 70px;
  text-align: right;
  font-size: 16px;
  color: #4fc7ff;
  margin-right: 15px;
}
.puser-input-control {
  width: 260px;
  height: 32px;
  border: 1px solid #1cb1ff;
  background: #034d8c;
  font-size: 16px;
  color: #fff;
  padding: 0 .5em;
}
.prole-listbox{
  overflow: hidden;
  padding-left: 80px;
}
.prole-list{
  display: inline-block;
  width: 200px;
  vertical-align: top;
  &__tit{
    font-size: 16px;
    color: #4fc7ff;
  }
  &__checkbox{
    position: relative;
    float: left;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-top: 3px;
    margin-right: 10px;
    input{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
    i{
      display: block;
      width: 16px;
      height: 16px;
      background: #91dcff;
      border-radius: 4px;
      overflow: hidden;
    }
    input:checked+i{
      background: #91dcff url(../../assets/image/permission-check-icon.png) no-repeat;
    }
    input:checked+i.light{
      background: #91dcff url(../../assets/image/permission-check-icon2.png) no-repeat;
    }
  }
  &__label{
    display: block;
    overflow: hidden;
  }
  .prole-two-list{
    margin-left: 20px;
  }
  li{
    line-height: normal;
    margin-top: 10px;
  }
}
.prole-modal{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 480px;
  min-height: 325px;
  font-size: 16px;
  color: #fff;
  background: #00427f;
  &__border{
    position: absolute;
    top: -16px;
    right: -16px;
    bottom: -16px;
    left: -16px;
    background: rgba(255, 255, 255, 0);
  }
  &__cor1{
    position: absolute;
    top: 0;
    left: 0;
    width: 80px;
    height: 80px;
    background: url(../../assets/image/zpop-cor2.png) no-repeat;
  }
  &__cor2{
    position: absolute;
    top: 0;
    right: 0;
    width: 16px;
    height: 16px;
    background: url(../../assets/image/zpop-border.png) no-repeat right top;
  }
  &__cor3{
    position: absolute;
    bottom: 0;
    right: 0;
    width: 130px;
    height: 130px;
    background: url(../../assets/image/zpop-cor1.png) no-repeat;
  }
  &__cor4{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30px;
    height: 30px;
    background: url(../../assets/image/zpop-cor3.png) no-repeat;
  }
  &__bor-top{
    position: absolute;
    top: 0;
    right: 16px;
    left: 80px;
    height: 16px;
    background: url(../../assets/image/zpop-bor1.png) repeat-x;
  }
  &__bor-bottom{
    position: absolute;
    bottom: 0;
    right: 130px;
    left: 16px;
    height: 16px;
    background: url(../../assets/image/zpop-bor3.png) repeat-x;
  }
  &__bor-left{
    position: absolute;
    top: 80px;
    bottom: 16px;
    left: 0;
    width: 16px;
    background: url(../../assets/image/zpop-bor4.png) repeat-y;
  }
  &__bor-right{
    position: absolute;
    top: 16px;
    bottom: 130px;
    right: 0;
    width: 16px;
    background: url(../../assets/image/zpop-bor2.png) repeat-y;
  }
  &__con{
    position: relative;
    padding: 14px;
    z-index: 2;
    // background: rgba(255, 255, 255, .1);
  }
}
.prole-modal-types{
  &__tit{
    font-size: 22px;
    color: #4fc7ff;
    text-align: center;
  }
  &__tip{
    margin-top: 10px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: normal;
  }
  &__list{
    margin: 20px auto 0;
    width: 328px;
  }
}
.prole-modal-btns{
  margin-top: 70px;
  text-align: center;
  .button{
    margin: 0 40px;
  }
}
.prole-modal-names{
  &__tit{
    font-size: 16px;
    text-align: center;
  }
  &__con{
    margin-top: 15px;
    padding: 20px;
    text-align: center;
    &.bg{
      background: #044888;
    }
    &:after{
      content: '';
      display: block;
      width: 100%;
      height: 0;
      overflow: hidden;
      clear: both;
    }
  }
  &__left {
    text-align: left;
    display: inline-block;
    width: 330px;
    vertical-align: top;
    .v-select{
      margin-top: 20px;
      &:first-of-type{
        margin-top: 0;
      }
    }
  }
  &__right{
    text-align: left;
    display: inline-block;
    vertical-align: top;
    width: 200px;
    height: 340px;
    padding: 0 0 0 10px;
    border-left: 1px dashed #0967b1;
    margin-left: 20px;
    p{
      font-size: 14px;
      color: #4fc7ff;
    }
    ul{
      margin-left: 1em;
      color: #c9eaff;
      span{
        display: inline-block;
        width: 130px;
      }
    }
  }
  &__delete{
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(../../assets/image/zpop-delete-icon.png) no-repeat;
    vertical-align: -2px;
    margin-left: 1em;
  }
  &__input{
    margin-top: 20px;
    font-size: 16px;
    color: #4fc7ff;
    input{
      width: 346px;
      height: 32px;
      border: 1px solid #1cb1ff;
      background: rgba(28, 177, 255, .1);
      padding: 0.5em;
      color: #fff;
    }
  }
}
</style>
