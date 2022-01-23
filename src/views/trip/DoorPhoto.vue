<template>
	<div class="door-photo">
		<div class="door-photo-search">
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
		<div class="door-photo-table">
			<Table class="app-table-border" :columns="doorcolumns" :data="doordata"></Table>
			<div class="detail-showphoto">
				<div class="detail-showphoto-title">抓拍图像</div>
				<div class="detail-showphoto-content">
          <img :src="photoUrl" alt="" />    
        </div>
			</div>
		</div>
    <div  class="door-photo-page">
      <v-pagination :pageSize="8" :total="doortotal" :pageIndex="doorpage" @toPage="toDoorPage" class="pageBar"></v-pagination>
    </div>
	</div>
</template>

<script>
  import vButton from '@/components/Button'
  import vPagination from '@/components/Pagination'
  import axios from '../../utils/http.js'
  import { imgServerAddr } from '@/config'
	export default {
		name: 'DoorPhoto',
		components: {
			vButton,
      vPagination
		},
		data () {
			return {
        photoUrl: '',
				btnInfo: {
					text: '查 询'
				},
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
              let nowtime
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
            title: '摄像头ID',
            key: 'camera_id'
          },
          { 
            title: '抓拍图片',
            key: 'original_pic',
            render: (h, params) => {
              return h('img', {
                attrs: { src: params.row.original_pic ? imgServerAddr + '/' + params.row.original_pic : '', alt: '' },
                style: { verticalAlign: 'middle', width: '36px', height: '36px' },
                on: {
                  click: () => {
                    this.photoUrl = imgServerAddr + '/' + params.row.original_pic
                  }
                }
              })
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
      // 获取抓拍图像记录
      getDoorPhoto: function (params) {
        let condition = params + '&pageNo=' + this.doorpage + '&pageSize=6'
        if (this.doordate[0] && this.doordate[1]) {
          condition += '&start_time=' + this.doordate[0] + ' 00:00:00' + '&end_time=' + this.doordate[1] + ' 23:59:59'
        }
        axios.get('/camera/searchCameraLog.do' + condition).then(response => {
          this.doortotal = response.data.totalCount
          this.doordata = response.data.items
        }).catch(err => {
          console.log('获取门禁记录数据失败')
        })
      },
      // 分页跳转
      toDoorPage: function (currentPage) {
        this.doorpage = currentPage
        this.getDoorPhoto()
      },
      // 搜索
      btnSearch: function () {
        this.$emit('photoclick')
      }
		}
	}
</script>

<style lang="scss" scoped>
	.door-photo {
		.door-photo-search {
			label { color: #1cb1ff; font-size: 16px; }
			display: flex; height: 42px; align-items: center; margin-bottom: 15px;
		}
		.door-photo-table {
			display: flex; align-items: center;
			.app-table-border {
				flex: 1;
			}
			.detail-showphoto {
				height: 587px; display: flex; flex: 1; border: 1px solid #125f9d; border-left: 0; flex-direction: column;
				.detail-showphoto-title {
					line-height: 65px; border-bottom: 1px solid #125f9d; background-color: #143778;
					font-size: 16px; color: #fff; text-align: center;
				}
				.detail-showphoto-content {
					flex: 1; padding: 15px 15px;
				}
			}
		}
		.door-photo-page {
			margin-top: 25px; text-align: center;
		}
	}
</style>