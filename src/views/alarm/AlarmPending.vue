<template>
	<div class="alarmPendingShadow">
		<div class="alarmPending">
			<img src="../../assets/image/alarm/close.png" class="close" @click="close"/>
			<div class="title">处置告警事件</div>
			<div class="contentBox">
				<div class="info">
					<img :src="selectItem.event_image_id" @error="loadError($event)"/>
					<div class="item">
						<div>事件描述：<span>{{selectItem.case_desc}}</span></div>
						<div>发生时间：<span>{{selectItem.create_time}}</span></div>
						<div>发生地点：<span>{{selectItem.position}}</span></div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="inputBox">
					<div class="item">
						<img src="../../assets/image/alarm/head.png" />
						<div class="userName">admin</div>
					</div>
					<textarea id="alarmPendingTxt" maxlength="150"></textarea>
					<div class="btn" @click="pending">处置</div>
				</div>
			</div>
		</div>
		<v-confirm-window ref='confirmtWindow' v-show="showConform" @sure="sureRemark" @cancel="cancelRemark"></v-confirm-window>
	</div>
</template>

<script>
	import $ from 'jquery'
	import vPagination from '@/components/Pagination'
	import vConfirmWindow from '@/components/ConfirmWindow'
	
	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('alarm')

	export default {
		components: {
			vPagination,
			vConfirmWindow
		},
		props: {},
		name: 'AlarmPending',
		data() {
			return {
				showConform:false
			}
		},
		methods: {
			sureRemark:function(e){
				this.showConform = false;
				this.pengdingItem();
				if($.trim($("#alarmPendingTxt").val()) != ''){
					this.addRemark($("#alarmPendingTxt").val());
					$("#alarmPendingTxt").val('');
				}
				this.$emit("close");
			},
			cancelRemark:function(e){
				$("#alarmPendingTxt").val('');
				this.showConform = false;
				this.$emit("close");
			},
			loadError:function(e){
				$(e.target).attr('src',require('../../assets/image/alarm/noAlarm.png'));
			},
			pending: function(){
				this.pengdingItem();
				if($.trim($("#alarmPendingTxt").val()) != ''){
					this.addRemark($("#alarmPendingTxt").val());
					$("#alarmPendingTxt").val('');
				}
			},
			close: function(event) {
				if($.trim($("#alarmPendingTxt").val()) != ''){
					this.showConform = true;
					return;
				}
				this.$emit("close");
			},
			...mapMutations([]),
			...mapActions([
				'pengdingItem',
				'addRemark'
			])
		},
		computed: {
			...mapGetters([

			]),
			...mapState([
				'selectItem'
			])
		},
		mounted: function() {}
	}
</script>

<style lang="scss" scoped="scoped">
	.alarmPendingShadow {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 99999;
		background-color: rgba(0, 0, 0, 0.3);
		.alarmPending {
			width: 902px;
			height: 786px;
			background: url(../../assets/image/alarm/remarkBorder.png) no-repeat 100% 100%;
			position: fixed;
			top: 50%;
			left: 50%;
			margin-left: -451px;
			margin-top: -393px;
			.close{
				z-index: 999;
				position: absolute;
				top: 28px;
				right: 25px;	
				cursor: pointer;
			}
			.title {
				margin-top: 40px;
				font-size: 18px;
				text-align: center;
				color: #4fc7ff;
			}
			.contentBox {
				color: #1cb1ff;
				width: 670px;
				height: 630px;
				margin: 20px auto;
				position: relative;
				.info {
					border-bottom: 1px solid rgba(28, 177, 255, 0.1);
					padding-bottom: 20px;
					img {
						width: 202px;
						height: 138px;
						display: inline-block;
						float: left;
					}
					.item {
						margin-top: 30px;
						margin-left: 30px;
						float: left;
						div {
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							margin-top: 10px;
							span {
								color: #fff;
							}
						}
					}
				}
				.remarkNum {
					padding: 10px 0;
				}
				.inputBox {
					width: 100%;
					height: 204px;
					background-color: rgba(28, 177, 255, 0.1);
					position: relative;
					.item {
						position: absolute;
						left: 25px;
						top: 40px;
						img {}
						.userName {}
					}
					.btn {
						cursor: pointer;
						position: absolute;
						left: 543px;
						top: 145px;
						width: 100px;
						height: 36px;
						background-color: #40c7ff;
						text-align: center;
						color: white;
						line-height: 36px;
					}
					textarea {
						color: white;
						position: absolute;
						left: 90px;
						top: 20px;
						width: 554px;
						height: 104px;
						background-color: rgba(28, 177, 255, 0.1);
						border: 1px solid rgba(28, 177, 255, 0.1);
					}
				}
				.list {
					li {
						border-bottom: 1px solid rgba(28, 177, 255, 0.1);
						padding: 15px 0;
						position: relative;
						.txt {
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							color: white;
							line-height: 25px;
						}
						.fullTxt {
							position: absolute;
							z-index: 10;
							left: 0;
							top: 9px;
							padding-bottom: 20px;
							color: #00203D;
							width: 100%;
							background-color: #fff;
							border: 1px solid #06529E;
							display: none;
							word-break: break-all;
						}
						.name {
							font-size: 14px;
						}
					}
				}
				.pageBarBox {
					margin-top: 20px;
					text-align: center;
				}
			}
		}
	}
</style>