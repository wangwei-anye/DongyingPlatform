<template>
	<div class="notify">
			<div class="title">
				* 友情提示 *
			</div>
			<div class="intro">
				{{notifyMsg}}
			</div>
	</div>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
  const {mapState, mapMutations, mapActions} = createNamespacedHelpers('search')
	export default {
		name:'searchNotify',
		methods: {
			...mapMutations([])
		},
		computed: {
			...mapState([
				'notifyMsg'
		  	])
		}
	}
</script>

<style lang='scss' scoped>
	.notify {
		width: 450px;
		height: 200px;
		background: url('../assets/image/special/delete_bg.png') no-repeat;
		background-size: 100% 100%;
		position: absolute;
		/*top: calc(50% - 130px);*/
		/*left: calc(50% - 240px);*/
		text-align: center;
		.title {
			font-size: 22px;
			color: #45c1fb;
			position: relative;
			top: 50px;
		}
		.intro {
			color: #fff;
			font-size: 16px;
			color: white;
			position: relative;
			top: 85px;
		}
		.btn {
			margin-top: 30px;
			span {
				display: inline-block;
				width: 100px;
				height: 40px;
				background-color: #1c7bb6;
				padding: 5px 8px;
				color: #fff;
				cursor: pointer;
			}
			.btn-yes {
				margin-right: 80px;
				background-color: #33ace5;
			}
		}
	}
</style>