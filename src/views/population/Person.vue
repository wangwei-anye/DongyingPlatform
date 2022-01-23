<template>
	<div class="person">
		<div>
			<div class="manBg" :style='widthStyle' :class="{active:type=='woman'}"></div>
			<div ref="man" :style='widthStyle' class="man" :class="{active:type=='woman'}"></div>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'
	export default {
		name: 'Person',
		props: {
			percent: {
				type: Number,
				default: 100
			},
			type: {
				type: String,
				default: 'man'
			}
		},
		components: {},
		data() {
			return {
				widthStyle: {
					'width': this.type == 'man' ? '371px' : '376px'
				}
			}
		},
		watch: {
			percent(newValue, oldValue) {
				var percentPx = 0;
				if(this.type == 'man') {
					percentPx = parseInt(this.percent / 10) * 38;
					percentPx = percentPx + (this.percent % 10) / 10 * 31;
				} else {
					percentPx = parseInt(this.percent / 10) * 39;
					percentPx = percentPx + (this.percent % 10) / 10 * 26;
				}
				percentPx = percentPx + 'px 73px';
				$(this.$refs.man).css('-webkit-mask-size', percentPx);
			}
		},
		methods: {},
		mounted: function() {
			var percentPx = 0;
			if(this.type == 'man') {
				percentPx = parseInt(this.percent / 10) * 38;
				percentPx = percentPx + (this.percent % 10) / 10 * 29;
			} else {
				percentPx = parseInt(this.percent / 10) * 39;
				percentPx = percentPx + (this.percent % 10) / 10 * 20;
			}
			percentPx = percentPx + 'px 73px';
			$(this.$refs.man).css('-webkit-mask-size', percentPx);
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.person {
		height: 73px;
		position: relative;
		display: inline-block;
		.manBg {
			z-index: 1;
			position: absolute;
			left: 0;
			top: 0;
			height: 73px;
			background: url(../../assets/image/populatin-man-bg.png) no-repeat;
		}
		.manBg.active {
			background: url(../../assets/image/populatin-woman-bg.png) no-repeat;
		}
		.man {
			z-index: 2;
			position: absolute;
			left: 0;
			top: 0;
			height: 73px;
			background: url(../../assets/image/populatin-man.png) no-repeat;
			-webkit-mask: url(../../assets/image/population-mask.png);
			-webkit-mask-repeat: no-repeat;
			-webkit-mask-position: 0px 0px;
		}
		.man.active {
			background: url(../../assets/image/populatin-woman.png) no-repeat;
		}
	}
</style>