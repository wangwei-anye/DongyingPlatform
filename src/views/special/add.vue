<template>
    <div class="delete">
        <div class="title">
            添加特殊人员
        </div>
        <div class="cancel" @click='mshowAdd'>
            <img src="../../assets/image/special/icon/cancel.png" height="21" width="21" alt="">
        </div>
        <div class="add_content">
            <div class="add_left">
                <img src="../../assets/image/special/icon/camera.png" height="183" width="154" alt=""
                     @click='awake_upload' id="special_icon">
                <input type="file" @change='upload()' id="file">
                <input type="button" id="btnUpload" value="上传图片" onclick="fileupload()"/>
            </div>
            <div class="add_right">
                <div class="user user_name">
                    <div>
                        <img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
                        姓名：
                    </div>
                    <input type="text" maxlength="10" v-model='newUser.name'>
                </div>
                <div class="user user_gender">
                    <div>
                        <img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
                        性别：
                    </div>
                    <select name="gender" id="gender" v-model='newUser.gender'>
                        <option value="">请选择</option>
                        <option value="0">男</option>
                        <option value="1">女</option>
                    </select>
                </div>
                <div class="user user_code">
                    <div>
                        <img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
                        身份证号码：
                    </div>
                    <input type="text" maxlength="18" v-model='newUser.code'>
                </div>
                <div class="user user_phone">
                    <div>
                        <img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
                        电话号码：
                    </div>
                    <input type="text" maxlength="13" v-model='newUser.phone'>
                </div>
                <div class="user user_nation">
                    <div>
                        <img src="" height="12" width="12" alt="">
                        户籍：
                    </div>
                    <input type="text" maxlength="20" v-model='newUser.nation'>
                </div>
                <div class="user user_address">
                    <div>
                        <img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
                        住址：
                    </div>
                    <input type="text" maxlength="60" v-model='newUser.address'>
                </div>
                <div class="user user_unit">
                    <div>
                        <img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
                        请选择小区：
                    </div>
                    <select name="town" id="town" v-model='newUser.town' @change='getPolice2(newUser)'>
                        <option v-for="item in townList_2" :value="item.value" :key="item.value">{{ item.label }}
                        </option>
                    </select>
                    <select name="police" id="police" v-model='newUser.police' @change='getUnit2(newUser)'>
                        <option v-for="item in policeList_2" :value="item.value" :key="item.value">{{ item.label }}
                        </option>
                    </select>
                    <!--<select name="country" id="country" v-model='newUser.country' @change='getCommunity2(newUser)'>
                        &lt;!&ndash;<option value="">选择乡镇</option>&ndash;&gt;
                        <option v-for="item in countryList_2" :value="item.value" :key="item.value">{{ item.label }}</option>
                    </select>
                    <select name="community" id="community" v-model='newUser.community' @change='getUnit2(newUser)'>
                        &lt;!&ndash;<option value="">选择社区</option>&ndash;&gt;
                        <option v-for="item in communityList_2" :value="item.value" :key="item.value">{{ item.label }}</option>
                    </select>-->
                    <select name="unit" id="unit_add" v-model='newUser.unit'>
                        <!--<option value="">选择小区</option>-->
                        <option v-for="item in unitList_2" :value="item.value" :key="item.value">{{ item.label }}
                        </option>
                    </select>
                </div>
                <div class="user user_type">
                    <div>
                        <img src="../../assets/image/special/icon/star.png" height="12" width="12" alt="">
                        人员类型：
                    </div>
                    <select name="type" id="type" v-model='newUser.type' @change='getCategory'>
                        <option value="">人员类型</option>
                        <option value="1">关爱人员</option>
                        <option value="2">重点人员</option>
                    </select>
                    <select name="category" id="category" v-model='newUser.category'>
                        <option value="">人员类目</option>
                        <option v-for="item in lists" :value="item.value" :key="item.value">{{item.label}}</option>
                    </select>
                </div>
                <div class="user user_remark">
                    <div>
                        <img src="" height="12" width="12" alt="">
                        备注：
                    </div>
                    <textarea name="remark" id="remark" v-model='newUser.remark'></textarea>
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
    import {createNamespacedHelpers} from 'vuex'
    import {imgServerAddr} from '../../config'
    import $ from 'jquery'

    const {mapState, mapMutations, mapActions} = createNamespacedHelpers('special');

    export default {
        name: 'add',
        props: ['newUser'],
        data() {
            return {
                lists: []
            }
        },
        methods: {
            getCategory() {
                if (this.newUser.type === '2') {
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
                        // 	value:3,
                        // 	label:'服刑及涉毒人员'
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
            setTownOriginValue() {
                //区县下拉选择项发生变化时 派出所和小区下拉框不选择任何默认选项 只填充下拉列表
                this.newUser.police = '';
                this.newUser.unit = '';
            },
            setPoliceOriginValue() {
                //派出所下拉选择项发生变化时 小区下拉框不选择任何默认选项 只填充下拉列表
                this.newUser.unit = '';
            },
            getPolice2(selectWord) {
                this.clearTownSelect2();
                selectWord.isAdd = true;
                this.getPolice(selectWord);
                this.setTownOriginValue();
            },
            getCountry2(selectWord) {
                this.clearTownSelect2();
                selectWord.isAdd = true;
                this.getCountry(selectWord);
            },
            getCommunity2(selectWord) {
                this.clearCountrySelect2();
                selectWord.isAdd = true;
                this.getCommunity(selectWord);
            },
            getUnit2(selectWord) {
                this.clearPoliceSelect2();
                selectWord.isAdd = true;
                this.getUnit(selectWord);
                this.setPoliceOriginValue();
            },
            setAddUnitName() {
                this.newUser.unit_name = "";
                let options = document.getElementById('unit_add').options;
                //避免下拉框空数据报错
                if (options.length > 0 && options.selectedIndex !== -1) {
                    let index = options.selectedIndex;
                    let text = options[index].text;
                    this.newUser.unit_name = text;
                }
            },
            ...mapMutations([
                'mshowAdd',
                'mshowNotify',
                'notifyMsg',
                'updateNotify',
                'updateAddErr',
                'clearTownSelect2',
                'clearCountrySelect2',
                'clearCommunitySelect2',
                'clearPoliceSelect2',
                'updateNewUser'
            ]),
            ...mapActions([
                'confirmAdd',
                'getTown',
                'getCountry',
                'getCommunity',
                'getUnit',
                'getPolice'
            ]),
            add() {
                this.setAddUnitName();
                this.confirmAdd(this.newUser);
            },
            awake_upload() {
                document.getElementById('file').click();
            },
            upload() {
                let self = this;
                let imgAddr = imgServerAddr;
                if (imgServerAddr[imgServerAddr.length - 1] === '/') {
                    imgAddr = imgServerAddr.substring(0, imgServerAddr.length - 1);
                }
                let file = document.getElementById('file').files[0];
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
                    image1.onload = function () {
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
                                // console.log(response)
                                self.newUser.image = response.info.md5;
                                self.updateAddErr({value: '上传成功！', error: true});
                                document.getElementById('special_icon').src = image;
                                setTimeout(() => {
                                    self.updateAddErr({value: '', error: false});
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
                'policeList_2',
                'countryList_2',
                'communityList_2',
                'unitList_2',
                'errorMsg',
                'errorShow',
                'defaultTownCode',
                'defaultPoliceCode',
                'defaultTownshipCode',
                'defaultVillageCode',
                'defaultUnitId'
            ])
        },
        mounted() {
            this.getTown(true);
            this.getCategory();
            //下拉框默认选择逻辑
            if (this.townList_2.length > 0) {
                //如果区县下拉框列表不为空，则默认选择第一个选项
                //当区县下拉列表第一个选项为<请选择>时，说明登录账号为 全国级/省级/城市级 账号之中的一种，此时默认选择<请选择>选项
                //当区县不包含<请选择>选项时，说明登录账号为 区县级 乡镇/街道办级 村/社区级 小区级 账号之中的一种
                //此时默认选择第一个选项为权限自动填充的第一个区县，如<万山区>
                this.newUser.town = this.townList_2[0].value;
                //defaultTownCode 即为 同步权限信息获取的 区县 信息
                //如果 defaultTownCode 不为空，则继续根据 defaultTownCode 获取下一级 派出所 下拉列表
                if (this.defaultTownCode !== "" && this.defaultTownCode !== "all") {
                    this.getPolice2(this.newUser);
                }
                //defaultPoliceCode 即为 同步权限信息获取的 派出所 信息
                //如果 defaultPoliceCode 不为空，说明登录账号为 派出所级 小区级 账号之中的一种
                //同时要根据 defaultPoliceCode 获取下一级 村/社区 列表
                //此时 派出所 下拉框 默认选择第一个选项
                if (this.defaultPoliceCode !== "" && this.defaultPoliceCode !== "all") {
                    this.newUser.police = this.policeList_2.length > 0 ? this.policeList_2[0].value : "all";
                    this.getUnit2(this.newUser);
                }
                //根据权限默认选择小区列表
                this.newUser.unit = this.defaultUnitId;
            }
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
            top: 35px;
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
                        border: 1px solid #1a9ee8;
                        color: #fff;
                        padding-left: 3px;
                        background-color: #034d8c;
                    }
                    select {
                        appearance: none;
                        -moz-appearance: none;
                        -webkit-appearance: none;
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
                        width: calc((100% - 147px) / 3);
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
                        resize: none;
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

    .error-msg {
        margin-left: 10px;
        font-size: 16px;
        color: white;
        text-align: center;
    }

</style>