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
			<div class="name">警情热点时间段</div>
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
				}
			}
		},
		computed: {
			chartBarDataArr: function() {
				var xArr = [];
				var yArrOne = [];
				var yArrTwo = [];
				for(var i = 0; i < this.alarmBar.length; i++) {
					xArr.push(this.alarmBar[i].time);
					if(this.alarmBar[i][this.selectOne] != undefined) {
						yArrOne.push(this.alarmBar[i][this.selectOne]);
					} else {
						yArrOne.push(0);
					}
					if(this.alarmBar[i][this.selectTwo] != undefined) {
						yArrTwo.push(this.alarmBar[i][this.selectTwo]);
					} else {
						yArrTwo.push(0);
					}
				}

				var obj = {
					xDataArr: xArr,
					gridBottom: 40,
					axisLabelLen: 12,
					legendArr: [this.selectOneName], //需要提示的标签
					yDataArr: [{
						name: this.selectOneName,
						type: 'bar',
						yAxisIndex: 0,
						data: yArrOne,
						labelPositon: '',
						labelColor: '#49c0ff',
						labelSize: 20,
						itemStyle: ['#00C0FF'] //同上
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
						type: 'bar',
						yAxisIndex: 0,
						data: yArrTwo,
						labelPositon: '',
						labelColor: '#49c0ff',
						labelSize: 20,
						itemStyle: ['#FEC04F'] //同上
					});
				} else {
					obj.yDataArr.push({
						name: this.selectTwoName,
						type: 'bar',
						yAxisIndex: 0,
						data: [],
						labelPositon: '',
						labelColor: '#49c0ff',
						labelSize: 20,
						itemStyle: ['#FEC04F'] //同上
					});
				}
				return obj;
			},
			...mapState([
				'alarmBar',
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