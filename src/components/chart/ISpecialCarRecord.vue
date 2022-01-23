<template>
    <div class="container">
        <v-panel title='车行轨迹' class='v-panel' style="width: 1862px; padding-bottom: 1px;">
            <div class="content">
                <div class="query">
                    <div class="date-select">
                        <label>时间</label>
                        <div class="date-select-input">
                            <DatePicker type="daterange" confirm style="width: 360px;" placeholder="选择时间"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        :value="maptime" :transfer="true" @on-change="changeTime">
                            </DatePicker>
                        </div>
                    </div>
                    <v-Button :btnInfo='btnInfo' class="btnCls" :style=pStyle @click='getSpecialCarRecordByBtn'></v-Button>
                </div>
                <div class="table">
                    <Table class="border-table table-width" :columns="carcol" :data="cardata"></Table>
                </div>
                <div class='page'>
                    <v-pagination :pageSize=5 :total="specialCarRecordtotalCount" :pageIndex="specialCarRecordPageIndex"
                                  @toPage="toPage">
                    </v-pagination>
                </div>
            </div>
        </v-panel>

    </div>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex'
    import router from '@/router'
    import vButton from '@/components/Button'
    import vPagination from '@/components/Pagination'
    import vPanel from '@/components/Panel'
    import Notify from '@/components/Notify'
    import {imgServerAddr} from '@/config'
    import {province_code as provinceCode, city_code as cityCode} from '@/config'
    import axios from '@/utils/http.js'
    import $ from 'jquery'

    const {mapState, mapMutations, mapActions} = createNamespacedHelpers('search');

    export default {
        name: 'ISpecialCarRecord',
        components: {
            vButton,
            vPagination,
            vPanel,
            Notify
        },
        props: {
            plateNum: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                btnInfo: {
                    text: '查询', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
                    styles: {
                        width: '100px',
                        height: '34px',
                        border: 'none',
                        borderRadius: '2px',
                        color: '#111',
                        fontSize: '16px',
                        fontWeight: 'normal',
                        backgroundColor: '#e9cb44',
                        hoverColor: 'none',
                    }, // 此选项可有可无，无则接受type为'default'的样式
                    type: 'default' // 此选项可有可无，默认为'default': 'primary', 'info', 'danger', 'warning', 'success', 'default'
                },
                carcol: [{
                        key: 'io_time',
                        title: '时间',
                        width: 275,
                        render: (h, params) => {
                            let date = new Date(params.row.io_time);
                            let nowtime = date.getFullYear() + '/';
                            nowtime += (date.getMonth() >= 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '/';
                            nowtime += (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()) + '\n';
                            nowtime += (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()) + ':';
                            nowtime += (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()) + ':';
                            nowtime += date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds();
                            return h('span', nowtime);
                        }
                    },
                    {
                        key: 'user_name',
                        title: '姓名',
                        width: 275,
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {title: params.row.user_name}
                            }, params.row.user_name)
                        }
                    },
                    {key: 'plate_num_cn', title: '车牌', width: 245},
                    {
                        key: 'unit_name',
                        title: '小区',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {title: params.row.unit_name}
                            }, params.row.unit_name)
                        }
                    },
                    {
                        key: 'park_name',
                        title: '车场',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {title: params.row.park_name}
                            }, params.row.park_name)
                        }
                    },
                    {
                        key: 'io_type',
                        title: '通行情况',
                        width: 168,
                        render: (h, params) => {
                            return h('span', params.row.io_type == 0 ? '进场' : '出场');
                        }
                    },
                    {
                        key: 'io_picture_path',
                        title: '抓拍图片',
                        width: 168,
                        render: (h, params) => {
                            return h('img', {
                                attrs: {src: params.row.picurl || ""},
                                style: {
                                    verticalAlign: 'middle',
                                    width: '38px',
                                    height: '38px'
                                },
                                on: {
                                    error: (e) => {
                                        $(e.target).attr('src', require('../../assets/image/search_default_s.png'));
                                    }
                                }
                            })
                        }
                    }
                ],
                cardata: [],
                maptime: "",
                currentProvince: '',
                currentCity: '',
                currentTown: 'all',
                currentTownShip: 'all',
                currentVillage: 'all',
                currentUnit: 'all',
                params: ""
            }
        },
        computed: {
            pStyle: function () {
                let styleModel = {};
                let ua = window.navigator.userAgent;
                if(ua.indexOf(".NET") !== -1){
                    styleModel = {
                        position: "relative",
                        top: "0px"
                    };
                }
                return styleModel;
            },
            ...mapState([
                'specialCarRecordPageIndex',
                'specialCarRecordtotalCount',
                'specialPlateNum'
            ])
        },
        methods: {
            getDefaultValue: function () {
                // 从首页获取区县、乡镇、居委会、小区信息
                this.currentProvince = this.$store.state.global.accountInfo.rolePermission.province_code;
                this.currentCity = this.$store.state.global.accountInfo.rolePermission.city_code;
                if (!this.currentProvince) {
                    this.currentProvince = provinceCode;
                }
                if (!this.currentCity) {
                    this.currentCity = cityCode;
                }
                this.currentTown = this.$store.state.platform.currentTownCode;
                this.currentTownShip = this.$store.state.platform.currentTownShipCode;
                this.currentVillage = this.$store.state.platform.currentVillageCode;
                this.currentUnit = this.$store.state.platform.currentUnitId;

                let rolePermission = this.$store.state.global.accountInfo.rolePermission;
                if (rolePermission.town_code && rolePermission.town_code !== '') {
                    this.townList = [{town_code: rolePermission.town_code, town_name: rolePermission.town_name}];
                    this.currentTown = rolePermission.town_code;
                }
                if (rolePermission.township_code && rolePermission.township_code !== '') {
                    this.townShipList = [{
                        township_code: rolePermission.township_code,
                        township_name: rolePermission.township
                    }];
                    this.currentTownShip = rolePermission.township_code;
                }
                if (rolePermission.village_code && rolePermission.village_code !== '') {
                    this.villageList = [{
                        village_code: rolePermission.village_code,
                        village_name: rolePermission.village_name
                    }];
                    this.currentVillage = rolePermission.village_code;
                }
                if (this.$store.state.global.accountInfo.rolePermission.roleType.level == 6) {
                    let tmparr = []
                    if (this.$store.state.global.accountInfo.rolePermission.permiscodes) {
                        this.currentUnit = this.$store.state.global.accountInfo.rolePermission.permiscodes;
                    } else {
                        this.currentUnit = this.$store.state.global.accountInfo.rolePermission.permiscodeSet[0];
                    }
                }
                // 获取数据
                this.params = '?province_code=' + this.currentProvince + '&city_code=' + this.currentCity;
                this.params += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown);
                this.params += '&township_code=' + (this.currentTownShip == 'all' ? '' : this.currentTownShip);
                this.params += '&village_code=' + (this.currentVillage == 'all' ? '' : this.currentVillage);
                this.params += '&unit_id=' + (this.currentUnit == 'all' ? '' : this.currentUnit);
            },
            // 获取今日车流量列表数据
            getCarRecord: function () {
                let requestUrl = '/car/record.do' + this.params + '&pageNo=' + this.specialCarRecordPageIndex + '&pageSize=5';
                if (this.maptime) {
                    requestUrl = '/car/record.do' + this.params + '&pageNo=' + this.specialCarRecordPageIndex + '&pageSize=5&start_time=' + this.maptime[0] + "&end_time=" + this.maptime[1];
                }
                if (this.plateNum) {
                    requestUrl += ("&plateNum=" + this.specialPlateNum);
                }
                axios.get(requestUrl, {}).then(response => {
                    this.cardata = response.data.items;
                    this.updateSpecialCarRecordtotalCount(response.data.totalCount);
                }).catch(err => {
                    console.log('获取今日车流量列表数据失败');
                })
            },
            toPage(currentPage) {
                this.updateSpeacilCarRecordPageIndex(currentPage);
                this.getCarRecord();
            },
            // 选择车流数据过滤时间
            changeTime: function (value) {
                console.log("maptime: " + this.maptime);
                console.log("select time: " + value);
                this.maptime = "";
                if (value && value[0] && value[1] && new Date(value[1]).getTime() - new Date(value[0]).getTime() > 0) {
                    this.maptime = value;
                    console.log("select start time: " + value[0]);
                    console.log("select end time: " + value[1]);
                }
            },
            getSpecialCarRecordByBtn() {
                this.getDefaultValue();
                this.updateSpeacilCarRecordPageIndex(1);
                this.getCarRecord();
            },
            ...mapMutations([
                'updateSpeacilCarRecordPageIndex',
                'updateSpecialCarRecordtotalCount'
            ]),
            ...mapActions([])
        },
        mounted() {
            $('.ivu-select-dropdown.ivu-date-picker-transfer').css("font-size", "15px");
            $('.ivu-input').css("height", "34px");
            $('.ivu-input').css("background-color", "transparent");
            $('.ivu-input').css("border", "1px solid #1cb1ff");
            $('.ivu-input').css("color", "#fff");
            $('.ivu-input').css("font-size", "15px");
            this.getDefaultValue();
            this.getCarRecord();
        }
    }
</script>

<style lang='scss' scoped>
    $textPrimary: #45c1fb;
    $textSecondary: #f1f1f1;
    .container {
        /*解决点击时间输入框 文字抖动的问题*/
        transform: translateZ(0);
        /*background-size: 100% 100%;*/
        width: 100%;
        margin-bottom: 20px;
        .content {
            width: 1810px;
            /*mergin-top: 30px;*/
            margin: 30px auto auto auto;
            font-size: 18px;
            .query {
                text-align: right;
                margin-right: 0;
                .date-select {
                    display: inline-block;
                    font-size: 18px;
                    label {
                        color: $textPrimary;
                        font-size: 16px;
                    }
                    .date-select-input {
                        display: inline-block;
                        position: relative;
                        margin-left: 10px;
                        margin-right: 10px;
                    }
                }
                .btnCls {
                    position: relative;
                    top: 1px;
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
            }
            .table {
                width: 100%;
                margin-top: 30px;
                margin-bottom: 30px;
                position: relative;
            }
            .page {
                text-align: center;
                margin-bottom: 30px;
            }
        }

    }
</style>