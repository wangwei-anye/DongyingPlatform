<!-- 小区平台页面 -->
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
							<v-chart-box hrefto='/index/trip' boxType='orthogon' iconName='car' :w="257" :h="311" boxTitle="车场流量" style='margin: auto;'>
								<v-car-flow :carFlow='carDateCountFilter' style="padding-top: 20px;"></v-car-flow>
							</v-chart-box>
						</li>
						<li class="fl mr mb">
							<v-iperson-number :data="pNumberData" :size="[484, 311]"></v-iperson-number>
						</li>
					</ul>
					<ul class="clear">
						<li class="fl mr">
							<v-iperson-flow :data="personDateCount" :size="[257, 311]"></v-iperson-flow>
						</li>
						<li class="fl mr">
							<v-chart-box hrefto='/index/trip' boxType='orthogon' iconName='car' :w="484" :h="311" boxTitle="车场数据" style='margin: auto;'>
								<v-car-data :carData='unitCarData'></v-car-data>
							</v-chart-box>
						</li>
					</ul>
				</div>
				<div class="fl">
					<div class="map mr">
						<v-map-header headerTitle="小区地图"></v-map-header>
						<iframe :src="mapSrc"></iframe>
					</div>
				</div>
				<div class="fl">
					<div class="mr mb">
						<v-chart-box boxType='orthogon' hrefto="/index/alarm" iconName='alarm' :w="413" :h="311" boxTitle="今日告警">
							<v-alarmList></v-alarmlist>
						</v-chart-box>
					</div>
					<div class="mr">
						<v-ihouse :data="ihouseData" :info="'left'" :size="[413, 313]"></v-ihouse>
					</div>
				</div>
			</div>
			<ul class="bottom clear">
				<li class="fl mr">
					<v-chart-box hrefto='/index/watch' boxType='polygon' iconName='prevent' :w="258" :h="290" boxTitle="人防数据">
						<v-radar class="inheritWH" :data="civilDefense" />
					</v-chart-box>
				</li>
				<li class="fl mr">
					<v-chart-box hrefto="/index/watch" boxType='polygon' iconName='prevent' :w="349" :h="290" boxTitle="物防数据">
						<IGoods class="igoods"></IGoods>
					</v-chart-box>
				</li>
				<li class="fl mr">
					<v-chart-box hrefto="/index/watch" boxType='polygon' iconName='prevent' :w="349" :h="290" boxTitle="技防数据">
						<v-chartSkill class="chart-skill"></v-chartSkill>
					</v-chart-box>
				</li>
				<li class="fl mr">
					<v-chart-box hrefto="/index/security" boxType='polygon' iconName='patrol' :w="430" :h="290" boxTitle="安防巡更">
						<v-chartSecurityPlatform class="chart-security-platform"></v-chartSecurityPlatform>
					</v-chart-box>
				</li>
				<li class="fl mr">
					<v-chart-box hrefto="/index/estate" boxType='polygon' iconName='chart' :w="413" :h="290" boxTitle="电、水、天然气用量">
						<IProperty style="margin-top: 30px;"></IProperty>
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
	import vMapHeader from '@/components/section/MapHeader'
	import vRadar from '@/components/chart/Radar'
	import vCarFlow from '@/components/chart/CarFlow'
	import vIpersonNumber from '@/components/chart/IpersonNumber'
	import vIhouse from '@/components/chart/Ihouse2'
	import vAlarmList from '@/views/alarm/AlarmList'
	import vChartPAndCFlow from '@/components/chart/ChartPAndCFlow'
	import vChartSkill from '@/components/chart/ChartSkill'
	import vChartSecurityPlatform from '@/components/chart/ChartSecurityPlatform'
	import vIpersonFlow from '@/components/chart/IpersonFlow'
	import IGoods from '@/components/chart/IGoods'
	import IProperty from '@/components/chart/IProperty'
	import vPasswordModal from '@/components/section/PasswordModal'
	import vUsernameModal from '@/components/section/UsernameModal'
	import vLogoutModal from '@/components/section/LogoutModal'
	import vCarData from '@/components/chart/CarData'
	import { createNamespacedHelpers } from 'vuex'
	import http from '@/utils/http'
	import { zoneMapSrc } from '../config'

	const {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('platform')

	export default {
		data() {
			return {
				mapSrc: zoneMapSrc + '?unitid=4557',
				pNumberData: {
					numbers: [],
					sexs: []
        },
        timer: null
			}
		},
		computed: {
			...mapState([
				'civilDefense',
				'iestate',
				'ipersonData',
				'ihouseData',
				'currentTownCode',
				'currentUnitId',
        'unitCarData',
        'personDateCount'
			]),
			...mapGetters([
				'queryParam',
				'carDateCountFilter'
			])
		},
		components: {
			vHeader,
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
			vPasswordModal,
			vUsernameModal,
			vLogoutModal,
			vCarData
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
        'getPersonDateCount'
			]),
			setMapSrc() {
				let param = '';
				if(this.currentUnitId === 'all') {
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
					if(res.data.success === true) {
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
						]
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
						]
						this.pNumberData = {
							numbers: numbers,
							sexs: sexs
						}
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
        } catch(e) {
          console.log("Catch Error in queryParam watch: ", e)
        }
			}
		},
		mounted() {
			this.getCivilDefense()
			this.getUnitData()
			this.getPopulationStatistics()
			this.getStateRooms()
			this.getPNum()
			this.getCarDateCount();
			this.getUnitCarData();
      this.setMapSrc();
      this.getPerson();
		},
	}
</script>

<style lang="scss" scoped>
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
		.body-wrap {
			padding: 20px 0 16px 21px;
			width: 1920px;
			height: 990px;
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
			.chart-skill {
				padding-bottom: 10px;
				padding-right: 13px;
			}
			.chart-security-platform {
				margin-left: -5px;
			}
			.igoods {
				margin-top: 15px;
			}
		}
	}
</style>
