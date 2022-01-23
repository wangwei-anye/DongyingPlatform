<template>
	<div class="alarmRemarkShadow">
		<div class="alarmRemark">
			<img src="../../assets/image/alarm/close.png" class="close" @click="close"/>
			<div class="title">备注信息</div>
			<div class="contentBox">
				<div class="info">
					<img :src="selectItem.event_image_id" @error="loadError($event)" />
					<div class="item">
						<div>事件描述：<span>{{selectItem.case_desc}}</span></div>
						<div>发生时间：<span>{{selectItem.create_time}}</span></div>
						<div>发生地点：<span>{{selectItem.position}}</span></div>
					</div>
					<div class="clear"></div>
				</div>
				<div class="remarkNum">{{messageList.length}}条备注</div>
				<div class="inputBox">
					<div class="item">
						<img src="../../assets/image/alarm/head.png" />
						<div class="userName">admin</div>
					</div>
					<textarea id="alarmRemarkTxt" maxlength="150"></textarea>
					<div class="btn" @click="addRemarkBtn">添加</div>
				</div>
				<ul class="list">
					<li @mouseover="showAllContent($event)" @mouseleave="hideAllContent($event)" v-for="item in messageList">
						<div class="txt">{{item.remark}}</div>
						<div class="fullTxt">{{item.remark}}</div>
						<div class="name">{{item.recorder_id}} {{item.create_time}}</div>
					</li>
				</ul>
				<div class='pageBarBox'>
					<v-pagination :total=messageTotalNum  :pageSize=2  @toPage='changePage' class='pageBar'></v-pagination>
				</div>
			</div>
		</div>
		<v-alert-window ref='alertWindow'></v-alert-window>
		<v-confirm-window ref='confirmtWindow' v-show="showConform" @sure="sureRemark" @cancel="cancelRemark"></v-confirm-window>
	</div>
</template>

<script>
	import $ from 'jquery'
	import vPagination from '@/components/Pagination'
	import vAlertWindow from '@/components/AlertWindow'
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
			vAlertWindow,
			vConfirmWindow
		},
		props: {},
		name: 'AlarmRemark',
		data() {
			return {
				showConform:false
			}
		},
		methods: {
			sureRemark:function(e){
				this.showConform = false;
				this.addRemark($("#alarmRemarkTxt").val()).then(
					function(){
						$("#alarmRemarkTxt").val('');
					}
				);
				this.$emit("close");
			},
			cancelRemark:function(e){
				$("#alarmRemarkTxt").val('');
				this.showConform = false;
				this.$emit("close");
			},
			loadError:function(e){
				$(e.target).attr('src',require('../../assets/image/alarm/noAlarm.png'));
			},
			addRemarkBtn: function(){
				if($.trim($("#alarmRemarkTxt").val()) == ''){
					this.$refs.alertWindow.show('内容不能为空');
					return;
				}
				this.addRemark($("#alarmRemarkTxt").val()).then(
					function(){
						$("#alarmRemarkTxt").val('');
					}
				);
			},
			close: function(event) {
				if($.trim($("#alarmRemarkTxt").val()) != ''){
					this.showConform = true;
					return;
				}
				this.$emit("close");
			},
			changePage: function(currentPage) {
				this.updateMessageCurrentPage(currentPage);
				this.queryRemarkList();
			},
			showAllContent: function(event) {
				var height = $(event.currentTarget).find('.fullTxt').css('height')
				var heightNum = height.substring(0, height.length - 2);
				if(heightNum > 60) {
					$(event.currentTarget).find('.fullTxt').css('display', 'block');
				}
			},
			hideAllContent: function(event) {
				$(event.currentTarget).find('.fullTxt').css('display', 'none');
			},
			...mapMutations([
				'updateMessageCurrentPage'
			]),
			...mapActions([
				'queryRemarkList',
				'addRemark'
			])
		},
		computed: {
			...mapGetters([
			]),
			...mapState([
				'selectItem',
				'messageTotalNum',
				'messageList',
				'showRemark'
			])
		},
		mounted: function() {
		},
		watch:{
			'showRemark':function(curVal, oldVal){
				if(curVal){
					this.queryRemarkList(this.pageIndex,this.pageSize);
				}
			}
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.alarmRemarkShadow {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 99999;
		background-color: rgba(0, 0, 0, 0.3);
		.alarmRemark {
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