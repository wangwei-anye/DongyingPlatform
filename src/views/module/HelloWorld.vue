<template>
	<div class="hello">
		<v-header></v-header>
		<v-sliderbar></v-sliderbar>
		<div class="componentsBox">
			<div class="title">zhanghshuwhui</div>
			<!-- Select 使用 -->
			<div style="width:160px; height:40px; margin: 0 auto;">
				<Select v-model="vselect" class="v-select">
					<Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
				</Select>
			</div>
			<div style="text-align: left; position:relative;">
				<v-search v-model="searchTxt" :hiddenClose="false" :closeHandler="searchClose" style="position:absolute;top:0;left:50px;width:300px;height:40px;"></v-search>
				<button>搜索</button>
			</div>
		</div>
		<div class="componentsBox">
			<div class="title">wangwei</div>
			<v-Label :tabArr=tabArr1></v-Label></br>
			<v-Label switchAble :tabArr=tabArr2 :activeIndex=2 @switchTabIndex='switchTabIndex'></v-Label></br>
			<v-Label switchAble :tabArr=tabArr3 styleType='lineStyle' :styleObj=labelStyleObj :activeStyleObj=labelActiveStyleObj @switchTabIndex='switchTabIndex'></v-Label>
		</div>
		<div class="componentsBox" style="width: 67%;">
			<div class="title">wangwei</div>
			<v-pagination :total=totalNum  @toPage='toPage'></v-pagination>
		</div>
		<div class="componentsBox">
			<div class="title">linqing</div>
			<!-- 林晴(start) -->
			<div class="linqing">
				<!-- Button组件使用规则(start) -->
				<v-Button @click='clickMe("不传任何值")'></v-Button>
				<v-Button :btnInfo='btnInfo1' @click='clickMe(btnInfo1)'></v-Button>
				<v-Button :btnInfo='btnInfo2' @click='clickMe(btnInfo2)'></v-Button>
				<v-Button :btnInfo='btnInfo3' @click='clickMe(btnInfo3)'></v-Button>
				<v-Button :btnInfo='btnInfo4' @click='clickMe(btnInfo4)'></v-Button>
				<v-Button :btnInfo='btnInfo5' @click='clickMe(btnInfo5)'></v-Button>
				<v-Button :btnInfo='btnInfo6' @click='clickMe(btnInfo6)'></v-Button>
				<v-Button :btnInfo='btnInfo7' @click='clickMe(btnInfo7)'></v-Button>
				<!-- Button组件使用规则(end) -->
			</div>
			<!-- 林晴(end) -->
		</div>
		<div class="componentsBox">
		<div class="title">林晴</div>
			<!-- 实时车流量(start) -->
				<v-chart-box boxType='orthogon' iconName='car' :w="258" :h="311" boxTitle="车场流量" style='margin: auto;'>
					<v-car-flow :carFlow='carFlow'></v-car-flow>
				</v-chart-box>
				<!-- 实时车流量(start) -->
		</div>
		<div class="componentsBox">
		<div class="title">林晴</div>
			<!-- 实时车流量(start) -->
				<v-chart-box boxType='orthogon' iconName='car' :w="484" :h="311" boxTitle="车场数据" style='margin: auto;'>
					<v-car-data :carData='carData'></v-car-data>
				</v-chart-box>
				<!-- 实时车流量(start) -->
		</div>
		<div class="componentsBox">
			<div class="title">wangwei</div>
			<v-chart-box boxType='orthogon' iconName='volume_of_flow' :w="484" :h="311" boxTitle="实时人流量&车流量">
				<v-chartPAndCFlow></v-chartPAndCFlow>
			</v-chart-box>
		</div>
		<div class="componentsBox">
			<div class="title">wangwei</div>
			<v-chart-box boxType='polygon' iconName='prevent' :w="484" :h="311" boxTitle="技防数据">
				<v-chartSkill></v-chartSkill>
			</v-chart-box>
		</div>
		<div class="componentsBox">
			<div class="title">wangwei</div>
			<v-chart-box boxType='polygon' iconName='special' :w="484" :h="311" boxTitle="特殊人员">
				<v-chartSecurityPlatform ></v-chartSecurityPlatform>
			</v-chart-box>
		</div>
		<div class="componentsBox">
			<div class="title">wangwei</div>
			<v-chart-box boxType='orthogon' iconName='alarm' :w="415" :h="311" boxTitle="今日告警">
				<v-alarmList></v-alarmlist>
			</v-chart-box>
		</div>
		<div class="componentsBox">
			<div class="title">liting</div>
			<v-chart-box boxType='polygon' iconName='special' :w="484" :h="311" boxTitle="人口数据矩形" style='float: left;color: #fff;'>
				<ul>
					<li>
						<dl>
							<dt>boxType 可选范围: </dt>
							<dd>polygon</dd>
							<dd>orthogon</dd>
						</dl>
					</li>
					<li>
						<dl>
							<dt>iconName 可选范围: </dt>
							<dd>village, house, people, ranking, volume_of_flow, prevent, patrol, special, alarm</dd>
							<dd>图标外观与名称可直接参考icons.png</dd>
						</dl>
					</li>
					<li>
						<dl>
							<dd>w: 整个盒子的宽</dd>
							<dd>h: 整个盒子的高</dd>
							<dd>boxTitle: 盒子标题</dd>
							<dd>hrefTo: 跳转到次级页面的链接地址</dd>
						</dl>
					</li>
				</ul>
			</v-chart-box>
		</div>
		<div class="componentsBox">
			<div class="title">liting</div>
			<v-chart-box boxType='orthogon' iconName='alarm' :w="484" :h="311" boxTitle="表格111" style='float: left;color: #fff;'>
				<dd>boxTitle: 盒子标题</dd>
			</v-chart-box>
		</div>
		<div class="componentsBox">
			<div class="title">李挺</div>
			<v-chart-box boxType='polygon' iconName='prevent' :w="258" :h="290" boxTitle="人防数据" style='float: left;color: #fff;'>
        <v-radar style="width: 100%; height: 100%;" :data="radarData" />
			</v-chart-box>
		</div>
	</div>
</template>

<script>
	import vPagination from '@/components/Pagination'
	import vLabel from '@/components/Label'
	import vButton from '@/components/Button'
	import vChartBox from '@/components/ChartBox'
	import vSearch from '@/components/SearchBox'
	import vChartBar from '@/components/chart/ChartBar'
	import vAlarmList from '@/views/alarm/AlarmList'
	import vCarFlow from '@/components/chart/CarFlow'
	import vCarData from '@/components/chart/CarData'
	import vHeader from '@/components/section/Header'
	import vSliderbar from '@/components/section/Sliderbar'
	import vRadar from '@/components/chart/Radar'
	import vChartPAndCFlow from '@/components/chart/ChartPAndCFlow'
	import vChartSecurityPlatform from '@/components/chart/ChartSecurityPlatform'
	import vChartSkill from '@/components/chart/ChartSkill'
	
	export default {
		name: 'HelloWorld',
		components: {
			vPagination,
			vLabel,
			vChartBox,
			vButton,
			vSearch,
			vChartBar,
			vAlarmList,
			vCarFlow,
			vCarData,
			vHeader,
      vRadar,
			vSliderbar,
			vChartPAndCFlow,
			vChartSecurityPlatform,
			vChartSkill
		},
		data() {
			return {
				totalNum:150,
				msg: 'Welcome to Your Vue.js App',
				/********* Label组件使用规则(start) *********/
				tabArr1: ['不', '可', '切', '换'],
				tabArr2: ['默', '认认', '样', '式'],
				tabArr3: ['综合', '刑事案件', '治安案件', '矛盾纠纷', '设备告警'],
				tabArr4: ['实时', '周', '月'],
				labelStyleObj: { //label样式     正常css 都可以写
					
				},
				labelActiveStyleObj: { //label点击样式     正常css 都可以写
					
				},
				/********* Button组件使用规则(start) *********/
				btnInfo1: {
					text: '确定', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
					styles: {
						width: '80px',
						height: '40px',
						border: '1px solid #17AEFC',
						borderRadius: '8px',
						color: '#fff',
						fontSize: '15px',
						fontWeight: 'normal',
						backgroundColor: '#17AEFC',
						hoverColor: '#17d2fc'
					}, // 此选项可有可无，无则接受type为'default'的样式
					type: 'default' // 此选项可有可无，默认为'default': 'primary', 'info', 'danger', 'warning', 'success', 'default'
				},
				// btnInfo2: {
				// 	text: 'GO'
				// },
				btnInfo2: {
					text: '不确定', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
					styles: {
						width: '120px',
						height: '40px',
						border: '1px solid #17AEFC',
						borderRadius: '20px',
						color: '#fff',
						fontSize: '15px',
						fontWeight: 'normal',
						backgroundColor: '#17AEFC',
						hoverColor: '#17d2fc'
					}, // 此选项可有可无，无则接受type为'default'的样式
					type: 'default' // 此选项可有可无，默认为'default': 'primary', 'info', 'danger', 'warning', 'success', 'default'
				},
				// btnInfo3: {
				// 	text: '确定',
				// 	type: 'primary'
				// },
				btnInfo3: {
					text: '不确定ddd', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
					styles: {
						width: '40px',
						height: '40px',
						border: '1px solid red',
						borderRadius: '20px',
						color: '#fff',
						fontSize: '12px',
						fontWeight: 'normal',
						backgroundColor: '#17AEFC',
						hoverColor: '#17d2fc'
					}, // 此选项可有可无，无则接受type为'default'的样式
					type: 'default' // 此选项可有可无，默认为'default': 'primary', 'info', 'danger', 'warning', 'success', 'default'
				},
				btnInfo4: {
					text: '确定',
					type: 'info'
				},
				btnInfo5: {
					text: '确定',
					type: 'danger'
				},
				btnInfo6: {
					text: '确定',
					type: 'warning'
				},
				btnInfo7: {
					text: '确定',
					type: 'success'
				},
				/********* Button组件使用规则(end) *********/
				/********* 车场流量(start) *********/
				carFlow: {
					in: 26350,
					out: 25896
				},
				/********* 车场流量(end) *********/
				/********* 车场数据(start) *********/
				carData: {
					// 依次为总车位、业主车位、临时车位、已使用车位、剩余车位、是否宽裕
					total: 1000,
					user: 800,
					tmp: 200,
					occupied: 301,
					rest: 699,
					hasMany: false,
					msg:'宽裕'
				},
				/********* 车场数据(end) *********/
				vselect: 'London',
				cityList: [{
						value: 'New York',
						label: 'New York'
					},
					{
						value: 'London',
						label: 'London'
					},
					{
						value: 'Sydney',
						label: 'Sydney'
					},
					{
						value: 'Ottawa',
						label: 'Ottawa'
					},
					{
						value: 'Paris',
						label: 'Paris'
					},
					{
						value: 'Canberra',
						label: 'Canberra'
					},
					{
						value: 'Canberra',
						label: 'Canberra'
					},
					{
						value: 'Canberra',
						label: 'Canberra'
					},
					{
						value: 'Canberra',
						label: 'Canberra'
					},
					{
						value: 'Canberra',
						label: 'Canberra'
					},
					{
						value: 'Canberra',
						label: 'Canberra'
					},
					{
						value: 'Canberra',
						label: 'Canberra'
					},
					{
						value: 'Canberra',
						label: 'Canberra'
					},
					{
						value: 'Canberra',
						label: 'Canberra'
					},
					{
						value: 'Canberra',
						label: 'Canberra'
					}
				],
        searchTxt: '',
        // 人防数据
        radarData: [
          {
            'name': '专职安保队伍',
            'value': 10 
          },
          {
            'name': '义务治安巡逻队伍',
            'value': 1 
          },
          {
            'name': '社区民警',
            'value': 3 
          }
        ] 
			}
		},
		methods: {
			toPage: function(currentPage) {
			},
			switchTabIndex: function(index) {
				console.log(index);
			},
			clickMe(info) {
				console.log(info)
			},
			clickMe3(info) {
				alert(info)
			},
			searchClose() {
				console.log(this.searchTxt)
			},
			getCarFlow () {
				setInterval(() => {
					this.carFlow.in += 1
					this.carFlow.out += 1
					this.carData.occupied += 1
					this.carData.rest -= 1
					this.carData.hasMany = this.carData.rest > 50 ? true : false
					this.carData.msg = this.carData.hasMany ? '宽裕' : '紧张'
				}, 5000)
			}
		},
		mounted () {
			this.getCarFlow()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h1,
	h2 {
		font-weight: normal;
	}
	
	ul {
		list-style-type: none;
		padding: 0;
	}
	
	li {
		display: inline-block;
		margin: 0 10px;
	}
	
	a {
		color: #42b983;
	}
	
	.linqing {
		width: 100%;
		height: 100px;
		margin: 30px 0;
	}
	.hello{
		background-color: #103672;
	}
	.componentsBox {
		float: left;
		width: 33%;
		border: 1px solid red;
		box-sizing: border-box;
		height: 400px;
		background-color: #103672;
	}
	.title{font-size: 22px;margin: 0 auto;}
</style>
