<template>
  <div class="two-header">
    <div class="two-header__back" @click="back"></div>
    <div class="two-header__tit">{{ title }}</div>
    <div class="two-header__opt">
        <div class="search-form" v-show="headerShowSearch">
            <i @click="closeSearch"></i>
            <input type="text" v-model="headerKeyWord" @keyup.enter="search" placeholder=" 姓名 / 电话 / 身份证 / 车牌号  / 区县 / 乡镇 / 社区 / 小区"/>
       </div>
        <img class="icon-search" @click="search" src="../../assets/image/header-icon-search.png" />
      <router-link :to="toPlatformOrZone" class="icon-home" title="主页"></router-link>
      <a class="icon-user" title="个人信息" ref="user" @click.self="showPop">
        <div class="info-tip" v-show="userPopVisible">
					<ul>
            <li class="rolename" :title="global.accountInfo.rolePermission ? global.accountInfo.rolePermission.rolename : ' '">
              {{ global.accountInfo.rolePermission ? global.accountInfo.rolePermission.rolename : ' '}}
            </li>
            <li class="account">
              <div class="omit" :title="global.accountInfo.account">账号：{{ global.accountInfo.account }}</div>
              <span @click="modifyPasswordModal(true)">修改密码</span>
            </li>
            <li class="name">
              <div class="omit" :title="global.accountInfo.username">用户名：{{ global.accountInfo.username }}</div>
              <i class="edit" @click="modifyUsernameModal(true)"></i>
            </li>
            <li class="logOut" @click="modifyLogoutModal(true)">退出</li>
          </ul>
        </div>
      </a>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import router from '@/router'
import store from '@/store'
import * as types from '@/store/mutation_types'
import searchAPI from '@/API/search'
import {getCommonSearchAllList} from '@/utils/searchUtil'

const { mapMutations, mapState } = createNamespacedHelpers('platform');

export default {
  name: 'two-header',
  props: {
    title: {
      type: String,
      default: 'oeasy'
    }
  },
  data () {
    return {
      userPopVisible: false,
      headerShowSearch: this.showSearch,
      headerKeyWord: this.keyWord,
      firstSearchSubmit: true
    }
  },
  computed: {
    global() {
      return this.$store.state.global;
    },
    toPlatformOrZone() {//确定是跳社区平台首页还是小区平台首页
        let toPath = "/platform";
        if(this.$store.state.platform.currentUnitId && this.$store.state.platform.currentUnitId !== "all"){
            toPath = "/zone";
        }
        return toPath;
    },
    ...mapState([
        'showSearch',
        'keyWord'
    ])
  },
  methods: {
    showPop () {
      this.userPopVisible = true;
    },
    back () {
      this.$router.go(-1);
    },
    mdfPwd () {
      this.modifyPasswordModal(true);
      this.userPopVisible = false;
    },
    mdfUsername () {
      this.modifyUsernameModal(true);
      this.userPopVisible = false;
    },
    mdfLogout () {
      this.modifyLogoutModal(true);
      this.userPopVisible = false;
    },
    closeSearch() {
          this.headerShowSearch = false;
    },
    search() {//全局搜索
        if(this.headerShowSearch && !this.headerKeyWord){
            this.$Message.warning('您输入的检索内容为空，请重新输入！');
            return;
        }
        let self = this;
        let hSearch = this.headerShowSearch;
        let hKey = this.headerKeyWord;
        let key = this.keyWord;
        //通过firstSearchSubmit 防止用户快速多次提交搜索 引起路由地址错误
        if (this.headerShowSearch && this.firstSearchSubmit) {
            this.firstSearchSubmit = false;
            let params = {
                "keywords": this.headerKeyWord || "",
                "pageNo": 1,
                "pageSize": 5
            };
            ////////////////////////
            searchAPI.getSearchAllList(params,
                response => {
                    // console.log(response);
                    store.commit('search/updateSearchAllList', []);
                    store.commit('search/updateHighlightAllList', []);
                    store.commit('search/updateSearchAllTotal', 0);

                    if (response !== null && response.data !== null && response.data.code === "0000" && response.data.data !== null && response.data.data.items !== null && response.data.data.items.length > 0) {
                        let searchAllList = response.data.data.items;
                        //处理界面展示数据
                        let allList = getCommonSearchAllList(searchAllList, hSearch, hKey);//不要用this.headerShowSearch 和 this.headerKeyWord 注意this
                        //处理界面展示数据
                        store.commit('search/updateHighlightAllList', allList);
                        store.commit('search/updateSearchAllTotal', response.data.data.totalCount);
                        console.log("有搜索结果");
                        if(hKey !== key){
                            //如果此处的检索内容未发生改变 则不用跳到全部页 只用跳到之前的tab页
                            store.commit("search/setDefaultTab");
                        }
                        this.toPath('index/search');
                        self.firstSearchSubmit = true;
                    } else {
                        store.commit('search/updateNoResult', true);
                        self.$Message.warning('无检索结果，请确认输入内容是否有误！');
                        self.firstSearchSubmit = true;
                        return;
                    }
                },
                error => {
                    self.firstSearchSubmit = true;
                    console.log(error);
                }
            );
            ////////////////////////
        } else {
            this.headerShowSearch = true;
            this.headerKeyWord = this.keyWord;
        }
        this.updateShowSearch(true);
        this.updateKeyWord(this.headerKeyWord);
        store.commit('search/updateSearchPersonPageIndex', 1);
        store.commit('search/updateSearchCarPageIndex', 1);
        store.commit('search/updateSearchPlacePageIndex', 1);
        store.commit('search/updateSearchAllPageIndex', 1);
        switch (this.$store.state.search.currentTab){
            case "0":
                //this.getSearchAllList();
                store.dispatch('search/getSearchAllList');
                break;
            case "2":
                //this.getSearchPersonList();
                store.dispatch('search/getSearchPersonList');
                break;
            case "3":
                //this.getSearchCarList();
                store.dispatch('search/getSearchCarList');
                break;
            case "4":
                //this.getSearchPlaceList();
                store.dispatch('search/getSearchPlaceList');
                break;
            default:
                //this.getSearchAllList();
                store.dispatch('search/getSearchAllList');
                break;
        }
    },
    toPath: function(path) {
        router.push(path);
    },
    ...mapMutations({
      modifyPasswordModal: 'MODIFY_PASSWORD_MODAL',
      modifyUsernameModal: 'MODIFY_USERNAME_MODAL',
      modifyLogoutModal: 'MODIFY_LOGOUT_MODAL',
      updateShowSearch: 'UPDATE_SHOW_SEARCH',
      updateKeyWord: 'UPDATE_KEY_WORD'
    })
  },
  mounted () {
    const el = this.$refs.user;
    document.addEventListener('click', (e) => {
      if (el.contains(e.target)){
        return;
      } else {
        this.userPopVisible = false;
      }
    });
    if(this.keyWord) {
        this.headerShowSearch = true;
    }
    if(this.headerKeyWord !== this.keyWord){
        this.headerKeyWord = this.keyWord;
    }
  }
}
</script>
<style lang="scss" scoped>
.two-header{
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  display: -ms-flexbox;
  -ms-flex-align: center;
  -ms-justify-content: space-between;

  width: 100%;
  height: 90px;
  color: #70beff;
  z-index: 9;
  background: #0f4d99 url(../../assets/image/two-header-bg.png) no-repeat 0 66px;
  &__back{
    width: 90px;
    height: 90px;
    background: url(../../assets/image/two-header-back.png) no-repeat center center;
    cursor: pointer;
  }
  &__tit{
    font-size: 36px;
    position: absolute; bottom: 18px; left: 100px;
  }
  &__opt{
    position: absolute; bottom: 10px; right: 0px;
    >a{
      display: inline-block;
      width: 36px;
      height: 36px;
      margin-right: 30px;
      margin-top: 14px;
    }
    .search-form {
        display: inline-block;
        i {display: inline-block; position: relative; bottom: 1px; right: 50px; width: 21px; height: 21px; background: url(../../assets/image/zpop-delete-icon.png) no-repeat;}
        input {
            background-color: transparent !important;
            margin-top: 8px;
            position: relative; bottom: 6px; right: 44px;
            border: 2px solid #147bbc; border-radius: 6px; width: 547px; height: 39px; text-indent: .1em; color: #fff; font-size: 18px; background-color: transparent; outline: none;
            &:-ms-input-placeholder{
                color: #91d7fc;
                font-size: 16px;
            }
            &::-webkit-input-placeholder {
                color: #91d7fc;
                font-size: 16px;
            }
            &::-moz-placeholder {
                color: #91d7fc;
                font-size: 16px;
            }
        }
    }
    .icon-search{
        vertical-align: middle;
        margin: 0 30px 20px 0px;
        cursor: pointer;
    }

    .icon-home{
        background: url(../../assets/image/header-icon-home.png) no-repeat center center;
        position: relative; top:5px; right: 0px;
    }
    .icon-user{
      background: url(../../assets/image/header-icon-user.png) no-repeat center center;
        position: relative; top:5px; right: 0px;
    }
    .info-tip{
        font-size: 16px;
        position: absolute;
        width: 250px;
        right: 0px;
        top: 44px;
        background: url(../../assets/image/header-info-tip-bg.png) no-repeat;background-size:contain ;
        background-size: 100% 100%;
        ul{
          color: rgba(255,255,255,0.5);
          padding: 15px 0px 0px 0;
          list-style: none;
          .rolename {
						height:auto;
						line-height: 30px;
						padding-bottom: 4px;
					}
          .account {
						div {
							width: 155px;
							display: inline-block;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}
					}
					.name{
						div {
							width: 185px;
							display: inline-block;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}
					}
					.logOut{
						 color: #ffda2e;
             cursor: pointer;
					}
        li {
         padding: 0 10px;
						line-height: 36px;
						box-sizing: border-box;
						height: 36px;
						border-radius: 3px;
          &:hover {
            background-color: #3c97d4;
          }
          .right {
            display: inline-block;
            vertical-align: middle;
            position: relative;
            left: 6px;
            width: 18px;
            height: 18px;
            background: url(../../assets/image/header-icon-go.png.png) no-repeat;
          }
          .edit {
            cursor: pointer;
            vertical-align: middle;
            position: relative;
            float: right;
            top: 8px;
            width: 18px;
            height: 18px;
            background: url(../../assets/image/header-icon-edit.png) no-repeat;
          }
          &:nth-child(1) {
            color: #fff;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
            &:hover {
              background-color: transparent
            }
          }
          &:nth-child(4) a {
            color: #ffda2e;
            cursor: pointer;
          }
          &:nth-child(5) {
            color: #ffda2e;
            cursor: pointer;
          }
          span {
            cursor: pointer;
            font-size: 14px;
            float: right;
            color: #ffda2e;
          }
        }
        .name{
          height: 36px;
          div{
            width: 185px;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>


