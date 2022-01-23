<template>
    <!-- 实时人流量 -->
    <div class="trip-manflow">
        <v-panel title='门禁数据' class='v-panel' :style=pStyle>
            <div class="chart-data">
                <!-- 图表 -->
                <div class="manflow-chart">
                    <div class="manflow-photo">
                        <div class="manflow-kaimen">
                            <img src="../../assets/image/kaimen.png"/>
                            <b>开门次数</b>
                            <label>{{ doorcount }}</label>
                        </div>
                    </div>
                    <div class="manflow-tool">
                        <v-Label switchAble class="label" :activeIndex="manindex" :tabArr="tabArr"
                                 @switchTabIndex="selectDoor"></v-Label>
                    </div>
                    <div class="manflow-chart" id="manflow-chart4"></div>
                </div>

                <!-- 表格 -->
                <div class="manflow-data">
                    <div class="safety-search">
                        <div class="date-select">
                            <label>时间</label>
                            <div class="date-select-input">
                                <DatePicker type="daterange" confirm  :editable="false" style="width: 280px;" format="yyyy-MM-dd"
                                            :value="maptime" :transfer="true" @on-change="changeTime">
                                </DatePicker>
                            </div>
                            <v-RectLabel switchAble class="label" :activeIndex="mantimeindex" :tabArr="tabTimeArr"
                                         @switchTabIndex="selectDoorByTime"></v-RectLabel>
                        </div>
                        <div>
                            <h3>
                                <router-link :to="hrefto" class="link"></router-link>
                            </h3>
                        </div>
                    </div>
                    <Table class="hover-table" :columns="doorcol" :data="doordata"></Table>
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
    import vButton from '@/components/Button'
    import axios from '@/utils/http.js'
    import {createNamespacedHelpers} from 'vuex'
    import {millisec_to_Date} from '@/utils/util'
    import {province_code as provinceCode, city_code as cityCode} from '@/config'
    import $ from 'jquery'

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform');

    export default {
        name: 'IDoorRecord',
        components: {
            vLabel,
            vPanel,
            vRectLabel,
            vButton
        },
        data() {
            return {
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
                maptime: [millisec_to_Date(new Date().getTime() - 24 * 60 * 60 * 1000).formatTime, millisec_to_Date(new Date().getTime()).formatTime],
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
                doorcol: [{
                    key: 'start_time',
                    title: '时间',
                    width: 135,
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
                        key: 'door_name',
                        title: '门禁ID',
                        ellipsis: true,
                        render: (h, params) => {
                            return h('span', {
                                attrs: {title: params.row.door_name}
                            }, params.row.door_name)
                        }
                    },
                    {
                        key: 'open_door',
                        title: '开门方式',
                        width: 120,
                        ellipsis: true,
                        render: (h, params) => {
                            let tmpstr = ''
                            if (params.row.open_door == 1) {
                                tmpstr = '一键开门'
                            } else if (params.row.open_door == 2) {
                                tmpstr = '自动开门'
                            } else if (params.row.open_door == 3) {
                                tmpstr = '亮屏开门'
                            } else if (params.row.open_door == 4) {
                                tmpstr = '摇一摇开门'
                            } else if (params.row.open_door == 5) {
                                tmpstr = '人脸识别开门'
                            } else if (params.row.open_door == 9) {
                                tmpstr = '按键开门'
                            } else if (params.row.open_door == 10) {
                                tmpstr = '手机蓝牙开门'
                            } else if (params.row.open_door == 11) {
                                tmpstr = '手机NFC开门'
                            } else if (params.row.open_door == 12) {
                                tmpstr = '手机WIFI开门'
                            } else if (params.row.open_door == 13) {
                                tmpstr = '刷IC卡开门'
                            } else if (params.row.open_door == 15) {
                                tmpstr = '身份证开门'
                            } else if (params.row.open_door == 21) {
                                tmpstr = '密码开门'
                            } else if (params.row.open_door == 22) {
                                tmpstr = '呼叫远程开门'
                            } else {
                                tmpstr = ''
                            }
                            return h('span', {
                                attrs: {title: tmpstr}
                            }, tmpstr)
                        }
                    },
                    {
                        key: 'open_status',
                        title: '开门情况',
                        width: 108,
                        render: (h, params) => {
                            if (params.row.open_status > 5) {
                                return h('span', '成功')
                            } else {
                                return h('span', {
                                    style: {color: '#ff4f4f'}
                                }, '失败')
                            }
                        }
                    },
                    {
                        key: 'picurl',
                        title: '抓拍图片',
                        width: 108,
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
                hrefto: '/alldooorrecord'
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
            // 获取今日人流量列表数据
            getDoorRecord: function () {
                axios.get('/door/record.do' + this.params + '&pageNo=1&pageSize=6&startTime=' + this.maptime[0] + "&endTime=" + this.maptime[1], {}).then(response => {
                    this.doordata = response.data.items
                }).catch(err => {
                    console.log('获取今日人流量列表数据失败')
                })
            },
            // 获取今日人流量列表数据（按时间过滤 需要新提供接口）
            getDoorRecordByTime: function () {
                axios.get('/door/record.do' + getters.queryParam + '&pageNo=1&pageSize=6', {}).then(response => {
                    this.doordata = response.data.items
                }).catch(err => {
                    console.log('获取今日人流量列表数据失败')
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
                    console.log('获取按天周月统计人流量数据失败');
                })
            },
            // 获取按天周月统计人流量数据(面积图)
            getDoorDateCount: function () {

                axios.get('/door/dateCount.do' + this.params + '&groupType=' + (this.doorgroup + 1), {}).then(response => {
                    let timelist = [],
                        countlist = []
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
                    console.log('获取按天周月统计人流量数据失败');
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
                if (value[0] && value[1] && new Date(value[1]).getTime() - new Date(value[0]).getTime() > 0) {
                    this.maptime = value;
                    console.log("select start time: " + value[0]);
                    console.log("select end time: " + value[1]);
                    this.getDoorRecord()
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
            this.initManFlowChart();
            this.getDoorTotalCount();
            this.getDoorDateCount();
            this.getDoorRecord();
        },
        watch: {
            queryParam() {

            }
        }
    }
</script>

<style lang="scss" scoped>
    .trip-manflow {
        .trip-manflow-panel {
            width: 1870px;
        }
        .chart-data {
            display: flex;
            align-items: center;

            display: -ms-flexbox;
            -ms-flex-align: center;

            height: 850px;
        }
        .manflow-chart {
            display: inline-flex;

            display: -ms-inline-flexbox;

            flex: 1;
            flex-direction: column;
            width: 50%;

            -webkit-flex: none;
            -ms-flex-direction: column;

            .manflow-photo {
                text-align: center;
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
            .manflow-tool {
                line-height: 24px;
                text-align: center;
                font-size: 14px;
            }
            .manflow-chart {
                width: 100%;
                height: 370px;
            }
        }
        .manflow-data {
            height: 800px;
            flex: 1;

            -ms-flex: 1;

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
