

$(document).ready(function(){
	
	Oeasymain2dmap.init();
});

var Oeasymain2dmap = {
	map:null,
	Token:null,
	Icon:{
		'unitpoint':'images/unit.png',
		'unitpoints':'images/units.png',
		'video':'images/video.png',
		'unit':'images/xiaoqu.png',
		'null':''
	},
	Iconstyle:function(feature,resolution) {
		
		var style = new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(241,242,236,0.8)',
			}),
			stroke : new ol.style.Stroke({
				color : 'red',
				width : 2
			}),
			image:new ol.style.Icon(({
				offset: [0, 0],
				opacity: 1.0,
				rotateWithView: true,
				rotation: 0.0,
				scale: 1.0,
				size: [60, 40],
				anchor: [0.1, 0],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				src:Oeasymain2dmap.Icon[feature.get("type")]
			})),
			text: new ol.style.Text({
				font:'12px sans-serif',
				offsetX:0,
				offsetY:-7,
				placement:'point',
				backgroundStroke:new ol.style.Stroke({
					color:'rgba(255,51,0,1)',
					width:1
				}),
				//标签的背景填充
				backgroundFill:new ol.style.Fill({
					color:'rgba(255,51,0,1)'
				}),
				fill: new ol.style.Fill({
					color: 'rgba(255,255,255,1)',
					
					})
				})
		});
		
		if(feature.get('name')){
			style.getText().setText(resolution <0.00004291534423828125 ? feature.get('name') : '');
		}
		
		return [style];
	},
	
	
	vectorSource : new ol.source.Vector({
		wrapX : false
	}),
	vectorLayer : null,
	
	overlay : null, // 地图弹出信息窗口
	view: new ol.View({
		  projection: "EPSG:4326",
		  center: [oeasymapconfig.x,oeasymapconfig.y],
		  zoom: oeasymapconfig.zoom,
		  
		}),
			
	
	xqgeoSource: new ol.source.Vector(),//辖区资源
	xqgeolayer: null,
	Pheatmaplayer : null,
	PheatmapSource : new ol.source.Vector({
		wrapX : false
	}),
	Hheatmaplayer : null,
	HheatmapSource : new ol.source.Vector({
		wrapX : false
	}),
	heatmapFeatures:[],
	
	init:function(list){
		
		Oeasymain2dmap.vectorLayer = new ol.layer.Vector({
			source : Oeasymain2dmap.vectorSource,
			style : Oeasymain2dmap.Iconstyle,
			zIndex : 1000
		});
		// 初始弹出对象
		Oeasymain2dmap.overlay = new ol.Overlay(({
			element : document.getElementById("main2dmapPopup"),
			offset : [ -30, 30 ],
			positioning : "top-right",
			autoPan : true,
			autoPanAnimation : {
				duration : 250
			}
		}));
		
		var basemap = oeasymapconfig.streetmap();
		Oeasymain2dmap.map = new ol.Map({
			layers: [basemap],
			target: document.getElementById("main2dmap"),
			controls: ol.control.defaults({
			  attributionOptions: ({
				collapsible: false
			  })
			}),
			overlays : [ Oeasymain2dmap.overlay ],
			view: Oeasymain2dmap.view,
		  });
		
		Oeasymain2dmap.map.addLayer(Oeasymain2dmap.vectorLayer);
		
		setTimeout(function(){
			Oeasymain2dmap.addvideo();
			Oeasymain2dmap.addunitdata(list);
			Oeasymain2dmap.map.on("pointermove", function(e) {
				if (e.dragging) {
					return;
				}
				var pixel= Oeasymain2dmap.map.getEventPixel(e.originalEvent);
				var hit= Oeasymain2dmap.map.hasFeatureAtPixel(pixel);
				Oeasymain2dmap.map.getTarget().style.cursor= hit?'pointer':'';
				Oeasymain2dmap.mouseoverevt(pixel);    //鼠标停放事件
			});
			Oeasymain2dmap.map.on("click", function(evt){
				var feature= Oeasymain2dmap.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
					return feature;
				});
				
				if(feature){
					var type= feature.get("layername")?feature.get("layername"):"unknow";
					var geometry= feature.getGeometry();
					var coord= geometry.getCoordinates();
					switch(type){
					        case "UnitLayer":
							//跳转到三维GIS页面
							top.location.href = oeasymapconfig.gismapurl()+"?type=0";
					        
							break;
					}
				}
			});
		}, 1000);
		
		$("#main2dmaplink").attr("href",'javascript:window.top.location.href=\''+oeasymapconfig.gismapurl()+'\''); //设置超链接
	},
	
	mouseoverevt:function(pixel){
		var feature= Oeasymain2dmap.map.forEachFeatureAtPixel(pixel, function(feature, layer){
			return feature;
		});
		if(feature){
			var type= feature.get("layername")?feature.get("layername"):"unknow";
			var geometry= feature.getGeometry();
			var coord= geometry.getCoordinates();
			switch(type){
				/*****小区图层******/
				case "UnitLayer":
					//处理点击小区点图层事件的逻辑;
					var id = feature.get('id');
					var unit_id = feature.get('unit_id');
					var unit_name = feature.get('unit_name');
					//小区点上的提示，人流量和车流量
					$.ajax({
						url:oeasymapconfig.unitCount+"/unit/unitCount.do" ,
						   dataType: "json",
						   type: "POST",
						   data: {
							  "province_code":oeasymapconfig.province_code,
							  "unit_id":unit_id												  
						   },
						   xhrFields: {
							 withCredentials: true
						   }
						
					}).done(function(data){
						var doorCount,carCount;
						if(data.success == false){
							doorCount = 0;
							carCount = 0;
						}else{
							doorCount = data[0].doorCount;
							carCount = data[0].carCount;
						}
						var html = "";
						html += "";
						html += "<table style='font-size: 11px;color:white;width:auto;'>";
						html += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:25px;padding-left:3px;'>小区名称：" + unit_name +"</td></tr>";
						html += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:1px;padding-left:3px;'>今日人流：" + doorCount +"</td></tr>";
						html += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:3px;padding-left:3px;'>今日车流：" + carCount +"</td></tr>";
						html += "</table>";
						$("#main2dmapPopup-content").html(html);
						Oeasymain2dmap.overlay.setPosition(coord);
						
					}).fail(function(jqXHR, textStatus) { 
						var htmlf = "";
						htmlf += "";
						htmlf += "<table style='font-size: 11px;color:white;width:auto;'>";
						htmlf += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:25px;padding-left:3px;'>小区名称：" + unit_name +"</td></tr>";
						htmlf += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:1px;padding-left:3px;'>今日人流：0" +"</td></tr>";
						htmlf += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:3px;padding-left:3px;'>今日车流：0" +"</td></tr>";
						htmlf += "</table>";
						$("#main2dmapPopup-content").html(htmlf);
						Oeasymain2dmap.overlay.setPosition(coord);
					});
					
					break;
				case 'videoLayer':
					  var id = feature.get('id');
					  var lng = feature.get('lng');
					  var lat = feature.get('lat');
					  var videoname = feature.get('name');
					  var htmlvideo = "";
					  htmlvideo += "";
					  htmlvideo += "<table style='font-size: 11px;color:white;width:auto;'>";
					  htmlvideo += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:25px;padding-left:3px;'>名称：" + videoname +"</td></tr>";
					  htmlvideo += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:1px;padding-left:3px;'>经度：" + lng +"</td></tr>";
					  htmlvideo += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:3px;padding-left:3px;'>纬度：" + lat +" </td></tr>";
					  htmlvideo += "</table>";
					  $("#main2dmapPopup-content").html(htmlvideo);
					  Oeasymain2dmap.overlay.setPosition(coord);
					break;
				
					
			}
		}else{
			Oeasymain2dmap.overlay.setPosition(undefined);
		}
	},
	
	getUrlParam:function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg);  
		if (r != null) return unescape(r[2]); return null; 
	},
	
	
	addunitdata:function(){
		var city_code = Oeasymain2dmap.getUrlParam('city_code');
		var town_code = Oeasymain2dmap.getUrlParam('town_code');
		var police_code = Oeasymain2dmap.getUrlParam('police_code');
		var dataparam = null;
		if(city_code && town_code && police_code){
			dataparam = {
				"province_code":oeasymapconfig.province_code,
				"city_code":city_code,
				"town_code":town_code,
				"police_code":police_code					
			  };
		}else if(city_code && town_code && !police_code){
			dataparam = {
				"province_code":oeasymapconfig.province_code,
				"city_code":city_code,
				"town_code":town_code				
			  };
		}else if(city_code && !town_code && !police_code){
			dataparam = {
				"province_code":oeasymapconfig.province_code,
				"city_code":city_code			
			  };
		}else if(!city_code && !town_code && !police_code){
			dataparam = {
				"province_code":oeasymapconfig.province_code,
				"city_code":oeasymapconfig.city_code			
			  };
		}
		
		$.ajax({
			url:oeasymapconfig.unitInfo+"/unit/unitInfo.do" ,
			dataType: "json",
			type: "POST",
			data: dataparam,
			xhrFields: {
			   withCredentials: true
			}
			
		}).done(function(_dt){
			var data  = _dt.data;
			var projection = Oeasymain2dmap.map.getView().getProjection();
			if(data != null){
				if(data.length > 0){
					for (var i = 0; i < data.length; i++) {
					  var lng = Number(data[i].lng);
					  var lat = Number(data[i].lat);
					  var unitid = data[i].unit_id;
					  // 图上显示
					  var point = new ol.geom.Point([ lng, lat ]);
					  var iconFeature = new ol.Feature({
					  geometry : point,
					  id : data[i].unit_id,
					  layername : "UnitLayer",
					  unit_id: data[i].unit_id,
					  unit_name: data[i].unit_name,
					  lng:lng,
					  lat:lat,
					  type:"unit"
					 });
					 iconFeature.setId(data[i].unit_id);
					 Oeasymain2dmap.vectorSource.addFeature(iconFeature);
					 Oeasymain2dmap.heatmapFeatures.push(iconFeature);
				  }
			
				}
			}
			
		});
		
},
	
addvideo:function(){
	$.ajax({
		url:"js/json/video.json" ,
		dataType: "json",
		type: "GET",
		
	}).done(function(_dt){
		var data  = _dt.data;
		
		if(data != null){
			if(data.length > 0){
				for (var i = 0; i < data.length; i++) {
				  var lng = Number(data[i].lng);
				  var lat = Number(data[i].lat);
				  var code = data[i].code;
				  var name = data[i].name;
				  // 图上显示
				  var point = new ol.geom.Point([ lng, lat ]);
				  var iconFeature = new ol.Feature({
				  geometry : point,
				  id : code,
				  layername : "videoLayer",
				  name: name,
				  lng:lng,
				  lat:lat
				  
				 });
				 iconFeature.set("type", "video");
				 iconFeature.setId(code);
				 Oeasymain2dmap.vectorSource.addFeature(iconFeature);
			  }
		
			}
		}
		
	});
},

  showPheatmaplayer:function(){
	var hasChk = $('#showpeoplelayer').is(':checked');
	if(hasChk){
	  //添加热力图
	  Oeasymain2dmap.PheatmapSource.clear();
      Oeasymain2dmap.PheatmapSource.addFeatures(Oeasymain2dmap.heatmapFeatures);
      Oeasymain2dmap.Pheatmaplayer = new ol.layer.Heatmap({  
         source: Oeasymain2dmap.PheatmapSource,  
         blur:100,
         radius: 40,
         opacity : 0.6
      }); 

      Oeasymain2dmap.map.addLayer(Oeasymain2dmap.Pheatmaplayer);
	}else{
		Oeasymain2dmap.PheatmapSource.clear();
		Oeasymain2dmap.map.removeLayer(Oeasymain2dmap.Pheatmaplayer);
	}
	
  },

  showHheatmaplayer:function(){
	var hasChk = $('#showhouselayer').is(':checked');
	if(hasChk){
	  //添加热力图
	  Oeasymain2dmap.HheatmapSource.clear();
      Oeasymain2dmap.HheatmapSource.addFeatures(Oeasymain2dmap.heatmapFeatures);
      Oeasymain2dmap.Hheatmaplayer = new ol.layer.Heatmap({  
         source: Oeasymain2dmap.HheatmapSource,  
         blur:60,
         radius: 30,
         opacity : 0.6
      }); 

      Oeasymain2dmap.map.addLayer(Oeasymain2dmap.Hheatmaplayer);
	}else{
		Oeasymain2dmap.HheatmapSource.clear();
		Oeasymain2dmap.map.removeLayer(Oeasymain2dmap.Hheatmaplayer);
	}
  }




		
};