<template>
    <!-- 实时车流量 -->
    <div class="trip-carflow">
        <v-panel title='车流数据' class='v-panel' :style=pStyle>
            <div class="chart-data">
                <!-- 图表 -->
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
                    <div class="carflow-tool">
                        <v-Label switchAble class="label" :activeIndex="carindex" :tabArr="tabArr"
                                 @switchTabIndex="selectCar"></v-Label>
                    </div>
                    <div class="carflow-chart" id="carflow-chart3"></div>
                </div>
                <!-- 表格 -->
                <div class="carflow-data">
                    <div class="safety-search">
                        <div class="date-select">
                            <label>时间</label>
                            <div class="date-select-input">
                                <DatePicker type="daterange" confirm  :editable="false" style="width: 280px;" format="yyyy-MM-dd"
                                            :value="maptime" :transfer="true" @on-change="changeTime">
                                </DatePicker>
                            </div>
                            <v-RectLabel switchAble class="label" :activeIndex="cartimeindex" :tabArr="tabTimeArr"
                                         @switchTabIndex="selectCarByTime"></v-RectLabel>
                        </div>
                        <div>
                            <h3>
                                <router-link :to="hrefto" class="link"></router-link>
                            </h3>
                        </div>
                    </div>
                    <Table class="hover-table" :columns="carcol" :data="cardata"></Table>
                </div>
            </div>
        </v-panel>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import vLabel from '@/components/Label'
    import vRectLabel from '@/components/RectLabel'
    import vPanel from '@/components/Panel'
    import axios from '@/utils/http.js'
    import {createNamespacedHelpers} from 'vuex'
    import {millisec_to_Date} from '@/utils/util'
    import {province_code as provinceCode, city_code as cityCode} from '@/config'
    import $ from 'jquery'

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform');

    export default {
        name: 'ICarRecord',
        components: {
            vLabel,
            vRectLabel,
            vPanel
        },
        data() {
            return {
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
                maptime: [millisec_to_Date(new Date().getTime() - 24 * 60 * 60 * 1000).formatTime, millisec_to_Date(new Date().getTime()).formatTime],
                cartimeindex: 0,
                tabTimeArr: ['昨天', '最近7天', '最近30天', '最近半年'],
                chart3: null,
                btnInfo: {
                    text: '查询', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
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
                    width: 135,
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
                        width: 108,
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
                    {key: 'plate_num_cn', title: '车牌', width: 120},
                    {
                        key: 'io_type',
                        title: '通行情况',
                        width: 108,
                        render: (h, params) => {
                            return h('span', params.row.io_type == 0 ? '进场' : '出场')
                        }
                    },
                    {
                        key: 'io_picture_path',
                        title: '抓拍图片',
                        width: 108,
                        render: (h, params) => {
                            return h('img', {
                                attrs: {src: params.row.io_picture_path || "", alt: '暂无'},
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
                    let tmparr = [];
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
                let groupType = 1
                if (this.currentTown != 'all' && this.currentTown != '') {
                    groupType = 2
                }
                if (this.currentTownShip != 'all' && this.currentTownShip != '') {
                    groupType = 3
                }
                if (this.currentVillage != 'all' && this.currentVillage != '') {
                    groupType = 4
                }
                if (this.currentUnit != 'all' && this.currentUnit != '') {
                    groupType = 4
                }
                axios.get('/car/regionCount.do' + this.params + '&groupType=' + groupType, {}).then(response => {
                    let arealist = [],
                        recordcount = [],
                        tmparr = [],
                        carincount = [],
                        caroutcount = [],
                        unitcount = [];
                    for (let key in response.data) {
                        tmparr.push({name: key, yAxis: key});
                        arealist.push(key);
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
                    console.log('获取今日车流量数据失败')
                })
            },
            // 获取今日车流量列表数据
            getCarRecord: function () {
                axios.get('/car/record.do' + this.params + '&pageNo=1&pageSize=6&startTime=' + this.maptime[0] + "&endTime=" + this.maptime[1], {}).then(response => {
                    this.cardata = response.data.items
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
                    this.carincount = incount
                    this.caroutcount = outcount
                }).catch(err => {
                    console.log('获取按天周月统计车流量数据失败')
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
                this.getCarDateCount();
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
                if (value[0] && value[1] && new Date(value[1]).getTime() - new Date(value[0]).getTime() > 0) {
                    this.maptime = value;
                    console.log("select start time: " + value[0]);
                    console.log("select end time: " + value[1]);
                    this.getCarRecord();
                }
            }
        },
        computed: {
            pStyle: function () {
                let pw = "1870px";
                let ua = window.navigator.userAgent;
                if(ua.indexOf(".NET") !== -1 || ua.indexOf("Firefox") !== -1){
                    pw = "1863px";
                }
                return {
                    width: pw
                };
            },
            ...mapGetters([])
        },
        created() {

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
            this.getDefaultValue();
            this.initCarFlowChart();
            this.getCarTotalCount();
            this.getCarDateCount();
            this.getCarRecord();
        },
        watch: {
            queryParam() {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .trip-carflow {
        margin-bottom: 20px;
        .chart-data {
            display: flex;
            align-items: center;

            display: -ms-flexbox;
            -ms-flex-align: center;

            height: 850px;
        }
        .carflow-chart {
            display: inline-flex;
            flex: 1;
            flex-direction: column;

            width: 50%;
            display: -ms-inline-flexbox;
            -ms-flex-direction: column;

            -webkit-flex: none;
            -webkit-flex-direction: column;

            .carflow-photo {
                text-align: center;
                margin-bottom: 24px;
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
            .carflow-tool {
                line-height: 24px;
                text-align: center;
                font-size: 14px;
            }
            .carflow-chart {
                width: 100%;
                height: 350px;
            }
        }
        .carflow-data {
            height: 800px;
            flex: 1;

            -ms-flex: 1;

            -webkit-flex: 1;

            padding: 0px 15px;
            .safety-search {
                width: 100%;
                margin-bottom: 26px;
                margin-top: 4px;
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
                    vertical-align: middle
                }
                .date-select {
                    display: inline-block;
                    margin-right: 20px;
                    .date-select-input {
                        display: inline-block;
                        position: relative;
                    }
                }
                .btnCls {
                    margin-top: 2px;
                    margin-right: 1px;
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
        }
    }
</style>
