<template>
	<div class="sliderbar" :class="{sshow: sliderListShow}">
		<ul @click="showDetail($event)">
			<li @click="toPath('/platform')"><i class="icon icon1"></i>首页</li>
			<!-- <li @click="toPath('/index/search')"><i class="icon icon2"></i>云搜索</li> -->
			<li @click="toPath('/index/estate')"><i class="icon icon3"></i>小区数据</li>
			<li @click="toPath('/index/house')"><i class="icon icon4"></i>房屋数据</li>
			<li @click="toPath('/index/population')"><i class="icon icon5"></i>人口数据</li>
			<li @click="toPath('/index/trip')"><i class="icon icon6"></i>出行记录</li>
			<li @click="toPath('/index/special')"><i class="icon icon7"></i>特殊群体</li>
			<!--<li @click="toPath('/index/watch')"><i class="icon icon8"></i>治安防范体系</li>-->
			<!--<li @click="toPath('/index/security')"><i class="icon icon9"></i>安防巡查</li>-->
			<li @click="toPath('/index/safety')"><i class="icon icon10"></i>小区安全排行</li>
			<li @click="toPath('/index/monitor')" class="monitor"><i class="icon icon11"></i>实时监控</li>
			<li><i class="icon icon12"></i>实时告警<i class="arrow"></i></li>
			<ul>
				<li @click="toPath('/index/alarm')">实时告警</li>
				<li @click="toPath('/index/alarmDetail')">告警详情</li>
				<li @click="toPath('/index/alarmAnalyse')">警情分析</li>
			</ul>
			<li @click="toPath('/index/tdmap')"><i class="icon icon13"></i>GIS地图</li>
			<!--<li><i class="icon icon14"></i>安防设置<i class="arrow"></i></li>
			<ul>
				<li @click="toPath('/index/watchset')">治安防范标准设置</li>
				<li @click="toPath('/index/alarm')">安防巡查标准设置</li>
				<li @click="toPath('/index/safetyset')">发案指数标准设置</li>
			</ul>-->
			<li><i class="icon icon15"></i>系统设置<i class="arrow"></i></li>
			<ul>
				<li @click="toPath('/index/usercenter')">用户中心</li>
				<li @click="toPath('/index/permission')">权限管理</li>
				<li @click="toPath('/index/device')">设备管理</li>
				<li @click="toPath('/index/logdata')">日志数据</li>
			</ul>
		</ul>
		<img src="../../assets/image/slider-hover.png" class="line" v-show="!sliderListShow && lineShow" @mouseenter="toggleLineShow" @mouseleave="toggleLineShow" />
		<i class="btn" @click='toggleList($event)' :class="{active:sliderListShow}" @mouseenter="toggleLineShow" @mouseleave="toggleLineShow"></i>
		<div class="bg" v-show="sliderListShow" @mouseenter="hiddenList"></div>
	</div>
</template>
<script>
	import $ from 'jquery'
	import router from '../../router'
	import { GIS3D } from '../../config'
	import { createNamespacedHelpers } from 'vuex'

	const {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('platform')

	export default {
		name: 'SliderBar',
		data() {
			return {
				lineShow: false,
				gisAddr: GIS3D
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
			toggleList: function(e) {
				this.sliderListShowFun(!this.sliderListShow);
				$(e.target).toggleClass('active');
			},
			hiddenList: function() {
				this.sliderListShowFun(!this.sliderListShow);
				// $(e.target).toggleClass('active');
			},
			toggleLineShow: function() {
				this.lineShow = !this.lineShow;
			},
			showDetail: function(e) {
				if($(e.target).prop("tagName") == 'LI') {
					$(e.target).toggleClass('active').siblings().removeClass('active');
					if($(e.target).next().prop("tagName") == 'UL') {
						if($(e.target).next().is(':hidden')) {
							$(e.currentTarget).find('ul').hide();
							$(e.currentTarget).find('.arrow').removeClass('active');
							$(e.target).find('.arrow').addClass('active');
						} else {
							$(e.target).find('.arrow').removeClass('active');
						}
						$(e.target).next().toggle();
					} else {
						$(e.currentTarget).find('ul').hide();
						$(e.currentTarget).find('.arrow').removeClass('active');
					}
				}
			},
			...mapMutations({
				sliderListShowFun: 'SLIDER_LIST_SHOW',
			}),
			...mapActions([])
		},
		computed: {
			...mapState([
				'sliderListShow'
			])
		},
	}
</script>
<style lang="scss" scoped="scoped">
	.sliderbar {
		position: fixed;
		z-index: 10;
		left: -225px;
		bottom: 0;
		height: 990px;
		/*height: -moz-calc(100% - 90px);
    height: -webkit-calc(100% - 90px);*/
		display: flex;
		align-items: center;
		display: -ms-flexbox;
		-ms-flex-align: center;
		color: #1CB1FF;
    transition: left 0.3s;
		.bg {
			position: absolute;
			left: 0;
			top: 0;
			background-color: rgba(0, 0, 0, 0.3);
			width: 2450px;
			height: 100%;
			z-index: 0;
		}
		>ul {
			position: relative;
			font-size: 16px;
			z-index: 10;
			width: 225px;
			height: 100%;
			background-color: #025A93;
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
					background: url(../../assets/image/slider-arrow-right.png) no-repeat;
					pointer-events: none;
				}
				.arrow.active {
					position: relative;
					top: 2px;
					width: 20px;
					height: 15px;
					background: url(../../assets/image/slider-arrow-down.png) no-repeat;
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
						background: url(../../assets/image/slider-icons.png) -12px -64px;
					}
					.icon2 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -62px -64px;
					}
					.icon3 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -112px -64px;
					}
					.icon4 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -162px -64px;
					}
					.icon5 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -212px -64px;
					}
					.icon6 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -262px -64px;
					}
					.icon7 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -312px -64px;
					}
					.icon8 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -362px -64px;
					}
					.icon9 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -412px -64px;
					}
					.icon10 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -462px -64px;
					}
					.icon11 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -12px -152px;
					}
					.icon12 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -62px -152px;
					}
					.icon13 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -112px -152px;
					}
					.icon14 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -162px -152px;
					}
					.icon15 {
						width: 22px;
						height: 22px;
						background: url(../../assets/image/slider-icons.png) -210px -151px;
					}
				}
				.icon1 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -12px -22px;
				}
				.icon2 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -62px -22px;
				}
				.icon3 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -112px -22px;
				}
				.icon4 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -162px -22px;
				}
				.icon5 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -212px -22px;
				}
				.icon6 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -262px -22px;
				}
				.icon7 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -312px -22px;
				}
				.icon8 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -362px -22px;
				}
				.icon9 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -412px -22px;
				}
				.icon10 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -462px -22px;
				}
				.icon11 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -12px -111px;
				}
				.icon12 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -62px -111px;
				}
				.icon13 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -112px -111px;
				}
				.icon14 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -162px -111px;
				}
				.icon15 {
					width: 22px;
					height: 22px;
					background: url(../../assets/image/slider-icons.png) -210px -111px;
				}
				&:hover,
				&.active {
					background-color: #1C87C9;
					color: white;
				}
			}
		}
		.btn {
			z-index: 10;
			position: relative;
			cursor: pointer;
			width: 25px;
			height: 151px;
			display: block;
			background-color: red;
			background: url(../../assets/image/slider-open.png) no-repeat;
			background-size: contain;
		}
		.btn.active {
			z-index: 10;
			background: url(../../assets/image/slider-close.png) no-repeat;
			background-size: contain;
		}
	}
  .sliderbar.sshow{
    left: 0;
  }
</style>