<template>
  <v-modal :value="usernameModal" @on-close="modifyUsernameModal(false)">
    <div class="modal-box modal-content username-modal">
      <i class="closeModal" @click="modifyUsernameModal(false)"></i>
      <h4>修改用户名</h4>
      <label>
        <span>用户名: </span>
        <input type="text" :value="username" @input="mutateUsername($event.target.value)" placeholder="请输入新的用户名" />
        <span class="tips" :style='{color: nameError ? "red" : "#4fc7ff"}'>{{ nameErrorMsg }}</span>
      </label>
      <button @click="modifyUsername" @key.enter="merge">确认</button>
    </div>
  </v-modal>
</template>

<script>
import vModal from '@/components/Modal'
import { createNamespacedHelpers, mapState } from 'vuex'
import {deepCopy} from '../../utils/util'

const platform = createNamespacedHelpers('platform')
const modifyInfo = createNamespacedHelpers('modifyInfo')

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState([
      'global'
    ]),
    ...platform.mapState([
      'usernameModal'
    ]),
    ...modifyInfo.mapState([
      'nameErrorMsg',
      'nameError',
      'username'
    ])
  },
  methods: {
    ...platform.mapMutations({
      modifyUsernameModal: 'MODIFY_USERNAME_MODAL'
    }),
    ...modifyInfo.mapMutations({
      mutateUsername: 'MODIFY_USERNAME',
      mutateNameErrorMsg: 'MODIFY_NAME_ERROR_MSG',
      mutateNameError: 'MODIFY_NAME_ERROR'
    }),
    ...modifyInfo.mapActions([
      'modifyUsername'
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
  .username-modal {
    width: 546px;
    height: 302px;
    background: url(../../assets/image/platform/username_modal_bg.png) no-repeat;
    label {margin: 49px 0 72px 0;}
  }
</style>
