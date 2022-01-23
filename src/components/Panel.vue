<template>
	<div class="panel" :style="'width:' + width + 'px'">
		<div class="title">{{title}}</div>
		<div class="content">
			<slot>
			</slot>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'
	export default {
		name: 'Panel',
		props: {
			title: {
				type: String,
				default: ''
			},
      width: {
        type: Number,
        default: 1655
      }
		},
		data() {
			return {

			}
		},
		mounted: function() {
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.panel {
		width: 1614px;
		background-color: rgba(15,145,255,0.1);
		.title{
			width: 100%;
			height: 40px;
			line-height: 40px;
			padding-left: 40px;
			font-size: 18px;
			color: white;
			background: url(../assets/image/panel-title.png) no-repeat;
			background-size:100% 100% ;
		}
	}
</style>