<template>
	<div class="container">
		<div class="overview">
			<div class="face-icon">
				<span>车场状况：</span>
				<span>{{carData.msg}}</span>
				<img src="../../assets/image/car/fine.png" height="37" width="37" alt="" v-if="carData.park_status != 1">
				<img src="../../assets/image/car/nervers.png" height="37" width="37" alt="" v-if="carData.park_status == 1">
			</div>
			<div class="rest-icon">
				<svg id='d3' width='120' height='120'></svg>
			</div>
		</div>
		<div class="detail">
			<div class="places total">
				<span>总车位</span>
				<span>{{carData.park_total_count}}</span>
				<div></div>
			</div>
			<div class="places user">
				<span>业主车位</span>
				<span>{{carData.park_owner_count}}</span>
				<div></div>
			</div>
			<div class="places tmp">
				<span>临时车位</span>
				<span>{{carData.park_temporary_count}}</span>
				<div></div>
			</div>
			<div class="places occupied">
				<span>已使用车位</span>
				<span>{{carData.park_using_count}}</span>
				<div></div>
			</div>
			<div class="places rest">
				<span>剩余车位</span>
				<span>{{carData.park_free_count}}</span>
				<div></div>
			</div>
		</div>
	</div>
</template>

<script>
	var d3 = require('d3')
	import { liquidFillGaugeDefaultSettings, loadLiquidFillGauge } from '../../assets/js/liquidFillGauge.js'
	export default {
		name: 'CarData',
		props: ['carData'],
		mounted() {
			var config2 = liquidFillGaugeDefaultSettings();
			config2.maxValue = this.carData.park_total_count;
			loadLiquidFillGauge("d3", this.carData.park_free_count);
		},
		watch: {
			'carData': function(culData, oldData) {
				var config2 = liquidFillGaugeDefaultSettings();
				config2.maxValue = culData.park_total_count;
				loadLiquidFillGauge("d3", culData.park_free_count);
			}
		}
	}
</script>

<style lang='scss' scoped>
	.container {
		width: 100%;
		height: 100%;
		padding-left: 15px;
		padding-top: 15px;
		.overview {
			width: 120px;
			height: 100%;
			display: inline-block;
			float: left;
			margin-right: 5px;
			.face-icon {
				span {
					&:nth-child(1) {
						display: block;
						font-size: 12px;
						color: #1cb1ff;
					}
					&:nth-child(2) {
						font-size: 36px;
						color: #fff;
						vertical-align: super;
					}
				}
			}
			.rest-icon {
				width: 110px;
				height: 110px;
				margin-top: 35px;
				position: relative;
				left: -5px;
			}
		}
		.detail {
			width: 60%;
			height: 100%;
			display: inline-block;
			.places {
				width: 100%;
				height: 20%;
				color: #a4aec1;
				font-size: 15px;
				div {
					height: 3px;
					margin-top: 3px;
				}
				&:nth-child(1) {
					div {
						background-color: #ffda2e;
					}
				}
				&:nth-child(2) {
					div {
						background-color: #1a7bff;
					}
				}
				&:nth-child(3) {
					div {
						background-color: #657bff;
					}
				}
				&:nth-child(4) {
					div {
						background-color: #ff3636;
					}
				}
				&:nth-child(5) {
					div {
						background-color: #2eff4c;
					}
				}
			}
			.places span {
				display: inline-block;
				line-height: 100%;
				vertical-align: middle;
				&:nth-child(2) {
					float: right;
					color: #fff;
					font-size: 24px;
				}
			}
		}
	}
</style>