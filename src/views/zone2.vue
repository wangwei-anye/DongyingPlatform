<template>
	<div class='platform-root'>
    <div class="c c1"></div>
    <div class="c c2"></div>
    <div class="c c3"></div>
		<v-header />
		<v-sliderbar />
		<div class="body-wrap">
			<div class="row1">
				<div class="left">
					<div class="commonbox">
						<v-index-wrap :component="modules.mod1.component" :data="modules.mod1.data" @on-add="addComponent(1)" @on-close="closeComponent(1)"></v-index-wrap>
					</div>
					<div class="commonbox">
						<v-index-wrap :component="modules.mod2.component" :data="modules.mod2.data" @on-add="addComponent(2)" @on-close="closeComponent(2)"></v-index-wrap>
					</div>
					<div class="commonbox">
						<v-index-wrap :component="modules.mod3.component" :data="modules.mod3.data" @on-add="addComponent(3)" @on-close="closeComponent(3)"></v-index-wrap>
					</div>
					<div class="commonbox">
						<v-index-wrap :component="modules.mod4.component" :data="modules.mod4.data" @on-add="addComponent(4)" @on-close="closeComponent(4)"></v-index-wrap>
					</div>
				</div>
				<div class="middle">
					<v-map-header headerTitle="GIS地图"></v-map-header>
					<iframe style="width:100%;height:100%;border:0;margin-top:6px;" :src="mapSrc"></iframe>
				</div>
				<div class="right">
					<v-chart-box boxType='orthogon' hrefto="/index/alarm" iconName='alarm' :w="413" :h="644" boxTitle="实时告警">
						<v-alarmList></v-alarmlist>
					</v-chart-box>
				</div>
			</div>
			<div class="row2">
				<div class="commonbox">
					<v-index-wrap :component="modules.mod5.component" :data="modules.mod5.data" @on-add="addComponent(5)" @on-close="closeComponent(5)"></v-index-wrap>
				</div>
				<div class="commonbox">
					<v-index-wrap :component="modules.mod6.component" :data="modules.mod6.data" @on-add="addComponent(6)" @on-close="closeComponent(6)"></v-index-wrap>
				</div>
				<div class="commonbox">
					<v-index-wrap :component="modules.mod7.component" :data="modules.mod7.data" @on-add="addComponent(7)" @on-close="closeComponent(7)"></v-index-wrap>
				</div>
				<div class="commonbox">
					<v-index-wrap :component="modules.mod8.component" :data="modules.mod8.data" @on-add="addComponent(8)" @on-close="closeComponent(8)"></v-index-wrap>
				</div>
				<div class="commonbox" style="width: 380px !important;margin-right: 0px !important;">
					<v-index-wrap style="width: 380px !important;" :component="modules.mod9.component" :data="modules.mod9.data" @on-add="addComponent(9)" @on-close="closeComponent(9)"></v-index-wrap>
                </div>
			</div>
		</div>
		<v-password-modal />
		<v-username-modal />
		<v-logout-modal />
		<v-modal v-model="appcenterModal">
			<v-appcenter @on-close="appcenterClose" @on-selected="selectedComponent"></v-appcenter>
		</v-modal>
	</div>
</template>

<script>

    import vHeader from '@/components/section/Header_zone'
    import vSliderbar from '@/components/section/Sliderbar'
    import vIndexWrap from '@/components/IndexWrap'
    import vChartBox from '@/components/ChartBox'
    import vRadar from '@/components/chart/Radar'
    import vIestate from '@/components/chart/Iestate'
    import vIhouse from '@/components/chart/Ihouse2'
    import vIperson from '@/components/chart/Iperson'
    import vDoordata from '@/components/chart/Doordata'
    import vDoorphoto from '@/components/chart/Doorphoto'
    import vCameranow from '@/components/chart/Cameranow'
    import vChartPAndCFlowBox from '@/components/chart/ChartPAndCFlowBox'
    import vAlarmList from '@/views/alarm/AlarmList'
    import vChartSecurityPlatform from '@/components/chart/ChartSecurityPlatform'
    import vChartSkill from '@/components/chart/ChartSkill'
    import vMapHeader from '@/components/section/MapHeader'
    import IGoods from '@/components/chart/IGoods'
    import IRanking from '@/components/chart/IRankingwrap'
    import ISpecialBox from '@/components/chart/ISpecialBox'
    import vPasswordModal from '@/components/section/PasswordModal'
    import vUsernameModal from '@/components/section/UsernameModal'
    import vLogoutModal from '@/components/section/LogoutModal'
    import { createNamespacedHelpers } from 'vuex'
    import { city_code } from '../config.js'
    import vAppcenter from '@/components/Appcenter'
    import vModal from '@/components/Modal'
    import api from '@/API/platform'
    import vCarFlow_zone from '@/components/chart/CarFlow_zone'
    import vIpersonFlow from '@/components/chart/IpersonFlow'
    import vCarData_zone from '@/components/chart/CarData_zone'
    import vCarVistor from '@/components/chart/ChartVistor'
    import { zoneMapSrc } from '../config'

	const {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('platform');

	export default {
		data() {
			return {
				mapSrc: zoneMapSrc + '?unitid=4557',
				appcenterModal: false,
				curId: 0,
				modules: {
					mod1: {
						data: {},
						component: null
					},
					mod2: {
						data: {},
						component: null
					},
					mod3: {
						data: {},
						component: null
					},
					mod4: {
						data: {},
						component: null
					},
					mod5: {
						data: {},
						component: null
					},
					mod6: {
						data: {},
						component: null
					},
					mod7: {
						data: {},
						component: null
					},
					mod8: {
						data: {},
						component: null
					},
					mod9: {
						data: {},
						component: null
					}
				}
			}
		},
		computed: {
			...mapState([
				'civilDefense',
				'iestate',
				'ipersonData',
				'ihouseData',
        'currentTownCode',
        'personDateCount'
			]),
			...mapGetters([
				'queryParam'
			]),
			editmodeStatus: function() {
				return this.$store.state.editmode.status;
			},
			defaultLayout: function() {
				return this.$store.state.editmode.defaultLayout;
			},
			customLayout: function() {
				return this.$store.state.editmode.customLayout;
			},
			coms: function() {
				return [{
						data: null,
						component: vCarFlow_zone
					},
					{
						data: this.ipersonData,
						component: vIperson
					},
					{
						data: this.personDateCount,
						component: vIpersonFlow
					},
					{
						data: {},
						component: vCarData_zone
					},
					{
						data: this.ihouseData,
						component: vIhouse
					},
					{
						data: {},
						component: vDoordata
					},
					{
						data: {},
						component: vCameranow
					},
					{
						data: {},
						component: vDoorphoto
					},
					{
						data: {},
						component: vCarVistor
					},
					{
						data: {},
						component: null
					},
					{
						data: {},
						component: null,
					},
					{
						data: {},
						component: null
					}
				];
			}
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
				'getUnitCarData'
			]),
			setMapSrc() {
        // let param = '';
				// if(this.currentTownCode === 'all') {
				// 	param = city_code
				// } else {
				// 	param = this.currentTownCode;
				// }
				this.mapSrc = zoneMapSrc + '?' + this.queryParam;
			},
			addComponent(id) {
				this.appcenterModal = true;
				this.curId = id;
			},
			closeComponent(id) {
				this.$store.commit('editmode/setCustomLayout', {
					id: id - 1,
					item: null
				});
				this.modules['mod' + id] = {
					data: {},
					component: null
				}
			},
			selectedComponent(item) {
				if(this.curId) {
					let relatived = {
						id: this.curId - 1,
						item: item
					};
					this.$store.commit('editmode/setCustomLayout', relatived);
					this.modules['mod' + this.curId] = this.coms[item.id - 1];
				}
			},
			appcenterClose() {
				this.appcenterModal = false;
			},
			initComponents() {
				setTimeout(() => {
					// if(this.editmodeStatus === 'default') {
					// 	this.defaultLayout.forEach((item, index) => {
					// 		this.modules['mod' + (index + 1)] = this.coms[item.id - 1];
					// 	})
					// } else {
					// 	this.customLayout.forEach((item, index) => {
					// 		if(item !== null) {
					// 			this.modules['mod' + (index + 1)] = this.coms[item.id - 1];
					// 		}
					// 	})
          // }
          this.coms.forEach((item, index) => {
            this.modules['mod' + (index+1)] = item
          });
				}, 500);
			},
			deleteComponents() {
				[1, 2, 3, 4, 5, 6, 7, 8].forEach((item, index) => {
					this.modules['mod' + (index + 1)] = {
						data: {},
						component: null
					}
				})
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
				this.getUnitCarData();

				this.initComponents();
			},
			editmodeStatus() {
				this.deleteComponents();
				this.initComponents();
			}
		},
		created() {
			
		},
		mounted() {
			this.getCivilDefense()

			this.getUnitData()
			this.getPopulationStatistics()
			this.getStateRooms()
			this.getUnitCarData();

			this.setMapSrc()

			this.initComponents();
		},
		components: {
			vHeader,
			vSliderbar,
			vIndexWrap,
			vChartBox,
			vRadar,
			vIestate,
			vIhouse,
      vIperson,
      vDoordata,
      vDoorphoto,
      vCameranow,
			vChartPAndCFlowBox,
			vAlarmList,
			vChartSecurityPlatform,
			vChartSkill,
			vMapHeader,
			IGoods,
			IRanking,
			ISpecialBox,
			vPasswordModal,
			vUsernameModal,
			vLogoutModal,
			vAppcenter,
			vModal,
      vCarFlow_zone,
      vIpersonFlow,
      vCarData_zone,
      vCarVistor
		}
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
    position: relative;
		width: 1920px;
		height: 1080px;
		background: url(../assets/image/platform_bg.jpg);
    .c{
      position: absolute;
      width: 350px;
      height: 352px;
      background: url(../assets/image/cl-icon.png) no-repeat;
      transform-origin: center center;
    }
    .c1{
      top: -69px;
      left: -63px;
      animation: c1rotate linear 12s infinite;
    }
    .c2 {
      top: 70px;
      left: 130px;
      transform: scale(.3);
      animation: c2rotate linear 6s infinite reverse;
    }
    .c3{
      right: -150px;
      bottom: 250px;
      transform: scale(.7);
      animation: c3rotate linear 12s infinite;
    }
		.body-wrap {
			padding: 20px;
			width: 1920px;
			height: 990px;
			.commonbox {
				position: relative;
				height: 301px;
				overflow: hidden;
				// background: rgba(255, 255, 0, .3);
			}
			.row1 {
				height: 622px;
				overflow: hidden;
				.left {
					float: left;
					width: 730px;
					height: 100%;
					margin-top: -20px;
					.commonbox {
						float: left;
						margin-top: 20px;
					}
					.commonbox:nth-of-type(even) {
						margin-left: 20px;
					}
				}
				.middle {
					float: left;
					width: 697px;
					height: 100%;
					// background: rgba(255, 255, 0, .3);
					margin-left: 20px;
					overflow: hidden;
				}
				.right {
					margin-left: 20px;
					float: left;
					width: 413px;
					height: 100%;
					// background: rgba(255, 255, 0, .3);
					overflow: hidden;
				}
			}
			.row2 {
				margin-top: 20px;
				height: 301px;
				overflow: hidden;
				.commonbox {
					float: left;
					margin-right: 20px;
				}
			}
		}
	}
  @keyframes c1rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes c2rotate {
    0% { transform: scale(.3) rotate(0deg); }
    100% { transform: scale(.3) rotate(360deg); }
  }
  @keyframes c3rotate {
    0% { transform: scale(.7) rotate(0deg); }
    100% { transform: scale(.7) rotate(360deg); }
  }
</style>