<template>
  <v-modal :value="logoutModal" @on-close="modifyLogoutModal(false)">
    <div class="modal-box modal-content logout-modal">
      <h4>退出当前账号?</h4>
      <button class="sure" @click="merge">确定</button>
      <button class="cancel" @click="modifyLogoutModal(false)">取消</button>
    </div>
  </v-modal>
</template>

<script>
import vModal from '@/components/Modal'
import { createNamespacedHelpers } from 'vuex'

const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform')
const mapLogin = createNamespacedHelpers('login')

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState([
      'logoutModal'
    ])
  },
  methods: {
    ...mapMutations({
      modifyLogoutModal: 'MODIFY_LOGOUT_MODAL',
      updateTownList: 'UPDATE_TOWNLIST',
      setCurrentTown: 'SET_CURRENT_TOWN',
      updateTownshipList: 'UPDATE_TOWNSHIPLIST',
      setCurrentTownship: 'SET_CURRENT_TOWNSHIP',
      updateVillageList: 'UPDATE_VILLAGELIST',
      setCurrentvillage: 'SET_CURRENT_VILLAGE',
      updateUnitlist: 'UPDATE_UNITLIST',
      setCurrentUnit: 'SET_CURRENT_UNIT'
    }),
    ...mapLogin.mapActions([
      'logout'
    ]),
    merge() {
      this.logout()
      this.modifyLogoutModal(false)
    }
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
  .logout-modal {
    width: 483px;
    height: 276px;
    padding-top: 72px;
    background: url(../../assets/image/platform/logout_modal_bg.png) no-repeat;
    h4 {margin-bottom: 71px;}
    button {width: 100px; height: 36px;}
    button.sure {margin-right: 80px;}
  }
</style>
