<template>
	<div class="staffdefense">
		<TwoHeader title="人防数据"></TwoHeader>
		<div class="contentPage">
	    <Tabs :value="tabvalue" class="staff-defense-tab" style="height: initial;" @on-click="toggleTab">
        <TabPane label="社区民警" name="0">
        	<!-- <Police></Police> -->
        </TabPane>
        <TabPane label="专职保安队伍" name="1">
					<!-- <Security></Security> -->
        </TabPane>
        <TabPane label="义务治安巡逻队伍" name="2">
        	<!-- <WatchTeam></WatchTeam> -->
        </TabPane>
	    </Tabs>
	    <div class="staff-content">
	    	<Police v-show="tabvalue == '0'"></Police>
	    	<Security v-show="tabvalue == '1'"></Security>
	    	<WatchTeam v-show="tabvalue == '2'"></WatchTeam>
	    </div>
		</div>
    <v-password-modal />
    <v-username-modal />
    <v-logout-modal />
	</div>
</template>

<script>
  import TwoHeader from '@/components/section/TwoHeader.vue'
  import vButton from '@/components/Button'
  import vPagination from '@/components/Pagination'
  import Police from '@/views/watch/police'
  import Security from '@/views/watch/security'
  import WatchTeam from '@/views/watch/watchteam'
	import vPasswordModal from '@/components/section/PasswordModal'
	import vUsernameModal from '@/components/section/UsernameModal'
	import vLogoutModal from '@/components/section/LogoutModal'

	export default {
		name: 'staffdefense',
		components: {
			TwoHeader,
			vButton,
			vPagination,
			Police,
			Security,
			WatchTeam,
	    vPasswordModal,
	    vUsernameModal,
	    vLogoutModal
		},
		data () {
			return {
				tabvalue: '0'
			}
		},
		methods: {
			toggleTab: function (tab) {
				this.tabvalue = tab
			}
		}
	}
</script>

<style lang="scss" scoped>
	.staffdefense {
		width: 1920px; height: 1080px; background: url(../../assets/image/appBg.jpg) no-repeat;	position: relative;
		.contentPage {
			position: absolute; top: 90px; bottom: 0; left: 0; right: 0; 
			padding: 15px 15px;
			.staff-defense-tab {
				overflow: hidden;
			}
		}
		.contentPage::-webkit-scrollbar {
			display: none;
		}
	}
	.type-category {
		width: 100%;
		li {
			float: left; padding: 14px 40px 10px 40px; cursor: pointer;
			color: #1cb1ff; font-size: 18px; font-weight: bold; 
		}
		.type-category-active {
			color: #fff; background: rgba(15, 145, 255, .2); border-top: 4px solid #1cb1ff; padding-top: 10px;
		}
	}
	.clearfix { clear: both; }
	.main-content {
		padding: 20px 40px; background: rgba(15, 145, 255, .2);
		.search-container {
			width: 100%; height: 48px; margin-bottom: 20px;
			color: #3fa7ff; font-size: 18px; display: flex;	align-items: center;
			.v-select {
				width: 160px;
				margin-right: 30px;
			}
			.v-btn{
				margin-left: 50px;
			}
			.addstaff {
				display: inline-flex; flex: 1; justify-content: flex-end;
				img { cursor: pointer; }
			}
		}
	}
	.table-detail {
		margin-bottom: 20px; padding: 5px 5px;
		position: relative; border-top: 1px solid #009dff; border-bottom: 1px solid #009dff;
		.left-top1 { width: 10px; height: 5px; position: absolute; top: -3px; left: 0; background-color: #1cb1ff; }
		.left-top2 { width: 5px; height: 10px; position: absolute; top: 0; left: 0; background-color: #1cb1ff; }
		.right-top1 { width: 10px; height: 5px; position: absolute; top: -3px; right: 0; background-color: #1cb1ff; }
		.right-top2 { width: 5px; height: 10px; position: absolute; top: 0; right: 0; background-color: #1cb1ff; }
		.left-bottom1 { width: 10px; height: 5px; position: absolute; bottom: -3px; left: 0; background-color: #1cb1ff; }
		.left-bottom2 { width: 5px; height: 10px; position: absolute; bottom: 0; left: 0; background-color: #1cb1ff; }
		.right-bottom1 { width: 10px; height: 5px; position: absolute; bottom: -3px; right: 0; background-color: #1cb1ff; }
		.right-bottom2 { width: 5px; height: 10px; position: absolute; bottom: 0; right: 0; background-color: #1cb1ff; }
		.detail-container {
			background: linear-gradient(0deg, rgba(0, 165, 255, .2), rgba(23, 87, 166, .2)); padding: 20px 120px;
			.collape-list {
				width: 100%; color: #fff; font-size: 18px; display: flex; flex-wrap: wrap;
				border-left: 2px solid #125f9d; border-top: 2px solid #125f9d; margin-top: 10px;
				.collape-list-itemodd {
					background-color: rgba(12, 62, 130, .5); width: 18%; padding: 15px 0;
					border-right: 2px solid #125f9d; border-bottom: 2px solid #125f9d; text-align: center;
				}
				.collape-list-itemeven {
					background-color: rgba(12, 62, 130, .5); width: 32%;  padding: 15px 0;
					border-right: 2px solid #125f9d; border-bottom: 2px solid #125f9d; text-align: center;
				}
				.collape-list-empty {
					background-color: transparent; color: #1cb1ff;
				}
			}
		}
	}
	.page-container {
		text-align: center; padding-top: 20px;
	}
</style>