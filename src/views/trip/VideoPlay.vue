<template>
	<div class="VideoPlay">
		<div class="pic" id="flash"></div>
		<img class="border" src="../../assets/image/alarm-alert-border.png"></img>
		<i class="close" @click="close"></i>
	</div>
</template>

<script>
	import $ from 'jquery'

	export default {
		props: {
			videoUrl: {
				type: String,
				default: '',
				required: true
			}
		},
		name: 'VideoPlay',
		methods: {
			close: function() {
				this.$emit('close');
			},
      getBrowserInfo: function () {
			  let agent = navigator.userAgent.toLowerCase()
			  let regStr_ie = /msie [\d.]+/gi
			  let regStr_ff = /firefox\/[\d.]+/gi
			  let regStr_chrome = /chrome\/[\d.]+/gi
			  let regStr_saf = /safari\/[\d.]+/gi
			  let arr = ''

			  // IE
			  if(agent.indexOf('msie') > 0) {
			    arr = agent.match(regStr_ie)[0].split(' ')
			    return { type: "IE", version: arr[1] }
			  }
			  
			  //firefox
			  if (agent.indexOf('firefox') > 0) {
			    arr = agent.match(regStr_ff)[0].split('/')
			    return { type: arr[0], version: arr[1] }
			  }
			  
			  //Chrome
			  if (agent.indexOf("chrome") > 0) {
			    arr = agent.match(regStr_chrome)[0].split('/')
			    return { type: arr[0], version: arr[1] }
			  }
			  
			  //Safari
			  if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
			     return { type: "safari", version: agent.match(regStr_saf) }
			  }
      }
		},
		mounted: function() {
		  let flashFirefox = '<embed type="application/x-shockwave-flash" src="static/flash/player.swf" width="100%" height="100%" wmode="opaque"'
		      + 'flashvars="skin=static/flash/skins/mySkin.swf&stream=' + this.videoUrl + '&streamname=?code=&autoplay=1" allowscriptaccess="always" allowfullscreen="true" bgcolor="#000000" />'
		      + '<noembed>'
		      + '<a target="_blank" href="http://get2.adobe.com/cn/flashplayer/otherversions/">请下载更新 flash!</a>'  
		      + '</noembed>'
		      + '</embed>';

		  let flash = '<object width="100%" height="100%" type="application/x-shockwave-flash">' 
		    + '<param name="movie" value="static/flash/player.swf" />'  
		      + '<param name="quality" value="high" />'
		      + '<param name="menu" value="true" />'   
		      + '<param name="scale" value="noscale" />'  
		      + '<param name="allowfullscreen" value="false">'  
		      + '<param name="allowscriptaccess" value="always">'   
		      + '<param name="swlivevonnect" value="true" />'   
		      + '<param name="cachebusting" value="true">'   
		      + '<param name="flashvars" value="' + 'skin=static/flash/skins/mySkin.swf&stream=' + this.videoUrl + '&streamname=?code=&autoplay=1' + '" />' 
		      + '<div>'
		      +   '<i></i>'
		      +   '<p>视频直播需要Flash支持</p>'
		      +   '<p>请 <a target="_blank" href="http://get2.adobe.com/cn/flashplayer/otherversions/">点击下载或更新</a> Flash</p>'
		      +   '<p>如已下载, 请在浏览器中开启Flash允许权限</p>'
		      + '</div>' + 
		    '</object>';

		  if (this.getBrowserInfo().type === 'firefox') {
		    $('#flash').html(flashFirefox)
		  } else {
		    $('#flash').html(flash)
		  }
		}
	}
</script>

<style lang="scss" scoped="scoped">
	.VideoPlay {
		position: fixed;
		top: 50%;
		left: 50%;
		margin-left: -701px;
		margin-top: -396px;
		z-index: 99999;
		width: 1402px;
		height: 792px;
		background: url(../../assets/image/alarm-alert-bg.png) no-repeat;
		.border {
			width: 100%;
			height: 100%;
			display: block;
			z-index: 10;
			position: absolute;
			left: 0;
			top: 0;
		}
		.pic {
			width: 100%;
			height: 100%;
			display: block;
			z-index: 5;
			position: absolute;
			left: 0;
			top: 0;
		}
		.close {
			width: 40px;
			height: 40px;
			background: url(../../assets/image/alarm-alert-close.png) no-repeat;
			display: block;
			position: absolute;
			top: 0;
			right: -40px;
			cursor: pointer;
		}
	}
</style>