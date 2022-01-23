<template>
  <div class="complete-info-wrap">
    <div class="complete-wrap">
      <label class="passport">
        <span>账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
        <span>{{ global.accountInfo.account }}</span>
      </label>
      <label class="username">
        <span>用&nbsp;&nbsp;户&nbsp;&nbsp;名 : </span>
        <input type="text" :value="username" @input="mutateUsername($event.target.value)" placeholder="建议填写真实姓名" autofocus />
      </label>
      <label class="password">
        <span>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码 : </span>
        <input type="password" :value="password" @input="mutatePassword($event.target.value)" placeholder="请输入新密码" />
      </label>
      <label class="confirm">
        <span>确认密码 : </span>
        <input type="password" :value="passwordRepeat" @input="mutatePasswordRepeat($event.target.value)" placeholder="请确认新密码" />
      </label>
      <span class="error-msg" v-show="error">{{ errorMsg }}</span>
      <Button class="submit" @click="completeAccount">提交</Button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex'

const completeInfo = createNamespacedHelpers('completeInfo')

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState([
      'global'
    ]),
    ...completeInfo.mapState([
      'username',
      'password',
      'passwordRepeat',
      'errorMsg',
      'error'
    ])
  },
  methods: {
    ...completeInfo.mapMutations({
      mutateUsername: 'MUTATE_USERNAME',
      mutatePassword: 'MUTATE_PASSWORD',
      mutatePasswordRepeat: 'MUTATE_PASSWORD_REPEAT'
    }),
    ...completeInfo.mapActions([
      'completeAccount'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .complete-info-wrap {
    width: 100%; height: 100%; background: url(../assets/image/completeInfo/bg.png) no-repeat;
    .complete-wrap {
      position: absolute; top: 218px; left: 575px; width: 771px; height: 674px; text-align: center;
      label {
        display: block; margin-bottom: 47px; height: 54px; line-height: 54px; text-align: left;
        span:first-child {
          position: absolute; left: 121px; width: 122px; font-size: 26px; color: #1cb1ff;
        }
        input, span:last-child {
          display: inline-block; margin: 4px 0 0 259px; width: 447px; height: 46px; color: #fff; line-height: 46px; font-size: 26px; text-align: left; text-indent: 11px; outline: none;
        }
        input {border: none; border-bottom: 1px solid #1582d7; background-color: transparent;}
        ::-webkit-input-placeholder {color: rgba(28, 177, 255, .2);}
      }
      label:first-child {margin-top: 101px;}
      label.confirm {margin-bottom: 98px !important;}
      .submit {
        border: none; border-radius: 3px; width: 305px; height: 66px; font-size: 26px; color: #fff; background-color: rgba(28, 177, 255, .57);
      }
      .error-msg {position: absolute; bottom: 159px; left: 0; width: 100%; font-size: 16px; color: red; text-align: center;}
    }
  }
</style>
