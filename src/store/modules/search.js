import searchAPI from '../../API/search'
import {getCommonSearchAllList, getCommonSearchPersonList, getCommonSearchCarList, getCommonSearchPlaceList} from '../../utils/searchUtil'
import {getObjectFromSessionStorage, setObjectToSessionStorage} from '../../utils/util'
import {lybNodeApiAddr, city_code} from '../../config'

const state = {
    searchPersonList: [],
    searchPersonTotal: 0,
    searchPersonPageIndex: 1,
    searchCarList: [],
    searchCarTotal: 0,
    searchCarPageIndex: 1,
    searchPlaceList: [],
    searchPlaceTotal: 0,
    searchPlacePageIndex: 1,
    searchAll: [],
    searchAllTotal: 0,
    searchAllPageIndex: 1,
    HighlightPersonList: [],
    HighlightCarList: [],
    HighlightPlaceList: [],
    HighlightAllList: [],
    city_code: city_code,
    searchTownCode: '',
    searchTownShipCode: '',
    searchVillageCode: '',
    searchUnitId: '',
    allDoorRecordPageIndex: 1,
    allDoorRecordtotalCount: 0,
    allCarRecordPageIndex: 1,
    allCarRecordtotalCount: 0,
    noResult: true,
    open_door: '',
    preName: sessionStorage.getItem('preName') || "",
    showName: sessionStorage.getItem('showName') || "",
    currentTab: "0",
    showNotify: false,
    notifyMsg: '',
    specialPlateNum: sessionStorage.getItem('specialPlateNum') || "",
    specialCarRecordPageIndex: 1,
    specialCarRecordtotalCount: 0,
    specialCarInfo: getObjectFromSessionStorage('specialCarInfo') || {},
    specialCarPhoneInfo: getObjectFromSessionStorage('specialCarPhoneInfo') || [],
    specialCarBaseInfo: getObjectFromSessionStorage('specialCarBaseInfo') || {},
    dataType: 1
}

const getters = {
    address: (state, getters, rootState) => {
        return rootState.searchBar.cityName + rootState.searchBar.townName + rootState.searchBar.townshipName + rootState.searchBar.villageName + rootState.searchBar.unitName;
    }
}

const mutations = {
    updateSearchPersonList(state, data) {
        state.searchPersonList = data;
    },
    updateSearchCarList(state, data) {
        state.searchCarList = data;
    },
    updateSearchPlaceList(state, data) {
        state.searchPlaceList = data;
    },
    updateSearchAllList(state, data) {
        state.searchAllList = data;
    },
    updateHighlightPersonList(state, data) {
        state.HighlightPersonList = data;
    },
    updateHighlightCarList(state, data) {
        state.HighlightCarList = data;
    },
    updateHighlightPlaceList(state, data) {
        state.HighlightPlaceList = data;
    },
    updateHighlightAllList(state, data) {
        state.HighlightAllList = data;
    },
    updateSearchPersonPageIndex(state, data) {
        state.searchPersonPageIndex = data;
    },
    updateSearchPersonTotal(state, data) {
        state.searchPersonTotal = data;
    },
    updateSearchCarPageIndex(state, data) {
        state.searchCarPageIndex = data;
    },
    updateSearchCarTotal(state, data) {
        state.searchCarTotal = data;
    },
    updateSearchPlacePageIndex(state, data) {
        state.searchPlacePageIndex = data;
    },
    updateSearchPlaceTotal(state, data) {
        state.searchPlaceTotal = data;
    },
    updateSearchAllPageIndex(state, data) {
        state.searchAllPageIndex = data;
    },
    updateSearchAllTotal(state, data) {
        state.searchAllTotal = data;
    },
    updateSearchTownCode(state, data) {
        state.searchTownCode = data;
    },
    updateSearchTownShipCode(state, data) {
        state.searchTownShipCode = data;
    },
    updateSearchVillageCode(state, data) {
        state.searchVillageCode = data;
    },
    updateSearchUnitId(state, data) {
        state.searchUnitId = data;
    },
    updateAllDoorRecordPageIndex(state, data) {
        state.allDoorRecordPageIndex = data;
    },
    updateAllDoorRecordtotalCount(state, data) {
        state.allDoorRecordtotalCount = data;
    },
    updateAllCarRecordPageIndex(state, data) {
        state.allCarRecordPageIndex = data;
    },
    updateAllCarRecordtotalCount(state, data) {
        state.allCarRecordtotalCount = data;
    },
    updateNoResult(state, data) {
        state.noResult = data;
    },
    updateOpenDoor(state, data) {
        state.open_door = data;
    },
    updatePreName(state, data) {
        sessionStorage.setItem('preName', data);
        state.preName = data;
    },
    updateShowName(state, data) {
        sessionStorage.setItem('showName', data);
        state.showName = data;
    },
    updateCurrentTab(state, data) {
        state.currentTab = data;
    },
    setDefaultTab(state) {
        state.currentTab = "0";
    },
    updateShowNotify(state, data) {
        state.showNotify = data;
    },
    updateNotifyMsg(state, data) {
        state.notifyMsg = data;
    },
    updateSpecialPlateNum(state, data) {
        sessionStorage.setItem('specialPlateNum', data);
        state.specialPlateNum = data;
    },
    updateSpeacilCarRecordPageIndex(state, data) {
        state.specialCarRecordPageIndex = data;
    },
    updateSpecialCarRecordtotalCount(state, data) {
        state.specialCarRecordtotalCount = data;
    },
    updateSpecialCarInfo(state, data) {
        setObjectToSessionStorage('specialCarInfo', data);
        state.specialCarInfo = data;
    },
    updatePhoneShow(state, index) {
        state.specialCarPhoneInfo[index]['show'] = !state.specialCarPhoneInfo[index]['show'];
    },
    updateSpecialCarPhoneInfo(state, data) {
        setObjectToSessionStorage('specialCarPhoneInfo', data);
        state.specialCarPhoneInfo = data;
    },
    updateSpecialCarBaseInfo(state, data) {
        setObjectToSessionStorage('specialCarBaseInfo', data);
        state.specialCarBaseInfo = data;
    },
    updateDataType(state, data) {
        state.dataType = data;
    }
}

const actions = {
    getSearchPersonList({state, commit, rootState}) {
        let params = {
            "keywords": rootState.platform.keyWord || "",
            "pageNo": state.searchPersonPageIndex,
            "pageSize": 5
        };
        searchAPI.getSearchPersonList(params,
            response => {
                //console.log(response);
                commit('updateSearchPersonList', []);
                commit('updateHighlightPersonList', []);
                commit('updateSearchPersonTotal', 0);
                if (response !== null && response.data !== null && response.data.code === "0000" && response.data.data !== null && response.data.data.items !== null && response.data.data.items.length > 0) {
                    let searchPersonList = response.data.data.items;
                    //处理界面展示数据
                    let personList = getCommonSearchPersonList(searchPersonList, rootState.platform.showSearch, rootState.platform.keyWord);
                    //处理界面展示数据
                    commit('updateHighlightPersonList', personList);
                    commit('updateSearchPersonTotal', response.data.data.totalCount);
                }
            },
            error => {
                console.log(error);
            }
        );
    },
    getSearchCarList({state, commit, rootState, dispatch}) {
        let params = {
            "keywords": rootState.platform.keyWord || "",
            "pageNo": state.searchCarPageIndex,
            "pageSize": 5
        };
        searchAPI.getSearchCarList(params,
            response => {
                // console.log(response);
                commit('updateSearchCarList', []);
                commit('updateHighlightCarList', []);
                commit('updateSearchCarTotal', 0);
                if (response !== null && response.data !== null && response.data.code === "0000" && response.data.data !== null && response.data.data.items !== null && response.data.data.items.length > 0) {
                    let searchCarList = response.data.data.items;
                    //处理界面展示数据
                    let carList = getCommonSearchCarList(searchCarList, rootState.platform.showSearch, rootState.platform.keyWord);
                    //处理界面展示数据
                    commit('updateHighlightCarList', carList);
                    commit('updateSearchCarTotal', response.data.data.totalCount);
                }
            },
            error => {
                console.log(error);
            }
        );
    },
    getSearchPlaceList({state, commit, rootState, dispatch}) {
        let params = {
            "keywords": rootState.platform.keyWord || "",
            "pageNo": state.searchPlacePageIndex,
            "pageSize": 5
        };
        searchAPI.getSearchPlaceList(params,
            response => {
                // console.log(response);
                commit('updateSearchPlaceList', []);
                commit('updateHighlightPlaceList', []);
                commit('updateSearchPlaceTotal', 0);
                if (response !== null && response.data !== null && response.data.code === "0000" && response.data.data !== null && response.data.data.items !== null && response.data.data.items.length > 0) {
                    let searchPlaceList = response.data.data.items;
                    //处理界面展示数据
                    let placeList = getCommonSearchPlaceList(searchPlaceList, rootState.platform.showSearch, rootState.platform.keyWord);
                    //处理界面展示数据
                    commit('updateHighlightPlaceList', placeList);
                    commit('updateSearchPlaceTotal', response.data.data.totalCount);
                }
            },
            error => {
                console.log(error);
            }
        );
    },
    getSearchAllList({state, commit, rootState, dispatch}) {
        let params = {
            "keywords": rootState.platform.keyWord || "",
            "pageNo": state.searchAllPageIndex,
            "pageSize": 5
        };

        searchAPI.getSearchAllList(params,
            response => {
                // console.log(response);
                commit('updateSearchAllList', []);
                commit('updateHighlightAllList', []);
                commit('updateSearchAllTotal', 0);

                if (response !== null && response.data !== null && response.data.code === "0000" && response.data.data !== null && response.data.data.items !== null && response.data.data.items.length > 0) {
                    let searchAllList = response.data.data.items;
                    //处理界面展示数据
                    let allList = getCommonSearchAllList(searchAllList, rootState.platform.showSearch, rootState.platform.keyWord);
                    //处理界面展示数据
                    commit('updateHighlightAllList', allList);
                    commit('updateSearchAllTotal', response.data.data.totalCount);
                } else {
                    commit('updateNoResult', true);
                }
            },
            error => {
                console.log(error);
            }
        );
    },
    updateUserInfo({state, commit, dispatch}, userInfo) {
        dispatch('userInfo/updateUserId', {
            userId: userInfo.user_id
        }, {
            root: true
        });
        dispatch('userInfo/updateUserName', {
            userName: userInfo.user_name
        }, {
            root: true
        });
        dispatch('userInfo/updateHouseUserId', {
            houseUserId: ''
        }, {
            root: true
        });
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}