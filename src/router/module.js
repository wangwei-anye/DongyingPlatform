import HelloWorld from '@/views/module/HelloWorld'
import index from '@/views/index'
import Login from '@/views/Login'
import CompleteInfo from '@/views/CompleteInfo'
import UserInfo from '@/views/UserInfo'
import CarInfo from '@/views/CarInfo'
import Platform from '@/views/Platform'
import Platform2 from '@/views/Platform2'
import Zone from '@/views/Zone'
import Zone2 from '@/views/Zone2'
import HouseIndex from '@/views/house/HouseIndex'
import SecurityIndex from '@/views/security/SecurityIndex'
import Population from '@/views/population/Index'
import Special from '@/views/special/index'
import Usercenter from '@/views/usercenter/Usercenter'
import Device from '@/views/device/Device'
import Logdata from '@/views/logdata/Logdata'
import Permission from '@/views/permission/Permission'
import Permission_new from '@/views/permission/Permission_new'
import Estate from '@/views/estate/index'
import Safety from '@/views/safety/index'
import SafetyRanking from '@/views/safety/ranking'
import Trip from '@/views/trip/index'
import Watch from '@/views/watch/index'
import Goodsdefense from '@/views/watch/goodsdefense'
import Staffdefense from '@/views/watch/staffdefense'
import Techdefense from '@/views/watch/techdefense'
import Tdmap from '@/views/tdmap/index'
import Alarm from '@/views/alarm/Alarm'
import AlarmDetail from '@/views/alarm/AlarmDetail'
import AlarmAnalyse from '@/views/alarm/AlarmAnalyse'
import SecuritySet from '@/views/security/SecuritySet'
import Search from '@/views/search/index'
import platformSearch from '@/views/platformSearch'
import zoneSearch from '@/views/zoneSearch'
import AllDoorRecord from '@/views/search/AllDoorRecord'
import AllCarRecord from '@/views/search/AllCarRecord'
import AllVisitor from '@/views/search/AllVisitor'
import WatchSet from '@/views/watch/watchset'
import SafetySet from '@/views/safety/safetyset'
import Monitor from '@/views/monitor/monitor'

const moduleRouter = [
	// 首页
	{
		path: '/index',
		name: 'moduleIndex',
		component: index,
		children: [{
				path: 'house',
				component: HouseIndex
			},
			{
				path: 'security',
				component: SecurityIndex
			},
			{
				path: 'population',
				component: Population
			},
			{
				path: 'special',
				component: Special
			},
			{
				path: 'estate',
				component: Estate
			},
			{
				path: 'safety',
				component: Safety
			},
			{
				path: 'trip',
				component: Trip
			},
			{
				path: 'watch',
				component: Watch,
			},
			{
				path: 'monitor',
				component: Monitor,
			},
			{
				path: 'watchset',
				component: WatchSet
			},
			{
				path: 'safetyset',
				component: SafetySet
			},
			{
				path: 'tdmap',
				component: Tdmap,
			},
			{
				path: 'alarm',
				component: Alarm,
			},
			{
				path: 'alarmDetail',
				component: AlarmDetail,
			},
			{
				path: 'alarmAnalyse',
				component: AlarmAnalyse,
			},
			{
				path: 'securitySet',
				component: SecuritySet,
			},
			{
				path: 'search',
				component: Search,
			},
			{
				path: 'permission',
				component: Permission_new
			},
			{
				path: 'usercenter',
				component: Usercenter
			},
			{
				path: 'device',
				component: Device
			},
			{
				path: 'logdata',
				component: Logdata
			}
		]
	},
	// 登录页面
	{
		path: '/login',
		name: 'moduleLogin',
		component: Login
	},
	// 个人信息补充页面
	{
		path: '/completeInfo',
		component: CompleteInfo
	},
	// 个人信息页面
	{
		path: '/userInfo',
		component: UserInfo
	},
	// 车辆信息页面
	{
		path: '/carInfo',
		component: CarInfo
	},
	// 平台页面
	{
		path: '/platform',
		name: 'modulePlatform',
		component: Platform2
	},
	{
		path: '/platform2',
		name: 'modulePlatform2',
		component: Platform
	},
	// 小区平台页面
	{
		path: '/zone',
		name: 'moduleZone',
		component: Zone2
  },
  {
    path: '/zone2',
    name: 'moduleZone2',
    component: Zone
  },
	// 权限管理
	{
		path: '/permission',
		name: 'permission',
		component: Permission
	},
	{
		path: '/ranking',
		component: SafetyRanking
	},
	{
		path: '/goodsdefense',
		component: Goodsdefense
	},
	{
		path: '/staffdefense',
		component: Staffdefense
	},
	{
		path: '/techdefense',
		component: Techdefense
	},
	{ //搜索进入非小区平台界面路由
		path: '/platformsearch',
		component: platformSearch
	},
	{ //搜索进入小区平台界面路由
		path: '/zonesearch',
		component: zoneSearch
	},
	{ //搜索进入更多门禁数据界面路由
		path: '/alldooorrecord',
		component: AllDoorRecord
	},
	{ //搜索进入更多车流数据界面路由
		path: '/allcarrecord',
		component: AllCarRecord
	},
	{ //搜索进入更多访客数据界面路由
		path: '/allvisitor',
		component: AllVisitor
	}
]

export default moduleRouter