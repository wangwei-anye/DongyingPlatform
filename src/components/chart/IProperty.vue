<template>
	<div class="IProperty">
		<ul>
			<li>
				<label class="name">
					<i class="icon iconfont icon-yongdian"></i>
				</label>
				<label class="process">
					<div class="process-note">
						<label>用电量</label>
						<label><i class="ivu-icon ivu-icon-arrow-down-c use-down"></i>0</label>
					</div>
	        <div class="process-item">
	          <div class="progressbar" style="width: 0;"></div>
	        </div>
				</label>
				<label class="count">0&nbsp;<small>Kw/h</small></label>
			</li>
			<li>
				<label class="name">
					<i class="icon iconfont icon-yongshui"></i>
				</label>
				<label class="process">
					<div class="process-note">
						<label>用水量</label>
						<label><i class="ivu-icon ivu-icon-arrow-up-c use-up"></i>0</label>
					</div>
	        <div class="process-item">
	          <div class="progressbar" style="width: 0;"></div>
	        </div>
				</label>
				<label class="count">0&nbsp;<small>t</small></label>
			</li>
			<li>
				<label class="name">
					<i class="icon iconfont icon-ranqi"></i>
				</label>
				<label class="process">
					<div class="process-note">
						<label>天然气</label>
						<label><i class="ivu-icon ivu-icon-arrow-up-c use-up"></i>0</label>
					</div>
	        <div class="process-item">
	          <div class="progressbar" style="width: 0;"></div>
	        </div>
				</label>
				<label class="count">0&nbsp;<small>m<sup>3</sup></small></label>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		name: 'IProperty'
	}
</script>

<style lang="scss" scoped>
	ul {
		padding: 15px 15px;
		li {
			display: flex; color: #fff; font-size: 16px; font-weight: bold; padding-top: 10px;
			display: -ms-flexbox;
			.name {
			display: inline-flex; width: 48px; justify-content: flex-end;
			display: -ms-inline-flexbox; -ms-flex-pack: end;
			i {
				font-weight: normal; font-size: 42px; color: #00fdc8;  }
			}
			.process {
				display: inline-flex; flex: 1; padding: 0 15px; align-items: center; flex-direction: column;
				display: -ms-inline-flexbox; -ms-flex-align: center; -ms-flex-direction: column; -ms-flex: 1;
				.process-note {
			  		display: inline-flex; justify-content: space-between; align-items: center;
					display: -ms-inline-flexbox; -ms-flex-pack: justify; -ms-flex-align: center;
			  		width: 100%; height: 22px; line-height: 22px; font-size: 14px;
			  		.use-down { color: #01fdc9; font-size: 16px; margin-right: 2px; }
			  		.use-up { color: #fc7921; font-size: 16px; margin-right: 2px; }
				}
			  	.process-item {
					width: 100%; height: 20px; border: 1px solid #00609c; border-radius: 10px; box-sizing: border-box;
					.progressbar {
				  	width: 90%; height: 18px; background: linear-gradient(90deg, #327ec9, #00ffc9); border-radius: 9px;
				}
			  }
			}
			.count {
				display: inline-flex; width: 96px; font-size: 18px; align-items: center;
				display: -ms-inline-flexbox; -ms-flex-align: center;
			}
		}
	}
</style>
