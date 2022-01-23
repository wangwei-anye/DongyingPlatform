import Vue from 'vue'
import Vuex from 'vuex'
import * as state from './state'
import * as getters from './getters'
import mutations from './mutations'
import actions from './actions'
import login from './modules/login'
import completeInfo from './modules/completeInfo'
import modifyInfo from './modules/modifyInfo'
import platform from './modules/platform'
import userInfo from './modules/userInfo'
import special from './modules/special'
import house from './modules/house'
import createLogger from '../plugins/logger'
import module from './modules/module'
import permission from './modules/permission'
import searchBar from './modules/searchBar'
import population from './modules/population'
import security from './modules/security'
import alarm from './modules/alarm'
import search from './modules/search'
import record from './modules/record'
import editmode from './modules/editmode'
import {deepCopy} from '../utils/util'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    login,
    completeInfo,
    platform,
    userInfo,
    modifyInfo,
    special,
    permission,
    house,
    searchBar,
    population,
    security,
    alarm,
    search,
    alarm,
    record,
    editmode
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

const initialStateCopy = deepCopy(store.state)

export function resetState() {
  store.replaceState(initialStateCopy)
}

export default store 
