const ENV = process.env.NODE_ENV;

var apiAddr = '',
    wsAddr = '',
    wsAddrPort = '',
    imgServerAddr = '',
    zoneMapSrc = '',
    GIS3D = '',
    alarmAddr = '',
    province_code = '',
    city_code = '',
    city_name = '';

if (ENV === 'development') {
  apiAddr = 'http://192.168.20.36:8888/portal';    // 测试服务器
//     apiAddr = 'http://192.168.5.170:8080/portal';     // 贺叶龙
//     apiAddr = 'http://192.168.4.55:8080/portal';     // 庞佳明
//     apiAddr = 'http://192.168.5.176:8080/portal';     // 懒坤滨

  wsAddr = '192.168.20.33'  // 告警中心WS地址
  wsAddrPort = 8083  // 告警中心WS端口
  alarmAddr = 'http://192.168.20.35:11030';   // 告警中心接口地址
   
  imgServerAddr = 'http://192.168.20.39:5869';       // 图片服务器地址
  GIS3D = 'http://192.168.4.199:8090/oeasy3dmap';     // 3d GIS 地址
  zoneMapSrc = 'http://192.168.4.199:8090/unitmap';   // 小区地图地址
  province_code = '370000';
  city_code = '370500';
  city_name = '东营'; 
}

if (ENV === 'production') {
    //公司内部测试地址
       apiAddr = 'http://192.168.20.36:8888/portal';
        wsAddr = '192.168.20.33'  // 告警中心WS地址
       wsAddrPort = 8083  // 告警中心WS端口
       alarmAddr = 'http://192.168.20.35:11030';   // 告警中心接口地址
       imgServerAddr = 'http://192.168.20.39:5869';
       GIS3D = 'http://192.168.4.199:8090/oeasy3dmap';
       zoneMapSrc = 'http://192.168.4.199:8090/unitmap';
  
  // 铜仁公安网
  // apiAddr = 'http://10.162.154.31:6525/portal';      // Java 服务
  //  wsAddr = '10.162.154.31'           // 告警中心WS地址
   //  wsAddrPort = 6529                 // 告警中心WS端口
   // alarmAddr = 'http://10.162.154.31:6529';              // 告警中心接口地址
  // imgServerAddr = 'http://10.162.154.31:6522';      // 图片服务器地址
  // GIS3D = '';     // 3d GIS 地址，公安网没有部署
  // zoneMapSrc = '';   // 小区地图地址，公安网没有部署

  // 印江视频网
  // apiAddr = 'http://52.99.10.122:8080/portal';       // Java 服务
  //  wsAddr = '52.99.10.121'                    // 告警中心WS地址
  //  wsAddrPort = 5023                         // 告警中心WS端口
   // alarmAddr = 'http://52.99.10.121:5023';     // 告警中心接口地址
  // imgServerAddr = 'http://52.91.10.20:6300';         // 图片服务器地址
  // GIS3D = 'http://52.99.10.124:5090/oeasy3dmap';     // 3d GIS 地址
  // zoneMapSrc = 'http://52.99.10.124:5090/unitmap';   // 小区地图地址

  // 公司线上
//apiAddr = 'https://security.0easy.com/yihao01-bigdata-portal/';       // Java 服务
//wsAddr = '123.58.43.36'           // 告警中心WS地址
//wsAddrPort = 50023                 // 告警中心WS端口
//alarmAddr = 'http://security.0easy.com';      // 告警中心接口地址
//imgServerAddr = 'https://security.0easy.com/img/';         // 图片服务器地址
//GIS3D = 'http://trgis.0easy.com/oeasy3dmap';     // 3d GIS 地址
//zoneMapSrc = 'http://trgis.0easy.com/unitmap';   // 小区地图地址
  
  // 默认城市
  province_code = '370000';
  city_code = '370500';
  city_name = '东营';
//province_code = '530000';
//city_code = '530100';
//city_name = '昆明'; 
}

if (ENV === 'testing') {

}

export {
  apiAddr,
  wsAddr,
  wsAddrPort,
  imgServerAddr,
  GIS3D,
  zoneMapSrc,
  alarmAddr,
  province_code,
  city_code,
  city_name
 }
