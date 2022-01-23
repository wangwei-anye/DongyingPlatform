<template>
  <div>
    <v-modal :value="passwordModal" @on-close="modifyPasswordModal(false)">
      <div class="modal-box modal-content password-modal">
        <i class="closeModal" @click="modifyPasswordModal(false)"></i>
        <h4>修改密码</h4>
        <label class="old-password">
          <span>旧密码: </span>
          <input type="password" :value="oldPassword" @input="inputOldPassword($event.target.value)" placeholder="请输入旧密码" />
        </label>
        <label class="new-password">
          <span>新密码: </span>
          <input type="password" :value="password" @input="inputPassword($event.target.value)" placeholder="请输入新密码" />
        </label>
        <label class="confirm-password">
          <span>确认密码: </span>
          <input type="password" :value="passwordRepeat" @input="inputPasswordRepeat($event.target.value)" placeholder="请确认新密码" />
          <span class="tips" :style="{color: psdError ? 'red': '#4fc7ff'}">{{ psdErrorMsg }}</span>
        </label>
        <button @click="modifyPassword">确认</button>
      </div>
    </v-modal>
  </div>
</template>

<script>
import vModal from '@/components/Modal'
import { createNamespacedHelpers } from 'vuex'

const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform')
const modifyInfo = createNamespacedHelpers('modifyInfo')

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState([
      'passwordModal'
    ]),
    ...modifyInfo.mapState([
      'oldPassword',
      'password',
      'passwordRepeat',
      'psdError',
      'psdErrorMsg'
    ])
  },
  methods: {
    ...mapMutations({
      modifyPasswordModal: 'MODIFY_PASSWORD_MODAL'
    }),
    ...modifyInfo.mapMutations({
      inputOldPassword: 'MODIFY_OLD_PASSWORD',
      inputPassword: 'MODIFY_PASSWORD',
      inputPasswordRepeat: 'MODIFY_PASSWORD_REPEAT',
      modifyPSDError: 'MODIFY_PSD_ERROR',
      modifyPSDErrorMsg: 'MODIFY_PSD_ERROR_MSG'
    }),
    ...modifyInfo.mapActions([
      'modifyPassword'
    ])
  },
  components: {
    vModal
  }
}
</script>

<style lang="scss" scoped>
  .modal-box {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 110;
  }
  .modal-content {
    position: relative;
    padding-top: 27px;
    text-align: center;
    .closeModal {
      position: absolute; top: 18px; right: 19px; width: 21px; height: 21px; background: url(../../assets/image/platform/password_modal_delete.png) no-repeat; cursor: pointer;
    }
    h4 {height: 24px; line-height: 24px; font-size: 24px; color: #4fc7ff; text-align: center; font-weight: normal;}
    .tips {position: absolute; left: 154px; width: auto; color: #4fc7ff; font-size: 12px; text-align: left;}
    label {
      display: block; margin-bottom: 34px; padding: 0 81px 0 149px;
      span {
        position: absolute; left: 55px; width: 74px; height: 32px; line-height: 32px; font-size: 16px; color: #1cb1ff; text-align: right;
      }
      input {
        width: 316px; height: 32px; line-height: 32px; border: 1px solid rgba(28, 177, 255, .87); background-color: rgba(42, 127, 206, .1); font-size: 16px; color: #fff; text-indent: 10px;
      }
      ::-webkit-input-placeholder {color: #2481d0;}
    }
    button {border: none; border-radius: 2px; width: 140px; height: 36px; line-height: 36px; font-size: 16px; color: #fff; background-color: rgba(64, 199, 255, .8); cursor: pointer;}
  }
  .password-modal {
    width: 546px;
    height: 402px;
    background: url(../../assets/image/platform/password_modal_bg.png) no-repeat;
    label.old-password {margin-top: 49px;}
    label.confirm-password {margin-bottom: 54px;}
  }
</style>
