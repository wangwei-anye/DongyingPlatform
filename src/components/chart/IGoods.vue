<template>
	<div class="IGoods">
		<ul>
			<li>
				<label class="goods">物品</label>
				<label class="process">&nbsp;</label>
				<label class="count">数量</label>
			</li>
			<li v-for="item in iGoodFilterData">
        <label class="goods" :title="item.objectDefenceName">{{ item.objectDefenceName }}</label>
				<label class="process">
	        <div class="process-item">
            <div class="progressbar" :style="{width: (item.number > 100 ? '100%' : item.number + '%')}"></div>
	        </div>
				</label>
        <label class="count" :title="item.number">{{ filterNumber(item.number) }}</label>
			</li>
		</ul>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform')

export default {
  name: 'IGoods',
  computed: {
    ...mapGetters([
    'iGoodFilterData',
    'queryParam'
    ])
  },
  methods: {
	  filterNumber: function (num) {
		  let result = num || 0;
          let str = String(result);
		  if(Number(result) > 99999){
			  result = "99999+";
		  }
		  return result;
	  },
	  ...mapActions([
	      'getObjectDefence'
	  ])
  },
  watch: {
    queryParam() {
      this.getObjectDefence()
    }
  },
  mounted() {
    this.getObjectDefence()
  } 
}
</script>

<style lang="scss" scoped>
	ul {
		padding: 10px 15px;
		li {
			display: flex; color: #fff; font-size: 14px; font-weight: bold; padding-top: 15px; align-items: center;
			display: -ms-flexbox; -ms-flex-align: center;
			.goods {
        		display: inline-flex; width: 115px; justify-content: flex-end; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
				display: -ms-inline-flexbox;
			}
			.process {
				display: inline-flex; flex: 1; padding: 0 15px; align-items: center;
				display: -ms-inline-flexbox; -ms-flex: 1;
			  .process-item {
			    width: 100%; height: 8px; background: #194775; border-radius: 2px;
			    .progressbar {
			      height: 8px; background: linear-gradient(90deg, #956901, #fff951); border-radius: 4px;
			    }
			  }
			}
			.count {
				display: inline-flex; width: 60px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
				display: -ms-inline-flexbox;
			}			
			&:first-child {
				color: #1cb1ff; border-bottom: 1px solid rgba(28, 177, 255, .5);
				padding-bottom: 3px; padding-top: 0; margin-bottom: 3px;
			}
		}
	}
</style>
