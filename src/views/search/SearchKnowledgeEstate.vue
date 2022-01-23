<template>
	<div class="knowledgeEstate">
		<iframe class="knowledgeIFrame" :style=pStyle></iframe>
	</div>
</template>
<script>
	import $ from 'jquery'
	import { apiAddr } from '@/config'

	export default {
		name: 'SearchKnowledgeEstate',
		props: {
			unitId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				index: 1,
			}
		},
		computed: {
            pStyle: function () {
                let pw = "1870px";
                let ua = window.navigator.userAgent;
                if(ua.indexOf(".NET") !== -1 || ua.indexOf("Firefox") !== -1){
                    pw = "1863px";
                }
                return {
                    width: pw
                };
            }
		},
		methods: {},
		mounted: function() {
			var cityCode = this.$store.state.platform.city_code;
			$(".knowledgeIFrame").attr('src', "static/knowledge/knowledge.html?unitId=" + this.unitId + "&apiAddr=" + apiAddr + "&cityCode=" + cityCode);
		},
		watch: {
			'unitId': function(curVal, oldVal) {
				var cityCode = this.$store.state.platform.city_code;
				$(".knowledgeIFrame").attr('src', "static/knowledge/knowledge.html?unitId=" + curVal + "&apiAddr=" + apiAddr + "&cityCode=" + cityCode);
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.knowledgeEstate {
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