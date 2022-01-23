<template>
    <div class="watchindex">
        <div class="watch-security">
            <v-searchTabPanel></v-searchTabPanel>
        </div>
    </div>
</template>
<script>
import echarts from 'echarts'
import vChartBox from '@/components/ChartBox'
import vButton from '@/components/Button'
import vSearchTabPanel from './searchtabpanel'
import {province_code as provinceCode, city_code as cityCode} from '@/config'
import axios from '../../utils/http.js'

export default {
    name: 'searchindex',
    components: {
        vChartBox,
        vButton,
        vSearchTabPanel
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
            chart1: null,
            chart2: null,
            chart3: null,
            chart4: null,
            policecount: '',
            securitycount: '',
            teamcount: ''
        }
    },
    mounted: function() {
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
            this.townList = [{ town_code: rolePermission.town_code, town_name: rolePermission.town_name }];
            this.currentTown = rolePermission.town_code;
            this.currentArea = rolePermission.town_name;
        }
        if (rolePermission.township_code && rolePermission.township_code !== '') {
            this.townShipList = [{ township_code: rolePermission.township_code, township_name: rolePermission.township }];
            this.currentTownShip = rolePermission.township_code;
            this.currentArea = rolePermission.township;
        }
        if (rolePermission.village_code && rolePermission.village_code !== '') {
            this.villageList = [{ village_code: rolePermission.village_code, village_name: rolePermission.village_name }];
            this.currentVillage = rolePermission.village_code;
            this.currentArea = rolePermission.village_name;
        }
        if (this.$store.state.global.accountInfo.rolePermission.roleType.level == 6) {
            let tmparr = [];
            if (this.$store.state.global.accountInfo.rolePermission.permiscodes) {
                this.currentUnit = this.$store.state.global.accountInfo.rolePermission.permiscodes;
            } else {
                this.currentUnit = this.$store.state.global.accountInfo.rolePermission.permiscodeSet[0];
            }
        }
        let level = this.$store.state.global.accountInfo.rolePermission.roleType.level;
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.watchindex {
    padding: 0 0 20px;
}

.search-container {
    height: 100px;
    width: 100%;
    color: #3fa7ff;
    font-size: 18px;
    display: flex;
    align-items: center;
    label {
        color: #45c1fb;
        font-size: 20px;
        font-weight: bold;
        display: inline-flex;
        align-items: center;
        margin-right: 60px;
        i {
            font-size: 32px;
            margin-right: 5px;
        }
    }
    .v-select {
        width: 160px;
        margin-right: 30px;
    }
    .v-btn {
        margin-left: 50px;
    }
}

.bar-raddar {
    display: flex;
    padding: 10px 15px;
    height: 100%;
    .bar-chart {
        display: inline-flex;
        flex: 2;
        height: 100%;
    }
    .raddar-chart {
        display: inline-flex;
        flex: 1;
        height: 100%;
    }
}

.watch-security {
    width: 1655px;
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
    .people-security {
        display: inline-flex;
        ul li {
            height: 150px;
            line-height: 142px;
            align-items: center;
            text-indent: 30px;
            color: #fff;
            border-bottom: 1px solid #6279ac;
            &:last-child {
                border: 0;
            }
            i {
                font-size: 48px;
            }
            label {
                font-size: 16px;
                margin-left: 10px;
            }
            b {
                font-size: 24px;
            }
        }
    }
    .goods-security {
        display: inline-flex;
    }
    .technology-security {
        display: inline-flex;
    }
}

.security-bar-chart {
    width: 100%;
    height: 100%;
    padding: 10px 10px;
}
</style>