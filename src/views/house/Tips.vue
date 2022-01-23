<template>
	<div class="tips">
		<div class="title">
			<span class="name">{{info.roomCode}}</span>
			<span class="type">{{info.use_status?info.use_status:'未知'}}</span>
			<div class="colorblock" v-bind:class="{type1:roomType == '自住',type2:roomType == '出租',type3:roomType == '商用',type4:roomType == '空置',type5:roomType == '其他'}"></div>
		</div>
		<div class="info">
			<div class="item">房型：{{info.area_inside?info.area_inside:0}}平米</div>
			<div class="item">姓名：{{info.name?info.name:0}}</div>
			<div class="item">成员：{{info.count?info.count:0}}人</div>
			<div class="item">用电量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="icon up"></i> {{info.electricRate?info.electricRate:0}}%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{info.electric?info.electric:0}}kw/h</div>
			<div class="item">用水量&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="icon up"></i> {{info.waterRate?info.waterRate:0}}%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{info.water?info.water:0}}t</div>
			<div class="item">天然气&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class="icon down"></i> {{info.gasRate?info.gasRate:0}}%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{info.gas?info.gas:0}}nm³</div>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'

	export default {
		name: 'Tips',
		props: {
			info: {
				type: Object,
				default: function() {
					return {
						roomCode: '无',
						use_status: '自住',
						area_inside: '无',
						name: "",
						count: 0,
						electric: 0,
						electricRate: 0,
						water: 0,
						waterRate: 0,
						gas: 0,
						gasRate: 0
					};
				}
			}
		},
		data() {
			return {
				roomType:'自住'
			}
		},
		methods: {},
		mounted: function() {

		},
		watch: {
			info: {　　　　
				handler(newValue, oldValue) {　　　
					this.roomType = newValue.use_status;
				},
				deep: true　　
			}
		},

	}
</script>
<style lang="scss" scoped="scoped">
	.tips {
		width: 350px;
		height: 230px;
		color: white;
		background: url(../../assets/image/houseTips.png) no-repeat;
		.title {
			padding-left: 14px;
			line-height: 45px;
			font-size: 18px;
			font-weight: bold;
			.colorblock {
				vertical-align: middle;
				width: 23px;
				height: 14px;
				background-color: #ffda2e;
				margin-right: 10px;
				margin-top: 13px;
				float: right;
				&.type1 {
					background-color: #0084D7;
				}
				&.type2 {
					background-color: #FFDA2F;
				}
				&.type3 {
					background-color: #FF6100;
				}
				&.type4 {
					background-color: #6B58FF;
				}
				&.type5 {
					background-color: #00BC5D;
				}
			}
			.type {
				float: right;
				margin-right: 10px;
			}
		}
		.info {
			padding: 5px 55px;
			.item {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				line-height: 27px;
				font-size: 15px;
				.icon {
					width: 10px;
					height: 14px;
					display: inline-block;
				}
				.up {
					background: url(../../assets/image/house-icon-up.png) no-repeat;
					background-size: 100% 100%;
				}
				.down {
					background: url(../../assets/image/house-icon-down.png) no-repeat;
					background-size: 100% 100%;
				}
			}
		}
	}
</style>