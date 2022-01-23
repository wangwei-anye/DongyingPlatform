

$(document).ready(function(){
	
	Oeasyhousedatamap.init();
});

var Oeasyhousedatamap = {
		map:null,
		
		Icon:{
			'unitpoint':'images/unit.png',
			'unitpoints':'images/units.png',
			'countypoint':'images/point.png',
			'null':''
		},
		Iconstyle:function(feature) {
			return [new ol.style.Style({
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
				    size: [32, 32],
				    anchor: [0.0, 0.0],
				    anchorXUnits: 'fraction',
				    anchorYUnits: 'pixels',
					src:Oeasyhousedatamap.Icon[feature.get("type")]
				})),
				text: new ol.style.Text({
					text: feature.get("name"),
					font:'12px sans-serif',
					offsetX:0,
					offsetY:-5,
					fill: new ol.style.Fill({
						color: '#FFFfff'
						})
					})
			})];
		},
		
		unitstyle:function(feature) {
			return [new ol.style.Style({
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
				    size: [32, 32],
				    anchor: [0.0, 0.0],
				    anchorXUnits: 'fraction',
				    anchorYUnits: 'pixels',
					src:Oeasyhousedatamap.Icon[feature.get("type")]
				}))
				
			})];
		},
		
		/**
		 * 经纬度转为莫卡托坐标
		 */
		  lonlat2mercator: function(lng,lat){ 
			lng = parseFloat(lng);
			lat = parseFloat(lat);
			var  mercator={x:0,y:0}; 
			var x = lng *20037508.34/180; 
			var y = Math.log(Math.tan((90+lat)*Math.PI/360))/(Math.PI/180); 
			y = y *20037508.34/180; 
			mercator.x = x; 
			mercator.y = y; 
			return mercator ; 
		},

		/**
		 * 莫卡托坐标转为经纬度
		 */
		mercator2lonlat:function (lng,lat){
			lng = parseFloat(lng);
			lat = parseFloat(lat);
			var lonlat={x:0,y:0};
			var x = lng/20037508.34*180;
			var y = lat/20037508.34*180;
			y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
			lonlat.x = x;
			lonlat.y = y;
			return lonlat;
		},
		
		vectorSource : new ol.source.Vector({
			wrapX : false
		}),
		vectorLayer : null,
		layers:new ol.layer.Tile(),
		heatmaplayer : null,
		heatmapSource : new ol.source.Vector({
			wrapX : false
		}),
		overlay : null, // 地图弹出信息窗口
		view: new ol.View({
			  projection: "EPSG:4326",
	          center: [oeasymapconfig.x,oeasymapconfig.y],
	          zoom: 9,
	          minZoom:9,
	          maxZoom:9
	        }),
	             
	    allPCSStyle:function(color){
			    var style = null;
			    if (!style) {
				      style = [new ol.style.Style({
				    	  fill: new ol.style.Fill({
								color: color,
							}),
						stroke: new ol.style.Stroke({
								color: 'rgba(192,192,192,0.3)',
								width: 0.4,
								lineDash:[1,2,3,4,5,6,7,8,9,10]
							}),  
				        image: new ol.style.Icon({
					        offset: [0,0],
					        opacity: 1.0,
					        rotateWithView: true,
					        rotation: 0.0,
					        scale: 1.0
					      }),
				      })];
			    }
			    return style;
		},
	    tongrenshiStyle:function(color){
		    var style = null;
		    if (!style) {
			      style = [new ol.style.Style({
			    	  
					stroke: new ol.style.Stroke({
							color: 'rgba(0,128,192,0.6)',
							width: 6
						})  
			      })];
		    }
		    return style;
	    },
		polygonselectStyle:function(){
			    var style = null;
			    if (!style) {
			    	style = [new ol.style.Style({
				    	  fill: new ol.style.Fill({
								color: 'rgba(255, 48,48, 0.7)',
							}),
						stroke: new ol.style.Stroke({
								color: 'rgba(255, 48,48, 0.7)',
								width: 3
							}) 
				      })];
			    }
			    return style;
		},
		
		gaocolor:'rgba(20, 123, 188,1)',
		zhongcolor:'rgba(14, 73, 117,1)',
		dicolor:'rgba(0,83, 153,1)',
			
		xqgeoSource: new ol.source.Vector(),//辖区资源
		xqgeolayer: null,
		
		
		init:function(list){
			
			Oeasyhousedatamap.vectorLayer = new ol.layer.Vector({
				source : Oeasyhousedatamap.vectorSource,
				style : Oeasyhousedatamap.Iconstyle,
				zIndex : 1000
			});
			
			
			Oeasyhousedatamap.map = new ol.Map({
				
		        target: document.getElementById("housemap"),
		        view: Oeasyhousedatamap.view,
		      });
			Oeasyhousedatamap.map.addLayer(Oeasyhousedatamap.vectorLayer);
			Oeasyhousedatamap.xqgeolayer = new ol.layer.Vector({
				source : Oeasyhousedatamap.xqgeoSource
				
			});
			Oeasyhousedatamap.map.addLayer(Oeasyhousedatamap.xqgeolayer);
			Oeasyhousedatamap.addcountylayer();
			
			setTimeout(function(){

				Oeasyhousedatamap.addunitdata(list);
				
			}, 1000);
			
			
			
		},
		
		getUrlParam:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
            var r = window.location.search.substr(1).match(reg);  
            if (r != null) return unescape(r[2]); return null; 
        },
		
		//添加小区点
		addunitdata:function(list){
			var city_code = Oeasyhousedatamap.getUrlParam('city_code');
			var town_code = Oeasyhousedatamap.getUrlParam('town_code');
			var township_code = Oeasyhousedatamap.getUrlParam('township_code');
			var village_code = Oeasyhousedatamap.getUrlParam('village_code');
			var dataparam = null;
			if(city_code == null){
				dataparam = {
    			    "province_code":oeasymapconfig.province_code,
    			    "city_code":oeasymapconfig.city_code			
    			  };
			}else if(city_code !='' && town_code==''){
				dataparam = {
    			    "province_code":oeasymapconfig.province_code,
    			    "city_code":city_code			
    			  };
			}else if(city_code !='' && town_code != ''){
				dataparam = {
    			    "province_code":oeasymapconfig.province_code,
    			    "city_code":city_code,
                    "town_code":town_code				
    			  };
			}else if(township_code !='' && town_code == null){
				dataparam = {
    			    "province_code":oeasymapconfig.province_code,
    			    "city_code":city_code,
                    "town_code":town_code,
                    "township_code":township_code					
    			  };
			}else if(township_code !='' && town_code != ''){
				dataparam = {
    			    "province_code":oeasymapconfig.province_code,
    			    "city_code":city_code,
                    "town_code":town_code,
                    "township_code":township_code,
                    "village_code":village_code					
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
    			var projection = Oeasyhousedatamap.map.getView().getProjection();
				if(data != null){
					if(data.length > 0){
    				  for (var i = 0; i < data.length; i++) {
        				var lng = data[i].lng;
        				var lat = data[i].lat;
        				var unitid = data[i].unit_id;
        				// 图上显示
        				var point;
        				if (projection.getCode() != "EPSG:4326") {
        					var lnglat = Oeasyhousedatamap.lonlat2mercator(lng, lat);
        					point = new ol.geom.Point([ lnglat.x, lnglat.y ]);
        				} else {
        					point = new ol.geom.Point([ lng, lat ]);
        				}
        				
        				var iconFeature = new ol.Feature({
        					geometry : point
        	                
        				});
        				Oeasyhousedatamap.heatmapSource.addFeature(iconFeature);
        			  }
        			
        			//添加热力图
        			  Oeasyhousedatamap.heatmaplayer = new ol.layer.Heatmap({  
                        source: Oeasyhousedatamap.heatmapSource,  
                        blur: 46,
                        radius: 22,
                        opacity : 0.8
                        
                      }); 
        			  Oeasyhousedatamap.heatmaplayer.getSource().on('addfeature', function(event) {
        		        
        		        var name = event.feature.get('count');
        		        var magnitude = parseFloat(name.substr(2));
        		        event.feature.set('weight', magnitude - 5);
        		      });
        			  Oeasyhousedatamap.map.addLayer(Oeasyhousedatamap.heatmaplayer);
    			     }else{
    				   console.log("无房屋数据，无法形成热力图效果！");
    			    }
				}
    			
    			
    		});
			
	    },
	    
	    addtongrenshilayer:function(){
			$.ajax({
    			url:"js/tongrenshi.json" ,
    			dataType: "json",
    			type: "GET"
    			
    		}).done(function(_dt){
    			var format = new ol.format.GeoJSON();
				var features = format.readFeatures(_dt, {
					dataProject : "EPSG:4326",
					featureProjection : "EPSG:4326"
				});
				var addNameFeatures = [];
				if(features.length >0){
					for (var i = 0; i < features.length; i++) {
						var f = features[i];
						f.set("type", "xq");
						f.set("id", f.U.ADCODE99);
						f.set("adcode99", f.U.ADCODE99);
						f.setId(f.U.ADCODE99);
					    addNameFeatures.push(f);
						f.setStyle(Oeasyhousedatamap.tongrenshiStyle(Oeasyhousedatamap.dicolor));
						
					}
					Oeasyhousedatamap.xqgeoSource.addFeatures(addNameFeatures);
					
					
				}
    		});
			
		},
		 
		//添加行政区面，并设置行政区名称
		addcountylayer:function(){
			var city_code = Oeasyhousedatamap.getUrlParam('city_code');
			var town_code = Oeasyhousedatamap.getUrlParam('town_code');
			$.ajax({
    			url:"js/countynew.json" ,
    			dataType: "json",
    			type: "GET"
    			
    		}).done(function(_dt){
    			var format = new ol.format.GeoJSON();
				var features = format.readFeatures(_dt, {
					dataProject : "EPSG:4326",
					featureProjection : "EPSG:4326"
				});
    			
				var addNameFeatures = [];
				if(features.length >0){
					
					for (var i = 0; i < features.length; i++) {
						var f = features[i];
						f.set("type", "xq");
						f.set("id", f.U.ADCODE99);
						f.set("adcode99", f.U.ADCODE99);
						f.setId(f.U.ADCODE99);
						f.setStyle(Oeasyhousedatamap.allPCSStyle(Oeasyhousedatamap.dicolor));
						//根据区域中心，设置中心点名称图标
						var point = null;
						var iconFeature = null;
						
						if(city_code ==undefined && town_code == undefined || city_code =="" && town_code == ""){
							addNameFeatures.push(f);
							point = new ol.geom.Point([ f.U.CENTROID_X, f.U.CENTROID_Y ]);
						    iconFeature = new ol.Feature({
							  geometry : point,
							  townCode : f.U.ADCODE99,
			                  townName: f.U.NAME99,
			                  name: f.U.NAME99,
			                  layername:"countypoint",
			                  lng:f.U.CENTROID_X,
			                  lat:f.U.CENTROID_Y
						    });
						    iconFeature.set("type", "");
						    iconFeature.setId(f.U.ADCODE99);
						    Oeasyhousedatamap.vectorSource.addFeature(iconFeature);
						}else if(city_code != '' && town_code == ""){
							addNameFeatures.push(f);
							point = new ol.geom.Point([ f.U.CENTROID_X, f.U.CENTROID_Y ]);
						    iconFeature = new ol.Feature({
							  geometry : point,
							  townCode : f.U.ADCODE99,
			                  townName: f.U.NAME99,
			                  name: f.U.NAME99,
			                  layername:"countypoint",
			                  lng:f.U.CENTROID_X,
			                  lat:f.U.CENTROID_Y
						    });
						    iconFeature.set("type", "");
						    iconFeature.setId(f.U.ADCODE99);
						    Oeasyhousedatamap.vectorSource.addFeature(iconFeature);
						}else if(city_code != '' && town_code == f.U.ADCODE99){
							addNameFeatures.push(f);
							point = new ol.geom.Point([ f.U.CENTROID_X, f.U.CENTROID_Y ]);
						    iconFeature = new ol.Feature({
							  geometry : point,
							  townCode : f.U.ADCODE99,
			                  townName: f.U.NAME99,
			                  name: f.U.NAME99,
			                  layername:"countypoint",
			                  lng:f.U.CENTROID_X,
			                  lat:f.U.CENTROID_Y
						    });
						    iconFeature.set("type", "");
						    iconFeature.setId(f.U.ADCODE99);
						    Oeasyhousedatamap.vectorSource.addFeature(iconFeature);
							//居中定位
					        var coordinates = f.U;
					        Oeasyhousedatamap.map.setView(new ol.View({ 
						        projection: "EPSG:4326",
						        center: [coordinates.CENTROID_X, coordinates.CENTROID_Y], 
						        zoom: 10,
                                minZoom:10,
	                            maxZoom:10								
					        }));
						}
					    
						
						
					}
                    Oeasyhousedatamap.xqgeoSource.addFeatures(addNameFeatures);
					
				}
    		});
			
		},
		
      
		
		
  };