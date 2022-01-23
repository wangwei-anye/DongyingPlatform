<template>
	<div class="houseIndex">
		<v-searchBar></v-searchBar>
		<v-panel  title='小区户数分布' class='v-panel'>
			<v-map></v-map>
		</v-panel>
		<v-panel  title='房屋数量' class='v-panel'>
			<v-houseCount></v-houseCount>
		</v-panel>
		<v-panel  title='房屋商用数据' class='v-panel'>
			<v-houseBusiness></v-houseBusiness>
		</v-panel>
		<v-panel  title='房屋列表' class='v-panel'>
			<v-houseList></v-houseList>
		</v-panel>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vSearchBar from '@/views/house/SearchBar'
	import vHouseList from './HouseList'
	import vHouseCount from './HouseCount'
	import vHouseBusiness from './HouseBusiness'
	import vPanel from '@/components/Panel'
	import vMap from '@/views/house/Map'
	export default {
		name: 'HouseIndex',
		props: {},
		components: {
			vSearchBar,
			vHouseList,
			vHouseCount,
			vHouseBusiness,
			vPanel,
			vMap
		},
		data() {
			return {

			}
		},
		methods: {
			switchTabIndex: function() {

			}
		},
		mounted: function() {
			
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.houseIndex {
		.v-panel{
			margin-top: 18px;
		}
		.v-panel:nth-child(2){
			margin-top: 0;
		}
	}
</style>