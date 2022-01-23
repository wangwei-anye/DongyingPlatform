<template>
    <!-- 实时车流量 -->
    <div class="trip-manflow">
        <TwoHeader title="车流数据"></TwoHeader>
        <div class="chart-data">
            <!-- 图表 -->
            <div class="carflow-chart-wrap">
                <v-panel title='车流数据' class='v-panel panel-mt-chart' style="width: 1860px;">
                    <div class="carflow-chart">
                        <div class="carflow-photo">
                            <div class="carflow-jinchang">
                                <img src="../../assets/image/jinchang.png"/>
                                <b>今日进场</b>
                                <label>{{ carincount }}</label>
                            </div>
                            <div class="carflow-chuchang">
                                <img src="../../assets/image/chuchang.png"/>
                                <b>今日出场</b>
                                <label>{{ caroutcount }}</label>
                            </div>
                        </div>
                        <div class="carflow-tool-chart">
                            <div class="carflow-tool">
                                <v-Label switchAble class="label" :activeIndex="carindex" :tabArr="tabArr"
                                         @switchTabIndex="selectCar"></v-Label>
                            </div>
                            <div class="carflow-chart" id="carflow-chart3"></div>
                        </div>
                    </div>
                </v-panel>
            </div>
            <!-- 表格 -->
            <div class="carflow-data">
                <v-panel title='车流数据列表' class='v-panel panel-mt' style="width: 1860px;">
                    <div class="content-center">
                        <div class="safety-search">
                            <div class="query_name">
                                <span class="font-style">用户名：</span>
                                <input type="text" maxlength="10" v-model="userName">
                                <span class="font-style ml">车牌：</span>
                                <input type="text" maxlength="10" v-model="plateNum">
                                <div class="date-select">
                                    <span class="font-style">时间：</span>
                                    <div class="date-select-input" id="date-picker">
                                        <DatePicker type="daterange" confirm style="width: 360px;" placeholder="选择时间" format="yyyy-MM-dd HH:mm:ss"
                                                    :value="maptime" :transfer="true" @on-change="changeTime">
                                        </DatePicker>
                                    </div>
                                    <v-Button :btnInfo='queryBtnInfo' class="btnCls" :style=pStyle
                                              @click="getCarRecordByBtn"></v-Button>
                                    <!--<v-Button :btnInfo='picBtnInfo' class="btnCls"></v-Button>-->
                                </div>
                            </div>
                            <div class="query_opt">
                                <!--<img src="../../assets/image/special/icon/daochu.png" alt="" title="导出">-->
                            </div>
                        </div>
                    </div>
                    <div class="table-pb">
                        <Table class="border-table table-width" :columns="carcol" :data="cardata"></Table>
                        <div class='page'>
                            <v-pagination :pageSize=5 :total="allCarRecordtotalCount" :pageIndex="allCarRecordPageIndex"
                                          @toPage="toPage">
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
    import {millisec_to_time} from '@/utils/util'
    import {province_code as provinceCode, city_code as cityCode} from '@/config'

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('search');

    export default {
        name: 'AllCarRecord',
        components: {
            TwoHeader,
            vLabel,
            vRectLabel,
            vPanel,
            vButton,
            vPagination
        },
        data() {
            return {
                userName: '',
                plateNum: '',
                carincount: '',
                caroutcount: '',
                carindex: 0,
                tabArr: ['实时', '周', '月'],
                currentProvince: '',
                currentCity: '',
                currentTown: 'all',
                currentTownShip: 'all',
                currentVillage: 'all',
                currentUnit: 'all',
                params: '',
                cargroup: 0,
                maptime: "",
                cartimeindex: 0,
                tabTimeArr: ['昨天', '最近7天', '最近30天', '最近半年'],
                chart3: null,
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
                        title: '用户名',
                        width: 275,
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {title: params.row.user_name}
                            }, params.row.user_name);
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
                            }, params.row.unit_name);
                        }
                    },
                    {
                        key: 'park_name',
                        title: '车场',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {title: params.row.park_name}
                            }, params.row.park_name);
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
                                attrs: {src: params.row.io_picture_path || ""},
                                style: {verticalAlign: 'middle', width: '38px', height: '38px'},
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
                hrefto: '/allcarrecord'
            }
        },
        methods: {
            initCarFlowChart: function () {
                // 人流量面积图
                this.chart3 = echarts.init(document.getElementById('carflow-chart3'));
                this.chart3.setOption({
                    title: {
                        text: '车流量',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        },
                        left: 20
                    },
                    color: ['#186ee1', '#b3c70f'],
                    legend: {
                        data: ['进场', '出场'],
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '时间：{b}<br/>进场：{c0}<br/>出场：{c1}',
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
                        name: '进场',
                        smooth: true,
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(37, 142, 180, 1)'
                                },
                                    {
                                        offset: 1,
                                        color: 'rgba(0, 198, 255, 1)'
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
                    },
                        {
                            type: 'line',
                            name: '出场',
                            smooth: true,
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(255, 255, 255, .5)'
                                    },
                                        {
                                            offset: 1,
                                            color: 'rgba(255, 120, 21, .5)'
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
                        }
                    ]
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
            // 获取今日车流量数据
            getCarRegionCount: function () {
                let groupType = 1;
                if (this.currentTown != 'all' && this.currentTown != '') {
                    groupType = 2;
                }
                if (this.currentTownShip != 'all' && this.currentTownShip != '') {
                    groupType = 3;
                }
                if (this.currentVillage != 'all' && this.currentVillage != '') {
                    groupType = 4;
                }
                if (this.currentUnit != 'all' && this.currentUnit != '') {
                    groupType = 4;
                }
                axios.get('/car/regionCount.do' + this.params + '&groupType=' + groupType, {}).then(response => {
                    let arealist = [],
                        recordcount = [],
                        tmparr = [],
                        carincount = [],
                        caroutcount = [],
                        unitcount = []
                    for (let key in response.data) {
                        tmparr.push({name: key, yAxis: key});
                        arealist.push(key)
                        recordcount.push(response.data[key]['recordCount']);
                        carincount.push(response.data[key]['carInCount']);
                        caroutcount.push(response.data[key]['carOutCount']);
                        unitcount.push(response.data[key]['unitCount']);
                    }
                    this.chart2.setOption({
                        xAxis: [{
                            max: (parseInt(Math.max(...recordcount) / 5) + 1) * 5
                        }],
                        yAxis: [{
                            data: arealist
                        }],
                        series: [{
                                name: 'recordCount',
                                data: recordcount
                            },
                            {
                                name: 'carInCount',
                                data: carincount
                            },
                            {
                                name: 'carOutCount',
                                data: caroutcount
                            },
                            {
                                name: 'unitCount',
                                data: unitcount,
                                markLine: {
                                    data: tmparr
                                }
                            }
                        ]
                    })
                }).catch(err => {
                    console.log('获取今日车流量数据失败');
                })
            },
            // 获取今日车流量列表数据
            getCarRecord: function () {
                let requestUrl = '/car/record.do' + this.params + '&pageNo=' + this.allCarRecordPageIndex + '&pageSize=5';
                if (this.maptime) {
                    requestUrl = '/car/record.do' + this.params + '&pageNo=' + this.allCarRecordPageIndex + '&pageSize=5&start_time=' + this.maptime[0] + "&end_time=" + this.maptime[1];
                }
                if (this.userName) {
                    requestUrl += ("&userName=" + this.userName);
                }
                if (this.plateNum) {
                    requestUrl += ("&plateNum=" + this.plateNum);
                }                if (this.plateNum) {
                    requestUrl += ("&plateNum=" + this.plateNum);
                }
                axios.get(requestUrl, {}).then(response => {
                    this.cardata = response.data.items;
                    this.updateAllCarRecordtotalCount(response.data.totalCount);
                }).catch(err => {
                    console.log('获取今日车流量列表数据失败')
                })
            },
            // 获取按天周月统计车流量数据
            getCarTotalCount: function () {
                axios.get('/car/dateCount.do' + this.params + '&groupType=' + (this.cargroup + 1), {}).then(response => {
                    let incount = 0,
                        outcount = 0
                    for (let i = 0; i < response.data.length; i++) {
                        for (let key in response.data[i]) {
                            if (this.cargroup == 0) {
                                if (key.substr(14, 1) == 0) {
                                    incount += response.data[i][key];
                                } else {
                                    outcount += response.data[i][key];
                                }
                            }
                        }
                    }
                    this.carincount = incount;
                    this.caroutcount = outcount;
                }).catch(err => {
                    console.log('获取按天周月统计车流量数据失败');
                })
            },
            // 获取按天周月统计车流量数据(面积图)
            getCarDateCount: function () {
                axios.get('/car/dateCount.do' + this.params + '&groupType=' + (this.cargroup + 1), {}).then(response => {
                    let timelist = [],
                        incountlist = [],
                        outcountlist = []
                    for (let i = 0; i < response.data.length; i++) {
                        for (let key in response.data[i]) {
                            if (this.cargroup == 0) {
                                if (key.substr(14, 1) == 0) {
                                    timelist.push(key.substr(11, 2) + ':00');
                                    incountlist.push(response.data[i][key]);
                                } else {
                                    outcountlist.push(response.data[i][key]);
                                }
                            } else {
                                if (key.substr(11, 1) == 0) {
                                    timelist.push(key.substr(5, 5));
                                    incountlist.push(response.data[i][key]);
                                } else {
                                    outcountlist.push(response.data[i][key]);
                                }
                            }
                        }
                    }
                    this.chart3.setOption({
                        xAxis: [{
                            data: timelist
                        }],
                        yAxis: [{
                            max: (parseInt(Math.max(...incountlist.concat(outcountlist)) / 5) + 1) * 5
                        }],
                        series: [{
                            name: '进场',
                            data: incountlist
                        },
                            {
                                name: '出场',
                                data: outcountlist
                            }
                        ]
                    })
                }).catch(err => {
                    console.log('获取按天周月统计车流量数据失败')
                })
            },
            // 车流量按天周月选择
            selectCar: function (index) {
                this.cargroup = index;
                this.getCarDateCount()
            },
            // 车流量按时间标签选择
            selectCarByTime: function (index) {
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
                console.log(millisec_to_Date(new Date().getTime()).formatTime);
                console.log(millisec_to_Date(new Date().getTime() - 24 * 60 * 60 * 1000).formatTime);
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
            toPage(currentPage) {
                this.updateAllCarRecordPageIndex(currentPage);
                this.getCarRecord();
            },
            getCarRecordByBtn() {
                this.updateAllCarRecordPageIndex(1);
                this.updateAllCarRecordtotalCount(0);
                this.getCarRecord();
            },
            ...mapMutations([
                'updateAllCarRecordPageIndex',
                'updateAllCarRecordtotalCount'
            ]),
        },
        computed: {
            pStyle: function () {
                let styleModel = {};
                let ua = window.navigator.userAgent;
                if(ua.indexOf("Firefox") !== -1){
                    styleModel = {
                        position: "relative",
                        top: "2px"
                    };
                }
                return styleModel;
            },
            ...mapState([
                'allCarRecordPageIndex',
                'allCarRecordtotalCount'
            ])
        },
        created() {

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
            this.getDefaultValue();
            this.initCarFlowChart();
            this.getCarTotalCount();
            this.getCarDateCount();
            this.updateAllCarRecordPageIndex(1);
            this.updateAllCarRecordtotalCount(0);
            this.getCarRecord();
        },
        watch: {
            queryParam() {

            }
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

    .trip-manflow {
        /*width: 1920px;*/
        background: url(../../assets/image/appBg.jpg) no-repeat;
        .chart-data {
            height: 990px;
            overflow: auto;
            display: flex;
            flex-direction: column;

            display: -ms-flexbox;
            -ms-flex-direction: column;

            -webkit-flex-direction: column;
            -webkit-flex: none;

            .carflow-chart-wrap {
                margin-top: 20px;
                margin-bottom: -10px;
                .panel-mt-chart {
                    margin: 10px auto auto auto;
                }
                .carflow-chart {
                    display: flex;
                    flex: 1;
                    flex-direction: row;
                    justify-content: space-around;

                    display: -ms-flexbox;
                    /*-ms-flex: 1;*/
                    -ms-flex-direction: row;
                    -ms-flex-pack: center;
                    -ms-flex-align: stretch;

                    display: -webkit-flex;
                    -webkit-flex-direction: row;

                    margin-top: 30px;
                    margin-bottom: 30px;
                    .carflow-photo {
                        /*width: 25%;*/
                        text-align: center;
                        margin-top: 45px;

                        .carflow-jinchang {
                            display: inline-block;
                            width: 250px;
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
                        .carflow-chuchang {
                            display: inline-block;
                            width: 250px;
                            height: 250px;
                            text-align: center;
                            margin-left: 15px;
                            b {
                                display: inline-block;
                                width: 100%;
                                font-size: 18px;
                                color: #ffda2e;
                                margin-top: 10px;
                            }
                            label {
                                font-size: 48px;
                                color: #fff;
                            }
                        }
                    }
                    .carflow-tool-chart {
                        display: inline-flex;
                        flex-direction: column;

                        display: -ms-inline-flexbox;
                        -ms-flex-direction: column;

                        -webkit-flex-direction: column;

                        .carflow-tool {
                            line-height: 24px;
                            text-align: center;
                            font-size: 14px;
                        }
                        .carflow-chart {
                            height: 370px;
                            width: 1000px;
                        }
                    }
                }
            }
            .carflow-data {
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
                        .ml {
                            margin-left: 10px;
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
