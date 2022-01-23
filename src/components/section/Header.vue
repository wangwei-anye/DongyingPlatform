<template>
    <div class='header-root'>
        <span class="title">{{ currentName }}</span>

        <div class="searchBar">
            <div class="address" v-show="!showSearchInput">
                <Select :value="currentTownCode" @on-change="changeTown" class="v-select" placeholder="区县">
                    <Option v-for="item in allTown" :value="item.town_code" :key="item.town_code">{{ item.town_name }}
                    </Option>
                </Select>
                <Select :value="currentPoliceCode" @on-change="changePolice" class="v-select">
                    <Option v-for="item in allPolice" :value="item.police_code" :key="item.police_code">
                        {{ item.police_name }}
                    </Option>
                </Select>
                <Select :value="currentUnitId" @on-change="changeUnit" class="v-select">
                    <Option v-for="item in allUnit" :value="item.unit_id" :key="item.unit_id">{{ item.unit_name }}
                    </Option>
                </Select>
            </div>
            <div class="search">
                <div class="search-form" v-show="showSearchInput">
                    <i @click="closeSearch"></i>
                    <input type="text" @keyup.enter="search" @keyup.27="closeSearch" v-model="keyWordInput"
                           placeholder=" 姓名 / 电话 / 身份证 / 车牌号 / 区县 / 乡镇 / 社区 / 小区"/>
                </div>
                <img class="icon-search" @click="search" src="../../assets/image/header-icon-search.png"/>
                <img class="icon-editor" src="../../assets/image/header-icon-edit-blue.png" @click="showApppop">
                <img class="icon-home" src="../../assets/image/header-icon-home.png" @click="toPath('/platform')">
                <img class="icon-user" src="../../assets/image/header-icon-user.png" @click="toPath('/index/usercenter')" />
                <!-- <img class="icon-user" src="../../assets/image/header-icon-user.png" @mouseover="showInfoTip" @mouseleave="setTimeHideInfoTip"/> -->
                <img class="icon-quit" src="../../assets/image/header-icon-quit.png" @click="modifyLogoutModal(true)">
                <div class="info-tip" v-show="showInfoTips" @mouseleave="hideInfoTip" @mouseover="clearHideInfoTip">
                    <ul>
                        <li class="rolename"
                            :title="global.accountInfo.rolePermission ? global.accountInfo.rolePermission.rolename : ' '">
                            {{ global.accountInfo.rolePermission ? global.accountInfo.rolePermission.rolename : ' '}}
                        </li>
                        <li class="account">
                            <div class="omit" :title="global.accountInfo.account">账号：{{ global.accountInfo.account }}
                            </div>
                            <span @click="modifyPasswordModal(true)">修改密码</span>
                        </li>
                        <li class="name">
                            <div class="omit" :title="global.accountInfo.username">用户名：{{ global.accountInfo.username
                                }}
                            </div>
                            <i class="edit" @click="modifyUsernameModal(true)"></i>
                        </li>
                        <li>
                            <router-link to="/permission">权限管理<i class="right"></i></router-link>
                        </li>
                        <li @click="modifyLogoutModal(true)">退出</li>
                    </ul>
                </div>
                <div class="app-pop" v-show="apppopModal" v-click-outside="hideApppop">
                    <ul>
                        <li @click="enterDefault">标准模式</li>
                        <li @click="enterCustom">自定模式</li>
                        <li @click="enterEdit">编辑模式</li>
                    </ul>
                    <div class="btn-group">
                        <a href="javascript:;" @click="saveCustomLayout">保存</a>
                        <a href="javascript:;" @click="cancelApppop">取消</a>
                    </div>
                </div>
            </div>
        </div>
        <!-- <v-modal v-model="appcenterModal">
          <v-appcenter @on-close="appcenterClose"></v-appcenter>
        </v-modal> -->
    </div>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex'
    import router from '@/router'
    import store from '@/store'
    import vButton from '@/components/Button'
    import searchAPI from '../../API/search'
    import {getCommonSearchAllList} from '@/utils/searchUtil'
    import vAppcenter from '@/components/Appcenter'
    import vModal from '@/components/Modal'
    import api from '@/API/platform'

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform');

    export default {
        components: {
            vButton,
            vAppcenter,
            vModal
        },
        name: 'Header',
        data() {
            return {
                showInfoTips: false,
                showSearchInput: this.showSearch,
                keyWordInput: this.keyWord,
                global: this.$store.state.global,
                setTimeIndex: 0,
                queryBtnInfo: {
                    text: '查询', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
                    styles: {
                        width: '100px',
                        height: '32px',
                        border: 'none',
                        borderRadius: '2px',
                        color: '#111',
                        fontSize: '15px',
                        fontWeight: 'normal',
                        backgroundColor: '#e9cb44',
                        hoverColor: 'none'
                    }, // 此选项可有可无，无则接受type为'default'的样式
                    type: 'default' // 此选项可有可无，默认为'default': 'primary', 'info', 'danger', 'warning', 'success', 'default'
                },
                firstSearchSubmit: true,
                hrefto: '/platform',
                apppopModal: false,
                editbeforeLayout: []
            }
        },
        computed: {
            ...mapGetters([
                'allTown',
                'allTownShip',
                'allVillage',
                'allPolice',
                'allUnit',
                'currentName'
            ]),
            ...mapState([
                'currentTownCode',
                'currentTownShipCode',
                'currentVillageCode',
                'currentPoliceCode',
                'currentUnitId',
                'showSearch',
                'keyWord',
                'policeList'
            ]),
            customLayout: function () {
                return this.$store.state.editmode.customLayout;
            },
            editmodeStatus: function () {
                return this.$store.state.editmode.status;
            }
        },
        created() {
            console.log("header created");
            // 此处需要重新设置code，并且根据code重新获取区县列表/派出所列表/小区列表
            // 如果不这么处理，会出现这种现象：
            // 通过登陆的方式进入首页，显示正常
            // 然后刷新页面，区县下拉列表为空，townList为空，即townList未更新过来
            this.setCurrentCode();
            this.getTown();
            this.getPolice();
            this.getUnit();
            //this.setCurrentCode();
            //this.getCurrentRegion();
        },
        mounted() {
            console.log("header mounted");
        },
        watch: {},
        methods: {
            getCurrentRegion() {  // 获取权限下一级的行政区域列表
                var level = this.global.accountInfo.rolePermission.roleType.level;
                switch (true) {
                    case level < 3:
                        this.getTown(); // 国, 省, 市
                        break;
                    case level === 3:
                        this.getTownShip(); // 区县
                        break;
                    case level === 4:
                        this.getVillage(); // 乡
                        break;
                    case level === 5 || level === 6:
                        this.getUnit(); // 村
                        break;
                }
            },
            showInfoTip: function () {
                this.showInfoTips = true;
            },
            clearHideInfoTip: function () {
                clearTimeout(this.setTimeIndex);
            },
            hideInfoTip: function () {
                this.showInfoTips = false;
            },
            setTimeHideInfoTip: function () {
                var that = this;
                this.setTimeIndex = setTimeout(function () {
                    that.showInfoTips = false;
                }, 1000);
            },
            search() {//全局搜索
                if (this.showSearchInput && !this.keyWordInput) {
                    this.$Message.warning('您输入的检索内容为空，请重新输入！');
                    return;
                }
                let self = this;
                let inputSearch = this.showSearchInput;
                let inputKey = this.keyWordInput;
                //通过firstSearchSubmit 防止用户快速多次提交搜索 引起路由地址错误
                if (this.showSearchInput && this.firstSearchSubmit) {
                    this.firstSearchSubmit = false;
                    let params = {
                        "keywords": this.keyWordInput || "",
                        "pageNo": 1,
                        "pageSize": 5
                    };
                    ////////////////////////
                    searchAPI.getSearchAllList(params,
                        response => {
                            // console.log(response);
                            store.commit('search/updateSearchAllList', []);
                            store.commit('search/updateHighlightAllList', []);
                            store.commit('search/updateSearchAllTotal', 0);

                            if (response !== null && response.data !== null && response.data.code === "0000" && response.data.data !== null && response.data.data.items !== null && response.data.data.items.length > 0) {
                                let searchAllList = response.data.data.items;
                                //处理界面展示数据
                                let allList = getCommonSearchAllList(searchAllList, inputSearch, inputKey);
                                //处理界面展示数据
                                store.commit('search/updateHighlightAllList', allList);
                                store.commit('search/updateSearchAllTotal', response.data.data.totalCount);
                                store.commit("search/setDefaultTab");
                                console.log("有搜索结果");
                                self.toPath('index/search');
                                //处理界面展示数据
                                self.firstSearchSubmit = true;
                            } else {
                                store.commit('search/updateNoResult', true);
                                self.$Message.warning('无检索结果，请确认输入内容是否有误！');
                                self.firstSearchSubmit = true;
                                return;
                            }
                        },
                        error => {
                            self.firstSearchSubmit = false;
                            console.log(error);
                        }
                    );
                    ////////////////////////
                } else {
                    this.showSearchInput = true;
                    this.keyWordInput = this.keyWord;
                }
                this.updateShowSearch(true);
                this.updateKeyWord(this.keyWordInput);
                store.commit("search/setDefaultTab");
                store.commit('search/updateSearchPersonPageIndex', 1);
                store.commit('search/updateSearchCarPageIndex', 1);
                store.commit('search/updateSearchPlacePageIndex', 1);
                store.commit('search/updateSearchAllPageIndex', 1);
            },
            closeSearch() {
                this.showSearchInput = false;
                this.updateShowSearch(false);
            },
            toPath: function (path) {
                router.push(path);
            },
            showApppop() {
                this.apppopModal = true;
            },
            hideApppop() {
                // this.apppopModal = false;
                return false;
            },
            cancelApppop() {
                this.$store.commit('editmode/initCustomLayout', this.editbeforeLayout);
                this.apppopModal = false;
                this.$store.commit('editmode/setStatus', 'default');
            },
            enterDefault() {
                this.$store.commit('editmode/setStatus', 'default');
                this.apppopModal = false;
            },
            enterCustom() {
                this.$store.commit('editmode/setStatus', 'custom');
                this.apppopModal = false;
            },
            enterEdit() {
                this.editbeforeLayout = this.customLayout.concat();
                this.$store.commit('editmode/setStatus', 'editing');
            },
            saveCustomLayout() {
                if (this.editmodeStatus === 'editing') {
                    api.postCustomLayout(this.customLayout).then(res => {
                        const data = res.data;
                        if (data.success === true) {
                            this.$Message.success('保存成功');
                            this.apppopModal = false;
                        }
                    })
                } else {
                    this.cancelApppop()
                }
            },
            ...mapActions([
                'getTown',
                'getTownShip',
                'getVillage',
                'getPolice',
                'getUnit',
                'changeTown',
                'changePolice',
                'changeTownShip',
                'changeVillage',
                'changeUnit',
                'setCurrentCode',
                'clickToPlatform'
            ]),
            ...mapMutations({
                modifyPasswordModal: 'MODIFY_PASSWORD_MODAL',
                modifyUsernameModal: 'MODIFY_USERNAME_MODAL',
                modifyLogoutModal: 'MODIFY_LOGOUT_MODAL',
                updateShowSearch: 'UPDATE_SHOW_SEARCH',
                updateKeyWord: 'UPDATE_KEY_WORD'
            })
        }
    }
</script>

<style scoped lang='scss'>
    .address, .search {
        float: left;
    }

    .search {
        .search-form {
            display: inline-block;
            i {
                display: inline-block;
                position: relative;
                top: 7px;
                width: 21px;
                height: 21px;
                background: url(../../assets/image/zpop-delete-icon.png) no-repeat;
            }
            input {
                vertical-align: middle;
                background-color: transparent !important;
                position: relative;
                top: 2px;
                border: 2px solid #147bbc;
                border-radius: 6px;
                width: 547px;
                height: 39px;
                text-indent: .1em;
                color: #fff;
                font-size: 18px;
                background-color: transparent;
                outline: none;
                &:-ms-input-placeholder {
                    color: #91d7fc;
                    font-size: 16px;
                }
                &::-webkit-input-placeholder {
                    color: #91d7fc;
                    font-size: 16px;
                }
                &::-moz-placeholder {
                    color: #91d7fc;
                    font-size: 16px;
                }
            }
        }
    }

    .header-root {
        color: white;
        /*line-height: 80px;*/
        font-size: 25px;
        height: 90px;
        padding-left: 30px;
        background: url(../../assets/image/header_bg.png) no-repeat;
        .image-show {
            display: inline-block;
            margin-left: 10px;
        }
        .icon-link {
            position: absolute;
            top: 8px;
            right: 5px;
            width: 22px;
            height: 22px;
            //background: url(../../assets/image/icons.png) -176px -91px;
        }
        .icon-link:hover {
            background-position-y: -21px;
        }
        h3 {
            position: relative;
            width: 100%;
            height: 34px;
            line-height: 34px;
            text-align: left;
            span {
                color: #fff;
                font-size: 18px;
                position: absolute;
                top: 8px;
                right: 10px;
            }
            label {
                position: absolute;
                top: 3px;
                right: 6px;
                width: 42px;
                height: 22px;
            }
            .link {
                position: absolute;
                top: 15px;
                /*right: 5px;*/
                width: 22px;
                height: 22px;
                background: url(../../assets/image/icons.png) -176px -91px;
            }
            .link:hover {
                background-position-y: -21px;
            }
        }
        .title {
            line-height: 80px;
            text-shadow: -0 -0 10px #5d9acd;
            font-size: 30px;
        }
        .searchBar {
            z-index: 1;
            position: relative;
            margin-top: 20px;
            float: right;
            height: 90px;
            .v-select {
                width: 165px;
            }
            .icon-editor {
                vertical-align: middle;
                margin: 0 10px;
                cursor: pointer;
            }
            .icon-home {
                vertical-align: middle;
                margin: 0 10px;
                cursor: pointer;
            }
            .icon-search {
                vertical-align: middle;
                margin: 0 10px;
                cursor: pointer;
                margin-left: 20px;
            }
            .icon-user {
                vertical-align: middle;
                margin: 0 10px;
                cursor: pointer;
            }
            .icon-quit {
                vertical-align: middle;
                margin-right: 20px;
                margin-left: 10px;
                cursor: pointer;
            }
            .info-tip {
                font-size: 16px;
                position: absolute;
                width: 250px;
                right: 82px;
                top: 52px;
                background: url(../../assets/image/header-info-tip-bg.png) no-repeat;
                background-size: contain;
                background-size: 100% 100%;
                ul {
                    color: rgba(255, 255, 255, 0.5);
                    padding: 15px 0px 0px 0;
                    list-style: none;
                    .rolename {
                        height: auto;
                        line-height: 30px;
                        padding-bottom: 4px;
                    }
                    .account {
                        div {
                            width: 155px;
                            display: inline-block;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                    }
                    .name {
                        div {
                            width: 185px;
                            display: inline-block;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                    }
                    li {
                        padding: 0 10px;
                        line-height: 36px;
                        box-sizing: border-box;
                        height: 36px;
                        border-radius: 3px;
                        &:hover {
                            background-color: #3c97d4;
                        }
                        .right {
                            display: inline-block;
                            vertical-align: middle;
                            position: relative;
                            left: 6px;
                            width: 18px;
                            height: 18px;
                            background: url(../../assets/image/header-icon-go.png.png) no-repeat;
                        }
                        .edit {
                            cursor: pointer;
                            display: inline-block;
                            vertical-align: middle;
                            position: relative;
                            float: right;
                            top: 8px;
                            width: 18px;
                            height: 18px;
                            background: url(../../assets/image/header-icon-edit.png) no-repeat;
                        }
                        &:nth-child(1) {
                            color: #fff;
                            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                            &:hover {
                                background-color: transparent
                            }
                        }
                        &:nth-child(4) a {
                            color: #ffda2e;
                            cursor: pointer;
                        }
                        &:nth-child(5) {
                            color: #ffda2e;
                            cursor: pointer;
                        }
                        span {
                            cursor: pointer;
                            font-size: 14px;
                            float: right;
                            color: #ffda2e;
                        }
                    }
                }
            }
            .app-pop {
                position: absolute;
                top: 55px;
                right: 108px;
                width: 154px;
                height: 210px;
                background: #1479bd;
                border: 1px solid #84cfff;
                border-radius: 5px;
                &:after {
                    content: "";
                    position: absolute;
                    top: -5px;
                    left: 30px;
                    width: 10px;
                    height: 10px;
                    background: #1479bd;
                    border: 1px solid #84cfff;
                    border-left: 0;
                    border-bottom: 0;
                    transform: rotate(-45deg);
                    z-index: 1;
                }
                ul {
                    position: relative;
                    list-style: none;
                    z-index: 2;
                }
                li {
                    position: relative;
                    height: 50px;
                    line-height: 50px;
                    font-size: 18px;
                    color: #fff;
                    text-align: center;
                    cursor: pointer;
                    &:after {
                        content: "";
                        position: absolute;
                        right: 15px;
                        bottom: 0;
                        left: 15px;
                        height: 1px;
                        background: #2d8ccb;
                    }
                    &:last-of-type:after {
                        display: none;
                    }
                    &:hover {
                        background: #2787c8;
                    }
                }
                .btn-group {
                    text-align: center;
                    font-size: 0;
                    margin-top: 15px;
                    a {
                        display: inline-block;
                        width: 56px;
                        height: 24px;
                        line-height: 24px;
                        font-size: 14px;
                        border: 1px solid #ffda2e;
                        color: #ffda2e;
                        border-radius: 6px;
                        text-align: center;
                        margin-left: 5px;
                        &:first-of-type {
                            background-color: #ffda2e;
                            color: #0b255a;
                            margin-left: 0;
                            margin-right: 5px;
                        }
                    }
                }
            }
        }
    }
</style>
