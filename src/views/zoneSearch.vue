<!-- 小区平台页面 -->
<!-- Author: Tim -->
<template>
    <div class='platform-root'>
        <TwoHeader title="小区详情"></TwoHeader>
        <v-sliderbar/>
        <div class="body-wrap">
            <div class="body-header">
                <img src="../assets/image/securityCount-logo.png" class="img-style"/>
                <div class="name">
                    <span class="font-style">{{showPlaceName}}</span> ( {{prePlaceName}} )
                    <!--{{currentName.slice(0, currentName.lastIndexOf("智能零发案小区管控平台")) === "铜仁平安警务云" ? "铜仁" : currentName.slice(0, currentName.lastIndexOf("智能零发案小区管控平台"))}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{fullName}}-->
                    <img @click="clickToPlatform" src="../assets/image/click_to_zone_tp_2.png" class="transfer-style" title="进入小区平台"/>
                </div>
            </div>
            <div class="top clear mb">
                <div class="fl">
                    <ul class="clear">
                        <!--小区人口-->
                        <li class="fl mr">
                            <v-iperson-number :data="pNumberData" :size="[Number(pWidth), 311]"></v-iperson-number>
                        </li>
                        <!--房屋数据-->
                        <li class="fl mr">
                            <v-ihouse :data="ihouseData" :info="'left'" :size="[434, 311]"></v-ihouse>
                        </li>
                        <li class="fl mr">
                            <v-chart-box hrefto='/index/special' boxType='polygon' iconName='special' :w="434" :h="311"
                                         boxTitle="特殊群体" class="common-wrap">
                                <ISpecial class="special"></ISpecial>
                            </v-chart-box>
                        </li>
                        <li class="fl mr">
                            <v-chart-box hrefto="/index/estate" boxType='polygon' iconName='chart' :w="434" :h="311"
                                         boxTitle="电、水、天然气用量" class="common-wrap">
                                <IProperty style="margin-top: 35px;"></IProperty>
                            </v-chart-box>
                        </li>
                    </ul>
                </div>
            </div>

            <ul class="bottom mb clear">
                <li class="fl mr">
                    <v-chart-box hrefto='/index/watch' boxType='polygon' iconName='prevent' :w=pWidth :h="311"
                                 boxTitle="人防数据">
                        <v-radar class="inheritWH" :data="civilDefense"/>
                    </v-chart-box>
                </li>
                <li class="fl mr">
                    <v-chart-box hrefto="/index/watch" boxType='polygon' iconName='prevent' :w="434" :h="311"
                                 boxTitle="物防数据" class="common-wrap">
                        <IGoods class="igoods"></IGoods>
                    </v-chart-box>
                </li>
                <li class="fl mr">
                    <v-chart-box hrefto="/index/watch" boxType='polygon' iconName='prevent' :w="434" :h="311"
                                 boxTitle="技防数据">
                        <v-chartSkill class="chart-skill"></v-chartSkill>
                    </v-chart-box>
                </li>
                <li class="fl mr">
                    <v-chart-box hrefto="/index/security" boxType='polygon' iconName='patrol' :w="434" :h="311"
                                 boxTitle="安防巡更">
                        <v-chartSecurityPlatform class="chart-security-platform"></v-chartSecurityPlatform>
                    </v-chart-box>
                </li>
            </ul>

            <div>
                <IDoorRecord></IDoorRecord>
            </div>
            <div>
                <IVisitor></IVisitor>
            </div>
            <div>
                <ICarRecord></ICarRecord>
            </div>
            <div class="relation-grid-map" :style=pStyle>
                <h4 style="color: white">关系网格图</h4>
                <v-relation :unitId="unitId"></v-relation>
            </div>
        </div>
        <v-password-modal/>
        <v-username-modal/>
        <v-logout-modal/>
    </div>
</template>

<script>
    import TwoHeader from '@/components/section/TwoHeader'
    import vSliderbar from '@/components/section/Sliderbar'
    import vChartBox from '@/components/ChartBox'
    import vMapHeader from '@/components/section/MapHeader'
    import vRadar from '@/components/chart/Radar'
    import vCarFlow from '@/components/chart/CarFlow'
    import vIpersonNumber from '@/components/chart/IpersonNumberRect'
    import vIhouse from '@/components/chart/IhouseRect'
    import vAlarmList from '@/views/alarm/AlarmList'
    import vChartPAndCFlow from '@/components/chart/ChartPAndCFlow'
    import vChartSkill from '@/components/chart/ChartSkill'
    import vChartSecurityPlatform from '@/components/chart/ChartSecurityPlatform'
    import vIpersonFlow from '@/components/chart/IpersonFlow'
    import IGoods from '@/components/chart/IGoods'
    import IProperty from '@/components/chart/IProperty'
    import ISpecial from '@/components/chart/ISpecial'
    import IDoorRecord from '@/components/chart/IDoorRecord'
    import ICarRecord from '@/components/chart/ICarRecord'
    import IVisitor from '@/components/chart/IVisitor'
    import vPasswordModal from '@/components/section/PasswordModal'
    import vUsernameModal from '@/components/section/UsernameModal'
    import vLogoutModal from '@/components/section/LogoutModal'
    import vCarData from '@/components/chart/CarData'
    import vRelation from '@/views/search/SearchKnowledgeEstate'
    import {createNamespacedHelpers} from 'vuex'
    import http from '@/utils/http'
    import {zoneMapSrc} from '@/config'

    const {
        mapState,
        mapGetters,
        mapMutations,
        mapActions
    } = createNamespacedHelpers('platform');

    export default {
        data() {
            return {
                isIE: window.navigator.userAgent.indexOf(".NET") !== -1,
                mapSrc: zoneMapSrc + '?unitid=2379',
                pNumberData: {
                    numbers: [],
                    sexs: []
                },
                timer: null,
                userId: '',
                searchDoorColumns: [{
                    title: '日期-时间',
                    key: 'date_time',
                    align: 'center'
                },
                    {
                        title: '用户姓名',
                        key: 'user_name',
                        align: 'center'
                    },
                    {
                        title: '车牌号',
                        key: 'plate_number',
                        // width: 70
                    },
                    {
                        title: '车场',
                        key: 'car_place',
                        align: 'center',
                        // width: 100
                    },
                    {
                        title: '出入情况',
                        key: 'in_out',
                        align: 'center'
                    },
                    {
                        title: '抓拍图像',
                        key: 'pic',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Img', {
                                    attrs: {
                                        src: ""
                                    },
                                    style: {
                                        width: '60px',
                                        height: '60px',
                                    },
                                    on: {
                                        click: () => {
                                        }
                                    }
                                }, 'View'),
                            ]);
                        }
                    }
                ]
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
            pWidth: function () {
                let pw = "506";
                let ua = window.navigator.userAgent;
                if(ua.indexOf(".NET") !== -1 || ua.indexOf("Firefox") !== -1){
                    pw = "499";
                }
                return pw;
            },
            unitId: function () {
                console.log("map unitId: ", this.$store.state.platform.currentUnitId);
                return this.$store.state.platform.currentUnitId;
            },
            showPlaceName: function () {
                return this.$store.state.search.showName;
            },
            prePlaceName: function () {
                return this.$store.state.search.preName;
            },
            ...mapState([
                'civilDefense',
                'iestate',
                'ipersonData',
                'ihouseData',
                'currentTownCode',
                'currentUnitId',
                'unitCarData',
                'personDateCount',
                'searchDoorRecords',
                'preName',
                'showName'
            ]),
            ...mapGetters([
                'queryParam',
                'carDateCountFilter',
                'currentName'
            ])
        },
        components: {
            TwoHeader,
            vMapHeader,
            vSliderbar,
            vChartBox,
            vRadar,
            vCarFlow,
            vIpersonNumber,
            vIhouse,
            vAlarmList,
            vChartPAndCFlow,
            vChartSkill,
            vChartSecurityPlatform,
            vIpersonFlow,
            IGoods,
            IProperty,
            ISpecial,
            IDoorRecord,
            ICarRecord,
            IVisitor,
            vPasswordModal,
            vUsernameModal,
            vLogoutModal,
            vCarData,
            vRelation
        },
        methods: {
            ...mapActions([
                'getCivilDefense',
                'getUnitData',
                'getPopulationStatistics',
                'getStateRooms',
                'resetData',
                'getTechDefence',
                'getCarFlow',
                'getPeopleFlow',
                'getCarDateCount',
                'getUnitCarData',
                'getPersonDateCount',
                'clickToPlatform'
            ]),
            setMapSrc() {
                let param = '';
                if (this.currentUnitId === 'all') {
                    param = this.currentTownCode
                } else {
                    param = this.currentUnitId;
                }
                this.mapSrc = zoneMapSrc + '?unitid=' + param;
            },
            getPNum() {
                http.post('/populationManager/data.do', {
                    unit_id: this.currentUnitId
                }).then(res => {
                    if (res.data.success === true) {
                        const numbers = [{
                            value: res.data.data.populationType.flow || 0,
                            name: '流动人口',
                            color: '#0084d8'
                        },
                            {
                                value: res.data.data.populationType.residence || 0,
                                name: '常住人口',
                                color: '#00bc5d'
                            }
                        ];
                        const sexs = [{
                            value: res.data.data.sex['男'] || 0,
                            name: '男',
                            color: '#395aff'
                        },
                            {
                                value: res.data.data.sex['女'],
                                name: '女',
                                color: '#ff6767'
                            }
                        ];
                        this.pNumberData = {
                            numbers: numbers,
                            sexs: sexs
                        };
                    }
                })
            },
            getPerson() {
                clearInterval(this.timer);
                this.getPersonDateCount();
                this.timer = setInterval(() => {
                    this.getPersonDateCount();
                }, 60000)
            }
        },
        watch: {
            queryParam() {
                try {
                    this.getCarFlow(1);
                    this.getPeopleFlow(1);
                    this.getCarFlow(2);
                    this.getPeopleFlow(2);
                    this.getCarFlow(3);
                    this.getPeopleFlow(3);
                    this.getTechDefence();
                    this.resetData();
                    this.getCivilDefense();
                    this.getUnitData();
                    this.getPopulationStatistics();
                    this.getStateRooms();
                    this.setMapSrc();
                    this.getPNum();
                    this.getCarDateCount();
                    this.getUnitCarData();
                    this.getPerson();
                } catch (e) {
                    console.log("Catch Error in queryParam watch: ", e)
                }
            }
        },
        mounted() {
            this.getCivilDefense();
            this.getUnitData();
            this.getPopulationStatistics();
            this.getStateRooms();
            this.getPNum();
            this.getCarDateCount();
            this.getUnitCarData();
            this.setMapSrc();
            this.getPerson();
        },
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

    .mr {
        margin-right: 20px;
    }

    .mb {
        margin-bottom: 20px;
    }

    .platform-root {
        width: 1920px;
        height: 1545px;
        background: url(../assets/image/platform_bg.png) repeat-y;
        background-color: #000000;
        .inheritWH {
            width: 100%;
            height: 100%;
        }
        .body-wrap {
            overflow: auto;
            padding: 0 0 16px 21px;
            width: 1920px;
            height: 990px;
            .body-header {
                display: inline-block;
                .img-style {
                    position: relative;
                    top: 25px;
                }
                .name {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: #1cb1ff;
                    font-size: 19px;
                    position: relative;
                    bottom: 33px;
                    left: 60px;
                    .font-style {
                        font-size: 22px;
                    }
                    .transfer-style {
                        position: relative;
                        top: 4px;
                        left: 5px;
                        cursor: pointer;
                        background: url(../assets/image/click_to_zone_tp_2.png) no-repeat;
                    }
                }
            }
            .common-wrap {
                position: relative;
                top: 0px;
                left: 0px;
            }
            .special {
                text-align: center;
                margin-top: 20px;
                /*top: 55px;*/
                /*left: 40px;*/
                /*bottom: 0;*/
                /*right: 0;*/
                /*margin: auto;*/
            }
            .property {
                margin-top: 35px;
            }
            .chart-skill {
                padding-bottom: 10px;
                padding-right: 13px;
            }
            .chart-security-platform {
                margin-left: -5px;
            }
            .igoods {
                text-align: center;
                position: absolute;
                top: 55px;
                left: 0;
                bottom: 0;
                right: 0;
                margin: auto;
            }
            .top {
                .map {
                    width: 661px;
                    height: 644px;
                    iframe {
                        margin-top: 7px;
                        border: 1px solid rgba(109, 205, 255, .2);
                        width: 665px;
                        height: 591px;
                        overflow: hidden;
                    }
                }
            }
            .relation-grid-map {
                position: relative;
                margin-bottom: 20px;
                width: 1850px;
                height: 950px;
                background: url(../assets/image/zone_search_relation.png) no-repeat;
                h4 {
                    position: absolute;
                    top: 7px;
                    left: 44px;
                    font-size: 18px;
                    color: #fff;
                }
            }
            .trip-manflow {
                margin-bottom: 20px;
                .chart-data {
                    display: flex;
                    align-items: center;
                    height: 850px;
                }
                .manflow-chart {
                    display: inline-flex;
                    flex: 1;
                    flex-direction: column;
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
                        height: 350px;
                    }
                }
                .manflow-data {
                    display: inline-flex;
                    height: 800px;
                    flex: 1;
                    padding: 15px 15px;
                }
            }
            .orthgon {
                > h3 {
                    display: flex;
                    top: 1px;
                    padding: 0;
                    .orthogon-left {
                        width: 11px;
                        height: 33px;
                        background: url(../assets/image/orthogon-left.png) no-repeat;
                    }
                    .orthogon-color-repeat {
                        float: left;
                        padding: 0 10px 0 27px;
                        background: url(../assets/image/orthogon-color-repeat.png) repeat-x;
                    }
                    .orthogon-middle {
                        width: 23px;
                        height: 33px;
                        background: url(../assets/image/orthogon-middle.png) no-repeat;
                    }
                    .orthogon-border-repeat {
                        flex: auto;
                        height: 33px;
                        background: url(../assets/image/orthogon-border-repeat.png) repeat-x;
                    }
                    .orthogon-right {
                        float: right;
                        width: 11px;
                        height: 33px;
                        background: url(../assets/image/orthogon-right.png) no-repeat;
                    }
                }
            }
            .door-records {
                display: inline-flex;
                width: 1260px;
                flex: 1;
                padding: 15px 15px;
            }
            .circleList {
                /*position: absolute;*/
                /*left: 35px;*/
                /*top: 700px;*/
                width: 606px;
                height: 200px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                .circle1 {
                    position: absolute;
                    left: 95px;
                    top: 900px;
                    .circleDes11 {
                        color: white;
                        font-size: 25px;
                        position: relative;
                        top: -95px;
                        span {
                            font-size: 16px;
                        }
                    }
                    .circleNum {
                        color: white;
                        font-size: 35px;
                        position: relative;
                        top: 12px;
                        span {
                            font-size: 16px;
                        }
                    }
                    .circleDes12 {
                        position: relative;
                        top: 116px;
                        font-size: 22px;
                    }
                    .circleDes13 {
                        color: white;
                        font-size: 22px;
                        position: relative;
                        top: 133px;
                        span {
                            font-size: 22px;
                        }
                    }
                }
                .circle2 {
                    position: absolute;
                    left: 345px;
                    top: 900px;
                    .circleDes21 {
                        color: white;
                        font-size: 25px;
                        position: relative;
                        top: -95px;
                        span {
                            font-size: 16px;
                        }
                    }
                    .circleNum {
                        color: white;
                        font-size: 35px;
                        position: relative;
                        top: 12px;
                        span {
                            font-size: 16px;
                        }
                    }
                    .circleDes22 {
                        position: relative;
                        top: 116px;
                        font-size: 22px;
                    }
                    .circleDes23 {
                        color: white;
                        font-size: 22px;
                        position: relative;
                        top: 133px;
                        span {
                            font-size: 22px;
                        }
                    }
                }
            }
        }
    }
</style>
