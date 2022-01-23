

$(document).ready(function(){
	
	Oeasymonitormap.init();
});

var Oeasymonitormap = {
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
				image:new ol.style.Circle({
				      radius: 3,
				      fill: new ol.style.Fill({
				        color: 'white'
				      }),
				      stroke : new ol.style.Stroke({
							color : 'rgba(0,128,192,0.6)',
							width : 7
						}),
				    }),
				text: new ol.style.Text({
					text: feature.get("name"),
					font:'12px sans-serif',
					offsetX:0,
					offsetY:-15,
					fill: new ol.style.Fill({
						color: '#FFFfff'
						})
					})
			})];
		},
		
		valuerenderstyle:function(feature) {
			var totalcount = feature.get("totalcount");
			var style = null;
			if(parseInt(totalcount) > 0){
				if(parseInt(totalcount) > 0 && parseInt(totalcount) < 20){
					style = [new ol.style.Style({
						image:new ol.style.Circle({
						      radius: 5,
						      fill: new ol.style.Fill({
						        color: 'orange'
						      })
						    })
					})];
				}else if(parseInt(totalcount) > 20 && parseInt(totalcount) < 40){
					style = [new ol.style.Style({
						image:new ol.style.Circle({
						      radius: 8,
						      fill: new ol.style.Fill({
						        color: 'orange'
						      })
						    })
					})];
				}else if(parseInt(totalcount) > 40 && parseInt(totalcount) < 60){
					style = [new ol.style.Style({
						image:new ol.style.Circle({
						      radius: 10,
						      fill: new ol.style.Fill({
						        color: 'orange'
						      })
						    })
					})];
				}else if(parseInt(totalcount) > 60 && parseInt(totalcount) < 80){
					style = [new ol.style.Style({
						image:new ol.style.Circle({
						      radius: 12,
						      fill: new ol.style.Fill({
						        color: 'orange'
						      })
						    })
					})];
				}else if(parseInt(totalcount) > 80 && parseInt(totalcount) < 100){
					style = [new ol.style.Style({
						image:new ol.style.Circle({
						      radius: 15,
						      fill: new ol.style.Fill({
						        color: 'orange'
						      })
						    })
					})];
				}else if(parseInt(totalcount) > 100 ){
					style = [new ol.style.Style({
						image:new ol.style.Circle({
						      radius: 18,
						      fill: new ol.style.Fill({
						        color: 'orange'
						      })
						    })
					})];
				}
			}
			return style;
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
	          center: [108.6111,27.996403],
	          zoom: 9,
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
		dicolor:'rgba(7,43, 70,1)',
			
		xqgeoSource: new ol.source.Vector(),//辖区资源
		xqgeolayer: null,
		
		
		init:function(list){
			
			Oeasymonitormap.vectorLayer = new ol.layer.Vector({
				source : Oeasymonitormap.vectorSource,
				style : Oeasymonitormap.Iconstyle,
				zIndex : 1000
			});
			// 初始弹出对象
			Oeasymonitormap.overlay = new ol.Overlay(({
				element : document.getElementById("monitormapPopup"),
				offset : [ 0, -30 ],
				positioning : "top-right",
				autoPan : true,
				autoPanAnimation : {
					duration : 250
				}
			}));
			
			
			Oeasymonitormap.map = new ol.Map({
				
		        target: document.getElementById("monitormap"),
		        controls: ol.control.defaults({
		          attributionOptions: ({
		            collapsible: false
		          })
		        }),
		        overlays : [ Oeasymonitormap.overlay ],
		        view: Oeasymonitormap.view,
		      });
			
			Oeasymonitormap.map.addLayer(Oeasymonitormap.vectorLayer);
			Oeasymonitormap.xqgeolayer = new ol.layer.Vector({
				source : Oeasymonitormap.xqgeoSource
				
			});
			Oeasymonitormap.map.addLayer(Oeasymonitormap.xqgeolayer);
			Oeasymonitormap.addtongrenshilayer();
			Oeasymonitormap.addcountylayer();
			
			setTimeout(function(){

				Oeasymonitormap.addunitdata(list);
				Oeasymonitormap.map.on("pointermove", function(e) {
	                if (e.dragging) {
	                    return;
	                }
	                var pixel= Oeasymonitormap.map.getEventPixel(e.originalEvent);
	                var hit= Oeasymonitormap.map.hasFeatureAtPixel(pixel);
	                Oeasymonitormap.map.getTarget().style.cursor= hit?'pointer':'';
	                Oeasymonitormap.mouseoverevt(pixel);    //鼠标停放事件
	            });
				//setInterval('Oeasymonitormap.changeunitpointsize()',2000);

			}, 1000);
			
		},
		

		changeunitpointsize:function(){
			Oeasymonitormap.vectorSource.forEachFeature(function(_feature){
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
			Oeasymonitormap.xqgeoSource.forEachFeature(function(_feature){
				var adcode99 = _feature.get("adcode99");
				if (adcode99 == code) {
					_feature.setStyle(Oeasymonitormap.allPCSStyle(color));
				}
		    });
		},
		addtongrenshilayer:function(){
			$.ajax({
    			url:"js/tongrenshi.json" ,
    			dataType: "json",
    			type: "POST"
    			
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
						f.setStyle(Oeasymonitormap.tongrenshiStyle(Oeasymonitormap.dicolor));
						
					}
					Oeasymonitormap.xqgeoSource.addFeatures(addNameFeatures);
					
					
				}
    		});
			
		},
		
		addcountylayer:function(){
			$.ajax({
    			url:"js/countynew.json" ,
    			dataType: "json",
    			type: "POST"
    			
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
						f.setStyle(Oeasymonitormap.allPCSStyle(Oeasymonitormap.dicolor));
						//根据区域中心，设置中心点名称图标
						var point = new ol.geom.Point([ f.U.CENTROID_X, f.U.CENTROID_Y ]);
						var iconFeature = new ol.Feature({
							geometry : point,
							townCode : f.U.ADCODE99,
			                townName: f.U.NAME99,
			                name: f.U.NAME99,
			                layername:"countypoint",
			                lng:f.U.CENTROID_X,
			                lat:f.U.CENTROID_Y
						});
						iconFeature.set("type", "countypoint");
						iconFeature.setId(f.U.ADCODE99);
						Oeasymonitormap.vectorSource.addFeature(iconFeature);
					}
					Oeasymonitormap.xqgeoSource.addFeatures(addNameFeatures);

					
				}
    		});
			
		},
		
		
		mouseoverevt:function(pixel){
			var feature= Oeasymonitormap.map.forEachFeatureAtPixel(pixel, function(feature, layer){
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
                        var totalcount = feature.get('totalcount');
                        var xingshicount = feature.get('xingshicount');
                        var zhiancount = feature.get('zhiancount');
                        var maodunjiufencount = feature.get('maodunjiufencount');
                        var shebeigaojincount = feature.get('shebeigaojincount');
                        var html = "";
                        html += "";
                        html += "<table style='font-size: 11px;color:white;width:auto;'>";
						html += "<tr><td style='font-size:15px;color:black;padding-top:16px;font-weight: bold;'>"+ unit_name + "</td></tr>";
						html += "<tr><td style='font-size:15px;color:black;padding-top:12px;font-weight: bold;'>警情总数："+ totalcount + "</td></tr>";
						html += "<tr><td style='font-size:15px;color:black;padding-top:12px;font-weight: bold;'>刑事："+ xingshicount + "</td></tr>";
						html += "<tr><td style='font-size:15px;color:black;padding-top:12px;font-weight: bold;'>治安："+ zhiancount + "</td></tr>";
						html += "<tr><td style='font-size:15px;color:black;padding-top:12px;font-weight: bold;'>矛盾纠纷："+ maodunjiufencount + "</td></tr>";
						html += "<tr><td style='font-size:15px;color:black;padding-top:12px;font-weight: bold;'>设备告警："+ shebeigaojincount + "</td></tr>";
						html += "</table>";
						$("#monitormapPopup-content").html(html);
                        Oeasymonitormap.overlay.setPosition(coord);
                        break;
                    
                }
            }else{
            	Oeasymonitormap.overlay.setPosition(undefined);
            }
		},
		
		addunitdata:function(list){

			$.ajax({
    			url:"js/json/monitormap.json" ,
    			dataType: "json",
    			type: "POST"
    			
    		}).done(function(_dt){
    			var data  = _dt.RECORDS;
    			var projection = Oeasymonitormap.map.getView().getProjection();
    			for (var i = 0; i < data.length; i++) {
    				var lng = data[i].lng;
    				var lat = data[i].lat;
    				var unitid = data[i].unit_id;
    				// 图上显示
    				var point;
    				if (projection.getCode() != "EPSG:4326") {
    					var lnglat = Oeasymonitormap.lonlat2mercator(lng, lat);
    					point = new ol.geom.Point([ lnglat.x, lnglat.y ]);
    				} else {
    					point = new ol.geom.Point([ lng, lat ]);
    				}
    				var iconFeature = new ol.Feature({
    					geometry : point,
    	                id : data[i].unit_id,
    	                layername : "UnitLayer",
    	                unit_id: data[i].unit_id,
    	                unit_name: data[i].name,
    	                lng:lng,
    	                lat:lat,
    	                address:data[i].address,
    	                totalcount:data[i].totalcount,
    	                xingshicount:data[i].xingshicount,
    	                zhiancount:data[i].zhiancount,
    	                maodunjiufencount:data[i].maodunjiufencount,
    	                shebeigaojincount:data[i].shebeigaojincount,
    	                isglow:"0",
    	                ismove:"0"
    				});
    				iconFeature.set("type", "unitpoint");
    				iconFeature.setId(data[i].unit_id);
    				//valuerenderstyle
    				iconFeature.setStyle(Oeasymonitormap.valuerenderstyle(iconFeature));
    				Oeasymonitormap.vectorSource.addFeature(iconFeature);
    				
    				
    			}
    			
				
    		});
			
		},
		
		
		addglowoverlayerbyunitid:function(unitid){
			Oeasymonitormap.vectorSource.forEachFeature(function(_feature){
				var unit_id = _feature.get("unit_id");
				var lng = _feature.get("lng");
				var lat = _feature.get("lat");
//				var overlaytmp = Oeasymonitormap.map.getOverlayById(unit_id);
//				Oeasymonitormap.map.removeOverlay(overlaytmp);
				var point = new ol.geom.Point([ lng, lat ]);
				if (unit_id == unitid) {

					var str = '<div class="overlay circle" id="unitbluelight'+ unitid +'">'+
	                  '<div class="circle1">&nbsp;</div>'+
	                  '<div class="center"  ></div>'+
	                  //'<img class="centerimg" src="images/unit.png" />'+
		              '</div>';
                    var glowoverlayer = null;
                    glowoverlayer = new ol.Overlay({
	                       position: point.getCoordinates(),
	                       insertFirst:false,
	                       element: $(str)[0],
	                       id:$(str)[0]
	               });
                   
                    $(".centerimg").attr("display","block");
                   Oeasymonitormap.map.addOverlay(glowoverlayer);
                   _feature.set("isglow", "1");   
                   setTimeout(function(){
                	   _feature.set("isglow", "0"); 
       			   },5000);
				}
		    });
		},
		
		addmoveuppoint:function(unitid){
			Oeasymonitormap.vectorSource.forEachFeature(function(_feature){
				var unit_id = _feature.get("unit_id");
				var lng = _feature.get("lng");
				var lat = _feature.get("lat");
				var lnglat = Oeasymonitormap.lonlat2mercator(lng, lat);
				
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
                   Oeasymonitormap.map.addOverlay(glowoverlayer);
                   _feature.set("ismove", "1");   
                   setTimeout(function(){
                	   Oeasymonitormap.map.removeOverlay(glowoverlayer);
                	   _feature.set("type", "unitpoint");
                	   _feature.set("ismove", "0");
       			   },5000);
				}
		    });
		}
		
		
  };