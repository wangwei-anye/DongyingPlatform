<template>
	<div class="securityCount">
		<div class='title'>
			<img src="../../assets/image/securityCount-logo.png" />
			<div class="name">{{address}}</div>
		</div>
		<div class="content">
			<div class="count">
				<div>
					<i class="estateNum"></i>小区总数：<span>{{populationRateData.unitCount}}</span>
				</div>
				<div>
					<i class="planNum"></i>人口总数：<span>{{populationRateData.populationCount}}</span>
				</div>
			</div>
			<div class="personPercent">
				<div class="woman">
					<v-person :percent='populationRateData.sex.womanRate' type='woman'></v-person>
					<div class="txt">
						<div class="rate">{{populationRateData.sex.womanRate}}%</div>
						<div class="val">女：{{populationRateData.sex.womanNum}}人</div>
					</div>
				</div>
				<div class="man">
					<v-person :percent='populationRateData.sex.manRate' type='man'></v-person>
					<div class="txt">
						<div class="rate">{{populationRateData.sex.manRate}}%</div>
						<div class="val">男：{{populationRateData.sex.manNum}}人</div>
					</div>
				</div>
			</div>
			<div class="chartBox">
				<v-chartBar :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
			</div>
			<div class="circleList">
				<i-circle :percent="populationRateData.populationType.residenceRate" class='circle' :size="184" :trail-width='4' trail-color='#235182' :stroke-width='4' stroke-color='#40ffd0'>
					<div class="circleNum">
						{{populationRateData.populationType.residenceRate}}<span>%</span>
					</div>
					<div class='circleDes'>常住人口</div>
				</i-circle>
				<i-circle :percent="populationRateData.populationType.flowRate" class='circle' :size="184" :trail-width='4' trail-color='#235182' :stroke-width='4' stroke-color='#3e8eff'>
					<div class="circleNum">
						{{populationRateData.populationType.flowRate}}<span>%</span>
					</div>
					<div class='circleDes'>流动人口</div>
				</i-circle>
			</div>
		</div>

	</div>
</template>
<script>
	import $ from 'jquery'
	import vPerson from '@/views/population/Person'
	import vChartBar from '@/components/chart/ChartBar'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('population')

	export default {
		name: 'SecurityCount',
		props: {},
		components: {
			vPerson,
			vChartBar
		},
		data() {
			return {
				panelStyle: {
					'width': this.w + 'px'
				},
			}
		},
		computed: {
			chartBarDataArr() {
				var yArr = [];
				if(this.populationData && this.populationData.age){
					yArr = [this.populationData.age.age1, this.populationData.age.age2, this.populationData.age.age3, this.populationData.age.age4];
				}
				var obj = {
					xDataArr: ['0~17岁', '17~34岁', '34~60岁', '60岁以上'],
					legendArr: [], //需要提示的标签
					yDataArr: [{
						name: '年龄分布',
						type: 'bar',
						yAxisIndex: 0,
						data: yArr,
						labelPositon: 'top', //柱条文字 位置  '' 则没有  比如 top inside
						labelColor: '#49c0ff',
						labelSize: 20,
						itemStyle: [{
							offset: 0,
							color: '#40ffd0'
						}, {
							offset: 1,
							color: '#0c49a6'
						}] //同上
					}],
					yAxis: [{
						name: '年龄分布',
						formatter: '{value}',
						splitLine: true
					}]
				}
				return obj;
			},
			...mapState([
				'populationData'
			]),
			...mapGetters([
				'populationRateData',
				'address'
			])
		},
		methods: {
			...mapMutations([]),
			...mapActions([
				'getData'
			])
		},
		mounted: function() {
//			this.getData();
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.securityCount {
		color: #3DA9FF;
		border: 1px solid transparent;
		position: relative;
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
				left: 110px;
				top: 70px;
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
					background: url(../../assets/image/population-icon-person.png) no-repeat;
					background-size: contain;
				}
				span {
				    position : relative;
					top:8px;
					color: white;
					font-size: 48px;
				}
				div:nth-child(2) {
					margin-top: 10px;
				}
			}
			.personPercent {
				position: absolute;
				left: 110px;
				top: 270px;
				width: 606px;
				height: 200px;
				.woman {
					position: relative;
					color: #FF6F7C;
				}
				.man {
					margin-top: 8px;
					margin-left: 2px;
					position: relative;
					color: #1C97FF;
				}
				.txt {
					position: absolute;
					left: 400px;
					top: 0px;
					.rate {
						font-size: 40px;
						line-height: 50px;
					}
					.val {
						font-size: 14px;
					}
				}
			}
			.chartBox {
				position: absolute;
				left: 700px;
				top: 60px;
				width: 780px;
				height: 700px;
			}
			.circleList {
				position: absolute;
				left: 35px;
				left: 135px \9\0;
				top: 500px;
				width: 606px;
				width: 506px \9\0;
				height: 200px;
				display: flex;
				justify-content: space-around;
				align-items: center;
				
				display: -ms-inline-flexbox;
				-ms-flex-pack: justify;
				-ms-flex-align: center;
				
				.circle {
					.circleNum {
						color: white;
						font-size: 35px;
						position: relative;
						top: 12px;
						margin-left: 8px;
						span {
							font-size: 16px;
						}
					}
					.circleDes {
						position: relative;
						top: 98px;
						font-size: 22px;
					}
				}
			}
		}
	}
</style>