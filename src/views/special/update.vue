<template>
	<div class="delete">
			<div class="title">
				修改特殊人员
			</div>
			<div class="cancel" @click='mshowUpdate'>
				<img src="../../assets/image/special/icon/cancel.png" height="21" width="21" alt="">
			</div>
			<div class="add_content">
				<div class="add_left">
					<img src="../../assets/image/special/icon/camera.png" height="183" width="154" alt="" @click='awake_upload' id="special_icon1">
					<input type="file" @change='upload' id="file1">
				</div>
				<div class="add_right">
					<div class="user user_name">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							姓名：
						</div>
						<input type="text" maxlength="10" v-model='selectedUser.name'>
					</div>
					<div class="user user_gender">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							性别：
						</div>
						<select name="gender" id="gender" v-model='selectedUser.gender'>
							<option value="0">男</option>
							<option value="1">女</option>
						</select>
					</div>
					<div class="user user_code">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							身份证号码：
						</div>
						<input type="text" maxlength="18" v-model='selectedUser.code'>
					</div>
					<div class="user user_phone">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							电话号码：
						</div>
						<input type="text" maxlength="13" v-model='selectedUser.phone'>
					</div>
					<div class="user user_nation">
						<div>
							<img src="" height="12" width="12" alt="">
							户籍：
						</div>
						<input type="text" maxlength="20" v-model='selectedUser.nation'>
					</div>
					<div class="user user_address">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							住址：
						</div>
						<input type="text" maxlength="60" v-model='selectedUser.address'>
					</div>
					<div class="user user_unit">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							请选择小区：
						</div>
						<select name="town" id="town" v-model='selectedUser.town' @change='getPolice3(selectedUser)'>
							<option v-for="item in townList_2" :value="item.value" :key="item.value">{{ item.label }}</option>
						</select>
						<select name="police" id="police" v-model='selectedUser.police' @change='getUnit3(selectedUser)'>
							<option v-for="item in policeList_2" :value="item.value" :key="item.value">{{ item.label }}
							</option>
						</select>
						<!--<select name="country" id="country" v-model='selectedUser.country' @change='getCommunity3(selectedUser)'>
							&lt;!&ndash;<option value="" key="all" selected>选择乡镇</option>&ndash;&gt;
							<option v-for="item in countryList_2" :value="item.value" :key="item.value">{{ item.label }}</option>
						</select>
						<select name="community" id="community" v-model='selectedUser.community' @change='getUnit3(selectedUser)'>
							&lt;!&ndash;<option value="" key="all" selected>选择社区</option>&ndash;&gt;
							<option v-for="item in communityList_2" :value="item.value" :key="item.value">{{ item.label }}</option>
						</select>-->
						<select name="unit" id="unit_update" v-model='selectedUser.unit'>
							<!--<option value="" key="all" selected>选择小区</option>-->
							<option v-for="item in unitList_2" :value="item.value" :key="item.value">{{ item.label }}</option>
						</select>
					</div>
					<div class="user user_type">
						<div>
							<img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
							人员类型：
						</div>
						<select name="type" id="type" v-model='selectedUser.type' @change='getCategory'>
							<option value="">人员类型</option>
							<option value="1">关爱人员</option>
							<option value="2">重点人员</option>
						</select>
						<select name="category" id="category" v-model='selectedUser.category'>
							<option value="">人员类目</option>
							<option v-for="item in lists" :value="item.value" :key="item.value">{{item.label}}</option>
						</select>
					</div>
					<div class="user user_remark">
						<div>
							<img src="" height="12" width="12" alt="">
							备注：
						</div>
						<textarea name="remark" id="remark" v-model='selectedUser.remark'></textarea>
					</div>
				</div>
			</div>
			<div class="btn">
				<span class="btn-yes" @click='add'>确定</span>
				<label class="error-msg" v-show="errorShow">{{ errorMsg }}</label>
			</div>
	</div>
</template>

<script>
	import { createNamespacedHelpers } from 'vuex'
  	import { imgServerAddr } from '../../config'
    import  $ from 'jquery'

    const {mapState, mapMutations, mapActions} = createNamespacedHelpers('special');

    export default {
        name: 'add',
        props: ['selectedUser'],
        data() {
            return {
                lists: []
            }
        },
        methods: {
            getCategory() {
                console.log("getCategory called");
                if (this.selectedUser.type === '2') {
                    this.lists = [
                        {
                            value: 1,
                            label: '涉毒人员'
                        },
                        {
                            value: 2,
                            label: '社区矫正人员'
                        },
                        // {
                        //     value: 3,
                        //     label: '服刑及涉毒人员'
                        // },
                        {
                            value: 4,
                            label: '刑释解戒人员'
                        },
                        {
                            value: 5,
                            label: '重点青少年'
                        },
                        {
                            value: 6,
                            label: '重点信访人员'
                        },
                        {
                            value: 7,
                            label: '精神病人'
                        },
                        {
                            value: 8,
                            label: '涉邪人员'
                        },
                    ]
                } else {
                    this.lists = [
                        {
                            value: 9,
                            label: '优抚对象'
                        },
                        {
                            value: 10,
                            label: '残疾人员'
                        },
                        {
                            value: 11,
                            label: '离休干部'
                        },
                        {
                            value: 12,
                            label: '低保人员'
                        },
                        {
                            value: 13,
                            label: '重大疾病人员'
                        },
                        {
                            value: 14,
                            label: '孤寡老人'
                        },
                        {
                            value: 15,
                            label: '留守人员'
                        }
                    ]
                }
            },
            getCountry3 (selectWord) {
				this.clearTownSelect2();
				selectWord.isAdd = true;
				this.getCountry(selectWord);
			},
            getPolice3(selectWord) {
                console.log("on-change getPolice3 happened");
                this.clearTownSelect2();
                selectWord.isAdd = true;
                this.getPolice(selectWord);
            },
			getCommunity3 (selectWord) {
				this.clearCountrySelect2();
				selectWord.isAdd = true;
				this.getCommunity(selectWord);
			},
			getUnit3 (selectWord) {
				this.clearPoliceSelect2();
				selectWord.isAdd = true;
				this.getUnit(selectWord);
			},
            setUpdateUnitName() {
				this.selectedUser.unit_name = "";
                let options = document.getElementById('unit_update').options;
                //避免下拉框空数据报错
                if(options.length > 0 && options.selectedIndex !== -1){
                    let index = options.selectedIndex;
                    let text = options[index].text;
                    this.selectedUser.unit_name = text;
                }
            },
            ...mapMutations([
                'mshowAdd',
                'mshowNotify',
                'notifyMsg',
                'updateNotify',
                'mshowUpdate',
                'updateAddErr',
                'clearTownSelect2',
				'clearCountrySelect2',
				'clearCommunitySelect2',
                'clearPoliceSelect2',
            ]),
            ...mapActions([
                'confirmUpdate',
                'getTown',
                'getCountry',
                'getCommunity',
                'getUnit',
                'getPolice',
				'getData'
            ]),
            add() {
                this.setUpdateUnitName();
                this.confirmUpdate(this.selectedUser);
            },
            awake_upload() {
                document.getElementById('file1').click();
            },
            upload() {
                let self = this;
                let imgAddr = imgServerAddr;
                if(imgServerAddr[imgServerAddr.length - 1] === '/'){
                    imgAddr = imgServerAddr.substring(0, imgServerAddr.length - 1);
                }
                let file = document.getElementById('file1').files[0];
                if (!file) {
                    self.updateAddErr({value: '没有选择文件！', error: true});
                    return;
                }
                if (file.type.indexOf('image/') === -1) {
                    self.updateAddErr({value: '文件格式不正确，只能上传jpg/png格式的图片！', error: true});
                    return;
                }
                let reader = new FileReader();
                let image = '';
                reader.onload = function (e) {
                    var image1 = new Image();
                    image1.src = e.target.result;
                    image1.onload = function() {
                        let width = image1.width;
                        let height = image1.height;
                        if (width < 320 || height < 320) {
                            self.updateAddErr({value: '文件尺寸不正确，不能小于320*320！', error: true});
                            return;
                        }
                        image = e.target.result;

                        $.ajax({
                            type: 'POST',
                            //url: 'http://192.168.5.136:48069/upload',
                            url: imgAddr + '/upload',
                            data: {image: image},
                            dataType: 'json',
                            success: function (response) {
                                // console.log(response);
                                self.selectedUser.image = response.info.md5;
                                self.updateAddErr({value: '上传成功！', error: true});
                                document.getElementById('special_icon1').src = image;
                                setTimeout(() => {
                                    self.updateAddErr({value: '', error: false})
                                }, 2000)
                            },
                            error: function (err) {
                                self.updateAddErr({value: '上传失败！', error: true});
                            }
                        });
                    };
                };
                reader.readAsDataURL(file);
            }
        },
        computed: {
            ...mapState([
                'showDel',
                'showAdd',
                'showNotify',
                'townList',
                'townList_2',
                'countryList_2',
                'policeList_2',
                'communityList_2',
                'unitList_2',
                'errorMsg',
                'errorShow'
            ])
        },
        mounted() {
            this.getTown(true);
        	this.getCategory();
        }
    }
</script>

<style lang='scss' scoped>
	.delete {
		width: 1000px;
		height: 750px;
		background: url('../../assets/image/special/add_bg.png') no-repeat;
		background-size: 100% 100%;
		position: absolute;
		top: calc(50% - 375px);
		left: calc(50% - 500px);
		color: #45c1fb;
		z-index: 5;
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
				}
				.user_nation {
					width: 100%;
					input {
						width: calc(100% - 137px);
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
				background-color: #33ace5;
				padding: 5px 8px;
				color: #fff;
				cursor: pointer;
				text-align: center;
			}
		}
	}
	.error-msg {margin-left: 10px; font-size: 16px; color: white; text-align: center;}
</style>