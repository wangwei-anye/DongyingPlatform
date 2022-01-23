<template>
	<div class="pageBar">
		<span class="pageDes noselect">共{{totalPage}}页、{{total>0?total:0}}条记录</span>
		<span class="pageBtn noselect" @click="prevPage()"><i class="arrow-left"></i>上一页</span>
		<span class="pageNum noselect" :class="{active:currentPage == item}" v-for="item in pageArr" @click="toPage(item)">{{item}}</span>
		<span class="pageBtn noselect" @click="nextPage()">下一页<i class="arrow-right"></i></span>
	</div>
</template>

<script>
	import $ from 'jquery'
	export default {
		name: 'Pagination',
		props: {
			pageSize: {
				type: Number,
				default: 10
			},
			total: {
				type: Number,
				default: 10
			},
			pageIndex: {
				type: Number,
				default: 1
			}
		},
		data() {
			return {
				totalPage: 0,
				currentPage: 1,
				pageShowNum: 10
			}
		},
		methods: {
			toPageOnly: function() {//监听页码的变化
				this.currentPage = this.pageIndex;
			},
			toPage: function(index) {
				this.currentPage = index;
				this.$emit('toPage', this.currentPage);
			},
			prevPage: function() {
				if(this.currentPage > 1) {
					this.currentPage--;
					this.$emit('toPage', this.currentPage);
				}
			},
			nextPage: function() {
				if(this.currentPage < this.totalPage) {
					this.currentPage++;
					this.$emit('toPage', this.currentPage);
				}
			}
		},
		computed: {
			pageArr: function() {
				var totalNum = this.total;
				if(totalNum < 0){
					totalNum = 0;
				}
				var pageArr = [];
				this.totalPage = (parseInt((totalNum - 1) / this.pageSize) + 1);
				var startPage = Math.max(this.currentPage - 5, 1);
				var addNum = Math.max(9 - (this.currentPage - startPage), 4);
				var endPage = Math.min(this.totalPage, this.currentPage + addNum);
				var subNum = Math.max(9 - (this.totalPage - this.currentPage), 5);
				startPage = Math.max(1, this.currentPage - subNum);
				for(var i = startPage; i <= endPage; i++) {
					pageArr.push(i);
				}
				if(this.currentPage < startPage) {
					this.currentPage = startPage;
				}
				if(this.currentPage > endPage) {
					this.currentPage = endPage;
				}
				return pageArr;
			}
	    },
	    watch: {
    		'pageIndex': 'toPageOnly'
	    },
		mounted: function() {
			this.currentPage = this.pageIndex;
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.pageBar {
		display: inline-block;
		.arrow-left {
			width: 22px;
			height: 16px;
			display: inline-block;
			background: url(../assets/image/pagination-arrow.png) no-repeat;
			transform: rotate(180deg);
		}
		.arrow-right {
			width: 22px;
			height: 16px;
			display: inline-block;
			background: url(../assets/image/pagination-arrow.png) no-repeat;
			position: relative;
			top: 3px;
			left: 2px;
		}
		.pageDes {
			margin-right: 20px;
		}
		font-size: 18px;
		color: #1cb1ff;
		.pageNum {
			cursor: pointer;
			margin: 0 7px;
			padding: 0 3px;
			display: inline-block;
			border: 1px solid #1cb1ff;
			text-align: center;
			min-width: 27px;
			height: 27px;
		}
		.pageNum.active {
			border: none;
			color: white;
			cursor: default;
			pointer-events: none;
		}
		.pageBtn {
			cursor: pointer;
		}
	}
	
	.noselect {
		-webkit-touch-callout: none;
		/* iOS Safari */
		-webkit-user-select: none;
		/* Chrome/Safari/Opera */
		-khtml-user-select: none;
		/* Konqueror */
		-moz-user-select: none;
		/* Firefox */
		-ms-user-select: none;
		/* Internet Explorer/Edge */
		user-select: none;
		/* Non-prefixed version, currently
not supported by any browser */
	}
</style>