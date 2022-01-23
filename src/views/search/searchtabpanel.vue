<template>
    <div class="staffdefense">
        <div class="contentPage">
            <Tabs :value="currentTabIndex" class="staff-defense-tab" :style=pStyle @on-click="clickTabPanel">
                <TabPane label="全部" name="0">
                    <search-all></search-all>
                </TabPane>
                <!--<TabPane label="告警" name="1">-->
                <!--<search-alarm></search-alarm>-->
                <!--</TabPane>-->
                <TabPane label="人员" name="2">
                    <search-person></search-person>
                </TabPane>
                <TabPane label="车辆" name="3">
                    <search-car></search-car>
                </TabPane>
                <TabPane label="地点" name="4">
                    <search-place></search-place>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>
<script>
    import TwoHeader from '@/components/section/TwoHeader.vue'
    import vButton from '@/components/Button'
    import vPagination from '@/components/Pagination'
    import Police from '@/views/watch/police'
    import Security from '@/views/watch/security'
    import WatchTeam from '@/views/watch/watchteam'
    import vPasswordModal from '@/components/section/PasswordModal'
    import vUsernameModal from '@/components/section/UsernameModal'
    import vLogoutModal from '@/components/section/LogoutModal'
    import searchPerson from '@/views/search/searchperson'
    import searchCar from '@/views/search/searchcar'
    import searchPlace from '@/views/search/searchplace'
    import searchAll from '@/views/search/searchall'
    import { createNamespacedHelpers } from 'vuex'

    const {
        mapGetters,
        mapState,
        mapMutations,
        mapActions
    } = createNamespacedHelpers('search');

    export default {
        name: 'searchtabpanel',
        components: {
            TwoHeader,
            vButton,
            vPagination,
            Police,
            Security,
            WatchTeam,
            vPasswordModal,
            vUsernameModal,
            vLogoutModal,
            searchPerson,
            searchCar,
            searchPlace,
            searchAll
        },
        data() {
            return {
                totalNum: 100,
                btnSearch: {
                    text: '搜 索'
                },
                columns: [{
                    key: 'photo',
                    title: '照片',
                    render: (h, params) => {
                        return h('img', {
                            attrs: {src: require('../../assets/image/userpic.png'), alt: '暂无图片'},
                            style: {verticalAlign: 'middle'}
                        })
                    }
                },
                    {key: 'name', title: '姓名'},
                    {key: 'sex', title: '性别'},
                    {key: 'company', title: '工作单位'},
                    {key: 'numid', title: '警号'},
                    {key: 'phone', title: '电话'},
                    {key: 'area', title: '分管片区'},
                    {
                        key: 'more',
                        title: '操作',
                        render: (h, params) => {
                            return h('div', [
                                h('i', {
                                    class: 'ivu-icon ivu-icon-edit',
                                    style: {
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        marginRight: '20px'
                                    },
                                    on: {
                                        click: (e) => {
                                        }
                                    }
                                }),
                                h('i', {
                                    class: 'ivu-icon ivu-icon-close',
                                    style: {
                                        fontSize: '20px',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: (e) => {
                                        }
                                    }
                                })
                            ])
                        }
                    }
                ],
                data: [
                    {name: '张树忠', sex: '男', company: '南桥寺', numid: '16160303', phone: '15698856589', area: '冲广坪'},
                    {name: '张树忠', sex: '男', company: '南桥寺', numid: '16160303', phone: '15698856589', area: '冲广坪'},
                    {name: '张树忠', sex: '男', company: '南桥寺', numid: '16160303', phone: '15698856589', area: '冲广坪'},
                    {name: '张树忠', sex: '男', company: '南桥寺', numid: '16160303', phone: '15698856589', area: '冲广坪'},
                    {name: '张树忠', sex: '男', company: '南桥寺', numid: '16160303', phone: '15698856589', area: '冲广坪'},
                    {name: '张树忠', sex: '男', company: '南桥寺', numid: '16160303', phone: '15698856589', area: '冲广坪'},
                    {name: '张树忠', sex: '男', company: '南桥寺', numid: '16160303', phone: '15698856589', area: '冲广坪'},
                    {name: '张树忠', sex: '男', company: '南桥寺', numid: '16160303', phone: '15698856589', area: '冲广坪'},
                    {name: '张树忠', sex: '男', company: '南桥寺', numid: '16160303', phone: '15698856589', area: '冲广坪'},
                    {name: '张树忠', sex: '男', company: '南桥寺', numid: '16160303', phone: '15698856589', area: '冲广坪'}
                ]
            }
        },
        computed: {
            currentTabIndex() {
                return this.$store.state.search.currentTab;
            },
            pStyle: function () {
                let styleModel = {};
                let ua = window.navigator.userAgent;
                if(ua.indexOf(".NET") !== -1){
                    styleModel = {
                        width: "1630px",
                        "margin-left": "-10px"
                    };
                }
                if(ua.indexOf("Firefox") !== -1){
                    styleModel = {
                        width: "1612px"
                    };
                }
                return styleModel;
            },
            ...mapState([
                'currentTab'
            ])
        },
        methods: {
            clickTabPanel: function (tab) {
                this.updateCurrentTab(tab);
                switch (tab){
                    case "0":
                        this.getSearchAllList();
                        break;
                    case "2":
                        this.getSearchPersonList();
                        break;
                    case "3":
                        this.getSearchCarList();
                        break;
                    case "4":
                        this.getSearchPlaceList();
                        break;
                    default:
                        this.getSearchAllList();
                        break;
                }
            },
            ...mapMutations([
                'updateCurrentTab'
            ]),
            ...mapActions([
                'updateUserId',
                'getSearchPersonList',
                'getSearchCarList',
                'getSearchPlaceList',
                'getSearchAllList'
            ])
        }
    }
</script>
<style lang="scss" scoped>
    .staffdefense {
        width: 1820px;
        height: 1080px;
        position: relative;
        .contentPage {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            overflow-x: hidden;
            overflow-y: auto;
            padding: 15px 15px;
        }
        .contentPage::-webkit-scrollbar {
            display: none;
        }
    }

    .type-category {
        width: 100%;
        li {
            float: left;
            padding: 14px 40px 10px 40px;
            cursor: pointer;
            color: #1cb1ff;
            font-size: 18px;
            font-weight: bold;
        }
        .type-category-active {
            color: #fff;
            background: rgba(15, 145, 255, .2);
            border-top: 4px solid #1cb1ff;
            padding-top: 10px;
        }
    }

    .clearfix {
        clear: both;
    }

    .main-content {
        padding: 20px 40px;
        background: rgba(15, 145, 255, .2);
        .search-container {
            width: 100%;
            height: 48px;
            margin-bottom: 20px;
            color: #3fa7ff;
            font-size: 18px;
            display: flex;
            align-items: center;
            .v-select {
                width: 160px;
                margin-right: 30px;
            }
            .v-btn {
                margin-left: 50px;
            }
            .addstaff {
                display: inline-flex;
                flex: 1;
                justify-content: flex-end;
                img {
                    cursor: pointer;
                }
            }
        }
    }

    .table-detail {
        margin-bottom: 20px;
        padding: 5px 5px;
        position: relative;
        border-top: 1px solid #009dff;
        border-bottom: 1px solid #009dff;
        .left-top1 {
            width: 10px;
            height: 5px;
            position: absolute;
            top: -3px;
            left: 0;
            background-color: #1cb1ff;
        }
        .left-top2 {
            width: 5px;
            height: 10px;
            position: absolute;
            top: 0;
            left: 0;
            background-color: #1cb1ff;
        }
        .right-top1 {
            width: 10px;
            height: 5px;
            position: absolute;
            top: -3px;
            right: 0;
            background-color: #1cb1ff;
        }
        .right-top2 {
            width: 5px;
            height: 10px;
            position: absolute;
            top: 0;
            right: 0;
            background-color: #1cb1ff;
        }
        .left-bottom1 {
            width: 10px;
            height: 5px;
            position: absolute;
            bottom: -3px;
            left: 0;
            background-color: #1cb1ff;
        }
        .left-bottom2 {
            width: 5px;
            height: 10px;
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: #1cb1ff;
        }
        .right-bottom1 {
            width: 10px;
            height: 5px;
            position: absolute;
            bottom: -3px;
            right: 0;
            background-color: #1cb1ff;
        }
        .right-bottom2 {
            width: 5px;
            height: 10px;
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: #1cb1ff;
        }
        .detail-container {
            background: linear-gradient(0deg, rgba(0, 165, 255, .2), rgba(23, 87, 166, .2));
            padding: 20px 120px;
            .collape-list {
                width: 100%;
                color: #fff;
                font-size: 18px;
                display: flex;
                flex-wrap: wrap;
                border-left: 2px solid #125f9d;
                border-top: 2px solid #125f9d;
                margin-top: 10px;
                .collape-list-itemodd {
                    background-color: rgba(12, 62, 130, .5);
                    width: 18%;
                    padding: 15px 0;
                    border-right: 2px solid #125f9d;
                    border-bottom: 2px solid #125f9d;
                    text-align: center;
                }
                .collape-list-itemeven {
                    background-color: rgba(12, 62, 130, .5);
                    width: 32%;
                    padding: 15px 0;
                    border-right: 2px solid #125f9d;
                    border-bottom: 2px solid #125f9d;
                    text-align: center;
                }
                .collape-list-empty {
                    background-color: transparent;
                    color: #1cb1ff;
                }
            }
        }
    }

    .page-container {
        text-align: center;
        padding-top: 20px;
    }
</style>