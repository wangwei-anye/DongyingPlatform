<template>
	<div class="container">
		<div class="selection" :style=pStyle>
			<special-select></special-select>
		</div>
		<v-panel  title='特殊群体分布' class='v-panel' :style=pStyle>
			<special-map></special-map>
		</v-panel>
		<v-panel  title='人口数据' class='v-panel' :style=pStyle>
			<special-charts></special-charts>
		</v-panel>
		<v-panel  title='人员列表' class='v-panel' :style=pStyle>
			<special-table></special-table>
		</v-panel>
	</div>
</template>

<script>
  import specialSelect from './selection'
  import specialMap from './map'
  import specialCharts from './charts'
  import specialTable from './table'
  import vPanel from '@/components/Panel'
	export default {
		name:'specialModule',
		components: {
			specialSelect,
			specialMap,
			specialCharts,
			specialTable,
			vPanel
		},
        computed: {
            pStyle: function () {
                let styleModel = {};
                let ua = window.navigator.userAgent;
                if(ua.indexOf(".NET") !== -1 || ua.indexOf("Firefox") !== -1){
                    styleModel = {
                        width: "1638px"
                    };
                }
                return styleModel;
            }
        }
	}
</script>

<style lang='scss' scoped>
	.container {
		.v-panel{
			margin-top: 18px;
		}
		.v-panel:nth-child(2){
			margin-top: 0;
		}
		/*width: 1615px;*/
		.selection {
			width: calc(100% - 25px);
		}
		.map {
			margin-bottom: 20px;
		}
		.charts {
			margin-bottom: 20px;
			margin-bottom: 20px;
		}
		.table {
		}
	}
</style>