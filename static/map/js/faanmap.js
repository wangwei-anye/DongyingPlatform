

$(document).ready(function(){
	
	Oeasyfaanmap.init();
});

var Oeasyfaanmap = {
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
					src:Oeasyfaanmap.Icon[feature.get("type")]
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
		heatmaplayer : null,
		heatmapSource : new ol.source.Vector({
			wrapX : false
		}),
		overlay : null, // 地图弹出信息窗口
		view: new ol.View({
			  projection: "EPSG:4326",
	          center: [oeasymapconfig.x,oeasymapconfig.y],
	          zoom: oeasymapconfig.zoom,
			  
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
			
			Oeasyfaanmap.vectorLayer = new ol.layer.Vector({
				source : Oeasyfaanmap.vectorSource,
				style : Oeasyfaanmap.Iconstyle,
				zIndex : 1000
			});
			// 初始弹出对象
			Oeasyfaanmap.overlay = new ol.Overlay(({
				element : document.getElementById("faanmapPopup"),
				offset : [ 0, -30 ],
				positioning : "top-right",
				autoPan : true,
				autoPanAnimation : {
					duration : 250
				}
			}));
			var basemap = oeasymapconfig.streetmap();
			Oeasyfaanmap.map = new ol.Map({
				layers: [basemap],
		        target: document.getElementById("faanmap"),
		        controls: ol.control.defaults({
		          attributionOptions: ({
		            collapsible: false
		          })
		        }),
		        overlays : [ Oeasyfaanmap.overlay ],
		        view: Oeasyfaanmap.view,
		      });
			
			Oeasyfaanmap.map.addLayer(Oeasyfaanmap.vectorLayer);
			
			setTimeout(function(){

				Oeasyfaanmap.addunitdata(list);
				//				Oeasyfaanmap.map.on("pointermove", function(e) {
//	                if (e.dragging) {
//	                    return;
//	                }
//	                var pixel= Oeasyfaanmap.map.getEventPixel(e.originalEvent);
//	                var hit= Oeasyfaanmap.map.hasFeatureAtPixel(pixel);
//	                Oeasyfaanmap.map.getTarget().style.cursor= hit?'pointer':'';
//	                Oeasyfaanmap.mouseoverevt(pixel);    //鼠标停放事件
//	            });
				//setInterval('Oeasyfaanmap.changeunitpointsize()',2000);

			}, 1000);
			
			
			
			
		},
		

		changeunitpointsize:function(){
			Oeasyfaanmap.vectorSource.forEachFeature(function(_feature){
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
			Oeasyfaanmap.xqgeoSource.forEachFeature(function(_feature){
				var adcode99 = _feature.get("adcode99");
				if (adcode99 == code) {
					_feature.setStyle(Oeasyfaanmap.allPCSStyle(color));
				}
		    });
		},
		
		
		mouseoverevt:function(pixel){
			var feature= Oeasyfaanmap.map.forEachFeatureAtPixel(pixel, function(feature, layer){
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
                        var count = feature.get('count');
                        var html = "";
                        html += "";
                        html += "<table style='font-size: 11px;color:white;width:auto;'>";
						html += "<tr><td style='font-size:15px;color:black;padding-top:12px;font-weight: bold;'>安全指数："+ count + "</td></tr>";
						html += "</table>";
						$("#faanmapPopup-content").html(html);
                        Oeasyfaanmap.overlay.setPosition(coord);
                        break;
                    
                }
            }else{
            	Oeasyfaanmap.overlay.setPosition(undefined);
            }
		},
		
		getUrlParam:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
            var r = window.location.search.substr(1).match(reg);  
            if (r != null) return unescape(r[2]); return null; 
        },
		
		addunitdata:function(list){
            var city_code = Oeasyfaanmap.getUrlParam('city_code');
			var town_code = Oeasyfaanmap.getUrlParam('town_code');
			var police_code = Oeasyfaanmap.getUrlParam('police_code');
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
    			var projection = Oeasyfaanmap.map.getView().getProjection();
				if(data !=null){
    				if(data.length>0){
    					for (var i = 0; i < data.length; i++) {
    	    				var lng = data[i].lng;
    	    				var lat = data[i].lat;
    	    				var unitid = data[i].unit_id;
    	    				// 图上显示
    	    				var point;
    	    				if (projection.getCode() != "EPSG:4326") {
    	    					var lnglat = Oeasyfaanmap.lonlat2mercator(lng, lat);
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
    	    	                isglow:"0",
    	    	                ismove:"0"
    	    				});
    	    				iconFeature.set("type", "unitpoint");
    	    				iconFeature.setId(data[i].unit_id);
    	    				//Oeasyfaanmap.vectorSource.addFeature(iconFeature);
    	    				Oeasyfaanmap.heatmapSource.addFeature(iconFeature);
    	    			}
    	    			
						var heatmapparm = null;
						var time = Oeasyfaanmap.getUrlParam('time');
						var realtime = Oeasyfaanmap.getUrlParam('realtime');
						var week = Oeasyfaanmap.getUrlParam('week');
						var month = Oeasyfaanmap.getUrlParam('month');

						if(realtime){
							heatmapparm = {  
								source: Oeasyfaanmap.heatmapSource,  
								blur:10+Math.random()*20,
								radius: 6+Math.random()*10,
								opacity : 0.3
							 };
						}else if(time){
							var timet = time.split('/');
			                var stime = timet[0];
			                var etime = timet[1];
							var daycount = Oeasyfaanmap.DateDiff(stime,etime);
							heatmapparm = {  
    	                       source: Oeasyfaanmap.heatmapSource,  
    	                       blur:daycount+Math.random()*20,
    	                       radius: daycount+Math.random()*20,
    	                       opacity : 0.8
    	                    };
						}else if(week){
							heatmapparm = {  
								source: Oeasyfaanmap.heatmapSource,  
								blur:30+Math.random()*10,
								radius: 20+Math.random()*10,
								opacity : 0.8
							 };
						}else if(month){
							heatmapparm = {  
								source: Oeasyfaanmap.heatmapSource,  
								blur:80+Math.random()*20,
								radius: 50+Math.random()*20,
								opacity : 0.8
							 };
						}else{
							heatmapparm = {  
								source: Oeasyfaanmap.heatmapSource,  
								blur:20,
								radius: 16,
								opacity : 0.8
							 };
						}

    	    			Oeasyfaanmap.heatmaplayer = new ol.layer.Heatmap(heatmapparm);     	    			
    	    			Oeasyfaanmap.map.addLayer(Oeasyfaanmap.heatmaplayer);
    				}
    			}
				
    		});
			
			Oeasyfaanmap.carculatemax(dataparam);
		},
		
        carculatemax:function(dataparam){
			var time = Oeasyfaanmap.getUrlParam('time');
			var realtime = Oeasyfaanmap.getUrlParam('realtime');
			var week = Oeasyfaanmap.getUrlParam('week');
			var month = Oeasyfaanmap.getUrlParam('month');
			if(realtime !=null || realtime != ''){
				$.ajax({
					url:oeasymapconfig.speicalPerson+"/safety/unitCaseArisesIndexRealTime.do" ,
					dataType: "json",
					type: "POST",
					data: dataparam,
					xhrFields: {
						  withCredentials: true
					}						
				}).done(function(msg){
					var data = msg.data;
					if(data !=null){
						if(data.length>0){
							var garymax = [];
							for(var k = 0; k < data.length; k++){
								var garycount = data[k].compositeIndex;
								if(garycount !=null ){
									garymax[k] = parseInt(garycount);
								}else{
									garymax[k] = 5;
								}
							}						
							var maxgary  = Math.max.apply(null, garymax);
							$("#faandatarangemin").html(maxgary);		
						}
					}												
				});
			}else if(time != null || time != ''){
				$.ajax({
					url:oeasymapconfig.speicalPerson+"/safety/unitCaseArisesIndexInputTime.do" ,
					dataType: "json",
					type: "POST",
					data: dataparam,
					xhrFields: {
						  withCredentials: true
					}						
				}).done(function(msg){
					var data = msg.data;
					if(data !=null){
						if(data.length>0){
							var garymax = [];
							for(var k = 0; k < data.length; k++){
								var garycount = data[k].compositeIndex;
								if(garycount !=null ){
									garymax[k] = parseInt(garycount);
								}else{
									garymax[k] = 5;
								}
							}						
							var maxgary  = Math.max.apply(null, garymax);
							$("#faandatarangemin").html(maxgary);		
						}
					}												
				});
			}else if(week != null || week != ''){
				$.ajax({
					url:oeasymapconfig.speicalPerson+"/safety/unitCaseArisesIndexWeek.do" ,
					dataType: "json",
					type: "POST",
					data: dataparam,
					xhrFields: {
						  withCredentials: true
					}						
				}).done(function(msg){
					var data = msg.data;
					if(data !=null){
						if(data.length>0){
							var garymax = [];
							for(var k = 0; k < data.length; k++){
								var garycount = data[k].compositeIndex;
								if(garycount !=null ){
									garymax[k] = parseInt(garycount);
								}else{
									garymax[k] = 5;
								}
							}						
							var maxgary  = Math.max.apply(null, garymax);
							$("#faandatarangemin").html(maxgary);		
						}
					}												
				});
			}else if(month != null || month != ''){
				$.ajax({
					url:oeasymapconfig.speicalPerson+"/safety/unitCaseArisesIndexMonth.do" ,
					dataType: "json",
					type: "POST",
					data: dataparam,
					xhrFields: {
						  withCredentials: true
					}						
				}).done(function(msg){
					var data = msg.data;
					if(data !=null){
						if(data.length>0){
							var garymax = [];
							for(var k = 0; k < data.length; k++){
								var garycount = data[k].compositeIndex;
								if(garycount !=null ){
									garymax[k] = parseInt(garycount);
								}else{
									garymax[k] = 5;
								}
							}						
							var maxgary  = Math.max.apply(null, garymax);
							$("#faandatarangemin").html(maxgary);		
						}
					}												
				});
			}
            
		},

		DateDiff:function(sDate1,  sDate2){   
           //sDate1和sDate2是2002-12-18格式 		
           var  aDate,  oDate1,  oDate2,  iDays;  
           aDate  =  sDate1.split("-")  ;
           oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);      
           aDate  =  sDate2.split("-");  
           oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);  
           iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);     
           return  iDays  
        },

		addglowoverlayerbyunitid:function(unitid){
			Oeasyfaanmap.vectorSource.forEachFeature(function(_feature){
				var unit_id = _feature.get("unit_id");
				var lng = _feature.get("lng");
				var lat = _feature.get("lat");
//				var overlaytmp = Oeasyfaanmap.map.getOverlayById(unit_id);
//				Oeasyfaanmap.map.removeOverlay(overlaytmp);
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
                   Oeasyfaanmap.map.addOverlay(glowoverlayer);
                   _feature.set("isglow", "1");   
                   setTimeout(function(){
                	   _feature.set("isglow", "0"); 
       			   },5000);
				}
		    });
		},
		
		addmoveuppoint:function(unitid){
			Oeasyfaanmap.vectorSource.forEachFeature(function(_feature){
				var unit_id = _feature.get("unit_id");
				var lng = _feature.get("lng");
				var lat = _feature.get("lat");
				var lnglat = Oeasyfaanmap.lonlat2mercator(lng, lat);
				
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
                   Oeasyfaanmap.map.addOverlay(glowoverlayer);
                   _feature.set("ismove", "1");   
                   setTimeout(function(){
                	   Oeasyfaanmap.map.removeOverlay(glowoverlayer);
                	   _feature.set("type", "unitpoint");
                	   _feature.set("ismove", "0");
       			   },5000);
				}
		    });
		}
		
		
  };