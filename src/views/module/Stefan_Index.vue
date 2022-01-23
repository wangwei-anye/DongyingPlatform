<template>
	<div class="stefanindex">
		<!-- 顶部导航 -->
		<div class="top-nav">
			<div class="top-title">
				<i class="icon iconfont icon-biaozhi"></i>
				铜仁平安警务云智能零发案小区管控平台
			</div>
			<ul class="top-toolbar">
				<li><a href="javascript:void(0)" class="link-search "><i class="icon iconfont icon-sousuo"></i></a></li>
				<li><a href="javascript:void(0)" class="link-home"><i class="icon iconfont icon-shouye"></i></a></li>
				<li><a href="javascript:void(0)" class="link-user"><i class="icon iconfont icon-yonghu"></i></a></li>
			</ul>
		</div>
		<!-- 左侧菜单 -->
		<div class="left-menu">
			<ul>
				<li>
					<router-link to="/stefan/component"><i class="icon iconfont icon-shouye"></i>首页</router-link>
				</li>
        <li><a href="javascript:void(0)" class="active"><i class="icon iconfont icon-xiaoqu "></i>小区数据</a></li>
				<li><a href="javascript:void(0)"><i class="icon iconfont icon-fangwu"></i>房屋数据</a></li>
				<li><a href="javascript:void(0)"><i class="icon iconfont icon-renkou"></i>人口数据</a></li>
				<li><a href="javascript:void(0)"><i class="icon iconfont icon-chuhang"></i>出行记录</a></li>
				<li><a href="javascript:void(0)"><i class="icon iconfont icon-teshu"></i>特殊人员</a></li>
				<li><a href="javascript:void(0)"><i class="icon iconfont icon-fangfan"></i>治安防范体系</a></li>
				<li><a href="javascript:void(0)"><i class="icon iconfont icon-anfang"></i>安防巡查</a></li>
				<li><a href="javascript:void(0)"><i class="icon iconfont icon-zhishu"></i>小区发案指数排行</a></li>
				<li><a href="javascript:void(0)"><i class="icon iconfont icon-jiankong"></i>实时监控</a></li>
				<li><a href="javascript:void(0)"><i class="icon iconfont icon-gaojing"></i>实时告警</a></li>
				<li><a href="javascript:void(0)"><i class="icon iconfont icon-ditu"></i>三维GIS地图</a></li>
			</ul>
		</div>
		<!-- 主体内容 -->
		<div class="main-content">
      <router-view></router-view>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'stefanindex'
	}
</script>

<style lang="scss" scoped>
	.stefanindex {
		background-image: url('../../assets/image/appBg2.jpg'); position: absolute; top: 0; right: 0; bottom: 0; left: 0;
	}

	.top-nav {
		width: 100%; height: 64px; background-color: rgba(16, 97, 183, .5); display: flex; justify-content: space-between;
		position: absolute; top: 0;
		.top-title {
			display: inline-flex; font-size: 24px; color: rgba(82, 176, 255, .85); font-weight: bold; line-height: 64px;
			i { font-size: 36px; font-weight: normal; margin-left: 15px; margin-right: 5px; }
		}
		.top-toolbar {
			display: inline-flex; align-items: center;
			li {
				color: #00aeff;
				a {
					display: inline-block; width: 32px; height: 32px; line-height: 32px;
					text-align:center; margin-right: 20px; border-radius: 16px;
				}
				.link-search {
					i { font-size: 28px; }
				}
				.link-home, .link-user {
					background-color: rgba(0, 174, 255, .5);
					i { font-size: 18px; }
				}
			}
		}
	}

	.left-menu {
    position: absolute; left: 0; top: 64px; bottom: 0;
    background: linear-gradient(90deg, rgba(0, 67, 124, .75), rgba(26, 74, 150, .75));
    li {
    	height: 48px; line-height: 48px; color: 1cb1ff; font-size: 14px; font-weight: bold;
    	a {
    		width: 188px; display: inline-flex; align-items: center; box-sizing: border-box;
    		i { font-size: 20px; font-weight: normal; margin-left: 15px; margin-right: 8px; }
    		// &:hover { color: #fff; background-color: rgba(42, 114, 211, .75); border-right: 4px solid #1cb1ff; }
    	}
    	.active { color: #fff; background-color: rgba(42, 114, 211, .75); border-right: 4px solid #1cb1ff; }
    }
	}

	.main-content {
		margin: 64px 0 0 188px; padding: 15px 15px;
		.area-search {
			margin-bottom: 15px; display: inline-flex; align-items: center;
			label { font-size: 14px; color: #1cb1ff; }
			.select-container {
				display: inline-block; width: 160px; margin-right: 30px;
			}
		}
	}
</style>