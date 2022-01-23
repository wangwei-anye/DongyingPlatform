<template>
	<div class="houseCount">
		<div class='title'>
			<img src="../../assets/image/securityCount-logo.png" />
			<div class="name">{{address}}</div>
		</div>
		<div class="content">
			<div class="count">
				<div>
					<i class="estateNum"></i>小区总数：<span>{{houseState.zxqs}}</span>
				</div>
				<div>
					<i class="planNum"></i>房屋总数：<span>{{houseState.zhs}}</span>
				</div>
				<div>
					<i class="percent"></i>入住率：&nbsp;&nbsp;&nbsp;<span>{{parseFloat(houseState.zlyRate * 100).toFixed(2)}}%</span>
				</div>
			</div>
			<div class="chartBox">
				<v-chartHouseCount></v-chartHouseCount>
			</div>
			<div class="circleList">
				<i-circle :percent="houseState.zzRate * 100" class='circle' :size="182" :trail-width='4' trail-color='#235182' :stroke-width='4' stroke-color='#3FB5FD'>
					<div class="circleNum">
						{{parseFloat(houseState.zzRate * 100).toFixed(2)}}<span>%</span>
					</div>
					<div class="des">
						自住
					</div>
				</i-circle>
				<i-circle :percent="houseState.fzRate * 100" class='circle' :size="182" :trail-width='4' trail-color='#235182' :stroke-width='4' stroke-color='#FFF370'>
					<div class="circleNum">
						{{parseFloat(houseState.fzRate * 100).toFixed(2)}}<span>%</span>
					</div>
					<div class="des">
						出租
					</div>
				</i-circle>
				<i-circle :percent="houseState.syRate * 100" class='circle' :size="182" :trail-width='4' trail-color='#235182' :stroke-width='4' stroke-color='#FF8B46'>
					<div class="circleNum">
						{{parseFloat(houseState.syRate * 100).toFixed(2)}}<span>%</span>
					</div>
					<div class="des">
						商用
					</div>
				</i-circle>
				<i-circle :percent="houseState.kzRate * 100" class='circle' :size="182" :trail-width='4' trail-color='#235182' :stroke-width='4' stroke-color='#5D7EFF'>
					<div class="circleNum">
						{{parseFloat(houseState.kzRate * 100).toFixed(2)}}<span>%</span>
					</div>
					<div class="des">
						空置
					</div>
				</i-circle>
				<i-circle :percent="houseState.qtRate * 100" class='circle' :size="182" :trail-width='4' trail-color='#235182' :stroke-width='4' stroke-color='#50FF57'>
					<div class="circleNum">
						{{parseFloat(houseState.qtRate * 100).toFixed(2)}}<span>%</span>
					</div>
					<div class="des">
						其他
					</div>
				</i-circle>
			</div>
		</div>

	</div>
</template>
<script>
	import $ from 'jquery'
	import vChartHouseCount from '@/components/chart/ChartHouseCount'

	import { createNamespacedHelpers } from 'vuex'
	const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('house')

	export default {
		name: 'HouseCount',
		props: {},
		components: {
			vChartHouseCount
		},
		data() {
			return {}
		},
		computed: {
			...mapState([
				'houseState',
			]),
			...mapGetters([
				'address',
			])
		},
		methods: {
			...mapMutations([
			]),
			...mapActions([
				'getHouseState',
			])
		},
		mounted: function() {
//			this.getHouseState();
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.houseCount {
		color: #3DA9FF;
		border: 1px solid transparent;
		position: relative;
		width: 100%;
		.title {
			width: 800px;
			position: absolute;
			left: 2px;
			top: 2px;
			.name {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				position: absolute;
				display: inline-block;
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
				top: 130px;
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
					background: url(../../assets/image/population-icon-house.png) no-repeat;
					background-size: contain;
				}
				.percent {
					background: url(../../assets/image/house_in_Percent.png) no-repeat;
					background-size: contain;
				}
				span {
					color: white;
					font-size: 48px;
					vertical-align: middle;
				}
				div:nth-child(2),
				div:nth-child(3) {
					margin-top: 30px;
				}
			}
			.chartBox {
				position: absolute;
				left: 500px;
				top: 60px;
				width: 955px;
				height: 400px;
			}
			.circleList {
				position: absolute;
				left: 35px;
				left: 135px \9\0;
				top: 480px;
				width: 1486px;
				width: 1286px \9\0;
				height: 250px;
				display: flex;
				justify-content: space-around;
				align-items: center;
				
				display: -ms-flexbox;
				-ms-flex-pack: justify;
				-ms-flex-align: center;
				
				.circle {
					.circleNum {
						margin-left: 10px;
						color: white;
						margin-top: 15px;
						font-size: 50px;
						span {
							font-size: 16px;
						}
					}
					.des {
						position: relative;
						top: 83px;
						font-size: 22px;
					}
				}
			}
		}
	}
</style>