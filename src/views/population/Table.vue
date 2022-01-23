<template>
	<div class="tablePopulation">
		<div class="searchBar">
			姓名：<input type='text' class="name" @input="updateName($event.target.value)" /> 年龄：
			<input class="minAge" type="number" min="1" max="999" @input="updateMinAge($event.target.value)" />-<input type="number" min="1" max="999" class="maxAge" @input="updateMaxAge($event.target.value)" /> 性别：
			<Select class="v-select sex" @on-change='changeSex'>
				<Option value="">全部</Option>
				<Option value="男">男</Option>
				<Option value="女">女</Option>
			</Select>
			身份证：<input type='text' class="cardNum" @input="updateIdCode($event.target.value)"  maxlength="20"/> 手机号：
			<input type="number" min="1" maxlength="18" class="tel" @input="updateTelephone($event.target.value)" /> 人口类型：
			<Select class="v-select personType" @on-change='changeType'>
				<Option value="">全部</Option>
				<Option value="0">常住人口</Option>
				<Option value="1">流动人口</Option>
			</Select>
			<v-Button @click='getList()' :btnInfo="{text: '查询'}" class='v-btn'></v-Button>
			<img class="exportBtn" src="../../assets/image/population-export.png"  @click="exportClick"/>
			<a class="exportLink" style="display: none;"  href=""><span>ssss</span></a>
		</div>
		<i-table :data="list" class="border-table" :columns="tableColumns1"></i-table>
		<div class='pageBarBox'>
			<v-pagination :total=totalNum :pageIndex=pageIndex :pageSize=8 @toPage='changePage' class='pageBar'></v-pagination>
		</div>
		<v-alarmAlert class="alarmAlert" v-show="showAlert" :photoUrl=photoUrl @close='closeAlert'></v-alarmAlert>
	</div>
</template>
<script>
	import vPagination from '@/components/Pagination'
	import vSearchBox from '@/components/SearchBox'
	import vButton from '@/components/Button'
	import router from '@/router'
	import $ from 'jquery'
	import vAlarmAlert from '@/views/alarm/AlarmAlert'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('population')

	export default {
		name: 'populationTable',
		components: {
			vPagination,
			vSearchBox,
			vButton,
			vAlarmAlert
		},
		data() {
			return {
				showAlert: false, //是否弹出照片
				photoUrl: '', //照片地址
				tableColumns1: [{
						title: '图像',
						key: 'pic',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Img', {
									attrs: {
										src: params.row.user_image != "" ? params.row.user_image : require("../../assets/image/userpic.png")
									},
									style: {
										width: '60px',
										height: '60px',
									},
									on: {
										click: () => {
											if(params.row.user_image != ""){
												this.showPhoto(params.row.user_image);
											}
										}
									}
								}, 'View'),
							]);
						}
					},
					{
						title: '姓名',
						key: 'user_name',
						align: 'center',
						type: 'html',
					},
					{
						title: '性别',
						key: 'sex',
						width: 70
					},
					{
						title: '年龄',
						key: 'age',
						align: 'center',
						width: 70
					},
					{
						title: '身份证号码',
						key: 'id_code',
						align: 'center',
						width: 230
					},
					{
						title: '人口类型',
						key: 'population_type',
						align: 'center',
						width: 120
					},
					{
						title: '住址',
						key: 'address',
						align: 'center',
						type: 'html',
						width: 200
					},
					{
						title: '户籍',
						key: 'native_place',
						align: 'center',
						width: 200
					},
					{
						title: '电话',
						key: 'telephone',
						align: 'center',
						width: 150
					},
					{
						title: '小区',
						key: 'unit_name',
						align: 'center',
						width: 220
					},
					{
						title: '更多',
						key: 'more',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('span', {
									style: {
										width: '60px',
										height: '60px',
										cursor:'pointer'
									},
									on: {
										click: () => {
											this.toUserInfo(params.row.user_id,params.row.user_name,params.row.house_user_id);
										}
									}
								}, '...'),
							]);
						}
					}
				],
			}
		},
		computed: {
			...mapState([
				'list',
				'totalNum',
				'pageIndex'
			]),
			...mapGetters([
				'exportDataPath'
			])
		},
		methods: {
			showPhoto: function(url) {
				this.photoUrl = url;
				this.showAlert = true;
			},
			closeAlert: function() {
				this.showAlert = !this.showAlert;
			},
			exportClick: function() {
				$(".exportLink").attr('href',this.exportDataPath);
				$(".exportLink").children().trigger('click');
			},
			toUserInfo:function(userId,userName,houseUserId){
				var obj = {};
				obj.userId = userId;
				obj.userName = userName;
				obj.houseUserId = houseUserId.toString();
				this.updateUserId(obj);
				router.push({
					path:'/userInfo'
				})
			},
			changeSex: function(code) {
				this.updateSex(code);
			},
			changeType: function(code) {
				this.updatePopulationType(code);
			},
			...mapMutations([
				'updatePageIndex',
				'updateName',
				'updateMinAge',
				'updateMaxAge',
				'updateSex',
				'updateIdCode',
				'updateTelephone',
				'updatePopulationType'
			]),
			...mapActions([
				'getList',
				'updateUserId',
			]),
			changePage: function(currentPage) {
				this.updatePageIndex(currentPage);
				this.getList();
			}
		},
		mounted: function() {
//			this.getList();
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.tablePopulation {
		padding: 0 20px 60px;
		.searchBar {
			width: 1614px;
			height: 100px;
			color: #3fa7ff;
			font-size: 18px;
			display: flex;
			align-items: center;
			
			display: -ms-flexbox;
			-ms-flex-align: center;
				
			padding-left: 30px;
			.v-select {
				margin-right: 20px;
			}
			.v-btn {
				margin-left: 50px;
			}
			.exportBtn{
				margin-left: 35px;
				cursor: pointer;
			}
			input {
				background-color: #0E356C;
				border: 1px solid #1cb1ff;
				height: 38px;
				width: 20px;
				margin-right: 20px;
				color: white;
			}
			.name {
				width: 100px;
			}
			.minAge {
				width: 54px;
				margin-right: 4px;
			}
			.maxAge {
				width: 54px;
				margin-left: 4px;
			}
			.sex {
				width: 100px;
			}
			.cardNum {
				width: 225px;
			}
			.tel {
				width: 146px;
			}
			.personType {
				width: 140px;
			}
		}
		.pageBarBox {
			margin: 50px 0 0;
			text-align: center;
			.pageBar {}
		}
		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none !important;
			margin: 0;
		}
	}
</style>