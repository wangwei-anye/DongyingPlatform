<template>
	<div class="watchteamedit">
		<div class="watchteamedit-content">
			<div class="watchteamedit-content-icon" @click='editcancle'>
				<img src="../../assets/image/special/icon/cancel.png" alt="关闭">
			</div>
			<div class="watchteamedit-content-title">{{ idcard ? '修改' : '添加' }}治安巡逻人员</div>
			<div style="display: flex;">
				<div class="watchteamedit-content-upload" @click="awake_upload">
					<img  alt="" :src="watchteam.image ? imgServerAddr + '/' + watchteam.image + '?p=0' : require('../../assets/image/special/icon/camera.png')">
					<input type="file" @change='upload()' id="file" name="file" style="display: none;">
				</div>
				<div class="watchteamedit-content-form">
					<div class="watchteamedit-content-form-item">
						<label><img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">姓名：</label>
						<input type="text" maxlength="10" v-model='watchteam.name'>
					</div>
					<div class="watchteamedit-content-form-item">
						<label><img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">性别：</label>
						<select name="gender" v-model='watchteam.sex'>
							<option value="0">男</option>
							<option value="1">女</option>
						</select>
					</div>
					<div class="watchteamedit-content-form-item">
						<label><img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">身份证：</label>
						<input type="text" v-model='watchteam.id_card'>
					</div>
					<div class="watchteamedit-content-form-item">
						<label><img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">电话：</label>
						<input type="text" v-model='watchteam.tel'>
					</div>
				</div>
		  </div>
			<div class="btn">
				<span class="btn-yes" @click='editsure'>确定</span>
			</div>
		</div>
	</div>
</template>

<script>
  import $ from 'jquery'
  import { imgServerAddr } from '@/config'
	export default {
		name: 'watchteamedit',
		data () {
			return {
				imgServerAddr: ''
			}
		},
		props: ['idcard', 'watchteam'],
		mounted: function () {
			this.imgServerAddr = imgServerAddr
		},
		methods: {
			editsure: function () {
				this.$emit('editsure')
			},
			editcancle: function () {
				this.$emit('editcancle')
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
			    	if (response[0].ret) {
	            self.watchteam.image = response[0].info.md5
	            self.watchteam.full_image = imgServerAddr + '/' + response[0].info.md5 + '?p=0'
				    	self.$Message.success('上传成功！')
			    	}
			    	else {
			    		self.$Message.error('上传失败！')
			    	}
			    },
			    error: function (err) {
			    	self.$Message.error('上传失败！')
			    }
				})
	    }
		}
	}
</script>

<style lang='scss' scoped>
	.watchteamedit {
		position: fixed; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0, 0, 0, .66); z-index: 9;
		display: flex; justify-content: center; align-items: center;
		.watchteamedit-content {
			position: relative; width: 645px; height: 528px; background: url('../../assets/image/watch_edit_bg.png') no-repeat;
			.watchteamedit-content-icon {
				width: 21px; height: 21px; cursor: pointer; position: absolute; top: 30px; right: 30px;
			}
			.watchteamedit-content-title {
				color: #4fc7ff; font-size: 22px; text-align: center; margin: 40px 0;
			}
			.watchteamedit-content-upload {
				width: 155px; height: 185px; display: inline-flex; margin-left: 75px;
				background: url('../../assets/image/watch_edit_upload.png') no-repeat; cursor: pointer;
				img {
					width: 100%; height: 100%;
				}
			}
			.watchteamedit-content-form {
				display: inline-flex; margin-left: 10px; flex-direction: column;
				.watchteamedit-content-form-item {
					margin-bottom: 20px;
					label {
						color: #1cb1ff; font-size: 16px; display: inline-block; width: 90px; text-align: right;
					}
					input, textarea, select {
						width: 240px;
						height: 32px;
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
				}
			}
			.btn {
				margin-left: 275px; margin-top: 30px;
				span {
					display: inline-block;
					width: 100px;
					height: 40px;
					line-height: 40px;
					background-color: #33ace5;
					color: #fff;
					font-size: 16px;
					cursor: pointer;
					text-align: center;
				}
			}
		}
	}
</style>