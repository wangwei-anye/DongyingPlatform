<!-- 平台页面 -->
<!-- Author: Tim -->
<template>
    <div class='platform-root'>
        <!--<TwoHeader title="社区详情"></TwoHeader>-->
        <TwoHeader :title="currentTitleInfo.showTitle"></TwoHeader>
        <v-sliderbar/>
        <div class="body-wrap">
            <div class="body-header">
                <img src="../assets/image/securityCount-logo.png" class="img-style"/>
                <div class="name">
                    <span class="font-style">{{showPlaceName}}</span> {{prePlaceName}}
                    <!--{{currentName.slice(0, currentName.lastIndexOf("智能零发案小区管控平台")) === "铜仁平安警务云" ? "铜仁" : currentName.slice(0, currentName.lastIndexOf("智能零发案小区管控平台"))}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
                    <img v-if="currentTitleInfo.stage === 'city'" @click="clickToPlatform" src="../assets/image/click_to_city.png" class="transfer-city-style" title="进入市区平台"/>
                    <img v-else-if="currentTitleInfo.stage === 'town'" @click="clickToPlatform" src="../assets/image/click_to_town.png" class="transfer-town-style" title="进入县区平台"/>
                    <img v-else-if="currentTitleInfo.stage === 'townShip'" @click="clickToPlatform" src="../assets/image/click_to_townShip.png" class="transfer-township-style" title="进入乡镇平台"/>
                    <img v-else @click="clickToPlatform" src="../assets/image/click_to_village.png" class="transfer-village-style" title="进入社区平台"/>
                </div>
            </div>
            <div class="top clear mb">
                <div class="fl">
                    <ul class="clear">
                        <li class="fl mr mb">
                            <v-iestate :data="iestate" :size="[240, 398]"/>
                        </li>
                        <li class="fl mr mb">
                            <v-ihouse :data="ihouseData" :info="'right'" :size="[458, 398]"></v-ihouse>
                        </li>
                        <li class="fl mr mb">
                            <v-chart-box boxType='polygon' hrefto='/index/safety' iconName='ranking' :w="353" :h="398"
                                         boxTitle="小区发案指数排行">
                                <IRanking></IRanking>
                            </v-chart-box>
                        </li>
                        <li class="fl mr mb">
                            <v-chart-box hrefto='/index/watch' boxType='polygon' iconName='prevent' :w=pWidth :h="398"
                                         boxTitle="人防数据">
                                <v-radar class="inheritWH" :data="civilDefense"/>
                            </v-chart-box>
                        </li>
                        <li class="fl mr mb">
                            <v-chart-box hrefto="/index/watch" boxType='polygon' iconName='prevent' :w="389" :h="398"
                                         boxTitle="技防数据">
                                <v-chartSkill class="chart-skill"></v-chartSkill>
                            </v-chart-box>
                        </li>


                    </ul>
                    <ul class="clear">
                        <li class="fl mr">
                            <v-iperson :data="ipersonData" :size="[240, 398]"></v-iperson>
                        </li>
                        <li class="fl mr">
                            <v-chart-box hrefto="/index/trip" boxType='polygon' iconName='volume_of_flow' :w="458"
                                         :h="398" boxTitle="实时人流量&车流量" class="common-wrap">
                                <v-chartPAndCFlow class="trip"></v-chartPAndCFlow>
                            </v-chart-box>
                        </li>
                        <li class="fl mr">
                            <v-chart-box hrefto='/index/special' boxType='polygon' iconName='special' :w="353" :h="398"
                                         boxTitle="特殊群体" class="common-wrap">
                                <ISpecial class="special"></ISpecial>
                            </v-chart-box>
                        </li>
                        <li class="fl mr">
                            <v-chart-box hrefto="/index/watch" boxType='polygon' iconName='prevent' :w=pWidth :h="398"
                                         boxTitle="物防数据">
                                <IGoods class="igoods"></IGoods>
                            </v-chart-box>
                        </li>

                        <li class="fl mr">
                            <v-chart-box hrefto="/index/security" boxType='polygon' iconName='patrol' :w="389" :h="398"
                                         boxTitle="安防巡更">
                                <v-chartSecurityPlatform class="chart-security-platform"></v-chartSecurityPlatform>
                            </v-chart-box>
                        </li>
                    </ul>
                </div>
            </div>
            <ul class="bottom mb clear">

            </ul>
            <div>
                <IUnitList></IUnitList>
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
    import vRadar from '@/components/chart/Radar'
    import vIestate from '@/components/chart/IestateRect'
    import vIhouse from '@/components/chart/IhouseRect'
    import vIperson from '@/components/chart/IpersonRect'
    import vChartPAndCFlow from '@/components/chart/ChartPAndCFlow'
    import vAlarmList from '@/views/alarm/AlarmList'
    import vChartSecurityPlatform from '@/components/chart/ChartSecurityPlatform'
    import vChartSkill from '@/components/chart/ChartSkill'
    import vMapHeader from '@/components/section/MapHeader'
    import IGoods from '@/components/chart/IGoods'
    import IRanking from '@/components/chart/IRanking'
    import ISpecial from '@/components/chart/ISpecial'
    import IUnitList from '@/components/chart/IUnitList'
    import vPasswordModal from '@/components/section/PasswordModal'
    import vUsernameModal from '@/components/section/UsernameModal'
    import vLogoutModal from '@/components/section/LogoutModal'
    import {createNamespacedHelpers} from 'vuex'
    import {city_name as cityName, city_code as cityCode} from '@/config'

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform');

    export default {
        data() {
            return {
                mapSrc: 'static/map/main2dmap.html?zone=' + cityCode
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
                let pw = "346";
                let ua = window.navigator.userAgent;
                if(ua.indexOf(".NET") !== -1 || ua.indexOf("Firefox") !== -1){
                    pw = "339";
                }
                return pw;
            },
            showPlaceName: function () {
                return this.$store.state.search.showName;
            },
            prePlaceName: function () {
                let provinceName = "贵州省";
                if(cityCode === "530100"){
                    provinceName = "云南省";
                }
                if(cityCode === "370500"){
                    provinceName = "山东省";
                }
                return this.$store.state.search.preName ? " ( " + this.$store.state.search.preName + " ) " : " ( "+ provinceName + " ) ";
            },
            currentTitleInfo: function () {
                let showTitle = "市区详情";
                let stage = "city";

                if(this.$store.state.platform.currentTownCode && this.$store.state.platform.currentTownCode !== "all"){
                    showTitle = "县区详情";
                    stage = "town";
                }
                if(this.$store.state.platform.currentTownShipCode && this.$store.state.platform.currentTownShipCode !== "all"){
                    showTitle = "乡镇详情";
                    stage = "townShip";
                }
                if(this.$store.state.platform.currentVillageCode && this.$store.state.platform.currentVillageCode !== "all"){
                    showTitle = "社区详情";
                    stage = "village";
                }
                if(!this.$store.state.search.preName){
                    showTitle = "市区详情";
                    stage = "city";
                }
                return {
                    showTitle: showTitle,
                    stage: stage
                };
            },
            ...mapState([
                'civilDefense',
                'iestate',
                'ipersonData',
                'ihouseData',
                'currentTownCode'
            ]),
            ...mapGetters([
                'queryParam',
                'currentName'
            ])
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
                'clickToPlatform'
            ]),
            setMapSrc() {
                let param = '';
                if (this.currentTownCode === 'all') {
                    param = cityCode;
                } else {
                    param = this.currentTownCode;
                }
                this.mapSrc = 'static/map/main2dmap.html?zone=' + param;
            }
        },
        watch: {
            queryParam() {
                this.setMapSrc();
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
            }
        },
        mounted() {
            this.getCivilDefense();
            this.getUnitData();
            this.getPopulationStatistics();
            this.getStateRooms();
            this.setMapSrc();
        },
        components: {
            TwoHeader,
            vSliderbar,
            vChartBox,
            vRadar,
            vIestate,
            vIhouse,
            vIperson,
            vChartPAndCFlow,
            vAlarmList,
            vChartSecurityPlatform,
            vChartSkill,
            vMapHeader,
            IGoods,
            IRanking,
            ISpecial,
            IUnitList,
            vPasswordModal,
            vUsernameModal,
            vLogoutModal
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

    .mr {
        margin-right: 20px;
    }

    .mb {
        margin-bottom: 20px;
    }

    .platform-root {
        width: 1920px;
        height: 1080px;
        background: url(../assets/image/platform_bg.png);
        .inheritWH {
            width: 100%;
            height: 100%;
        }
        .chart-skill {
            padding-right: 13px;
        }

        .body-wrap {
            padding: 0 0 16px 21px;
            width: 1920px;
            height: 990px;
            overflow: auto;
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
                    .transfer-city-style {
                        position: relative;
                        top: 4px;
                        left: 5px;
                        cursor: pointer;
                        background: url(../assets/image/click_to_city.png) no-repeat;
                    }
                    .transfer-town-style {
                        position: relative;
                        top: 4px;
                        left: 5px;
                        cursor: pointer;
                        background: url(../assets/image/click_to_town.png) no-repeat;
                    }
                    .transfer-township-style {
                        position: relative;
                        top: 4px;
                        left: 5px;
                        cursor: pointer;
                        background: url(../assets/image/click_to_townShip.png) no-repeat;
                    }
                    .transfer-village-style {
                        position: relative;
                        top: 4px;
                        left: 5px;
                        cursor: pointer;
                        background: url(../assets/image/click_to_village.png) no-repeat;
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
                margin-top: 65px;
                /*top: 95px;*/
                /*left: 40px;*/
                /*bottom: 0;*/
                /*right: 0;*/
                /*margin: auto;*/
            }
            .igoods {
                margin-top: 65px;
            }
            .chart-security-platform {
                margin-left: -5px;
            }
            .trip {
                margin-top: 18px;
                margin-left: -6px;
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
        }
    }
</style>
