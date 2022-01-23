<template>
	<div class="door-record">
		<div class="door-record-search">
			<label>姓名检索：</label>
			<Input v-model="username" class="app-input-form" type="text" style="width: 180px; margin-right: 15px;"></Input>
			<label>时间：</label>
			<DatePicker class="app-datepicker-travel" type="daterange" placement="bottom-start" :open="dooropen" :editable="false" confirm @on-change="doorHandleChange" @on-clear="doorHandleClear" @on-ok="doorHandleOk">
				<div class="date-container" @click="doorHandleClick">
					<input type="text" readonly="readonly" :value="doordate[0]">
					<span>至</span>
					<input type="text" readonly="readonly" :value="!doordate[0] ? doordate[0] : doordate[1]">
				</div>
			</DatePicker>
			<v-Button class='v-btn' :btnInfo="btnInfo" @click="btnSearch"></v-Button>
		</div>
		<Table class="app-table-border" :columns="doorcolumns" :data="doordata"></Table>
    <div style="margin-top: 25px; text-align: center;">
      <v-pagination :pageSize="8" :total="doortotal" :pageIndex="doorpage" @toPage="toDoorPage" class="pageBar"></v-pagination>
    </div>
    <v-alarmAlert v-show="showPhoto" :photoUrl="photoUrl" @close='showPhoto = false'></v-alarmAlert>
    <VideoPlay v-if="showVideo" :videoUrl="videoUrl" @close='showVideo = false'></VideoPlay>
	</div>
</template>

<script>
  import vButton from '@/components/Button'
  import vPagination from '@/components/Pagination'
  import vAlarmAlert from '@/views/alarm/AlarmAlert'
  import VideoPlay from './VideoPlay'
  import axios from '../../utils/http.js'
	export default {
		name: 'DoorRecord',
		components: {
			vButton,
			VideoPlay,
      vPagination,
      vAlarmAlert
		},
		data () {
			return {
        showPhoto: false,
        photoUrl: '',
        showVideo: false,
        videoUrl: '',
				btnInfo: {
					text: '查 询'
				},
        username: '',
      	dooropen: false,
      	doordate: ['', ''],
        doortotal: 0,
        doorpage: 1,
        doorcolumns: [
          {
            title: '日期 - 时间',
            key: 'start_time',
            render: (h, params) => {
              let date = new Date(params.row.start_time)
              let nowtime = ''
              nowtime += date.getFullYear() + '/'
              nowtime += (date.getMonth() >= 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '/'
              nowtime += (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()) + ' '
              nowtime += (date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()) + ':'
              nowtime += (date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()) + ':'
              nowtime += date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
              return h('label', nowtime)
            }
          },
          {
            title: '姓名',
            key: 'user_name',
            ellipsis: true,
            render: (h, params) => {
              return h('span', {
                attrs: { title: params.row.user_name }
              }, params.row.user_name)
            }
          },
          {
            title: '门禁ID',
            key: 'door_name',
            ellipsis: true,
            render: (h, params) => {
              return h('span', {
                attrs: { title: params.row.door_name }
              }, params.row.door_name)
            }
          },
          {
            title: '开门情况',
            key: 'open_status',
            ellipsis: true,
            render: (h, params) => {
              if (params.row.open_status >=1 && params.row.open_status <= 5) {
                return h('span', '成功')
              } else if (params.row.open_status == 6 || params.row.open_status ==7) {
                return h('span', {
                  style: { color: '#ff4f4f' }
                }, '失败')
              } else {
                return h('span', {
                  style: { color: '#ff4f4f' }
                }, '未知')
              }
            }
          },
          {
            title: '开门方式',
            key: 'open_door',
            ellipsis: true,
            render: (h, params) => {
              let tmpstr = ''
              if (params.row.open_door == 1) {
                tmpstr = '一键开门'
              }
              else if (params.row.open_door == 2) {
                tmpstr = '自动开门'
              }
              else if (params.row.open_door == 3) {
                tmpstr = '亮屏开门'
              }
              else if (params.row.open_door == 4) {
                tmpstr = '摇一摇开门'
              }
              else if (params.row.open_door == 5) {
                tmpstr = '人脸识别开门'
              }
              else if (params.row.open_door == 9) {
                tmpstr = '按键开门'
              }
              else if (params.row.open_door == 10) {
                tmpstr = '手机蓝牙开门'
              }
              else if (params.row.open_door == 11) {
                tmpstr = '手机NFC开门'
              }
              else if (params.row.open_door == 12) {
                tmpstr = '手机WIFI开门'
              }
              else if (params.row.open_door == 13) {
                tmpstr = '刷IC卡开门'
              }
              else if (params.row.open_door == 15) {
                tmpstr = '身份证开门'
              }
              else if (params.row.open_door == 21) {
                tmpstr = '密码开门'
              }
              else if (params.row.open_door == 22) {
                tmpstr = '呼叫远程开门'
              }
              else {
                tmpstr = ''
              }
              return h('span', {
                attrs: { title: tmpstr }
              }, tmpstr)
            }
          },
          {
            title: '用户类型',
            key: 'user_type',
            ellipsis: true,
            render: (h, params) => {
              if (params.row.user_type == '2') {
                return h('span', '业主')
              }
              else if (params.row.user_type == '3') {
                return h('span', '家属')
              }
              else {
                return h('span', '租客')
              }
            }
          },
          { 
            title: '抓拍图像',
            key: 'picurl',
            render: (h, params) => {
              return h('img', {
                attrs: { src: params.row.picurl ? params.row.picurl.split(',')[0] : '', alt: '' },
                style: { verticalAlign: 'middle', width: '36px', height: '36px' },
                on: {
                  click: () => {
                    this.showPhoto = true
                    this.photoUrl = params.row.picurl.split(',')[0]
                  }
                }
              })
            }
          },
          { 
            title: '视频',
            key: 'videourl',
            render: (h, params) => {
              if (params.row.videourl) {
                return h('img', {
                  attrs: { src: params.row.picurl ? params.row.picurl.split(',')[0] : '', alt: '' },
                  style: { verticalAlign: 'middle', width: '36px', height: '36px' },
                  on: {
                    click: () => {
                      this.showVideo = true
                      this.videourl = params.row.videourl
                    }
                  }
                })
              }
            }
          }
        ],
        doordata: []
			}
		},
		methods: {
      doorHandleClick () {
        this.dooropen = !this.dooropen
      },
      doorHandleChange (doordate) {
        this.doordate = doordate
      },
      doorHandleClear () {
        this.dooropen = false
      },
      doorHandleOk () {
        this.dooropen = false
      },
      // 获取门禁记录数据
      getDoorRecord: function (params) {
        let condition = params + '&pageNo=' + this.doorpage + '&pageSize=6'
        if (this.username) {
          condition += '&name=' + this.username
        }
        if (this.doordate[0] && this.doordate[1]) {
          condition += '&start_time=' + this.doordate[0] + ' 00:00:00' + '&end_time=' + this.doordate[1] + ' 23:59:59'
        }
        axios.get('/door/record.do' + condition).then(response => {
          this.doortotal = response.data.totalCount
          this.doordata = response.data.items
        }).catch(err => {
          console.log('获取门禁记录数据失败')
        })
      },
      // 分页跳转
      toDoorPage: function (currentPage) {
        this.doorpage = currentPage
        this.getDoorRecord()
      },
      // 搜索
      btnSearch: function () {
        this.$emit('recordclick')
      }
		}
	}
</script>

<style lang="scss" scoped>
	.door-record {
		.door-record-search {
			label { color: #1cb1ff; font-size: 16px; }
			display: flex; height: 42px; align-items: center; margin-bottom: 15px;
		}
	}
</style>