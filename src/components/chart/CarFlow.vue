<template>
	<div class="container">
		<div class="car-in car">
			<div class="animate-in animate">
				<div class="car-b-one car-b"></div>
				<div class="car-b-two car-b"></div>
			</div>
			<div class="data-in data">
				<span>今日进场</span>
				<span>{{carFlow.inNum}}</span>
			</div>
		</div>
		<div class="car-out car">
			<div class="animate-out animate">
				<div class="car-y-one car-y"></div>
				<div class="car-y-two car-y"></div>
			</div>
			<div class="data-out data">
				<span>今日出场</span>
				<span>{{carFlow.exitNum}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'CarFlow',
		props: ['carFlow']
	}
</script>

<style lang='scss' scoped>
	$carIn: #48c0e0;
	$carOut: #a49751;
	@keyframes flowIn {
		0%   {top:0px;}
    25%  {top:20px;}
    50%  {top:35px;}
    75%  {top:50px;}
    100% {top:63px;}
	}
	.container {
		width: 78%;
		height: 65%;
		margin: auto;
		margin-top: 16%;
		position: relative;
		.car {
			width: 50%;
			height: 100%;
			display: inline-block;
			float: left;
		}
		.car-in {
			padding-right: 5%;
		}
		.car-out {
			padding-left: 5%;
		}
		.animate {
			width: 100%;
			height: 50%;
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}
		.animate-in {
			background-image: url('../../assets/image/car/car_b_bg.png');
			.car-b {
				width: 16px;
				height: 26px;
				background: url('../../assets/image/car/car_b.png') no-repeat;
				background-size: 100% 100%;
				position: absolute;
				animation-name: flowIn;
				animation-iteration-count: infinite;
		    animation-timing-function: linear;
			}
			.car-b-one {
				left: 31.5%;
		    animation-duration: 4s;
			}
			.car-b-two {
				left: 7.5%;
				animation-duration: 2s;
				transform: rotate(180deg);
				animation-direction: reverse;
			}
		}
		.animate-out {
			background-image: url('../../assets/image/car/car_y_bg.png');
			.car-y {
				width: 16px;
				height: 26px;
				background: url('../../assets/image/car/car_y.png') no-repeat;
				background-size: 100% 100%;
				position: absolute;
				animation-name: flowIn;
				animation-iteration-count: infinite;
		    animation-timing-function: linear;
			}
			.car-y-one {
				right: 31.5%;
		    animation-duration: 2s;
		    transform: rotate(180deg);
			}
			.car-y-two {
				right: 7.5%;
				animation-duration: 4s;
				animation-direction: reverse;
			}
		}
		.data {
			position: absolute;
			width: 45%;
			bottom: 0;
			text-align: center;
		}
		.data span {
			display: block;
			&:nth-child(1) {
				font-size: 12px;
			}
			&:nth-child(2) {
				font-size: 24px;
				color: #fff;
			}
		}
		.data-in {
			color: $carIn;
		}
		.data-out {
			color: $carOut;
		}
	}
</style>
