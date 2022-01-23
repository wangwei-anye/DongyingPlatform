import * as types from './mutation_types'

const mutations = {
  [types.UPDATE_ACCOUNTINFO] (state, value) {
    state.global.accountInfo = value;
  }
}

export default mutations
