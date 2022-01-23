import { apiAddr } from '../../config'
import http from '@/utils/http'

const state = {
  roleTypes: []
}

const getters = {
  roleTypesList (state) {
    return state.roleTypes.map(item => {
      return {
        value: item.id,
        label: item.type_name
      }
    })
  }
}

const mutations = {
  setRoleTypes (state, data) {
    state.roleTypes = data;
  }
}

const actions = {
  setRoleTypes ({ commit }) {
    http.post('/account/rolePermissionManager/selectRoleTypes.do').then(res => {
      if (res.data.success) {
        commit('setRoleTypes', res.data.data);
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}