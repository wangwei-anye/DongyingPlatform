<template>
	<div class="index">
    <div class="c c1"></div>
    <div class="c c2"></div>
    <div class="c c3"></div>
		<div class='header-root'>
			<span class="title">{{name}}</span>
			<div class="searchBar">
				<div class="search-form" v-show="showSearch">
					<i @click="showSearch = false"></i>
					<input type="text" @keyup.enter="search" @keyup.27="showSearch = false" v-model="keyWord" placeholder=" 姓名 / 电话 / 身份证 / 车牌号 / 区县 / 乡镇 / 社区 / 小区" />
				</div>
				<img class="icon-search" @click="search" src="../assets/image/header-icon-search.png" />
				<img class="icon-home" @click="toPath('/platform')" src="../assets/image/header-icon-home.png" />
				<img class="icon-user" src="../assets/image/header-icon-user.png" @click="toPath('/index/usercenter')" />
				<img class="icon-quit" src="../assets/image/header-icon-quit.png" @click="modifyLogoutModal(true)">
				<div class="info-tip" v-show="showInfoTips" @mouseleave="hideInfoTip" @mouseover="clearHideInfoTip">
					<ul>
						<li class="rolename" :title="global.accountInfo.rolePermission ? global.accountInfo.rolePermission.rolename : ' '">
							{{ global.accountInfo.rolePermission ? global.accountInfo.rolePermission.rolename : ' '}}
						</li>
						<li class="account">
							<div>账号：{{ global.accountInfo.account }}</div><span @click="modifyPasswordModal(true)">修改密码</span></li>
						<li class="name">
							<div>用户名：{{ global.accountInfo.username }}</div><i class="edit" @click="modifyUsernameModal(true)"></i></li>
						<li @click="toPath('/permission')">权限管理<i class="right"></i></li>
						<li @click="modifyLogoutModal(true)">退出</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="sliderbar">
			<ul @click="showDetail($event)">
				<li @click="toPath('/platform')"><i class="icon icon1"></i>首页</li>
				<!-- <li @click="toPath('/index/search')" class="search"><i class="icon icon2"></i>云搜索</li> -->
				<li @click="toPath('/index/estate')" class="estate"><i class="icon icon3"></i>小区数据</li>
				<li @click="toPath('/index/house')" class="house"><i class="icon icon4"></i>房屋数据</li>
				<li @click="toPath('/index/population')" class="population"><i class="icon icon5"></i>人口数据</li>
				<li @click="toPath('/index/trip')" class="trip"><i class="icon icon6"></i>出行记录</li>
				<li @click="toPath('/index/special')" class="special"><i class="icon icon7"></i>特殊群体</li>
				<!--<li @click="toPath('/index/watch')" class="watch"><i class="icon icon8"></i>治安防范体系</li>
				<li @click="toPath('/index/security')" class="security"><i class="icon icon9"></i>安防巡查</li>-->
				<li @click="toPath('/index/safety')" class="safety"><i class="icon icon10"></i>小区安全排行</li>
				<li @click="toPath('/index/monitor')" class="monitor"><i class="icon icon11"></i>实时监控</li>
				<li class="alarmCenter"><i class="icon icon12"></i>实时告警<i class="arrow"></i></li>
				<ul>
					<li @click="toPath('/index/alarm')" class="alarm subLi">实时告警</li>
					<li @click="toPath('/index/alarmDetail')" class="alarmDetail subLi">告警详情</li>
					<li @click="toPath('/index/alarmAnalyse')" class="alarmAnalyse subLi">警情分析</li>
				</ul>
				<li @click="toPath('/index/tdmap')" class="tdmap"><i class="icon icon13"></i>GIS地图</li>
				<li><i class="icon icon15"></i>系统设置<i class="arrow"></i></li>
				<ul>
					<li @click="toPath('/index/usercenter')" class="usercenter subLi">用户中心</li>
					<li @click="toPath('/index/permission')" class="permission subLi">权限管理</li>
					<li @click="toPath('/index/device')" class="device subLi">设备管理</li>
					<li @click="toPath('/index/logdata')" class="logdata subLi">日志数据</li>
				</ul>
				<!--<li><i class="icon icon14 securityCenter"></i>安防设置<i class="arrow"></i></li>
				<ul>
					<li @click="toPath('/index/watchset')" class="watchset subLi">治安防范标准设置</li>
       				<li @click="toPath('/index/securitySet')" class="securitySet subLi">安防巡查标准设置</li>
       				<li @click="toPath('/index/safetyset')" class="safetyset subLi">发案指数标准设置</li>
				</ul>-->
			</ul>
		</div>
		<v-password-modal />
		<v-username-modal />
		<v-logout-modal />
		<router-view class='contentPage'></router-view>
	</div>
</template>

<script>
	import router from '../router'
	import store from '@/store'
	import $ from 'jquery'
	import { GIS3D } from '../config'
	import { createNamespacedHelpers } from 'vuex'
	import vPasswordModal from '@/components/section/PasswordModal'
	import vUsernameModal from '@/components/section/UsernameModal'
	import vLogoutModal from '@/components/section/LogoutModal'
	import searchAPI from '@/API/search'
	import searchTabPanel from '@/views/search/searchtabpanel'
	import { getCommonSearchAllList } from '@/utils/searchUtil'

	const {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('platform');

	export default {
		components: {
			vPasswordModal,
			vUsernameModal,
			vLogoutModal
		},
		data() {
			return {
				showInfoTips: false,
				showSearch: this.$store.state.platform.showSearch,
				keyWord: this.$store.state.platform.keyWord,
				gisAddr: GIS3D,
				global: this.$store.state.global,
				name: this.$store.state.searchBar.sysName,
				setTimeIndex: 0,
				firstSearchSubmit: true
			}
		},
		methods: {
			toPath: function(path) {
                let currentUnitId = this.$store.state.platform.currentUnitId;
                if(path !== "/platform") {
                    router.push(path);
                }else{
                    if(currentUnitId !== "all") {
                        router.push("/zone");
                    }else{
                        router.push("/platform");
                    }
                }
			},
			hrefTo(url) {
				window.location.assign(url);
			},
			showInfoTip: function() {
				this.showInfoTips = true;
			},
			clearHideInfoTip: function() {
				clearTimeout(this.setTimeIndex);
			},
			hideInfoTip: function() {
				this.showInfoTips = false;
			},
			setTimeHideInfoTip: function() {
				var that = this;
				this.setTimeIndex = setTimeout(function() {
					that.showInfoTips = false;
				}, 1000);
			},
			showDetail: function(e) {
				if($(e.target).prop("tagName") == 'LI') {
					$(e.target).toggleClass('active').siblings().removeClass('active');
					if($(e.target).next().prop("tagName") == 'UL') {
						if($(e.target).next().is(':hidden')) {
							$(e.currentTarget).find('ul').hide();
							$(e.target).siblings().find('.arrow').removeClass('active');
							$(e.target).find('.arrow').addClass('active');
							if($(e.target).hasClass("alarmCenter")) {  //点击告警 直接进入 告警中心
								router.push('/index/alarm');
							}
						} else {
							$(e.currentTarget).find('.arrow').removeClass('active');
						}
						$(e.target).next().toggle();
					} else {
						if(!$(e.target).hasClass("subLi")) {
							$(e.currentTarget).find('ul').hide();
							$(e.currentTarget).find('.arrow').removeClass('active');
						}
					}
				}
			},
			search() { //全局搜索
				if(this.showSearch && !this.keyWord) {
					this.$Message.warning('您输入的检索内容为空，请重新输入！');
					return;
				}
				let self = this;
				let iSearch = this.showSearch;
				let iKey = this.keyWord;
				//通过firstSearchSubmit 防止用户快速多次提交搜索 引起路由地址错误
				if(this.showSearch && this.firstSearchSubmit) {
					this.firstSearchSubmit = false;
					let params = {
						"keywords": this.keyWord || "",
						"pageNo": 1,
						"pageSize": 5
					};
					////////////////////////
					searchAPI.getSearchAllList(params,
						response => {
							// console.log(response);
							store.commit('search/updateSearchAllList', []);
							store.commit('search/updateHighlightAllList', []);
							store.commit('search/updateSearchAllTotal', 0);

							if(response !== null && response.data !== null && response.data.code === "0000" && response.data.data !== null && response.data.data.items !== null && response.data.data.items.length > 0) {
								let searchAllList = response.data.data.items;
								//处理界面展示数据
								let allList = getCommonSearchAllList(searchAllList, iSearch, iKey);
								//处理界面展示数据
								store.commit('search/updateHighlightAllList', allList);
								store.commit('search/updateSearchAllTotal', response.data.data.totalCount);
								console.log("有搜索结果");
								store.commit("search/setDefaultTab");
								self.toPath('search');
								//处理界面展示数据
								self.firstSearchSubmit = true;
							} else {
								store.commit('search/updateNoResult', true);
								self.$Message.warning('无检索结果，请确认输入内容是否有误！');
								//没有检索结果 也要跳到全部标签页
								store.commit("search/setDefaultTab");
								self.toPath('search');
								self.firstSearchSubmit = true;
								return;
							}
						},
						error => {
							self.firstSearchSubmit = true;
							console.log(error);
						}
					);
					////////////////////////
				} else {
					this.showSearch = true;
				}
				this.updateShowSearch(this.showSearch);
				this.updateKeyWord(this.keyWord);
				store.commit('search/updateSearchPersonPageIndex', 1);
				store.commit('search/updateSearchCarPageIndex', 1);
				store.commit('search/updateSearchPlacePageIndex', 1);
				store.commit('search/updateSearchAllPageIndex', 1);
			},
			...mapMutations({
				modifyPasswordModal: 'MODIFY_PASSWORD_MODAL',
				modifyUsernameModal: 'MODIFY_USERNAME_MODAL',
				modifyLogoutModal: 'MODIFY_LOGOUT_MODAL',
				updateShowSearch: 'UPDATE_SHOW_SEARCH',
				updateKeyWord: 'UPDATE_KEY_WORD'
			})
		},
		computed: {
			...mapGetters([]),
			...mapState([
				'sysName',
				'currentUnitId'
			]),
		},
		mounted: function() {
			$("." + this.$route.path.split("/").pop()).addClass('active');
			if($("." + this.$route.path.split("/").pop()).hasClass("subLi")) {
				$("." + this.$route.path.split("/").pop()).parent().show();
				$("." + this.$route.path.split("/").pop()).parent().prev().find('.arrow').addClass('active');
			}
		},
		watch: {
			'$route' (to, from) {
				$(".sliderbar li").removeClass('active');
				$("." + to.path.split("/").pop()).addClass('active');
				if($("." + this.$route.path.split("/").pop()).hasClass("subLi")) {
					$("." + this.$route.path.split("/").pop()).parent().show();
					$("." + this.$route.path.split("/").pop()).parent().prev().find('.arrow').addClass('active');
				}
			}
		}
	}
</script>

<style scoped lang='scss'>
	.index {
		width: 1920px;
		height: 1080px;
		background: url(../assets/image/platform_bg.jpg);
		position: relative;
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
		.contentPage {
			position: absolute;
			top: 90px;
			left: 245px;
			width: 1675px;
			overflow-x: hidden;
			overflow-y: auto;
			height: 990px;
		}
		.contentPage::-webkit-scrollbar {
			display: none;
		}
	}
	
	.header-root {
		color: #52b0ff;
		/*line-height: 80px;*/
		/*position: relative;*/
		/*top: 20px;*/
		font-size: 25px;
		height: 90px;
		padding-left: 28px;
		background: url(../assets/image/index_bg.png) no-repeat;
		.title {
			line-height: 80px;
		}
		.searchBar {
			z-index: 999;
			position: relative;
			margin-top: 20px;
			vertical-align: middle;
			float: right;
			height: 90px;
			.search-form {
				display: inline-block;
				margin-right: 30px;
				i {
					display: inline-block;
					position: relative;
					top: 7px;
					width: 21px;
					height: 21px;
					background: url(../assets/image/zpop-delete-icon.png) no-repeat;
				}
				input {
					vertical-align: middle;
					background-color: transparent !important;
					border: 2px solid #147bbc;
					border-radius: 6px;
					width: 547px;
					height: 39px;
					text-indent: .1em;
					color: #fff;
					font-size: 18px;
					background-color: transparent;
					outline: none;
					&:-ms-input-placeholder {
						color: #91d7fc;
						font-size: 16px;
					}
					&::-webkit-input-placeholder {
						color: #91d7fc;
						font-size: 16px;
					}
					&::-moz-placeholder {
						color: #91d7fc;
						font-size: 16px;
					}
				}
			}
			.v-select {
				width: 165px;
			}
			.icon-search {
				cursor: pointer;
				vertical-align: middle;
			}
			.icon-home {
				cursor: pointer;
				vertical-align: middle;
				margin: 0 28px;
			}
			.icon-user {
				vertical-align: middle;
				margin-right: 28px;
        cursor: pointer;
			}
			.icon-quit {
				vertical-align: middle;
				margin-right: 38px;
				cursor: pointer;
			}
			.info-tip {
				font-size: 16px;
				position: absolute;
				width: 250px;
				right: 109px;
                top: 52px;
				background: url(../assets/image/header-info-tip-bg.png) no-repeat;
				background-size: 100% 100%;
				ul {
					color: rgba(255, 255, 255, 0.5);
					padding: 15px 0px 0px 0;
					list-style: none;
					.rolename {
						height: auto;
						line-height: 30px;
						padding-bottom: 4px;
					}
					.account {
						div {
							width: 155px;
							display: inline-block;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}
					}
					.name {
						div {
							width: 185px;
							display: inline-block;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}
					}
					li {
						padding: 0 10px;
						line-height: 36px;
						box-sizing: border-box;
						height: 36px;
						border-radius: 5px;
						&:hover {
							background-color: #3c97d4;
						}
						.right {
							display: inline-block;
							vertical-align: middle;
							position: relative;
							left: 6px;
							width: 18px;
							height: 18px;
							background: url(../assets/image/header-icon-go.png.png) no-repeat;
						}
						.edit {
							cursor: pointer;
							display: inline-block;
							vertical-align: middle;
							position: relative;
							float: right;
							top: 8px;
							width: 18px;
							height: 18px;
							background: url(../assets/image/header-icon-edit.png) no-repeat;
						}
						&:nth-child(1) {
							color: #fff;
							border-bottom: 1px solid rgba(255, 255, 255, 0.3);
							&:hover {
								background-color: transparent
							}
						}
						&:nth-child(4) {
							color: #ffda2e;
							cursor: pointer;
						}
						&:nth-child(5) {
							color: #ffda2e;
							cursor: pointer;
						}
						span {
							cursor: pointer;
							font-size: 14px;
							float: right;
							color: #ffda2e;
						}
					}
				}
			}
		}
	}
	
	.sliderbar {
		height: 990px;
		display: flex;
		align-items: center;
		color: #1CB1FF;
		width: 225px;
		>ul {
			font-size: 16px;
			z-index: 10;
			width: 225px;
			height: 100%;
			background-color: rgba(26, 74, 150, 0.7);
			display: flex;
			flex-direction: column;
			justify-content: center;
			display: -ms-inline-flexbox;
			-ms-flex-direction: column;
			-ms-flex-pack: center;
			>ul {
				display: none;
				>li {
					cursor: pointer;
					height: 52px;
					line-height: 52px;
					padding-left: 70px;
					&:hover {
						background-color: #1C87C9;
						color: white;
					}
					&.active {
						background-color: #1C87C9;
						color: white;
						border-right: 5px solid #1CB2FF;
					}
				}
			}
			>li {
				height: 64px;
				line-height: 64px;
				padding-left: 35px;
				cursor: pointer;
				.arrow {
					vertical-align: middle;
					display: inline-block;
					margin-left: 20px;
					position: relative;
					top: 0px;
					width: 15px;
					height: 20px;
					background: url(../assets/image/slider-arrow-right.png) no-repeat;
					pointer-events: none;
				}
				.arrow.active {
					position: relative;
					top: 2px;
					width: 20px;
					height: 15px;
					background: url(../assets/image/slider-arrow-down.png) no-repeat;
				}
				.icon {
					vertical-align: middle;
					display: inline-block;
					margin-right: 15px;
					position: relative;
					top: -1px;
					pointer-events: none;
				}
				&:hover,
				&.active {
					.icon1 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -12px -64px;
					}
					.icon2 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -62px -64px;
					}
					.icon3 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -112px -64px;
					}
					.icon4 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -162px -64px;
					}
					.icon5 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -212px -64px;
					}
					.icon6 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -262px -64px;
					}
					.icon7 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -312px -64px;
					}
					.icon8 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -362px -64px;
					}
					.icon9 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -412px -64px;
					}
					.icon10 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -462px -64px;
					}
					.icon11 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -12px -152px;
					}
					.icon12 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -62px -152px;
					}
					.icon13 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -112px -152px;
					}
					.icon14 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -162px -152px;
					}
					.icon15 {
						width: 22px;
						height: 22px;
						background: url(../assets/image/slider-icons.png) -210px -151px;
					}
				}
				.icon1 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -12px -22px;
				}
				.icon2 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -62px -22px;
				}
				.icon3 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -112px -22px;
				}
				.icon4 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -162px -22px;
				}
				.icon5 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -212px -22px;
				}
				.icon6 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -262px -22px;
				}
				.icon7 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -312px -22px;
				}
				.icon8 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -362px -22px;
				}
				.icon9 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -412px -22px;
				}
				.icon10 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -462px -22px;
				}
				.icon11 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -12px -111px;
				}
				.icon12 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -62px -111px;
				}
				.icon13 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -112px -111px;
				}
				.icon14 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -162px -111px;
				}
				.icon15 {
					width: 22px;
					height: 22px;
					background: url(../assets/image/slider-icons.png) -210px -111px;
				}
				&:hover,
				&.active {
					background-color: #1C87C9;
					color: white;
					border-right: 5px solid #1CB2FF;
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