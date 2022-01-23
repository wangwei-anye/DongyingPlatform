<template>
	<div class="securityTime">
		<div class='title'>计划巡查次数</div>
		<ul class="timeList">
			<li v-for="(item,index) in securityArr" :class="{active:index%2 == 0}">
				<div class="time">{{item.time}}</div>
				<div class="circleBox">
					<div class="line"></div>
					<div class="circle" :class="{bad:item.type == 'no'}">{{item.totalNum}}次</div>
				</div>
				<div class="line"></div>
				<div class="item" v-show="item.type == 'ok'">
					<span class="num1">{{item.completeNum}}</span>
					<img src="../../assets/image/security-icon-ok.png" />
					<span class="num">{{item.completeNum}}</span>
					<div class="txt">已完成</div>
				</div>
				<div class="item" v-show="item.type == 'ok'">
					<span class="num1">{{item.unDoNum}}</span>
					<img src="../../assets/image/security-icon-close.png" />
					<span class="num">{{item.unDoNum}}</span>
					<div class="txt">未完成</div>
				</div>
				<div class="item" v-show="item.type == 'ok'">
					<span class="num1">{{item.precent}}%</span>
					<img src="../../assets/image/security-icon-percent.png" />
					<span class="num">{{item.precent}}%</span>
					<div class="txt">合格率</div>
				</div>
				<div class="item" v-show="item.type == 'ok'">
					<span class="num1">{{item.loseNum}}</span>
					<img src="../../assets/image/security-icon-lose.png" />
					<span class="num">{{item.loseNum}}</span>
					<div class="txt">漏检</div>
				</div>
				<div class="item" v-show="item.type == 'ok'">
					<span class="num1">{{item.lateNum}}</span>
					<img src="../../assets/image/security-icon-losetime.png" />
					<span class="num">{{item.lateNum}}</span>
					<div class="txt">未准时</div>
				</div>
				<div class="noInfo" v-show="item.type == 'no'">
					暂无消息
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	import $ from 'jquery'
	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('security')
	
	export default {
		name: 'SecurityTime',
		props: {
		},
		components: {},
		data() {
			return {
				panelStyle: {
					'width': this.w + 'px'
				}
			}
		},
		computed: {
			...mapGetters([
				'securityArr'
			]),
			...mapState([
			])
		},
		methods: {
			...mapMutations([]),
			...mapActions([
				'getSecurityData'
			])
		},
		mounted: function() {
//			this.getSecurityData();
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.securityTime {
		width: 100%;
		color: white;
		padding-top: 20px;
		.title{
			font-size: 22px;
			color: #3DA9FF;
			text-align: center;
		}
		.timeList {
			padding: 30px 0 50px;
			width: 1612px;
			li.active {
				.noInfo {
					width: 705px;
					text-align: right;
					font-size: 22px;
					color: #3DA9FF;
				}
			}
			li {
				width: 100%;
				height: 158px;
				display: inline-flex;
				display: -webkit-inline-flex;
				display: -ms-inline-flexbox;
				justify-content: flex-end;
				-webkit-justify-content: flex-end;
				-ms-flex-pack: end;
				align-items: center;
				-ms-flex-align: center;
				.circleBox {
					position: relative;
					.circle {
						text-align: center;
						line-height: 105px;
						width: 105px;
						height: 105px;
						border: 3px solid #3DA9FF;
						border-radius: 50%;
						background-color: #1b3d7c;
						font-size: 22px;
						&.bad{
							border: 3px solid #AAAAAA;
							background-color: #838383
						}
					}
					.line {
						position: absolute;
						left: 50%;
						top: -48px;
						height: 48px;
						width: 0px;
						border-left: 2px dashed #3DA9FF;
					}
				}
				.time {
					flex-basis: 200px;
					font-size: 16px;
					color: rgba(255, 255, 255, 0.4);
					text-align: center;
				}
				>.line {
					width: 48px;
					height: 0px;
					border-bottom: 2px dashed #3DA9FF;
				}
				.noInfo {
					width: 705px;
					text-align: left;
					font-size: 22px;
					color: #3DA9FF;
				}
				.item {
					color: #3DA9FF;
					flex-basis: 141px;
					margin-top: 17px;
					width: 141px;
					img {
						vertical-align: middle;
						margin: 0 3px;
					}
					.num {
						vertical-align: middle;
						font-size: 22px;
						font-weight: bold;
					}
					.num1 {
						vertical-align: middle;
						font-size: 22px;
						font-weight: bold;
						display: none;
					}
					.txt {
						font-size: 14px;
						margin-left: 2px;
					}
					&:nth-child(7),
					&:nth-child(8) {
						color: #FF772C;
						.txt {
							margin-left: 10px;
						}
					}
				}
				&.active {
					flex-direction: row-reverse;
					-webkit-flex-direction: row-reverse;
					-ms-flex-direction: row-reverse;
					.item {
						text-align: right;
						img {
							vertical-align: middle;
						}
						.num {
							display: none;
						}
						.num1 {
							display: inline-block;
						}
						.txt {
							margin-right: 6px;
						}
						&:nth-child(7),
						&:nth-child(8) {
							.txt {
								margin-right: 12px;
							}
						}
					}
				}
			}
		}
	}
</style>