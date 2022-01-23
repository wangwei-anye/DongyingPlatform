<template>
	<div class="securityCount">
		<div class='title'>
             <img src="../../assets/image/securityCount-logo.png" />
             <div class="name">{{address}}</div>
		</div>
		<div class="content">
			<div class="count">
				<div>
					<i class="estateNum"></i>小区总数：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{securityCount.estateNum}}</span>
				</div>
				<div>
					<i class="planNum"></i>计划巡查次数：<span>{{securityCount.planNum}}</span>
				</div>
			</div>
			<div class="chartBox">
				<v-chartSecurityCount></v-chartSecurityCount>
			</div>
			<div class="circleList">
				<i-circle :percent="securityCount.completeRate" class='circle' :size="212" :trail-width='1' trail-color='#3aa9ff' :stroke-width='3' stroke-color='#3DA9FF'>
					<div class="circleTxt">
						已完成巡查
					</div>
					<div  class="circleNum">
						{{securityCount.completeNum}}
					</div>
				</i-circle>
				<i-circle :percent="securityCount.unDoRate" class='circle' :size="212" :trail-width='1' trail-color='#3aa9ff' :stroke-width='3' stroke-color='#3DA9FF'>
					<div class="circleTxt">
						未完成巡查
					</div>
					<div  class="circleNum">
						{{securityCount.unDoNum}}
					</div>
				</i-circle>
				<i-circle :percent="securityCount.loseRate" class='circle' :size="212" :trail-width='1' trail-color='#3aa9ff' :stroke-width='3' stroke-color='#FF782E'>
					<div class="circleTxt">
						未准时
					</div>
					<div  class="circleNum">
						{{securityCount.loseNum}}
					</div>
				</i-circle>
				<i-circle :percent="securityCount.lateRate" class='circle' :size="212" :trail-width='1' trail-color='#3aa9ff' :stroke-width='3' stroke-color='#FF782E'>
					<div class="circleTxt">
						漏检
					</div>
					<div  class="circleNum">
						{{securityCount.lateNum}}
					</div>
				</i-circle>
			</div>
		</div>

	</div>
</template>
<script>
	import $ from 'jquery'
	import vChartSecurityCount from '@/components/chart/ChartSecurityCount'
	
	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('security')
	
	
	export default {
		name: 'SecurityCount',
		props: {
		},
		components: {
			vChartSecurityCount
		},
		data() {
			return {
			}
		},
		computed: {
			...mapGetters([
				'securityCount',
				'address'
			])
		},
		methods: {},
		mounted: function() {}
	}
</script>
<style lang="scss" scoped="scoped">
	.securityCount {
		width: 100%;
		color: #3DA9FF;
		border: 1px solid transparent;
		position: relative;
		.title{
			width: 800px;
			position: absolute;
			left:2px;
			top:2px;
			.name{
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				position: absolute;
				display:inline-block;
				left: 60px;
				bottom: 28px;
				font-size: 16px;
			}
		}
		.content {
			margin: 30px auto 0;
			width: 1558px;
			height: 810px;
			background: url(../../assets/image/securityCount-bg.png) no-repeat;
			background-size: 100% 100%;
			position: relative;
			.count {
				position: absolute;
				left: 130px;
				top: 160px;
				font-size: 18px;
				i {
					vertical-align: middle;
					display: inline-block;
					width: 36px;
					height: 36px;
					margin-right: 8px;
				}
				.estateNum {
					background: url(../../assets/image/securityCount-estate.png) no-repeat;
					background-size: contain;
				}
				.planNum {
					background: url(../../assets/image/securityCount-defend.png) no-repeat;
					background-size: contain;
				}
				span {
					color: white;
					font-size: 48px;
				}
				div:nth-child(2) {
					margin-top: 60px;
				}
			}
			.chartBox {
				position: absolute;
				left: 500px;
				top: 60px;
				width: 955px;
				height: 450px;
			}
			.circleList {
				position: absolute;
				left: 35px;
				left: 135px \9\0;
				top: 500px;
				width: 1486px;
				width: 1286px \9\0;
				height: 250px;
				display: flex;
				justify-content: space-around;
				align-items: center;
				
				display: -ms-inline-flexbox;
				-ms-flex-pack: justify;
				-ms-flex-align: center;
				.circle{
					.circleTxt{
						font-size: 16px;
						position: relative;
						top: -20px;
					}
					.circleNum{
						color: white;
						font-size: 35px;
					}
				}
				.circle:nth-child(3),.circle:nth-child(4){
					.circleTxt{
						color: #FF782E;
					}
					.circleNum{
						color: #FF782E;
					}
				}
				
				
			}
		}
	}
</style>