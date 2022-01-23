import login from '../../API/login'
import * as types from '../mutation_types'
import {apiAddr} from '../../config'
import rsa from '../../utils/RSA'
import router from '../../router'
import {resetState} from '@/store'

var RSAUtils = rsa.RSAUtils;

const state = {
    verifyTime: '',
    publicKey: {},
    passport: '',
    password: '',
    verifyCode: '',
    errorMsg: '',
    error: false,
    logout: false
}

const getters = {
    verifyCodeUrl: state => apiAddr + '/verificationCode?' + state.verifyTime,
    loginData: state => {
        if (!state.publicKey.publicKeyExponent) return;

        let key = new RSAUtils.getKeyPair(state.publicKey.publicKeyExponent, "", state.publicKey.publicKeyModulus);
        let password = RSAUtils.encryptedString(key, state.password.trim());

        return {
            "account": state.passport.trim(),
            "password": password,
            // "verificationcode": state.verifyCode
        }
    }
}

const mutations = {
    [types.UPDATE_VERIFYCODEURL](state) {
        state.verifyTime = '' + new Date().getTime();
    },
    [types.GET_PUBLICKEY](state, publicKey) {
        state.publicKey = publicKey;
    },
    [types.UPDATE_PASSPORT](state, value) {
        state.passport = value;
    },
    [types.UPDATE_PASSWORD](state, value) {
        state.password = value;
    },
    [types.UPDATE_VERIFYCODE](state, value) {
        state.verifyCode = value;
    },
    [types.LOGIN_ERROR_MSG](state, {value, error}) {
        state.errorMsg = value;
        state.error = error;
    },
    [types.MUTATE_LOGOUT_STATUS](state, status) {
        state.logout = status;
    }
}

const actions = {
    getPublicKeyToLogin({commit, getters, state, rootState, dispatch}) {
        /*if (state.verifyCode == '') {
          commit(types.LOGIN_ERROR_MSG, {value: '请输入验证码!', error: true});
        }*/

        if (state.password == '') {
            commit(types.LOGIN_ERROR_MSG, {value: '请输入密码!', error: true});
        }

        if (state.passport == '') {
            commit(types.LOGIN_ERROR_MSG, {value: '请输入账号!', error: true});
        }

        if ((state.passport != '') && (state.password != '')) {
            commit(types.LOGIN_ERROR_MSG, {value: '', error: false});
        }

        if (!state.error) {
            login.getPublicKey(
                '1',
                response => {
                    commit(types.GET_PUBLICKEY, response.data.data);
                    login.login(
                        getters.loginData,
                        response => {
                            response = response.data;
                            if (response.code === '0000' || response.code === '0005') {
                                commit(types.UPDATE_ACCOUNTINFO, response.data, {root: true})
                                commit(types.MUTATE_LOGOUT_STATUS, false)
                                commit(types.UPDATE_PASSPORT, '')
                                commit(types.UPDATE_PASSWORD, '')
                                commit(types.UPDATE_VERIFYCODE, '')

                                // 设置账号默认区县
                                dispatch('platform/setCurrentCode', {}, {root: true})

                                // 获取区县详细数据
                                dispatch('platform/getTown', {}, {root: true})
                                dispatch('platform/getPolice', {}, {root: true})
                                // dispatch('platform/getTownShip', {}, {root: true})
                                // dispatch('platform/getVillage', {}, {root: true})
                                dispatch('platform/getUnit', {}, {root: true})

                                var firstLogin = response.data.first;
                                if (firstLogin) {
                                    router.push('/completeInfo')
                                } else {
                                    router.push('/platform')
                                }
                            } else {
                                commit(types.LOGIN_ERROR_MSG, {value: response.msg + '!', error: true});
                                commit(types.UPDATE_VERIFYCODEURL)
                            }
                        },
                        error => {
                            console.log(error)
                        }
                    )
                },
                error => {
                    console.log(error)
                }
            );
        }
    },
    logout({commit}) {
        login.logout(
            response => {
                if (response.data.code === '0000') {
                    commit(types.MUTATE_LOGOUT_STATUS, true)
                    router.push('/login');
                    sessionStorage.clear()
                    location.reload();
                } else {
                    alert('退出错误!')
                }
            },
            error => console.log(error)
        )
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
