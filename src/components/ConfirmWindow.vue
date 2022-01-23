<template>
	<div class="confirmWindow">
		<div class="window">
			<div class="txt">{{msg}}</div>
			<div class="btn cancel" @click="cancel">取消</div>
			<div class="btn sure" @click="sure">确认</div>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'

	export default {
		name: 'ConfirmWindow',
		data() {
			return {
				msg: '是否添加备注内容？'
			}
		},
		methods: {
			sure: function() {
				this.$emit("sure");
			},
			cancel: function() {
				this.$emit("cancel");
			}
		},
		mounted: function() {},
	}
</script>
<style lang="scss" scoped="scoped">
	.confirmWindow {
		z-index: 9999;
		width: 1920px;
		height: 1080px;
		position: fixed;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.3);
		.window {
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -200px;
			margin-top: -150px;
			width: 400px;
			height: 300px;
			background: url(../assets/image/alertWindow.png) no-repeat;
			background-size: 100% 100%;
			.txt {
				font-size: 20px;
				position: absolute;
				top: 40%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 300px;
				text-align: center;
			}
			.btn {
				cursor: pointer;
				position: absolute;
				left: 100px;
				top: 145px;
				width: 100px;
				height: 36px;
				background-color: #40c7ff;
				text-align: center;
				color: white;
				line-height: 36px;
			}
			.sure {
				left: 80px;
				top: 205px;
			}
			.cancel {
				left: 220px;
				top: 205px;
			}
		}
	}
</style>