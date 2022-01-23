<template>
	<div class="info">
		<div class="title">{{userInfo?userInfo.basename:''}}</div>
		<i class="close" @click="close"></i>
		<i class="left" @click="prev" v-show="index != 0"></i>
		<i class="right" @click="next" v-show="index != (userInfo?userInfo.userList.length - 1:0)"></i>
		<div class="infoBox">
			<div class="head">
				<img :src="selectData.user_image?selectData.user_image:''" />
			</div>
			<div class="userInfo">
				<div class="main"><span class="name">{{selectData.name}}</span>({{selectData.type}})
					<!--<span class="badInfo"><i class="star"></i>罪犯前科</span>--></div>
				<div class="item"><i class="sex"></i><span class="txt"></span>{{selectData.sex}}</div>
				<div class="item"><i class="peopleType"></i><span class="txt"></span>{{selectData.peopleType}}</div>
				<div class="item"><i class="birthDay"></i><span class="txt"></span>{{selectData.birth}}</div>
				<div class="item"><i class="idCard"></i><span class="txt"></span>{{selectData.id_code}}</div>
				<div class="item"><i class="marry"></i><span class="txt"></span>{{selectData.marital_status}}</div>
				<div class="item"><i class="gcd"></i><span class="txt"></span>{{selectData.politics_status}}</div>
				<div class="item"><i class="school"></i><span class="txt"></span>{{selectData.education}}</div>
				<div class="item"><i class="tel"></i><span class="txt"></span>{{selectData.telephone}}</div>
				<div class="item"><i class="fromAddress"></i><span class="txt"></span>{{selectData.native_place}}</div>
				<div class="item"><i class="birthAddress"></i><span class="txt"></span>{{selectData.birth_place}}</div>
				<div class="item"><i class="nowAddress"></i><span class="txt"></span>{{selectData.address}}</div>
				<div class="item"><i class="company"></i><span class="txt"></span>{{selectData.work_unit}}</div>
				<div class="item"><i class="word"></i><span class="txt"></span>{{selectData.career}}</div>
			</div>
			<div class="more" @click="toUserInfo(selectData.user_id)">更多<i></i></div>
		</div>
		<v-force :data=forceData></v-force>
	</div>
</template>
<script>
	import $ from 'jquery'
	import router from '@/router'
	import vForce from '@/components/chart/Force'
	import { createNamespacedHelpers } from 'vuex'
	const {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('house')

	export default {
		name: 'Info',
		components: {
			vForce
		},
		props: {},
		data() {
			return {
				index: 0
			}
		},
		computed: {
			selectData: function() {
				if(this.userInfo && this.userInfo.userList.length > 0) {
					return this.userInfo.userList[this.index];
				}
				return [];
			},
			forceData: function() {
				var obj = {
					nodes: [],
					edges: []
				};
				if(this.userInfo == null) {
					return obj;
				}
				obj.nodes.push({
					"id": 'main',
					"name": this.userInfo.basename,
					"label": this.userInfo.basename,
				});
				for(var i = 0; i < this.userInfo.rlist.length; i++) {
					if(this.userInfo.rlist[i].user_image && this.userInfo.rlist[i].user_image != '') {
						obj.nodes.push({
							"id": 'node_' + i,
							"name": this.userInfo.rlist[i].name,
							"symbol": "image://" + this.userInfo.rlist[i].user_image,
							"label": this.userInfo.rlist[i].name,
						});
					} else {
						obj.nodes.push({
							"id": 'node_' + i,
							"name": this.userInfo.rlist[i].name,
							"label": this.userInfo.rlist[i].name,
						});
					}

					obj.edges.push({
						"source": 'main',
						"target": 'node_' + i,
						"name": this.userInfo.rlist[i].typeName
					});
				}
				return obj;
			},
			...mapState([
				'userInfo'
			]),
		},
		methods: {
			close: function() {
				this.$emit('close');
			},
			prev: function() {
				if(this.index > 0) {
					this.index--;
				}
			},
			next: function() {
				if(this.userInfo) {
					if(this.index < this.userInfo.userList.length - 1) {
						this.index++;
					}
				}
			},
			toUserInfo : function(userId){
				this.updateUserId(userId);
				router.push({
					path:'/userInfo'
				})
			},
			...mapActions([
				'updateUserId',
			])
		},
		mounted: function() {
			this.index = 0;
		},
		watch:{
			'userInfo':function(newVal,oldVal){
				this.index = 0;
			}
		}

	}
</script>
<style lang="scss" scoped="scoped">
	.info {
		position: fixed;
		top: 50%;
		left: 50%;
		margin-top: -400px;
		margin-left: -700px;
		width: 1537px;
		height: 891px;
		color: white;
		padding: 51px 57px;
		font-size: 18px;
		background: url(../../assets/image/house_info_bg.png) no-repeat;
		.title {
			margin: 0 auto;
			text-align: center;
			width: 1280px;
			height: 74px;
			line-height: 74px;
			font-size: 30px;
			font-weight: bold;
		}
		.close {
			cursor: pointer;
			position: absolute;
			top: 70px;
			right: 70px;
			width: 20px;
			height: 20px;
			display: block;
			background: url(../../assets/image/house-info-close.png) no-repeat;
		}
		.left {
			position: absolute;
			top: 250px;
			left: 80px;
			width: 20px;
			height: 40px;
			display: block;
			background: url(../../assets/image/house-info-arrow.png) no-repeat;
			cursor: pointer;
		}
		.right {
			position: absolute;
			top: 238px;
			right: 80px;
			width: 20px;
			height: 40px;
			display: block;
			transform-origin: center;
			transform: rotate(180deg);
			background: url(../../assets/image/house-info-arrow.png) no-repeat;
			cursor: pointer;
		}
		.infoBox {
			position: relative;
			border-bottom: 1px solid #8cb6ff;
			border-top: 1px solid #8cb6ff;
			padding: 30px 0;
			margin: 0 80px;
			&:after {
				display: block;
				clear: both;
				height: 0px;
				content: '.';
				visibility: hidden;
			}
			.head {
				float: left;
				box-sizing: border-box;
				width: 230px;
				height: 256px;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.more {
				cursor: pointer;
				color: #ffda2e;
				position: absolute;
				bottom: 10px;
				right: 0;
				i {
					background: url(../../assets/image/house-info-more.png) no-repeat;
					display: inline-block;
					width: 20px;
					height: 20px;
					position: relative;
					top: 3px;
				}
			}
			.userInfo {
				float: left;
				box-sizing: border-box;
				width: 1022px;
				height: 256px;
				font-size: 24px;
				padding: 0 20px;
				.main {
					.name {
						font-size: 36px;
						font-weight: bold;
					}
					.badInfo {
						margin-left: 40px;
						font-size: 24px;
						font-weight: bold;
						color: #ff502e;
						.star {
							width: 35px;
							height: 32px;
							display: inline-block;
							background: url(../../assets/image/house-icon.png) no-repeat;
							vertical-align: middle;
							background-position: -29px -150px;
						}
					}
				}
				.item {
					margin-top: 13px;
					float: left;
					min-width: 200px;
					max-width: 400px;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow-x: hidden;
					i {
						width: 35px;
						height: 32px;
						display: inline-block;
						background: url(../../assets/image/house-icon.png) no-repeat;
						vertical-align: middle;
					}
					.sex {
						background-position: -29px -32px;
					}
					.peopleType {
						background-position: -88px -32px;
					}
					.birthDay {
						background-position: -147px -32px;
					}
					.idCard {
						background-position: -206px -32px;
					}
					.marry {
						background-position: -265px -32px;
					}
					.gcd {
						background-position: -29px -91px;
					}
					.school {
						background-position: -88px -91px;
					}
					.tel {
						background-position: -147px -91px;
					}
					.fromAddress {
						background-position: -206px -91px;
					}
					.birthAddress {
						background-position: -265px -91px;
					}
					.nowAddress {
						background-position: -206px -150px;
					}
					.company {
						background-position: -147px -150px;
					}
					.word {
						background-position: -88px -150px;
					}
					.txt {
						margin-left: 8px;
						vertical-align: middle;
					}
				}
			}
		}
	}
</style>