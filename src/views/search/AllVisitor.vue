<template>
    <div class="container">
        <TwoHeader title="访客数据"></TwoHeader>
        <v-panel title='访客数据' class='v-panel panel-mg' style="width: 1860px;">
            <div class="content">
                <div class="content-center">
                    <div class="safety-search">
                        <div class="query_name">
                            <span class="font-style">姓名：</span>
                            <input type="text" maxlength="10">
                            <div class="date-select">
                                <span class="font-style">时间：</span>
                                <div class="date-select-input" id="date-picker">
                                    <DatePicker type="daterange" confirm style="width: 360px;" placeholder="选择时间" format="yyyy-MM-dd HH:mm:ss"
                                                :value="maptime" :transfer="true" @on-change="changeMap" >
                                    </DatePicker>
                                </div>
                                <v-Button :btnInfo='queryBtnInfo' class="btnCls"></v-Button>
                                <!--<v-Button :btnInfo='picBtnInfo' class="btnCls"></v-Button>-->
                            </div>
                        </div>
                        <div class="query_opt">
                            <!--<img src="../../assets/image/special/icon/daochu.png" alt="" title="导出">-->
                        </div>
                    </div>
                </div>
                <div class="table-pd">
                    <div class="table table-mg" style="width: 1820px;">
                        <Table tableType="border" class='border-table' :columns="columns" :data="lists" highlight-row></Table>
                    </div>
                    <div class="page">
                        <v-pagination :total=0 :pageIndex=1 :pageSize=8 @toPage='toPage'></v-pagination>
                    </div>
                </div>
            </div>
        </v-panel>
    </div>
</template>

<script>
    import TwoHeader from '@/components/section/TwoHeader.vue'
    import $ from 'jquery'
    import {createNamespacedHelpers} from 'vuex'

    const {mapState, mapMutations, mapActions} = createNamespacedHelpers('search');
    import router from '@/router'
    import vButton from '@/components/Button'
    import vPagination from '@/components/Pagination'
    import vPanel from '@/components/Panel'
    import Notify from '@/components/Notify'
    import {imgServerAddr} from '@/config'

    export default {
        name: 'AllVisitor',
        components: {
            TwoHeader,
            vButton,
            vPagination,
            vPanel,
            Notify
        },
        data() {
            return {
                queryBtnInfo: {
                    text: '查询', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
                    styles: {
                        width: '100px',
                        height: '34px',
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
                picBtnInfo: {
                    text: '图像检索', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
                    styles: {
                        width: '100px',
                        height: '34px',
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
                hrefto: '/index/special'
            }
        },
        methods: {
            toPage(currentPage) {
                this.getLists({pageNo: currentPage});
            },
            toUserInfo: function (userId) {
                if (!userId) {
                    this.updateNotify('系统中暂无该人员信息！');
                    this.mshowNotify();
                    setTimeout(() => {
                        this.mshowNotify()
                    }, 2000);
                    return;
                }
                this.updateUserId(userId);
                router.push({
                    path: '/userInfo'
                });
            },
            changeMap: function () {

            },
            ...mapMutations([
            ]),
            ...mapActions([
            ])
        },
        computed: {
            ...mapState([])
        },
        mounted() {
            $('.ivu-select-dropdown.ivu-date-picker-transfer').css("font-size", "15px");
            $('.ivu-input').css("height", "34px");
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
        /*解决点击时间输入框 文字抖动的问题*/
        transform: translateZ(0);
        background: url(../../assets/image/appBg.jpg) no-repeat;
        width: 1920px;
        height: 1080px;
        margin-bottom: 20px;
        overflow: hidden;
        .panel-mg {
            margin: 30px auto;
        }
        .content {
            margin-top: 20px;
            font-size: 18px;
            .table-pd {
                padding-bottom: 20px;
                padding-top: 2px;
                .table-mg {
                    margin: 20px auto;
                }
            }
            .content-center {
                text-align: center;
            }
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
                    height: 34px;
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
            .query_opt {
                margin-right: 0px;
                img {
                    margin-bottom: -5px;
                    cursor: pointer;
                }
            }
            .query_name {
                .font-style {
                    color: #45c1fb;
                    font-size: 17px;
                }
                .ml {
                    margin-left: 10px;
                }
                input {
                    height: 34px;
                    border-radius: 2px;
                    background-color: #0e366d;
                    border: 1px solid #1a9ee8;
                    font-size: 18px;
                    width: 170px;
                    color: #fff;
                    padding-left: 3px;
                }
            }
            .safety-search {
                width: 1806px;
                display: inline-flex;
                justify-content: space-between;
                align-items: center;

                display: -ms-inline-flexbox;
                -ms-flex-pack: justify;
                -ms-flex-align: center;

                padding: 0px 0px;
                line-height: 32px;
                font-size: 14px;
                margin-top: 0px;
                .query_opt {
                    margin-right: 0px;
                    img {
                        position: relative;
                        top: 5px;
                        right: -7px;
                        cursor: pointer;
                    }
                }
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
                    font-size: 18px;
                    .font-style {
                        color: #45c1fb;
                        margin-left: 10px;
                        font-size: 17px;
                    }
                    .date-select-input {
                        display: inline-block;
                        position: relative;
                    }
                }
                .btnCls {
                    position: relative;
                    top: 1px;
                    margin-right: 1px;
                    margin-left: 10px;
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
                        top: 8px;
                        right: 5px;
                        width: 22px;
                        height: 22px;
                        background: url(../../assets/image/icons.png) -176px -91px;
                    }
                    .link:hover {
                        background-position-y: -21px;
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
            }
        }

    }
</style>