

$(document).ready(function(){
	
	Oeasyalarmmap.init();
});

var Oeasyalarmmap = {
		map:null,
		Token:null,
		Iconstyle:function(feature) {
			return [new ol.style.Style({
				stroke : new ol.style.Stroke({
					color : 'red',
					width : 2
				}),
				image:new ol.style.Circle({
				      radius: 4,
				      fill: new ol.style.Fill({
				        color: 'rgba(255,255,255,0.9)'
				      }),
				      stroke : new ol.style.Stroke({
							color : 'rgba(0,128,192,0.2)',
							width : 7
						}),
				    })
			})];
		},
		
		changepointstyle:function(feature) {
			return [new ol.style.Style({
				stroke : new ol.style.Stroke({
					color : 'red',
					width : 2
				}),
				image:new ol.style.Circle({
				      radius: 8,
				      fill: new ol.style.Fill({
				        color: 'rgba(255,255,255,0.9)'
				      }),
				      stroke : new ol.style.Stroke({
							color : 'rgba(0,128,192,0.2)',
							width : 15
						}),
				    })
			})];
		},
		
		areastyle:function(feature) {
			return [new ol.style.Style({
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
		
		dicolor:'rgba(0,83, 153,1)',
			
		xqgeoSource: new ol.source.Vector(),//辖区资源
		xqgeolayer: null,
		
		
		init:function(list){
			
			Oeasyalarmmap.vectorLayer = new ol.layer.Vector({
				source : Oeasyalarmmap.vectorSource,
				style : Oeasyalarmmap.Iconstyle,
				zIndex : 1000
			});
			// 初始弹出对象
			Oeasyalarmmap.overlay = new ol.Overlay(({
				element : document.getElementById("alarmmapPopup"),
				offset : [ -150, -250 ],
				positioning : "top-right",
				autoPan : true,
				autoPanAnimation : {
					duration : 250
				}
			}));
			
			var basemap = oeasymapconfig.streetmap();
			Oeasyalarmmap.map = new ol.Map({
				layers: [basemap],
		        target: document.getElementById("alarmmap"),
		        controls: ol.control.defaults({
		          attributionOptions: ({
		            collapsible: false
		          })
		        }),
		        overlays : [ Oeasyalarmmap.overlay ],
		        view: Oeasyalarmmap.view,
		      });
			
			Oeasyalarmmap.map.addLayer(Oeasyalarmmap.vectorLayer);
			
			setTimeout(function(){

				Oeasyalarmmap.addunitdata(list);
				Oeasyalarmmap.map.on("pointermove", function(e) {
	                if (e.dragging) {
	                    return;
	                }
	                var pixel= Oeasyalarmmap.map.getEventPixel(e.originalEvent);
	                var hit= Oeasyalarmmap.map.hasFeatureAtPixel(pixel);
	                Oeasyalarmmap.map.getTarget().style.cursor= hit?'pointer':'';
	                Oeasyalarmmap.mouseoverevt(pixel);    //鼠标停放事件
	            });
				
			}, 1000);
			Oeasyalarmmap.Token = Oeasyalarmmap.getUrlParam('Token');
		},
		
		mouseoverevt:function(pixel){
			var feature= Oeasyalarmmap.map.forEachFeatureAtPixel(pixel, function(feature, layer){
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
						Oeasyalarmmap.changeunitpointsize();
                    	feature.setStyle(Oeasyalarmmap.changepointstyle(feature));
                    	feature.set("stylechanged","1");
                        var id = feature.get('id');
                        var unit_id = feature.get('unit_id');
                        var unit_name = feature.get('unit_name');
						if(Oeasyalarmmap.Token == null){
							Oeasyalarmmap.Token = '';
						}
						Oeasyalarmmap.overlay.setPosition(coord);
						$.ajax({
							url:oeasymapconfig.alarm+"/alarm_events_today" ,
    			            dataType: "json",
    			            type: "POST",
    			            data: JSON.stringify({
                               "Command":"CountAlarmEventsToday",
                               "Token":Oeasyalarmmap.Token,
                               "var":{
                                   "estate_code":unit_id
                                }
                            })
							    			
						}).done(function(msg){
							var data = msg.Result;
							if(data !=null){
								var html = "";
                                html += "";
                                html += "<table style='font-size: 11px;color:white;width:auto;'>";
						        html += "<tr><div style='font-size:15px;color:white;padding-top:5px;font-weight: bold;'><img src='images/alarmtitle.png' style='margin-top:5px;'/><span style='top:14px;position: absolute;'>"+ unit_name + "</span></div></tr>";
						        html += "<tr><hr color='rgba(0,83, 153,0.2)' align=center width='90%' size=1 />" + "</tr>";
						        html += "<tr><td style='font-size:12px;color:white;padding-top:1px;padding-left:3px;'>警情总数" + "</td></tr>";
						        html += "<tr><td style='font-size:18px;color:white;padding-top:3px;padding-left:50px;'>" +data[0].jqtotal +"</td></tr>";
						        html += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>人黑名单：" + data[0].rhmd+" 起</td></tr>";
						        html += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>车黑名单：" +data[0].chmd+ " 起</td></tr>";
						        html += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>人流：" +data[0].rl+ " 起</td></tr>";
						        html += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>尾随：" +data[0].ws+ " 起</td></tr>";
						        html += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>周界：" + data[0].zj+" 起</td></tr>";
						        html += "</table>";
						        $("#alarmmapPopup-content").html(html);
                                //Oeasyalarmmap.overlay.setPosition(coord);
                            }else{
								var htmlnull = "";
                                htmlnull += "";
                                htmlnull += "<table style='font-size: 11px;color:white;width:auto;'>";
						        htmlnull += "<tr><div style='font-size:15px;color:white;padding-top:5px;font-weight: bold;'><img src='images/alarmtitle.png' style='margin-top:5px;'/><span style='top:14px;position: absolute;'>"+ unit_name + "</span></div></tr>";
						        htmlnull += "<tr><hr color='rgba(0,83, 153,0.2)' align=center width='90%' size=1 />" + "</tr>";
						        htmlnull += "<tr><td style='font-size:12px;color:white;padding-top:1px;padding-left:3px;'>警情总数" + "</td></tr>";
						        htmlnull += "<tr><td style='font-size:18px;color:white;padding-top:3px;padding-left:50px;'>0"  +"</td></tr>";
						        htmlnull += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>人黑名单：0" +" 起</td></tr>";
						        htmlnull += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>车黑名单：0" + " 起</td></tr>";
						        htmlnull += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>人流：0" + " 起</td></tr>";
						        htmlnull += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>尾随：0" + " 起</td></tr>";
						        htmlnull += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>周界：0" + +" 起</td></tr>";
						        htmlnull += "</table>";
						        $("#alarmmapPopup-content").html(htmlnull);
                                //Oeasyalarmmap.overlay.setPosition(coord);
							}								
											
						}).fail(function(jqXHR, textStatus) { 
				                var htmlfail = "";
                                htmlfail += "";
                                htmlfail += "<table style='font-size: 11px;color:white;width:auto;'>";
						        htmlfail += "<tr><div style='font-size:15px;color:white;padding-top:5px;font-weight: bold;'><img src='images/alarmtitle.png' style='margin-top:5px;'/><span style='top:14px;position: absolute;'>"+ unit_name + "</span></div></tr>";
						        htmlfail += "<tr><hr color='rgba(0,83, 153,0.2)' align=center width='90%' size=1 />" + "</tr>";
						        htmlfail += "<tr><td style='font-size:12px;color:white;padding-top:1px;padding-left:3px;'>警情总数" + "</td></tr>";
						        htmlfail += "<tr><td style='font-size:18px;color:white;padding-top:3px;padding-left:50px;'>0"  +"</td></tr>";
						        htmlfail += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>人黑名单：0" +" 起</td></tr>";
						        htmlfail += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>车黑名单：0" + " 起</td></tr>";
						        htmlfail += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>人流：0" + " 起</td></tr>";
						        htmlfail += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>尾随：0" + " 起</td></tr>";
						        htmlfail += "<tr><td style='font-size:12px;color:white;padding-top:3px;padding-left:3px;'>周界：0" +" 起</td></tr>";
						        htmlfail += "</table>";
						        $("#alarmmapPopup-content").html(htmlfail);
                                //Oeasyalarmmap.overlay.setPosition(coord);
				        });
                        
                        break;
                    default:
                    	Oeasyalarmmap.changeunitpointsize();
                }
            }else{
            	
            	Oeasyalarmmap.overlay.setPosition(undefined);
            }
		},
		
		changeunitpointsize:function(){
			Oeasyalarmmap.vectorSource.forEachFeature(function(_feature){
				var stylechanged = _feature.get("stylechanged");
				if(stylechanged == '1'){
					_feature.setStyle(Oeasyalarmmap.Iconstyle(_feature));
				}
				
				
		    });
		},
		
		getUrlParam:function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
            var r = window.location.search.substr(1).match(reg);  
            if (r != null) return unescape(r[2]); return null; 
        },
		
		
		addunitdata:function(){
			var city_code = Oeasyalarmmap.getUrlParam('city_code');
			var town_code = Oeasyalarmmap.getUrlParam('town_code');
			var police_code = Oeasyalarmmap.getUrlParam('police_code');
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
    			var projection = Oeasyalarmmap.map.getView().getProjection();
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
    	                  
    				     });
    				     iconFeature.setId(data[i].unit_id);
    				     Oeasyalarmmap.vectorSource.addFeature(iconFeature);
    			      }
    			
					}
				}
    			
    		});
			
	},
		
		
		
		
  };