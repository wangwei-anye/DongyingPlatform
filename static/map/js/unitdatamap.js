

$(document).ready(function(){
	
	Oeasyunitdatamap.init();
});

var Oeasyunitdatamap = {
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
					src:Oeasyunitdatamap.Icon[feature.get("type")]
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
					src:Oeasyunitdatamap.Icon[feature.get("type")]
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
		clusterlayer : null,
		clusterSource : new ol.source.Vector({
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
		currentResolution:null,
	    maxFeatureCount:0,
	    earthquakeFill : new ol.style.Fill({
	        color: 'rgba(8,169,208,1)'
	      }),
	    earthquakeStroke : new ol.style.Stroke({
	        color: 'rgba(255, 255, 255, 1)',
	        width: 1
	      }),
	    textFill : new ol.style.Fill({
	        color: 'rgba(255, 255, 255, 1)'
	      }),
	    textStroke : new ol.style.Stroke({
	        color: 'rgba(255, 255, 255, 1)',
	        width: 1
	      }),
	    invisibleFill : new ol.style.Fill({
	        color: 'rgba(8,169,208,0.01)'
	      }),
		
		init:function(){
			
			Oeasyunitdatamap.vectorLayer = new ol.layer.Vector({
				source : Oeasyunitdatamap.vectorSource,
				style : Oeasyunitdatamap.Iconstyle,
				zIndex : 1000
			});
			
			Oeasyunitdatamap.map = new ol.Map({
				interactions: ol.interaction.defaults().extend([new ol.interaction.Select({
					condition: function(evt) {
						var pixel= Oeasyunitdatamap.map.getEventPixel(evt.originalEvent);
	                    var feature= Oeasyunitdatamap.map.forEachFeatureAtPixel(pixel, function(feature, layer){
	                        return feature;
	                    });
					    if(feature !=undefined && feature.get("type")=='xq' ){
						    return false;
					    }
						if(feature !=undefined && feature.get("type")=='xx' ){
						    return false;
					    }
			            return  evt.type == 'pointermove' ||
			                evt.type == 'singleclick';
			          },
			          style: Oeasyunitdatamap.selectStyleFunction
			        })]),
		        target: document.getElementById("unitmap"),
		        
		        view: Oeasyunitdatamap.view,
		      });
			Oeasyunitdatamap.map.addLayer(Oeasyunitdatamap.vectorLayer);
			Oeasyunitdatamap.xqgeolayer = new ol.layer.Vector({
				source : Oeasyunitdatamap.xqgeoSource
				
			});
			Oeasyunitdatamap.map.addLayer(Oeasyunitdatamap.xqgeolayer);
			//Oeasyunitdatamap.addtongrenshilayer();
			Oeasyunitdatamap.addcountylayer();
			
			setTimeout(function(){

				Oeasyunitdatamap.addunitdata();
				
			}, 1000);
			
			
			
		},
		
		//添加小区点
		addunitdata:function(){
			var city_code = Oeasyunitdatamap.getUrlParam('city_code');
			var town_code = Oeasyunitdatamap.getUrlParam('town_code');
			var township_code = Oeasyunitdatamap.getUrlParam('township_code');
			var village_code = Oeasyunitdatamap.getUrlParam('village_code');
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
    			var projection = Oeasyunitdatamap.map.getView().getProjection();
				if(data != null){
					if(data.length > 0){
						for (var i = 0; i < data.length; i++) {
    				      var lng = Number(data[i].lng);
    				      var lat = Number(data[i].lat);
    				      var unitid = data[i].unit_id;
    				      // 图上显示
    				      var point;
    				      if (projection.getCode() != "EPSG:4326") {
    				     	var lnglat = Oeasyunitdatamap.lonlat2mercator(lng, lat);
    					    point = new ol.geom.Point([ lnglat.x, lnglat.y ]);
    				      } else {
    					    point = new ol.geom.Point([ lng, lat ]);
    				      }
    				
    				     var iconFeature = new ol.Feature({
    					  geometry : point,
    	                  id : data[i].unit_id,
    	                  layername : "UnitLayer",
    	                  unit_id: data[i].unit_id,
    	                  unit_name: data[i].unit_name,
    	                  name: data[i].unit_name,
    	                  lng:lng,
    	                  lat:lat,
    	                  address:data[i].address,
    	                  isglow:"0",
    	                  ismove:"0"
    				     });
    				     iconFeature.set("type", "unitpoint");
    				     iconFeature.setId(data[i].unit_id);
    				     Oeasyunitdatamap.clusterSource.addFeature(iconFeature);
    			    }
    			
    			    //添加聚合图
    			    var clusterSource = new ol.source.Cluster({  
    			       distance:100,  
    			       source: Oeasyunitdatamap.clusterSource  
    			     });
    			    Oeasyunitdatamap.clusterlayer = new ol.layer.Vector({  
                      source: clusterSource,  
                      style : Oeasyunitdatamap.styleFunction
                     }); 
    			    Oeasyunitdatamap.map.addLayer(Oeasyunitdatamap.clusterlayer);
					}
				}
    			
    		});
			
	},
		
	calculateClusterInfo:function(resolution) {
			Oeasyunitdatamap.maxFeatureCount = 0;
	        var features = Oeasyunitdatamap.clusterlayer.getSource().getFeatures();
	        var feature, radius;
	        for (var i = features.length - 1; i >= 0; --i) {
	          feature = features[i];
	          var originalFeatures = feature.get('features');
	          var extent = ol.extent.createEmpty();
	          var j, jj;
	          for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
	            ol.extent.extend(extent, originalFeatures[j].getGeometry().getExtent());
	          }
	          Oeasyunitdatamap.maxFeatureCount = Math.max(Oeasyunitdatamap.maxFeatureCount, jj);
	          radius = 0.25 * (ol.extent.getWidth(extent) + ol.extent.getHeight(extent)) /
	              resolution;
	          feature.set('radius', radius);
	        }
	  },
	     
	  selectStyleFunction:function(feature) {
	          var styles = [new ol.style.Style({
	            image: new ol.style.Circle({
	              radius: feature.get('radius'),
	              fill: Oeasyunitdatamap.invisibleFill
	            })
	          })];
	          
	          var originalFeatures = feature.get('features');
	          
	          var originalFeature;
	          for (var i = originalFeatures.length - 1; i >= 0; --i) {
	            originalFeature = originalFeatures[i];
	            styles.push(Oeasyunitdatamap.createEarthquakeStyle(originalFeature));
	          }
	          return styles;
	   },
	      
	   createEarthquakeStyle:function(feature) {        
	        return new ol.style.Style({
	        	geometry: feature.getGeometry(),
				image: new ol.style.Circle({
					    radius: 4,
					    opacity: 0.4,
					    snapToPixel: false,
					    fill: new ol.style.Fill({color: 'rgba(8,169,208,1)'}),
					    stroke: new ol.style.Stroke({color: 'rgba(8,169,208,1)', width: 2})
					  })
				});
       
	    },
	      
		styleFunction:function(feature, resolution) {
	        if (resolution != Oeasyunitdatamap.currentResolution) {
	        	Oeasyunitdatamap.calculateClusterInfo(resolution);
	        	Oeasyunitdatamap.currentResolution = resolution;
	        }
	        var style;
	        var size = feature.get('features').length;
	        if (size > 1) {
	          style = new ol.style.Style({
	            image: new ol.style.Circle({
	              radius: feature.get('radius'),
	              fill: new ol.style.Fill({
	                color: [8,169,208, Math.min(0.8, 0.4 + (size / Oeasyunitdatamap.maxFeatureCount))]
	              })
	            }),
	            text: new ol.style.Text({
	              text: size.toString(),
	              fill: Oeasyunitdatamap.textFill,
	              stroke: Oeasyunitdatamap.textStroke
	            })
	          });
	        } else {
	          var originalFeature = feature.get('features')[0];
	          style = Oeasyunitdatamap.createEarthquakeStyle(originalFeature);
	        }
	        return style;
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
							f.setStyle(Oeasyunitdatamap.tongrenshiStyle(Oeasyunitdatamap.dicolor));
							
						}
						Oeasyunitdatamap.xqgeoSource.addFeatures(addNameFeatures);
						
						
					}
	    		});
				
			},
			
		getUrlParam:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
            var r = window.location.search.substr(1).match(reg);  
            if (r != null) return unescape(r[2]); return null; 
        },
		
		//添加行政区面，并设置行政区名称
		addcountylayer:function(){
			var city_code = Oeasyunitdatamap.getUrlParam('city_code');
			var town_code = Oeasyunitdatamap.getUrlParam('town_code');
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
						f.setStyle(Oeasyunitdatamap.allPCSStyle(Oeasyunitdatamap.dicolor));
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
						    iconFeature.set("type", "xx");
						    iconFeature.setId(f.U.ADCODE99);
						    Oeasyunitdatamap.vectorSource.addFeature(iconFeature);
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
						    iconFeature.set("type", "xx");
						    iconFeature.setId(f.U.ADCODE99);
						    Oeasyunitdatamap.vectorSource.addFeature(iconFeature);
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
						    iconFeature.set("type", "xx");
						    iconFeature.setId(f.U.ADCODE99);
						    Oeasyunitdatamap.vectorSource.addFeature(iconFeature);
							//居中定位
					        var coordinates = f.U;
					        Oeasyunitdatamap.map.setView(new ol.View({ 
						        projection: "EPSG:4326",
						        center: [coordinates.CENTROID_X, coordinates.CENTROID_Y], 
						        zoom: 10,
                                minZoom:10,
	                            maxZoom:10								
					        }));
						}
					    
						
						
					}
					Oeasyunitdatamap.xqgeoSource.addFeatures(addNameFeatures);
					
					
				}
    		});
			
		},
		
      
		
		
  };