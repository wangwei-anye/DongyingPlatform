<template>
	<div class="container">
		<!-- <div class="search_loc">
			<img src="../../assets/image/special/icon/loc.png" height="30" width="24" alt="">
			<span>{{currentLoc}}</span>
		</div> -->
		<div class="search_drop_city search_drop">
			<span>县区：</span>
			<div style="width:160px; height:40px; margin: 0 auto;">
				<Select v-model="selected.town" class="v-select" placeholder="县区" @on-change='getPolice1(selected)'>
					<!--<Option value="" key="all">请选择</Option>-->
					<Option v-for="item in townList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</div>
		</div>
		<div class="search_drop_town search_drop">
			<span>派出所：</span>
			<div style="width:160px; height:40px; margin: 0 auto;">
				<Select v-model="selected.police" class="v-select" placeholder="派出所" @on-change='getUnit1(selected)'>
					<!--<Option value="" key="all">请选择</Option>-->
					<Option v-for="item in policeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</div>
		</div>
		<!--<div class="search_drop_town search_drop">
			<span>街道办/乡镇：</span>
			<div style="width:160px; height:40px; margin: 0 auto;">
				<Select v-model="selected.country" class="v-select" placeholder="街道办/乡镇" @on-change='getCommunity1(selected)'>
					&lt;!&ndash;<Option value="" key="all">请选择</Option>&ndash;&gt;
					<Option v-for="item in countryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</div>
		</div>
		<div class="search_drop_community search_drop">
			<span>居委会/村：</span>
			<div style="width:160px; height:40px; margin: 0 auto;">
				<Select v-model="selected.community" class="v-select" placeholder="居委会/村" @on-change='getUnit1(selected)'>
					&lt;!&ndash;<Option value="" key="all">请选择</Option>&ndash;&gt;
					<Option v-for="item in communityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</div>
		</div>-->
		<div class="search_drop_unit search_drop">
			<span>小区：</span>
			<div style="width:160px; height:40px; margin: 0 auto;">
				<Select v-model="selected.unit" class="v-select" placeholder="小区">
					<!--<Option value="" key="all">请选择</Option>-->
					<Option v-for="item in unitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</div>
		</div>
		<div class="search_btn" @click='getAllData()'>
			<v-Button :btnInfo='btnInfo'></v-Button>
		</div>
	</div>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    import vButton from '@/components/Button'

    const {mapState, mapMutations, mapActions} = createNamespacedHelpers('special');

    export default {
        name:'dataSelect',
        components: {
            vButton
        },
        data () {
            return {
                selected:{
                    town:'',
                    country: '',
                    community: '',
                    unit: ''
                },
                btnInfo: {
                    text: '查询', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
                    styles: {
                        width: '100px',
                        height: '40px',
                        border: 'none',
                        borderRadius: '2px',
                        color: '#111',
                        fontSize: '16px',
                        fontWeight: 'normal',
                        backgroundColor: '#e9cb44',
                        hoverColor: 'none'
                    }, // 此选项可有可无，无则接受type为'default'的样式
                    type: 'default' // 此选项可有可无，默认为'default': 'primary', 'info', 'danger', 'warning', 'success', 'default'
                }
            }
        },
        methods: {
            getAllData () {
                this.updateSelected(this.selected);
                this.getData();
                this.initMap();
                this.drawKeyAndLove();
                this.getLists({pageNo: 1});
            },
            getCountry1 (selectWord) {
                this.clearTownSelect();
                this.getCountry(selectWord);
            },
            getPolice1 (selectWord) {
                this.clearTownSelect();
                this.getPolice(selectWord);
            },
            getCommunity1 (selectWord) {
                this.clearCountrySelect();
                this.getCommunity(selectWord);
            },
            getUnit1 (selectWord) {
				this.clearPoliceSelect();
                this.getUnit(selectWord);
            },
            ...mapMutations([
                'updateSelected',
                'clearTownSelect',
                'clearCountrySelect',
                'clearCommunitySelect',
				'clearPoliceSelect',
				'updateSelection'
            ]),
            ...mapActions([
                'getTown',
                'getPolice',
                'getCountry',
                'getCommunity',
                'getUnit',
                'getData',
                'getLists',
                'initMap',
                'drawKeyAndLove'
            ])
        },
        computed: {
            ...mapState([
                'currentLoc',
                'selection',
                'townList',
                'policeList',
                'countryList',
                'communityList',
                'unitList',
                'defaultTownCode',
                'defaultPoliceCode',
                'defaultTownshipCode',
                'defaultVillageCode',
                'defaultUnitId'
            ])
        },
        created () {
            console.log('selection created');
			this.updateSelection({
                town: this.defaultTownCode,
				police: this.defaultPoliceCode,
                country: this.defaultTownshipCode,
                community: this.defaultVillageCode,
				unit: this.defaultUnitId
			});
            this.getTown();
            this.selected.town = this.defaultTownCode;
			let params= {
                town: this.defaultTownCode,
				police: this.defaultPoliceCode,
              	//country: this.defaultTownshipCode,
              	//community: this.defaultVillageCode
            };
          	//this.getCountry1(params);
          	//this.getCommunity1(params);
			this.getPolice1(params);
            this.getUnit1(params);
        },
		mounted () {
            console.log('selection mounted');
            this.selected.country = this.defaultTownshipCode;
            this.selected.community = this.defaultVillageCode;
            this.selected.police = this.defaultPoliceCode;
            this.selected.unit = this.defaultUnitId;
		}
    }
</script>

<style lang='scss' scoped>
	$textPrimary: #45c1fb;
	$textSecondary: #f1f1f1;
	.container {
		height: 100px;
		width: 100%;
		display: flex;
		align-items: center;

		display: -ms-inline-flexbox;
		-ms-flex-align: center;

		color: $textPrimary;
		font-size: 18px;
		.search_loc {
			display: inline-block;
			margin-right: 60px;
			font-size: 20px;
			img {
				vertical-align: middle;
			}
		}
		.search_drop {
			display: inline-block;
			margin-right: 40px;
			div {
				display: inline-block;
			}
		}
		.search_btn {
			display: inline-block;
		}
	}
</style>