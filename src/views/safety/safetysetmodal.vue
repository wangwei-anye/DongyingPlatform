<template>
	<div class="safetysetmodal">
		<div class="modal-content">
			<div class="modal-content-header">设置不能保存</div>
      <div class="modal-content-info">
        各项权重值之和不等于100%
      </div>
      <div class="modal-content-footer">
        <Button class="app-button-confirm" @click="btnSubmit">确 定</Button>
      </div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'safetysetmodal',
		methods: {
			btnSubmit () {
				this.$emit('closeModal');
			}
		}
	}
</script>

<style lang='scss' scoped>
	.safetysetmodal {
		position: fixed; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0, 0, 0, .66);
		display: flex; align-items: center; justify-content: center; z-index: 999999;
		.modal-content {
			width: 484px; height: 278px; background-image: url('../../assets/image/safetysetmodal.png');
			.modal-content-header {
				font-size: 22px; color: #4fc7ff; text-align: center; margin: 45px 0;
			}
			.modal-content-info {
				font-size: 16px; color: #ffffff; text-align: center; margin-bottom: 45px;
			}
			.modal-content-footer {
				text-align: center;
			}
		}
	}
</style>
