<template>
	<div class="button">
		<button
		class='default' 
		:class='myStyle'
		ref='myButton'
		@click='handleClick'>{{btnInfo_new.text}}</button>
	</div>
</template>

<script>
	export default {
		name:'v-button',
		props: ['btnInfo'],
		data () { 
			return {
				myStyle: {
					isCustom: false,
					isPrimary: false,
					isSuccess: false,
					isInfo: false,
					isWarning: false,
					isDanger: false
				}
			}
		},
		methods: {
			handleClick (e) {
				this.$emit('click', e)
			},
			changeBtnStyle () {
				if (!this.btnInfo) return
				let styles = this.btnInfo.styles
				let type = this.btnInfo.type
				switch (type) {
					case 'primary':
						this.myStyle.isPrimary = true
						break;
					case 'info':
						this.myStyle.isInfo = true
						break;
					case 'success':
						this.myStyle.isSuccess = true
						break;
					case 'danger':
						this.myStyle.isDanger = true
						break;
					case 'warning':
						this.myStyle.isWarning = true
						break;
					default:
						break;
				}
				if (styles) {
					this.myStyle.isCustom = true
					const {width, height, borderRadius, backgroundColor, border, color, fontSize, fontWeight, hoverColor} = styles
					this.$nextTick(function () {
					 //  document.getElementsByClassName('isCustom')[0].style.width = width
						// document.getElementsByClassName('isCustom')[0].style.height = height
						// document.getElementsByClassName('isCustom')[0].style.borderRadius = borderRadius
						// document.getElementsByClassName('isCustom')[0].style.backgroundColor = backgroundColor
						// document.getElementsByClassName('isCustom')[0].style.border = border
						// document.getElementsByClassName('isCustom')[0].style.color = color
						// document.getElementsByClassName('isCustom')[0].style.fontSize = fontSize
						// document.getElementsByClassName('isCustom')[0].style.fontWeight = fontWeight
						// document.getElementsByClassName('isCustom')[0].onmouseover = function () {
						// 	this.style.backgroundColor = hoverColor
						// }
						// document.getElementsByClassName('isCustom')[0].onmouseout = function () {
						// 	this.style.backgroundColor = backgroundColor
						// }
						this.$refs.myButton.style.width = width
						this.$refs.myButton.style.height = height
						this.$refs.myButton.style.borderRadius = borderRadius
						this.$refs.myButton.style.backgroundColor = backgroundColor
						this.$refs.myButton.style.border = border
						this.$refs.myButton.style.color = color
						this.$refs.myButton.style.fontSize = fontSize
						this.$refs.myButton.style.fontWeight = fontWeight
						this.$refs.myButton.onmouseover = function () {
							this.style.backgroundColor = hoverColor
						}
						this.$refs.myButton.onmouseout = function () {
							this.style.backgroundColor = backgroundColor
						}
				  })
				}
			}
		},
		mounted () {
			this.$nextTick(function () {
		    // Code that will run only after the entire view has been rendered
		    this.changeBtnStyle()
		  })
		},
		computed: {
			btnInfo_new () {
				if (!this.btnInfo) {
					let btnInfo = {}
					btnInfo.text = '查询'
					return btnInfo
				}
				return this.btnInfo
			}
		}
	}
</script>

<style lang='scss' scoped>
	$primary: #2D8CF0;
	$info: #2DB7F5;
	$success: #19BE6B;
	$warning: #FF9900;
	$danger: #ED3F14;
	.button {
		display: inline-block;
		.default {
			width: 112px;
			height: 38px;
			background-color: #FEDD40;
			border: none;
			color: #000;
			font-size: 16px;
			font-weight: normal;
			cursor: pointer;
			&:hover {
				background-color: #FEDD40 * 0.9;
			};
		};
		.isPrimary {
			background-color: $primary;
			color: #fff;
			border-color: $primary * 1.1;
			&:hover {
				border-color: $primary * 1.2;
				background-color: $primary * 1.2;
			};
		};
		.isInfo {
			background-color: $info;
			color: #fff;
			border-color: $info * 1.1;
			&:hover {
				border-color: $info * 1.2;
				background-color: $info * 1.2;
			};
		};
		.isSuccess {
			background-color: $success;
			color: #fff;
			border-color: $success * 1.1;
			&:hover {
				border-color: $success * 1.2;
				background-color: $success * 1.2;
			};
		};
		.isWarning {
			background-color: $warning;
			color: #fff;
			border-color: $warning * 1.1;
			&:hover {
				border-color: $warning * 1.2;
				background-color: $warning * 1.2;
			};
		};
		.isDanger {
			background-color: $danger;
			color: #fff;
			border-color: $danger * 1.1;
			&:hover {
				border-color: $danger * 1.2;
				background-color: $danger * 1.2;
			};
		}
	}

</style>