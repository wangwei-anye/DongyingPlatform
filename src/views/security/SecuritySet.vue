<template>
	<div class="securitySet">
		<v-panel title='安防巡查标准设置' class='v-panel'>
			<div class="total">
				每日巡查次数：<input type="text" :value="totalNum" readonly="readonly" id="securitySetTotal" />次
			</div>
			<div class="baseLine"></div>
			<div class="txtNum">巡更次数</div>
			<div class="txtTimeline">时间轴</div>
			<div class="timeLine">
				<div class="item" v-for="item in securitySetData">
					<input type="text" :value="item.num" @keyup="keyUpFun" @blur="save" />
					<div class="line"></div>
					<div class="circle">{{item.time}}</div>
				</div>
			</div>
		</v-panel>
		<!--<v-knowledgeEstate unitId='2379'></v-knowledgeEstate>-->
	</div>
</template>

<script>
	import $ from 'jquery'
	import vPanel from '@/components/Panel'
	import vKnowledgeEstate from '../KnowledgeEstate'
	import { imgServerAddr } from '../../config'

	import { createNamespacedHelpers } from 'vuex'
	const {
		mapGetters,
		mapState,
		mapMutations,
		mapActions
	} = createNamespacedHelpers('security')

	export default {
		components: {
			vPanel,
			vKnowledgeEstate
		},
		name: 'SecuritySet',
		data() {
			return {}
		},
		computed: {
			...mapState([
				'totalNum'
			]),
			...mapGetters([
				'securitySetData'
			])
		},
		methods: {
			keyUpFun: function(e){
				var txt = $(e.target).val();
				$(e.target).val(txt.replace(/\D/g,''));
				txt = $(e.target).val();
				if(txt.length > 2){
					$(e.target).val(txt.substr(0,2));
				}
			},
			save: function() {
				var arr = $(".timeLine .item input");
				var total = 0;
				var param = {};
				var timeArr = [
					'one',
					'two',
					'three',
					'four',
					'five',
					'six',
					'seven',
					'eight',
					'nine',
					'ten',
					'eleven',
					'twelve'
				];

				for(var i = 0; i < arr.length; i++) {
					if($(arr[i]).val() == '' || isNaN($(arr[i]).val())) {
						$(arr[i]).val(0);
					}
					param[timeArr[i]] = $(arr[i]).val();
					total += parseInt($(arr[i]).val());
				}
				$("#securitySetTotal").val(total);
                param['total'] = total;
				this.saveSecurity(param);
			},
			...mapMutations([]),
			...mapActions([
				'querySecurity',
				'saveSecurity'
			])
		},
		mounted: function() {
			this.querySecurity();
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.securitySet {
		margin-top: 20px;
		font-size: 18px;
		color: #1cb1ff;
		input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
			-webkit-appearance: none !important;
			margin: 0;
		}
		.v-panel {
			height: 950px;
			position: relative;
			input {
				outline: none;
				color: white;
				background-color: rgba(28, 177, 255, 0.1);
				border: 1px solid #1cb1ff;
			}
			.total {
				margin-top: 77px;
				padding-left: 60px;
				input {
					text-align: center;
					width: 74px;
					height: 36px;
					margin-right: 10px;
				}
			}
			.txtTimeline {
				position: absolute;
				bottom: 184px;
				left: 15px;
			}
			.txtNum {
				position: absolute;
				top: 436px;
				left: 15px;
			}
			.baseLine {
				position: absolute;
				bottom: 196px;
				left: 65px;
				width: 1517px;
				height: 0px;
				z-index: 1;
				border-bottom: 1px solid rgba(8, 91, 161, 0.6);
			}
			.timeLine {
				position: absolute;
				left: 65px;
				left: 100px \9\0;
				z-index: 10;
				top: 256px;
				width: 90%;
				display: flex;
				justify-content: space-around;
				align-items: flex-end;
				
				display: -ms-flexbox;
				-ms-flex-pack: justify;
				-ms-flex-align: end;
				
				.item {
					display: flex;
					align-items: center;
					flex-direction: column;
					
					display: -ms-flexbox;
					-ms-flex-align: center;
					-ms-flex-direction: column;
				
					input {
						text-align: center;
						width: 84px;
						height: 60px;
						border-radius: 8px;
					}
					.line {
						height: 400px;
						width: 0px;
						border-left: 3px dashed #1cb1ff;
					}
					.circle {
						text-align: center;
						line-height: 80px;
						color: #0e2c68;
						width: 80px;
						height: 80px;
						border-radius: 50%;
						background-color: #42ACFF;
					}
					&:nth-child(odd) {
						.line {
							height: 300px;
						}
					}
				}
			}
		}
	}
</style>