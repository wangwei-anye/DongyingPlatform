

$(document).ready(function () {

	Oeasymap2d.init();
});

var Oeasymap2d = {
	map: null,
	Token: null,
	Icon: {
		'unitpoint': 'images/unit.png',
		'unitpoints': 'images/units.png',
		'video': 'images/video.png',
		'unit': 'images/xiaoqu.png',
		'null': ''
	},
	Iconstyle: function (feature, resolution) {

		var style = new ol.style.Style({
			fill: new ol.style.Fill({
				color: 'rgba(241,242,236,0.8)',
			}),
			stroke: new ol.style.Stroke({
				color: 'red',
				width: 2
			}),
			image: new ol.style.Icon(({
				offset: [0, 0],
				opacity: 1.0,
				rotateWithView: true,
				rotation: 0.0,
				scale: 1.0,
				size: [60, 40],
				anchor: [0.1, 0],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				src: Oeasymap2d.Icon[feature.get("type")]
			})),
			text: new ol.style.Text({
				font: '12px sans-serif',
				offsetX: 0,
				offsetY: -7,
				placement: 'point',
				backgroundStroke: new ol.style.Stroke({
					color: 'rgba(255,51,0,1)',
					width: 1
				}),
				//标签的背景填充
				backgroundFill: new ol.style.Fill({
					color: 'rgba(255,51,0,1)'
				}),
				fill: new ol.style.Fill({
					color: 'rgba(255,255,255,1)',

				})
			})
		});

		if (feature.get('name')) {
			style.getText().setText(resolution < 0.00004291534423828125 ? feature.get('name') : '');
		}

		return [style];
	},

	changepointstyle: function (feature) {
		return [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: 'red',
				width: 2
			}),
			image: new ol.style.Circle({
				radius: 8,
				fill: new ol.style.Fill({
					color: 'white'
				}),
				stroke: new ol.style.Stroke({
					color: 'rgba(0,128,192,0.2)',
					width: 15
				}),
			})
		})];
	},

	areastyle: function (feature) {
		return [new ol.style.Style({
			text: new ol.style.Text({
				text: feature.get("name"),
				font: '12px sans-serif',
				offsetX: 0,
				offsetY: -15,
				fill: new ol.style.Fill({
					color: '#FFFfff'
				})
			})
		})];
	},


	vectorSource: new ol.source.Vector({
		wrapX: false
	}),
	vectorLayer: null,

	overlay: null, // 地图弹出信息窗口
	view: new ol.View({
		projection: "EPSG:4326",
		center: [oeasymapconfig.x, oeasymapconfig.y],
		zoom: oeasymapconfig.zoom,

	}),


	allPCSStyle: new ol.style.Style({
		fill: new ol.style.Fill({
			color: 'rgba(0,83, 153,0.7)'
		}),
		stroke: new ol.style.Stroke({
			color: '#319FD3',
			width: 1
		}),
	}),

	dicolor: 'rgba(0,83, 153,1)',

	xqgeoSource: new ol.source.Vector(),//辖区资源
	xqgeolayer: null,
	Pheatmaplayer: null,
	PheatmapSource: new ol.source.Vector({
		wrapX: false
	}),
	Hheatmaplayer: null,
	HheatmapSource: new ol.source.Vector({
		wrapX: false
	}),
	heatmapFeatures: [],

	init: function (list) {

		Oeasymap2d.vectorLayer = new ol.layer.Vector({
			source: Oeasymap2d.vectorSource,
			style: Oeasymap2d.Iconstyle,
			zIndex: 1000
		});
		// 初始弹出对象
		Oeasymap2d.overlay = new ol.Overlay(({
			element: document.getElementById("map2dPopup"),
			offset: [-30, 30],
			positioning: "top-right",
			autoPan: true,
			autoPanAnimation: {
				duration: 250
			}
		}));

		var basemap = oeasymapconfig.streetmap();
		Oeasymap2d.map = new ol.Map({
			layers: [basemap],
			target: document.getElementById("map2d"),
			controls: ol.control.defaults({
				attributionOptions: ({
					collapsible: false
				})
			}),
			overlays: [Oeasymap2d.overlay],
			view: Oeasymap2d.view,
		});

		Oeasymap2d.map.addLayer(Oeasymap2d.vectorLayer);
		
		setTimeout(function () {
			Oeasymap2d.addvideo();
			Oeasymap2d.addunitdata(list);
			Oeasymap2d.map.on("pointermove", function (e) {
				if (e.dragging) {
					return;
				}
				var pixel = Oeasymap2d.map.getEventPixel(e.originalEvent);
				var hit = Oeasymap2d.map.hasFeatureAtPixel(pixel);
				Oeasymap2d.map.getTarget().style.cursor = hit ? 'pointer' : '';
				Oeasymap2d.mouseoverevt(pixel);    //鼠标停放事件
			});
			Oeasymap2d.map.on("click", function (evt) {
				var feature = Oeasymap2d.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
					return feature;
				});

				if (feature) {
					var type = feature.get("layername") ? feature.get("layername") : "unknow";
					var geometry = feature.getGeometry();
					var coord = geometry.getCoordinates();
					switch (type) {
						case "UnitLayer":
							//跳转到三维GIS页面
							parent.document.querySelector(".mapIframe").src = oeasymapconfig.gis3durl;
							break;
					}
				}
			});
		}, 1000);
		Oeasymap2d.inputlistenfun();
	},

	mouseoverevt: function (pixel) {
		var feature = Oeasymap2d.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
			return feature;
		});
		if (feature) {
			var type = feature.get("layername") ? feature.get("layername") : "unknow";
			var geometry = feature.getGeometry();
			var coord = geometry.getCoordinates();
			switch (type) {
				/*****小区图层******/
				case "UnitLayer":
					//处理点击小区点图层事件的逻辑;
					var id = feature.get('id');
					var unit_id = feature.get('unit_id');
					var unit_name = feature.get('unit_name');
					var html = "";
					html += "";
					html += "<table style='font-size: 11px;color:white;width:auto;'>";
					html += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:25px;padding-left:3px;'>名称：" + unit_name + "</td></tr>";

					html += "</table>";
					$("#map2dPopup-content").html(html);
					Oeasymap2d.overlay.setPosition(coord);

					break;
				case 'videoLayer':
					var id = feature.get('id');
					var lng = feature.get('lng');
					var lat = feature.get('lat');
					var videoname = feature.get('name');
					var htmlvideo = "";
					htmlvideo += "";
					htmlvideo += "<table style='font-size: 11px;color:white;width:auto;'>";
					htmlvideo += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:25px;padding-left:3px;'>名称：" + videoname + "</td></tr>";
					htmlvideo += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:1px;padding-left:3px;'>经度：" + lng + "</td></tr>";
					htmlvideo += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:3px;padding-left:3px;'>纬度：" + lat + " </td></tr>";
					htmlvideo += "</table>";
					$("#map2dPopup-content").html(htmlvideo);
					Oeasymap2d.overlay.setPosition(coord);
					break;


			}
		} else {
			Oeasymap2d.overlay.setPosition(undefined);
		}
	},

	changeunitpointsize: function () {
		Oeasymap2d.vectorSource.forEachFeature(function (_feature) {
			var stylechanged = _feature.get("stylechanged");
			if (stylechanged == '1') {
				_feature.setStyle(Oeasymap2d.Iconstyle(_feature));
			}


		});
	},

	getUrlParam: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	},


	addunitdata: function () {
		var city_code = Oeasymap2d.getUrlParam('city_code');
		var town_code = Oeasymap2d.getUrlParam('town_code');
		var police_code = Oeasymap2d.getUrlParam('police_code');
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
			url: oeasymapconfig.unitInfo + "/unit/unitInfo.do",
			dataType: "json",
			type: "POST",
			data: dataparam,
			xhrFields: {
				withCredentials: true
			}

		}).done(function (_dt) {
			var data = _dt.data;
			var projection = Oeasymap2d.map.getView().getProjection();
			if (data != null) {
				if (data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						var lng = Number(data[i].lng);
						var lat = Number(data[i].lat);
						var unitid = data[i].unit_id;
						// 图上显示
						var point = new ol.geom.Point([lng, lat]);
						var iconFeature = new ol.Feature({
							geometry: point,
							id: data[i].unit_id,
							layername: "UnitLayer",
							unit_id: data[i].unit_id,
							unit_name: data[i].unit_name,
							lng: lng,
							lat: lat,
							type: "unit"
						});
						iconFeature.setId(data[i].unit_id);
						Oeasymap2d.vectorSource.addFeature(iconFeature);
						Oeasymap2d.heatmapFeatures.push(iconFeature);
					}

				}
			}

		});

	},

	addvideo: function () {
		$.ajax({
			url: "js/json/video.json",
			dataType: "json",
			type: "GET",

		}).done(function (_dt) {
			var data = _dt.data;

			if (data != null) {
				if (data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						var lng = Number(data[i].lng);
						var lat = Number(data[i].lat);
						var code = data[i].code;
						var name = data[i].name;
						// 图上显示
						var point = new ol.geom.Point([lng, lat]);
						var iconFeature = new ol.Feature({
							geometry: point,
							id: code,
							layername: "videoLayer",
							name: name,
							lng: lng,
							lat: lat

						});
						iconFeature.set("type", "video");
						iconFeature.setId(code);
						Oeasymap2d.vectorSource.addFeature(iconFeature);
					}

				}
			}

		});
	},

	searchresult: function () {

		$("#map2dsearchlist").empty();
		var content = $("#map2dsearchtxt").val();
		if (content) {
			$("#map2dlistpanel").show(100);
			$.ajax({
				url: "js/json/video.json",
				dataType: "json",
				type: "GET"
			}).done(function (_dt) {
				var data = _dt.data;
				if (data != null) {

					if (data.length > 0) {
						var t = 0;
						for (var i = 0; i < data.length; i++) {
							var lng = Number(data[i].lng);
							var lat = Number(data[i].lat);
							var code = data[i].code;
							var name = data[i].name;

							if (name.indexOf(content) != -1) {
								var html = "";

								html += "<div class=\"select-query-map2dPanel\" onclick='Oeasymap2d.location(\"" + code + "\"," + lng + "," + lat + ")' id=\"" + i
									+ "_videolistdata\">";
								html += "<div class=\"select-query-map2dLeft\"><span>"
									+ t + "</span></div>";
								html += "<div class=\"select-query-map2dRight\">";
								html += "<table class=\"select-query-map2dTable\">";
								html += "<tr><td class=\"select-query-map2dSecond\" style='color:white;'>" + "名称:  "
									+ name + "</td></tr>";
								html += "<tr><td class=\"select-query-map2dSecond\" style='color:white;'>" + "经度:  "
									+ lng + "</td></tr>";
								html += "<tr><td class=\"select-query-map2dSecond\" style='color:white;'>" + "纬度:  "
									+ lat + "</td></tr>";

								html += "</table>";
								html += "</div>";
								html += "</div>";
								t = t + 1;
								$("#map2dsearchlist").append(html);
							}
						}

					}
					Oeasymap2d.mouserCase("map2dsearchlist");
				}

			});

		} else {
			Oeasymap2d.searchcancle();
		}

	},

	location: function (code, lng, lat) {
		Oeasymap2d.vectorSource.forEachFeature(function (_feature) {
			var layername = _feature.get("layername");
			var id = _feature.get('id');
			if (layername == "videoLayer" && id == code) {
				var videoname = _feature.get('name');
				var coord = [lng, lat];
				// var view = new ol.View({
				// 	projection: "EPSG:4326",
				// 	center: [lng,lat],
				// 	zoom: 14
				//   });

				// Oeasymap2d.map.setView(view);
				// var extent = _feature.getGeometry().getExtent();
				// var view = Oeasymap2d.map.getView();
				// view.fit(extent,Oeasymap2d.map.getSize());
				Oeasymap2d.map.getView().setCenter(coord);
				var htmlvideo = "";
				htmlvideo += "<table style='font-size: 11px;color:white;width:auto;'>";
				htmlvideo += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:25px;padding-left:3px;'>名称：" + videoname + "</td></tr>";
				htmlvideo += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:1px;padding-left:3px;'>经度：" + lng + "</td></tr>";
				htmlvideo += "<tr><td style='font-size:12px;color:rgba(15,77,152,1);padding-top:3px;padding-left:3px;'>纬度：" + lat + " </td></tr>";
				htmlvideo += "</table>";
				$("#map2dPopup-content").html(htmlvideo);
				Oeasymap2d.overlay.setPosition(coord);
			}
		});
	},

	mouserCase: function (type) {
		setTimeout(function () {
			$("#" + type + " .select-query-map2dPanel").mouseover(function () {
				var id = this.id;
				$("#" + id).css("background-color", "rgba(28,135,201,0.9)");
			});

			$("#" + type + " .select-query-map2dPanel").mouseout(function () {
				var id = this.id;
				$("#" + id).css("background-color", "rgba(22,65,136,0.9)");
			});

		}, 500);
	},

	inputlistenfun: function () {
		$('#map2dsearchtxt').bind('input propertychange', function () {

			var length = $(this).val().length;
			if (Number(length) > 0) {
				$("#map2dsearch-cancle").css("display", "block");

			} else {
				$("#map2dsearch-cancle").css("display", "none");
			}
		});
	},

	searchcancle: function () {
		$('#map2dlistpanel').hide();
		$("#map2dsearch-cancle").hide();
		$('#map2dsearchtxt').val('');
	},

	showPheatmaplayer: function () {
		var hasChk = $('#showm2dpeoplelayer').is(':checked');
		if (hasChk) {
			//添加热力图
			Oeasymap2d.PheatmapSource.clear();
			Oeasymap2d.PheatmapSource.addFeatures(Oeasymap2d.heatmapFeatures);
			Oeasymap2d.Pheatmaplayer = new ol.layer.Heatmap({
				source: Oeasymap2d.PheatmapSource,
				blur: 100,
				radius: 40,
				opacity: 0.6
			});

			Oeasymap2d.map.addLayer(Oeasymap2d.Pheatmaplayer);
		} else {
			Oeasymap2d.PheatmapSource.clear();
			Oeasymap2d.map.removeLayer(Oeasymap2d.Pheatmaplayer);
		}

	},

	showHheatmaplayer: function () {
		var hasChk = $('#showm2dhouselayer').is(':checked');
		if (hasChk) {
			//添加热力图
			Oeasymap2d.HheatmapSource.clear();
			Oeasymap2d.HheatmapSource.addFeatures(Oeasymap2d.heatmapFeatures);
			Oeasymap2d.Hheatmaplayer = new ol.layer.Heatmap({
				source: Oeasymap2d.HheatmapSource,
				blur: 60,
				radius: 30,
				opacity: 0.6
			});

			Oeasymap2d.map.addLayer(Oeasymap2d.Hheatmaplayer);
		} else {
			Oeasymap2d.HheatmapSource.clear();
			Oeasymap2d.map.removeLayer(Oeasymap2d.Hheatmaplayer);
		}
	},

	//添加行政区面，并设置行政区名称
	addcountylayer: function () {
		var city_code = Oeasymap2d.getUrlParam('city_code');
		var town_code = Oeasymap2d.getUrlParam('town_code');
		$.ajax({
			url: "js/countynew.json",
			dataType: "json",
			type: "GET"

		}).done(function (_dt) {
			var format = new ol.format.GeoJSON();
			var features = format.readFeatures(_dt, {
				dataProject: "EPSG:4326",
				featureProjection: "EPSG:4326"
			});

			var addNameFeatures = [];
			if (features.length > 0) {

				for (var i = 0; i < features.length; i++) {
					var f = features[i];
					f.set("type", "xq");
					f.set("id", f.N.ADCODE99);
					f.set("adcode99", f.N.ADCODE99);
					f.setId(f.N.ADCODE99);
					console.log("f.N.ADCODE99:" + f.N.ADCODE99);

					//根据区域中心，设置中心点名称图标


					if (f.N.ADCODE99 == '370502') {
						addNameFeatures.push(f);
						f.setStyle(Oeasymap2d.allPCSStyle);

					}

				}
				Oeasymap2d.xqgeoSource.addFeatures(addNameFeatures);

			}
		});

	},


};