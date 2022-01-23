<template>
	<div>
		<div class="alerts">
			<div class="header-info" :style="headerInfoStyle" ref="headerInfo">
				<p>人开门次数：{{ openDoorTimes }}</p>
				<p>车进入小区次数：{{ carInTimes }}</p>
				<p>车离开小区次数：{{ carOutTimes }}</p>
			</div>
			<div class="item-info" :style="itemInfoStyle" ref="itemInfo">
				<p>{{ happenDate }}&nbsp;&nbsp;{{ happenTime }}</p>
				<p>{{ happenZone }}</p>
				<p>{{ happenDoor }}</p>
			</div>
		</div>
		<div class="charts" @scroll="scrollCharts($event)">
			<div v-for="data in datum" class="chart-wrap" :style="chartStyle">
				<h4 @mouseover="headerOver(data, $event)" @mouseout="headerInfoStyle.display = 'none'">{{ data.date }}</h4>
				<div class="chart">
					<div class="bg">
						<i class="verticle-line"></i>
						<i class="bottom-line"></i>
					</div>
					<div class="car">
						<i v-for="(item, index) in data.car" :style="{top: mapArray(data.car, {min: 0, max: 156})[index] + 'px', zIndex: data.car.length - index}" @mouseover="itemOver(item, data.date, $event)" @mouseout="itemInfoStyle.display = 'none'">
            </i>
					</div>
					<div class="people">
						<i v-for="(item, index) in data.people.concat().reverse()" :style="{bottom: mapArray(data.people, {min: 0, max: 156})[index] + 'px', zIndex: index}" @mouseover="itemOver(item, data.date, $event)" @mouseout="itemInfoStyle.display = 'none'">
            </i>
					</div>
				</div>
				<i class="circle"></i>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			w: {
				type: Number,
				default: 130
			},
			h: {
				type: Number,
				default: 627
			},
			datum: {
				type: Array,
				default() {
					return [{
						date: '2017/05/03',
						car: [{
							time: '16:14:15',
							zone: '冲广坪小区',
							door: '进入北门'
						}, ],
						people: [{
							time: '16:14:15',
							zone: '冲广坪小区',
							door: '北门'
						}, ]
					}]
				}
			}
		},
		mounted: function() {
		},
		data() {
			return {
				chartStyle: {
					'width': this.w + 'px',
					'height': this.h + 'px'
				},
				headerInfoStyle: {
					display: 'none',
					top: 0,
					left: 0
				},
				itemInfoStyle: {
					display: 'none',
					top: 0,
					left: 0
				},
				openDoorTimes: 5,
				carInTimes: 10,
				carOutTimes: 10,
				happenDate: '2017/12/07',
				happenTime: '00:00:00',
				happenZone: '冲广坪小区',
				happenDoor: '进入北门'
			}
		},
		methods: {
			mapArray(sArr, range) {
				// 此函数根据数据数组映射出适合布局的布局数组
				let tArr = [],
					len = sArr.length,
					i = 0,
					avg = 0,
					mapArr = [];

				for(i = 0; i < 8; i++) {
					mapArr[i] = i * range.max / (8 - 1);
				}

				if(len >= 8) {
					avg = range.max / (len - 1);
				} else {
					avg = mapArr[len] / (len - 1);
				}

				for(i = 0; i < len; i++) {
					tArr[i] = i * avg;
				}

				return tArr;
			},
			headerOver(data, event) {
				let headerRect = event.target.getBoundingClientRect(),
					app = document.getElementById('app'),
					scale = [1, 1],
					headerInfo = this.$refs.headerInfo,
					header = event.target;

				// getBoundingClientRect 获取的位置会受到 transform: scale() 的影响
				// 此处用来还原, 未所缩放时忽略
				if(app && app.style.transform.indexOf('scale') != -1) {
					scale = app.style.transform.slice(6, -1).split(', ').map(e => parseFloat(e));
				}

				// 写数据
				this.openDoorTimes = data.people.length;
				this.carInTimes = data.car.filter(item => item.door.indexOf('进入') !== -1).length;
				this.carOutTimes = data.car.length - this.carInTimes;

				// 定位置并展示
				this.headerInfoStyle.display = 'inline-block';
				setTimeout(() => {
					this.headerInfoStyle.top = headerRect.top / scale[1] - headerInfo.clientHeight - 10 + 'px';
					this.headerInfoStyle.left = headerRect.left / scale[0] - (headerInfo.clientWidth - header.clientWidth) / 2 + 'px';
				}, 0)
			},
			itemOver(data, date, event) {
				let itemRect = event.target.getBoundingClientRect(),
					app = document.getElementById('app'),
					scale = [1, 1],
					itemInfo = this.$refs.itemInfo,
					item = event.target;

				// getBoundingClientRect 获取的位置会受到 transform: scale() 的影响
				// 此处用来还原, 未所缩放时忽略
				if(app && app.style.transform.indexOf('scale') != -1) {
					scale = app.style.transform.slice(6, -1).split(', ').map(e => parseFloat(e));
				}

				// 写数据
				this.happenDate = date;
				this.happenTime = data.time;
				this.happenZone = data.zone;
				this.happenDoor = data.door;

				// 定位置并展示
				this.itemInfoStyle.display = 'inline-block';
				setTimeout(() => {
					this.itemInfoStyle.top = itemRect.top / scale[1] - (itemInfo.clientHeight - item.clientHeight) / 2 + 'px';
					this.itemInfoStyle.left = itemRect.left / scale[0] - itemInfo.clientWidth - 15 + 'px';
				}, 0);
			},
			scrollCharts(event) {
				let element = event.target;

				if(element.scrollWidth <= element.clientWidth + element.scrollLeft) {
					this.$emit('scrollToPeak');
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	::-webkit-scrollbar {
		height: 12px;
	}
	
	 ::-webkit-scrollbar-button {
		display: none;
	}
	
	 ::-webkit-scrollbar-track {
		border-radius: 8px;
		border: 1px solid #1375c5;
	}
	
	 ::-webkit-scrollbar-thumb {
		border-radius: 8px;
		background-color: #1375c5;
	}
	
	.alerts {
		.header-info {
			display: none;
			position: fixed;
			border-radius: 10px;
			background-color: rgba(51, 97, 179, .9);
			&:after {
				position: absolute;
				bottom: -9px;
				left: 50%;
				transform: translate(-50%, 0);
				content: ' ';
				width: 0;
				border-left: 10px solid transparent;
				border-right: 10px solid transparent;
				border-top: 10px solid rgba(51, 97, 179, .9);
			}
			p {
				margin: 10px;
				white-space: nowrap;
				color: #fff;
				font-size: 16px;
				text-align: left;
			}
		}
		.item-info {
			display: none;
			position: fixed;
			z-index: 9999;
			border-radius: 10px;
			background-color: rgba(51, 97, 179, .9);
			&:after {
				position: absolute;
				right: -10px;
				top: 50%;
				transform: translate(0, -50%);
				content: ' ';
				width: 0;
				border-top: 10px solid transparent;
				border-bottom: 10px solid transparent;
				border-left: 10px solid rgba(51, 97, 179, .9);
			}
			p {
				margin: 10px;
				white-space: nowrap;
				color: #fff;
				font-style: normal;
				font-size: 16px;
				text-align: left;
			}
		}
	}
	
	.charts {
		margin: 0 auto;
		width: 1560px;
		height: 729px;
		overflow-x: auto;
		white-space: nowrap;
		.chart-wrap {
			position: relative;
			display: inline-block;
			width: 1696px;
			height: 627px;
			&:hover {
				background-color: rgba(28, 177, 255, .1);
			}
			&:hover .circle {
				background-color: #1cb1ff;
			}
			.circle {
				position: absolute;
				background-color: #0c4a85;
				bottom: 0;
				left: 50%;
				transform: translate(-50%, 0);
				border-radius: 50%;
				width: 27px;
				height: 27px;
			}
			h4 {
				position: relative;
				padding-top: 27px;
				height: 90px;
				text-align: center;
				font-size: 18px;
				color: #1cb1ff;
				cursor: pointer;
				&:hover {
					color: #e8f7ff;
				}
			}
			.chart {
				position: relative;
				width: 130px;
				height: 537px;
				.bg {
					i {
						position: absolute;
						background-color: #0c4a85;
					}
					.verticle-line {
						bottom: 12px;
						left: 50%;
						transform: translate(-50%, 0);
						width: 3px;
						height: 525px;
					}
					.bottom-line {
						bottom: 12px;
						height: 3px;
						width: 100%;
					}
				}
				.car,
				.people {
					position: relative;
					height: 240px;
					i {
						position: absolute;
						left: 50%;
						transform: translate(-50%, 0);
						width: 84px;
						height: 84px;
						cursor: pointer;
					}
				}
				.car {
					margin-bottom: 23px;
					i {
						background: url(../../assets/image/chart/car_default.png) no-repeat;
						&:hover {
							background: url(../../assets/image/chart/car_active.png) no-repeat;
						}
					}
				}
				.people {
					i {
						background: url(../../assets/image/chart/people_default.png) no-repeat;
						&:hover {
							background: url(../../assets/image/chart/people_active.png) no-repeat;
						}
					}
				}
			}
		}
	}
</style>