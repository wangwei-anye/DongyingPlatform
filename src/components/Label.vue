<template>
	<ul>
		<span v-for="(item,index) in tabArr" @click='tab($event)' :class="{active:index == activeIndex && switchAble != null,circleStyle:styleType=='circleStyle',lineStyle:styleType=='lineStyle'}" :style="tabStyleArr[index]">{{item}}</span>
	</ul>
</template>
<script>
	import $ from 'jquery'
	import Vue from 'vue'
	export default {
		props: {
			//能否切换
			switchAble: {
				type: String,
				default: null
			},
			activeIndex: {
				type: Number,
				default: 0
			},
			tabArr: {
				type: Array,
				default: function() {
					return [];
				}
			},
			styleType: {
				type: String,
				default: 'circleStyle'
			},
			styleObj: {
				type: Object,
				default: function() {
					return {};
				}
			},
			activeStyleObj: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		name: 'Label',
		data() {
			return {
				tabStyleArr: []
			}
		},
		methods: {
			tab: function(e) {
				var that = this;
				if(this.$props.switchAble != null) {
					this.tabStyleArr.forEach(function(val, index, arr) {
						Vue.set(arr, index, that.styleObj);
					});
					Vue.set(this.tabStyleArr, $(e.target).index(), that.activeStyleObj);
					$(e.target).addClass('active').siblings().removeClass('active');
					this.$emit('switchTabIndex', $(e.target).index());
				}
			}
		},
		mounted: function() {
			for(var i = 0; i < this.tabArr.length; i++) {
				this.tabStyleArr.push(this.styleObj);
			}
			this.tabStyleArr[this.activeIndex] = this.activeStyleObj;
		}
	}
</script>
<style lang="scss" scoped="scoped">
	ul {
		color: white;
		display: inline-block;
		.circleStyle {
			display: inline-block;
			background-color: #0C3673;
			border: 1px solid #009be3;
			color: #009be3;
			padding: 1px 20px;
			margin: 5px;
			border-radius: 10px;
			cursor: pointer;
			&.active {
				background-color: #009be3;
				color: white;
			}
		}
		.lineStyle {
			border: none;
			background-color: transparent;
			border-bottom: none;
			border-radius: 0;
			padding: 1px 10px;
			display: inline-block;
			width: 75px;
			margin: 0px;
			border-bottom: 2px solid rgba(14, 147, 210, 0.2);
			cursor: pointer;
			text-align: center;
			color: #009be3;
			&.active {
				border: none;
				border-bottom: 2px solid #ffda2e;
				background-color: transparent;
				color: #ffda2e;
				border-radius: 0;
				display: inline-block;
				width: 75px;
				margin: 0px;
				padding: 1px 10px;
			}
		}
	}
</style>