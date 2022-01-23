<template>
	<div class="securityIndex">
		<v-searchBar></v-searchBar>
		<v-panel  title='小区巡查合格率分布' class='v-panel'>
			<v-securityMap></v-securityMap>
		</v-panel>
		<v-panel  title='巡查情况' class='v-panel'>
			<v-securityCount></v-securityCount>
		</v-panel>
		<v-panel  title='巡查时序图' class='v-panel'>
			  <v-securityTime></v-securityTime>
		</v-panel>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vSearchBar from '@/views/house/SearchBar'
	import vSecurityMap from '@/views/security/SecurityMap'
	import vSecurityTime from './SecurityTime'
	import vSecurityCount from './SecurityCount'
	import vPanel from '@/components/Panel'
	export default {
		name: 'SecurityIndex',
		props: {},
		components: {
			vSearchBar,
			vSecurityTime,
			vSecurityCount,
			vSecurityMap,
			vPanel
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
	.securityIndex {
		.v-panel{
			margin-top: 18px;
		}
		.v-panel:nth-child(2){
			margin-top: 0;
		}
	}
</style>
