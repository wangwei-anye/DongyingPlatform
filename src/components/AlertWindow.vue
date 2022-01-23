<template>
	<div class="alertWindow">
		<div class="window">
			<div class="txt">{{msg}}</div>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'

	export default {
		name: 'AlertWindow',
		data() {
			return {
				msg: ''
			}
		},
		methods: {
			show: function(msg) {
				this.msg = msg;
				$(".alertWindow").show();
				setTimeout(function() {
					$(".alertWindow").hide();
				}, 1500);
			}
		},
		mounted: function() {},
	}
</script>
<style lang="scss" scoped="scoped">
	.alertWindow {
		display: none;
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
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 300px;
				text-align: center;
			}
		}
	}
</style>