

$(document).ready(function(){
	
	Oeasytriprecordmap.init();
});

var Oeasytriprecordmap = {
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
				    size: [60, 40],
				    anchor: [0.5, 0.5],
				    anchorXUnits: 'fraction',
				    anchorYUnits: 'pixels',
					src:Oeasytriprecordmap.Icon[feature.get("type")]
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
			
			Oeasytriprecordmap.vectorLayer = new ol.layer.Vector({
				source : Oeasytriprecordmap.vectorSource,
				style : Oeasytriprecordmap.Iconstyle,
				zIndex : 1000
			});
			
			// 初始弹出对象
			Oeasytriprecordmap.overlay = new ol.Overlay(({
				element : document.getElementById("triprecordmapPopup"),
				offset : [ 0, -30 ],
				positioning : "top-right",
				autoPan : true,
				autoPanAnimation : {
					duration : 250
				}
			}));
			Oeasytriprecordmap.map = new ol.Map({
				
		        target: document.getElementById("triprecordmap"),
		        controls: ol.control.defaults({
		          attributionOptions: ({
		            collapsible: false
		          })
		        }),
		        
		        overlays : [ Oeasytriprecordmap.overlay ],
		        view: Oeasytriprecordmap.view,
		      });
			Oeasytriprecordmap.map.addLayer(Oeasytriprecordmap.vectorLayer);
			Oeasytriprecordmap.xqgeolayer = new ol.layer.Vector({
				source : Oeasytriprecordmap.xqgeoSource
				
			});
			Oeasytriprecordmap.map.addLayer(Oeasytriprecordmap.xqgeolayer);
			
			Oeasytriprecordmap.addcountylayer();
			
			setTimeout(function(){

				Oeasytriprecordmap.addunitdata(list);
				Oeasytriprecordmap.map.on("pointermove", function(e) {
	                if (e.dragging) {
	                    return;
	                }
	                var pixel= Oeasytriprecordmap.map.getEventPixel(e.originalEvent);
	                var hit= Oeasytriprecordmap.map.hasFeatureAtPixel(pixel);
	                Oeasytriprecordmap.map.getTarget().style.cursor= hit?'pointer':'';
	                Oeasytriprecordmap.mouseoverevt(pixel);    //鼠标停放事件
	            });
				
				//setInterval('Oeasytriprecordmap.changeunitpointsize()',1000);

			}, 1000);
			
			setTimeout(function(){
				//Oeasytriprecordmap.addglowoverlayerbyunitid('3656');
				//Oeasytriprecordmap.addglowoverlayerbyunitid('3932');
			},3000);
			
		},
		

		changeunitpointsize:function(){
			Oeasytriprecordmap.vectorSource.forEachFeature(function(_feature){
				var _type = _feature.get('type');
				var _isglow = _feature.get('isglow');
				var _ismove = _feature.get('ismove');
				if(_type == 'unitpoint' && _isglow == '0' && _ismove =='0'){
					_feature.set("type", "unitpoints");
					setTimeout(function(){
						_feature.set("type", "unitpoint");
					},1000);
				}
				
		    });
		},
		
		changecountycolor:function(code,color){
			Oeasytriprecordmap.xqgeoSource.forEachFeature(function(_feature){
				var adcode99 = _feature.get("adcode99");
				if (adcode99 == code) {
					_feature.setStyle(Oeasytriprecordmap.allPCSStyle(color));
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
						f.setStyle(Oeasytriprecordmap.tongrenshiStyle(Oeasytriprecordmap.dicolor));
						
					}
					Oeasytriprecordmap.xqgeoSource.addFeatures(addNameFeatures);
					
					
				}
    		});
			
		},
		
		addcountylayer:function(){
			var city_code = Oeasytriprecordmap.getUrlParam('city_code');
			var town_code = Oeasytriprecordmap.getUrlParam('town_code');
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
						f.setStyle(Oeasytriprecordmap.allPCSStyle(Oeasytriprecordmap.dicolor));
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
						    Oeasytriprecordmap.vectorSource.addFeature(iconFeature);
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
						    Oeasytriprecordmap.vectorSource.addFeature(iconFeature);
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
						    Oeasytriprecordmap.vectorSource.addFeature(iconFeature);
							//居中定位
					        var coordinates = f.U;
					        Oeasytriprecordmap.map.setView(new ol.View({ 
						        projection: "EPSG:4326",
						        center: [coordinates.CENTROID_X, coordinates.CENTROID_Y], 
						        zoom: 10,
                                minZoom:10,
	                            maxZoom:10
					        }));
						}
					}
					Oeasytriprecordmap.xqgeoSource.addFeatures(addNameFeatures);
					
				}
    		});
			
		},
		
		
		mouseoverevt:function(pixel){
			var feature= Oeasytriprecordmap.map.forEachFeatureAtPixel(pixel, function(feature, layer){
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
                        var address = feature.get('address');
						//小区点上的提示，人流量和车流量
						$.ajax({
							url:oeasymapconfig.unitCount+"/unit/unitCount.do" ,
    			            dataType: "json",
    			            type: "GET",
    			            data: {
    			                "province_code":oeasymapconfig.province_code,
    			                "city_code":oeasymapconfig.city_code,
                                 "unit_id":unit_id  
    			            },
				            xhrFields: {
                                withCredentials: true
                            }
							    			
						}).done(function(data){
							    
							var html = "";
                            html += "";
                            html += "<table style='font-size: 11px;color:white;width:auto;'>";
						    html += "<tr><td style='font-size:15px;color:black;padding-top:12px;font-weight: bold;'>"+ data[0].name + "</td></tr>";
						    html += "<tr><td style='color:black;'>今日人流："+ data[0].doorCount + "</td></tr>";
						    html += "<tr><td style='color:black;'>今日车流："+ data[0].carCount + "</td></tr>";
						    html += "</table>";
						    $("#triprecordmapPopup-content").html(html);
                            Oeasytriprecordmap.overlay.setPosition(coord);
											
						});
                        
                        break;
                    
                }
            }else{
            	Oeasytriprecordmap.overlay.setPosition(undefined);
            }
		},
		
		getUrlParam:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
            var r = window.location.search.substr(1).match(reg);  
            if (r != null) return unescape(r[2]); return null; 
        },
		
		addunitdata:function(list){
            var city_code = Oeasytriprecordmap.getUrlParam('city_code');
			var town_code = Oeasytriprecordmap.getUrlParam('town_code');
			var township_code = Oeasytriprecordmap.getUrlParam('township_code');
			var village_code = Oeasytriprecordmap.getUrlParam('village_code');
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
    			var projection = Oeasytriprecordmap.map.getView().getProjection();
				if(data !=null){
					if(data.length >0){
						for (var i = 0; i < data.length; i++) {
    				      var lng = data[i].lng;
    				      var lat = data[i].lat;
    				      var unitid = data[i].unit_id;
    				      // 图上显示
    				      var point;
    				      if (projection.getCode() != "EPSG:4326") {
    					    var lnglat = Oeasytriprecordmap.lonlat2mercator(lng, lat);
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
    	                   lng:lng,
    	                   lat:lat,
    	                   address:data[i].address,
    	                   isglow:"0",
    	                   ismove:"0"
    				     });
    				     iconFeature.set("type", "unitpoint");
    				     iconFeature.setId(data[i].unit_id);
    				     Oeasytriprecordmap.vectorSource.addFeature(iconFeature);
    			        }
						
					}
				}
    			
				
    		});
			
		},
		
		
		addglowoverlayerbyunitid:function(unitid){
			Oeasytriprecordmap.vectorSource.forEachFeature(function(_feature){
				var unit_id = _feature.get("unit_id");
				var lng = _feature.get("lng");
				var lat = _feature.get("lat");
				
				var point = new ol.geom.Point([ lng, lat ]);
				if (unit_id == unitid) {

					var str = '<div class="overlay circle" id="unitbluelight'+ unitid +'">'+
	                  '<div class="circle1">&nbsp;</div>'+
	                  '<div class="center"  ></div>'+
	                  '<img class="centerimg" src="images/unit.png" />'+
		              '</div>';
                    var glowoverlayer = null;
                    glowoverlayer = new ol.Overlay({
	                       position: point.getCoordinates(),
	                       insertFirst:false,
	                       element: $(str)[0],
	                       id:$(str)[0]
	               });
                    $(".centerimg").attr("display","block");
                    //_feature.set("type", "null");
                   Oeasytriprecordmap.map.addOverlay(glowoverlayer);
                   _feature.set("isglow", "1");   
                   setTimeout(function(){
                	   //Oeasytriprecordmap.map.removeOverlay(glowoverlayer);
                	   _feature.set("isglow", "0"); 
       			   },5000);
				}
		    });
		},
		
		addmoveuppoint:function(unitid){
			Oeasytriprecordmap.vectorSource.forEachFeature(function(_feature){
				var unit_id = _feature.get("unit_id");
				var lng = _feature.get("lng");
				var lat = _feature.get("lat");
				var lnglat = Oeasytriprecordmap.lonlat2mercator(lng, lat);
				
				var point = new ol.geom.Point([ lnglat.x, lnglat.y ]);
				if (unit_id == unitid) {
					_feature.set("type", "null");
					console.log(lng+" "+lat);
					console.log(lnglat.x+" "+lnglat.y);
					var str = '<img class="overlay animate-bounce-down" id="unitmoveup'+ unitid +'" src="images/unit.png" />';
                    var glowoverlayer = null;
                    glowoverlayer = new ol.Overlay({
	                       position: point.getCoordinates(),
	                       element: $(str)[0],
	                       id:$(str)[0]
	               });
                    
                    $(".centerimg").attr("display","none");
                   Oeasytriprecordmap.map.addOverlay(glowoverlayer);
                   _feature.set("ismove", "1");   
                   setTimeout(function(){
                	   Oeasytriprecordmap.map.removeOverlay(glowoverlayer);
                	   _feature.set("type", "unitpoint");
                	   _feature.set("ismove", "0");
       			   },5000);
				}
		    });
		}
		
		
  };