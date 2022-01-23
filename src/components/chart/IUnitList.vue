<template>
    <!-- 小区列表 -->
    <div class="estate-list">
        <v-panel title='小区列表' class='v-panel' :style=pStyle>
            <div class="estate-search">
                <vSearchbar placeholder="请输入小区名称" @searchHandler="searchUnit"></vSearchbar>
            </div>
            <div class="estate-detail" v-if="!unitList || unitList.length == 0">
                <div class="left-top1"></div>
                <div class="left-top2"></div>
                <div class="right-top1"></div>
                <div class="right-top2"></div>
                <div class="left-bottom1"></div>
                <div class="left-bottom2"></div>
                <div class="right-bottom1"></div>
                <div class="right-bottom2"></div>
                <div class="detail-container" style="color: #fff; text-align: center; font-size: 16px;">
                    小区不存在，请重新输入
                </div>
            </div>
            <div class="estate-detail" v-for="item in unitList">
                <div class="left-top1"></div>
                <div class="left-top2"></div>
                <div class="right-top1"></div>
                <div class="right-top2"></div>
                <div class="left-bottom1"></div>
                <div class="left-bottom2"></div>
                <div class="right-bottom1"></div>
                <div class="right-bottom2"></div>
                <div class="detail-container">
                    <div class="detail-info">
                        <ul>
                            <li>
                                <label>
                                    <i class="icon iconfont icon-font-xiaoqu"></i>
                                    <b :title="item.unit_name">{{ item.unit_name }}</b>
                                </label>
                            </li>
                            <li>
                                <span v-if="item.unit_type == 1">小区类型：开放式</span>
                                <span v-else-if="item.unit_type == 2">小区类型：封闭式</span>
                                <span v-else>小区类型：混合式</span>
                            </li>
                            <li>
                                <span>地址：<b :title="item.address">{{ item.address }}</b></span>
                            </li>
                            <li>
                                <span>经纬度：{{ item.lng }}，{{ item.lat }}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="detail-other">
                        <ul>
                            <li><i class="icon iconfont icon-font-fangwu"></i></li>
                            <li><label>房屋数量（户）</label></li>
                            <li><span>{{ item.house_count }}</span></li>
                        </ul>
                    </div>
                    <div class="detail-other">
                        <ul>
                            <li><i class="icon iconfont icon-font-shiyourenkou"></i></li>
                            <li><label>人口数量（人）</label></li>
                            <li><span>{{ item.population_count }}</span></li>
                        </ul>
                    </div>
                    <div class="detail-other">
                        <ul>
                            <li><i class="icon iconfont icon-font-70"></i></li>
                            <li><label>用电量（kwh）</label></li>
                            <li><span>{{ item.electric_count }}</span></li>
                        </ul>

                    </div>
                    <div class="detail-other">
                        <ul>
                            <li><i class="icon iconfont icon-font-shuifei"></i></li>
                            <li><label>用水量（t）</label></li>
                            <li><span>{{ item.water_count }}</span></li>
                        </ul>
                    </div>
                    <div class="detail-other">
                        <ul>
                            <li><i class="icon iconfont icon-font-tianranqi"></i></li>
                            <li><label>天然气（m<sup>3</sup>）</label></li>
                            <li><span>{{ item.gas_count }}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class='page-container'>
                <v-pagination :pageSize="3" :total="totalNum" :pageIndex="currentPage" @toPage="toPage"
                              class="pageBar"></v-pagination>
            </div>
        </v-panel>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import vButton from '@/components/Button'
    import vPanel from '@/components/Panel'
    import vSearchbar from '@/components/Searchbar'
    import vPagination from '@/components/Pagination'
    import axios from '../../utils/http.js'
    import {province_code as provinceCode, city_code as cityCode} from '@/config'

    export default {
        name: 'IUnitList',
        components: {
            vButton,
            vPanel,
            vSearchbar,
            vPagination
        },
        data() {
            return {
                btnInfo: {
                    text: '搜 索'
                },
                currentArea: '铜仁市',
                tmpArea: '',
                currentProvince: '',
                currentCity: '',
                townList: [],
                currentTown: 'all',
                townShipList: [],
                currentTownShip: 'all',
                villageList: [],
                currentVillage: 'all',
                unitList: [],
                currentUnit: 'all',
                unitmap: 'static/map/unitdatamap.html',
                estatecount: 0,
                chart1: null,
                chart2: null,
                chart3: null,
                chart4: null,
                currentUnitName: '',
                currentPage: 1,
                totalNum: 0
            }
        },
        computed: {
            pStyle: function () {
                let pw = "1866px";
                let ua = window.navigator.userAgent;
                if(ua.indexOf(".NET") !== -1 || ua.indexOf("Firefox") !== -1){
                    pw = "1859px";
                }
                return {
                    width: pw
                };
            },
        },
        mounted: function () {
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

            let rolePermission = this.$store.state.global.accountInfo.rolePermission;
            if (rolePermission.town_code && rolePermission.town_code !== '') {
                this.townList = [{town_code: rolePermission.town_code, town_name: rolePermission.town_name}];
                this.currentTown = rolePermission.town_code;
                this.currentArea = rolePermission.town_name;
            }
            if (rolePermission.township_code && rolePermission.township_code !== '') {
                this.townShipList = [{
                    township_code: rolePermission.township_code,
                    township_name: rolePermission.township
                }];
                this.currentTownShip = rolePermission.township_code;
                this.currentArea = rolePermission.township;
            }
            if (rolePermission.village_code && rolePermission.village_code !== '') {
                this.villageList = [{
                    village_code: rolePermission.village_code,
                    village_name: rolePermission.village_name
                }]
                this.currentVillage = rolePermission.village_code;
                this.currentArea = rolePermission.village_name;
            }
            if (this.$store.state.global.accountInfo.rolePermission.roleType.level == 6) {
                let tmparr = []
                if (this.$store.state.global.accountInfo.rolePermission.permiscodes) {
                    this.currentUnit = this.$store.state.global.accountInfo.rolePermission.permiscodes;
                }
                else {
                    this.currentUnit = this.$store.state.global.accountInfo.rolePermission.permiscodeSet[0];
                }
            }
            // 获取数据
            this.getList()
        },
        methods: {
            // 获取小区列表数据
            getList: function () {
                axios.post('/unit/list.do', {
                    province_code: this.currentProvince,
                    city_code: this.currentCity,
                    town_code: this.currentTown == 'all' ? '' : this.currentTown,
                    township_code: this.currentTownShip == 'all' ? '' : this.currentTownShip,
                    village_code: this.currentVillage == 'all' ? '' : this.currentVillage,
                    unit_name: this.currentUnitName,
                    pageNo: this.currentPage,
                    pageSize: this.currentUnit == 'all' ? 3 : 999
                }).then(response => {
                    if (response.data.success) {
                        if (this.currentUnit != 'all' && this.currentUnit != '') {
                            this.totalNum = 1;
                            let self = this;
                            this.unitList = response.data.data.items.filter(function (element) {
                                return element.unit_id == self.currentUnit;
                            })
                        }
                        else {
                            this.totalNum = response.data.data.totalCount;
                            this.unitList = response.data.data.items;
                        }
                    }
                    else {
                        console.log('获取小区列表数据失败')
                    }
                }).catch(err => {
                    console.log('获取小区列表数据失败')
                })
            },
            toPage: function (currentPage) {
                this.currentPage = currentPage;
                this.getList();
            },
            // 搜索小区
            searchUnit: function (name) {
                this.currentUnitName = name;
                this.currentPage = 1;
                this.getList();
            },
            // 按区域搜索
            btnSearch: function () {
                this.currentArea = this.tmpArea;
                let tmpmap = 'static/map/unitdatamap.html?city_code=' + this.currentCity;
                tmpmap += '&town_code=' + (this.currentTown == 'all' ? '' : this.currentTown);
                tmpmap += '&township_code=' + (this.currentTownShip == 'all' ? '' : this.currentTownShip);
                tmpmap += '&village_code=' + (this.currentVillage == 'all' ? '' : this.currentVillage);
                this.unitmap = tmpmap;
                this.currentUnitName = '';
                this.getDistribution();
                this.getStatistics();
                this.getList();
            }
        }
    }
</script>

<style lang="scss" scoped="scoped">
    .search-container {
        width: 100%;
        height: 100px;
        color: #3fa7ff;
        font-size: 18px;
        display: flex;
        align-items: center;

        display: -ms-flexbox;
        -ms-flex-align: center;
        .v-select {
            width: 160px;
            margin-right: 30px;
        }
        .v-btn {
            margin-left: 50px;
        }
    }

    .estate-distribute {
        margin-bottom: 20px;
        .map-chart {
            display: flex;
            display: -ms-flexbox;
        }
        .estate-map {
            display: inline-flex;
            flex: 1;

            display: -ms-inline-flexbox;
            -ms-flex: 1;

            height: 750px;
            padding: 15px 15px;
        }
        .estate-chart {
            display: inline-flex;

            height: 750px;
            flex: 1;

            display: -ms-inline-flexbox;
            -ms-flex: 1;
        }
    }

    .estate-survey {
        margin-bottom: 20px;
        .estate-survey-title {
            width: 100%;
            height: 57px;
            background-image: url('../../assets/image/securityCount-logo.png');
            background-repeat: no-repeat;
            .estate-survey-name {
                display: inline-block;
                font-size: 18px;
                color: #1cb1ff;
                padding-left: 57px;
                padding-top: 6px;
            }
            .estate-survey-count {
                display: inline-block;
                float: right;
                line-height: 57px;
                color: #fff;
                font-size: 36px;
                margin-right: 30px;
                small {
                    font-size: 50%;
                }
            }
        }
        .estate-survey-content {
            width: 100%;
            display: flex;

            display: -ms-flexbox;

            padding: 30px 0 50px 0;
            .estate-survey-chart {
                display: inline-flex;
                flex: 1;

                display: -ms-inline-flexbox;
                -ms-flex: 1;

                .chart-detail {
                    width: 100%;
                    height: 400px;
                }
            }
        }
    }

    .estate-list {
        margin-bottom: 20px;
        .estate-search {
            padding: 20px 20px;
            text-align: right;
        }
    }

    .estate-detail {
        margin: 0 20px 20px 20px;
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
            background: linear-gradient(0deg, rgba(0, 165, 255, .4), rgba(23, 87, 166, .4));
            display: flex;
            display: -ms-flexbox;
            .detail-info {
                width: 450px;
                display: inline-flex;
                flex-direction: column;

                display: -ms-inline-flexbox;
                -ms-flex-direction: column;

                color: #ffda2e;
                font-size: 18px;
                padding: 15px 15px;
                position: relative;
                font-weight: bold;
                label {
                    font-size: 30px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    i {
                        font-size: 48px;
                        font-weight: normal;
                        margin-right: 5px;
                    }
                }
                span {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                &:before {
                    content: '';
                    width: 1px;
                    height: 62%;
                    background-color: rgba(28, 177, 255, .4);
                    position: absolute;
                    right: 1px;
                    top: 19%;
                }
            }
            .detail-other {
                display: inline-flex;
                flex-direction: column;
                flex: 1;

                display: -ms-inline-flexbox;
                flex-direction: column;
                -ms-flex: 1;

                ul {
                    display: inline-block;
                }

                text-align: center;
                i {
                    font-size: 64px;
                    color: #1cb1ff;
                }
                label {
                    font-size: 18px;
                    color: #1cb1ff;
                }
                span {
                    color: #fff;
                    font-size: 30px;
                }
            }
        }
    }

    .page-container {
        text-align: center;
        padding-bottom: 20px;
    }
</style>