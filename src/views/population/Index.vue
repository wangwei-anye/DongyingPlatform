<template>
	<div class="population">
		<v-searchBar></v-searchBar>
		<v-panel  title='人口分布' class='v-panel'>
			<v-map></v-map>
		</v-panel>
		<v-panel  title='人口数据统计' class='v-panel'>
			<v-chart></v-chart>
		</v-panel>
		<v-panel  title='人口列表' class='v-panel'>
			<v-table></v-table>
		</v-panel>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vSearchBar from '@/views/house/SearchBar'
	import vChart from './chart'
	import vTable from '@/views/population/Table'
	import vPanel from '@/components/Panel'
	import vMap from '@/views/population/Map'
	export default {
		name: 'Index',
		props: {},
		components: {
			vSearchBar,
			vChart,
			vTable,
			vPanel,
			vMap,
		},
		data() {
			return {
				
			}
		},
		methods: {
			switchTabIndex: function() {

			}
		},
		mounted: function() {}
	}
</script>
<style lang="scss" scoped="scoped">
	.population {
		.v-panel{
			margin-top: 18px;
		}
		.v-panel:nth-child(2){
			margin-top: 0;
		}
	}
</style>
