<template>
	<div class="alarmMapTimeLine">
		<div class="selectBox">
			<Select class="v-select" @on-change='changeTypeOne' label-in-value :value="selectOne" :label="selectOneName">
				<Option v-for="item in alarmTypeListOne" :value="item.code" :key="item.code">{{ item.name }}</Option>
			</Select>
			<div class="txt">对比</div>
			<Select class="v-select" @on-change='changeTypeTwo' label-in-value :value="selectTwo" :label="selectTwoName">
				<Option v-for="item in alarmTypeListTwo" :value="item.code" :key="item.code">{{ item.name }}</Option>
			</Select>
		</div>
		<div class='title'>
			<img src="../../assets/image/securityCount-logo.png" />
			<div class="name">警情变化趋势</div>
		</div>
		<div class="content">
			<div class="chartBox">
				<v-chartBar :dataArr=chartBarDataArr class='chartbar'></v-chartBar>
			</div>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'
	import vPerson from '@/views/population/Person'
	import vChartBar from '@/components/chart/ChartBar'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('alarm')

	export default {
		name: 'AlarmMapTimeLine',
		props: {},
		components: {
			vPerson,
			vChartBar
		},
		data() {
			return {
				selectOne: 'all',
				selectTwo: 'no',
				selectOneName: '全部告警',
				selectTwoName: '请选择',
				alarmTypeList: [],
				alarmTypeListOne: [],
				alarmTypeListTwo: [],
				panelStyle: {
					'width': this.w + 'px'
				},
			}
		},
		computed: {
			chartBarDataArr: function() {
				var xArr = [];
				var yArrOne = [];
				var yArrTwo = [];
				for(var i = 0; i < this.alarmChange.length; i++) {
					xArr.push(this.alarmChange[i].time);
					if(this.alarmChange[i][this.selectOne] != undefined) {
						yArrOne.push(this.alarmChange[i][this.selectOne]);
					} else {
						yArrOne.push(0);
					}
					if(this.alarmChange[i][this.selectTwo] != undefined) {
						yArrTwo.push(this.alarmChange[i][this.selectTwo]);
					} else {
						yArrTwo.push(0);
					}
				}

				var axisLabelInterval = 0;
				if(xArr.length <= 8) {
					axisLabelInterval = 0;
				} else if(xArr.length <= 16) {
					axisLabelInterval = 1;
				} else {
					axisLabelInterval = 2;
				}

				var obj = {
					xDataArr: xArr,
					gridBottom: 40,
					axisLabelLen: 12,
					axisLabelInterval: axisLabelInterval,
					legendArr: [this.selectOneName], //需要提示的标签
					yDataArr: [{
						name: this.selectOneName,
						type: 'line',
						yAxisIndex: 0, //这个数据对应的 坐标  0为左边  1为右边
						data: yArrOne,
						symbol: 'none', //节点形状
						symbolColor: '#00C0FF', //线条颜色
						areaStyle: [{
							offset: 0,
							color: '#00C0FF'
						}, {
							offset: 1,
							color: '#ffffff'
						}] //渐变色
					}],
					yAxis: [{
						name: '数量',
						formatter: '{value}',
						splitLine: true
					}]
				}

				if(this.selectTwo != 'no') {
					obj.legendArr.push(this.selectTwoName);
					obj.yDataArr.push({
						name: this.selectTwoName,
						type: 'line',
						yAxisIndex: 0,
						symbol: 'none',
						symbolColor: '#fec14f', //线条颜色
						data: yArrTwo,
						labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
						areaStyle: [{
							offset: 0,
							color: '#fec14f'
						}, {
							offset: 1,
							color: '#ffffff'
						}] //渐变色
					});
				} else {
					obj.yDataArr.push({
						name: this.selectTwoName,
						type: 'line',
						yAxisIndex: 0,
						symbol: 'none',
						symbolColor: '#fec14f', //线条颜色
						data: [],
						labelPositon: '', //柱条文字 位置  '' 则没有  比如 top inside
						areaStyle: [{
							offset: 0,
							color: '#fec14f'
						}, {
							offset: 1,
							color: '#ffffff'
						}] //渐变色
					});
				}

				return obj;
			},
			...mapState([
				'alarmChange',
				'eventTypeObj'
			]),
			...mapGetters([])
		},
		methods: {
			changeTypeOne: function(val) {
				var code = val.value;
				var label = val.label;
				this.selectOne = code;
				this.selectOneName = label;
				this.alarmTypeListTwo = [{
					code: 'no',
					name: "请选择"
				}];
				for(var i = 0; i < this.alarmTypeList.length; i++) {
					if(this.alarmTypeList[i].code != code) {
						this.alarmTypeListTwo.push(this.alarmTypeList[i]);
					}
				}
			},
			changeTypeTwo: function(val) {
				var code = val.value;
				var label = val.label;
				this.selectTwo = code;
				this.selectTwoName = label;
				this.alarmTypeListOne = [];
				for(var i = 0; i < this.alarmTypeList.length; i++) {
					if(this.alarmTypeList[i].code != code) {
						this.alarmTypeListOne.push(this.alarmTypeList[i]);
					}
				}
			},
			...mapMutations([]),
			...mapActions([])
		},
		mounted: function() {
			this.alarmTypeList = [];
			this.alarmTypeListOne = [];
			this.alarmTypeListTwo = [];

			this.alarmTypeList.push({
				code: 'all',
				name: "全部告警"
			});
			this.alarmTypeListOne.push({
				code: 'all',
				name: "全部告警"
			});
			this.alarmTypeListTwo.push({
				code: 'no',
				name: "请选择"
			});
			for(var e in this.eventTypeObj) {
				this.alarmTypeList.push({
					code: e,
					name: this.eventTypeObj[e]
				});
				this.alarmTypeListOne.push({
					code: e,
					name: this.eventTypeObj[e]
				});
				this.alarmTypeListTwo.push({
					code: e,
					name: this.eventTypeObj[e]
				});
			}
		},
		watch: {
			'eventTypeObj': function(curVal, oldVal) {
				this.alarmTypeList = [];
				this.alarmTypeListOne = [];
				this.alarmTypeListTwo = [];
				this.alarmTypeList.push({
					code: 'all',
					name: "全部告警"
				});
				this.alarmTypeListOne.push({
					code: 'all',
					name: "全部告警"
				});
				this.alarmTypeListTwo.push({
					code: 'no',
					name: "请选择"
				});
				for(var e in curVal) {
					this.alarmTypeList.push({
						code: e,
						name: curVal[e]
					});
					this.alarmTypeListOne.push({
						code: e,
						name: curVal[e]
					});
					this.alarmTypeListTwo.push({
						code: e,
						name: curVal[e]
					});
				}
			},
		}
	}
</script>
<style lang="scss" scoped="scoped">
	.alarmMapTimeLine {
		color: #3DA9FF;
		border: 1px solid transparent;
		background-color: rgba(15, 145, 255, 0.1);
		position: relative;
		.selectBox {
			z-index: 100;
			position: absolute;
			left: 140px;
			top: 90px;
			.txt {
				float: left;
				width: 80px;
				text-align: center;
				line-height: 40px;
				font-size: 20px;
				color: white;
			}
			.v-select {
				width: 200px;
				float: left;
				background-color: #1479bd;
			}
			.v-select .ivu-select-dropdown {
				background-color: rgba(24, 83, 144, 1);
			}
		}
		.title {
			width: 800px;
			position: absolute;
			left: 2px;
			top: 2px;
			.name {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				position: absolute;
				display: inline-block;
				left: 60px;
				bottom: 28px;
				font-size: 16px;
			}
		}
		.content {
			margin: 30px auto 0;
			width: 1558px;
			height: 810px;
			background: url(../../assets/image/securityCount-bg.png) no-repeat;
			background-size: 100% 100%;
			position: relative;
			.chartBox {
				position: absolute;
				left: 90px;
				top: 100px;
				width: 1380px;
				height: 660px;
			}
		}
	}
</style>