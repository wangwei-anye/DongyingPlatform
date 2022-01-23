<template>
    <!-- 实时人流量 -->
    <div class="trip-manflow">
        <TwoHeader title="门禁数据"></TwoHeader>
        <div class="chart-data">
            <!-- 图表 -->
            <div class="manflow-chart-wrap">
                <v-panel title='门禁数据' class='v-panel panel-mt-chart' style="width: 1860px;">
                    <div class="manflow-chart">
                        <div class="manflow-photo">
                            <div class="manflow-kaimen">
                                <img src="../../assets/image/kaimen.png"/>
                                <b>开门次数</b>
                                <label>{{ doorcount }}</label>
                            </div>
                        </div>
                        <div class="manflow-tool-chart">
                            <div class="manflow-tool">
                                <v-Label switchAble class="label" :activeIndex="manindex" :tabArr="tabArr"
                                         @switchTabIndex="selectDoor"></v-Label>
                            </div>
                            <div class="manflow-chart" id="manflow-chart4"></div>
                        </div>
                    </div>
                </v-panel>
            </div>
            <!-- 表格 -->
            <div class="manflow-data">
                <v-panel title='门禁数据列表' class='v-panel panel-mt' style="width: 1860px;">
                    <div class="content-center">
                        <div class="safety-search">
                            <div class="query_name">
                                <span class="font-style">用户名：</span>
                                <input type="text" maxlength="10" v-model="userName">
                                <div class="date-select">
                                    <span class="font-style">时间：</span>
                                    <div class="date-select-input" id="date-picker">
                                        <DatePicker type="daterange" confirm style="width: 360px;" placeholder="选择时间"
                                                    format="yyyy-MM-dd HH:mm:ss"
                                                    :value="maptime" :transfer="true" @on-change="changeTime">
                                        </DatePicker>
                                    </div>
                                    <v-Button :btnInfo='queryBtnInfo' class="btnCls"
                                              @click="getDoorRecordByBtn"></v-Button>
                                    <!--<v-Button :btnInfo='picBtnInfo' class="btnCls"></v-Button>-->
                                </div>
                            </div>
                            <div class="query_opt">
                                <!--<img src="../../assets/image/special/icon/daochu.png" alt="" title="导出">-->
                            </div>
                        </div>
                    </div>
                    <div class="table-pb">
                        <Table class="border-table table-width" :columns="doorcol" :data="doordata"></Table>
                        <div class='page'>
                            <v-pagination :pageSize=5 :total="allDoorRecordtotalCount"
                                          :pageIndex="allDoorRecordPageIndex" @toPage="toPage">
                            </v-pagination>
                        </div>
                    </div>
                </v-panel>
            </div>
        </div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import $ from 'jquery'
    import TwoHeader from '@/components/section/TwoHeader.vue'
    import vLabel from '@/components/Label'
    import vRectLabel from '@/components/RectLabel'
    import vPanel from '@/components/Panel'
    import vButton from '@/components/Button'
    import vPagination from '@/components/Pagination'
    import axios from '@/utils/http.js'
    import {createNamespacedHelpers} from 'vuex'
    import {millisec_to_Date} from '@/utils/util'
    import {province_code as provinceCode, city_code as cityCode} from '@/config'

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('search');

    export default {
        name: 'AllDoorRecord',
        components: {
            TwoHeader,
            vLabel,
            vPanel,
            vRectLabel,
            vButton,
            vPagination
        },
        data() {
            return {
                defaultPath: require('../../assets/image/alarm/arrow-down.png'),
                userName: '',
                RectStyleType: 'lineStyle',
                doorcount: '',
                manindex: 0,
                tabArr: ['实时', '周', '月'],
                mantimeindex: 0,
                tabTimeArr: ['昨天', '最近7天', '最近30天', '最近半年'],
                currentProvince: '',
                currentCity: '',
                currentTown: 'all',
                currentTownShip: 'all',
                currentVillage: 'all',
                currentUnit: 'all',
                params: '',
                doorgroup: 0,
                chart4: null,
                maptime: "",
                queryBtnInfo: {
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
                        hoverColor: 'none'
                    }, // 此选项可有可无，无则接受type为'default'的样式
                    type: 'default' // 此选项可有可无，默认为'default': 'primary', 'info', 'danger', 'warning', 'success', 'default'
                },
                picBtnInfo: {
                    text: '图像检索', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
                    styles: {
                        width: '100px',
                        height: '33px',
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
                doorcol: [{
                        key: 'start_time',
                        title: '时间',
                        width: 315,
                        render: (h, params) => {
                            let date = new Date(params.row.start_time);
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
                        title: '用户名',
                        width: 315,
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {title: params.row.user_name}
                            }, params.row.user_name)
                        }
                    },
                    {
                        key: 'unit_name',
                        title: '小区',
                        //width: 300,
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {title: params.row.unit_name}
                            }, params.row.unit_name)
                        },
                        //renderHeader: this.unitList
                    },
                    {
                        key: 'door_name',
                        title: '门禁ID',
                        width: 355,
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {title: params.row.door_name}
                            }, params.row.door_name);
                        }
                    },
                    {
                        key: 'open_door',
                        title: '开门方式',
                        width: 295,
                        ellipsis: true,
                        render: (h, params) => {
                            let tmpstr = '';
                            if (params.row.open_door == 1) {
                                tmpstr = '一键开门';
                            } else if (params.row.open_door == 2) {
                                tmpstr = '自动开门';
                            } else if (params.row.open_door == 3) {
                                tmpstr = '亮屏开门';
                            } else if (params.row.open_door == 4) {
                                tmpstr = '摇一摇开门';
                            } else if (params.row.open_door == 5) {
                                tmpstr = '人脸识别开门';
                            } else if (params.row.open_door == 9) {
                                tmpstr = '按键开门';
                            } else if (params.row.open_door == 10) {
                                tmpstr = '手机蓝牙开门';
                            } else if (params.row.open_door == 11) {
                                tmpstr = '手机NFC开门';
                            } else if (params.row.open_door == 12) {
                                tmpstr = '手机WIFI开门';
                            } else if (params.row.open_door == 13) {
                                tmpstr = '刷IC卡开门';
                            } else if (params.row.open_door == 15) {
                                tmpstr = '身份证开门';
                            } else if (params.row.open_door == 21) {
                                tmpstr = '密码开门';
                            } else if (params.row.open_door == 22) {
                                tmpstr = '呼叫远程开门';
                            } else {
                                tmpstr = '';
                            }
                            return h('span', {
                                attrs: {title: tmpstr}
                            }, tmpstr);
                        },
                        renderHeader: this.openDoorTypeList
                    },
                    /*{
                        key: 'open_status',
                        title: '开门情况',
                        width: 128,
                        render: (h, params) => {
                            if (params.row.open_status > 5) {
                                return h('span', '成功')
                            } else {
                                return h('span', {
                                    style: {color: '#ff4f4f'}
                                }, '失败')
                            }
                        }
                    },*/
                    {
                        key: 'picurl',
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
                doordata: [],
                hrefto: '/index/trip'
            }
        },
        methods: {
            initManFlowChart: function () {
                // 人流量面积图
                this.chart4 = echarts.init(document.getElementById('manflow-chart4'));
                this.chart4.setOption({
                    title: {
                        text: '人流量',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        },
                        left: 20
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '时间：{b}<br/>流量：{c0}',
                        axisPointer: {
                            type: 'line',
                            lineStyle: {
                                color: '#db6c45'
                            }
                        },
                        backgroundColor: '#db6c45'
                    },
                    grid: {
                        left: 15,
                        right: 30,
                        top: 40,
                        bottom: 0,
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        axisTick: {show: false},
                        boundaryGap: false,
                        axisLine: {
                            lineStyle: {
                                color: '#fff',
                                width: 2
                            }
                        },
                        axisLabel: {
                            fontSize: 18,
                            color: '#fff'
                        },
                        data: []
                    }],
                    yAxis: [{
                        type: 'value',
                        axisTick: {show: false},
                        axisLine: {
                            lineStyle: {
                                color: '#fff',
                                width: 2
                            }
                        },
                        axisLabel: {
                            interval: 1,
                            fontSize: 18,
                            color: '#fff'
                        },
                        splitLine: {
                            show: false
                        }
                    }],
                    series: [{
                        type: 'line',
                        smooth: true,
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#258eb4'
                                },
                                    {
                                        offset: 1,
                                        color: '#00c6ff'
                                    }
                                ])
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#fff',
                                width: 1
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff'
                            }
                        },
                        data: []
                    }]
                })
            },
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
                    this.currentTown = rolePermission.town_code
                }
                if (rolePermission.township_code && rolePermission.township_code !== '') {
                    this.townShipList = [{
                        township_code: rolePermission.township_code,
                        township_name: rolePermission.township
                    }]
                    this.currentTownShip = rolePermission.township_code
                }
                if (rolePermission.village_code && rolePermission.village_code !== '') {
                    this.villageList = [{
                        village_code: rolePermission.village_code,
                        village_name: rolePermission.village_name
                    }]
                    this.currentVillage = rolePermission.village_code
                }
                if (this.$store.state.global.accountInfo.rolePermission.roleType.level == 6) {
                    let tmparr = []
                    if (this.$store.state.global.accountInfo.rolePermission.permiscodes) {
                        this.currentUnit = this.$store.state.global.accountInfo.rolePermission.permiscodes
                    } else {
                        this.currentUnit = this.$store.state.global.accountInfo.rolePermission.permiscodeSet[0]
                    }
                }
                // 获取数据
                this.params = '?province_code=' + this.currentProvince + '&city_code=' + this.currentCity;
                this.params += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown);
                this.params += '&township_code=' + (this.currentTownShip == 'all' ? '' : this.currentTownShip);
                this.params += '&village_code=' + (this.currentVillage == 'all' ? '' : this.currentVillage);
                this.params += '&unit_id=' + (this.currentUnit == 'all' ? '' : this.currentUnit)
            },
            // 获取今日人流量列表数据
            getDoorRecord: function () {
                let requestUrl = '/door/record.do' + this.params + '&pageNo=' + this.allDoorRecordPageIndex + '&pageSize=5';
                if (this.maptime) {
                    requestUrl = '/door/record.do' + this.params + '&pageNo=' + this.allDoorRecordPageIndex + '&pageSize=5&start_time=' + this.maptime[0] + "&end_time=" + this.maptime[1];
                }
                if (this.userName) {
                    requestUrl += ("&name=" + this.userName);
                }
                if (this.open_door) {
                    requestUrl += ("&open_door=" + this.open_door);
                }
                axios.get(requestUrl, {}).then(response => {
                    this.doordata = response.data.items;
                    this.updateAllDoorRecordtotalCount(response.data.totalCount);
                }).catch(err => {
                    console.log('获取今日人流量列表数据失败');
                })
            },
            getDoorTotalCount: function () {
                axios.get('/door/dateCount.do' + this.params + '&groupType=' + (this.doorgroup + 1), {}).then(response => {
                    let totalcount = 0
                    for (let i = 0; i < response.data.length; i++) {
                        for (let key in response.data[i]) {
                            if (this.doorgroup == 0) {
                                totalcount += response.data[i][key];
                            }
                        }
                    }
                    this.doorcount = totalcount;
                }).catch(err => {
                    console.log('获取按天周月统计人流量数据失败')
                })
            },
            // 获取按天周月统计人流量数据(面积图)
            getDoorDateCount: function () {
                axios.get('/door/dateCount.do' + this.params + '&groupType=' + (this.doorgroup + 1), {}).then(response => {
                    let timelist = [],
                        countlist = [];
                    for (let i = 0; i < response.data.length; i++) {
                        for (let key in response.data[i]) {
                            if (this.doorgroup == 0) {
                                timelist.push(key.substr(11, 2) + ':00');
                            } else {
                                timelist.push(key.substr(5, 5));
                            }
                            countlist.push(response.data[i][key]);
                        }
                    }
                    this.chart4.setOption({
                        xAxis: [{
                            data: timelist
                        }],
                        yAxis: [{
                            max: (parseInt(Math.max(...countlist) / 5) + 1) * 5
                        }],
                        series: [{
                            data: countlist
                        }]
                    })
                }).catch(err => {
                    console.log('获取按天周月统计人流量数据失败')
                })
            },
            // 人流量按天周月选择
            selectDoor: function (index) {
                this.doorgroup = index;
                this.getDoorDateCount();
            },
            // 人流量按时间标签选择
            selectDoorByTime: function (index) {
                switch (index) {
                    case 0://最近1天
                        this.maptime = [millisec_to_Date(new Date().getTime() - 24 * 60 * 60 * 1000).formatTime, millisec_to_Date(new Date().getTime()).formatTime];
                        break;
                    case 1://最近7天
                        this.maptime = [millisec_to_Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).formatTime, millisec_to_Date(new Date().getTime()).formatTime];
                        break;
                    case 2://最近30天
                        this.maptime = [millisec_to_Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).formatTime, millisec_to_Date(new Date().getTime()).formatTime];
                        break;
                    case 3://最近半年
                        this.maptime = [millisec_to_Date(new Date().getTime() - 182 * 24 * 60 * 60 * 1000).formatTime, millisec_to_Date(new Date().getTime()).formatTime];
                        break;
                    default:
                        this.maptime = [millisec_to_Date(new Date().getTime() - 24 * 60 * 60 * 1000).formatTime, millisec_to_Date(new Date().getTime()).formatTime];
                }
                //console.log(millisec_to_Date(new Date().getTime()).formatTime);
                //console.log(millisec_to_Date(new Date().getTime() - 24 * 60 * 60 * 1000).formatTime);
                this.getDoorRecord();
            },
            // 选择门禁数据过滤时间
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
            toPage(currentPage) {
                this.updateAllDoorRecordPageIndex(currentPage);
                this.getDoorRecord();
            },
            getDoorRecordByBtn() {
                this.updateAllDoorRecordPageIndex(1);
                this.updateAllDoorRecordtotalCount(0);
                this.getDoorRecord();
            },
            openDoorTypeList(h, params) {
                var optionList = [
                    h('select', {
                        attrs: {
                            id: 'th_opendoortype'
                        },
                        style: {
                            color: "white",
                            width: '205px',
                            height: "35px",
                            border: "1px solid #1cb1ff",
                            appearance: 'none',
                            "moz-appearance": 'none',
                            "webkit-appearance": 'none',
                            "background": "url(" + this.defaultPath + ") no-repeat",
                            "background-position": '95% 48%',
                            "background-size": "10px 10px",
                            "background-color": '#032A51',
                            "padding-left": '5px'
                        },
                        on: {
                            change: () => {
                                let open_door = document.getElementById('th_opendoortype').value;
                                this.updateOpenDoor(open_door);
                                this.updateAllDoorRecordPageIndex(1);
                                this.getDoorRecord(open_door);
                            }
                        }
                    }, [
                        h('option', {
                            attrs: {
                                value: ''
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            },
                            selected: true
                        }, '开门方式'),
                        h('option', {
                            attrs: {
                                value: 1
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '一键开门'),
                        h('option', {
                            attrs: {
                                value: 2
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '自动开门'),
                        h('option', {
                            attrs: {
                                value: 3
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '亮屏开门'),
                        h('option', {
                            attrs: {
                                value: 4
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '摇一摇开门'),
                        h('option', {
                            attrs: {
                                value: 5
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '人脸识别开门'),
                        h('option', {
                            attrs: {
                                value: 9
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '按键开门'),
                        h('option', {
                            attrs: {
                                value: 10
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '手机蓝牙开门'),
                        h('option', {
                            attrs: {
                                value: 11
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '手机NFC开门'),
                        h('option', {
                            attrs: {
                                value: 12
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '手机WIFI开门'),
                        h('option', {
                            attrs: {
                                value: 13
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '刷IC卡开门'),
                        h('option', {
                            attrs: {
                                value: 15
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '身份证开门'),
                        h('option', {
                            attrs: {
                                value: 21
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '密码开门'),
                        h('option', {
                            attrs: {
                                value: 22
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '呼叫远程开门')
                    ]),
                ];
                return h('div', {
                    style: {
                        margin: '0',
                        position: 'relative',
                        align: 'center'
                    }
                }, optionList);
            },
            ...mapMutations([
                'updateAllDoorRecordPageIndex',
                'updateAllDoorRecordtotalCount',
                'updateOpenDoor'
            ]),
        },
        computed: {
            ...mapState([
                'allDoorRecordPageIndex',
                'allDoorRecordtotalCount',
                'open_door'
            ])
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
            this.updateOpenDoor('');//每次进入门禁记录详情页，需要将开门方式恢复默认
            this.getDefaultValue();
            this.initManFlowChart();
            this.getDoorTotalCount();
            this.getDoorDateCount();
            this.updateAllDoorRecordPageIndex(1);
            this.updateAllDoorRecordtotalCount(0);
            this.getDoorRecord();
        }
    }
</script>

<style lang="scss" scoped>
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-button {
        display: none;
    }

    ::-webkit-scrollbar-track {
        border-radius: 2px;
        background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background-color: rgba(70, 207, 228, .3);
    }

    ::-webkit-input-placeholder {
        color: #fff;
    }

    .trip-manflow {
        /*width: 1940px;*/
        background: url(../../assets/image/appBg.jpg) no-repeat;
        .chart-data {
            height: 990px;
            overflow: auto;
            display: flex;
            flex-direction: column;

            display: -ms-flexbox;
            -ms-flex-direction: column;

            .manflow-chart-wrap {
                margin-top: 20px;
                margin-bottom: -10px;
                .panel-mt-chart {
                    margin: 10px auto auto auto;
                }
                .manflow-chart {
                    display: flex;
                    flex: 1;
                    flex-direction: row;
                    justify-content: space-around;

                    display: -ms-flexbox;
                    /*-ms-flex: 1;*/
                    -ms-flex-direction: row;
                    -ms-flex-pack: center;
                    -ms-flex-align: stretch;

                    margin-top: 30px;
                    margin-bottom: 30px;
                    .manflow-photo {
                        /*width: 18%;*/
                        text-align: center;
                        margin-top: 10px;
                        margin-bottom: 24px;
                        .manflow-kaimen {
                            display: inline-block;
                            width: 280px;
                            height: 250px;
                            text-align: center;
                            margin-right: 15px;
                            b {
                                display: inline-block;
                                width: 100%;
                                font-size: 18px;
                                color: #57e1ff;
                                margin-top: 10px;
                            }
                            label {
                                font-size: 48px;
                                color: #fff;
                            }
                        }
                    }
                    .manflow-tool-chart {
                        display: inline-flex;
                        flex-direction: column;

                        display: -ms-inline-flexbox;
                        -ms-flex-direction: column;

                        .manflow-tool {
                            line-height: 24px;
                            text-align: center;
                            font-size: 14px;
                        }
                        .manflow-chart {
                            height: 370px;
                            /*width: 100%;*/
                            width: 1000px;
                        }
                    }
                }
            }
            .manflow-data {
                height: 810px;
                padding: 0px 15px;
                margin-bottom: 110px;
                .content-center {
                    text-align: center;
                }
                .table-pb {
                    padding-bottom: 30px;
                }
                .table-width {
                    width: 1820px;
                    margin: 2px auto;
                }
                .panel-mt {
                    margin: 0 auto;
                }
                .page {
                    text-align: center;
                    margin-top: 30px;
                }
                .safety-search {
                    width: 1815px;
                    margin: 20px auto;
                    display: inline-flex;
                    justify-content: space-between;
                    align-items: center;

                    display: -ms-inline-flexbox;
                    -ms-flex-pack: justify;
                    -ms-flex-align: center;

                    padding: 0px 0px;
                    line-height: 32px;
                    font-size: 18px;
                    .query_opt {
                        margin-right: 0px;
                        img {
                            position: relative;
                            top: 5px;
                            right: -2px;
                            cursor: pointer;
                        }
                    }
                    .query_name {
                        .font-style {
                            color: #45c1fb;
                            font-size: 17px;
                        }
                        input {
                            color: #45c1fb;
                            height: 34px;
                            border-radius: 2px;
                            background-color: #0e366d;
                            border: 1px solid #1a9ee8;
                            width: 170px;
                            color: #fff;
                            padding-left: 3px;
                        }
                    }
                    label {
                        font-size: 18px;
                        color: #1cb1ff;
                        line-height: 16px;
                        font-weight: normal;
                        margin-right: 10px;
                        vertical-align: middle
                    }
                    .date-select {
                        display: inline-block;
                        margin-right: 20px;
                        margin-left: 10px;
                        .font-style {
                            color: #45c1fb;
                            font-size: 17px;
                        }
                        .date-select-input {
                            display: inline-block;
                            position: relative;
                            input::-webkit-input-placeholder {
                                color: yellowgreen;

                            }
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
            }
        }

    }
</style>
