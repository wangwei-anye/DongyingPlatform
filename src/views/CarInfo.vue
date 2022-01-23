<template>
    <div class="user-info-wrap">
        <v-two-header title="车辆信息"/>
        <v-password-modal/>
        <v-username-modal/>
        <v-logout-modal/>
        <div class="body">
            <div class="base-info">
                <h4>基本资料</h4>
                <div class="personal-info clear">
                    <img class="fl" :src="specialCarInfo.car_image || defaultCarPath" alt="车辆图像" @error="showErrorDefault($event, 1)">
                    <div class="info-box fl">
                        <ul class="clear">
                            <h5 class="h5-ml">
                                <span>{{ specialCarInfo.ogn_plate_number }}</span>
                            </h5>
                        </ul>
                        <ul class="clear mg">
                            <li class="fl icon-width type"><i></i>{{ specialCarInfo.ogn_type || "暂无"}}</li>
                            <li class="fl icon-width color"><i></i>{{ specialCarInfo.ogn_color || "暂无"}}</li>
                        </ul>
                        <ul class="clear">
                            <li class="fl icon-width owner">
                                <i></i>
                                {{ specialCarInfo.ogn_owner_name }}
                                <a href="javascript:;" @click="toggleImageShow">详情</a>
                                <div class="poptip-img-content" v-show="imageShow">
                                    <img :src="specialCarBaseInfo.user_image || defaultPersonPath" @error="showErrorDefault($event, 2)"/>
                                </div>
                            </li>
                            <li class="fl icon-width ID"><i></i>{{ specialCarBaseInfo.id_code || "暂无"}}</li>
                            <li class="fl phone">
                                <i></i>
                                <div v-for="(phone, index) in specialCarPhoneInfo" v-if="specialCarPhoneInfo.length > 0">
                                    {{ phone.telephone }}
                                    <a href="javascript:;" @click="updatePhoneShow(index)">详情</a>
                                    <div class="poptip-content" v-show="phone.show">
                                        <h6>{{ phone.telephone }}</h6>
                                        <ul>
                                            <li>
                                                <span>品牌: {{ phone.phone_brand }}</span>&nbsp;&nbsp;&nbsp;
                                                <span>型号: {{ phone.phone_model }}</span>
                                            </li>
                                            <li>IMEI: {{ phone.device_imei }}</li>
                                            <li>MAC：{{ phone.device_mac }}</li>
                                            <li>UUID：{{ phone.device_uuid }}</li>
                                        </ul>
                                    </div>
                                </div>
                                <div v-if="specialCarPhoneInfo.length === 0">
                                    暂无
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <ISpecialCarRecord :plateNum="specialPlateNum"></ISpecialCarRecord>
        </div>
    </div>
</template>

<script>
    import vTwoHeader from '@/components/section/TwoHeader'
    import vPasswordModal from '@/components/section/PasswordModal'
    import vUsernameModal from '@/components/section/UsernameModal'
    import vLogoutModal from '@/components/section/LogoutModal'
    import vActiveSequenceChart from '@/components/chart/ActiveSequenceChart'
    import vKnowledge from '@/views/knowledge'
    import ISpecialCarRecord from '@/components/chart/ISpecialCarRecord'
    import {createNamespacedHelpers} from 'vuex'

    const {mapState, mapGetters, mapMutations, mapActions} = createNamespacedHelpers('search');

    export default {
        data() {
            return {
                imageShow: false,
                defaultPath: require('../assets/image/search_car.png'),
                defaultCarPath: require('../assets/image/search_car_lg.png'),
                defaultPersonPath: require('../assets/image/search_person_lg.png')
            }
        },
        computed: {
            ...mapState([
                'specialPlateNum',
                'specialCarInfo',
                'specialCarPhoneInfo',
                'specialCarBaseInfo'
            ]),
            ...mapGetters([])
        },
        methods: {
            toggleImageShow() {
                this.imageShow = !this.imageShow;
            },
            showErrorDefault: function (event, type) {
                let path = this.defaultCarPath;
                if(type === 2){
                    path = this.defaultPersonPath;
                }
                $(event.target).attr("src", path);
            },
            ...mapActions([]),
            ...mapMutations([
                'updatePhoneShow'
            ])
        },
        created() {
        },
        mounted() {
        },
        watch: {},
        components: {
            vTwoHeader,
            vPasswordModal,
            vUsernameModal,
            vLogoutModal,
            vActiveSequenceChart,
            vKnowledge,
            ISpecialCarRecord
        }
    }
</script>

<style lang="scss" scoped>
    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-button {
        display: none;
    }

    ::-webkit-scrollbar-track {
        border-radius: 2px;
        background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 2px;
        background-color: rgba(70, 207, 228, .3);
    }

    i {
        display: inline-block;
        position: relative;
        margin-right: 9px;
        background-image: url(../assets/image/userInfo/icons.png);
    }

    .user-info-wrap {
        width: 100%;
        height: 100%;
        background: url(../assets/image/userInfo/bg.png) no-repeat;
        .body {
            padding: 20px 28.5px 0;
            height: 990px;
            /*overflow: auto;*/
            .base-info {
                position: relative;
                margin-bottom: 20px;
                padding: 59px 31px 0 33px;
                background: url(../assets/image/userInfo/base_info_bg.png) no-repeat;
                width: 100%;
                height: 373px;
                h4 {
                    position: absolute;
                    top: 7px;
                    left: 44px;
                    font-size: 18px;
                    color: #fff;
                }
                .personal-info {
                    margin-bottom: 30px;
                    padding: 18px 0 0 18px;
                    width: 1799px;
                    height: 294px;
                    img {
                        margin-right: 18px;
                        width: 230px;
                        height: 256px;
                    }

                    .info-box {
                        width: 1532px;
                        height: 256px;
                        font-size: 18px;
                        color: #fff;
                        .h5-ml {
                            margin-left: 8px;
                        }
                        .mg {
                            margin-top: 73px; margin-bottom: 73px;
                        }
                        a {
                            color: #ffda2e;
                        }

                        h5 {
                            margin-bottom: 16px;
                            height: 36px;
                            line-height: 36px;
                            span:first-child {
                                margin-right: 60px;
                                font-size: 36px;
                                color: #fff;
                                font-weight: bold;
                            }
                            i {
                                top: 4px;
                                width: 25px;
                                height: 25px;
                                background-position: -210px -165px;
                            }
                            span:last-child {
                                font-size: 24px;
                                color: white;
                                font-weight: bold;
                            }
                        }
                        ul {
                            margin-bottom: 18px;
                            li {
                                position: relative;
                            }
                        }
                        .first {
                            width: 125px;
                        }
                        .second {
                            width: 160px;
                        }
                        .third {
                            width: 220px;
                        }
                        .one {
                            width: 355px;
                        }
                        .icon-width {
                            width: 260px;
                        }
                        .type i {
                            top: 6px;
                            width: 33px;
                            height: 27px;
                            background-position: -440px -280px;
                        }
                        .color i {
                            top: 6px;
                            width: 33px;
                            height: 29px;
                            background-position: -380px -280px;
                        }
                        .owner i {
                            top: 8px;
                            width: 29px;
                            height: 29px;
                            background-position: -320px -220px;
                        }
                        .birth {
                            i {
                                top: 6px;
                                width: 26px;
                                height: 27px;
                                background-position: -385px -35px;
                            }
                            span {
                                width: 192px;
                            }
                        }
                        .ID i {
                            top: 10px;
                            width: 33px;
                            height: 32px;
                            background-position: -443px -34px;
                        }
                        .marriage i {
                            top: 8px;
                            width: 30px;
                            height: 33px;
                            background-position: -210px -99px;
                        }
                        .party {
                            i {
                                top: 7px;
                                width: 26px;
                                height: 30px;
                                background-position: -264px -99px;
                            }
                            span {
                                width: 120px;
                            }
                        }
                        .education {
                            i {
                                top: 6px;
                                right: 3px;
                                width: 30px;
                                height: 26px;
                                background-position: -322px -101px;
                            }
                            span {
                                width: 190px;
                            }
                        }
                        .phone {
                            position: static;
                            i {
                                top: 11px;
                                margin-right: 5px;
                                width: 33px;
                                height: 32px;
                                background-position: -382px -99px;
                            }
                        }
                        .native {
                            i {
                                top: 8px;
                                width: 25px;
                                height: 31px;
                                background-position: -445px -99px;
                            }
                            span {
                                width: 320px;
                            }
                        }
                        .hometown {
                            width: 376px;
                            i {
                                top: 2px;
                                left: 2px;
                                width: 25px;
                                height: 31px;
                                background-position: -445px -162px;
                            }
                            span {
                                bottom: 6px;
                                width: 350px;
                            }
                        }
                        .address {
                            i {
                                top: 8px;
                                width: 25px;
                                height: 31px;
                                background-position: -385px -162px;
                            }
                            span {
                                width: 430px;
                            }
                        }
                        .company {
                            i {
                                top: 6px;
                                width: 26px;
                                height: 26px;
                                background-position: -324px -164px;
                            }
                            span {
                                width: 315px;
                            }
                        }
                        .position {
                            i {
                                top: 6px;
                                width: 30px;
                                height: 27px;
                                background-position: -262px -164px;
                            }
                            span {
                                width: 550px;
                            }
                        }
                        .hometown {
                            top: 6px;
                            margin-right: 8px;
                        }
                        .phone div {
                            display: inline-block;
                            margin-right: 26px;
                            a {
                                color: #ffda2e;
                            }
                        }
                        .poptip-img-content {
                            position: absolute;
                            bottom: 45px;
                            z-index: 200;
                            border-radius: 10px;
                            margin-left: 70px;
                            padding: 13px;
                            width: 99%;
                            height: 283px;
                            background: rgba(51, 97, 179, .9);
                        }
                        .poptip-img-content:after {
                            position: absolute;
                            bottom: -14px;
                            left: 10%;
                            content: ' ';
                            width: 0;
                            height: 0;
                            border-left: 10px solid transparent;
                            border-right: 10px solid transparent;
                            border-top: 15px solid rgba(51, 97, 179, .9);
                        }
                        .poptip-content {
                            position: absolute;
                            bottom: 82px;
                            z-index: 200;
                            border-radius: 10px;
                            margin-left: 85px;
                            padding: 13px;
                            background: rgba(51, 97, 179, .9);
                        }
                        .poptip-content:after {
                            position: absolute;
                            bottom: -14px;
                            left: 10%;
                            content: ' ';
                            width: 0;
                            height: 0;
                            border-left: 10px solid transparent;
                            border-right: 10px solid transparent;
                            border-top: 15px solid rgba(51, 97, 179, .9);
                        }
                        .phone-one {
                            left: 935px;
                        }
                        .phone-two {
                            left: 1120px;
                        }
                        .poptip-content h6 {
                            font-size: 16px;
                            font-weight: bold;
                        }
                        .brand {
                            margin-right: 10px;
                        }
                        .poptip-content ul {
                            margin-bottom: 0;
                            font-size: 16px;
                        }
                    }
                }
            }
        }
    }
</style>
