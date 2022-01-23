<!-- 平台页面 -->
<!-- Author: Tim -->
<template>
  <div class='platform-root'>
    <v-header />
    <v-sliderbar />
    <div class="body-wrap">
      <div class="top clear mb">
        <div class="fl">
          <ul class="clear">
            <li class="fl mr mb">
              <v-iestate :data="iestate" :size="[257, 311]" />
            </li>
            <li class="fl mr mb">
              <v-ihouse :data="ihouseData" :info="'right'" :size="[485, 312]"></v-ihouse>
            </li>
          </ul>
          <ul class="clear">
            <li class="fl mr">
              <v-iperson :data="ipersonData" :size="[257, 311]"></v-iperson>
            </li>
            <li class="fl mr">
              <v-chart-box hrefto="/index/trip" boxType='orthogon' iconName='volume_of_flow' :w="484" :h="311" boxTitle="实时人流量&车流量">
                <v-chartPAndCFlow class="trip"></v-chartPAndCFlow>
              </v-chart-box>
            </li>
          </ul>
        </div>
        <div class="fl">
          <div class="map mr">
            <!-- <v-map-header headerTitle="居民活动轨迹"></v-map-header> -->
            <iframe :src="mapSrc"></iframe>
          </div>
        </div>
        <div class="fl">
          <div class="mr">
            <v-chart-box boxType='orthogon'  hrefto="/index/alarm" iconName='alarm' :w="413" :h="644" boxTitle="今日告警">
              <v-alarmList></v-alarmlist>
            </v-chart-box>
          </div>
          <!--<div class="mr">
            <v-chart-box boxType='orthogon' hrefto='/index/safety' iconName='ranking' :w="413" :h="313" boxTitle="小区发案指数排行">
              <IRanking></IRanking>
            </v-chart-box>
          </div>-->
        </div>
      </div>
      <ul class="bottom clear">
        <li class="fl mr">
          <v-chart-box hrefto='/index/watch' boxType='polygon' iconName='prevent' :w="258" :h="290" boxTitle="人防数据">
            <v-radar class="inheritWH" :data="civilDefense" />
          </v-chart-box>
        </li>
        <li class="fl mr">
          <v-chart-box hrefto='/index/watch' boxType='polygon' iconName='prevent' :w="349" :h="290" boxTitle="物防数据">
            <IGoods class="igoods"></IGoods>
          </v-chart-box>
        </li>
        <li class="fl mr">
          <v-chart-box hrefto='/index/watch' boxType='polygon' iconName='prevent' :w="349" :h="290" boxTitle="技防数据">
            <v-chartSkill class="chart-skill"></v-chartSkill>
          </v-chart-box>
        </li>
        <li class="fl mr">
          <v-chart-box hrefto='/index/security' boxType='polygon' iconName='patrol' :w="430" :h="290" boxTitle="安防巡更">
            <v-chartSecurityPlatform class="chart-security-platform"></v-chartSecurityPlatform>
          </v-chart-box>
        </li>
        <li class="fl mr">
          <v-chart-box hrefto='/index/special' boxType='polygon' iconName='special' :w="413" :h="290" boxTitle="特殊群体" class="special-wrap">
            <ISpecial class="special"></ISpecial>
          </v-chart-box>
        </li>
      </ul>
    </div>
    <v-password-modal />
    <v-username-modal />
    <v-logout-modal />
  </div>
</template>

<script>
import vHeader from '@/components/section/Header'
import vSliderbar from '@/components/section/Sliderbar'
import vChartBox from '@/components/ChartBox'
import vRadar from '@/components/chart/Radar'
import vIestate from '@/components/chart/Iestate'
import vIhouse from '@/components/chart/Ihouse2'
import vIperson from '@/components/chart/Iperson'
import vChartPAndCFlow from '@/components/chart/ChartPAndCFlow'
import vAlarmList from '@/views/alarm/AlarmList'
import vChartSecurityPlatform from '@/components/chart/ChartSecurityPlatform'
import vChartSkill from '@/components/chart/ChartSkill'
import vMapHeader from '@/components/section/MapHeader'
import IGoods from '@/components/chart/IGoods'
import IRanking from '@/components/chart/IRanking'
import ISpecial from '@/components/chart/ISpecial'
import vPasswordModal from '@/components/section/PasswordModal'
import vUsernameModal from '@/components/section/UsernameModal'
import vLogoutModal from '@/components/section/LogoutModal'
import { createNamespacedHelpers } from 'vuex'
import { city_code } from '../config.js'

const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform')

export default {
  data() {
    return {
      mapSrc: 'static/map/main2dmap.html?'
    }
  },
  computed: {
    ...mapState([
      'civilDefense',
      'iestate',
      'ipersonData',
      'ihouseData',
      'currentTownCode'
    ]),
    ...mapGetters([
      'queryParam'
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
      'getPeopleFlow'
    ]),
    setMapSrc() {
      let param = '';
      // if (this.currentTownCode === 'all') {
      //   param = city_code
      // } else {
      //   param = this.currentTownCode;
      // }
      this.mapSrc = 'static/map/main2dmap.html?'+this.queryParam;
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
    this.getCivilDefense()
    this.getUnitData()
    this.getPopulationStatistics()
    this.getStateRooms()
    this.setMapSrc()
  },
  components: {
    vHeader,
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
    vPasswordModal,
    vUsernameModal,
    vLogoutModal
  }
}
</script>

<style lang="scss" scoped>
  .mr {margin-right: 20px;}
  .mb {margin-bottom: 20px;}
  .platform-root {
    width: 1920px; height: 1080px;
    background: url(../assets/image/platform_bg.png);
    .inheritWH {width: 100%; height: 100%;}

    .body-wrap {
      padding: 20px 0 16px 21px; width: 1920px; height: 990px;
      .special-wrap {
        position: relative;
        top: 0px;
        left: 0px;
      }
      .special {
        text-align: center;
        margin-top: 10px;
        /*position: absolute;*/
        /*top: 45px;*/
        /*left: 40px;*/
        /*bottom: 0;*/
        /*right: 0;*/
        /*margin: auto;*/
      }
      .trip {
        margin-top: 12px;
        margin-left: -2px;
      }
      .chart-skill {
        padding-right: 12px;
      }
      .chart-security-platform {
        margin-left: -5px;
      }
      .igoods {
        margin-top: 15px;
      }

      .top {
        .map {
          width: 661px; height: 644px;
          iframe {margin-top: 0px; border:none; /*border: 1px solid rgba(109, 205, 255, .2);*/ width: 665px; height: 644px; overflow: hidden;}
        }
      }
    }
  }
</style>
