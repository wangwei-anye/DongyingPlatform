import * as types from './mutation_types'
import login from '../API/login'

const actions = {
  getAccountInfo({ commit }) {
    return new Promise((resolve, reject) => {
      login.getAccountInfo(
        response => {
          commit(types.UPDATE_ACCOUNTINFO, JSON.parse(response.data.data));
          resolve()
        },
        error => {
          console.log(error)
        }
      )
    })
  }
}

export default actions
