<template>
    <div class="security">
        <div class="main-content">
            <!-- 表格数据 -->
            <div v-if="HighlightAllList && HighlightAllList.length > 0">
                <div class="search-count">
                    <label>共查找到</label>&nbsp;&nbsp;&nbsp;<label style="color: white">{{searchAllTotal}}</label>&nbsp;&nbsp;&nbsp;<label>条结果</label>
                    <!--<label style="font-size: 17px;">&nbsp;&nbsp;&nbsp;( 温馨提示：将鼠标放入列表文字内容位置，单击可进入相应详情页面 )&nbsp;&nbsp;&nbsp;</label>-->
                </div>
                <div class="table-detail" v-for="item in HighlightAllList">
                    <div class="left-top1"></div>
                    <div class="left-top2"></div>
                    <div class="right-top1"></div>
                    <!--<div :class="item.typeCls"></div>--><!--显示右上角三角角标-->
                    <div class="right-top2"></div>
                    <div class="left-bottom1"></div>
                    <div class="left-bottom2"></div>
                    <div class="right-bottom1"></div>
                    <div class="right-bottom2"></div>
                    <div class="detail-container" v-if="item.data_type === 'person'">
                        <div><img :src="item.face_image || defaultPersonPath" class="user-image"
                                  @click="showPhoto(item.face_image, 1)" @error="showErrorDefault($event, 1)"></img>
                        </div>
                        <ul class="person-ul-idcode" @click="clickToUserDetail(item)">
                            <li><label v-bind:class="{isBlack: item.isblack}" class="cursor-style">身份证号码</label></li>
                            <li v-html="item.id_code"></li>
                        </ul>
                        <ul class="person-ul-name" @click="clickToUserDetail(item)">
                            <li><label v-bind:class="{isBlack: item.isblack}" class="cursor-style">姓名</label></li>
                            <li v-html="item.name"></li>
                        </ul>
                        <ul class="person-ul-gender" @click="clickToUserDetail(item)">
                            <li><label v-bind:class="{isBlack: item.isblack}" class="cursor-style">性别</label></li>
                            <li v-html="item.gender"></li>
                        </ul>
                        <ul class="person-ul" @click="clickToUserDetail(item)">
                            <li><label v-bind:class="{isBlack: item.isblack}" class="cursor-style">人员类型</label></li>
                            <li><label v-bind:class="{isBlack: item.isblack}" class="cursor-style">{{ item.person_type
                                }}</label></li>
                        </ul>
                        <ul class="person-ul" @click="clickToUserDetail(item)">
                            <li><label v-bind:class="{isBlack: item.isblack}" class="cursor-style">电话</label></li>
                            <li v-html="item.telephone"></li>
                        </ul>
                        <ul>
                            <!--<li><span class="user-info" @click="clickToUserDetail(item.user_id)">...</span></li>-->
                            <li><img src="../../assets/image/click_to_search_detail.png" class="user-info"
                                     @click="clickToUserDetail(item)"></img></li>
                        </ul>
                    </div>
                    <div class="detail-container" v-else-if="item.data_type === 'car'">
                        <div><img :src="item.car_image || defaultCarPath" class="user-image"
                                  @click="showPhoto(item.car_image, 2)" @error="showErrorDefault($event, 2)"></img>
                        </div>
                        <ul class="car-ul-platenumber" @click="clickToCarDetail(item)">
                            <li><label class="cursor-style">车牌号</label></li>
                            <li v-html="item.plate_number"></li>
                        </ul>
                        <ul class="car-ul-type" @click="clickToCarDetail(item)">
                            <li><label class="cursor-style">车型</label></li>
                            <li v-html="item.type"></li>
                        </ul>
                        <ul class="car-ul-color" @click="clickToCarDetail(item)">
                            <li><label class="cursor-style">车颜色</label></li>
                            <li v-html="item.color"></li>
                        </ul>
                        <ul class="car-ul" @click="clickToCarDetail(item)">
                            <li><label class="cursor-style">车主姓名</label></li>
                            <li v-html="item.owner_name"></li>
                        </ul>
                        <ul class="car-ul">
                        </ul>
                        <ul>
                            <!--<li><span class="user-info" @click="clickToCarDetail(item.plate_number)">...</span></li>-->
                            <li><img src="../../assets/image/click_to_search_detail.png" class="user-info"
                                     @click="clickToCarDetail(item)"></img></li>
                        </ul>
                    </div>
                    <div class="detail-container" v-else-if="item.data_type === 'place'">
                        <div><img :src="item.place_image || defaultPlacePath" class="user-image"
                                  @click="showPhoto(item.place_image, 3)"
                                  @error="showErrorDefault($event, 3)"></img></div>
                        <ul class="place-ul-name" @click="clickToPlaceDetail(item)">
                            <li v-html="item.name"></li>
                        </ul>
                        <!--<ul class="place-ul">-->
                        <!--</ul>-->
                        <!--<ul class="place-ul">-->
                        <!--</ul>-->
                        <ul>
                            <!--<li><span class="user-info" @click="clickToPlaceDetail(item)">...</span></li>-->
                            <li><img src="../../assets/image/click_to_search_detail.png" class="user-info"
                                     @click="clickToPlaceDetail(item)"></img></li>
                        </ul>
                    </div>
                </div>
                <div class='page-container'>
                    <v-pagination :pageSize=5 :total=searchAllTotal :pageIndex=searchAllPageIndex @toPage='changePage'
                                  class="pageBar">
                    </v-pagination>
                </div>
            </div>
            <div v-else>
                <div class="table-detail">
                    <div class="left-top1"></div>
                    <div class="left-top2"></div>
                    <div class="right-top1"></div>
                    <div class="right-top2"></div>
                    <div class="left-bottom1"></div>
                    <div class="left-bottom2"></div>
                    <div class="right-bottom1"></div>
                    <div class="right-bottom2"></div>
                    <div class="detail-container">
                        <ul class="empty-info">
                            <li><span>暂无数据</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <v-ImageModal class="search-image" :style="imageStyle" v-if="showImage" :photoUrl=imageUrl
                          @close='closeImage'></v-ImageModal>
            <Notify class="user-info-notify" v-show='showNotify' :style="notifyStyle"></Notify>
        </div>
    </div>
</template>
<script>
    import vPagination from '@/components/Pagination'
    import vSearchBox from '@/components/SearchBox'
    import vImageModal from '@/views/search/ImageModal'
    import vButton from '@/components/Button'
    import Notify from '@/components/SearchNotify'
    import router from '@/router'
    import {imgServerAddr} from '@/config'
    import {createNamespacedHelpers} from 'vuex'
    import {hideInfo} from '../../utils/searchUtil'
    import store from '@/store'
    import * as types from '@/store/mutation_types'
    import axios from '@/utils/http.js'
    import $ from 'jquery'

    const {
        mapGetters,
        mapState,
        mapMutations,
        mapActions
    } = createNamespacedHelpers('search');

    export default {
        name: 'searchAllTable',
        components: {
            vPagination,
            vSearchBox,
            vButton,
            vImageModal,
            Notify
        },
        data() {
            return {
                showImage: false,
                imageUrl: '',
                defaultPath: require('../../assets/image/search_default.png'),
                defaultPersonPath: require('../../assets/image/search_person.png'),
                defaultCarPath: require('../../assets/image/search_car.png'),
                defaultPlacePath: require('../../assets/image/search_place.png'),
                type: 1
                //showPlaceImage: false
            }
        },
        computed: {
            imageStyle: function () {
                if (this.HighlightAllList.length > 1) {
                    return {
                        'bottom': this.HighlightAllList.length * 138 + 'px'
                    }
                }
            },
            notifyStyle: function () {
                if (this.HighlightAllList.length > 1) {
                    return {
                        //'bottom': this.HighlightAllList.length * 80 + 'px'
                    }
                }
            },
            ...mapState([
                'HighlightAllList',
                'searchAllTotal',
                'searchAllPageIndex',
                'noResult',
                'preName',
                'showName',
                'showNotify',
                'notifyMsg',
                'specialPlateNum',
                'specialCarInfo',
                'specialCarBaseInfo',
                'dataType'
            ]),
            ...mapGetters([])
        },
        methods: {
            clickToUserDetail: function (person) {
                if (!person.user_id) {
                    this.updateNotifyMsg("无更多详细信息！");
                    this.updateShowNotify(true);
                    setTimeout(() => {
                        this.updateShowNotify(false);
                    }, 2000);
                    return;
                }
                this.updateUserInfo({
                    user_id: person.user_id,
                    user_name: person.ogn_user_name
                });
                router.push({
                    path: '/userInfo'
                })
            },
            clickToCarDetail: function (car) {
                console.log("ogn_plate_number" + car.ogn_plate_number);
                if(!car.ogn_plate_number){
                    this.updateNotifyMsg("无更多详细信息！");
                    this.updateShowNotify(true);
                    setTimeout(() => {
                        this.updateShowNotify(false);
                    }, 2000);
                    return;
                }
                let isHide = true;
                let permissions = this.$store.state.global.accountInfo.func_permissions;
                let tempArr = permissions.split(',');
                for (let p = 0; p < tempArr.length; p++) {
                    if(tempArr[p] == '3:8'){
                        isHide = false;
                    }
                }
                this.updateSpecialPlateNum(car.ogn_plate_number);
                this.updateSpecialCarInfo(car);
                this.updateSpecialCarPhoneInfo([]);
                this.updateSpecialCarBaseInfo({
                    user_image: "",
                    id_code: hideInfo(car.ogn_id_code, 1, isHide) || ""
                });
                if(car.ogn_telephone){
                    console.log("有telephone");
                    axios.get('/search/user/searchUserDetail.do?telephone=' + car.ogn_telephone + "&user_name=" + car.ogn_owner_name + "&isHide=" + isHide, {}).then(response => {
                        let baseInfo = response.data.data;
                        if(baseInfo){
                            this.updateSpecialCarBaseInfo({
                                user_image: baseInfo.user_image || "",
                                id_code: baseInfo.id_code || hideInfo(car.ogn_id_code, 1, isHide) || "",
                                telephone: baseInfo.telephone || hideInfo(car.ogn_telephone, 2, isHide) || ""
                            });
                        }
                    }).catch(err => {
                        console.log('获取车主基本信息失败');
                    })
                }
                if(car.user_id){
                    console.log("有用户ID");
                    axios.get('/search/user/searchUserPhone.do?user_id=' + car.user_id + "&isHide=" + isHide, {}).then(response => {
                        let phoneInfo = response.data.data.phoneInfo;
                        if(phoneInfo && phoneInfo.length > 0){
                            phoneInfo.map(item => item.show = false);
                            phoneInfo = phoneInfo.slice(0, 5);//最多显示5条电话信息
                            this.updateSpecialCarPhoneInfo(phoneInfo);
                        }else{
                            let phoneArr = [{
                                "device_uuid": "暂无",
                                "phone_brand": "暂无",
                                "telephone": this.specialCarBaseInfo.telephone || hideInfo(car.ogn_telephone, 2, isHide),
                                "device_mac": "暂无",
                                "device_imei": "暂无",
                                "phone_model": "暂无",
                                "show": false
                            }];
                            if(!car.ogn_telephone){
                                phoneArr = [];
                            }
                            this.updateSpecialCarPhoneInfo(phoneArr);
                        }
                    }).catch(err => {
                        console.log('获取车主电话数据失败');
                    })
                }
                router.push({
                    path: '/carInfo'
                });
            },
            clickToPlaceDetail: function (place) {
                this.updateSearchTownCode(place.town_code || "");
                this.updateSearchTownShipCode(place.township_code || "");
                this.updateSearchVillageCode(place.village_code || "");
                this.updateSearchUnitId(place.unit_id || "");
                this.updatePreName(place.preName);
                this.updateShowName(place.showName);
                if (!this.searchTownCode && !this.searchTownShipCode && !this.searchVillageCode && !this.searchUnitId) {
                    store.commit('platform/' + types.SET_CURRENT_TOWN, "all");
                    store.commit('platform/' + types.SET_CURRENT_TOWNSHIP, "all");
                    store.commit('platform/' + types.SET_CURRENT_VILLAGE, "all");
                    store.commit('platform/' + types.SET_CURRENT_UNIT, "all");
                }
                if (place.unit_id) {
                    router.push({
                        path: '/zonesearch'
                    });
                } else {
                    router.push({
                        path: '/platformsearch'
                    });
                }
            },
            changePage: function (currentPage) {
                this.updateSearchAllPageIndex(currentPage);
                this.getSearchAllList();
            },
            showPhoto: function (picUrl, type) {
                this.updateDataType(type);
                if (picUrl) {
                    this.imageUrl = imgServerAddr + '/' + picUrl + "?p=0";
                    if (picUrl.indexOf("http") !== -1) {
                        this.imageUrl = picUrl;
                    }
                    this.showImage = true;
                }
            },
            closeImage: function () {
                if (this.showImage) {
                    this.showImage = !this.showImage;
                }
            },
            showErrorDefault: function (event, opt) {
                let path = this.defaultPersonPath;
                switch (opt){
                    case 1:
                        path = this.defaultPersonPath;
                        break;
                    case 2:
                        path = this.defaultCarPath;
                        break;
                    case 3:
                        path = this.defaultPlacePath;
                        break;
                    default:
                        path = this.defaultPersonPath;
                        break;
                }
                $(event.target).attr("src", path);
            },
            ...mapMutations([
                'updateSearchAllPageIndex',
                'updateSearchTownCode',
                'updateSearchTownShipCode',
                'updateSearchVillageCode',
                'updateSearchUnitId',
                'updateNoResult',
                'updatePreName',
                'updateShowName',
                'updateShowNotify',
                'updateNotifyMsg',
                'updateSpecialPlateNum',
                'updateSpecialCarInfo',
                'updateSpecialCarPhoneInfo',
                'updateSpecialCarBaseInfo',
                'updateDataType'
            ]),
            ...mapActions([
                'updateUserInfo',
                'getSearchAllList'
            ])
        },
        mounted: function () {
            //针对刷新的操作
            if (!this.HighlightAllList || this.HighlightAllList.length === 0) {
                this.getSearchAllList();
            }
        }
    }
</script>
<style lang="scss" scoped>
    .main-content {
        padding: 20px;
        background: rgba(15, 145, 255, .2);
        .cursor-style {
            cursor: pointer;
        }
        .search-image {
            position: relative;
            bottom: 130px;
            left: 16%;
            z-index: 99999;
        }
        .user-info-notify {
            position: absolute;
            /*bottom: 160px;*/
            top: 150px;
            left: 35%;
            z-index: 999999;
        }
        .search-container {
            width: 100%;
            height: 48px;
            margin-bottom: 20px;
            color: #3fa7ff;
            font-size: 18px;
            display: flex;
            align-items: center;
            .v-select {
                width: 160px;
                margin-right: 30px;
            }
            .v-btn {
                margin-left: 50px;
            }
            .addstaff {
                display: inline-flex;
                flex: 1;
                justify-content: flex-end;
                img {
                    cursor: pointer;
                }
            }
        }
    }

    .search-count {
        color: #1cb1ff;
        font-size: 18px;
        display: inline-flex;
        align-items: center;
        width: 100%;
        margin-bottom: 20px;
        i {
            color: #ffda2e;
            font-size: 36px;
        }
        b {
            font-size: 24px;
            margin-left: 160px;
            margin-right: 15px;
            color: #1cb1ff;
        }
    }

    .table-detail {
        margin-bottom: 20px;
        padding: 5px 5px;
        position: relative;
        border-top: 1px solid #009dff;
        border-bottom: 1px solid #009dff;
        .left-top1 {
            width: 10px;
            height: 5px;
            position: absolute;
            top: -3px;
            left: 0;
            background-color: #1cb1ff;
        }
        .left-top2 {
            width: 5px;
            height: 10px;
            position: absolute;
            top: 0;
            left: 0;
            background-color: #1cb1ff;
        }
        .right-top1 {
            width: 10px;
            height: 5px;
            position: absolute;
            top: -3px;
            right: 0;
            background-color: #1cb1ff;
        }
        .right-top2 {
            width: 5px;
            height: 10px;
            position: absolute;
            top: 0;
            right: 0;
            background-color: #1cb1ff;
        }
        .right-top2-person {
            width: 30px;
            height: 30px;
            position: absolute;
            top: 0;
            right: 0;
            /*background-color: #1cb1ff;*/
            /*background: url(../../assets/image/rt.png) no-repeat;*/
            border-top: 40px solid green;
            border-left: 40px solid transparent;
        }
        .right-top2-car {
            width: 30px;
            height: 30px;
            position: absolute;
            top: 0;
            right: 0;
            /*background-color: #1cb1ff;*/
            /*background: url(../../assets/image/rt.png) no-repeat;*/
            border-top: 40px solid dodgerblue;
            border-left: 40px solid transparent;
        }
        .right-top2-place {
            width: 30px;
            height: 30px;
            position: absolute;
            top: 0;
            right: 0;
            /*background-color: #1cb1ff;*/
            /*background: url(../../assets/image/rt.png) no-repeat;*/
            border-top: 40px solid yellowgreen;
            border-left: 40px solid transparent;
        }
        .left-bottom1 {
            width: 10px;
            height: 5px;
            position: absolute;
            bottom: -3px;
            left: 0;
            background-color: #1cb1ff;
        }
        .left-bottom2 {
            width: 5px;
            height: 10px;
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: #1cb1ff;
        }
        .right-bottom1 {
            width: 10px;
            height: 5px;
            position: absolute;
            bottom: -3px;
            right: 0;
            background-color: #1cb1ff;
        }
        .right-bottom2 {
            width: 5px;
            height: 10px;
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: #1cb1ff;
        }
        .detail-container {
            background: linear-gradient(0deg, rgba(0, 165, 255, .2), rgba(23, 87, 166, .2));
            padding: 20px 60px;
            display: inline-flex;
            align-items: center;

            display: -ms-inline-flexbox;
            -ms-flex-align: center;

            color: #fff;
            font-size: 18px;
            /*font-weight: bold;*/
            width: 100%;
            i {
                color: #ffda2e;
                font-size: 36px;
            }
            b {
                font-size: 24px;
                margin-left: 160px;
                margin-right: 15px;
                color: #1cb1ff;
            }
            .user-image {
                width: 60px;
                height: 60px;
                cursor: pointer
            }
            .user-info {
                width: 70px;
                height: 24px;
                margin-top: 5px;
                /*background-color: transparent;*/
                cursor: pointer
            }
            .empty-info {
                width: 100%;
                text-align: center;
                margin: 0 auto;
            }
            .person-ul-idcode {
                margin-left: 100px;
                margin-right: 50px;
                width: 13%;
                .isBlack {
                    color: red
                }
            }
            .person-ul {
                margin-left: 50px;
                margin-right: 50px;
                width: 11%;
                .isBlack {
                    color: red
                }
            }
            .person-ul-name {
                margin-left: 50px;
                margin-right: 50px;
                width: 13%;
                .isBlack {
                    color: red
                }
            }
            .person-ul-gender {
                margin-left: 50px;
                margin-right: 50px;
                width: 9%;
                .isBlack {
                    color: red
                }
            }
            .car-ul-platenumber {
                margin-left: 100px;
                margin-right: 50px;
                width: 13%
            }
            .car-ul-type {
                margin-left: 50px;
                margin-right: 50px;
                width: 13%
            }
            .car-ul-color {
                margin-left: 50px;
                margin-right: 50px;
                width: 9%
            }
            .car-ul {
                margin-left: 50px;
                margin-right: 50px;
                width: 11%
            }
            .place-ul-name {
                margin-left: 100px;
                margin-right: 50px;
                width: 79%
            }
            .place-ul {
                margin-left: 50px;
                margin-right: 50px;
                width: 11%
            }
        }
        .detail-container:hover {
            background-color: rgba(20, 123, 188, 0.85);
        }
    }

    .page-container {
        text-align: center;
        padding-top: 0px;
        margin-top: 30px;
        margin-bottom: 10px;
    }
</style>