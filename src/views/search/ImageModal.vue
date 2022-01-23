<template>
	<div class="alarmAlert">
		<img class="pic" :src=photoUrl @error="showDefault"/>
		<img class="border" src="../../assets/image/alarm-alert-border.png"></img>
		<i class="close" @click='close'></i>
	</div>
</template>

<script>
	import $ from 'jquery'
	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('search');

	export default {
		components: {},
		props: {
			photoUrl: {
				type: String,
				default: "",
				required: true
			}
		},
		name: 'searchImageModal',
		data() {
			return {
                defaultPersonPath: require('../../assets/image/search_person.png'),
                defaultCarPath: require('../../assets/image/search_car.png'),
                defaultPlacePath: require('../../assets/image/search_place.png')
			}
		},
		methods: {
			close: function() {
				this.$emit('close');
			},
            showDefault: function(event) {
			    //event.target.src = require('../../assets/image/search_default.png');
                let path = this.defaultPersonPath;
                console.log("dataType: " + this.dataType);
                switch (this.dataType){
                    case 1:
                        path = this.defaultPersonPath;
                        break;
                    case 2:
                        path = this.defaultCarPath;
                        break;
                    case 3:
                        path = this.defaultPlacePath;
                        break;
                    default:
                        path = this.defaultPersonPath;
                        break;
                }
                event.target.src = path;
            },
			...mapMutations([]),
			...mapActions([])
		},
		computed: {
			...mapGetters([

			]),
			...mapState([
			    'dataType'
			])
		},
		created: function () {
            //console.log("photoUrl: " + this.photoUrl);
        },
		mounted: function() {
		    //console.log("photoUrl: " + this.photoUrl);
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.alarmAlert {
		/*width: 1402px;*/
		/*height: 792px;*/
		width: 1102px;
		height: 692px;
		position: relative;
		background: url(../../assets/image/alarm-alert-bg.png) no-repeat;
		.border {
			width: 100%;
			height: 100%;
			display: block;
			z-index: 10;
			position: absolute;
			left: 0;
			top: 0;
		}
		.pic {
			width: 100%;
			height: 100%;
			display: block;
			z-index: 5;
			position: absolute;
			left: 0;
			top: 0;
		}
		.close {
			width: 40px;
			height: 40px;
			background: url(../../assets/image/alarm-alert-close.png) no-repeat;
			display: block;
			position: absolute;
			top: 0;
			right: -40px;
			cursor: pointer;
		}
	}
</style>