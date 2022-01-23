<template>
	<div class="houseMap">
		<div class="map">
			<iframe class="mapIframe" width="100%" height="100%" marginheight="0" marginwidth="0" style="border:none; overflow:hidden">
			</iframe>
		</div>
	</div>
</template>

<script>
    import $ from 'jquery'
    import { createNamespacedHelpers } from 'vuex'

    const {
        mapState,
        mapMutations,
        mapActions
    } = createNamespacedHelpers('special');

    export default {
        name: 'dataMap',
        props: {},
        data() {
            return {
                panelStyle: {
                    'width': this.w + 'px'
                },
            }
        },
        computed: {
            ...mapState([
                'mapCodeStr'
            ])
        },
        methods: {
            ...mapMutations([]),
            ...mapActions([
				'initMap'
            ])
        },
        mounted: function() {
            // console.log("map mounted", this.mapCodeStr);
            this.initMap();
            $(".mapIframe").attr('src', "static/map/teshupeoplemap.html?" + this.mapCodeStr);
        },
        watch: {
            'mapCodeStr': function(curVal, oldVal) {
                // console.log("map mounted", curVal);
                $(".mapIframe").attr('src', "static/map/teshupeoplemap.html?" + curVal);
            },
        }
    }

</script>

<style lang="scss" scoped="scoped">
	.houseMap {
		background-size: 100% 100%;
		width: 100%;
		height:815px;
		.map {
			// pointer-events: none;
			width: 70%;
			height: 772px;
			box-sizing: border-box;
			margin-left: 15%;
			margin-right: 15%;
		}
		.chartBox {
			width: 807px;
			height: 772px;
			float: left;
			box-sizing: border-box;
		}
	}
</style>