<template>
	<div class="delete">
		<div class="delete-content">
			<div class="title">
				删除社区民警
			</div>
			<div class="intro">
				确定删除该民警，删除后将从系统中消失
			</div>
			<div class="btn">
				<span class="btn-yes" @click="delsure">确定</span>
				<span class="btn-no" @click="delcancle">取消</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name:'delete',
		props: ['police'],
		methods: {
			delsure: function () {
				this.$emit('delsure')
			},
			delcancle: function () {
				this.$emit('delcancle')
			}
		}
	}
</script>

<style lang='scss' scoped>
	.delete {
		position: fixed; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0, 0, 0, .66); z-index: 9;
		display: flex; justify-content: center; align-items: center;
		.delete-content {
			width: 480px;
			height: 260px;
			background: url('../../assets/image/special/delete_bg.png') no-repeat;
			background-size: 100% 100%;
			text-align: center;
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
					line-height: 40px;
					background-color: #1c7bb6;
					color: #fff;
					cursor: pointer;
				}
				.btn-yes {
					margin-right: 80px;
					background-color: #33ace5;
				}
			}
		}
	}
</style>