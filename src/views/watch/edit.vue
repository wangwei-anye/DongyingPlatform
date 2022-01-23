<template>
	<div class="policeedit">
		<div class="policeedit-content">
			<div class="title">
				{{ pno ? '修改' : '添加' }}社区民警
			</div>
			<div class="cancel" @click='editcancle'>
				<img src="../../assets/image/special/icon/cancel.png" height="21" width="21" alt="">
			</div>
			<div class="add_content">
				<div class="add_left">
					<input type="file" @change='upload()' id="file" name="file">
					<img :src="police.image ? imgServerAddr + '/' + police.image + '?p=0' : require('../../assets/image/special/icon/camera.png')" height="183" width="154" alt="" @click='awake_upload'>
				</div>
				<div class="add_right">
					<div class="user">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							姓名：
						</div>
						<input type="text" maxlength="10" v-model='police.name'>
					</div>
					<div class="user">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							性别：
						</div>
						<select name="gender" id="gender" v-model='police.sex'>
							<option value="0">男</option>
							<option value="1">女</option>
						</select>
					</div>
					<div class="user">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							警号：
						</div>
						<input v-if="pno" type="text" maxlength="18" v-model='police.police_no' disabled="disabled">
						<input v-else type="text" maxlength="18" v-model='police.police_no'>
					</div>
					<div class="user">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							电话：
						</div>
						<input type="text" maxlength="13" v-model='police.tel'>
					</div>
					<div class="user user_address">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							工作单位：
						</div>
						<input type="text" maxlength="60" v-model='police.work_unit'>
					</div>
					<div class="user user_address">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							分管片区：
						</div>
						<button type="button" class="btnadd" @click="addUnit">
							<i class="ivu-icon ivu-icon-plus-round"></i>添加
						</button>
					</div>
					<div class="user user_address">
						<div>&nbsp;</div>
						<div class="unitlist">
							<Tag v-for="(item, index) in unitlist" :key="index" :name="index" closable color="blue" @on-close="handleClose">{{ item.split(':')[1] }}</Tag>
						</div>
					</div>
				</div>
			</div>
			<div class="btn">
				<span class="btn-yes" @click='editsure'>确定</span>
			</div>
			<UnitSelect v-if="showsel" @click="addUnit" @selsure="selsure" @selcancle="selcancle"></UnitSelect>
		</div>
	</div>
</template>

<script>
  import UnitSelect from '@/views/watch/unitselect'
  import $ from 'jquery'
  import { imgServerAddr } from '@/config'
  
	export default {
		name:'policeedit',
		components: {
			UnitSelect
		},
		data () {
			return {
				showsel: false,
				unitlist: [],
				imgServerAddr: ''
			}
		},
		props: ['pno', 'police'],
		mounted: function () {
			this.imgServerAddr = imgServerAddr
			if (this.police.unit_idList) {
				this.unitlist = this.police.unit_idList.split('#')
			}
			else {
				this.unitlist = []
			}
		},
		methods: {
			editsure: function () {
				this.police.unit_idList = this.unitlist.toString().replace(/\,/g, '#')
				this.$emit('editsure')
			},
			editcancle: function () {
				this.$emit('editcancle')
			},
			// 添加分管片区
			addUnit: function () {
				this.showsel = true
			},
			// 删除分管片区
			handleClose: function (event, name) {
				this.unitlist.splice(name, 1)
			},
			// 确认选择
			selsure: function (newlist) {
				this.unitlist = this.unitlist.concat(newlist)
				this.showsel = false
			},
			// 取消选择
			selcancle: function () {
				this.showsel = false
			},
			// 上传
			awake_upload () {
				$('#file').click()
			},
      upload() {
      	let self = this
        if (!$('#file')[0].files[0]) {
        	self.$Message.error('没有选择文件！')
        	return
        }
        if ($('#file')[0].files[0].type.indexOf('image/') === -1) {
        	self.$Message.error('文件格式不正确，只能上传jpg/png格式的图片！')
        	return
        }
      	let formdata = new FormData()
      	formdata.append('file', $('#file')[0].files[0])
				$.ajax({
			    url: imgServerAddr + '/upload',
			    type: 'POST',
			    cache: false,
			    data: formdata,
			    processData: false,
    			contentType: false,
			    success: function (response) {
			    	console.log(response)
			    	if (response[0].ret) {
	            self.police.image = response[0].info.md5
	            self.police.full_image = imgServerAddr + '/' + response[0].info.md5 + '?p=0'
				    	self.$Message.success('上传成功！')
			    	}
			    	else {
			    		self.$Message.error('上传失败！')
			    	}
			    },
			    error: function (err) {
			    	console.log(err)
			    	self.$Message.error('上传失败！')
			    }
				})
      }
		}
	}
</script>

<style lang='scss' scoped>
	.policeedit {
		position: fixed; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0, 0, 0, .66); z-index: 9;
		display: flex; justify-content: center; align-items: center;
		.policeedit-content {
			width: 1000px;
			height: 750px;
			background: url('../../assets/image/special/add_bg.png') no-repeat;
			background-size: 100% 100%;
			position: relative;
			color: #fff; font-size: 14px;
			.title {
				font-size: 22px;
				margin-top: 30px;
				margin-bottom: 40px;
				text-align: center;
			}
			.cancel {
				position: absolute;
				right: 30px;
				top:35px;
				cursor: pointer;
			}
			.add_content {
				padding: 0 45px;
				width: 100%;
				.add_left {
					img {
						cursor: pointer;
					}
					display: inline-block;
					width: 20%;
					float: left;
					input {
						display: none;
					}
				}
				.add_right {
					display: inline-block;
					width: 80%;
					.user {
						display: inline-block;
						width: 50%;
						float: left;
						margin-bottom: 20px;
						img {
							vertical-align: middle;
							margin-right: 1px;
						}
						div {
							text-align: right;
							display: inline-block;
							width: 130px;
						}
						input, textarea, select {
							width: 226px;
							height: 35px;
							border-radius: 2px;
							border:1px solid #1a9ee8;
							color: #fff;
							padding-left: 3px;
							background-color: #034d8c;
						}
						select {
							appearance:none;
	  					-moz-appearance:none;
	  					-webkit-appearance:none;
	  					background: url("../../assets/image/special/icon/tri.png") no-repeat scroll 95% center transparent;
						}
						option {
							background-color: #034d8c;
						}
						.unitlist {
							width: 590px; height: 300px; overflow-x: hidden; overflow-y: auto;
							background: rgba(28, 177, 255, .1); text-align: left; padding: 5px 5px;
							div { text-align: initial; width: initial; margin-bottom: 5px; }
						}
					}
					.user_address {
						width: 100%;
						input {
							width: calc(100% - 137px);
						}
					}
					.user_unit {
						width: 100%;
						select {
							width: calc((100% - 152px) / 4);
						}
					}
					.user_type {
						width: 100%;
						select {
							width: 180px;
						}
					}
					.user_remark {
						div {
							vertical-align: top;
						}
						width: 100%;
						textarea {
							width: calc(100% - 137px);
							height: 180px;
							resize:none;
						}
					}
				}
			}
			.btn {
				margin-left: 360px;
				span {
					display: inline-block;
					width: 100px;
					height: 40px;
					line-height: 40px;
					background-color: #33ace5;
					color: #fff;
					cursor: pointer;
					text-align: center;
				}
			}
			.btnadd {
				width: 90px; height: 32px; line-height: 30px; color: #1cb1ff;
				background: rgba(28, 177, 255, .1); border: 1px dashed #2a7fce;
				i { margin-right: 5px; }
			}
		}
		.error-msg {margin-left: 10px; font-size: 15px; color: red; text-align: center;}
	}
</style>