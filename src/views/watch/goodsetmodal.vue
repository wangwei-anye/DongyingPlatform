<template>
	<div class="goodsetmodal">
		<div class="modal-content">
			<div class="modal-content-header">物防类目设置</div>
			<div class="modal-content-info">
				<div class="modal-content-subheader">当前物防类目</div>
				<div class="modal-content-list">
					<div class="modal-content-item" v-for="item in categorylist">
						{{ item }}<i class="ivu-icon ivu-icon-close-round" @click="delItem(item)"></i>
					</div>
					<Input v-model="newValue" class="app-input-modal" v-show="isNew" :maxlength="10" :autofocus="isNew" @on-enter="addItem" @on-blur="addItem">
					</Input>
					<div class="modal-content-insert" v-show="!isNew" @click="isNew = true">
						添加类目<i class="ivu-icon ivu-icon-plus-round"></i>
					</div>
				</div>
			</div>
      <div class="modal-content-footer">
        <Button class="app-button-confirm" @click="btnSure">确 定</Button>
        <label></label>
        <Button class="app-button-confirm" @click="btnCancle">取 消</Button>
      </div>
		</div>
	</div>
</template>

<script>
  import axios from '../../utils/http.js'
  import { province_code, city_code } from '@/config'
	export default {
		name: 'goodsetmodal',
		data () {
			return {
        currentProvince: '',
        currentCity: '',
				isNew: false,
				newValue: '',
				categorylist: []
			}
		},
    mounted: function () {
      this.currentProvince = this.$store.state.global.accountInfo.rolePermission.province_code
      this.currentCity = this.$store.state.global.accountInfo.rolePermission.city_code
			if (!this.currentProvince) {
				this.currentProvince = province_code
			}
			if (!this.currentCity) {
				this.currentCity = city_code
			}
      this.getObjectDefenceCategorySearch()
    },
		methods: {
			// 获取物防类目
			getObjectDefenceCategorySearch () {
        axios.post('/safety/objectDefenceCategorySearch.do', {
          province_code: this.currentProvince,
          city_code: this.currentCity
        }).then(response => {
          if(response.data.success) {
            this.categorylist = response.data.data.objectNames
          }
          else {
            console.log('获取物防类目失败')
          }
        }).catch(err => {
          console.log('获取物防类目失败')
        })
			},
			// 设置物防类目
			btnSure () {
				if (this.isNew) {
					this.$Message.warning('请先保存类目名称')
					return
				}
				let params = 'province_code=' + this.currentProvince + '&city_code=' + this.currentCity
				for (let i = 0; i < this.categorylist.length; i++) {
					params += '&defenceName=' + this.categorylist[i]
				}
        axios.get('/safety/objectDefenceCategoryStandard.do?' + params).then(response => {
          if(response.data.success) {
            this.$emit('closeModal')
          }
          else {
            console.log('设置物防类目失败')
          }
        }).catch(err => {
          console.log('设置物防类目失败')
        })
			},
			btnCancle () {
				this.$emit('closeModal');
			},
			addItem () {
				if (this.categorylist.indexOf(this.newValue) == -1) {
					if (this.newValue.trim() != '') {
						this.categorylist.push(this.newValue)
					}
					this.isNew = false
					this.newValue = ''
				}
				else {
					this.$Message.warning('类目名称重复')
				}
			},
			delItem (item) {
				this.categorylist = this.categorylist.filter(value => value != item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.goodsetmodal {
		position: fixed; top: 0; right: 0; bottom: 0; left: 0; background: rgba(0, 0, 0, .66);
		display: flex; align-items: center; justify-content: center; z-index: 999999;
		.modal-content {
			width: 1015px; height: 508px; background-image: url('../../assets/image/watchsetBg.png'); padding: 40px 65px; overflow: auto;
		  &::-webkit-scrollbar {
		  	width: 8px;
		  }
		  &::-webkit-scrollbar-button {
		  	display: none;
		  }
		  &::-webkit-scrollbar-track {
		  	border-radius: 4px; background-color: #0e5897;
		  }
		  &::-webkit-scrollbar-thumb {
		  	border-radius: 4px; background-color: #1cb1ff;
		  }
			.modal-content-header {
				font-size: 22px; color: #4fc7ff; text-align: center; margin-bottom: 20px;
			}
			.modal-content-info {
				font-size: 16px; color: #ffffff; text-align: center; margin-bottom: 30px;
				.modal-content-subheader {
					font-size: 18px; color: #4fc7ff; text-align: left;
				}
				.modal-content-list {
					display: flex; flex-wrap: wrap;
					.modal-content-item {
						display: inline-flex; width: 205px; height: 38px; align-items: center; justify-content: center;
						background: rgba(28, 177, 255, .1); border: 1px solid rgba(42, 127, 206, .86); margin-top: 10px; margin-right: 10px;
						.ivu-icon {
							margin-left: 10px; color: #c9c9c9; cursor: pointer;
							&:hover {
								color: #ffda2e;
							}
						}
					}
					.modal-content-insert {
						display: inline-flex; width: 210px; height: 38px; align-items: center; justify-content: center;
						cursor: pointer; color: #ffda2e; margin-top: 10px; margin-right: 10px;
						.ivu-icon {
							margin-left: 5px;
						}
					}
				}
			}
			.modal-content-footer {
				text-align: center; margin-bottom: 30px;
				label {
					display: inline-block; width: 30px; height: 24px;
				}
			}
		}
	}
</style>
