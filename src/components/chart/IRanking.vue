<template>
	<div class="IRanking">
		<ul>
			<li>
				<label class="name">小区名称</label>
				<label class="level">安全级数</label>
				<label class="ranking">安全指数</label>
			</li>
			<li v-for="unit in safetyExponentFilter">
        <label class="name" :title="unit.unitName">{{ unit.unitName }}</label>
				<label class="process">
	        <div class="process-item">
	          <div class="rank-dark"></div>
            <div class="rank-light" :style="{width: unit.percent}"></div>
	        </div>
				</label>
        <label class="ranking">{{ unit.compositeIndex.toFixed(2) }}</label>
			</li>
		</ul>
	</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('platform')

export default {
  name: 'IRanking',
  computed: {
    ...mapGetters([
      'queryParam',
      'safetyExponentFilter'
    ])
  },
  methods: {
    ...mapActions([
      'getSafetyExponent'
    ])
  },
  watch: {
    queryParam() {
      this.getSafetyExponent()
    }
  },
  mounted() {
    this.getSafetyExponent()
  } 
}
</script>

<style lang="scss" scoped>
	ul {
		padding: 12px 15px;
		li {
			display: flex; color: #fff; font-size: 16px; font-weight: bold; padding-top: 12px;
			display: -ms-flexbox; -ms-flex-align: stretch;
			.name {
        		display: inline-block; width: 64px; white-space: nowrap; text-overflow: clip; overflow: hidden;
			}
			.level {
        		display: inline-flex; flex: 1; justify-content: center;
				display: -ms-inline-flexbox; -ms-flex-pack: center; -ms-flex: 1;
			}
			.process {
				display: inline-flex; flex: 1; padding: 0 15px; align-items: center; justify-content: center;
				display: -ms-inline-flexbox; -ms-flex-align: center; -ms-flex-pack: center; -ms-flex: 1;
			  .process-item {
			    position: relative; width: 190px; height: 15px;
			    .rank-dark {
			      position: absolute; width: 100%; height: 15px;
			      background-image: url('../../assets/image/rankDark.png');
			    }
			    .rank-light {
			      position: absolute; height: 15px;
			      background-image: url('../../assets/image/rankLight.png');
			    }
			  }
			}
			.ranking {
				display: inline-flex; width: 72px; justify-content: flex-start; color: #53b4ff;
				display: -ms-inline-flexbox; -ms-flex-pack: start;
			}			
			&:first-child {
				 color: #1cb1ff; padding-top: 0; padding-bottom: 5px; border-bottom: 1px solid rgba(28, 177, 255, .5);
			}
		}
	}
</style>
