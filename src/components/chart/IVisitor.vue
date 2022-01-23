<template>
    <div class="container">
        <v-panel title='访客数据' class='v-panel panel-mb' :style=pStyle>
            <div class="content">
                <div class="safety-search">
                    <div class="date-select">
                        <label>时间</label>
                        <div class="date-select-input">
                            <DatePicker type="daterange" confirm style="width: 283px;" format="yyyy-MM-dd"
                                        :value="maptime" :transfer="true" @on-change="changeMap">
                            </DatePicker>
                        </div>
                    </div>
                    <div>
                        <h3>
                            <router-link :to="hrefto" class="link"></router-link>
                        </h3>
                    </div>
                </div>
                <div class="table">
                    <Table tableType="border" class='border-table' :columns="columns" :data="lists" highlight-row></Table>
                </div>
            </div>
        </v-panel>

    </div>
</template>

<script>
    const {mapState, mapMutations, mapActions} = createNamespacedHelpers('special');

    import {createNamespacedHelpers} from 'vuex'
    import router from '@/router'
    import vButton from '@/components/Button'
    import vPagination from '@/components/Pagination'
    import vPanel from '@/components/Panel'
    import Notify from '@/components/Notify'
    import {imgServerAddr} from '@/config'
    import $ from 'jquery'

    export default {
        name: 'IVisitor',
        components: {
            vButton,
            vPagination,
            vPanel,
            Notify
        },
        data() {
            return {
                btnInfo: {
                    text: '查询', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
                    styles: {
                        width: '100px',
                        height: '32px',
                        border: 'none',
                        borderRadius: '2px',
                        color: '#111',
                        fontSize: '16px',
                        fontWeight: 'normal',
                        backgroundColor: '#e9cb44',
                        hoverColor: 'none'
                    }, // 此选项可有可无，无则接受type为'default'的样式
                    type: 'default' // 此选项可有可无，默认为'default': 'primary', 'info', 'danger', 'warning', 'success', 'default'
                },
                columns: [
                    {key: 'date', title: '日期'},
                    {key: 'time', title: '时间'},
                    {key: 'name', title: '姓名'},
                    {key: 'telephone', title: '电话'},
                    {key: 'id_code', title: '身份证号码'},
                    {key: 'door_place', title: '门禁'},
                    {key: 'open_door', title: '开门方式'},
                    {
                        key: 'pic',
                        title: '抓拍图像',
                        coltype: 'photo',
                        render: (h, params) => {
                            return h('div', [
                                h('Img', {
                                    attrs: {
                                        // src:imgAddr + '/' + params.row.photo + '?p=0'
                                        src: params.row.photo ? params.row.photo : require("../../assets/image/userpic.png")
                                    },
                                    style: {
                                        width: '60px',
                                        height: '60px',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params);
                                        }
                                    }
                                }),
                            ]);
                        }
                    }
                ],
                lists: [{
                    "date": "xxx",
                    "time": "xxx",
                    "name": "xxx",
                    "telephone": "xxx",
                    "id_code": "xxx",
                    "door_place": "xxx",
                    "open_door": "xxx",
                    "pic": "xxx",
                    "video": "xxx"
                }, {
                    "date": "xxx",
                    "time": "xxx",
                    "name": "xxx",
                    "telephone": "xxx",
                    "id_code": "xxx",
                    "door_place": "xxx",
                    "open_door": "xxx",
                    "pic": "xxx",
                    "video": "xxx"
                }, {
                    "date": "xxx",
                    "time": "xxx",
                    "name": "xxx",
                    "telephone": "xxx",
                    "id_code": "xxx",
                    "door_place": "xxx",
                    "open_door": "xxx",
                    "pic": "xxx",
                    "video": "xxx"
                }, {
                    "date": "xxx",
                    "time": "xxx",
                    "name": "xxx",
                    "telephone": "xxx",
                    "id_code": "xxx",
                    "door_place": "xxx",
                    "open_door": "xxx",
                    "pic": "xxx",
                    "video": "xxx"
                }, {
                    "date": "xxx",
                    "time": "xxx",
                    "name": "xxx",
                    "telephone": "xxx",
                    "id_code": "xxx",
                    "door_place": "xxx",
                    "open_door": "xxx",
                    "pic": "xxx",
                    "video": "xxx"
                }, {
                    "date": "xxx",
                    "time": "xxx",
                    "name": "xxx",
                    "telephone": "xxx",
                    "id_code": "xxx",
                    "door_place": "xxx",
                    "open_door": "xxx",
                    "pic": "xxx",
                    "video": "xxx"
                }],
                lists: [],
                maptime: '',
                hrefto: '/allvisitor'
            }
        },
        methods: {
            toPage(currentPage) {
                this.getLists({pageNo: currentPage})
            },
            toUserInfo: function (userId) {
                if (!userId) {
                    this.updateNotify('系统中暂无该人员信息！');
                    this.mshowNotify();
                    setTimeout(() => {
                        this.mshowNotify();
                    }, 2000);
                    return
                }
                this.updateUserId(userId);
                router.push({
                    path: '/userInfo'
                })
            },
            changeMap: function () {

            },
            ...mapMutations([
                'mshowDel',
                'mshowAdd',
                'mshowNotify',
                'mshowUpdate',
                'updateNotify',
                'updateSelectedUser',
                'updateAddErr',
                'updatePersonnelType',
                'updatePersonnelCategory',
                'updateSelectedUserList',
                'updateCheckResult',
                'clearTownSelect2'
            ]),
            ...mapActions([
                'getLists',
                'query',
                'export',
                'updateUserId',
                'checkResult',
                'getCountry',
                'getCommunity',
                'getUnit'
            ])
        },
        computed: {
            pStyle: function () {
                let pw = "1870px";
                let ua = window.navigator.userAgent;
                if(ua.indexOf(".NET") !== -1 || ua.indexOf("Firefox") !== -1){
                    pw = "1863px";
                }
                return {
                    width: pw,
                    height: "100%"
                };
            },
            ...mapState([])
        },
        mounted() {
            $('.ivu-input').css("height", "35px");
            $('.ivu-input').css("background-color", "transparent");
            $('.ivu-input').css("border", "1px solid #1cb1ff");
            $('.ivu-input').css("color", "#fff");
            $('.ivu-input').css("font-size", "15px");
            $('.ivu-date-picker').css("top", "2px");
            $('.ivu-date-picker .ivu-input-icon').css("top", "-3px");
            $('.ivu-date-picker .ivu-input').css("border-radius", "4px");
            $('.ivu-date-picker .ivu-select-dropdown').css("top", "32px");
        }
    }
</script>

<style lang='scss' scoped>
    $textPrimary: #45c1fb;
    $textSecondary: #f1f1f1;
    .container {
        background-size: 100% 100%;
        width: 100%;
        margin-bottom: 20px;
        .panel-mb {
            margin-bottom: 20px;
            padding-bottom: 13px;
        }
        .content {
            width: 1810px;
            margin: auto;
            margin-top: 30px;
            font-size: 18px;
            .query {
                color: $textPrimary;
                div {
                    display: inline-block;
                    margin-right: 24px;
                }
                .query_opt {
                    float: right;
                }
                input {
                    height: 40px;
                    border-radius: 2px;
                    background-color: #0e366d;
                    border: 1px solid #1a9ee8;
                    width: 100px;
                    color: #fff;
                    padding-left: 3px;
                }
                .query_ages {
                    input {
                        width: 50px;
                    }
                }
                .query_code {
                    input {
                        width: 200px;
                    }
                }
                .query_phone {
                    input {
                        width: 144px;
                    }
                }
                .query_phone {
                    input {
                        width: 140px;
                    }
                }
                .query_room {
                    input {
                        width: 140px;
                    }
                }
                .query_opt {
                    margin-right: 0px;
                    img {
                        cursor: pointer;
                    }
                }

            }
            .safety-search {
                width: 100%;
                margin-left: 3px;
                display: inline-flex;
                justify-content: space-between;
                align-items: center;

                display: -ms-inline-flexbox;
                -ms-flex-pack: justify;
                -ms-flex-align: center;

                padding: 0px 0px;
                line-height: 32px;
                font-size: 14px;
                label {
                    font-size: 16px;
                    color: #1cb1ff;
                    line-height: 16px;
                    font-weight: bold;
                    margin-right: 10px;
                }
                .date-select {
                    display: inline-block;
                    margin-right: 20px;
                    .date-select-input {
                        display: inline-block;
                        position: relative;
                    }
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
                        top: 6px;
                        right: 5px;
                        width: 62px;
                        height: 22px;
                        background: url(../../assets/image/more_hover.png) 62px;
                        background-size: 96% 92%;
                    }
                    .link:hover {
                        position: absolute;
                        top: 6px;
                        right: 5px;
                        width: 62px;
                        height: 22px;
                        background: url(../../assets/image/more.png) 62px;
                        background-size: 96% 92%;
                    }
                }
            }
            .table {
                width: 100%;
                margin-top: 30px;
                margin-bottom: 20px;
                position: relative;
            }
            .page {
                text-align: center;
                margin-bottom: 20px;
            }
        }

    }
</style>