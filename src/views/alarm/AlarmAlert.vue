<template>
	<div class="alarmAlert">
		<img class="pic" :src=photoUrl />
		<img class="border" src="../../assets/image/alarm-alert-border.png"></img>
		<i class="close" @click='close'></i>
	</div>
</template>

<script>
	import $ from 'jquery'
	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('alarm')

	export default {
		components: {},
		props: {
			photoUrl: {
				type: String,
				default: '',
				required: true
			}
		},
		name: 'AlarmAlert',
		data() {
			return {}
		},
		methods: {
			close: function() {
				this.$emit('close');
			},
			...mapMutations([]),
			...mapActions([])
		},
		computed: {
			...mapGetters([

			]),
			...mapState([])
		},
		mounted: function() {}
	}
</script>

<style lang="scss" scoped="scoped">
	.alarmAlert {
		position: fixed;
		top: 50%;
		left: 50%;
		margin-left: -701px;
		margin-top: -396px;
		z-index: 99999;
		width: 1402px;
		height: 792px;
		background: url(../../assets/image/alarm-alert-bg.png) no-repeat;
		.border {
			width: 100%;
			height: 100%;
			display: block;
			z-index: 10;
			position: absolute;
			left: 0;
			top: 0;
		}
		.pic {
			height: 100%;
			display: block;
			z-index: 5;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
			-webkit-transform: translate(-50%,-50%);
			-moz-transform: translate(-50%,-50%);
			-ms-transform: translate(-50%,-50%);
		}
		.close {
			width: 40px;
			height: 40px;
			background: url(../../assets/image/alarm-alert-close.png) no-repeat;
			display: block;
			position: absolute;
			top: 0;
			right: -40px;
			cursor: pointer;
		}
	}
</style>