<!-- 登录页面 -->
<!-- Author: Tim -->
<template>
    <div class="video-container" @mouseenter="commonPlay">
        <div class="filter">
            <div class="login-root" @keyup.enter="getPublicKeyToLogin">
                <div class="login-title"></div>
                <div class="login-wrap" @mouseenter="commonPlay">
                    <label class="passport">
                        <i :class="{focus: passportFocus}"></i>
                        <input type="text" name="passport" :value="passport" @input="passPortInput($event.target.value)"
                               autocomplete="off" @focus="passPortFocus" @blur="passPortBlur" placeholder="请输入账号"/>
                        <i class="line" :class="{focus: passportFocus}"></i>
                    </label>
                    <label class="password">
                        <i :class="{focus: passwordFocus}"></i>
                        <input type="password" :value="password" @input="updatePassword($event.target.value)"
                               @focus="passWordFocus" @blur="passWordBlur" placeholder="请输入密码"/>
                        <i class="line" :class="{focus: passwordFocus}"></i>
                    </label>
                    <!--<label class="verify-code">
                      <i :class="{focus: verifyCodeFocus}"></i>
                      <input type="text" :value="verifyCode" @input="updateVerifyCode($event.target.value)" @focus="verifyCodeFocus=true" @blur="verifyCodeFocus=false" placeholder="请输入验证码" />
                      <i class="line" :class="{focus: verifyCodeFocus}"></i>
                    </label>
                    <img :src="verifyCodeUrl" @click="updateVerifyCodeUrl" class="verify-img" />-->
                    <span class="error-msg" v-show="error">{{ errorMsg }}</span>
                    <div class="submitDiv">
                        <Button class="submit mg1" @click="getPublicKeyToLogin">登录</Button>
                        <Button class="submit mg2">证书登录</Button>
                    </div>
                </div>
            </div>
        </div>
        <video autoplay loop autobuffer>
            <source src="static/login/c.mp4" type="video/mp4"/>
            浏览器不支持 video 标签，建议升级浏览器。
        </video>
    </div>
</template>

<style lang="scss" scoped>
    .video-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .filter {
            /*视频背景 蒙版*/
            position: absolute;
            z-index: 1;
            background: rgba(21, 61, 121, .18);
            width: 100%;
            height: 100%;
        }
        video {
            position: absolute;
            z-index: 0;
            min-width: 100%;
            min-height: 100%;
            width: 100%;
            background: url(../assets/image/login/login_bg_3.jpg) no-repeat;
            background-size: 100% 100%;
        }
    }

    i {
        position: absolute;
        top: -3px;
        left: 200px;
        width: 100px;
        height: 102px;
        background: url(../assets/image/login/icons.png) no-repeat;
    }

    .line {
        left: 261px !important;
        top: 50px !important;
        width: 613px;
        height: 51px;
        background-position: -21px -306px !important;
    }

    .line.focus {
        background-position: -21px -388px !important;
    }

    input {
        margin-left: 75px;
        border: none;
        width: 527px;
        height: 60px;
        line-height: 60px;
        background-color: transparent !important;
        outline: none;
        color: #fff;
    }

    ::-webkit-input-placeholder {
        color: rgba(28, 177, 255, .2);
    }

    .login-root {
        font-size: 26px;
        > .login-title {
            position: absolute;
            top: 202px;
            left: 762px;
            width: 1013px;
            height: 150px;
            background: url(../assets/image/login/police_title_1.png) no-repeat;
        }
        > .login-wrap {
            position: absolute;
            top: 305px;
            left: 762px;
            width: 1013px;
            height: 544px;
            background: url(../assets/image/login/wrap_bg.png) no-repeat;
            label, .submit {
                display: block;
            }
            label {
                position: relative;
                height: 90px;
                line-height: 90px;
                text-align: center;
            }
            .passport {
                margin: 115px 0 12px 0;
                i {
                    background-position: -12px -8px;
                }
                i.focus {
                    background-position: -12px -155px;
                }
            }
            .password {
                margin-bottom: 13px;
                i {
                    background-position: -121px -8px;
                }
                i.focus {
                    background-position: -121px -155px;
                }
            }
            .verify-code {
                margin-bottom: 59px;
                input {
                    margin-right: 155px;
                    width: 372px;
                }
                i {
                    background-position: -240px -8px;
                }
                i.focus {
                    background-position: -240px -155px;
                }
            }
            .verify-img {
                position: absolute;
                bottom: 208px;
                right: 214px;
                width: 156px;
                height: 53px;
                cursor: pointer;
            }
            .error-msg {
                position: absolute;
                bottom: 193px;
                left: 0;
                width: 100%;
                font-size: 16px;
                color: red;
                text-align: center;
            }
            .submitDiv {
                display: flex;
                margin-top: 75px;
                .submit {
                    margin: 0 auto;
                    border: none;
                    width: 245px;
                    height: 66px;
                    color: #fff;
                    font-size: 26px;
                    background-color: rgba(28, 177, 255, .57);
                    border-radius: 6px;
                }
                .mg1 {
                    margin-left: 235px;
                    margin-right: 0px;
                }
                .mg2 {
                    margin-left: 82px;
                }
            }
        }
    }

    .login-img {
        position: relative;
        width: 1920px;
        height: 1080px;
        background: url(../assets/image/login/login_bg.png) no-repeat;
    }
</style>

<script>
    import {createNamespacedHelpers} from 'vuex'
    import $ from 'jquery'

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('login');

    export default {
        data() {
            return {
                passportFocus: true,
                passwordFocus: false,
                verifyCodeFocus: false
            }
        },
        computed: {
            ...mapGetters([
                'verifyCodeUrl'
            ]),
            ...mapState([
                'passport',
                'password',
                'verifyCode',
                'errorMsg',
                'error'
            ])
        },
        methods: {
            ...mapActions([
                'getPublicKeyToLogin'
            ]),
            ...mapMutations({
                updateVerifyCodeUrl: 'UPDATE_VERIFYCODEURL',
                updatePassword: 'UPDATE_PASSWORD',
                updatePassport: 'UPDATE_PASSPORT',
                updateVerifyCode: 'UPDATE_VERIFYCODE'
            }),
            commonPlay() {
                try {
                    console.log("commonPlay");
                    let ua = window.navigator.userAgent;
                    let vd = $("video")[0];
                    /*
                    修复谷歌浏览器首次加载登录页面视频背景无法自动播放的问题
                    其他浏览器首次加载均可自动播放背景视频
                     */
                    if (vd && vd.paused && ua.indexOf("Chrome") !== -1) {
                        vd.play();
                    }
                } catch (e) {
                    console.log(e);
                }
            },
            passPortFocus() {
                console.log("passPortFocus");
                this.passportFocus = true;
                this.commonPlay();
            },
            passPortBlur() {
                console.log("passPortBlur");
                this.passportFocus = false;
                this.commonPlay();
            },
            passWordFocus() {
                console.log("passWordFocus");
                this.passwordFocus = true;
                this.commonPlay();
            },
            passWordBlur() {
                console.log("passWordBlur");
                this.passwordFocus = false;
                this.commonPlay();
            },
            passPortInput(val) {
                console.log("passPortInput");
                this.updatePassport(val);
                this.commonPlay();
            }
        },
        created() {
            //this.updateVerifyCodeUrl();
        },
        mounted: function () {
            console.log("mounted");
        }
    }
</script>