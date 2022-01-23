<template>
	<div class="alarmListDiv">
		<div class="tabList">
			<span class="tab level4">蓝色告警</span>
			<span class="tab level3">黄色告警</span>
			<span class="tab level2">橙色告警</span>
			<span class="tab level1">红色告警</span>
		</div>
		<div class="chart">
			<v-iAlarm :dataArr='eventDegreeCount'/>
		</div>
		<div class="info">
			<div class="numBox">
				<div class="txt">告警次数</div>
				<div class="num">{{eventStatusCount.total}}</div>
			</div>
			<div class="pendingBox">
				<div class="pending"><i></i>已处置：{{eventStatusCount.pending}}</div>
				<div class="unpending"><i></i>未处置：{{eventStatusCount.unpending}}</div>
			</div>
			<div class="line"></div>
		</div>
		<div class="clear"></div>
		<ul class="alarmList">
			<div class="noData" v-show="alarmList.length == 0">暂无数据</div>
			<li v-for="(item,index) in alarmList">
				<div class="txtBox">
					<div class="event-txt-div">
						<div class="levelBlock" :class="{level1:item.alarm_degree == 'first_degree',level2:item.alarm_degree == 'second_degree',level3:item.alarm_degree == 'third_degree',level4:item.alarm_degree == 'fourth_degree'}"></div><span>NO{{index+1}}</span>{{item.create_time}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.info.position}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.info.case_desc}}</div>
				</div>
				<div class="icon_tips">
					<i class="icon photo" @click="showPhoto(item.event_image_id)"></i>
					<!--<i class="icon video"></i>
					<i class="icon link"></i>-->
				</div>
			</li>
		</ul>
		<v-alarmAlert class="alarmAlert" v-show="showAlert" :photoUrl=photoUrl @close='closeAlert'></v-alarmAlert>
	</div>
</template>

<script>
	import $ from 'jquery'
	import vLabel from '@/components/Label'
	import vAlarmAlert from '@/views/alarm/AlarmAlert'
	import { imgServerAddr } from '../../config'
	import vIAlarm from '@/components/chart/IAlarm'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('alarm')

	export default {
		components: {
			vLabel,
			vAlarmAlert,
			vIAlarm
		},
		name: 'AlarmList',
		data() {
			return {
				showAlert: false,
				photoUrl: '',
			}
		},
		methods: {
			showPhoto: function(url) {
				this.photoUrl = imgServerAddr + '/' + url + "?p=0";
				this.showAlert = true;
			},
			closeAlert: function() {
				this.showAlert = !this.showAlert;
			},
			initAnimate: function() {
				var marginLeft;
				var ulWidth;
				var txtLen;
				var maxLen = 0;
				clearInterval(this.inter);
				var tempInter = "";

				tempInter = setInterval(function() {
					ulWidth = $('.alarmList').css('width');
					if(ulWidth) {
						ulWidth = ulWidth.substring(0, ulWidth.length - 2);
						var arr = $('.alarmList li');

						for(var i = 0; i < arr.length; i++) {
							txtLen = $(arr[i]).find('.event-txt-div').text().length * 7.2;
							maxLen = Math.max(maxLen, txtLen);
						}
						if(arr.length > 0) {
							for(var i = 0; i < arr.length; i++) {
								marginLeft = $(arr[0]).find('.event-txt-div').css('margin-left');
								marginLeft = marginLeft.substring(0, marginLeft.length - 2);
								if(i == 0) {
									if(marginLeft < (maxLen * -1)) {
										$(arr[i]).find('.event-txt-div').css('margin-left', ulWidth + 'px');
									} else {
										$(arr[i]).find('.event-txt-div').css('margin-left', (marginLeft - 10) + 'px');
									}
								} else {
									$(arr[i]).find('.event-txt-div').css('margin-left', marginLeft + 'px');
								}
							}
						}
					}
				}, 400);
				this.updateInter(tempInter);
			},
			...mapMutations([
				'updateEventType',
				'updateInter'
			]),
			...mapActions([
				'initWs',
				'queryList'
			])
		},
		computed: {
			...mapGetters([

			]),
			...mapState([
				'alarmList',
				'inter',
				'eventDegreeCount',
				'eventStatusCount',
			])
		},
		mounted: function() {
			this.initWs();
			this.initAnimate();
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.alarmListDiv {
		.tabList {
			height:50px;
			padding:12px 4px 0 0;
			.tab {
				float: right;
				color: white;
				padding: 3px 6px;
				margin-right: 10px;
				border-radius: 8px;
			}
			.level1 {
				background-color: #ff4444;
			}
			.level2 {
				background-color: #e86f2b;
			}
			.level3 {
				background-color: rgba(232,221,43,0.84);
			}
			.level4 {
				background-color: #007eff;
			}
		}
		.chart{
			text-align: center;
			width: 150px;
			height: 120px;
			float: left;
			position: relative;
			top: -15px;
		}
		.info{
			width: 242px;
			height: 96px;
			float: left;
			color: white;
			border: 1px dashed #1cb1ff;
			position: relative;
			.line{
			   position: absolute;
			   left: 96px;
			   top: 7px;
			   width: 0px;
			   height: 80px;
			   border-right: 1px dashed #1cb1ff;		
			}
			.numBox{
				float: left;
				width: 100px;
				height: 96px;
				text-align:center;
				padding-top:20px;
				.txt{
					font-size: 16px;
					color: #1cb1ff;
				}
				.num{
					margin-top: 3px;
					color: white;
					font-size: 18px;
				}
			}
			.pendingBox{
				float: left;
				width: 140px;
				height: 96px;
				font-size: 14px;
				padding-left: 12px;
				padding-top: 20px;
				i{
					position: relative;
					top: 2px;
					width: 22px;
					height: 20px;
					margin-right: 5px;
					display: inline-block;
				}
				.pending{
					color: #21c65f;
					i{
						background: url(../../assets/image/alarm/pengding.png) no-repeat;
					}
				}
				.unpending{
					color: #fc484b;
					i{
						background: url(../../assets/image/alarm/unpengding.png) no-repeat;
					}
				}
			}
		}
		.alarmAlert {
			position: fixed;
			top: 50%;
			left: 50%;
			margin-left: -701px;
			margin-top: -396px;
			z-index: 99999;
		}
		.alarmList {
			font-size: 15px;
			margin-left: 20px;
			color: white;
			width: 375px;
			height: 420px;
			position: relative;
			.noData {
				position: absolute;
				top: 200px;
				left: 145px;
				font-size: 20px;
			}
			li {
				display: inline-flex;
				align-items: center;
				display: -ms-inline-flexbox;
				-ms-flex-align: center;
				width: 100%;
				height: 11.11%;
				box-sizing: border-box;
				border-bottom: 1px solid #1a5eb7;
				position: relative;
				&:last-child{
					border-bottom: none;
				}
				.txtBox {
					overflow-x: hidden;
					.event-txt-div {
						text-overflow: ellipsis;
						overflow-x: hidden;
						white-space: nowrap;
						span {
							color: #53b4ff;
							margin-right: 10px;
						}
						.levelBlock {
							width: 10px;
							height: 10px;
							background-color: red;
							display: inline-block;
							margin-right: 4px;
						}
						.level1 {
							background-color: #ff4444;
						}
						.level2 {
							background-color: #ff4f00;
						}
						.level3 {
							background-color: #ffae00;
						}
						.level4 {
							background-color: #007eff;
						}
					}
				}
				&:hover {
					.icon_tips {
						display: block;
					}
				}
				.icon_tips {
					position: absolute;
					left: 140px;
					bottom: 0;
					background: url(../../assets/image/alarm_tip_border.png) no-repeat;
					background-size: 100% 100%;
					height: 60px;
					width: 55px;
					/*155px*/
					display: none;
					.icon {
						width: 32px;
						height: 32px;
						display: inline-block;
						cursor: pointer;
						margin-top: 8px;
						margin-left: 12px;
						background: url(../../assets/image/alarm_icon.png) no-repeat;
					}
					.photo {
						background-position: 0 0;
						&:hover {
							background: url(../../assets/image/alarm_icon_active.png) no-repeat;
							background-position: 0 0;
						}
					}
					.video {
						background-position: -51px 0;
						&:hover {
							background: url(../../assets/image/alarm_icon_active.png) no-repeat;
							background-position: -51px 0;
						}
					}
					.link {
						background-position: -102px 0;
						&:hover {
							background: url(../../assets/image/alarm_icon_active.png) no-repeat;
							background-position: -102px 0;
						}
					}
				}
			}
		}
	}
</style>