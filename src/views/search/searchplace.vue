<template>
    <div class="security">
        <div class="main-content">
            <!-- 表格数据 -->
            <div v-if="HighlightPlaceList && HighlightPlaceList.length > 0">
                <div class="search-count">
                    <label>共查找到</label>&nbsp;&nbsp;&nbsp;<label style="color: white">{{searchPlaceTotal}}</label>&nbsp;&nbsp;&nbsp;<label>条结果</label>
                    <!--<label style="font-size: 17px;">&nbsp;&nbsp;&nbsp;( 温馨提示：将鼠标放入列表文字内容位置，单击可进入相应详情页面 )&nbsp;&nbsp;&nbsp;</label>-->
                </div>
                <div class="table-detail" v-for="item in HighlightPlaceList">
                    <div class="left-top1"></div>
                    <div class="left-top2"></div>
                    <div class="right-top1"></div>
                    <div class="right-top2"></div>
                    <div class="left-bottom1"></div>
                    <div class="left-bottom2"></div>
                    <div class="right-bottom1"></div>
                    <div class="right-bottom2"></div>
                    <div class="detail-container">
                        <div><img :src="item.place_image || defaultPath" class="user-image" @click="showPhoto(item.place_image)" @error="showErrorDefault"></img></div>
                        <ul class="place-ul-name" @click="clickToPlaceDetail(item)">
                            <li v-html="item.name"></li>
                        </ul>
                        <!--<ul class="place-ul">-->
                        <!--</ul>-->
                        <!--<ul class="place-ul">-->
                        <!--</ul>-->
                        <ul>
                            <!--<li><span class="user-info" @click="clickToPlaceDetail(item)">...</span></li>-->
                            <li><img src="../../assets/image/click_to_search_detail.png" class="user-info" @click="clickToPlaceDetail(item)"></img></li>
                        </ul>
                    </div>
                </div>
                <div class='page-container'>
                    <v-pagination :pageSize=5 :total=searchPlaceTotal :pageIndex=searchPlacePageIndex
                                  @toPage='changePage' class="pageBar">
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
        </div>
    </div>
</template>
<script>
    import vPagination from '@/components/Pagination'
    import vSearchBox from '@/components/SearchBox'
    import vButton from '@/components/Button'
    import vImageModal from '@/views/search/ImageModal'
    import Notify from '@/components/SearchNotify'
    import router from '@/router'
    import store from '@/store'
    import {imgServerAddr} from '@/config'
    import * as types from '@/store/mutation_types'
    import $ from 'jquery'
    import {createNamespacedHelpers} from 'vuex'

    const {
        mapGetters,
        mapState,
        mapMutations,
        mapActions
    } = createNamespacedHelpers('search');

    export default {
        name: 'searchPlaceTable',
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
                defaultPath: require('../../assets/image/search_place.png')
            }
        },
        computed: {
            imageStyle: function () {
                if (this.HighlightPlaceList.length > 1) {
                    return {
                        'bottom': this.HighlightPlaceList.length * 138 + 'px'
                    }
                }
            },
            ...mapState([
                'HighlightPlaceList',
                'searchPlaceTotal',
                'searchPlacePageIndex',
                'searchTownCode',
                'searchTownShipCode',
                'searchVillageCode',
                'searchUnitId',
                'preName',
                'showName',
                'showNotify',
                'notifyMsg',
                'dataType'
            ]),
            ...mapGetters([])
        },
        methods: {
            clickToPlaceDetail: function (place) {
                this.updateSearchTownCode(place.town_code || "");
                this.updateSearchTownShipCode(place.township_code || "");
                this.updateSearchVillageCode(place.village_code || "");
                this.updateSearchUnitId(place.unit_id || "");
                this.updatePreName(place.preName);
                this.updateShowName(place.showName);
                if(!this.searchTownCode && !this.searchTownShipCode && !this.searchVillageCode && !this.searchUnitId){
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
                this.updateSearchPlacePageIndex(currentPage);
                this.getSearchPlaceList();
            },
            showPhoto: function (picUrl) {
                this.updateDataType(3);
                if (picUrl) {
                    this.imageUrl = imgServerAddr + '/' + picUrl + "?p=0";
                    if(picUrl.indexOf("http") !== -1){
                        this.imageUrl = picUrl;
                    }
                    this.showImage = true;
                }
                //this.imageUrl = "11111.png";
                //this.showImage = true;
            },
            closeImage: function () {
                this.showImage = !this.showImage;
            },
            showErrorDefault: function (event) {
                $(event.target).attr("src", this.defaultPath);
            },
            ...mapMutations([
                'updateSearchPlacePageIndex',
                'updateSearchTownCode',
                'updateSearchTownShipCode',
                'updateSearchVillageCode',
                'updateSearchUnitId',
                'updatePreName',
                'updateShowName',
                'updateShowNotify',
                'updateNotifyMsg',
                'updateDataType'
            ]),
            ...mapActions([
                'updateUserId',
                'getSearchPlaceList'
            ])
        },
        mounted: function () {
            //this.getSearchPlaceList();
        }
    }
</script>
<style lang="scss" scoped>
    .main-content {
        padding: 20px;
        background: rgba(15, 145, 255, .2);
        .search-image {
            position: relative;
            bottom: 130px;
            left: 16%;
            z-index: 99999;
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
                background-color: transparent;
                cursor: pointer;
                right: 100px;
            }
            .empty-info {
                width: 100%;
                text-align: center;
                margin: 0 auto;
            }
            .place-ul-name {
                margin-left: 100px;
                margin-right: 50px;
                width:79%;
                /*width:73%;*/
            }
            .place-ul {
                margin-left: 50px;
                margin-right: 50px;
                float: right;
                width: 11%;
            }
        }
    }
    .table-detail:hover {
        background-color: rgba(20,123,188,0.85);
    }

    .page-container {
        text-align: center;
        padding-top: 0px;
    }
</style>