<template>
	<div class="container">
		<div class="panel" >
			<div class="content">
					<td-map></td-map>
			</div>
		</div>
	</div>
</template>

<script>
  	import tdMap from './map'
	export default {
		name:'tdmapModule',
		components: {
			tdMap
		}
	}
</script>

<style lang='scss' scoped>
	.container {
		.panel {
			width: 1655px;
			height: 950px;
			background-color: rgba(15,145,255,0.1);
		}
		.content{
		    height: 100%;
            width: 100%;
            // margin: '5 auto';
            // position: absolute;
		}
	}
</style>