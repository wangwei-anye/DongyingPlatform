import modifyInfo from '../../API/modifyInfo'
import login from '../../API/login'
import * as types from '../mutation_types'
import rsa from '../../utils/RSA'
import {deepCopy} from '../../utils/util'

var RSAUtils = rsa.RSAUtils;

const state = {
  username: '',
  usernameRule: /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,30}$/,
  oldPassword: '',
  password: '',
  passwordRepeat: '',
  passwordRule: /^(?![0-9]+$)(?![a-zA-Z]+$).{8,20}$/,
  nameError: false,
  nameErrorMsg: '用户名长度为2-30位，仅支持中文、字母、数字、下划线！',
  psdError: false,
  psdErrorMsg: '长度为8-22个字符，不能为纯数字、字母或字符，不能包含空格！',
  publicKey: {}
}

const getters = {
  usernameFormData(state, getters, rootState) {
    return {
      id: rootState.global.accountInfo.id,
      username: state.username
    }
  },
  psdFormData(state, getters, rootState) {
    if (!state.publicKey.publicKeyExponent) return;

    let key = new RSAUtils.getKeyPair(state.publicKey.publicKeyExponent, "", state.publicKey.publicKeyModulus);
    let password = RSAUtils.encryptedString(key, state.password.trim());
    let oldPassword = RSAUtils.encryptedString(key, state.oldPassword.trim());

    return {
      id: rootState.global.accountInfo.id,
      oldPassword: oldPassword,
      password: password
    }
  }
}

const mutations = {
  [types.MODIFY_USERNAME] (state, username) {
    state.username = username;
  },
  [types.MODIFY_NAME_ERROR] (state, error) {
    state.nameError = error;
  },
  [types.MODIFY_NAME_ERROR_MSG] (state, msg) {
    state.nameErrorMsg = msg;
  },
  [types.MODIFY_OLD_PASSWORD] (state, password) {
    state.oldPassword = password;
  },
  [types.MODIFY_PASSWORD] (state, password) {
    state.password = password;
  },
  [types.MODIFY_PASSWORD_REPEAT] (state, password) {
    state.passwordRepeat = password;
  },
  [types.MODIFY_PSD_ERROR] (state, error) {
    state.psdError = error;
  },
  [types.MODIFY_PSD_ERROR_MSG] (state, msg) {
    state.psdErrorMsg = msg;
  },
  [types.MODIFY_PUBLIC_KEY] (state, key) {
    state.publicKey = key;
  }
}

const actions = {
  modifyUsername({commit, getters, state, rootState}) {
    let usernameMatched = state.username.search(state.usernameRule) !== -1;

    if (!usernameMatched) {
      commit(types.MODIFY_NAME_ERROR, true);
      commit(types.MODIFY_NAME_ERROR_MSG, '用户名长度为2-30位，仅支持中文、字母、数字、下划线！')
    }

    if (!state.nameError) {
      modifyInfo.modifyUsername(
        getters.usernameFormData,
        response => {
          var res = response.data;
          if (res.code === "0000") {
            commit(types.MODIFY_NAME_ERROR_MSG, '修改成功!');
            commit(types.MODIFY_NAME_ERROR, true);
            setTimeout(() => {
              let accountInfoCopy = deepCopy(rootState.global.accountInfo);
              accountInfoCopy.username = state.username;
              commit('UPDATE_ACCOUNTINFO', accountInfoCopy, {root: true});
              commit('platform/MODIFY_USERNAME_MODAL', false, {root: true});
            }, 1000)
          } else {
            commit(types.MODIFY_NAME_ERROR_MSG, res.msg);
            commit(types.MODIFY_NAME_ERROR, true);
          }
          console.log(response)
        },
        error => console.log(error)
      )
    }
  },
  modifyPassword({commit, getters, state}) {
    let psMatched = state.password.search(state.passwordRule) !== -1,
        psRepeatMatched = state.passwordRepeat.search(state.passwordRule) !== -1,
        repeatMatched = state.password === state.passwordRepeat;

    if (!psMatched || !psRepeatMatched) {
      commit(types.MODIFY_PSD_ERROR, true);
      commit(types.MODIFY_PSD_ERROR_MSG, '长度为8-22个字符，不能为纯数字、字母或字符，不能包含空格！')
    }

    if (!repeatMatched) {
      commit(types.MODIFY_PSD_ERROR, true);
      commit(types.MODIFY_PSD_ERROR_MSG, '密码输入不一致！')
    }

    if (psMatched && psRepeatMatched && repeatMatched) {
      commit(types.MODIFY_PSD_ERROR, false);
      commit(types.MODIFY_PSD_ERROR_MSG, '长度为8-22个字符，不能为纯数字、字母或字符，不能包含空格！')
    }

    if (!state.psdError) {
      login.getPublicKey(
        '3',
        response => {
          commit(types.MODIFY_PUBLIC_KEY, response.data.data);
          modifyInfo.modifyPassword(
            getters.psdFormData,
            response => {
              var res = response.data;
              if (res.code === '0000') {
                commit(types.MODIFY_PSD_ERROR, false);
                commit(types.MODIFY_PSD_ERROR_MSG, '修改成功!');
                setTimeout(() => {
                  commit('platform/MODIFY_PASSWORD_MODAL', false, {root: true});
                }, 1500)
              } else {
                commit(types.MODIFY_PSD_ERROR, true);
                commit(types.MODIFY_PSD_ERROR_MSG, res.msg);
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
