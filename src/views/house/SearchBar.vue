<template>
	<div class="searchBar">
		县区：
		<Select class="v-select" @on-change='changeTownCode' label-in-value :value="townCode" :label="townName" placeholder="县区">
			<Option v-for="item in townList" :value="item.town_code" :key="item.town_code">{{ item.town_name }}</Option>
		</Select>
		派出所：
		<Select class="v-select" @on-change='changePoliceCode' label-in-value :value="policeCode" placeholder="派出所">
			<Option v-for="item in policeCodeList" :value="item.police_code" :key="item.police_code">{{ item.police_name }}</Option>
		</Select>
		小区：
		<Select class="v-select" @on-change='changeUnitId' label-in-value :value="unitId" placeholder="小区">
			<Option v-for="item in unitIdList" :value="item.unit_id" :key="item.unit_id">{{ item.unit_name }}</Option>
		</Select>
		<v-Button @click='startSearch()' class='v-btn'></v-Button>
	</div>
</template>
<script>
	import router from '../../router'
	import $ from 'jquery'
	import vButton from '@/components/Button'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('searchBar')

	export default {
		name: 'SearchBar',
		props: {},
		components: {
			vButton
		},
		data() {
			return {}
		},
		computed: {
			...mapState([
				'townList',
				'policeCodeList',
				'unitIdList',
				'townCode',
				'townName',
				'policeCode',
				'unitId',
				'defaultTownCode',
				'defaultPoliceCode',
				'defaultUnitId'
			]),
			...mapGetters([]),
		},
		methods: {
			startSearch: function() {
				this.search();
			},
			changeTownCode: function(val) {
				var code = val.value;
				var label = val.label;
				if(code == 'all') {
					code = "";
					label = "";
					this.updateTownCode(code);
					this.clear('policeCode');
				} else if(code != '') {
					this.updateTownCode(code);
					this.clear('policeCode');
					var that = this;
					this.getPoliceList()
				}

				for(var p = 0; p < this.townList.length; p++) {
					if(this.townList[p].town_code == code) {
						this.updateTownName(this.townList[p].town_name);
					}
				}
			},
			changePoliceCode: function(val) {
				var code = val.value;
				var label = val.label;
				if(code == 'all') {
					code = "";
					label = "";
					this.updatePoliceCode(code);
					this.clear('unitId');
				} else if(code != '') {
					this.updatePoliceCode(code);
					this.clear('unitId');
					var that = this;
					this.getUnitList();
				}
				for(var p = 0; p < this.policeCodeList.length; p++) {
					if(this.policeCodeList[p].police_code == code) {
						this.updatePoliceName(this.policeCodeList[p].police_name);
					}
				}
			},
			changeUnitId: function(val) {
				var code = val.value;
				var label = val.label;
				if(code == 'all') {
					code = "";
					label = "";
					this.updateUnitId(code);
				} else if(code != '') {
					this.updateUnitId(code);
				}
				for(var p = 0; p < this.unitIdList.length; p++) {
					if(this.unitIdList[p].unit_id == code) {
						this.updateUnitName(this.unitIdList[p].unit_name);
					}
				}
			},
			...mapMutations([
				'updateTownCode',
				'updatePoliceCode',
				'updateUnitId',
				'updateTownName',
				'updatePoliceName',
				'updateUnitName',
				'updateDefaultTownCode',
				'updateDefaultPoliceCode',
				'updateDefaultUnitId'
			]),
			...mapActions([
				'getTownList',
				'getPoliceList',
				'getUnitList',
				'getBuilding',
				'clear',
				'search',
			])
		},
		mounted: function() {},
	}
</script>
<style lang="scss" scoped="scoped">
	.searchBar {
		width: 100%;
		height: 100px;
		color: #3fa7ff;
		font-size: 18px;
		display: flex;
		align-items: center;
		
		display: -ms-inline-flexbox;
		-ms-flex-align: center;
				
		.v-select {
			width: 165px;
			margin-right: 30px;
		}
		.v-btn {
			margin-left: 50px;
		}
	}
</style>