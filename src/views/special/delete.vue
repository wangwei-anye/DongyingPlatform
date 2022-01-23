<template>
	<div class="delete">
			<div class="title">
				删除特殊人员？
			</div>
			<div class="intro">
				删除该特殊人员，将会在系统中消失
			</div>
			<div class="btn">
				<span class="btn-yes" @click='confirmDel({usr: usrid})'>确定</span>
				<span class="btn-no" @click='mshowDel'>取消</span>
			</div>
	</div>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'

  	const {mapState, mapMutations, mapActions} = createNamespacedHelpers('special');

	export default {
		name:'delete',
		props: ['usrid'],
		methods: {
			...mapMutations([
				'mshowDel'
			]),
			...mapActions([
				'confirmDel'
			])
		},

	}
</script>

<style lang='scss' scoped>
	.delete {
		width: 480px;
		height: 260px;
		background: url('../../assets/image/special/delete_bg.png') no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: calc(50% - 130px);
		left: calc(50% - 240px);
		text-align: center;
		z-index: 5;
		.title {
			font-size: 22px;
			color: #45c1fb;
			margin-top: 30px;
			margin-bottom: 40px;
		}
		.intro {
			color: #fff;
			font-size: 16px;
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