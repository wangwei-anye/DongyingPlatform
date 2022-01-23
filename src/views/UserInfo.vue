<template>
	<div class="user-info-wrap">
		<v-two-header title="个人信息" />
		<v-password-modal />
		<v-username-modal />
		<v-logout-modal />
		<div class="body">
			<div class="base-info">
				<h4>基本资料</h4>
				<div class="personal-info clear">
					<img class="fl" :src="userDetail.user_image" alt="用户头像" @error="loadError($event)">
					<div class="info-box fl">
						<h5>
              <span>{{ userDetail.user_name }}</span>
              <i v-show="userDetail.criminal_record == '0'"></i>
              <span v-show="userDetail.criminal_record == '0'">犯罪前科</span>
            </h5>
						<ul class="clear">
							<li class="fl first gender"><i></i>{{ userDetail.sex }}</li>
							<li class="fl second nation"><i></i>{{ userDetail.nation }}</li>
							<li class="fl third birth" :title="userDetail.birth"><i></i><span class="omit">{{ userDetail.birth }}</span></li>
							<li class="fl ID"><i></i>{{ userDetail.id_code }}</li>
						</ul>
						<ul class="clear">
							<li class="fl first marriage"><i></i>{{ filterMarriage(userDetail.marital_status) }}</li>
							<li class="fl second party" :title="filterPolitical(userDetail.political_status)"><i></i><span class="omit">{{ filterPolitical(userDetail.political_status) }}</span></li>
							<li class="fl third education" :title="filterDegree(userDetail.degree_education) + '—' + userDetail.school"><i></i><span class="omit">{{ filterDegree(userDetail.degree_education) }}—{{ userDetail.school }}</span></li>
							<li class="fl phone">
								<i></i>
								<div v-for="(phone, index) in userPhone" v-if="index < 5">
									{{ phone.telephone }}
									<a href="javascript:;" @click="mutatePhoneShow(index)">详情</a>
									<div class="poptip-content" v-show="phone.show">
										<h6>{{ phone.telephone }}</h6>
										<ul>
											<li>
												<span>品牌: {{ phone.phone_brand }}</span>
												<span>型号: {{ phone.phone_model }}</span>
											</li>
											<li>IMEI: {{ phone.device_imei }}</li>
											<li>MAC：{{ phone.device_mac }}</li>
											<li>UUID：{{ phone.device_uuid }}</li>
										</ul>
									</div>
								</div>
							</li>
						</ul>
						<ul class="clear">
							<li class="fl one native" :title="userDetail.native_place"><i></i><span class="omit">{{ userDetail.native_place }}</span></li>
							<li class="fl hometown" :title="userDetail.birth_place"><i></i><span class="omit">{{ userDetail.birth_place }}</span></li>
							<li class="fl address" :title="userDetail.address"><i></i><span class="omit">{{ userDetail.address }}</span></li>
						</ul>
						<ul class="clear">
							<li class="fl one company" :title="userDetail.work_unit"><i></i><span class="omit">{{ userDetail.work_unit }}</span></li>
							<li class="fl position" :title="userDetail.career"><i></i><span class="omit">{{ userDetail.career }}</span></li>
						</ul>
					</div>
				</div>
				<div class="house-info fl">
					<h5>房屋档案({{ userHouse.length }}套)</h5>
					<Carousel v-model="houseInfo" dots="none">
						<CarouselItem v-for="(house, index) in userHouse" key="index">
							<div class="item">
								<div class="item-content">
									<p>
										<span class="zone"><i></i>{{ house.unit_name }}</span>
										<span class="building">{{ house.building_name + house.room_name }}</span>
										<span class="rooms">{{ house.apartment_layout }}</span>
										<span class="people"><i></i>{{ house.people_count }}人居住</span>
										<!-- <span class="tenant fr"><i></i>租客</span> -->
									</p>
									<p>
										<span class="address"><i></i>{{ house.address }}</span>
									</p>
									<p class="house-staff">
										<span><i></i>房屋人员: </span>
									</p>
									<Carousel dots="none">
										<CarouselItem v-for="(people, index) in house.housePeople" key="index+100">
											<div class="item">
												<div class="item-content">
													<div v-for="group in people" style="display: inline-block">
														<img :src="group.user_image" style="width: 95px;height: 95px;padding-left: 10px;" @error="loadError($event)"><br>
														<span>{{ group.user_name }}</span><br>
														<span>{{ filterResident(group.user_type) }}</span>
													</div>
												</div>
											</div>

										</CarouselItem>
									</Carousel>
									<!--<ul class="clear">-->
									<!--<li class="fl" v-for="people in house.housePeople">-->
									<!--<img :src="people.user_image"><br>-->
									<!--<span>{{ people.user_name }}</span><br>-->
									<!--<span>{{ filterResident(people.user_type) }}</span>-->
									<!--</li>-->
									<!--</ul>-->
								</div>
							</div>
						</CarouselItem>
					</Carousel>
				</div>
				<div class="car-info fr">
					<h5>车辆档案({{ userCar.length }}辆)</h5>
					<Carousel v-model="carnInfo" dots="none">
						<CarouselItem v-for="(car, index) in userCar" key="index">
							<div class="item">
								<div class="item-content">
									<img src="../assets/image/userInfo/car.png" alt="">
									<p>
										<span>车牌: {{ car.plate }}</span>
										<span>车型: {{ car.car_type }}</span>
									</p>
									<p>
										<span>车品牌: {{ car.car_brand }}</span>
										<span>颜色: {{ car.car_color }}</span>
									</p>
									<p>
										<span>车系列: {{ car.car_model }}</span>
									</p>
								</div>
							</div>
						</CarouselItem>
					</Carousel>
				</div>
			</div>
			<!--<div class="relation-grid-map" style="padding-top: 40px;">
        <h4>告警记录</h4>
        <v-alarmRecord :IDcard='userDetail.id_code'></v-alarmRecord>
      </div>-->
			<div class="tab-list" @click="tabPage($event)">
				<div class="tab active" data-id="tabOne">活动时序图</div>
				<div class="tab" data-id="tabTwo">关系网格图</div>
				<div class="tab" data-id="tabThree">行为轨迹</div>
				<div class="tab" data-id="tabFour">车行轨迹</div>
			</div>
			<div class="active-sequence-chart tabOne">
				<h4>活动时序图</h4>
				<div>
					<v-active-sequence-chart :datum="recordDatum" @scrollToPeak="getRecordByInterval" />
				</div>
			</div>
			<div class="relation-grid-map tabTwo" style="display: none;">
				<h4>关系网格图</h4>
				<v-knowledge :houseUserId='houseUserId' :userId='userId'></v-knowledge>
			</div>
			<div class="relation-grid-map tabThree" style="padding-top: 40px;display: none;">
				<h4>行为轨迹</h4>
				<v-activeRecord :userId='userId'></v-activeRecord>
			</div>
			<div class="relation-grid-map tabFour" style="padding-top: 40px;display: none;">
				<h4>车行轨迹</h4>
				<v-carRecord :userId='userId'></v-carRecord>
			</div>
		</div>
	</div>
</template>

<script>
	import vTwoHeader from '@/components/section/TwoHeader'
	import vPasswordModal from '@/components/section/PasswordModal'
	import vUsernameModal from '@/components/section/UsernameModal'
	import vLogoutModal from '@/components/section/LogoutModal'
	import vActiveSequenceChart from '@/components/chart/ActiveSequenceChart'
	import vKnowledge from '@/views/knowledge'
	import vActiveRecord from '@/views/record/ActiveRecord'
	import vCarRecord from '@/views/record/CarRecord'
	import vAlarmRecord from '@/views/record/AlarmRecord'
	import $ from 'jquery'

	import { createNamespacedHelpers } from 'vuex'

	const {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('userInfo')

	export default {
		data() {
			return {
				'houseInfo': 0,
				'carnInfo': 0,
			}
		},
		computed: {
			...mapState([
				'userDetail',
				'userId',
				'userDetail',
				'userHouse',
				'userCar',
				'userPhone',
				'userRecord',
				'scale',
				'houseUserId'
			]),
			...mapGetters([
				'recordDatum'
			])
		},
		methods: {
			tabPage: function(e) {
				$(e.target).addClass("active").siblings().removeClass("active");
				$(".tabOne").hide();
				$(".tabTwo").hide();
				$(".tabThree").hide();
				$(".tabFour").hide();
				$('.'+$(e.target).data("id")).show();
			},
			loadError: function(e) {
				$(e.target).attr('src', require('../assets/image/alarm/noAlarm.png'));
			},
			...mapActions([
				'getUserDetail',
				'getUserHouse',
				'getUserCar',
				'getUserPhone',
				'getRecordByInterval'
			]),
			...mapMutations({
				'mutatePhoneShow': 'MUTATE_PHONE_SHOW'
			}),
			filterMarriage(code) {
				let marriage = '';
				switch(code) {
					case '0':
						marriage = '已婚';
						break;
					case '1':
						marriage = '未婚';
						break;
				}
				return marriage;
			},
			filterPolitical(code) {
				let party = '';
				switch(code) {
					case '0':
						party = '中共党员';
						break;
					case '1':
						party = '中共预备党员';
						break;
					case '2':
						party = '共青团员';
						break;
					case '3':
						party = '民革党员';
						break;
					case '4':
						party = '民盟党员';
						break;
					case '5':
						party = '民建会员';
						break;
					case '6':
						party = '民进会员';
						break;
					case '7':
						party = '农工党党员';
						break;
					case '8':
						party = '致公党党员';
						break;
					case '9':
						party = '九三学社社员';
						break;
					case '10':
						party = '台盟盟员';
						break;
					case '11':
						party = '无党派人士';
						break;
					case '12':
						party = '群众';
						break;
				}

				return party;
			},
			filterDegree(code) {
				let degree_education = '';
				switch(code) {
					case '0':
						degree_education = '博士';
						break;
					case '1':
						degree_education = '硕士';
						break;
					case '2':
						degree_education = '本科';
						break;
					case '3':
						degree_education = '大专';
						break;
					case '4':
						degree_education = '中专和中技';
						break;
					case '5':
						degree_education = '技工学校';
						break;
					case '6':
						degree_education = '高中';
						break;
					case '7':
						degree_education = '初中';
						break;
					case '8':
						degree_education = '小学';
						break;
					case '9':
						degree_education = '文盲与半文盲';
						break;
				}

				return degree_education;
			},
			filterResident(userType) {
				let user_type = ''
				switch(userType) {
					case '1':
						user_type = '租客';
						break;
					case '2':
						user_type = '业主';
						break;
					case '3':
						user_type = '家属';
						break;
				}
				return user_type;
			}
		},
		created() {
			this.getUserDetail();
			this.getUserHouse();
			this.getUserCar();
			this.getUserPhone();
			this.getRecordByInterval();
		},
		watch: {
			scale() {
				if(this.scale == 1) {
					this.getRecordByInterval();
				}
			}
		},
		components: {
			vTwoHeader,
			vPasswordModal,
			vUsernameModal,
			vLogoutModal,
			vActiveSequenceChart,
			vLogoutModal,
			vKnowledge,
			vActiveRecord,
			vCarRecord,
			vAlarmRecord
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
	
	.omit {
		position: absolute;
		bottom: 0;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	
	i {
		display: inline-block;
		position: relative;
		margin-right: 9px;
		background-image: url(../assets/image/userInfo/icons.png);
	}
	
	.user-info-wrap {
		width: 100%;
		height: 100%;
		background: url(../assets/image/userInfo/bg.png) no-repeat;
		.body {
			padding: 20px 28.5px 0;
			height: 990px;
			overflow: hidden;
			.base-info,
			.active-sequence-chart,
			.relation-grid-map {
				position: relative;
				margin-bottom: 20px;
				width: 1863px;
				h4 {
					position: absolute;
					top: 7px;
					left: 44px;
					font-size: 18px;
					color: #fff;
				}
			}
			.base-info {
				padding: 59px 31px 0 33px;
				height: 776px;
				background: url(../assets/image/userInfo/base_info_bg.png) no-repeat;
				.personal-info {
					margin-bottom: 30px;
					padding: 18px 0 0 18px;
					width: 1799px;
					height: 294px;
					img {
						margin-right: 18px;
						width: 230px;
						height: 256px;
					}
					.info-box {
						width: 1532px;
						height: 256px;
						font-size: 18px;
						color: #fff;
						h5 {
							margin-bottom: 16px;
							height: 36px;
							line-height: 36px;
							span:first-child {
								margin-right: 60px;
								font-size: 36px;
								color: #fff;
								font-weight: bold;
							}
							i {
								top: 4px;
								width: 25px;
								height: 25px;
								background-position: -210px -165px;
							}
							span:last-child {
								font-size: 24px;
								color: #ff502e;
								font-weight: bold;
							}
						}
						ul {
							margin-bottom: 18px;
							li {
								position: relative;
							}
						}
						.first {
							width: 125px;
						}
						.second {
							width: 160px;
						}
						.third {
							width: 220px;
						}
						.one {
							width: 355px;
						}
						.gender i {
							top: 6px;
							width: 30px;
							height: 25px;
							background-position: -262px -36px;
						}
						.nation i {
							top: 6px;
							width: 30px;
							height: 26px;
							background-position: -322px -35px;
						}
						.birth {
							i {
								top: 6px;
								width: 26px;
								height: 27px;
								background-position: -385px -35px;
							}
							span {
								width: 192px;
							}
						}
						.ID i {
							top: 6px;
							width: 30px;
							height: 27px;
							background-position: -443px -36px;
						}
						.marriage i {
							top: 6px;
							width: 30px;
							height: 30px;
							background-position: -210px -99px;
						}
						.party {
							i {
								top: 7px;
								width: 26px;
								height: 30px;
								background-position: -264px -99px;
							}
							span {
								width: 120px;
							}
						}
						.education {
							i {
								top: 6px;
								right: 3px;
								width: 30px;
								height: 26px;
								background-position: -322px -101px;
							}
							span {
								width: 190px;
							}
						}
						.phone {
							position: static;
							i {
								top: 6px;
								right: 2px;
								margin-right: 5px;
								width: 30px;
								height: 29px;
								background-position: -382px -99px;
							}
						}
						.native {
							i {
								top: 8px;
								width: 25px;
								height: 31px;
								background-position: -445px -99px;
							}
							span {
								width: 320px;
							}
						}
						.hometown {
							width: 376px;
							i {
								top: 2px;
								left: 2px;
								width: 25px;
								height: 31px;
								background-position: -445px -162px;
							}
							span {
								bottom: 6px;
								width: 350px;
							}
						}
						.address {
							i {
								top: 8px;
								width: 25px;
								height: 31px;
								background-position: -385px -162px;
							}
							span {
								width: 430px;
							}
						}
						.company {
							i {
								top: 6px;
								width: 26px;
								height: 26px;
								background-position: -324px -164px;
							}
							span {
								width: 315px;
							}
						}
						.position {
							i {
								top: 6px;
								width: 30px;
								height: 27px;
								background-position: -262px -164px;
							}
							span {
								width: 550px;
							}
						}
						.hometown {
							top: 6px;
							margin-right: 8px;
						}
						.phone div {
							display: inline-block;
							margin-right: 26px;
							a {
								color: #ffda2e;
							}
						}
						.poptip-content {
							position: absolute;
							top: 25px;
							z-index: 200;
							border-radius: 10px;
							margin-left: 70px;
							padding: 13px;
							background: rgba(51, 97, 179, .9);
						}
						.poptip-content:after {
							position: absolute;
							bottom: -14px;
							left: 10%;
							content: ' ';
							width: 0;
							height: 0;
							border-left: 10px solid transparent;
							border-right: 10px solid transparent;
							border-top: 15px solid rgba(51, 97, 179, .9);
						}
						.phone-one {
							left: 935px;
						}
						.phone-two {
							left: 1120px;
						}
						.poptip-content h6 {
							font-size: 16px;
							font-weight: bold;
						}
						.brand {
							margin-right: 10px;
						}
						.poptip-content ul {
							margin-bottom: 0;
							font-size: 16px;
						}
					}
				}
				.house-info,
				.car-info {
					width: 869px;
					height: 357px;
					h5 {
						margin-left: 86px;
						border-bottom: 1px solid rgba(28, 177, 255, .2);
						width: 697px;
						height: 60px;
						line-height: 60px;
						font-size: 24px;
						color: #1cb1ff;
						font-weight: bold;
						text-align: center;
					}
					.item {
						height: 296px;
						text-align: center;
						.item-content {
							display: inline-block;
							width: 697px;
							height: 296px;
							text-align: center;
							color: #1cb1ff;
							font-size: 18px;
							p {
								margin-bottom: 24px;
							}
						}
					}
				}
				.house-info {
					.item {
						.item-content {
							p:first-child {
								margin-top: 10px;
							}
							p {
								text-align: left;
								span {
									display: inline-block;
								}
								.zone {
									width: 161px;
								}
								.building {
									width: 200px;
								}
								.rooms {
									width: 210px;
								}
								.zone i {
									width: 20px;
									height: 19px;
									background-position: -160px -168px;
								}
								.people i,
								span i {
									width: 20px;
									height: 17px;
									background-position: -80px -169px;
								}
								.tenant i {
									top: 3px;
									width: 26px;
									height: 20px;
									background-position: -34px -167px;
								}
								.address i {
									width: 18px;
									height: 20px;
									background-position: -121px -167px;
								}
								i {
									top: 2px;
								}
							}
							p.house-staff {
								margin-bottom: 0;
							}
							ul {
								display: inline-block;
								li {
									margin-right: 42px;
									img {
										width: 82px;
										height: 91px;
									}
								}
								li:last-child {
									margin: 0;
								}
							}
						}
					}
				}
				.car-info {
					.item {
						.item-content {
							img {
								margin: 16px 0 24px 35px;
							}
							p {
								padding: 0 111px;
								text-align: left;
								span:first-child {
									display: inline-block;
									width: 378px;
								}
							}
						}
					}
				}
			}
			.tab-list {
				height: 50px;
				font-size: 18px;
				.tab {
					width: 150px;
					height: 50px;
					float: left;
					color: #1cb1ff;
					text-align: center;
					line-height: 50px;
					box-sizing: border-box;
					cursor: pointer;
				}
				.tab.active {
					color: #fff;
					line-height: 43px;
					border-top: 4px solid #1cb1ff;
					background-color: rgba(15, 145, 255, 0.1);
					;
				}
			}
			.active-sequence-chart {
				padding-top: 137px;
				height: 922px;
				background: url(../assets/image/userInfo/active_sequence_chart.png) no-repeat;
			}
			.relation-grid-map {
				height: 950px;
				background: url(../assets/image/userInfo/relation_grid_map.png) no-repeat;
			}
		}
		.body:hover {
			overflow: auto;
		}
	}
</style>