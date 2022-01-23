

$(document).ready(function(){
	
	Oeasygonganmap.init();
});

var Oeasygonganmap = {
		
		map:null,
		basemap:null,
		
		Icon:{
			'videopoint':'images/videop.png',
			'unitpoints':'images/units.png',
			'countypoint':'images/point.png',
			'wuxing':'images/wuxing.png',
			'videowhite':'images/videowhite.png',
			'null':''
		},
		Iconstyle:function(feature,resolution) {
			//console.log("resolution:"+resolution);
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
				    src:Oeasygonganmap.Icon[feature.get("type")]
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
	          center: [118.795218,37.439184],
	          zoom: 11,
	          maxZoom:18
	          
	        }),
	     
		areastyle: function(feature) {
			return [new ol.style.Style({
				fill: new ol.style.Fill({
					color: 'rgba(255,255,255,0.4)'
			    }),
			    stroke: new ol.style.Stroke({
			    	color: 'rgba(61,155,232,1)',
			    	width: 1
			    }),
			    text: new ol.style.Text({
					text: feature.get("name"),
					font:'12px sans-serif',
					offsetX:0,
					offsetY:-15,
					placement:'point',
					backgroundStroke:new ol.style.Stroke({
                        color:'rgba(61,155,232,1)',
                        width:1
                    }),
                    //标签的背景填充
                    backgroundFill:new ol.style.Fill({
                        color:'rgba(61,155,232,1)'
                    }),
                    padding:[5,5,5,5],
					fill: new ol.style.Fill({
						color: 'white'
						})
					})
			    
		  })];
		},
		
		arealabelstyle:function(feature) {
			return [new ol.style.Style({
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
				    src:Oeasygonganmap.Icon[feature.get("type")]
				})),
				text: new ol.style.Text({
					text: feature.get("name"),
					font:'12px sans-serif',
					offsetX:0,
					offsetY:-15,
					placement:'point',
					backgroundStroke:new ol.style.Stroke({
                        color:'rgba(61,155,232,1)',
                        width:1
                    }),
                    //标签的背景填充
                    backgroundFill:new ol.style.Fill({
                        color:'rgba(61,155,232,1)'
                    }),
                    padding:[5,5,5,5],
					fill: new ol.style.Fill({
						color: 'white'
						})
					})
			})];
		},
		
		gaocolor:'rgba(20, 123, 188,1)',
		zhongcolor:'rgba(14, 73, 117,1)',
		dicolor:'rgba(7,43, 70,1)',
			
		
		init:function(){
			
			Oeasygonganmap.vectorLayer = new ol.layer.Vector({
				source : Oeasygonganmap.vectorSource,
				style : Oeasygonganmap.Iconstyle,
				zIndex : 1000
			});
			// 初始弹出对象
			Oeasygonganmap.overlay = new ol.Overlay(({
				element : document.getElementById("gonganmapPopup"),
				offset : [ -150, -250 ],
				positioning : "top-right",
				autoPan : true,
				autoPanAnimation : {
					duration : 250
				}
			}));
			//根据类型加载瓦片地图服务
			switch (oeasymapconfig.maptype){
		       case '0':
		           Oeasygonganmap.basemap = new ol.layer.Tile({
                     opacity: 1.0,
                     source: new ol.source.XYZ({
                       url: oeasymapconfig.streetmap
                     })
                   });
		          break;
		       case '1':
		         var projection = ol.proj.get('EPSG:4326');
                 var projectionExtent = projection.getExtent();
                 var size = ol.extent.getWidth(projectionExtent) / 256;
                 var resolutions = new Array(20);
                 var matrixIds = new Array(20);
                 for (var z = 0; z < 20; ++z) {
                   resolutions[z] = size / Math.pow(2, z);
                   matrixIds[z] = z;
                 }
				 Oeasygonganmap.basemap= new ol.layer.Tile({
						extent:projectionExtent,
						source: new ol.source.WMTS({
							url: oeasymapconfig.streetmap,
					        layer: 'JSSLDT',       //图层名称，需公安提供
					        matrixSet:"EPSG:4326",
					        format: "tiles",
					        projection: VCADS.projection.getCode(),
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
	        }
			
			
			Oeasygonganmap.map = new ol.Map({
				layers: [Oeasygonganmap.basemap],
		        target: document.getElementById("gonganmap"),
		        overlays : [ Oeasygonganmap.overlay ],
		        controls: ol.control.defaults({
		          attributionOptions: ({
		            collapsible: false
		          })
		        }),
		        view: Oeasygonganmap.view,
		        interactions: ol.interaction.defaults({
				     doubleClickZoom: false
			     })
		      });
			
			Oeasygonganmap.map.addLayer(Oeasygonganmap.vectorLayer);
			
			
			setTimeout(function(){
				Oeasygonganmap.map.on("click", function(evt){
					var feature= Oeasygonganmap.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
						return feature;
					});
					if(feature){
						var layername= feature.get("layername")?feature.get("layername"):"unknow";
						var geometry= feature.getGeometry();
						var coord= geometry.getCoordinates();
						switch(layername){
						        case "videolayer":
						        	
								break;
						        	
						}
					}
				});
			},500);
			
			
			
		},
		

		
		
		mouseoverevt:function(pixel){
			var feature= Oeasygonganmap.map.forEachFeatureAtPixel(pixel, function(feature, layer){
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
						$("#gonganmapPopup-content").html(html);
                        Oeasygonganmap.overlay.setPosition(coord);
                        break;
                    
                }
            }else{
            	Oeasygonganmap.overlay.setPosition(undefined);
            }
		},
		
		closepopup:function(){
			Oeasygonganmap.overlay.setPosition(null);
			$("#gonganmapPopup").css("display","none");
		},
		
		GetQueryString:function(name)
		{
			return window.location.href.split('=')[1];
		},
		
		return3dgispage:function(){
        	top.location.href = oeasymapconfig.return3dgispage ;  
        },
		
      
		
		
  };