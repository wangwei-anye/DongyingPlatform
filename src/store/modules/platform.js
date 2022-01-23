import api from '../../API/platform'
import * as types from '../mutation_types'
import router from '@/router'
import {deepCopy, getObjectFromSessionStorage, setObjectToSessionStorage} from '../../utils/util'
import store from '../../store'
import axios from '@/utils/http.js'
import {province_code, city_code, city_name} from '../../config.js'

const state = {
    defaultArea: 'province_code=' + province_code + '&city_code=' + city_code,
    province_code,
    city_code,
    city_name: city_name + "市",
    townList: [],
    currentTownCode: sessionStorage.getItem('currentTownCode') || 'all',
    townShipList: getObjectFromSessionStorage('townShipList') || [],
    currentTownShipCode: sessionStorage.getItem('currentTownShipCode') || 'all',
    villageList: getObjectFromSessionStorage('villageList') || [],
    currentVillageCode: sessionStorage.getItem('currentVillageCode') || 'all',
    policeList: getObjectFromSessionStorage('policeList') || [],
    currentPoliceCode: sessionStorage.getItem('currentPoliceCode') || 'all',
    unitList: getObjectFromSessionStorage('unitList') || [],
    currentUnitId: sessionStorage.getItem('currentUnitId') || 'all',
    generalName: '智慧社区管控平台',
    passwordModal: false,
    usernameModal: false,
    logoutModal: false,
    kickOutModal: false,
    carFlowList: [],
    peopleFlowlist: [],
    carWeekFlowList: [],
    peopleWeekFlowlist: [],
    carMonthFlowList: [],
    peopleMonthFlowlist: [],
    vistorlist: [],
    vistorWeeklist: [],
    tabIndex: -1,
    vistor_tabIndex: -1,
    techDefence: {},
    civilDefense: [],
    iestate: {},
    sliderListShow: false,
    iestate: {
        list: [],
        total: 0
    },
    ipersonData: {
        list: [],
        total: 0
    },
    ihouseData: {
        list: [],
        occRate: '0%',
        total: 0
    },
    iGoodData: [],
    specialPerson: {},
    safetyExponent: [],
    carDateCount: [],
    unitCarData: {
        park_total_count: 0,
        park_owner_count: 0,
        park_temporary_count: 0,
        park_using_count: 0,
        park_free_count: 0,
        park_status: 2,
        msg: "宽裕"
    },
    personDateCount: 0,
    showSearch: sessionStorage.getItem('showSearch') || false, //全局搜索状态
    keyWord: sessionStorage.getItem('keyWord') || '', //全局搜索关键词
}

const getters = {
    queryParam: state => {
        let query = state.defaultArea,
            currentTownCode = state.currentTownCode,
            currentPoliceCode = state.currentPoliceCode,
            // currentTownShipCode = state.currentTownShipCode,
            // currentVillageCode = state.currentVillageCode,
            currentUnitId = state.currentUnitId;

        if (currentTownCode !== 'all') {
            query += '&town_code=' + currentTownCode
        }

        if (currentPoliceCode !== 'all') {
            query += '&police_code=' + currentPoliceCode
        }

        /*if(currentTownShipCode !== 'all') {
          query += '&township_code=' + currentTownShipCode
        }

        if(currentVillageCode !== 'all') {
          query += '&village_code=' + currentVillageCode
        }*/

        if (currentUnitId !== 'all') {
            query += '&unit_id=' + currentUnitId
        }
        return query;
    },
    iGoodFilterData: state => {
        try {
            let cache = state.iGoodData.slice(0, 5);
            let total = cache.reduce((sum, item) => {
                return sum + item.number;
            }, 0)
            cache.map(item => item.percent = item.number / total * 100 + '%');
            return cache;
        } catch (e) {
            console.log("Catch Error: ", e);
            return [];
        }
    },
    specialPersonFilter: state => {
        let cache = deepCopy(state.specialPerson),
            target = {
                'caring': {},
                'caringTotal': 0,
                'keyPerson': {},
                'keyPersonTotal': 0
            };
        for (let attr in cache) {
            if (cache[attr] === null) {
                cache[attr] = 0;
            }
            switch (attr) {
                case 'cjry':
                    target.caring['残疾人员'] = cache['cjry'];
                    target.caringTotal += cache['cjry'];
                    break;
                case 'lxgb':
                    target.caring['离休干部'] = cache['lxgb'];
                    target.caringTotal += cache['lxgb'];
                    break;
                case 'dbry':
                    target.caring['低保人员'] = cache['dbry'];
                    target.caringTotal += cache['dbry'];
                    break;
                case 'zdjbry':
                    target.caring['重病人员'] = cache['zdjbry'];
                    target.caringTotal += cache['zdjbry'];
                    break;
                case 'gglr':
                    target.caring['孤寡老人'] = cache['gglr'];
                    target.caringTotal += cache['gglr'];
                    break;
                case 'lsry':
                    target.caring['留守人员'] = cache['lsry'];
                    target.caringTotal += cache['lsry'];
                    break;
                case 'yfdx':
                    target.caring['优抚对象'] = cache['yfdx'];
                    target.caringTotal += cache['yfdx'];
                    break;
                case 'xdry':
                    target.keyPerson['涉毒人员'] = cache['xdry'];
                    target.keyPersonTotal += cache['xdry'];
                    break;
                case 'sqjzry':
                    target.keyPerson['社区矫正'] = cache['sqjzry'];
                    target.keyPersonTotal += cache['sqjzry'];
                    break;
                case 'fxjsdry':
                    target.keyPerson['服刑涉毒'] = cache['fxjsdry'];
                    target.keyPersonTotal += cache['fxjsdry'];
                    break;
                case 'xmjdry':
                    target.keyPerson['刑释解戒'] = cache['xmjdry'];
                    target.keyPersonTotal += cache['xmjdry'];
                    break;
                case 'zdqsn':
                    target.keyPerson['重点青少年'] = cache['zdqsn'];
                    target.keyPersonTotal += cache['zdqsn'];
                    break;
                case 'zdxfry':
                    target.keyPerson['重点信访'] = cache['zdxfry'];
                    target.keyPersonTotal += cache['zdxfry'];
                    break;
                case 'ydzszfjsbry':
                    target.keyPerson['精神病人'] = cache['ydzszfjsbry'];
                    target.keyPersonTotal += cache['ydzszfjsbry'];
                    break;
                case 'sxry':
                    target.keyPerson['涉邪人员'] = cache['sxry'];
                    target.keyPersonTotal += cache['sxry'];
                    break;
            }
        }
        return target;
    },
    safetyExponentFilter: state => {
        if (state.safetyExponent.length !== 0) {
            let firstExponent = Number(state.safetyExponent[0].compositeIndex) + 0.0000000000000001;
            return state.safetyExponent.map(function (item, index) {
                item.percent = Number(item.compositeIndex) * 0.9 / firstExponent * 100 + '%';
                return item;
            })
        }
    },
    allTown: (state, getters, rootState) => {
        let rolePermission = rootState.global.accountInfo.rolePermission;
        if (rolePermission && rolePermission.town_code && rolePermission.town_code !== '') {
            // 由权限定义了默认区县, 此时 state.townList 请求结果也为空, 填充默认区县
            return state.townList;
        }
        return [{
            town_code: 'all',
            town_name: '区县'
        }].concat(state.townList);
    },
    allTownShip: (state, getters, rootState) => {
        let rolePermission = rootState.global.accountInfo.rolePermission;
        if (rolePermission && rolePermission.township_code && rolePermission.township_code !== '') {
            return state.townShipList;
        }
        return [{
            township_code: 'all',
            township_name: '乡镇/街道办'
        }].concat(state.townShipList);
    },
    allVillage: (state, getters, rootState) => {
        let rolePermission = rootState.global.accountInfo.rolePermission;
        if (rolePermission && rolePermission.village_code && rolePermission.village_code !== '') {
            return state.villageList
        }
        return [{
            village_code: 'all',
            village_name: '村/社区'
        }].concat(state.villageList);
    },
    allPolice: (state, getters, rootState) => {
        let rolePermission = rootState.global.accountInfo.rolePermission;
        if (rolePermission && rolePermission.pid && rolePermission.pid !== '') {
            return state.policeList;
        }
        return [{
            police_code: 'all',
            police_name: '派出所'
        }].concat(state.policeList);
    },
    allUnit: (state, getters, rootState) => {
        // 权限的最低层级是小区, 此处可以正常的获取小区列表
        // 因此, 不需要通过权限信息设置默认小区列表
        // 只需在 setCurrentCode 中设置默认选中的 unit_id
        // 另外, 在小区级别权限下, 不需要 '小区' 选项,
        // 以免不必要的跳转到 platform (将会被路由过滤掉)
        let rolePermission = rootState.global.accountInfo.rolePermission;
        if (rolePermission && rolePermission.roleType.level !== 6) {
            return [{
                unit_id: 'all',
                unit_name: '小区'
            }].concat(state.unitList);
        }
        return state.unitList;
    },
    currentName: (state, getters) => {
        if (state.currentTownCode === 'all') {
          return city_name + '市公安局智慧社区管控平台';
        } else {
          return '东营经济技术开发区公安分局智慧社区管控平台';
        }
        /*
        if (state.currentPoliceCode === 'all') {
          let name = city_name + '市';
          if (getters.allTown) {
              for (let i = 0, len = getters.allTown.length; i < len; i++) {
                  if (getters.allTown[i]['town_code'] == state.currentTownCode) {
                      name += getters.allTown[i]['town_name'];
                      break;
                  }
              }
          }
          return name + state.generalName;
        }
        
        if (state.currentUnitId === 'all') {
          let name = city_name + '市';
          if (getters.allTown) {
              for (let i = 0, len = getters.allTown.length; i < len; i++) {
                  if (getters.allTown[i]['town_code'] == state.currentTownCode) {
                      name += getters.allTown[i]['town_name'];
                      break;
                  }
              }
          }
          if (getters.allPolice) {
              for (let i = 0, len = getters.allPolice.length; i < len; i++) {
                  if (getters.allPolice[i]['police_code'] == state.currentPoliceCode) {
                      name += getters.allPolice[i]['police_name'];
                      break;
                  }
              }
          }
          return name + state.generalName;
        }else{
          let name = city_name + '市';
          if (getters.allTown) {
              for (let i = 0, len = getters.allTown.length; i < len; i++) {
                  if (getters.allTown[i]['town_code'] == state.currentTownCode) {
                      name += getters.allTown[i]['town_name'];
                      break;
                  }
              }
          }
          if (getters.allPolice) {
              for (let i = 0, len = getters.allPolice.length; i < len; i++) {
                  if (getters.allPolice[i]['police_code'] == state.currentPoliceCode) {
                      name += getters.allPolice[i]['police_name'];
                      break;
                  }
              }
          }
          return name + '智慧小区管控平台';
        }
        */
    },

    carFlowListGetter: state => {
        return state.carFlowList;
    },
    peopleFlowListGetter: state => {
        return state.peopleFlowList;
    },
    carWeekFlowListGetter: state => {
        return state.carWeekFlowList;
    },
    peopleWeekFlowListGetter: state => {
        return state.peopleWeekFlowlist;
    },
    carMonthFlowListGetter: state => {
        return state.carMonthFlowList;
    },
    peopleMonthFlowListGetter: state => {
        return state.peopleMonthFlowlist;
    },
    vistorListGetter: state => {
        return state.vistorList;
    },
    vistorWeekListGetter: state => {
        return state.vistorWeekList;
    },
    tabIndexGetter: state => {
        return state.tabIndex;
    },
    vistorTabIndexGetter: state => {
        return state.vistor_tabIndex;
    },
    carDateCountFilter: state => {
        let carDateCount = {
            'inNum': 0,
            'exitNum': 0
        };

        for (let i = 0, len = state.carDateCount.length; i < len; i++) {
            for (let attr in state.carDateCount[i]) {
                let flowType = attr.split(':')[1] === '0' ? 'inNum' : 'exitNum';
                carDateCount[flowType] += state.carDateCount[i][attr];
            }
        }

        return carDateCount;
    }
}

const mutations = {
    [types.UPDATE_UNIT_CAR_DATA](state, data) {
        state.unitCarData = data;
    },
    [types.GET_UNIT_DATA](state, data) {
        state.iestate = data;
    },
    [types.SLIDER_LIST_SHOW](state, data) {
        state.sliderListShow = data;
    },
    [types.GET_POPULATION_DATA](state, data) {
        state.ipersonData = data;
    },
    [types.GET_STATEROOMS_DATA](state, data) {
        state.ihouseData = data;
    },
    [types.GET_CIVIL_DEFENSE](state, data) {
        state.civilDefense = data;
    },
    [types.UPDATE_VISTOR](state, vistorList) {
        state.vistorList = vistorList;
    },
    [types.UPDATE_VISTOR_WEEK](state, vistorWeekList) {
        state.vistorWeekList = vistorWeekList;
    },
    [types.UPDATE_VISTOR_TAB_INDEX](state, vistor_tabIndex) {
        state.vistor_tabIndex = vistor_tabIndex;
    },
    [types.UPDATE_TAB_INDEX](state, tabIndex) {
        state.tabIndex = tabIndex;
    },
    [types.UPDATE_TECH_DEFENCE](state, techDefence) {
        state.techDefence = techDefence;
    },
    [types.UPDATE_PEOPLE_MONTH_FLOW](state, peopleMonthFlowlist) {
        state.peopleMonthFlowlist = peopleMonthFlowlist;
    },
    [types.UPDATE_CAR_MONTH_FLOW](state, carMonthFlowList) {
        state.carMonthFlowList = carMonthFlowList;
    },
    [types.UPDATE_PEOPLE_WEEK_FLOW](state, peopleWeekFlowlist) {
        state.peopleWeekFlowlist = peopleWeekFlowlist;
    },
    [types.UPDATE_CAR_WEEK_FLOW](state, carFlowList) {
        state.carWeekFlowList = carFlowList;
    },
    [types.UPDATE_PEOPLE_FLOW](state, peopleFlowList) {
        state.peopleFlowList = peopleFlowList;
    },
    [types.UPDATE_CAR_FLOW](state, carFlowList) {
        state.carFlowList = carFlowList;
    },
    [types.UPDATE_TOWNLIST](state, townList) {
        setObjectToSessionStorage('townList', townList);
        state.townList = townList;
    },
    [types.SET_CURRENT_TOWN](state, townCode) {
        sessionStorage.setItem('currentTownCode', townCode);
        state.currentTownCode = townCode;
    },
    [types.UPDATE_TOWNSHIPLIST](state, townShipList) {
        setObjectToSessionStorage('townShipList', townShipList);
        state.townShipList = townShipList;
    },
    [types.SET_CURRENT_TOWNSHIP](state, townShipCode) {
        sessionStorage.setItem('currentTownShipCode', townShipCode);
        state.currentTownShipCode = townShipCode;
    },
    [types.UPDATE_VILLAGELIST](state, villageList) {
        setObjectToSessionStorage('villageList', villageList);
        state.villageList = villageList;
    },
    [types.SET_CURRENT_VILLAGE](state, villageCode) {
        sessionStorage.setItem('currentVillageCode', villageCode);
        state.currentVillageCode = villageCode;
    },
    [types.UPDATE_POLICELIST](state, policeList) {
        setObjectToSessionStorage('policeList', policeList);
        state.policeList = policeList;
    },
    [types.SET_CURRENT_POLICE](state, policeCode) {
        sessionStorage.setItem('currentPoliceCode', policeCode);
        state.currentPoliceCode = policeCode;
    },
    [types.UPDATE_UNITLIST](state, unitList) {
        setObjectToSessionStorage('unitList', unitList);
        state.unitList = unitList;
    },
    [types.SET_CURRENT_UNIT](state, unitId) {
        sessionStorage.setItem('currentUnitId', unitId);
        state.currentUnitId = unitId;
    },
    [types.MODIFY_PASSWORD_MODAL](state, value) {
        if (!value) {
            store.commit('modifyInfo/MODIFY_PASSWORD', '');
            store.commit('modifyInfo/MODIFY_OLD_PASSWORD', '');
            store.commit('modifyInfo/MODIFY_PASSWORD_REPEAT', '');
            store.commit('modifyInfo/MODIFY_PSD_ERROR', false);
            store.commit('modifyInfo/MODIFY_PSD_ERROR_MSG', '长度为8-22个字符，不能为纯数字、字母或字符，不能包含空格！');
        }
        state.passwordModal = value;
    },
    [types.MODIFY_USERNAME_MODAL](state, value) {
        if (!value) {
            store.commit('modifyInfo/MODIFY_USERNAME', '');
            store.commit('modifyInfo/MODIFY_NAME_ERROR_MSG', '用户名长度为2-30位，仅支持中文、字母、数字、下划线！');
            store.commit('modifyInfo/MODIFY_NAME_ERROR', false);
        }
        state.usernameModal = value;
    },
    [types.MODIFY_LOGOUT_MODAL](state, value) {
        state.logoutModal = value;
    },
    [types.MODIFY_KICKOUT_MODAL](state, value) {
        state.kickOutModal = value;
    },
    [types.UPDATE_IGOOD](state, data) {
        state.iGoodData = data;
    },
    [types.GET_SPECIAL_PERSON](state, data) {
        state.specialPerson = data;
    },
    [types.GET_SAFETY_COMPONENT](state, data) {
        state.safetyExponent = data;
    },
    [types.GET_CAR_DATE_COUNT](state, data) {
        state.carDateCount = data;
    },
    [types.PERSON_DATE_COUNT](state, data) {
        state.personDateCount = data;
    },
    [types.UPDATE_SHOW_SEARCH](state, data) {
        sessionStorage.setItem('showSearch', data);
        state.showSearch = data;
    },
    [types.UPDATE_KEY_WORD](state, data) {
        sessionStorage.setItem('keyWord', data);
        state.keyWord = data;
    }
}

const actions = {
    setCurrentCode({commit, rootState}) {
        let rolePermission = rootState.global.accountInfo.rolePermission,
            account_code = rootState.global.accountInfo.account_code;

        if (rolePermission.town_code && rolePermission.town_code !== '') {
            commit(types.SET_CURRENT_TOWN, rolePermission.town_code);
        }
        if (rolePermission.township_code && rolePermission.township_code !== '') {
            commit(types.SET_CURRENT_TOWNSHIP, rolePermission.township_code);
        }
        if (rolePermission.village_code && rolePermission.village_code !== '') {
            commit(types.SET_CURRENT_VILLAGE, rolePermission.village_code);
        }
        if (rolePermission.pid && rolePermission.pid !== '') {
            commit(types.SET_CURRENT_POLICE, String(rolePermission.pid));
        }
        if (rolePermission.roleType.level === 6 && account_code !== '') {
            // 账号权限为小区级别时, account_code 中存储了该账号下小区列表
            var zoneList = account_code.split(',');
            commit(types.SET_CURRENT_UNIT, zoneList[0]); // 默认选中第一个小区
        }
    },
    resetData({commit, state, dispatch}) {
        //重新请求 安防巡更数据
        dispatch('security/init', {
            router: 'platform'
        }, {
            root: true
        });
        //重新请求 告警中心
        dispatch('alarm/queryList', {}, {
            root: true
        });
        //重新请求 告警中心
        dispatch('alarm/countEventsToday', {}, {
            root: true
        });
    },
    changeTown({commit, state, dispatch}, value) {
        commit('SET_CURRENT_TOWN', value);
        /*commit('SET_CURRENT_TOWNSHIP', 'all');
        commit('UPDATE_TOWNSHIPLIST', []);
        commit('SET_CURRENT_VILLAGE', 'all');
        commit('UPDATE_VILLAGELIST', []);*/
        commit('SET_CURRENT_POLICE', 'all');
        commit('UPDATE_POLICELIST', []);
        commit('SET_CURRENT_UNIT', 'all');
        commit('UPDATE_UNITLIST', []);
        // dispatch('getUnit');
        if (value !== 'all') {
            dispatch('getPolice');
        }
    },
    changeTownShip({commit, state, dispatch}, value) {
        commit('SET_CURRENT_TOWNSHIP', value);
        commit('SET_CURRENT_VILLAGE', 'all');
        commit('UPDATE_VILLAGELIST', []);
        commit('SET_CURRENT_UNIT', 'all');
        commit('UPDATE_UNITLIST', []);
        // dispatch('getUnit');
        if (value !== 'all') {
            dispatch('getVillage');
        }
    },
    changeVillage({commit, state, dispatch}, value) {
        commit('SET_CURRENT_VILLAGE', value);
        commit('SET_CURRENT_UNIT', 'all');
        commit('UPDATE_UNITLIST', []);
        // dispatch('getUnit');
        if (value !== 'all') {
            dispatch('getUnit');
        }
    },
    changePolice({commit, state, dispatch}, value) {
        // commit('SET_CURRENT_POLICE', value);
        commit('SET_CURRENT_POLICE', value);
        commit('SET_CURRENT_UNIT', 'all');
        commit('UPDATE_UNITLIST', []);
        // dispatch('getUnit');
        if (value !== 'all') {
            dispatch('getUnit');
        }
    },
    changeUnit({commit, state, rootState, dispatch}, value) {
        commit('SET_CURRENT_UNIT', value);
        if (state.currentUnitId !== "all") {
            router.push("zone");
        } else {
            router.push("platform");
        }
    },
    getTown({commit, state, rootState}) {
        api.getTown(
            state.defaultArea,
            response => {
                let townList = response.data.data;
                let rolePermission = rootState.global.accountInfo.rolePermission;
                if (rolePermission && rolePermission.town_code && rolePermission.town_code !== '') {
                    // 由权限定义了默认区县, 填充默认区县
                    townList = [{
                        town_code: rolePermission.town_code,
                        town_name: rolePermission.town_name
                    }];
                }
                commit(types.UPDATE_TOWNLIST, townList)
            },
            error => {
                console.log(error)
            }
        )
    },
    getTownShip({commit, state, rootState, dispatch}) {
        let query = state.defaultArea + '&town_code=' + state.currentTownCode;
        api.getTownShip(
            query,
            response => {
                let townShipList = response.data.data;
                commit(types.UPDATE_TOWNSHIPLIST, townShipList);
            },
            error => console.log(error)
        );
        //直接根据区县 乡镇 居委会获取小区列表
        api.getUnitByCode({
                flag: 'town',
                code: state.currentTownCode
            },
            response => {
                let res = response.data.data;
                if (response.data.code !== '0000') {
                    return;
                }
                if (res.length === 0) {
                    return;
                }
                let unitLists = [];
                for (let unit of res) {
                    unitLists.push({
                        unit_id: unit.unit_id,
                        unit_name: unit.name
                    });
                }
                //过滤后台传过来的空值
                unitLists = unitLists.filter(function (item) {
                    return item.unit_id ? true : false;
                });
                //如果登录的是小区管理员账号
                let rolePermission = rootState.global.accountInfo.rolePermission;
                if (rolePermission.role_type_id && rolePermission.role_type_id === 13 && rootState.global.accountInfo.account_code) {
                    //一个账号可能管理多个小区
                    let manageUnits = rootState.global.accountInfo.account_code.split(",");
                    unitLists = unitLists.filter(function (item) {
                        return manageUnits.indexOf(item.unit_id) !== -1;
                    });
                }
                commit(types.UPDATE_UNITLIST, unitLists);
                // commit('SET_CURRENT_UNIT', 'all');//此处放开会导致切换小区失败
                // 修复搜索小区跳转到首页之后，会出现切换小区异常的情况
                let pHash = window.location.hash;
                if (rootState.search.searchUnitId && rootState.search.searchUnitId !== "all" && pHash === "#/zonesearch") {
                    commit('SET_CURRENT_UNIT', rootState.search.searchUnitId);
                }
            },
            error => {
                console.log(error)
            }
        );
    },
    getVillage({commit, state, rootState, dispatch}) {
        let query = state.defaultArea + '&town_code=' + state.currentTownCode + '&township_code=' + state.currentTownShipCode;
        api.getVillage(
            query,
            response => {
                let villageList = response.data.data;
                commit(types.UPDATE_VILLAGELIST, villageList);
            },
            error => console.log(error)
        );
        //直接根据区县 乡镇 居委会获取小区列表
        api.getUnitByCode({
                flag: 'township',
                code: state.currentTownShipCode
            },
            response => {
                let res = response.data.data;
                if (response.data.code !== '0000') {
                    return;
                }
                if (res.length === 0) {
                    return;
                }
                let unitLists = [];
                for (let unit of res) {
                    unitLists.push({
                        unit_id: unit.unit_id,
                        unit_name: unit.name
                    });
                }
                //过滤后台传过来的空值
                unitLists = unitLists.filter(function (item) {
                    return item.unit_id ? true : false;
                });
                //如果登录的是小区管理员账号
                let rolePermission = rootState.global.accountInfo.rolePermission;
                if (rolePermission.role_type_id && rolePermission.role_type_id === 13 && rootState.global.accountInfo.account_code) {
                    //一个账号可能管理多个小区
                    let manageUnits = rootState.global.accountInfo.account_code.split(",");
                    unitLists = unitLists.filter(function (item) {
                        return manageUnits.indexOf(item.unit_id) !== -1;
                    });
                }
                commit(types.UPDATE_UNITLIST, unitLists);
                // commit('SET_CURRENT_UNIT', 'all');//此处放开会导致切换小区失败
                // 修复搜索小区跳转到首页之后，会出现切换小区异常的情况
                let pHash = window.location.hash;
                if (rootState.search.searchUnitId && rootState.search.searchUnitId !== "all" && pHash === "#/zonesearch") {
                    commit('SET_CURRENT_UNIT', rootState.search.searchUnitId);
                }
            },
            error => {
                console.log(error)
            }
        );
    },
    getPolice({commit, state, rootState, dispatch}) {
        let query = state.defaultArea + '&town_code=' + state.currentTownCode;
        api.getPolice(
            query,
            response => {
                let res = response.data.data;
                if (response.data.code !== '0000') {
                    return;
                }
                if (res.length === 0) {
                    return;
                }
                let policeList = [];
                for (let i = 0; i < res.length; i++) {
                    policeList.push({
                        police_code: res[i].id,
                        police_name: res[i].police_station
                    });
                }
                let rolePermission = rootState.global.accountInfo.rolePermission;
                if (rolePermission && rolePermission.pid && rolePermission.pid !== '') {
                    // 由权限定义了默认区县, 填充默认区县
                    let ppName = "";
                    //当登陆账号为派出所账号时，accountInfo里只有pid，没有pName 补救措施
                    if (rolePermission.rolename && rolePermission.rolename.indexOf("派出所") !== -1) {
                        ppName = rolePermission.rolename.substr(0, rolePermission.rolename.length - 5).substr(9);
                    }
                    policeList = [{
                        police_code: String(rolePermission.pid),
                        police_name: rolePermission.pName || ppName
                    }];
                }
                commit(types.UPDATE_POLICELIST, policeList);
            },
            error => console.log(error)
        );
        //直接根据区县 乡镇 居委会获取小区列表
        api.getUnitByCode({
                flag: 'town',
                code: state.currentTownCode
            },
            response => {
                let res = response.data.data;
                if (response.data.code !== '0000') {
                    return;
                }
                if (res.length === 0) {
                    return;
                }
                let unitLists = [];
                for (let unit of res) {
                    unitLists.push({
                        unit_id: unit.unit_id,
                        unit_name: unit.name
                    });
                }
                //过滤后台传过来的空值
                unitLists = unitLists.filter(function (item) {
                    return item.unit_id ? true : false;
                });
                //如果登录的是小区管理员账号
                let rolePermission = rootState.global.accountInfo.rolePermission;
                if (rolePermission.role_type_id && rolePermission.role_type_id === 13 && rootState.global.accountInfo.account_code) {
                    //一个账号可能管理多个小区
                    let manageUnits = rootState.global.accountInfo.account_code.split(",");
                    unitLists = unitLists.filter(function (item) {
                        return manageUnits.indexOf(item.unit_id) !== -1;
                    });
                }
                commit(types.UPDATE_UNITLIST, unitLists);
                // commit('SET_CURRENT_UNIT', 'all');//此处放开会导致切换小区失败
                // 修复搜索小区跳转到首页之后，会出现切换小区异常的情况
                let pHash = window.location.hash;
                if (rootState.search.searchUnitId && rootState.search.searchUnitId !== "all" && pHash === "#/zonesearch") {
                    commit('SET_CURRENT_UNIT', rootState.search.searchUnitId);
                }
            },
            error => {
                console.log(error)
            }
        );
    },
    getUnit({commit, state, getters, dispatch}) {

        let query = state.defaultArea;
        if (state.currentTownCode === 'all') {
            query += '&town_code=';
        } else {
            query += '&town_code=' + state.currentTownCode;
        }
        if (state.currentPoliceCode === 'all') {
            query += '&police_code=';
        } else {
            query += '&police_code=' + state.currentPoliceCode;
        }
        api.getUnitByPolice(
            // getters.queryParam,
            query,
            response => {
                let res = response.data.data;
                if (response.data.code !== '0000') {
                    return;
                }
                if (res.length === 0) {
                    return;
                }
                let unitList = [];
                for (let i = 0; i < res.length; i++) {
                    unitList.push({
                        unit_id: res[i].unit_id,
                        unit_name: res[i].name
                    });
                }
                commit(types.UPDATE_UNITLIST, unitList);
            },
            error => console.log(error)
        )

    },
    getCarFlow({state, commit}, type) {
        api.getCarFlow({
                province_code: '',
                city_code: state.city_code,
                town_code: state.currentTownCode == 'all' ? '' : state.currentTownCode,
                township_code: state.currentTownShipCode == 'all' ? '' : state.currentTownShipCode,
                village_code: state.currentVillageCode == 'all' ? '' : state.currentVillageCode,
                police_code: state.currentPoliceCode == 'all' ? '' : state.currentPoliceCode,
                unit_id: state.currentUnitId == 'all' ? '' : state.currentUnitId,
                groupType: type
            },
            response => {
                response = response.data;
                if (type == 1) {
                    commit(types.UPDATE_CAR_FLOW, response);
                } else if (type == 2) {
                    commit(types.UPDATE_CAR_WEEK_FLOW, response);
                } else if (type == 3) {
                    commit(types.UPDATE_CAR_MONTH_FLOW, response);
                }
            },
            error => {
                console.log(error)
            }
        );
    },
    getPeopleFlow({state, commit}, type) {
        api.getPeopleFlow({
                province_code: '',
                city_code: state.city_code,
                town_code: state.currentTownCode == 'all' ? '' : state.currentTownCode,
                township_code: state.currentTownShipCode == 'all' ? '' : state.currentTownShipCode,
                village_code: state.currentVillageCode == 'all' ? '' : state.currentVillageCode,
                police_code: state.currentPoliceCode == 'all' ? '' : state.currentPoliceCode,
                unit_id: state.currentUnitId == 'all' ? '' : state.currentUnitId,
                groupType: type
            },
            response => {
                response = response.data;
                if (type == 1) {
                    commit(types.UPDATE_PEOPLE_FLOW, response);
                    commit(types.UPDATE_TAB_INDEX, 0);
                } else if (type == 2) {
                    commit(types.UPDATE_PEOPLE_WEEK_FLOW, response);
                } else if (type == 3) {
                    commit(types.UPDATE_PEOPLE_MONTH_FLOW, response);
                }
            },
            error => {
                console.log(error)
            }
        );
    },
    getVistor({state, commit}, type) {
        api.getVistor({
                province_code: '',
                city_code: state.city_code,
                town_code: state.currentTownCode == 'all' ? '' : state.currentTownCode,
                police_code: state.currentPoliceCode == 'all' ? '' : state.currentPoliceCode,
                unit_id: state.currentUnitId == 'all' ? '' : state.currentUnitId,
                groupType: type
            },
            response => {
                response = response.data;
                if (type == 1) {
                    commit(types.UPDATE_VISTOR, response);
                    commit(types.UPDATE_VISTOR_TAB_INDEX, 0);
                } else if (type == 2) {
                    commit(types.UPDATE_VISTOR_WEEK, response);
                }
            },
            error => {
                console.log(error)
            }
        );
    },
    getUnitCarData({state, commit}, type) {
        if (state.currentUnitId == "all" || state.currentUnitId == "") {
            return;
        }
        api.getUnitCarData({
                unit_id: state.currentUnitId
            },
            response => {
                response = response.data;
                if (response.code === '0000' && response.data != null) {
                    if (response.data.park_status == 1) {
                        response.data.msg = "紧张";
                    } else {
                        response.data.msg = "宽裕";
                    }
                    commit(types.UPDATE_UNIT_CAR_DATA, response.data);
                } else {
                }
            },
            error => {
                console.log(error)
            }
        );
    },
    getTechDefence({state, commit}) {
        api.getTechDefence({
                province_code: '',
                city_code: state.city_code,
                town_code: state.currentTownCode == 'all' ? '' : state.currentTownCode,
                township_code: state.currentTownShipCode == 'all' ? '' : state.currentTownShipCode,
                village_code: state.currentVillageCode == 'all' ? '' : state.currentVillageCode,
                police_code: state.currentPoliceCode == 'all' ? '' : state.currentPoliceCode,
                unit_id: state.currentUnitId == 'all' ? '' : state.currentUnitId,
            },
            response => {
                response = response.data;
                if (response.code === '0000') {
                    commit(types.UPDATE_TECH_DEFENCE, response.data);
                } else {

                }
            },
            error => {
                console.log(error)
            }
        );
    },
    getCivilDefense({state, getters, commit}) {
        api.getCivilDefense(
            getters.queryParam,
            response => {
                let civilDefense = [{
                        'name': '专职保安队伍',
                        'value': 0
                    },
                        {
                            'name': '义务治安巡逻队伍',
                            'value': 0
                        },
                        {
                            'name': '社区民警',
                            'value': 0
                        }
                    ],
                    data = response.data.data;

                try {
                    civilDefense[0]['value'] = data['fullTimeSecurityTeam'];
                    civilDefense[1]['value'] = data['compulsorySecurityPatrol'];
                    civilDefense[2]['value'] = data['communityPolice'];
                } catch (e) {
                    console.log("Catch Error: ", e);
                }

                commit(types.GET_CIVIL_DEFENSE, civilDefense)
            },
            error => {
                console.log(error)
            }
        )
    },
    getUnitData({getters, commit}) {
        api.getUnitData(
            getters.queryParam,
            response => {
                if (response.data.success === true) {
                    const fbs = response.data.data.fbs;
                    const kfs = response.data.data.kfs;
                    const hhs = response.data.data.fhs;
                    const data = {
                        list: [{
                            value: fbs,
                            name: '封闭式',
                            color: '#00ffea'
                        },
                            {
                                value: kfs,
                                name: '开放式',
                                color: '#2951ff'
                            },
                            {
                                value: hhs,
                                name: '混合式',
                                color: '#ffda2e'
                            }
                        ],
                        total: response.data.data.zs
                    };
                    commit(types.GET_UNIT_DATA, data)
                }
            },
            error => {
                console.log(error)
            }
        )
    },
    getPopulationStatistics({getters, commit}) {
        api.getPopulationStatistics(
            getters.queryParam,
            response => {
                if (response.data.success === true) {
                    const data = {
                        list: [{
                            value: response.data.data.populationStatistics.flow,
                            name: '流动人口',
                            color: '#ffda2e'
                        },
                            {
                                value: response.data.data.populationStatistics.residence,
                                name: '常住人口',
                                color: '#2951ff'
                            }
                        ],
                        total: response.data.data.populationCount
                    }
                    commit(types.GET_POPULATION_DATA, data)
                }
            },
            error => {
                console.log(error)
            }
        )
    },
    getStateRooms({getters, commit}) {
        api.getStateRooms(
            getters.queryParam,
            response => {
                if (response.data.success === true) {
                    const syNumber = response.data.data.sy || 0;
                    const kzNumber = response.data.data.kz || 0;
                    const zzNumber = response.data.data.zz || 0;
                    const qtNumber = response.data.data.qt || 0;
                    const czNumber = response.data.data.zf || 0;
                    const zsNumber = response.data.data.zs || 0;
                    let occRate = 0;
                    if (zsNumber != 0) {
                        occRate = ((zsNumber - kzNumber) / zsNumber * 100).toFixed(2);
                    }
                    const data = {
                        list: [{
                            value: kzNumber,
                            name: '空置',
                            color: '#ffe116'
                        },
                            {
                                value: syNumber,
                                name: '商用',
                                color: '#e822ff'
                            },
                            {
                                value: zzNumber,
                                name: '自住',
                                color: '#00ff78'
                            },
                            {
                                value: czNumber,
                                name: '出租',
                                color: '#ff4d77'
                            },
                            {
                                value: qtNumber,
                                name: '其他',
                                color: '#3cc1ff'
                            }
                        ],
                        occRate: occRate + '%',
                        total: zsNumber
                    };
                    commit(types.GET_STATEROOMS_DATA, data)
                }
            },
            error => {
                console.log(error)
            }
        )
    },
    getObjectDefence({commit, getters}) {
        api.getObjectDefence(
            getters.queryParam,
            response => {
                let res = response.data;
                commit(types.UPDATE_IGOOD, res.data);
            },
            error => console.log(error)
        )
    },
    getSpecialPerson({commit, getters}) {
        api.getSpecialPerson(
            getters.queryParam,
            response => {
                let res = response.data;
                commit(types.GET_SPECIAL_PERSON, res.data);
            },
            error => console.log(error)
        )
    },
    getSafetyExponent({commit, getters}) {
        let param = getters.queryParam + '&pageNow=1';
        api.getSafetyExponent(
            param,
            response => {
                var target = [];
                try {
                    let res = response.data;
                    target = res.data.slice(1, 7);
                } catch (e) {
                    console.log("Catch Error: ", e);
                }

                commit(types.GET_SAFETY_COMPONENT, target);
            },
            error => console.log(error)
        )
    },
    getCarDateCount({commit, getters}) {
        let param = getters.queryParam + '&groupType=1';
        api.getCarDateCount(
            param,
            response => {
                let res = response.data;
                commit(types.GET_CAR_DATE_COUNT, res);
            }
        )
    },
    getPersonDateCount({commit, getters}) {
        let param = getters.queryParam + '&groupType=1';
        api.getPersonDateCount(
            param,
            response => {
                let sum = 0;
                try {
                    response.data.forEach(item => {
                        sum += Object.values(item)[0]
                    })
                } catch (e) {
                    console.log("Catch Error: ", e);
                }
                commit(types.PERSON_DATE_COUNT, sum)
            }
        )
    },
    setDefaultFromSearchPage({state, commit, rootState, dispatch}) {
        //从搜索页获取县区/乡镇/居委会/小区信息
        let dTown = rootState.search.searchTownCode === "" ? "all" : rootState.search.searchTownCode;
        let dCountry = rootState.search.searchTownShipCode === "" ? "all" : rootState.search.searchTownShipCode;
        let dVillage = rootState.search.searchVillageCode === "" ? "all" : rootState.search.searchVillageCode;
        let dUnit = rootState.search.searchUnitId === "" ? "all" : rootState.search.searchUnitId;
        commit(types.SET_CURRENT_TOWN, "all");
        if (dTown !== "all" && dTown !== "") {
            commit(types.SET_CURRENT_TOWN, dTown);
            dispatch('changeTown', dTown);
            if (dCountry !== "all" && dCountry !== "") {
                commit(types.SET_CURRENT_TOWNSHIP, dCountry);
                dispatch('changeTownShip', dCountry);
                if (dVillage !== "all" && dVillage !== "") {
                    commit(types.SET_CURRENT_VILLAGE, dVillage);
                    dispatch('changeVillage', dVillage);
                    commit(types.SET_CURRENT_UNIT, dUnit);
                }
            }
        }
    },
    clickToPlatform({state, commit, rootState, dispatch}) {
        let currentUnitId = rootState.platform.currentUnitId;
        if (currentUnitId !== "all") {
            router.push("/zone");
        } else {
            router.push("/platform");
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