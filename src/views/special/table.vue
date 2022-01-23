<template>
    <div class="container">
        <div class="content">
            <div class="query">
                <div class="query_name">
                    <span>姓名：</span>
                    <input type="text" maxlength="10" v-model='search.name'>
                </div>
                <div class="query_ages">
                    <span>年龄</span>
                    <input type="text" maxlength="3" v-model='search.age_min'> -
                    <input type="text" maxlength="3" v-model='search.age_max'>
                </div>
                <div class="query_code">
                    <span>身份证：</span>
                    <input type="text" maxlength="18" v-model='search.code'>
                </div>
                <div class="query_phone">
                    <span>手机号：</span>
                    <input type="text" maxlength="13" v-model='search.phone'>
                </div>
                <div class="query_room">
                    <span>房号：</span>
                    <input type="text" maxlength="10" v-model='search.room' autocomplete="off">
                </div>
                <div class="query_btn" @click='query_data'>
                    <v-Button :btnInfo='btnInfo'></v-Button>
                </div>
                <div class="query_opt">
                    <img src="../../assets/image/special/icon/daochu.png" height="38" width="38" alt=""
                         @click='download' title="导出">
                    <img src="../../assets/image/special/icon/tianjia.png" height="38" width="38" alt=""
                         @click='add' :hidden="addHidden">
                    <img src="../../assets/image/special/icon/xiugai.png" height="38" width="38" alt=""
                         @click='update' :hidden="updateHidden">
                    <img src="../../assets/image/special/icon/shanchu.png" height="38" width="38" alt=""
                         @click='del' :hidden="delHidden">
                </div>
            </div>
            <div class="table">
                <Table class='border-table' :columns="columns" :data="lists" highlight-row
                       @on-select="selectOne" @on-selection-change="selectionChange" @on-select-all='selectAll'></Table>
                <v-delete v-if='showDel' :usrid='select_rows'></v-delete>
                <v-add v-if='showAdd' :newUser='newUser'></v-add>
                <Update v-if='showUpdate' :selectedUser='selectedUser'></Update>
                <Notify v-if='showNotify'></Notify>
            </div>
            <div class="page">
                <v-pagination :total="totalNum" :pageIndex="pageIndex" @toPage='toPage' :pageSize='8'></v-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {createNamespacedHelpers} from 'vuex'
    import router from '@/router'
    import vButton from '@/components/Button'
    import vPagination from '@/components/Pagination'
    import vDelete from './delete'
    import vAdd from './add'
    import Notify from '@/components/Notify'
    import Update from './Update'
    import {imgServerAddr} from '../../config'
    import $ from 'jquery'

    const {mapState, mapMutations, mapActions} = createNamespacedHelpers('special');

    export default {
        name: 'DataTable',
        components: {
            vButton,
            vPagination,
            vDelete,
            vAdd,
            Notify,
            Update
        },
        data() {
            return {
                defaultPath: require('../../assets/image/alarm/arrow-down.png'),
                search: {
                    name: '',
                    age_min: '',
                    age_max: '',
                    code: '',
                    phone: '',
                    room: ''
                },
                newUser: {
                    name: '',
                    gender: '',
                    code: '',
                    phone: '',
                    nation: '',
                    address: '',
                    town: '',
                    country: '',
                    community: '',
                    unit: '',
                    unit_name: '',
                    town_name: '',
                    country_name: '',
                    community_name: '',
                    type: '',
                    category: '',
                    remark: '',
                    image: '',
                    isAdd: true
                },
                selectedUser: {},
                select_rows: [],
                btnInfo: {
                    text: '查询', // 此选项可有可无，默认为确定，可以填写其他如确定，搜索，查找等...
                    styles: {
                        width: '100px',
                        height: '40px',
                        border: 'none',
                        borderRadius: '2px',
                        color: '#111',
                        fontSize: '16px',
                        fontWeight: 'normal',
                        backgroundColor: '#e9cb44',
                        hoverColor: 'none'
                    }, // 此选项可有可无，无则接受type为'default'的样式
                    type: 'default' // 此选项可有可无，默认为'default': 'primary', 'info', 'danger', 'warning', 'success', 'default'
                },
                selectType: '',//选择的人员类型
                categoryList: {//人员类目字典
                    1: '涉毒人员',
                    2: '社区矫正人员',
                    // 3: '服刑及涉毒人员',
                    4: '刑释解戒人员',
                    5: '重点青少年',
                    6: '重点信访人员',
                    7: '精神病人',
                    8: '涉邪人员',
                    9: '优抚对象',
                    10: '残疾人员',
                    11: '离休干部',
                    12: '低保人员',
                    13: '重大疾病人员',
                    14: '孤寡老人',
                    15: '留守人员'
                },
                columns: [
                    {key: 'id', type: 'selection', width: '70px'},
                    {key: 'unit_name', title: '小区名称'},
                    {
                        key: 'photo',
                        title: '照片',
                        coltype: 'photo',
                        render: (h, params) => {
                            return h('div', [
                                h('Img', {
                                    attrs: {
                                        src: params.row.photo || ""
                                    },
                                    style: {
                                        width: '60px',
                                        height: '60px',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params);
                                        },
                                        error: (e) => {
                                            $(e.target).attr('src', require('../../assets/image/userpic.png'));
                                        }
                                    }
                                }),
                            ]);
                        }
                    },
                    {key: 'name', title: '姓名'},
                    {key: 'idcard', title: '身份证'},
                    {key: 'nation', title: '户籍'},
                    {key: 'phone', title: '电话', width: '130px'},
                    {
                        key: 'usertype',
                        title: '人员类型',
                        coltype: 'usertype',
                        width: '160px',
                        renderHeader: this.showTypeList
                    },
                    {
                        key: 'category',
                        title: '人员类目',
                        coltype: 'category',
                        width: '175px',
                        renderHeader: this.showCategoryList
                    },
                    {key: 'address', title: '住址'},
                    {key: 'remark', title: '备注'},
                    {key: 'daycount', title: '当天出行次数', width: '100px'},
                    {key: 'monthcount', title: '本月出行次数', width: '100px'},
                    {
                        key: 'more', title: '更多', coltype: 'more', width: '80px',
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        width: '60px',
                                        height: '60px',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            this.toUserInfo(params.row.more.user_id);
                                        }
                                    }
                                }, '...'),
                            ]);
                        }
                    },
                    /*{
                        key: 'gender', title: '', width: '0px', render: (h, params) => {
                        }
                    },
                    {
                        key: 'town', title: '', width: '0px', render: (h, params) => {
                        }
                    },
                    {
                        key: 'country', title: '', width: '0px', render: (h, params) => {
                        }
                    },
                    {
                        key: 'village', title: '', width: '0px', render: (h, params) => {
                        }
                    },
                    {
                        key: 'unit_id', title: '', width: '0px', render: (h, params) => {
                        }
                    },
                    {
                        key: 'flag', title: '', width: '0px', render: (h, params) => {
                        }
                    },
                    {
                        key: 'user_id', title: '', width: '0px', render: (h, params) => {
                        }
                    }*/
                ]
            }
        },
        methods: {
            showTypeList(h, params) {
                var optionList =
                    h('select', {
                        attrs: {
                            id: 'th_usertype'
                        },
                        style: {
                            color: "white",
                            width: '125px',
                            height: "35px",
                            border: "1px solid #1cb1ff",
                            appearance: 'none',
                            "moz-appearance": 'none',
                            "webkit-appearance": 'none',
                            "background": "url(" + this.defaultPath + ") no-repeat",
                            "background-position": '95% 48%',
                            "background-size": "10px 10px",
                            "background-color": '#032A51',
                            "padding-left": '5px'
                        },
                        on: {
                            change: () => {
                                // console.log(document.getElementById('th_usertype').value);
                                this.selectType = document.getElementById('th_usertype').value;
                                document.getElementById('th_category').options[0].selected = true;
                                this.updatePersonnelCategory("");
                                this.updatePersonnelType(this.selectType);
                                this.showCategoryList(h, params);
                            }
                        }
                    }, [
                        h('option', {
                            attrs: {
                                value: ''
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            },
                            selected: true
                        }, '人员类型'),
                        h('option', {
                            attrs: {
                                value: '1'
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '关爱人员'),
                        h('option', {
                            attrs: {
                                value: '2'
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            }
                        }, '重点人员')
                    ]);
                return optionList;
            },
            showCategoryList(h, params) {
                console.log("enter showCategoryList");
                var optionList = [
                    h('option', {
                        attrs: {
                            value: ''
                        },
                        style: {
                            backgroundColor: '#034d8c'
                        },
                        selected: true
                    }, '人员类目')
                ];
                for (var i = 1; i < 16; i++) {
                    // console.log(i, categoryList[i]);
                    if (i !== 3) {
                        var option = h('option', {
                            attrs: {
                                id: 'category' + i,
                                value: i
                            },
                            style: {
                                backgroundColor: '#034d8c'
                            },
                            selected: true
                        }, this.categoryList[i]);
                        optionList.push(option);
                    }
                    // console.log(optionList);
                }
                if (this.selectType === '1') {
                    for (var j = 1; j < 9; j++) {
                        if (j !== 3) {
                            document.getElementById("category" + j).style.display = "none";
                        }
                    }
                    for (var k = 9; k < 16; k++) {
                        document.getElementById("category" + k).style.display = "";
                    }
                } else if (this.selectType === '2') {
                    for (var k = 1; k < 9; k++) {
                        if (k !== 3) {
                            document.getElementById("category" + k).style.display = "";
                        }
                    }
                    for (var k = 9; k < 16; k++) {
                        document.getElementById("category" + k).style.display = "none";
                    }
                }
                return h('select', {
                    attrs: {
                        id: 'th_category'
                    },
                    style: {
                        color: "white",
                        width: '140px',
                        height: "35px",
                        border: "1px solid #1cb1ff",
                        appearance: 'none',
                        "moz-appearance": 'none',
                        "webkit-appearance": 'none',
                        "background": "url(" + this.defaultPath + ") no-repeat",
                        "background-position": '95% 48%',
                        "background-size": "10px 10px",
                        "background-color": '#032A51',
                        "padding-left": '5px'
                    },
                    on: {
                        change: () => {
                            // console.log(document.getElementById('th_category').value);
                            this.updatePersonnelCategory(document.getElementById('th_category').value);
                        }
                    }
                }, optionList);

            },
            selectOne(selection, row) {
                //this.select_rows = []
                this.select_rows.push(row);
                // this.updateSelectedUser(newUser)
                this.updateSelectedUserList(this.select_rows);
            },
            selectionChange(selection) {
                this.select_rows = [];
                for (let s of selection) {
                    this.select_rows.push(s);
                }
                this.updateSelectedUserList(this.select_rows);
            },
            selectAll(selection) {
                this.select_rows = [];
                for (let s of selection) {
                    this.select_rows.push(s);
                }
                this.updateSelectedUserList(this.select_rows);
            },
            query_data() {
                this.query(this.search)
            },
            toPage(currentPage) {
                this.getLists({pageNo: currentPage});
            },
            download() {
                this.export({
                    selected: this.select_rows,
                    queries: this.search
                });
            },
            add() {
                this.newUser = {
                    type: "",
                    category: "",
                    gender: "",
                    town: "all"
                };//清空表单数据
                this.clearTownSelect2();
                if (this.errorMsg) {
                    this.updateAddErr({value: '', error: false})
                }
                this.updateCheckResult(true);
                this.mshowAdd();
            },
            del() {
                if (Object.prototype.toString.call(this.select_rows) === '[object Array]' && this.select_rows.length === 0) {
                    this.updateNotify('请至少选择一个人员！');
                    this.mshowNotify();
                    //2秒后关闭提示窗口
                    setTimeout(() => {
                        this.mshowNotify();
                    }, 2000);
                    return
                }
                this.mshowDel();
            },
            update() {
                if (this.errorMsg) {
                    this.updateAddErr({value: '', error: false});
                }
                /*if (this.select_rows.length !== 1) {
                    this.updateNotify('每次能且只能修改一条人员信息！');
                    this.mshowNotify();
                    setTimeout(() => {
                        this.mshowNotify();
                    }, 2000);
                    return;
                }
                let row = this.select_rows[0];
                if (row.more.flag === '2') {
                    this.updateNotify('该人员数据为物业系统导入数据，暂不支持修改！');
                    this.mshowNotify();
                    setTimeout(() => {
                        this.mshowNotify();
                    }, 2000);
                    return;
                }*/
                //测试修改代码
                let row = {
                    more: {}
                };
                //测试修改代码
                let newUser = {
                    id: row.id,
                    name: row.name,
                    gender: row.more.gender,
                    code: row.idcard,
                    phone: row.phone,
                    nation: row.nation,
                    address: row.address,
                    town: row.more.town,
                    country: row.more.country,
                    community: row.more.community,
                    unit: row.unit,
                    type: row.usertype_code,
                    category: row.category_code,
                    remark: row.remark,
                    image: row.image,
                    unit_name: row.unit_name,
                    town_name: '',
                    country_name: '',
                    community_name: '',
                    isAdd: true
                };
                //测试修改代码
                newUser.town = "370502";
                newUser.police = "2";
                newUser.unit = "4299";
                //测试修改代码
                this.selectedUser = newUser;
                this.getPolice(newUser);
                /*this.getCountry(newUser);
                this.getCommunity(newUser);*/
                this.getUnit(newUser);
                this.updateCheckResult(true);
                this.mshowUpdate();
            },
            toUserInfo: function (userId) {
                if (!userId) {
                    this.updateNotify('系统中暂无该人员信息！');
                    this.mshowNotify();
                    setTimeout(() => {
                        this.mshowNotify();
                    }, 2000);
                    return;
                }
                this.updateUserId(userId);
                router.push({
                    path: '/userInfo'
                })
            },
            ...mapMutations([
                'mshowDel',
                'mshowAdd',
                'mshowNotify',
                'mshowUpdate',
                'updateNotify',
                'updateSelectedUser',
                'updateAddErr',
                'updatePersonnelType',
                'updatePersonnelCategory',
                'updateSelectedUserList',
                'updateCheckResult',
                'clearTownSelect2'
            ]),
            ...mapActions([
                'getLists',
                'query',
                'export',
                'updateUserId',
                'checkResult',
                'getCountry',
                'getCommunity',
                'getUnit',
                'getPolice'
            ])
        },
        computed: {
            addHidden() {
                let permissionStr = this.$store.state.global.accountInfo.func_permissions;
                let permission = true;
                if (permissionStr && permissionStr.indexOf("2:4") !== -1) {
                    permission = false;
                }
                return permission;
            },
            updateHidden() {
                let permissionStr = this.$store.state.global.accountInfo.func_permissions;
                let permission = true;
                if (permissionStr && permissionStr.indexOf("2:5") !== -1) {
                    permission = false;
                }
                return permission;
            },
            delHidden() {
                let permissionStr = this.$store.state.global.accountInfo.func_permissions;
                let permission = true;
                if (permissionStr && permissionStr.indexOf("2:6") !== -1) {
                    permission = false;
                }
                return permission;
            },
            ...mapState([
                'showDel',
                'showAdd',
                'showNotify',
                'lists',
                'totalNum',
                'currentLoc',
                'showUpdate',
                'pageIndex',
                'errorMsg',
                'errorShow',
                'personnel_type',
                'personnel_category',
                'selectUserList',
                'townList_2',
                'countryList_2',
                'communityList_2',
                'unitList_2'
            ])
        },
        watch: {
            'personnel_type': function () {
                this.query(this.search);
                // 只要检测到选项变化，就要将之前的选项清空
                // 否则会出现明明界面没有选中的选项，点击修改后却可以出现以前选中过的特殊人员界面
                this.select_rows = []
            },
            'personnel_category': function () {
                this.query(this.search);
                this.select_rows = []
            },
            'selectUserList': function (newVal, oldVal) {
                if (newVal && newVal.length === 0) {
                    this.select_rows = [];
                }
            }
        },
        mounted() {
            //this.getLists({pageNo: 1});
        }
    }
</script>

<style lang='scss' scoped>
    $textPrimary: #45c1fb;
    $textSecondary: #f1f1f1;
    .container {
        background-size: 100% 100%;
        width: 100%;
        -ms-overflow-y: hidden;
        padding: 30px 0 100px;
        .content {
            width: 1582px;
            margin: auto;
            font-size: 18px;
            .query {
                color: $textPrimary;
                div {
                    display: inline-block;
                    margin-right: 24px;
                }
                .query_opt {
                    float: right;
                }
                input {
                    height: 40px;
                    border-radius: 2px;
                    background-color: #0e366d;
                    border: 1px solid #1a9ee8;
                    width: 100px;
                    color: #fff;
                    padding-left: 3px;
                }
                .query_ages {
                    input {
                        width: 50px;
                    }
                }
                .query_code {
                    input {
                        width: 200px;
                    }
                }
                .query_phone {
                    input {
                        width: 144px;
                    }
                }
                .query_phone {
                    input {
                        width: 140px;
                    }
                }
                .query_room {
                    input {
                        width: 140px;
                    }
                }
                .query_opt {
                    margin-right: 0px;
                    img {
                        cursor: pointer;
                    }
                }

            }
            .table {
                width: 100%;
                margin-top: 30px;
                margin-bottom: 40px;
                position: relative;
            }
            .page {
                text-align: center;
            }
        }
    }
</style>