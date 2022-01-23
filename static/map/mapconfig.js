var oeasymapconfig = {
     //公司内部测试地址
      unitInfo:'http://192.168.20.36:8888/portal',   //小区热力图接口-庞嘉铭
      unitCount:'http://192.168.20.36:8888/portal',   //当天小区分组开门、车流次数统计接口-胡自雷
      speicalPerson:'http://192.168.20.36:8888/portal',                 //特殊人员分布接口
      patrolPercentOfPassHotSpot:'http://192.168.20.36:8888',    //小区巡查合格率发布热点图
      alarm:'http://192.168.20.41:11030',                                             //告警地图
      return3dgispage:'http://192.168.20.36/#/index/tdmap',    //跳转到3DGIS页面
  
  // 东营经济开发区公安网
  // unitInfo:'http://10.162.154.31:6525/portal',   
  // unitCount:'http://10.162.154.31:6525/portal',   
  // speicalPerson:'http://10.162.154.31:6525/portal',                 
  // patrolPercentOfPassHotSpot:'http://10.162.154.31:6525', 
  // alarm:'http://192.168.7.77:9023', 
  // return3dgispage:'http://10.162.154.31/#/index/tdmap',    //跳转到3DGIS页面  

  
//// 公司线上地址
//unitInfo:'https://security.0easy.com/yihao01-bigdata-portal',   //小区热力图接口-庞嘉铭
//unitCount:'https://security.0easy.com/yihao01-bigdata-portal',   //当天小区分组开门、车流次数统计接口-胡自雷
//speicalPerson:'https://security.0easy.com/yihao01-bigdata-portal',                 //特殊人员分布接口
//patrolPercentOfPassHotSpot:'https://security.0easy.com/yihao01-bigdata-portal',    //小区巡查合格率发布热点图
//alarm:'http://security.0easy.com', 
//return3dgispage:'http://zimg.0easy.com/portal/#/index/tdmap',    //跳转到3DGIS页面
  
  
  /* 以下为方便各个城市部署，提取公共部分  */
  province_code:'370000',   //部署所在省份，为山东省
  city_code:'370500',      //部署所在省下的市，为东营市
  x:118.786839,    //市中心点经度坐标，昆明市中心经度
  y:37.414662,     //市中心点纬度坐标，昆明市中心纬度
  zoom: 12,
	minZoom:12,
  maxZoom:12,
  
  /* 以下为东营经济开发区发布瓦片地图服务方式调用 */
  town_code:'370502',  //东营经济开发区
  maptype:'2',   // 0表示陈叶本地离线地图服务，1表示公安内网pgis地图服务，2表示Arcgis在线午夜蓝地图服务
  streetmap:function(){
	  var type = null;
	  switch (oeasymapconfig.maptype){
      case '0':
          type = new ol.layer.Tile({
            opacity: 1.0,
            source: new ol.source.XYZ({
              url: 'http://192.168.4.199\:7080/PBS/rest/services/dyjingjistreet/MapServer/WMTS/tile/1.0.0/dyjingjistreet/default/nativeTileMatrixSet/{z}/{y}/{x}.jpg'
            })
          });
      
      break;
		  case '1':
          //公安内网二维街景地图服务，由公安提供
          var projection = ol.proj.get('EPSG:4326');
          var projectionExtent = projection.getExtent();
          var size= ol.extent.getWidth(projectionExtent) / 256;
          var resolutions= new Array(20);
          var matrixIds= new Array(20);
          for (var z=0; z<20; ++z) {
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
          }
          
          type= new ol.layer.Tile({
            extent:projectionExtent,
            source: new ol.source.WMTS({
              url: 'http://10.32.203.95/PGIS_S_TileMapServer/Maps/YXTDT?SERVICE\=WMTS',  //图层服务
              layer: 'JSSLDT',          //图层名称
              matrixSet:"EPSG:4326",
              format: "tiles",
              projection: projection,
              tileGrid: new ol.tilegrid.WMTS({
                origin: ol.extent.getTopLeft(projectionExtent),
                resolutions: resolutions,
                matrixIds: matrixIds
              }),
              style: "default",
              wrapX: true
              })
          });
      break;
      case '2':
         type = new ol.layer.Tile({
          source: new ol.source.TileArcGISRest({
            url: 'https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
          })
        })
      break;
	  }
	  return type ;
  },
  imagemap:function(){
	  var type = '';
	  switch (oeasymapconfig.maptype){
		  case '0':
		  type = 'http://192.168.4.199\:7080/PBS/rest/services/dyjingjiimage/MapServer/WMTS/tile/1.0.0/dyjingjiimage/default/nativeTileMatrixSet/{z}/{y}/{x}.jpg';
		  break;
		  case '1':
		  type = 'http://10.32.203.95/PGIS_S_TileMapServer/Maps/YXTDT?SERVICE\=WMTS';  //公安内网二维卫星影像地图服务，由公安提供
		  break;
	  }
	  return type ;
  },
  gismapurl:function(){
    var tmp = '';
    tmp = window.location.protocol+"//"+window.location.host+"/#/index/tdmap" ;
    return tmp ;
  },
  gis3durl:'http://192.168.4.199:8090/oeasy3dmap',
  
};
