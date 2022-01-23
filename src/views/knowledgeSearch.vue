<template>
	<div class="knowledge">
		<iframe class="knowledgeIFrame"></iframe>
	</div>
</template>
<script>
	import $ from 'jquery'
	import { apiAddr } from '../config'

	export default {
		name: 'Knowledge',
		props: {
			userId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				index: 1,
			}
		},
		computed: {},
		methods: {},
		mounted: function() {
			var cityCode = this.$store.state.platform.city_code;
			$(".knowledgeIFrame").attr('src', "static/knowledge/knowledge.html?uid=" + this.userId + "&apiAddr=" + apiAddr + "&cityCode=" + cityCode);
		},
		watch: {
			'userId': function(curVal, oldVal) {
				var cityCode = this.$store.state.platform.city_code;
				$(".knowledgeIFrame").attr('src', "static/knowledge/knowledge.html?uid=" + curVal + "&apiAddr=" + apiAddr + "&cityCode=" + cityCode);
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.knowledge {
		position: relative;
		.knowledgeIFrame {
			position: absolute;
			top: 40px;
			width: 1870px;
			height: 910px;
			border: none;
		}
	}
</style>