<template>
	<div class="houseList">
		<div class="selectList">
			小区：
			<Select  class="v-select" @on-change='changeUnitId' :value="unitId" :label="unitName">
				<Option v-for="item in unitIdList" :value="item.unit_id" :key="item.unit_id">{{ item.name }}</Option>
			</Select>
			楼栋单元：
			<Select  class="v-select" @on-change='changeBuildingId' label-in-value>
				<Option v-for="item in buildingList" :value="item.building_code" :key="item.building_code">{{ item.building_name }}</Option>
			</Select>
		</div>
		<div class="label-list">
			<div class="item">
				<div class="colorBlock">&nbsp;{{roomTypeNum['自住']}}套</div>自住
			</div>
			<div class="item">
				<div class="colorBlock">&nbsp;{{roomTypeNum['出租']}}套</div>出租
			</div>
			<div class="item">
				<div class="colorBlock">&nbsp;{{roomTypeNum['商用']}}套</div>商用
			</div>
			<div class="item">
				<div class="colorBlock">&nbsp;{{roomTypeNum['空置']}}套</div>空置
			</div>
			<div class="item">
				<div class="colorBlock">&nbsp;{{roomTypeNum['其他']}}套</div>其他
			</div>
		</div>
		<div class="house">
			<img src="../../assets/image/house_title.png" />
			<div class="title">
				<span v-for="item in buildingIdStrArr">{{item}}</span>
			</div>
			<ul class="list">
				<template v-for="subArr in roomListData">
					<li class="dataLi">
						<div class="item" v-for="item in subArr.arr" @mouseenter="showTips($event,item.roomCode)" @mouseleave="hideTips($event)" @click="showDetail(item.roomCode)">
							<i :class="{type2:item.type=='自住',type1:item.type=='商用',type3:item.type=='出租',type4:item.type=='其他',type5:item.type=='空置'}"></i>
							<div>{{item.code}}</div>
						</div>
					</li>
				</template>
				<div class="bottom"></div>
				<v-tips class="tips" :info=roomDetail></v-tips>
			</ul>
		</div>
		<div  v-show="infoShow" class="shadow"></div>
		<v-info v-show="infoShow" @close="closeInfo" style="z-index:1000"></v-info>
		<v-alert-window ref='alertWindow'></v-alert-window>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vTips from './Tips'
	import vInfo from './Info'
	import vAlertWindow from '@/components/AlertWindow'
	import {UIWidth,UIHeight} from '@/utils/viewport'
	import {threshold} from '@/router'
	
	import { createNamespacedHelpers } from 'vuex'
	const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('house')

	
	export default {
		name: 'HouseList',
		props: {},
		components: {
			vTips,
			vInfo,
			vAlertWindow
		},
		data() {
			return {
				infoShow:false,
				panelStyle: {
					'width': this.w + 'px'
				}
			}
		},
		computed: {
			...mapGetters([
				'roomListData',
				'roomTypeNum'
			]),
			...mapState([
				'unitId',
				'unitName',
				'buildingList',
				'roomDetail',
				'unitIdList',
				'buildingName',
				'userInfo',
				'errorMsg'
			]),
			buildingIdStrArr : function(){
				if(!this.buildingName){
					return [];
				}
				var arr = [];
				for(var i = 0; i < this.buildingName.length;i++){
					arr.push(this.buildingName.charAt(i));
				}
				return arr;
			}
		},
		methods: {
			changeUnitId:function(code){
				this.updateUnitId(code);
				if(code != ''){
					this.getBuilding();
				}
			},
			changeBuildingId:function(code){
				this.updateBuildingId(code.value);
				this.updateBuildingName(code.label);
				if(code.value != ''){
					this.getRoomList();
				}
			},
			showDetail: function(roomCode){
				this.getRoomMember(roomCode);
			},
			closeInfo: function(){
				this.infoShow = false;
			},
			switchTabIndex: function() {

			},
			showTips: function(e,roomCode) {
				this.getRoomDetail(roomCode);
                var UIRatio = UIWidth / UIHeight;
				var view = this.getScaleRate();
				var ratio = view.w / view.h;
				var wRatio = view.w / UIWidth,
                        hRatio = view.h / UIHeight;
                 
				var left;;
				var top;
				if(Math.abs(ratio - UIRatio) > threshold){
					if(ratio > UIRatio){
						left = ($(e.target).position().left) / hRatio - 120;
						top = ($(e.target).parent().position().top) / hRatio  - 205;
					}else{
						left = ($(e.target).position().left) / wRatio - 120;
						top = ($(e.target).parent().position().top) / wRatio  - 205;
					}
				}else{
					left = ($(e.target).position().left) / wRatio - 120;
					top = ($(e.target).parent().position().top) / hRatio  - 205;
				}

				$(e.target).parent().parent().find('.tips').css('display', 'block')

				$(e.target).parent().parent().find('.tips').css('display', "block");
				$(e.target).parent().parent().find('.tips').css('left', left + "px");
				$(e.target).parent().parent().find('.tips').css('top', top + "px");
			},
			hideTips: function(e) {
				$(e.target).parent().parent().find('.tips').css('display', 'none')
			},
			getScaleRate: function() {
				var w = w || window;
				if(w.innnerWidth !== null) return {
					w: w.innerWidth,
					h: w.innerHeight
				};
				var d = w.document;
				if(document.compatMode == "CSS1Compat") {
					return {
						w: d.documentElement.clientWidth,
						h: d.documentElement.clientHeight
					};
				}
				return {
					w: d.body.clientWidth,
					h: d.body.clientHeight
				};
			},
			...mapMutations([
				'updateUnitId',
				'updateBuildingId',
				'updateBuildingName'
			]),
			...mapActions([
				'getRoomList',
				'getBuilding',
				'getRoomDetail',
				'getHosueUnitList',
				'getRoomList',
				'getRoomMember'
			])
		},
		mounted: function() {
//			this.getHosueUnitList();
		},
		watch:{
			'userInfo':function(culVal,oldVal){
				if(culVal != null){
					this.infoShow = true;
				}
			},
			'errorMsg':function(culVal,oldVal){
				if(culVal != null && culVal != ''){
					this.$refs.alertWindow.show(culVal);
				}
			}
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.houseList {
		position: relative;
		padding: 40px 0;
		color: white;
		width: 100%;
		.shadow{
			z-index: 999;
			background-color: rgba(0,0,0,0.3);width: 100%;height: calc(100% - 90px);
			position: fixed;left: 0;bottom: 0;
		}
		.selectList {
			display: inline-block;
			margin-left: 30px;
			.v-select {
				width: 165px;
				height: 38px;
			}
			.v-select:nth-child(1) {
				margin-right: 20px;
			}
		}
		.label-list {
			margin-right: 30px;
			float: right;
			display: inline-block;
			.item {
				width: 100px;
				display: inline-block;
				.colorBlock {
					display: inline-block;
					padding:0 10px;
					height: 20px;
					background-color: red;
					margin-right: 8px;
					text-align: center;
					line-height: 20px;
					color: #0c285c;
				}
				&:nth-child(1) {
					.colorBlock {
						background-color: #0084D7;
					}
				}
				&:nth-child(2) {
					.colorBlock {
						background-color: #FFDA2F;
					}
				}
				&:nth-child(3) {
					.colorBlock {
						background-color: #FF6100;
					}
				}
				&:nth-child(4) {
					.colorBlock {
						background-color: #6B58FF;
					}
				}
				&:nth-child(5) {
					.colorBlock {
						background-color: #00BC5D;
					}
				}
			}
		}
		.house {
			width: 1478px;
			margin: 40px auto 0;
			position: relative;
			.title {
				top: 70px;
				left: 50%;
				transform: translateX(-50%);
				position: absolute;
				display: inline-block;
				span {
					width: 48px;
					height: 48px;
					display: inline-flex;
					align-items: center;
					justify-content: center;
					
					display: -ms-inline-flexbox;
				    -ms-flex-pack: justify;
				    -ms-flex-align: center;
				
				
					font-size: 20px;
					border: 1px solid #405d90;
					background-color: #2D5DB8;
					margin: 0 10px;
				}
			}
			.list {
				background-color: #0f2d62;
				border: 1px solid #446c8c;
				margin: 0 auto;
				width: 1385px;
				position: relative;
				.tips {
					pointer-events: none;
					position: absolute;
					display: none;
					left: 0;
					top: 0;
				}
				&:after {
					content: '.';
					visibility: hidden;
					display: block;
					height: 0;
					clear: both;
				}
				.dataLi {
					overflow-x: scroll;
					overflow-Y: hidden;
					height: 150px;
					white-space: nowrap;
					.item {
						cursor: pointer;
						display: inline-block;
						box-sizing: border-box;
						width: 125px;
						height: 80px;
						margin-top: 30px;
						text-align: center;
						i {
							width: 56px;
							height: 56px;
							display: inline-block;
						}
						.type1 {
							background: url(../../assets/image/house_type_1.png) no-repeat;
							background-size: contain;
						}
						.type2 {
							background: url(../../assets/image/house_type_2.png) no-repeat;
							background-size: contain;
						}
						.type3 {
							background: url(../../assets/image/house_type_3.png) no-repeat;
							background-size: contain;
						}
						.type4 {
							background: url(../../assets/image/house_type_4.png) no-repeat;
							background-size: contain;
						}
						.type5 {
							background: url(../../assets/image/house_type_5.png) no-repeat;
							background-size: contain;
						}
						div {
							margin-top: 4px;
							font-size: 15px;
							text-align: center;
						}
					}
				}
				.bottom {
					height: 55px;
				}
			}
		}
	}
	
	::-webkit-scrollbar {
		width: 14px;
		height: 16px;
		background-color: #0E2F62;
	}
	/*定义滚动条轨道 内阴影+圆角*/
	
	::-webkit-scrollbar-track {
		border: 1px solid #125f9d;
		background-color: #0E2F62;
	}
	/*定义滑块 内阴影+圆角*/
	
	::-webkit-scrollbar-thumb {
		background-color: #2C559F;
	}
</style>