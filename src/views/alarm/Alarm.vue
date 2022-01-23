<template>
	<div>
		<v-searchBar></v-searchBar>
		<v-panel title='今日实时告警' class='v-panel'>
			<div class="alarm">
				<div class="map">
					<iframe class="mapIframe" width="100%" height="100%" marginheight="0" marginwidth="0" style="border:none; overflow:hidden">
			    </iframe>
				</div>
				<div class="totalAlarmList">
					<i class="icon"></i>今日告警数（次）：<span>{{totalAlarmNum}}</span>
					<ul class="list">
						<li v-for="item in alarmDetailList">
							<div class="head">
								<img :src="item.event_image_id" @click="showPhoto(item.event_image_id)" @error = "loadError($event)"/>
							</div>
							<div class="info">
								<template v-if = "item.pending_status != ''">
									<div class="staus">{{item.pending_status | filter_status}}</div>
								</template>
								<template  v-else = "item.pending_status == ''">
									<div class="staus">&nbsp;</div>
								</template>
								<template v-if = "item.pending_status != ''">
									<div class="type">{{item.event_type}}</div>
								</template>
								<template  v-else = "item.pending_status == ''">
									<div class="type">暂无告警信息</div>
								</template>
								<template v-if = "item.pending_status != ''">
									<div class="level"><span  :class="{level1:item.alarm_degree == 'first_degree',level2:item.alarm_degree == 'second_degree',level3:item.alarm_degree == 'third_degree',level4:item.alarm_degree == 'fourth_degree'}">{{item.alarm_degree | filter_level}}</span></div>
								</template>
								<template  v-else = "item.pending_status == ''">
									<div class="level">&nbsp;</div>
								</template>
								<template v-if = "item.pending_status != ''">
									<div class="des">{{item.case_desc}}</div>
								</template>
								<template  v-else = "item.pending_status == ''">
									<div class="des">&nbsp;</div>
								</template>
								<template v-if = "item.pending_status != ''">
									<div class="address">{{item.create_time}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.position}}</div>
								</template>
								<template  v-else = "item.pending_status == ''">
									<div class="address">&nbsp;</div>
								</template>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</v-panel>
		<v-alarmAlert class="alarmAlert" v-show="showAlert" :photoUrl=photoUrl @close='closeAlert'></v-alarmAlert>
	</div>
</template>

<script>
	import $ from 'jquery'
	import vSearchBar from '@/views/house/SearchBar'
	import vPanel from '@/components/Panel'
	import vAlarmAlert from '@/views/alarm/AlarmAlert'
	import { imgServerAddr } from '../../config'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('alarm')

	export default {
		components: {
			vSearchBar,
			vAlarmAlert,
			vPanel
		},
		name: 'Alarm',
		data() {
			return {
				showAlert: false, //是否弹出照片
				photoUrl: '', //照片地址
			}
		},
		methods: {
			loadError:function(e){
				$(e.target).attr('src',require('../../assets/image/alarm/noAlarm.png'));
			},
			showPhoto:function(url){
				this.photoUrl = url;
				this.showAlert = true;
			},
			closeAlert: function() {
				this.showAlert = !this.showAlert;
			},
			...mapMutations([]),
			...mapActions([
				'initWs',
				'initMap'
			])
		},
		computed: {
			...mapGetters([
				'mapCodeStr',
                'alarmDetailList'
			]),
			...mapState([
				'totalNum',
				'totalAlarmNum'
			])
		},
		mounted: function() {
			this.initWs();
			$(".mapIframe").attr('src', "static/map/alarmmap.html?" + this.mapCodeStr);
		},
		watch: {
			'mapCodeStr': function(curVal, oldVal) {
				$(".mapIframe").attr('src', "static/map/alarmmap.html?" + curVal);
			},
		},
		filters: {
			filter_status: function(value) {
				if(value == 'unpending') {
					return "未处置";
				} else if(value == 'pending'){
					return "已处置";
				}
				return "未处置";
			},
			filter_type: function(eventType) {
				if(eventType == 'people') {
					return '人黑名单告警';
				} else if(eventType == 'car') {
					return '车黑名单告警';
				} else if(eventType == 'flow') {
					return '人流告警';
				} else if(eventType == 'stalker') {
					return '尾随告警';
				} else if(eventType == 'crossborder') {
					return '周界报警';
				} else if(eventType == 'loseAlarm') {
					return '孤寡老人告警';
				} else if(eventType == 'open_door') {
					return '开门告警';
				} else {
					return "";
				}
			},
			filter_level: function(eventType) {
				if(eventType == 'first_degree') {
					return '红色告警';
				} else if(eventType == 'second_degree') {
					return '橙色告警';
				} else if(eventType == 'third_degree') {
					return '黄色告警';
				} else if(eventType == 'fourth_degree') {
					return '蓝色告警';
				} else {
					return '';
				}
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.alarm {
		color: white;
		font-size: 16px;
		height: 830px;
		.map {
			width: 1000px;
			height: 830px;
			float: left;
		}
		.totalAlarmList {
			width: 620px;
			height: 810px;
			overflow: hidden;
			float: left;
			padding-top: 10px;
			.icon {
				vertical-align: middle;
				margin-right: 10px;
				background: url(../../assets/image/alarm/icon-alarmList.png) no-repeat;
				width: 27px;
				height: 27px;
				background-size: 100% 100%;
				display: inline-block;
			}
			>span {
				font-size: 22px;
			}
			.list {
				margin-top: -10px;
				margin-left: 38px;
				li {
					color: #1cb1ff;
					margin-top: 5px;
					.head {
						background: url(../../assets/image/alarm/icon-head.png) no-repeat;
						background-size: 100% 100%;
						margin-top: 30px;
						float: left;
						width: 112px;
						height: 118px;
						img {
							display: block;
							margin-left: 6px;
							margin-top: 6px;
							width: 100px;
							height: 106px;
						}
					}
					.info {
						width: 100%;
						padding-left: 125px;
						line-height: 25px;
						div {
							padding-left: 5px;
							margin-top: 6px;
							background-color: rgba(28, 177, 255, 0.05);
						}
						.staus {
							color: white;
							text-align: right;
							background-color: rgba(28, 177, 255, 0);
						}
						.deal {
							color: #999;
						}
						.type {
							background-color: rgba(28, 177, 255, 0.23);
						}
						.level {
							padding-left: 0px;
							span {
								color: #fff;
								padding: 5px;
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
						.des {}
						.address {
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow-x: hidden;
						}
					}
					&:after {
						content: '.';
						visibility: hidden;
						display: block;
						height: 0;
						clear: both;
					}
				}
			}
		}
	}
</style>