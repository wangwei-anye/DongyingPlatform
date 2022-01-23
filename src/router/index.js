import Vue from 'vue'
import Router from 'vue-router'
import moduleRouter from '@/router/module'
import tmpStefan from '@/router/tmp_stefan'
import tmpTim from '@/router/tmp_tim'
import tmpZsh from '@/router/tmp_zsh'
import tmpWW from '@/router/tmp_ww'
import tmpLQ from '@/router/tmp_lq'
import resizeViewport from '../utils/viewport'
import store from '@/store'

Vue.use(Router)

let routes = [{
	path: '/',
	redirect: '/login'
}]

Array.prototype.push.apply(routes, moduleRouter)
Array.prototype.push.apply(routes, tmpStefan)
Array.prototype.push.apply(routes, tmpTim)
Array.prototype.push.apply(routes, tmpZsh)
Array.prototype.push.apply(routes, tmpWW)
Array.prototype.push.apply(routes, tmpLQ)

const router = new Router({
	routes: routes
})

const notScalePagePaths = [
	'stefan',
	'zsh',
	'house',
	'security',
	'special',
	'population',
	'estate'
];

export const threshold = 0.5;
router.beforeEach((to, from, next) => {
	const fromPath = from.fullPath.split('/')[1],
		toPath = to.fullPath.split('/')[1],
		shouldScale = notScalePagePaths.indexOf(toPath) === -1,
		noAccountInfo = Object.keys(store.state.global.accountInfo).length == 0;

	resizeViewport(shouldScale, '#app', threshold);

	// 非登录页面的访问, 必须检测是否拥有账号信息
	// 没有账号信息则通过请求接口重新设置 accountInfo
	// 用户认证信息不存在时会统一被 axios 拦截器重定向到登录页
	// 此处只需考虑设置 accountInfo
	if(toPath != 'login') {
		if(noAccountInfo) {
			store.dispatch('getAccountInfo').then(() => {
				requireAccontInfoHandlers();
			});
		} else {
			requireAccontInfoHandlers();
		}
	} else {
		next();
	}

	function requireAccontInfoHandlers() {
		let passportLevel = store.state.global.accountInfo.rolePermission.roleType.level;

		if(toPath === 'platform') {
            // 小区级用户跳转到小区平台
			// 排除派出所账号 派出所账号 passportLevel 为 7
			if(passportLevel > 5 && passportLevel !== 7) next('/zone');
			store.dispatch('alarm/setRouterName', 'platform');
			next();
		} else {
			let routerName = to.path.split("/").pop();
			if(routerName == 'house' || routerName == 'population' || routerName == 'security' || routerName == 'alarm' || routerName == 'alarmAnalyse') {
                store.dispatch('searchBar/setDefaultFromPlatform', routerName);
				store.dispatch('searchBar/initSearchList', routerName);
			}
			if(routerName == 'alarm' || routerName == 'alarmAnalyse' || routerName == 'alarmDetail' || routerName == 'zone'){
				store.dispatch('alarm/setRouterName', routerName);
			}
			if(routerName == 'special'){
				store.dispatch('special/setDefaultFromPlatform', routerName);
			}
			
			if(routerName == 'userInfo'){
				store.dispatch('userInfo/updateScale', routerName);
			}
			
			/*//从搜索页跳转至小区页
			if(from.fullPath === '/index/search' && routerName === 'zone'){
				store.dispatch('platform/setDefaultFromSearchPage', 'platform');
			}*/
			
			//从搜索页跳转至小区平台 或 非小区平台
			if(from.fullPath === '/index/search' && (routerName === 'zonesearch' || routerName === 'platformsearch')){
				store.dispatch('platform/setDefaultFromSearchPage', routerName);
			}
			
			if(to.path.indexOf("index") != -1) {
				if(fromPath == 'platform' || fromPath == 'zone') {
					localStorage.sysName = store.getters['platform/currentName'];
				}
				store.commit('searchBar/updateSysName', localStorage.sysName);
			}
			next();
		}
	}
})

export default router;