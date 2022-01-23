import special from '../../API/special'
import platform from '../../API/platform'
import {apiAddr, province_code, city_code} from '../../config'
import {checkIdCode} from '@/utils/util'
import axios from 'axios'
import echarts from 'echarts'

const state = {
    showDel: false,
    showAdd: false,
    showNotify: false,
    showUpdate: false,
    notifyMsg: '',
    newUser: {},
    lists: [],
    totalNum: 0,
    pageIndex: 1,
    province_code: province_code,
    city_code: city_code,
    currentLoc: '铜仁市万山区',
    selectedUser: {},
    selection: {},
    selectUserList: [],
    townList: [],
    policeList: [],
    countryList: [],
    communityList: [],
    unitList: [],
    townList_2: [],
    policeList_2: [],
    countryList_2: [],
    communityList_2: [],
    unitList_2: [],
    specialData: {
        key: {
            count: 0,
            percent: 0
        },
        love: {
            count: 0,
            percent: 0
        }
    },
    key: {
        min: 0,
        max: 250,
        data: [10, 49, 23, 25, 76, 135, 240, 120]
    },
    love: {
        min: 0,
        max: 250,
        data: [10, 49, 23, 25, 76, 135, 240]
    },
    distribution: [],
    errorMsg: '',
    errorShow: false,
    mapCodeStr: '',
    personnel_type: '',
    personnel_category: '',
    checkResult: true,
    defaultTownCode: '',
    defaultTownshipCode: '',
    defaultVillageCode: '',
    defaultPoliceCode: '',
    defaultUnitId: '',
}

const mutations = {
    mshowDel(state) {
        state.showDel = !state.showDel;
    },
    mshowAdd(state) {
        state.showAdd = !state.showAdd;
    },
    mshowUpdate(state) {
        state.showUpdate = !state.showUpdate;
    },
    mshowNotify(state) {
        state.showNotify = !state.showNotify;
    },
    updateNotify(state, msg) {
        state.notifyMsg = msg;
    },
    updateNewUser(state, info) {
        state.newUser = info;
    },
    updateLists(state, info) {
        state.lists = info.lists;
        state.totalNum = info.totalNum;
        state.pageIndex = info.pageIndex;
    },
    getBasicInfo(state, info) {

    },
    updateSelectedUser(state, info) {
        info.isUpdate = true;
        state.selectedUser = info;
    },
    updateSelection(state, info) {
        state.selection = info;
    },
    updateSelected(state, info) {
        state.selection = info;
    },
    updateTown(state, info) {
        // state.townList = lists;
        if (info.flag) state.townList_2 = info.lists;
        else state.townList = info.lists;
    },
    updatePolice(state, info) {
        if (info.flag) state.policeList_2 = info.lists;
        else state.policeList = info.lists;
    },
    updateCountry(state, info) {
        if (info.flag) state.countryList_2 = info.lists;
        else state.countryList = info.lists;
    },
    updateCommunity(state, info) {
        if (info.flag) state.communityList_2 = info.lists;
        else state.communityList = info.lists;
    },
    updateUnit(state, info) {
        if (info.flag) state.unitList_2 = info.lists;
        else state.unitList = info.lists;
    },
    updateSpecial(state, info) {
        state.specialData.key.count = info.key.count;
        state.specialData.key.percent = info.key.percent;
        state.specialData.love.count = info.love.count;
        state.specialData.love.percent = info.love.percent;
    },
    updateKey(state, info) {
        state.key.min = info.min;
        state.key.max = info.max;
        state.key.data = info.data;
    },
    updateLove(state, info) {
        state.love.min = info.min;
        state.love.max = info.max;
        state.love.data = info.data;
    },
    updateDistribution(state, obj) {
        state.distribution = obj;
    },
    updateAddErr(state, {value, error}) {
        state.errorMsg = value;
        state.errorShow = error;
    },
    updateMapCodeStr(state, code) {
        state.mapCodeStr = code;
    },
    updatePersonnelType(state, type) {
        state.personnel_type = type;
    },
    updatePersonnelCategory(state, category) {
        state.personnel_category = category;
    },
    clearTownSelect(state) {
        state.policeList = [];
        state.countryList = [];
        state.communityList = [];
        state.unitList = [];
    },
    clearCountrySelect(state) {
        state.communityList = [];
        state.unitList = [];
    },
    clearCommunitySelect(state) {
        state.unitList = [];
    },
    clearPoliceSelect(state) {
        state.unitList = [];
    },
    clearTownSelect2(state) {
        state.policeList_2 = [];
        state.countryList_2 = [];
        state.communityList_2 = [];
        state.unitList_2 = [];
    },
    clearCountrySelect2(state) {
        state.communityList_2 = [];
        state.unitList_2 = [];
    },
    clearCommunitySelect2(state) {
        state.unitList_2 = [];
    },
    clearPoliceSelect2(state) {
        state.unitList_2 = [];
    },
    updateSelectedUserList(state, userList) {
        state.selectUserList = userList
    },
    updateCheckResult(state, result) {
        state.checkResult = result
    },
    updateDefaultSearchBar(state, searchBar) {
        state.defaultTownCode = searchBar.defaultTownCode;
        state.defaultTownshipCode = searchBar.defaultTownshipCode;
        state.defaultVillageCode = searchBar.defaultVillageCode;
        state.defaultPoliceCode = searchBar.defaultPoliceCode;
        state.defaultUnitId = searchBar.defaultUnitId;
    },
}

const actions = {
    setDefaultFromPlatform({state, commit, rootState}) {
        let rolePermission = rootState.global.accountInfo.rolePermission;
        //首先从platform首页的下拉框中获取县区/乡镇/居委会/小区信息
        //然后从rolePermission或accountInfo中获取县区/乡镇/居委会/小区信息
        let dTown = rootState.platform.currentTownCode === 'all' ? "" : rootState.platform.currentTownCode;
        if (dTown === "" && rolePermission && rolePermission.town_code) {//currentTownCode为空时 需要进一步从rolePermission中获取县区信息
            dTown = rolePermission.town_code;
        }
        let dPolice = rootState.platform.currentPoliceCode === 'all' ? "" : rootState.platform.currentPoliceCode;
        if (dPolice === "" && rolePermission && rolePermission.pid) {//currentPoliceCode为空时 需要进一步从rolePermission中获取派出所信息
            dPolice = rolePermission.pid;
        }
        let dCountry = rootState.platform.currentTownShipCode === 'all' ? "" : rootState.platform.currentTownShipCode;
        if (dCountry === "" && rolePermission && rolePermission.township_code) {//currentTownShipCode为空时 需要进一步从rolePermission中获取乡镇信息
            dCountry = rolePermission.township_code;
        }
        let dVillage = rootState.platform.currentVillageCode === 'all' ? "" : rootState.platform.currentVillageCode;
        if (dVillage === "" && rolePermission && rolePermission.village_code) {//currentVillageCode为空时 需要进一步从rolePermission中获取居委会信息
            dVillage = rolePermission.village_code;
        }
        let dUnit = "";
        if (rootState.platform.currentUnitId === 'all' || rootState.platform.currentUnitId === "") {//currentUnitId为空时 需要进一步从accountInfo中获取小区信息
            if (rolePermission.role_type_id && rolePermission.role_type_id === 13 && rootState.global.accountInfo.account_code) {
                dUnit = rootState.global.accountInfo.account_code;
            }
        } else {
            dUnit = rootState.platform.currentUnitId;
        }
        commit('updateDefaultSearchBar', {
            defaultTownCode: dTown,
            defaultPoliceCode: dPolice,
            defaultTownshipCode: dCountry,
            defaultVillageCode: dVillage,
            defaultUnitId: dUnit.indexOf(",") === -1 ? dUnit : ""
        });
    },
    getData({state, commit, rootState}) {
        let sTown = state.selection.town === 'all' ? '' : state.selection.town;
        let sCountry = state.selection.country === 'all' ? '' : state.selection.country;
        let sVillage = state.selection.community === 'all' ? '' : state.selection.community;
        let sUnit = state.selection.unit === 'all' ? '' : state.selection.unit;
        let data = {
            city_code: state.city_code,
            town_code: sTown,
            township_code: sCountry,
            village_code: sVillage,
            unit_id: sUnit
        };
        special.getSpecialData(data, response => {
                let res = response.data.data;
                if (response.data.code !== '0000') {
                    return;
                }
                let info = {
                    key: {
                        count: '',
                        percent: ''
                    },
                    love: {
                        count: '',
                        percent: ''
                    }
                };
                let zdry = res.zdry || 0;
                let gary = res.gary || 0;
                info.key.count = zdry;
                info.love.count = gary;
                let zdryrate = res.zdryrate || 0;
                info.key.percent = Math.round(zdryrate * 100);
                info.love.percent = 100 - info.key.percent;//解决两者之和不是100的问题
                if (zdry === 0 && gary === 0) {
                    info.key.percent = 0;
                    info.love.percent = 0;
                }
                commit('updateSpecial', info);
            },
            err => {
                console.log(err);
            })
    },
    initMap({state, commit, dispatch, rootState}) {
        console.log("charts initMap");
        let sTown = state.selection.town === 'all' ? '' : state.selection.town;
        let sCountry = state.selection.country === 'all' ? '' : state.selection.country;
        let sVillage = state.selection.community === 'all' ? '' : state.selection.community;
        let sTownCode = sTown;
        let sTownShipCode = sCountry;
        let sVillageCode = sVillage;
        commit('updateMapCodeStr', 'city_code=' + state.city_code + "&town_code=" + sTownCode + "&township_code=" + sTownShipCode + "&village_code=" + sVillageCode);
    },
    drawKeyAndLove({state, commit, dispatch, rootState}) {
        let sTown = state.selection.town === 'all' ? '' : state.selection.town;
        let sCountry = state.selection.country === 'all' ? '' : state.selection.country;
        let sVillage = state.selection.community === 'all' ? '' : state.selection.community;
        let sUnit = state.selection.unit === 'all' ? '' : state.selection.unit;
        let data = {
            city_code: state.city_code,
            town_code: sTown,
            township_code: sCountry,
            village_code: sVillage,
            unit_id: sUnit
        };

        special.getSpecialData(data, response => {
                let res = response.data.data;
                if (response.data.code !== '0000') {
                    return;
                }

                //let gary = res.gary || 0;
                //let zdry = res.zdry || 0;
                let yfdx = res.yfdx || 0;
                let cjry = res.cjry || 0;
                let lxgb = res.lxgb || 0;
                let dbry = res.dbry || 0;
                let zdjbry = res.zdjbry || 0;
                let gglr = res.gglr || 0;
                let lsry = res.lsry || 0;
                // bad people
                let xdry = res.xdry || 0;
                let sqjzry = res.sqjzry || 0;
                let fxjsdry = res.fxjsdry || 0;
                let xmjdry = res.xmjdry || 0;
                //let zdqsn = res.zdqsn || 0;
                let zdxfry = res.zdxfry || 0;
                let ydzszfjsbry = res.ydzszfjsbry || 0;//严重肇事肇祸精神病 替换为 精神病人
                let sxry = res.sxry || 0;
                let zdqsn = res.zdqsn || 0;
                let zhqxry = res.zhqxry || 0;
                let info2 = {
                    min: Math.min(xdry, sqjzry, xmjdry, zdxfry, ydzszfjsbry, sxry, zdqsn),
                    max: Math.max(xdry, sqjzry, xmjdry, zdxfry, ydzszfjsbry, sxry, zdqsn),
                    data: [xdry, sqjzry, xmjdry, zdxfry, ydzszfjsbry, sxry, zdqsn]
                };

                let interval2 = parseInt((info2.max - info2.min) / 2);

                //绘制重点人员图表
                let myChart2 = echarts.init(document.getElementById('key_2'));
                let option2 = {
                    grid: {
                        y2: 80
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return params.name + '：' + params.value + params.seriesName;
                        }
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['涉毒人员', '社区矫正人员', '刑释解戒人员', '重点信访人员', '精神病人', '涉邪人员', '重点青少年'],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#FFF',
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: -30
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '人',
                        min: info2.min,
                        max: info2.max,
                        interval: interval2 === 0 ? 1 : interval2,//避免间距为0时，纵轴无法绘制的问题
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#FFF',
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#999'
                            }
                        }
                    }],
                    series: [{
                        name: '人',
                        type: 'bar',
                        data: info2.data,
                        itemStyle: {
                            normal: {
                                color: '#32d7f4'
                            }
                        }
                    },
                        {
                            name: '人',
                            type: 'line',
                            data: info2.data,
                            itemStyle: {
                                normal: {
                                    color: '#0e7bf7'
                                }
                            },
                            symbolSize: 10
                        }
                    ]
                };
                myChart2.setOption(option2);

                let info1 = {
                    min: Math.min(yfdx, cjry, lxgb, dbry, zdjbry, lsry, gglr),
                    max: Math.max(yfdx, cjry, lxgb, dbry, zdjbry, lsry, gglr),
                    data: [yfdx, cjry, lxgb, dbry, zdjbry, lsry, gglr]
                };
                let interval1 = parseInt((info1.max - info1.min) / 2);
                let myChart1 = echarts.init(document.getElementById('love_2'));
                let option1 = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return params.name + '：' + params.value + params.seriesName;
                        }
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['优抚对象', '残疾人员', '离休干部', '低保人员', '重大疾病人员', '留守人员', '孤寡老人'],
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#FFF',
                            }
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: -30
                        }
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '人',
                        min: info1.min,
                        max: info1.max,
                        interval: interval1 === 0 ? 1 : interval1,//避免间距为0时，纵轴无法绘制的问题
                        axisLabel: {
                            formatter: '{value}'
                        },
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#FFF',
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#999'
                            }
                        }
                    }],
                    series: [{
                        name: '人',
                        type: 'bar',
                        data: info1.data,
                        itemStyle: {
                            normal: {
                                color: '#dbcf45'
                            }
                        }
                    },
                        {
                            name: '人',
                            type: 'line',
                            data: info1.data,
                            itemStyle: {
                                normal: {
                                    color: '#dc6b1f'
                                }
                            },
                            symbolSize: 10
                        }
                    ]
                };
                myChart1.setOption(option1);
            },
            err => {
                console.log(err)
            })
    },
    getTown({state, commit, rootState}, isAdd) {
        let lists = [{value: 'all', label: '全部'}];
        if (isAdd) {
            lists = [{value: 'all', label: '请选择'}];
        }
        let rolePermission = rootState.global.accountInfo.rolePermission;
        if (rolePermission && rolePermission.town_code && rolePermission.town_code !== '') {
            // 由权限定义了默认区县, 此时 state.townList 请求结果也为空, 填充默认区县
            lists = [{
                value: rolePermission.town_code,
                label: rolePermission.town_name
            }];
            /*if(isAdd){
                lists = [{value: 'all', label: '请选择'},{
                    value: rolePermission.town_code,
                    label: rolePermission.town_name
                }];
            }*/
            commit('updateTown', {lists: lists, flag: isAdd});
            return;
        }
        special.getTownList({
                city_code: state.city_code
            },
            response => {
                let res = response.data.data;
                if (response.data.code !== '0000') {
                    return;
                }
                if (res.length === 0) {
                    return;
                }
                let unitLists = [{value: 'all', label: '全部'}];
                if (isAdd) {
                    unitLists = [{value: 'all', label: '请选择'}];
                }
                for (let town of res) {
                    unitLists.push({value: town.town_code, label: town.town_name});
                }
                commit('updateTown', {lists: unitLists, flag: isAdd});
            },
            error => {
                console.log(error);
            }
        );
    },
    getPolice({state, commit, rootState}, selected) {
        let lists = [{value: 'all', label: '全部'}];
        if (selected.isAdd) {
            lists = [{value: 'all', label: '请选择'}];
        }
        let flag = true;
        let rolePermission = rootState.global.accountInfo.rolePermission;
        if (rolePermission && rolePermission.pid && rolePermission.pid !== '') {
            flag = false;
            let ppName = "";
            //当登陆账号为派出所账号时，accountInfo里只有pid，没有pName 补救措施
            if(rolePermission.rolename && rolePermission.rolename.indexOf("派出所") !== -1){
                ppName = rolePermission.rolename.substr(0, rolePermission.rolename.length - 5).substr(9);
            }
            lists = [{
                value: String(rolePermission.pid),
                label: rolePermission.pName || ppName
            }];
            commit('updatePolice', {lists: lists, flag: selected.isAdd});
        }
        if (flag && selected.town && selected.town !== 'all') {
            let query = "province_code=" + state.province_code
                + '&city_code=' + state.city_code
                + '&town_code=' + selected.town;
            platform.getPolice(query,
                response => {
                    let res = response.data.data;
                    if (response.data.code !== '0000') {
                        return;
                    }
                    if (res.length === 0) {
                        return;
                    }
                    for (let police of res) {
                        lists.push({value: police.id, label: police.police_station});
                    }
                    //过滤后台传过来的空值
                    lists = lists.filter(function (item) {
                        return item.value ? true : false;
                    });
                    commit('updatePolice', {lists: lists, flag: selected.isAdd});
                },
                error => {
                    console.log(error);
                }
            );
        }

        if (selected.town && selected.town !== "all") {
            special.getUnitByCode({
                    flag: 'town',
                    code: selected.town
                },
                response => {
                    let res = response.data.data;
                    if (response.data.code !== '0000') {
                        return;
                    }
                    if (res.length === 0) {
                        return;
                    }
                    let unitLists = [{value: 'all', label: '全部'}];
                    if (selected.isAdd) {
                        unitLists = [{value: 'all', label: '请选择'}];
                    }
                    for (let town of res) {
                        unitLists.push({value: town.unit_id, label: town.name});
                    }
                    //过滤后台传过来的空值
                    unitLists = unitLists.filter(function (item) {
                        return item.value ? true : false;
                    });
                    //如果登录的是小区管理员账号
                    let rolePermission = rootState.global.accountInfo.rolePermission;
                    if (rolePermission.role_type_id && rolePermission.role_type_id === 13 && rootState.global.accountInfo.account_code) {
                        /*unitLists = unitLists.filter(function (item) {
                            return item.value === rootState.global.accountInfo.account_code
                        })*/
                        //一个账号可能管理多个小区
                        let manageUnits = rootState.global.accountInfo.account_code.split(",");
                        unitLists = unitLists.filter(function (item) {
                            return manageUnits.indexOf(item.value) !== -1;
                        })
                    }
                    commit('updateUnit', {lists: unitLists, flag: selected.isAdd});
                },
                error => {
                    console.log(error);
                }
            );
        }
    },
    getCountry({state, commit, rootState}, selected) {
        let lists = [{value: 'all', label: '全部'}];
        if (selected.isAdd) {
            lists = [{value: 'all', label: '请选择'}];
        }
        let flag = true;
        let rolePermission = rootState.global.accountInfo.rolePermission;
        if (rolePermission && rolePermission.township_code && rolePermission.township_code !== '') {
            flag = false;
            lists = [{
                value: rolePermission.township_code,
                label: rolePermission.township
            }];
            /*if(selected.isAdd){
                lists = [{value: 'all', label: '请选择'},{
                    value: rolePermission.township_code,
                    label: rolePermission.township
                }];
            }*/
            commit('updateCountry', {lists: lists, flag: selected.isAdd});
            // return
        }
        if (flag && selected.town && selected.town !== 'all') {
            special.getTownShipList({
                    city_code: state.city_code,
                    town_code: selected.town === 'all' ? '' : selected.town
                },
                response => {
                    let res = response.data.data;
                    if (response.data.code !== '0000') {
                        return;
                    }
                    if (res.length === 0) {
                        return;
                    }
                    for (let town of res) {
                        lists.push({value: town.township_code, label: town.township_name});
                    }
                    //过滤后台传过来的空值
                    lists = lists.filter(function (item) {
                        return item.value ? true : false;
                    });
                    commit('updateCountry', {lists: lists, flag: selected.isAdd});
                },
                error => {
                    console.log(error);
                }
            );
        }

        if (selected.town && selected.town !== "all") {
            special.getUnitByCode({
                    flag: 'town',
                    code: selected.town
                },
                response => {
                    let res = response.data.data;
                    if (response.data.code !== '0000') {
                        return
                    }
                    if (res.length === 0) {
                        return
                    }
                    let unitLists = [{value: 'all', label: '全部'}];
                    if (selected.isAdd) {
                        unitLists = [{value: 'all', label: '请选择'}];
                    }
                    for (let town of res) {
                        unitLists.push({value: town.unit_id, label: town.name});
                    }
                    //过滤后台传过来的空值
                    unitLists = unitLists.filter(function (item) {
                        return item.value ? true : false;
                    });
                    //如果登录的是小区管理员账号
                    let rolePermission = rootState.global.accountInfo.rolePermission;
                    if (rolePermission.role_type_id && rolePermission.role_type_id === 13 && rootState.global.accountInfo.account_code) {
                        /*unitLists = unitLists.filter(function (item) {
                            return item.value === rootState.global.accountInfo.account_code
                        })*/
                        //一个账号可能管理多个小区
                        let manageUnits = rootState.global.accountInfo.account_code.split(",");
                        unitLists = unitLists.filter(function (item) {
                            return manageUnits.indexOf(item.value) !== -1;
                        })
                    }
                    commit('updateUnit', {lists: unitLists, flag: selected.isAdd});
                },
                error => {
                    console.log(error);
                }
            );
        }

    },
    getCommunity({state, commit, rootState}, selected) {
        let lists = [{value: 'all', label: '全部'}];
        if (selected.isAdd) {
            lists = [{value: 'all', label: '请选择'}];
        }
        let flag = true;
        let rolePermission = rootState.global.accountInfo.rolePermission;
        if (rolePermission && rolePermission.village_code && rolePermission.village_code !== '') {
            flag = false;
            lists = [{
                value: rolePermission.village_code,
                label: rolePermission.village_name
            }];
            /*if(selected.isAdd){
                lists = [{value: 'all', label: '请选择'},{
                    value: rolePermission.village_code,
                    label: rolePermission.village_name
                }]
            }*/
            commit('updateCommunity', {lists: lists, flag: selected.isAdd});
            // return
        }
        if (flag && selected.town && selected.town !== 'all' && selected.country && selected.country !== 'all') {
            special.getVillageList({
                    city_code: state.city_code,
                    town_code: selected.town === 'all' ? '' : selected.town,
                    township_code: selected.country === 'all' ? '' : selected.country
                },
                response => {
                    let res = response.data.data;
                    if (response.data.code !== '0000') {
                        return;
                    }
                    if (res.length === 0) {
                        return;
                    }
                    for (let town of res) {
                        lists.push({value: town.village_code, label: town.village_name});
                    }
                    //过滤后台传过来的空值
                    lists = lists.filter(function (item) {
                        return item.value ? true : false;
                    });
                    commit('updateCommunity', {lists: lists, flag: selected.isAdd});
                },
                error => {
                    console.log(error);
                }
            );
        }

        let unitParams = {
            flag: 'township',
            code: selected.country
        };

        if (selected.country === "" || selected.country === 'all' && (selected.town && selected.town !== 'all')) {
            unitParams = {
                flag: 'town',
                code: selected.town
            };
        }
        special.getUnitByCode(unitParams,
            response => {
                let res = response.data.data;
                if (response.data.code !== '0000') {
                    return
                }
                if (res.length === 0) {
                    return
                }
                let unitLists = [{value: 'all', label: '全部'}];
                if (selected.isAdd) {
                    unitLists = [{value: 'all', label: '请选择'}];
                }
                for (let town of res) {
                    unitLists.push({value: town.unit_id, label: town.name});
                }
                //过滤后台传过来的空值
                unitLists = unitLists.filter(function (item) {
                    return item.value ? true : false;
                });
                //如果登录的是小区管理员账号
                let rolePermission = rootState.global.accountInfo.rolePermission;
                if (rolePermission.role_type_id && rolePermission.role_type_id === 13 && rootState.global.accountInfo.account_code) {
                    /*unitLists = unitLists.filter(function (item) {
                        return item.value === rootState.global.accountInfo.account_code;
                    })*/
                    //一个账号可能管理多个小区
                    let manageUnits = rootState.global.accountInfo.account_code.split(",");
                    unitLists = unitLists.filter(function (item) {
                        return manageUnits.indexOf(item.value) !== -1;
                    })
                }
                commit('updateUnit', {lists: unitLists, flag: selected.isAdd});
            },
            error => {
                console.log(error);
            }
        );
    },
    getUnit({state, commit, rootState}, selected) {
        let lists = [{value: 'all', label: '全部'}];
        if (selected.isAdd) {
            lists = [{value: 'all', label: '请选择'}];
        }

        let police = selected.police === 'all' ? '' : selected.police;

        let query = "province_code=" + state.province_code
            + '&city_code=' + state.city_code
            + '&town_code=' + selected.town;

        if (police) {
            query += '&police_code=' + police;
            platform.getUnitByPolice(query,
                response => {
                    let res = response.data.data;
                    if (response.data.code !== '0000') {
                        return;
                    }
                    if (res.length === 0) {
                        return;
                    }
                    for (let unit of res) {
                        lists.push({value: unit.unit_id, label: unit.name})
                    }
                    //过滤后台传过来的空值
                    lists = lists.filter(function (item) {
                        return item.value ? true : false;
                    });
                    //如果登录的是小区管理员账号
                    let rolePermission = rootState.global.accountInfo.rolePermission;
                    if (rolePermission.role_type_id && rolePermission.role_type_id === 13 && rootState.global.accountInfo.account_code) {
                        /*lists = lists.filter(function (item) {
                                return item.value === rootState.global.accountInfo.account_code
                            })*/
                        //一个账号可能管理多个小区
                        let manageUnits = rootState.global.accountInfo.account_code.split(",");
                        lists = lists.filter(function (item) {
                            return manageUnits.indexOf(item.value) !== -1;
                        });
                    }
                    commit('updateUnit', {lists: lists, flag: selected.isAdd});
                },
                error => {
                    console.log(error);
                }
            );
        } else {
            if (selected.town && selected.town !== "all") {
                special.getUnitByCode({
                        flag: 'town',
                        code: selected.town
                    },
                    response => {
                        let res = response.data.data;
                        if (response.data.code !== '0000') {
                            return;
                        }
                        if (res.length === 0) {
                            return;
                        }
                        let unitLists = [{value: 'all', label: '全部'}];
                        if (selected.isAdd) {
                            unitLists = [{value: 'all', label: '请选择'}];
                        }
                        for (let town of res) {
                            unitLists.push({value: town.unit_id, label: town.name});
                        }
                        //过滤后台传过来的空值
                        unitLists = unitLists.filter(function (item) {
                            return item.value ? true : false;
                        });
                        //如果登录的是小区管理员账号
                        let rolePermission = rootState.global.accountInfo.rolePermission;
                        if (rolePermission.role_type_id && rolePermission.role_type_id === 13 && rootState.global.accountInfo.account_code) {
                            /*unitLists = unitLists.filter(function (item) {
                                return item.value === rootState.global.accountInfo.account_code
                            })*/
                            //一个账号可能管理多个小区
                            let manageUnits = rootState.global.accountInfo.account_code.split(",");
                            unitLists = unitLists.filter(function (item) {
                                return manageUnits.indexOf(item.value) !== -1;
                            })
                        }
                        commit('updateUnit', {lists: unitLists, flag: selected.isAdd});
                    },
                    error => {
                        console.log(error);
                    }
                );
            }

        }


    },
    confirmDel({dispatch, state, commit}, {usr}) {
        //删除
        let usrList = [];
        if (Object.prototype.toString.call(usr) === '[object Array]' && usr.length > 0) {
            for (var i = 0; i < usr.length; i++) {
                usrList.push(usr[i].id);
            }
        }
        usrList = usrList.join(",");

        special.delSpecialUsr({
                ids: usrList
            }, response => {
                if (response.data.code !== '0000') {
                    commit('mshowDel');
                    commit('updateNotify', '删除失败！');
                    commit('mshowNotify');
                    setTimeout(() => {
                        commit('mshowNotify');
                    }, 2000);
                    return;
                }
                commit('mshowDel');
                commit('updateNotify', '删除成功！');
                commit('mshowNotify');
                setTimeout(() => {
                    dispatch('getData');
                    dispatch('drawKeyAndLove');
                    dispatch('getLists', {pageNo: 1});
                    commit('mshowNotify');
                }, 2000);
            },
            err => {
                console.log(err);
            })
    },
    formCheck({dispatch, state, commit}, newUser) {
        function showErr(errorMsg) {
            commit('updateAddErr', {value: errorMsg, error: true});
        }
        commit('updateCheckResult', true);
        let errorMsg = '';
        if (!newUser.name) {
            errorMsg = '请输入姓名！';
            showErr(errorMsg);
            commit('updateCheckResult', false);
            return;
        }
        // if (!newUser.image) {
        //     errorMsg = '请选择头像！';
        //     showErr(errorMsg);
        //     return;
        // }
        if (!newUser.gender) {
            errorMsg = '请选择性别！';
            showErr(errorMsg);
            commit('updateCheckResult', false);
            return;
        }
        if (!newUser.code) {
            errorMsg = '请输入身份证号码！';
            showErr(errorMsg);
            commit('updateCheckResult', false);
            return;
        } else {
            let checkResult = checkIdCode(newUser.code);
            if(!checkResult.check) {
                errorMsg = checkResult.msg;
                showErr(errorMsg);
                commit('updateCheckResult', false);
                return;
            }
        }
        if (!newUser.phone) {
            errorMsg = '请输入电话号码！';
            showErr(errorMsg);
            commit('updateCheckResult', false);
            return;
        } else {
            if (/^1[3-9]\d{9}$/.test(newUser.phone) === false) {
                errorMsg = '您输入的电话号码格式有误！';
                showErr(errorMsg);
                commit('updateCheckResult', false);
                return;
            }
        }
        if (!newUser.address) {
            errorMsg = '请填写地址！';
            showErr(errorMsg);
            commit('updateCheckResult', false);
            return;
        }
        if (!newUser.unit || newUser.unit === 'all') {
            errorMsg = '请选择小区！';
            showErr(errorMsg);
            commit('updateCheckResult', false);
            return;
        }
        if (!newUser.type) {
            errorMsg = '请选择人员类型！';
            showErr(errorMsg);
            commit('updateCheckResult', false);
            return;
        }
        if (!newUser.category) {
            errorMsg = '请选择人员类目！';
            showErr(errorMsg);
            commit('updateCheckResult', false);
            return;
        }

    },
    confirmAdd({dispatch, state, commit}, newUser) {
        dispatch('formCheck', newUser);
        if (!state.checkResult) {
            return;
        }
        //add new user
        special.addSpecialUsr({
            unit_id: newUser.unit, // 小区id
            unit_name: newUser.unit_name, // 小区名称
            city_code: state.city_code,
            // building_code: '', //栋座编码
            // room: '',//房号
            name: newUser.name,//姓名
            // age: '',//年龄
            gender: newUser.gender,
            face_image: newUser.image,//照片
            id_code: newUser.code,//身份证号
            native_place: newUser.nation,//户籍
            // relation_with_owner: '',//与业主关系
            telephone: newUser.phone,//电话号码
            personnel_type: newUser.type,//人员类型
            personnel_category: newUser.category,//人员类目
            address: newUser.address,//住址
            city_code: state.city_code,//城市编码
            town_code: newUser.town === 'all' ? '' : newUser.town,//县区编码
            remark: newUser.remark,//备注
            //需要调试接口
            township_code: newUser.country === 'all' ? '' : newUser.country,//街道办/乡镇编码
            village_code: newUser.community === 'all' ? '' : newUser.community,//居委会/村编码
            // day_walk_record:'',//当天出行记录（次数）
            // month_walk_record:'',//当月出行记录（次数）
            // Grid_member_visited: '',//网格员走访记录（次数）
            // sync_id:'',//标识
            // sync_time:'',//时间
        }, response => {
            if (response.data.code !== '0000') {
                if (response.data.code === '0002') {
                    commit('updateAddErr', {value: response.data.msg, error: true});
                    return
                }
                commit('mshowAdd');
                commit('updateNotify', '添加失败！');
                commit('mshowNotify');
                setTimeout(() => {
                    commit('mshowNotify');
                }, 2000);
                return;
            }

            commit('mshowAdd');
            commit('updateNotify', '添加成功！');
            commit('mshowNotify');
            setTimeout(() => {
                dispatch('getData');
                dispatch('drawKeyAndLove');
                dispatch('getLists', {pageNo: 1});
                commit('mshowNotify');
            }, 2000);
        }, err => {
            console.log(err);
        })
    },
    confirmUpdate({dispatch, state, commit}, selectedUser) {
        //update user
        dispatch('formCheck', selectedUser);
        if (!state.checkResult) {
            return;
        }
        special.updateSpecialUsr({
                id: selectedUser.id,
                unit_id: selectedUser.unit, // 小区id
                unit_name: selectedUser.unit_name, // 小区名称
                // building_code: '', //栋座编码
                // room: '',//房号
                // name: '',//姓名
                // age: '',//年龄
                gender: selectedUser.gender,
                face_image: selectedUser.image,//照片
                id_code: selectedUser.code,//身份证号
                native_place: selectedUser.nation,//户籍
                // relation_with_owner: '',//与业主关系
                telephone: selectedUser.phone,//电话号码
                personnel_type: selectedUser.type,//人员类型
                personnel_category: selectedUser.category,//人员类目
                address: selectedUser.address,//住址
                city_code: state.city_code,//城市编码
                town_code: selectedUser.town === 'all' ? '' : selectedUser.town,//县区编码
                remark: selectedUser.remark,//备注
                //需要调试接口
                township_code: selectedUser.country === 'all' ? '' : selectedUser.country,//街道办/乡镇编码
                village_code: selectedUser.community === 'all' ? '' : selectedUser.community,//居委会/村编码
                // day_walk_record:'',//当天出行记录（次数）
                // month_walk_record:'',//当月出行记录（次数）
                // Grid_member_visited: '',//网格员走访记录（次数）
                // sync_id:'',//标识
                // sync_time:'',//时间
            }, response => {
                let res = response.data.data;
                if (response.data.code !== '0000') {
                    commit('mshowUpdate');
                    commit('updateNotify', '修改失败！');
                    commit('mshowNotify');
                    setTimeout(() => {
                        dispatch('getLists', {pageNo: 1});
                        commit('mshowNotify');
                    }, 2000);
                    return;
                }
                commit('mshowUpdate');
                commit('updateNotify', '修改成功！');
                commit('mshowNotify');
                setTimeout(() => {
                    dispatch('getData');
                    dispatch('drawKeyAndLove');
                    dispatch('getLists', {pageNo: 1});
                    commit('mshowNotify');
                }, 2000);
            },
            err => {
                console.log(err);
            })
    },
    query({dispatch, state, commit}, search) {
        //query and update lists and update pageNums
        let info = {};
        info.lists = [];
        info.totalNum = 1;
        dispatch('getLists', {
            pageNo: 1,
            queries: {
                name: search.name,
                phone: search.phone,
                id_code: search.code,
                room: search.room,
                maxAge: search.age_max,
                minAge: search.age_min
            }
        })
    },
    getLists({state, commit, rootState}, {pageNo, queries}) {
        //get lists and update pageNums
        commit('updateSelectedUserList', []);
        let pageSize = 8;
        let info = {
            lists: [],
            totalNum: 0
        };
        let l = [];
        let sTown = state.selection.town === 'all' ? '' : state.selection.town;
        let sCountry = state.selection.country === 'all' ? '' : state.selection.country;
        let sVillage = state.selection.community === 'all' ? '' : state.selection.community;
        let sUnit = state.selection.unit === 'all' ? '' : state.selection.unit;
        let stat = {
            city_code: state.city_code,
            town_code: sTown,
            township_code: sCountry,
            village_code: sVillage,
            unit_id: sUnit,
            personnel_type: state.personnel_type,
            personnel_category: state.personnel_category,
            pageNo: pageNo,
            pageSize: pageSize
        };
        if (queries) {
            stat.name = queries.name;
            stat.telephone = queries.phone;
            stat.id_code = queries.id_code;
            stat.room = queries.room;
            stat.maxAge = queries.maxAge;
            stat.minAge = queries.minAge;
        }
        special.getSpecialList(stat, response => {
                if (!response.data.data) return;
                let res = response.data.data.items;
                // let res = response.data.data;
                if (response.data.code !== '0000') {
                    return;
                }
                if (res.length === 0) {
                    info.lists = l;
                    info.totalNum = response.data.data.totalCount;
                    info.pageIndex = pageNo;
                    commit('updateLists', info);
                    return;
                }
                for (let [i, r] of res.entries()) {
                    let list = {
                        unit_name: r.unit_name || '',
                        name: r.name || '',
                        idcard: r.id_code || '',
                        phone: r.telephone || '',
                        usertype: r.personnel_type === '1' ? '关爱人员' : '重点人员',
                        category: r.personnel_category || '',
                        daycount: r.day_walk_record || '0',
                        monthcount: r.month_walk_record || '0',
                        remark: r.remark || '',
                        nation: r.native_place || '',
                        photo: r.face_image || '',
                        address: r.address || '',
                        id: r.id,
                        // id: i + 1,//测试用
                        unit: r.unit_id || '',
                        town: r.town_code || '',
                        country: r.township_code || '',
                        community: r.village_code || '',
                        more: {
                            "gender": r.gender,
                            "town": r.town_code || '',
                            "country": r.township_code || '',
                            "community": r.village_code || '',
                            "unit_id": r.unit_id || '',
                            "flag": r.flag || '',
                            "user_id": r.user_id || ''
                        },
                        category_code: r.personnel_category || '',
                        usertype_code: r.personnel_type || '',
                        gender: r.gender || '',
                        user_id: r.user_id || '',
                        flag: r.flag || ''
                    };
                    let c = '';
                    switch (list.category) {
                        case '1':
                            c = '涉毒人员';
                            break;
                        case '2':
                            c = '社区矫正人员';
                            break;
                        // case '3':
                        //     c = '服刑及涉毒人员';
                        //     break;
                        case '4':
                            c = '刑释解戒人员';
                            break;
                        case '5':
                            c = '重点青少年';
                            break;
                        case '6':
                            c = '重点信访人员';
                            break;
                        case '7':
                            c = '精神病人';
                            break;
                        case '8':
                            c = '涉邪人员';
                            break;
                        case '9':
                            c = '优抚对象';
                            break;
                        case '10':
                            c = '残疾人员';
                            break;
                        case '11':
                            c = '离休干部';
                            break;
                        case '12':
                            c = '低保人员';
                            break;
                        case '13':
                            c = '重大疾病人员';
                            break;
                        case '14':
                            c = '孤寡老人';
                            break;
                        case '15':
                            c = '留守人员';
                            break;
                        default:
                            break;
                    }
                    list.category = c;
                    l.push(list)
                }
                info.lists = l;
                info.totalNum = response.data.data.totalCount;
                info.pageIndex = pageNo;
                commit('updateLists', info);
            },
            err => {
                console.log(err);
            })
    },
    export({state, commit}, {selected, queries}) {
        //get lists and update pageNums
        let sTown = state.selection.town === 'all' ? '' : state.selection.town;
        let sCountry = state.selection.country === 'all' ? '' : state.selection.country;
        let sVillage = state.selection.community === 'all' ? '' : state.selection.community;
        let sUnit = state.selection.unit === 'all' ? '' : state.selection.unit;
        let stat = {
            city_code: state.city_code || '',
            town_code: sTown || '',
            township_code: sCountry || '',
            village_code: sVillage || '',
            unit_id: sUnit || '',
            personnel_type: state.personnel_type || '',
            personnel_category: state.personnel_category || ''
        };
        if (queries) {
            stat.name = queries.name || '';
            stat.telephone = queries.phone || '';
            stat.id_code = queries.id_code || '';
            stat.room = queries.room || '';
            stat.maxAge = queries.maxAge || '';
            stat.minAge = queries.minAge || '';
        }

        let keyWord = '?';
        for (var item in stat) {
            keyWord += ( item + '=' + stat[item] + '&');
        }
        let ids = '';
        if (Object.prototype.toString.call(selected) === '[object Array]' && selected.length > 0) {
            ids = selected.join(",");
        }

        axios.post('speicalPerson/exportSpeicalPerson.do', stat).then(response => {
            //如果没有数据 提示
            if (response && response.data && response.data.code !== "0000") {
                commit('updateNotify', '无特殊人员数据！');
                commit('mshowNotify');
                setTimeout(() => {
                    commit('mshowNotify');
                }, 2000);
            } else {
                window.location.href = apiAddr + '/speicalPerson/exportSpeicalPerson.do' + keyWord.slice(0, -1);
            }
        }).catch(err => {
            //如果有数据 是文件 会走这里
            window.location.href = apiAddr + '/speicalPerson/exportSpeicalPerson.do' + keyWord.slice(0, -1);
        });

    },
    updateUserId({state, commit, dispatch}, userId) {
        dispatch('userInfo/updateUserId', {
            userId: userId
        }, {
            root: true
        });
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}