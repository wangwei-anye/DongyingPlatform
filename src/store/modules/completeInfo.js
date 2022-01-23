import * as types from '../mutation_types'
import rsa from '../../utils/RSA'
import router from '../../router'
import info from '../../API/completeInfo'
import login from '../../API/login'
import {deepCopy} from '../../utils/util'

var RSAUtils = rsa.RSAUtils;

const state = {
  username: '',
  password: '',
  passwordRepeat: '',
  errorMsg: '',
  error: false,
  publicKey: {}
}

const getters = {
  formData(state, getters, rootState) {
    if (!state.publicKey.publicKeyExponent) return;

    let key = new RSAUtils.getKeyPair(state.publicKey.publicKeyExponent, "", state.publicKey.publicKeyModulus);
    let password = RSAUtils.encryptedString(key, state.password.trim());

    return {
      id: rootState.global.accountInfo.id,
      username: state.username.trim(),
      password: password 
    }
  }
}

const mutations = {
  [types.MUTATE_USERNAME](state, name) {
    state.username = name;
  },
  [types.MUTATE_PASSWORD](state, password) {
    state.password = password;
  },
  [types.MUTATE_PASSWORD_REPEAT](state, passwordRepeat) {
    state.passwordRepeat = passwordRepeat;
  },
  [types.MUTATE_ERROR](state, error) {
    state.error = error;
  },
  [types.MUTATE_ERROR_MSG](state, errorMsg) {
    state.errorMsg = errorMsg;
  },
  [types.MUTATE_PUBLICKEY](state, publicKey) {
    state.publicKey = publicKey;
  }
}

const actions = {
  completeAccount({commit, state, getters, rootState}) {
    let usernameRule = /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,30}$/,
        passwordRule = /^(?![0-9]+$)(?![a-zA-Z]+$).{8,20}$/;

    let psMatched = state.password.search(passwordRule) !== -1,
      psRepeatMatched = state.passwordRepeat.search(passwordRule) !== -1,
      usernameMatched = state.username.search(usernameRule) !== -1,
      repeatMatched = state.password === state.passwordRepeat;

    if (!repeatMatched) {
      commit(types.MUTATE_ERROR, true);
      commit(types.MUTATE_ERROR_MSG, '密码输入不一致！')
    }

    if (!psMatched || !psRepeatMatched) {
      commit(types.MUTATE_ERROR, true);
      commit(types.MUTATE_ERROR_MSG, '密码长度为8-22个字符，不能为纯数字、字母或字符，不能包含空格！')
    }

    if (!usernameMatched) {
      commit(types.MUTATE_ERROR, true);
      commit(types.MUTATE_ERROR_MSG, '用户名长度为2-30位，仅支持中文、字母、数字、下划线！')
    }

    if (psMatched && psRepeatMatched && repeatMatched) {
      commit(types.MUTATE_ERROR, false)
      commit(types.MUTATE_ERROR_MSG, '')
    }

    if (!state.error) {
      login.getPublicKey(
        '3',
        response => {
          commit(types.MUTATE_PUBLICKEY, response.data.data);
          info.completeAccount(
            getters.formData,
            response => {
              var res = response.data;
              if (res.data == -7) {
                commit(types.MUTATE_ERROR_MSG, '用户名已存在!');
                commit(types.MUTATE_ERROR, true);
              } else if (res.code === '0000') {
                let accountInfoCopy = deepCopy(rootState.global.accountInfo);

                accountInfoCopy.username = state.username;
                commit('UPDATE_ACCOUNTINFO', accountInfoCopy, {root: true});

                commit(types.MUTATE_ERROR_MSG, res.msg)
                commit(types.MUTATE_ERROR, true)

                router.push('platform')

                commit(types.MUTATE_ERROR_MSG, '')
                commit(types.MUTATE_ERROR, false)
              } else {
                commit(types.MUTATE_ERROR_MSG, res.msg)
                commit(types.MUTATE_ERROR, true)
              }
            },
            error => console.log(error)
          )
        },
        error => console.log(error)
      )
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
