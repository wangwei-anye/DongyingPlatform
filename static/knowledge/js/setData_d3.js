function requestData(jsonData, first) {
	jsonData.nodes.length = Math.min(200, jsonData.nodes.length);
	filterSameNode(jsonData.nodes);
	//主节点
	if(first) {
		$("#canvasBox").hide();
		setTimeout(function() {
			$("#canvasBox").fadeIn(200);
		}, 700);
		for(var i = 0; i < jsonData.nodes.length; i++) {
			if(jsonData.nodes[i].node_id == jsonData.baseNode) {
//				var txtArr = getPeopleTxtArr("姓名:" + jsonData.nodes[i].attribute.name, "年龄:" + (isEmpty(jsonData.nodes[i].attribute.age) ? "未知" : jsonData.nodes[i].attribute.age), "身份证:" + (isEmpty(jsonData.nodes[i].attribute.id_card) ? "未知" : jsonData.nodes[i].attribute.id_card));
				baseData.nodes.push({
					"node_id": jsonData.baseNode,
					"name": jsonData.nodes[i].name,
					"node_type": jsonData.nodes[i].node_type,
					"shapeType": "img",
					"des": "",
					"color": "#00B4FF",
					"w": mainNodeWidtgh,
					"h": mainNodeWidtgh,
					"imgUrl": jsonData.nodes[i].attribute.images,
					"hasMore": "N",
					"isNew": "Y",
					"display": "Y",
					"parentNode": [],
					"txtArr": ''
				});
			}
		}
		firstBaseNodeId = jsonData.baseNode;
		mainNodeArr.push(jsonData.baseNode);
	}
	//第一节属性节点
	for(e in configArr) {
		if(configArr[e].img) {
			baseData.nodes.push({
				node_id: jsonData.baseNode + "_" + configArr[e].id,
				name: "",
				nameDes: configArr[e].name,
				"node_type": e,
				"shapeType": 'prop_' + configArr[e].shapeType,
				"color": configArr[e].color,
				"fontSize": configArr[e].fontSize,
				"w": configArr[e].w,
				"h": configArr[e].h,
				"imgUrl": configArr[e].img,
				"hasMore": "N",
				"defaultHasMore": 'N',
				"isNew": "Y",
				"display": "Y",
				"hasLoad": "Y",
				"parentNode": getNewParentNodeArr(jsonData.baseNode),
				"nodeIndex": 0,
				"textPosition": "center",
				"hasChildNode": "N"
			});
			baseData.edges.push({
				"source": jsonData.baseNode,
				"target": jsonData.baseNode + "_" + configArr[e].id,
				"des": configArr[e].linkDes,
				"len": firstNodeLinkLen
			});
		} else {
			baseData.nodes.push({
				node_id: jsonData.baseNode + "_" + configArr[e].id,
				name: configArr[e].name,
				"node_type": e,
				"shapeType": configArr[e].shapeType,
				"color": configArr[e].color,
				"fontSize": configArr[e].fontSize,
				"w": configArr[e].w,
				"h": configArr[e].h,
				"hasMore": "N",
				"defaultHasMore": 'N',
				"isNew": "Y",
				"display": "Y",
				"hasLoad": "Y",
				"parentNode": getNewParentNodeArr(jsonData.baseNode),
				"nodeIndex": 0,
				"textPosition": "center",
				"hasChildNode": "N"
			});
			baseData.edges.push({
				"source": jsonData.baseNode,
				"target": jsonData.baseNode + "_" + configArr[e].id,
				"des": configArr[e].linkDes,
				"len": firstNodeLinkLen
			});
		}
		configArr[e].hasChildNode = 'N';
	}
	var door_record_index = 1;
	var car_record_index = 1;
	for(var i = 0; i < jsonData.nodes.length; i++) {
		
		if(jsonData.nodes[i].node_type == 'door_record' && !isNodeExist(jsonData.nodes[i].node_id)) {
			baseData.nodes.push({ "node_id": jsonData.nodes[i].node_id, "name": jsonData.nodes[i].attribute.hasOwnProperty("user_name") ? jsonData.nodes[i].attribute.user_name : jsonData.nodes[i].attribute.address, "time": jsonData.nodes[i].attribute.time, "node_type": "door_record", "shapeType": configArr["door_record"].shapeType, "des": configArr["door_record"].des, "color": configArr["door_record"].color, "fontSize": recordFontSize, "w": rectNodeWidth, "h": rectNodeHeight, "imgUrl": "", "hasMore": 'N', "defaultHasMore": 'N', "isNew": "Y", "display": "Y", "hasLoad": "Y", "parentNode": getNewParentNodeArr(jsonData.baseNode + "_" + configArr["door_record"].id), "nodeIndex": door_record_index, "selectId": '', "textPosition": "twoLine" });
			baseData.edges.push({ "source": jsonData.baseNode + "_" + 'doorRecordNode', "target": jsonData.nodes[i].node_id, "des": configArr['door_record'].linkDes, "len": secondNodeLinkLen + 4 * i });
			door_record_index++;
			configArr['door_record'].hasChildNode = 'Y';
		}
		if(jsonData.nodes[i].node_type == 'car_record' && !isNodeExist(jsonData.nodes[i].node_id)) {
			var str = "";
//			if(fromNode == "estate") {
//				str = jsonData.nodes[i].attribute.plate_number;
//			} else {
//				
//			}
            str = jsonData.nodes[i].attribute.address;
			baseData.nodes.push({ "node_id": jsonData.nodes[i].node_id, "name": str, "time": jsonData.nodes[i].attribute.time, "node_type": "car_record", "shapeType": configArr["car_record"].shapeType, "des": configArr["car_record"].des, "color": configArr["car_record"].color, "fontSize": recordFontSize, "w": rectNodeWidth, "h": rectNodeHeight, "imgUrl": "", "hasMore": 'N', "defaultHasMore": 'N', "isNew": "Y", "display": "Y", "hasLoad": "Y", "parentNode": getNewParentNodeArr(jsonData.baseNode + "_" + configArr["car_record"].id), "nodeIndex": car_record_index, "selectId": '', "textPosition": "twoLine" });
			baseData.edges.push({ "source": jsonData.baseNode + "_" + 'carRecordNode', "target": jsonData.nodes[i].node_id, "des": configArr['car_record'].linkDes, "len": secondNodeLinkLen + 4 * i });
			car_record_index++;
			configArr['car_record'].hasChildNode = 'Y';
		}
		
		if(jsonData.nodes[i].node_type == 'address') {
			var linkDes = getEdegDesByNodeId(jsonData.nodes[i].node_id, jsonData.edges);
			if(!isNodeExist(jsonData.nodes[i].node_id)) {
				baseData.nodes.push({
					"node_id": jsonData.nodes[i].node_id,
					"name": jsonData.nodes[i].attribute.room_address.substring(0, 14),
					"time": jsonData.nodes[i].attribute.room_address.substring(14, Math.min(jsonData.nodes[i].attribute.room_address.length, 28)),
					"node_type": "address",
					"shapeType": configArr["address"].shapeType,
					"des": configArr["address"].des,
					"color": configArr["address"].color,
					"fontSize": recordFontSize,
					"w": rectNodeWidth,
					"h": rectNodeHeight,
					"imgUrl": "",
					"hasMore": "N",
					"defaultHasMore": "N",
					"isNew": "Y",
					"display": "Y",
					"hasLoad": "Y",
					"parentNode": getNewParentNodeArr(jsonData.baseNode + "_" + configArr["address"].id),
					"selectId": jsonData.nodes[i].attribute.r_id,
					"textPosition": jsonData.nodes[i].attribute.room_address.length > 14 ? "twoLine" : "center"
				});
			} else {
				//两个父节点   第二个父节点开始放在最后  主节点后面
				if(jsonData.nodes[i].node_id != firstBaseNodeId) {
					getNodeById(jsonData.nodes[i].node_id).parentNode.push(jsonData.baseNode + "_" + 'addressNode');
				}
			}
			baseData.edges.push({
				"source": jsonData.baseNode + "_" + 'addressNode',
				"target": jsonData.nodes[i].node_id,
				"des": linkDes,
				"len": secondNodeLinkLen
			});
			configArr['address'].hasChildNode = 'Y';
		}
		if(jsonData.nodes[i].node_type == 'relationship' && jsonData.nodes[i].node_id != jsonData.baseNode && !isNodeExist(jsonData.nodes[i].node_id)) {
			var txtArr = getPeopleTxtArr("姓名:" + jsonData.nodes[i].attribute.name, "年龄:" + (isEmpty(jsonData.nodes[i].attribute.age) ? "未知" : jsonData.nodes[i].attribute.age), "身份证:" + (isEmpty(jsonData.nodes[i].attribute.id_card) ? "未知" : jsonData.nodes[i].attribute.id_card));
			baseData.nodes.push({
				"node_id": jsonData.nodes[i].node_id,
				"name": isEmpty(jsonData.nodes[i].attribute.relationship) ? jsonData.nodes[i].attribute.name : jsonData.nodes[i].attribute.relationship + ":" + jsonData.nodes[i].attribute.name,
				"node_type": "family",
				"shapeType": 'img',
				"des": configArr["family"].des,
				"color": configArr["family"].color,
				"fontSize": normalFontSize,
				"w": normalNodeWidth,
				"h": normalNodeWidth,
				"imgUrl": jsonData.nodes[i].attribute.images,
				"hasMore": 'N',
				"defaultHasMore": 'N',
				"isNew": "Y",
				"display": "Y",
				"hasLoad": "N",
				"parentNode": getNewParentNodeArr(jsonData.baseNode + "_" + configArr["family"].id),
				"selectId": '',
				"textPosition": "top",
				"txtArr": txtArr
			});
			baseData.edges.push({
				"source": jsonData.baseNode + "_" + 'familyNode',
				"target": jsonData.nodes[i].node_id,
				"des": configArr['family'].linkDes,
				"len": secondNodeLinkLen
			});
			configArr['family'].hasChildNode = 'Y';
		}
		
		if(jsonData.nodes[i].node_type == 'tenant' && !isNodeExist(jsonData.nodes[i].node_id)) {
			var txtArr = getPeopleTxtArr("姓名:" + jsonData.nodes[i].attribute.name, "年龄:" + (isEmpty(jsonData.nodes[i].attribute.age) ? "未知" : jsonData.nodes[i].attribute.age), "身份证:" + (isEmpty(jsonData.nodes[i].attribute.id_card) ? "未知" : jsonData.nodes[i].attribute.id_card));
			baseData.nodes.push({
				"node_id": jsonData.nodes[i].node_id,
				"name":  isEmpty(jsonData.nodes[i].attribute.relationship) ? jsonData.nodes[i].attribute.name : jsonData.nodes[i].attribute.relationship + ":" + jsonData.nodes[i].attribute.name,
				"node_type": "tenant",
				"shapeType": 'img',
				"des": configArr["tenant"].des,
				"color": configArr["tenant"].color,
				"fontSize": normalFontSize,
				"w": normalNodeWidth,
				"h": normalNodeWidth,
				"imgUrl": jsonData.nodes[i].attribute.images,
				"hasMore": 'N',
				"defaultHasMore": 'N',
				"isNew": "Y",
				"display": "Y",
				"hasLoad": "N",
				"parentNode": getNewParentNodeArr(jsonData.baseNode + "_" + configArr["tenant"].id),
				"selectId": '',
				"textPosition": "top",
				"txtArr": txtArr
			});
			baseData.edges.push({
				"source": jsonData.baseNode + "_" + 'tenantNode',
				"target": jsonData.nodes[i].node_id,
				"des": configArr['tenant'].linkDes,
				"len": secondNodeLinkLen
			});
			configArr['tenant'].hasChildNode = 'Y';
		} else if(jsonData.nodes[i].node_type == 'tenant' && isNodeExist(jsonData.nodes[i].node_id)) {
			baseData.edges.push({
				"source": jsonData.baseNode + "_" + 'tenantNode',
				"target": jsonData.nodes[i].node_id,
				"des": configArr['tenant'].linkDes,
				"len": secondNodeLinkLen
			});
			configArr['tenant'].hasChildNode = 'Y';
		}
		
		if(jsonData.nodes[i].node_type == 'owner') {
			var txtArr = getPeopleTxtArr("姓名:" + jsonData.nodes[i].attribute.name, "年龄:" + (isEmpty(jsonData.nodes[i].attribute.age) ? "未知" : jsonData.nodes[i].attribute.age), "身份证:" + (isEmpty(jsonData.nodes[i].attribute.id_card) ? "未知" : jsonData.nodes[i].attribute.id_card));
			baseData.nodes.push({ "node_id": jsonData.nodes[i].node_id, "name": jsonData.nodes[i].attribute.name, "node_type": "owner", "shapeType": 'img', "des": configArr["owner"].des, "color": configArr["owner"].color, "fontSize": normalFontSize, "w": normalNodeWidth, "h": normalNodeWidth, "imgUrl": jsonData.nodes[i].attribute.images, "hasMore": "N", "defaultHasMore": "N", "isNew": "Y", "display": "Y", "hasLoad": "N", "parentNode": getNewParentNodeArr(jsonData.baseNode + "_" + configArr["owner"].id), "selectId": '', "textPosition": "top", "txtArr": txtArr });
			baseData.edges.push({ "source": jsonData.baseNode + "_" + 'ownerNode', "target": jsonData.nodes[i].node_id, "des": configArr['owner'].linkDes, "len": secondNodeLinkLen });
			configArr['owner'].hasChildNode = 'Y';
		}
		
		if(jsonData.nodes[i].node_type == 'vistor' && !isNodeExist(jsonData.nodes[i].node_id)) {
			baseData.nodes.push({ "node_id": jsonData.nodes[i].node_id, "name": jsonData.nodes[i].attribute.name, "node_type": "vistor", "shapeType": 'img', "des": configArr["vistor"].des, "color": configArr["vistor"].color, "fontSize": normalFontSize, "w": normalNodeWidth, "h": normalNodeWidth, "imgUrl": jsonData.nodes[i].attribute.images, "hasMore": "N", "defaultHasMore": 'N', "isNew": "Y", "display": "Y", "hasLoad": "Y", "parentNode": getNewParentNodeArr(jsonData.baseNode + "_" + configArr["vistor"].id), "selectId": '', "textPosition": "top" });
			baseData.edges.push({ "source": jsonData.baseNode + "_" + 'vistorNode', "target": jsonData.nodes[i].node_id, "des": configArr['vistor'].linkDes, "len": secondNodeLinkLen });
			configArr['vistor'].hasChildNode = 'Y';
		} else if(jsonData.nodes[i].node_type == 'vistor' && isNodeExist(jsonData.nodes[i].node_id)) {
			baseData.edges.push({ "source": jsonData.baseNode + "_" + 'vistorNode', "target": jsonData.nodes[i].node_id, "des": configArr['vistor'].linkDes, "len": secondNodeLinkLen });
			configArr['vistor'].hasChildNode = 'Y';
		}

		if(jsonData.nodes[i].node_type == 'car' && !isNodeExist(jsonData.nodes[i].node_id)) {
			baseData.nodes.push({
				"node_id": jsonData.nodes[i].node_id,
				"name": jsonData.nodes[i].attribute.plate,
				"node_type": "car",
				"shapeType": 'img',
				"des": configArr["car"].des,
				"color": configArr["car"].color,
				"fontSize": normalFontSize,
				"w": normalNodeWidth,
				"h": normalNodeWidth,
				"imgUrl": jsonData.nodes[i].attribute.images,
				"hasMore": "N",
				"defaultHasMore": "N",
				"isNew": "Y",
				"display": "Y",
				"hasLoad": "N",
				"parentNode": getNewParentNodeArr(jsonData.baseNode + "_" + configArr["car"].id),
				"selectId": jsonData.nodes[i].attribute.plate,
				"textPosition": "top"
			});
			baseData.edges.push({
				"source": jsonData.baseNode + "_" + 'carNode',
				"target": jsonData.nodes[i].node_id,
				"des": configArr['car'].linkDes,
				"len": secondNodeLinkLen
			});
			configArr['car'].hasChildNode = 'Y';
		} else if(jsonData.nodes[i].node_type == 'car' && isNodeExist(jsonData.nodes[i].node_id)) {
			baseData.edges.push({
				"source": jsonData.baseNode + "_" + 'carNode',
				"target": jsonData.nodes[i].node_id,
				"des": configArr['car'].linkDes,
				"len": secondNodeLinkLen
			});
			configArr['car'].hasChildNode = 'Y';
		}


		if(jsonData.nodes[i].node_type == 'telphone' && !isNodeExist(jsonData.nodes[i].node_id)) {
			if(isEmpty(jsonData.nodes[i].attribute.tel)) {
				continue;
			}
			baseData.nodes.push({
				"node_id": jsonData.nodes[i].node_id,
				"name": jsonData.nodes[i].attribute.tel,
				"node_type": "telphone",
				"shapeType": configArr["telphone"].shapeType,
				"des": configArr["telphone"].des,
				"fontSize": normalFontSize,
				"color": configArr["telphone"].color,
				"w": rectNodeSmallWidth,
				"h": rectNodeSmallHeight,
				"imgUrl": "",
				"hasMore": "Y",
				"defaultHasMore": "Y",
				"isNew": "Y",
				"display": "Y",
				"hasLoad": "Y",
				"parentNode": getNewParentNodeArr(jsonData.baseNode + "_" + configArr["telphone"].id),
				"selectId": jsonData.nodes[i].attribute.tel,
				"textPosition": "center"
			});
			baseData.edges.push({
				"source": jsonData.baseNode + "_" + 'phoneNode',
				"target": jsonData.nodes[i].node_id,
				"des": configArr['telphone'].linkDes,
				"len": secondNodeLinkLen
			});
			configArr['telphone'].hasChildNode = 'Y';
			var hasMoreFlag = "N";
			if(jsonData.nodes[i].attribute.hasOwnProperty("mac") && jsonData.nodes[i].attribute.mac != "" && !isEmpty(jsonData.nodes[i].attribute.mac)) {
				baseData.nodes.push({
					"node_id": jsonData.nodes[i].node_id + "mac",
					"name": jsonData.nodes[i].attribute.mac.substring(0, 14),
					"time": jsonData.nodes[i].attribute.mac.length > 14 ? jsonData.nodes[i].attribute.mac.substring(14, Math.min(jsonData.nodes[i].attribute.mac.length, 28)) : "",
					"node_type": "telphone",
					"shapeType": configArr["telphone"].shapeType,
					"color": configArr["telphone"].color,
					"fontSize": normalFontSize,
					"des": configArr["telphone"].des,
					"w": rectNodeSmallWidth,
					"h": rectNodeSmallHeight,
					"imgUrl": "",
					"hasMore": "N",
					"defaultHasMore": "N",
					"hasMoreAble": "N",
					"isNew": "Y",
					"display": "N",
					"hasLoad": "Y",
					"parentNode": getNewParentNodeArr(jsonData.nodes[i].node_id),
					"textPosition": jsonData.nodes[i].attribute.mac.length > 14 ? "twoLine" : "center"
				});
				baseData.edges.push({
					"source": jsonData.nodes[i].node_id,
					"target": jsonData.nodes[i].node_id + "mac",
					"des": "mac",
					"len": thirdNodeLinkLen
				});
				hasMoreFlag = "Y";
			}
			if(jsonData.nodes[i].attribute.hasOwnProperty("imei") && jsonData.nodes[i].attribute.imei != "" && !isEmpty(jsonData.nodes[i].attribute.imei)) {
				baseData.nodes.push({
					"node_id": jsonData.nodes[i].node_id + "imei",
					"name": jsonData.nodes[i].attribute.imei,
					"node_type": "telphone",
					"shapeType": configArr["telphone"].shapeType,
					"color": configArr["telphone"].color,
					"fontSize": normalFontSize,
					"des": configArr["telphone"].des,
					"w": rectNodeSmallWidth,
					"h": rectNodeSmallHeight,
					"imgUrl": "",
					"hasMore": "N",
					"defaultHasMore": "N",
					"isNew": "Y",
					"display": "N",
					"hasLoad": "Y",
					"parentNode": getNewParentNodeArr(jsonData.nodes[i].node_id),
					"textPosition": "center"
				});
				baseData.edges.push({
					"source": jsonData.nodes[i].node_id,
					"target": jsonData.nodes[i].node_id + "imei",
					"des": "imei",
					"len": thirdNodeLinkLen
				});
				hasMoreFlag = "Y";
			}
			if(jsonData.nodes[i].attribute.hasOwnProperty("phone_type") && jsonData.nodes[i].attribute.phone_type != "" && !isEmpty(jsonData.nodes[i].attribute.phone_type)) {
				baseData.nodes.push({
					"node_id": jsonData.nodes[i].node_id + "phone_type",
					"name": jsonData.nodes[i].attribute.phone_type,
					"node_type": "telphone",
					"shapeType": configArr["telphone"].shapeType,
					"color": configArr["telphone"].color,
					"fontSize": normalFontSize,
					"des": configArr["telphone"].des,
					"w": rectNodeSmallWidth,
					"h": rectNodeSmallHeight,
					"imgUrl": "",
					"hasMore": "N",
					"defaultHasMore": "N",
					"isNew": "Y",
					"display": "N",
					"hasLoad": "Y",
					"parentNode": getNewParentNodeArr(jsonData.nodes[i].node_id),
					"textPosition": "center"
				});
				baseData.edges.push({
					"source": jsonData.nodes[i].node_id,
					"target": jsonData.nodes[i].node_id + "phone_type",
					"des": "手机型号",
					"len": thirdNodeLinkLen
				});
				hasMoreFlag = "Y";
			}
			if(jsonData.nodes[i].attribute.hasOwnProperty("uuid") && jsonData.nodes[i].attribute.uuid != "" && !isEmpty(jsonData.nodes[i].attribute.uuid)) {
				baseData.nodes.push({
					"node_id": jsonData.nodes[i].node_id + "uuid",
					"name": jsonData.nodes[i].attribute.uuid.substring(0, 14),
					"time": jsonData.nodes[i].attribute.uuid.length > 14 ? jsonData.nodes[i].attribute.uuid.substring(14, Math.min(jsonData.nodes[i].attribute.uuid.length, 28)) : "",
					"node_type": "telphone",
					"shapeType": configArr["telphone"].shapeType,
					"color": configArr["telphone"].color,
					"fontSize": normalFontSize,
					"des": configArr["telphone"].des,
					"w": rectNodeSmallWidth,
					"h": rectNodeSmallHeight,
					"imgUrl": "",
					"hasMore": "N",
					"defaultHasMore": "N",
					"isNew": "Y",
					"display": "N",
					"hasLoad": "Y",
					"parentNode": getNewParentNodeArr(jsonData.nodes[i].node_id),
					"textPosition": jsonData.nodes[i].attribute.uuid.length > 14 ? "twoLine" : "center"
				});
				baseData.edges.push({
					"source": jsonData.nodes[i].node_id,
					"target": jsonData.nodes[i].node_id + "uuid",
					"des": "udid",
					"len": thirdNodeLinkLen
				});
				hasMoreFlag = "Y";
			}
			for(var k = 0; k < baseData.nodes.length; k++) {
				if(baseData.nodes[k].node_id == jsonData.nodes[i].node_id) {
					baseData.nodes[k].hasMore = hasMoreFlag;
				}
			}

		}
	}
	var hasChildrenNodeFlag = false;
	for(e in configArr) {
		var propNode = getNodeById(jsonData.baseNode + "_" + configArr[e].id);
		propNode.hasChildNode = configArr[e].hasChildNode;
		if(propNode.hasChildNode == 'Y') {
			hasChildrenNodeFlag = true;
			propNode.display = "Y";
		} else {
			propNode.display = "N";
		}
	}

	if(!hasChildrenNodeFlag) {
		showError('该用户没有数据');
	}
	if(force) {
		force.stop();
	}
	render(baseData);
}

function filterSameNode(arr) {
	for(var i = arr.length - 1; i >= 0; i--) {
		for(var j = 0; j < arr.length; j++) {
			if(i != j && arr[j].node_id == arr[i].node_id) {
				arr.splice(i, 1);
			}
		}
	}
}

function addCarRecordNode(car_records, node_id) {
	for(var i = 0; i < car_records.length; i++) {
		baseData.nodes.push({
			"node_id": node_id + "_" + car_records[i].time + "_" + i,
			"name": car_records[i].address,
			"time": car_records[i].time,
			"node_type": "car_record",
			"shapeType": configArr["car_record"].shapeType,
			"des": configArr["car_record"].des,
			"color": configArr["car_record"].color,
			"fontSize": recordFontSize,
			"w": rectNodeWidth,
			"h": rectNodeHeight,
			"imgUrl": "",
			"hasMore": 'N',
			"isNew": "Y",
			"display": "Y",
			"hasLoad": "Y",
			"parentNode": getNewParentNodeArr(node_id),
			"nodeIndex": (i + 1),
			"selectId": car_records[i].time,
			"textPosition": "twoLine"
		});
		baseData.edges.push({
			"source": node_id,
			"target": node_id + "_" + car_records[i].time + "_" + i,
			"des": configArr['car_record'].linkDes,
			"len": secondNodeLinkLen + 4 * i
		});
	}
	if(force) {
		force.stop();
	}
	render(baseData);
}

var svg = d3.select("svg")
	.attr("width", canvasWidth)
	.attr("height", canvasHeight)

var centerX = canvasWidth / 2;
var centerY = canvasHeight / 2;
var initData = function() {
	var len = baseData.nodes.length;
	var l = parseInt(Math.sqrt(len));
	var distance = 100;
	for(var i = 0; i < len; i++) {
		if(baseData.nodes[i].isNew == 'Y') {
			baseData.nodes[i].x = centerX + ((i % l) - l + 1) * distance;
			baseData.nodes[i].y = centerY + ((i / l) - l + 1) * distance;
		}
	}
}
var render = function(root) {
	//获取存在的边描述
	vm.selectLinkDesArr = [];
	tempSelectNodeArr = [];
	if(baseData.edges.length > 0 && !baseData.edges[0].source.hasOwnProperty('display')) {
		for(var i = 0; i < baseData.edges.length; i++) {
			if(allLinkDesArr.indexOf(baseData.edges[i].des) != -1 && vm.selectLinkDesArr.indexOf(baseData.edges[i].des) == -1) {
				if(getNodeById(baseData.edges[i].source).display == 'Y' && getNodeById(baseData.edges[i].target).display == 'Y') {
					vm.selectLinkDesArr.push(baseData.edges[i].des);
				}
			}
		}
		for(var i = 0; i < baseData.nodes.length; i++) {
			if(tempSelectNodeArr.indexOf(baseData.nodes[i].node_type) == -1 && baseData.nodes[i].display == 'Y') {
				tempSelectNodeArr.push(baseData.nodes[i].node_type);
			}
		}
	} else {
		for(var i = 0; i < root.edges.length; i++) {
			if(allLinkDesArr.indexOf(root.edges[i].des) != -1 && vm.selectLinkDesArr.indexOf(root.edges[i].des) == -1) {
				if(root.edges[i].source.display == 'Y' && root.edges[i].target.display == 'Y') {
					vm.selectLinkDesArr.push(root.edges[i].des);
				}
			}
		}
		for(var i = 0; i < root.nodes.length; i++) {
			if(tempSelectNodeArr.indexOf(root.nodes[i].node_type) == -1 && baseData.nodes[i].display == 'Y') {
				tempSelectNodeArr.push(root.nodes[i].node_type);
			}
		}
	}
	vm.selectNodeArr = [];
	for(e in configArr) {
		if(tempSelectNodeArr.indexOf(e) != -1) {
			vm.selectNodeArr.push({
				id: e,
				name: configArr[e].name
			});
		}
	}

	vm.$nextTick(function() {
		if(vm.selectLinkDesArr.indexOf(vm.selectLinkIndex) == -1) {
			vm.selectLinkIndex = "all";
		}
		var flag = false;
		for(var i = 0; i < vm.selectNodeArr.length; i++) {
			if(vm.selectNodeArr[i].id == vm.selectNodeIndex) {
				flag = true;
			}
		}
		if(!flag) {
			vm.selectNodeIndex = "all";
		}
		$("#selectNode").val(vm.selectNodeIndex);
		$("#selectLink").val(vm.selectLinkIndex);
	});

	initData(root);
	//初始化  把id  链接节点 转换成 index
	for(var i = 0; i < root.edges.length; i++) {
		for(var k = 0; k < root.nodes.length; k++) {
			if(root.edges[i].source == root.nodes[k].node_id) {
				root.edges[i].source = k;
			}
			if(root.edges[i].target == root.nodes[k].node_id) {
				root.edges[i].target = k;
			}
		}
	}

	//清空全部节点
	svg.selectAll('*').filter(function(d, i) {
		return i > 5;
	}).remove();

	force = d3.layout.force()
		.nodes(root.nodes)
		.links(root.edges)
		.size([canvasWidth, canvasHeight])
		.linkStrength(0.99)
		.friction(0.9)
		.distance(function(d) {
			return d.len;
		})
		.charge(-5000)
		.gravity(0.1)
		.theta(0.9)
		.alpha(0.9)
		.start();

	//	var zoom = d3.behavior.zoom()
	//		.scaleExtent([0.5, 1])
	//		.on("zoom", zoomed);

	function zoomed() {
		if(isClick) {
			zoom.scale(lastScale);
			zoom.translate(lastTranslate);
			return;
		}
		lastTranslate = d3.event.translate;
		lastScale = d3.event.scale;
		edges_line.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		edges_text.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_img.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_prop_circle.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_prop_rect.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_circle.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_rect.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_hasMore.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_name.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		node_text.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		node_text2.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_tip.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_tip_text.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_people_tip.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_people_tip_text1.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_people_tip_text2.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_people_tip_text3.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_people_tip_text4.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_people_tip_text5.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		nodes_people_tip_text6.attr("transform",
			"translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}
	//	下面有个resetZoom 方法被注释了
	function resetZoom() {
		zoom.scale(lastScale);
		zoom.translate(lastTranslate);

		edges_line.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		edges_text.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_img.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_prop_circle.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_prop_rect.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_circle.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_rect.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_hasMore.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_name.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		node_text.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		node_text2.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_tip.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_tip_text.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_people_tip.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_people_tip_text1.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_people_tip_text2.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_people_tip_text2.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_people_tip_text3.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_people_tip_text4.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_people_tip_text5.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");
		nodes_people_tip_text6.attr("transform",
			"translate(" + lastTranslate + ")scale(" + lastScale + ")");

	}
	//	svg.call(zoom);

	var drag = force.drag()
		.on("dragstart", function(d, i) {
			d3.event.sourceEvent.stopPropagation();
			dragstarttime = new Date().getTime();
			clearTimeout(setimeId);
		})
		.on("dragend", function(d, i) {
			d3.event.sourceEvent.stopPropagation();
			clickNum++;
			if(new Date().getTime() - dragstarttime < 400) {
				setimeId = setTimeout(function() {
					if(clickNum == 1) {
						if(d.node_id != firstBaseNodeId) {
							centerX = d.x;
							centerY = d.y;
						}
					} else {
						d.fixed = false;
					}
					clickNum = 0;
				}, 200);
			} else {
				d.fixed = true;
				clickNum = 0;
			}

		})
		.on("drag", function(d, i) {
			d3.event.sourceEvent.stopPropagation();
		});

	var edges_line = svg.selectAll("edges_line")
		.data(root.edges)
		.enter()
		.append("line")
		.attr('class', function(d, i) {
			if(d.active == "Y") {
				return 'linkActive'
			}
			return "linkNormal";
		})
		.attr('display', function(d) {
			if(d.source.display == 'Y' && d.target.display == 'Y' && (!d.hasOwnProperty('display') || (d.hasOwnProperty('display') && d.display == 'Y'))) {
				return 'block';
			}
			return 'none';
		});

	var edges_text = svg.selectAll(".edges_text")
		.data(root.edges)
		.enter()
		.append("text")
		.attr("text-anchor", "middle")
		.attr("class", "linetext")
		.attr("display", function(d, i) {
			if(d.source.display == 'Y' && d.target.display == 'Y' && (!d.hasOwnProperty('display') || (d.hasOwnProperty('display') && d.display == 'Y'))) {
				return 'block';
			} else {
				return 'none';
			}
		})
		.text(function(d) {
			if(d.source.display == 'Y' && d.target.display == 'Y') {
				return d.des;
			}
			return d.des;
		});

	var nodes_img = svg.selectAll('nodes_img')
		.data(root.nodes)
		.enter()
		.append("circle")
		.filter(function(d, i) {
			return d.shapeType == 'img';
		})
		.attr("r", function(d, i) {
			return d.w / 2;
		})
		.style("stroke", function(d, i) {
			var str = d.color.colorRgb();
			var rate = 1.5;
			var r = parseInt(parseInt(str.split(',')[0]) * rate > 255 ? 255 : parseInt(str.split(',')[0]) * rate);
			var g = parseInt(parseInt(str.split(',')[1]) * rate > 255 ? 255 : parseInt(str.split(',')[1]) * rate);
			var b = parseInt(parseInt(str.split(',')[2]) * rate > 255 ? 255 : parseInt(str.split(',')[2]) * rate);
			var strss = "RGB(" + r + "," + g + ", " + b + ")";
			return(strss).colorHex();
		})
		.style("stroke-width", function(d, i) {
			if(d.active == "Y") {
				return '2px'
			}
			return "0px";
		})
		.attr('class', function(d, i) {
			if(d.active == "Y") {
				return 'nodeActive'
			}
			return "";
		})
		.style('cursor', function(d, i) {
			if(d.hasMore == 'Y') {
				return 'pointer';
			}
			return 'default';
		})
		.on("click", function(d, i) {})
		.attr("fill", function(d, i) {
			//创建圆形图片
			var defs = svg.append("defs").attr("id", "imgdefs" + i)
			var catpattern = defs.append("pattern")
				.attr("id", "catpattern" + i)
				.attr("height", 1)
				.attr("width", 1)

			catpattern.append("circle")
				.attr("cx", d.w / 2)
				.attr("cy", d.w / 2)
				.attr("r", d.w / 2)
				.attr("fill", "#fff")

			catpattern.append("image")
				.attr("width", d.w * 1)
				.attr("height", d.h * 1)
				.attr("xlink:href", function() {
					if(!isEmpty(d.imgUrl)) {
						return d.imgUrl;
					}
					if(d.node_type == 'car') {
						return imgUrlArr.car;
					} else if(d.node_type == 'family') {
						return imgUrlArr.family;
					} else if(d.node_type == 'tenant') {
						return imgUrlArr.tenant;
					} else if(d.node_type == 'vistor') {
						return imgUrlArr.vistor;
					} else {
						return imgUrlArr.family;
					}
				})
			return "url(#catpattern" + i + ")";

		})
		.attr("display", function(d, i) {
			if(d.display == 'Y') {
				return 'block';
			} else {
				return 'none';
			}
		})
		.on("mouseover", function(d, i) {
			//显示连接线上的文字
			edges_text.style("fill-opacity", function(edge) {
				if((edge.source === d || edge.target === d) && edge.source.display == 'Y' && edge.target.display == 'Y') {
					return 1.0;
				}
			});
		})
		.on("mouseenter", function(d, i) {
			nodes_people_tip.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});
			nodes_people_tip_text1.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});
			nodes_people_tip_text2.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});
			nodes_people_tip_text3.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});
			nodes_people_tip_text4.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});
			nodes_people_tip_text5.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});
			nodes_people_tip_text6.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});
		})
		.on("mouseout", function(d, i) {
			//隐去连接线上的文字
			edges_text.style("fill-opacity", function(edge) {
				if(edge.source === d || edge.target === d) {
					return 0.0;
				}
			});
			nodes_people_tip.style("opacity", function(edge) {
				return 0.0;
			});
			nodes_people_tip_text1.style("opacity", function(edge) {
				return 0.0;
			});
			nodes_people_tip_text2.style("opacity", function(edge) {
				return 0.0;
			});
			nodes_people_tip_text3.style("opacity", function(edge) {
				return 0.0;
			});
			nodes_people_tip_text4.style("opacity", function(edge) {
				return 0.0;
			});
			nodes_people_tip_text5.style("opacity", function(edge) {
				return 0.0;
			});
			nodes_people_tip_text6.style("opacity", function(edge) {
				return 0.0;
			});
		})
		.call(force.drag);

	var nodes_prop_circle = svg.selectAll('nodes_prop_circle')
		.data(root.nodes)
		.enter()
		.append("circle")
		.filter(function(d, i) {
			return d.shapeType.split("_")[0] == 'prop' && d.shapeType.split("_")[1] == 'circle';
		})
		.attr("r", function(d, i) {
			return d.w / 2;
		})
		.style("stroke", function(d, i) {
			var str = d.color.colorRgb();
			var rate = 1.5;
			var r = parseInt(parseInt(str.split(',')[0]) * rate > 255 ? 255 : parseInt(str.split(',')[0]) * rate);
			var g = parseInt(parseInt(str.split(',')[1]) * rate > 255 ? 255 : parseInt(str.split(',')[1]) * rate);
			var b = parseInt(parseInt(str.split(',')[2]) * rate > 255 ? 255 : parseInt(str.split(',')[2]) * rate);
			var strss = "RGB(" + r + "," + g + ", " + b + ")";
			return(strss).colorHex();
		})
		.style("stroke-width", function(d, i) {
			if(d.active == "Y") {
				return '2px'
			}
			return "0px";
		})
		.attr('class', function(d, i) {
			if(d.active == "Y") {
				return 'nodeActive'
			}
			return "";
		})
		.style('cursor', function(d, i) {
			if(d.hasMore == 'Y') {
				return 'pointer';
			}
			return 'default';
		})
		.attr("fill", function(d, i) {
			//创建圆形图片
			var defs = svg.append("defs").attr("id", "propImg" + i)
			var catpattern = defs.append("pattern")
				.attr("id", "catpatternProp" + i)
				.attr("height", 1)
				.attr("width", 1)

			catpattern.append("circle")
				.attr("cx", d.w / 2)
				.attr("cy", d.w / 2)
				.attr("r", d.w / 2)
				.attr("fill", function() {
					return d.color;
				})

			catpattern.append("image")
				.attr("x", d.w * 0.5 / 2)
				.attr("y", d.h * 0.5 / 2)
				.attr("width", d.w * 0.5)
				.attr("height", d.h * 0.5)
				.attr("xlink:href", d.imgUrl)
			return "url(#catpatternProp" + i + ")";

		})
		.attr("display", function(d, i) {
			if(d.display == 'Y') {
				return 'block';
			} else {
				return 'none';
			}
		})
		.on("mouseover", function(d, i) {
			//显示连接线上的文字
			edges_text.style("fill-opacity", function(edge) {
				if((edge.source === d || edge.target === d) && edge.source.display == 'Y' && edge.target.display == 'Y') {
					return 1.0;
				}
			});
		})
		.on("mouseenter", function(d, i) {
			nodes_tip.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});

			nodes_tip_text.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});
		})
		.on("mouseout", function(d, i) {
			//隐去连接线上的文字
			edges_text.style("fill-opacity", function(edge) {
				if(edge.source === d || edge.target === d) {
					return 0.0;
				}
			});
			nodes_tip.style("opacity", function(edge) {
				return 0.0;
			});
			nodes_tip_text.style("opacity", function(edge) {
				return 0.0;
			});
		})
		.call(force.drag);

	var nodes_prop_rect = svg.selectAll('nodes_prop_rect')
		.data(root.nodes)
		.enter()
		.append("rect")
		.filter(function(d, i) {
			return d.shapeType.split("_")[0] == 'prop' && d.shapeType.split("_")[1] == 'rect';
		})
		.attr("x", function(d, i) {
			return d.x;
		})
		.attr("y", function(d, i) {
			return d.y;
		})
		.attr("rx", function(d, i) {
			return 10;
		})
		.attr("ry", function(d, i) {
			return 10;
		})
		.attr("width", function(d, i) {
			return d.w;
		})
		.attr("height", function(d, i) {
			return d.h;
		})
		.style("stroke", function(d, i) {
			var str = d.color.colorRgb();
			var rate = 1.5;
			var r = parseInt(parseInt(str.split(',')[0]) * rate > 255 ? 255 : parseInt(str.split(',')[0]) * rate);
			var g = parseInt(parseInt(str.split(',')[1]) * rate > 255 ? 255 : parseInt(str.split(',')[1]) * rate);
			var b = parseInt(parseInt(str.split(',')[2]) * rate > 255 ? 255 : parseInt(str.split(',')[2]) * rate);
			var strss = "RGB(" + r + "," + g + ", " + b + ")";
			return(strss).colorHex();
		})
		.style("stroke-width", function(d, i) {
			if(d.active == "Y") {
				return '2px'
			}
			return "0px";
		})
		.attr('class', function(d, i) {
			if(d.active == "Y") {
				return 'nodeActive'
			}
			return "";
		})
		.style('cursor', function(d, i) {
			if(d.hasMore == 'Y') {
				return 'pointer';
			}
			return 'default';
		})
		.attr("fill", function(d, i) {
			//创建圆形图片
			var defs = svg.append("defs").attr("id", "propImgRect" + i)
			var catpattern = defs.append("pattern")
				.attr("id", "catpatternPropRect" + i)
				.attr("height", 1)
				.attr("width", 1)

			catpattern.append("rect")
				.attr("rx", 10)
				.attr("ry", 10)
				.attr("width", function() {
					return d.w;
				})
				.attr("height", function() {
					return d.h;
				})
				.attr("fill", function() {
					return d.color;
				})

			catpattern.append("image")
				.attr("x", (d.w - d.w * 0.6) / 2)
				.attr("y", (d.h - d.h * 0.6) / 2)
				.attr("width", d.w * 0.6)
				.attr("height", d.h * 0.6)
				.attr("xlink:href", d.imgUrl)
			return "url(#catpatternPropRect" + i + ")";

		})
		.attr("display", function(d, i) {
			if(d.display == 'Y') {
				return 'block';
			} else {
				return 'none';
			}
		})
		.on("mouseover", function(d, i) {
			//显示连接线上的文字
			edges_text.style("fill-opacity", function(edge) {
				if((edge.source === d || edge.target === d) && edge.source.display == 'Y' && edge.target.display == 'Y') {
					return 1.0;
				}
			});
		})
		.on("mouseenter", function(d, i) {
			nodes_tip.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});
			nodes_tip_text.style("opacity", function(edge) {
				if(edge.node_id == d.node_id && d.display == 'Y') {
					return 1.0;
				} else {
					return 0.0;
				}
			});
		})
		.on("mouseout", function(d, i) {
			//隐去连接线上的文字
			edges_text.style("fill-opacity", function(edge) {
				if(edge.source === d || edge.target === d) {
					return 0.0;
				}
			});
			nodes_tip.style("opacity", function(edge) {
				return 0.0;
			});
			nodes_tip_text.style("opacity", function(edge) {
				return 0.0;
			});
		})
		.call(force.drag);

	var nodes_circle = svg.selectAll('nodes_circle')
		.data(root.nodes)
		.enter()
		.append("circle")
		.filter(function(d, i) {
			return d.shapeType == 'circle'
		})
		.style("fill", function(d, i) {
			return d.color;
		})
		.style("stroke", function(d, i) {
			var str = d.color.colorRgb();
			var rate = 1.5;
			var r = parseInt(parseInt(str.split(',')[0]) * rate > 255 ? 255 : parseInt(str.split(',')[0]) * rate);
			var g = parseInt(parseInt(str.split(',')[1]) * rate > 255 ? 255 : parseInt(str.split(',')[1]) * rate);
			var b = parseInt(parseInt(str.split(',')[2]) * rate > 255 ? 255 : parseInt(str.split(',')[2]) * rate);
			var strss = "RGB(" + r + "," + g + ", " + b + ")";
			return(strss).colorHex();
		})
		.style("stroke-width", function(d, i) {
			if(d.active == "Y") {
				return '2px'
			}
			return "0px";
		})
		.attr('class', function(d, i) {
			if(d.active == "Y") {
				return 'nodeActive'
			}
			return "";
		})
		.style('cursor', function(d, i) {
			if(d.hasMore == 'Y') {
				return 'pointer';
			}
			return 'default';
		})
		.attr("x", function(d, i) {
			return d.x;
		})
		.attr("y", function(d, i) {
			return d.y;
		})
		.attr("display", function(d, i) {
			if(d.display == 'Y') {
				return 'block';
			} else {
				return 'none';
			}
		})
		.on("click", function(d, i) {})
		.on("mouseover", function(d, i) {
			//显示连接线上的文字
			edges_text.style("fill-opacity", function(edge) {
				if((edge.source === d || edge.target === d) && edge.source.display == 'Y' && edge.target.display == 'Y') {
					return 1.0;
				}
			});
		})
		.on("mouseout", function(d, i) {
			//隐去连接线上的文字
			edges_text.style("fill-opacity", function(edge) {
				if(edge.source === d || edge.target === d) {
					return 0.0;
				}
			});
		})
		.call(force.drag);

	var nodes_rect = svg.selectAll('nodes_rect')
		.data(root.nodes)
		.enter()
		.append("rect")
		.filter(function(d, i) {
			return d.shapeType == 'rect';
		})
		.style("fill", function(d) {
			return d.color;
		})
		.style("stroke", function(d, i) {
			var str = d.color.colorRgb();
			var rate = 1.5;
			var r = parseInt(parseInt(str.split(',')[0]) * rate > 255 ? 255 : parseInt(str.split(',')[0]) * rate);
			var g = parseInt(parseInt(str.split(',')[1]) * rate > 255 ? 255 : parseInt(str.split(',')[1]) * rate);
			var b = parseInt(parseInt(str.split(',')[2]) * rate > 255 ? 255 : parseInt(str.split(',')[2]) * rate);
			var strss = "RGB(" + r + "," + g + ", " + b + ")";
			return(strss).colorHex();
		})
		.style("stroke-width", function(d, i) {
			if(d.active == "Y") {
				return '2px'
			}
			return "0px";
		})
		.attr('class', function(d, i) {
			if(d.active == "Y") {
				return 'nodeActive'
			}
			return "";
		})
		.style('cursor', function(d, i) {
			if(d.hasMore == 'Y') {
				return 'pointer';
			}
			return 'default';
		})
		.attr("x", function(d, i) {
			return d.x;
		})
		.attr("y", function(d, i) {
			return d.y;
		})
		.attr("rx", function(d, i) {
			return 10;
		})
		.attr("ry", function(d, i) {
			return 10;
		})
		.attr("width", function(d, i) {
			return d.w;
		})
		.attr("height", function(d, i) {
			return d.h;
		})
		.attr("display", function(d, i) {
			if(d.display == 'Y') {
				return 'block';
			} else {
				return 'none';
			}
		})
		.on("click", function(d, i) {})
		.on("mouseover", function(d, i) {
			//显示连接线上的文字
			edges_text.style("fill-opacity", function(edge) {
				if((edge.source === d || edge.target === d) && edge.source.display == 'Y' && edge.target.display == 'Y') {
					return 1.0;
				}
			});
		})
		.on("mouseout", function(d, i) {
			//隐去连接线上的文字
			edges_text.style("fill-opacity", function(edge) {
				if(edge.source === d || edge.target === d) {
					return 0.0;
				}
			});
		})
		.call(force.drag);

	var nodes_hasMore = svg.selectAll("nodes_hasMore")
		.data(root.nodes)
		.enter()
		.append("image")
		.filter(function(d, i) {
			return d.hasMore == 'Y'
		})
		.attr("display", function(d, i) {
			if(d.display == 'Y') {
				return 'block';
			} else {
				return 'none';
			}
		})
		.on("click", function(d, i) {})
		.attr("width", 26)
		.attr("height", 26)
		.call(force.drag);

	var nodes_name = svg.selectAll("nodes_name")
		.data(root.nodes)
		.enter()
		.append("image")
		.filter(function(d, i) {
			return d.textPosition == 'top'
		})
		.attr("display", function(d, i) {
			if(d.display == 'Y') {
				return 'block';
			} else {
				return 'none';
			}
		})
		.attr("xlink:href", function(d) {
			return imgUrlArr.nameBg;
		})
		.style('pointer-events', 'none')
		.attr("width", 100)
		.attr("height", 35)
		.call(force.drag);

	var node_text = svg.selectAll("nodetext")
		.data(root.nodes)
		.enter()
		.append("text")
		.attr("text-anchor", "middle")
		.attr("dy", function(d, i) {
			if(d.textPosition == 'twoLine') {
				return "-0.2em"
			}
			if(d.textPosition == 'top') {
				return "-4.5em"
			}
			return "0.35em"
		})
		.attr('class', "nodetext")
		.attr("display", function(d, i) {
			if(d.display == 'Y') {
				return 'block';
			} else {
				return 'none';
			}
		})
		.style('font-size', function(d, i) {
			if(d.fontSize) {
				return d.fontSize + "px";
			}
			return "14px";
		})
		.style('pointer-events', 'none')
		.text(function(d) {
			if(d.node_id == firstBaseNodeId) {
				return "";
			}
			if(d.name == undefined) {
				return "";
			}
			if(d.name.length > 15) {
				return d.name.substring(0, 15) + "...";
			}
			return d.name;
		});

	var node_text2 = svg.selectAll("node_text2")
		.data(root.nodes)
		.enter()
		.append("text")
		.filter(function(d, i) {
			return d.textPosition == 'twoLine';
		})
		.attr("text-anchor", "middle")
		.attr("dy", "1.35em")
		.attr('class', "nodetext")
		.attr("display", function(d, i) {
			if(d.display == 'Y') {
				return 'block';
			} else {
				return 'none';
			}
		})
		.style('font-size', function(d, i) {
			if(d.fontSize) {
				return d.fontSize + "px";
			}
			return "14px";
		})
		.style('cursor', 'pointer')
		.style('pointer-events', 'none')
		.text(function(d) {
			return d.time;
		});

	var nodes_tip = svg.selectAll("nodes_tip")
		.data(root.nodes)
		.enter()
		.append("image")
		.filter(function(d, i) {
			return d.shapeType.split("_")[0] == 'prop';
		})
		.attr("xlink:href", function(d) {
			return imgUrlArr.tipBtn;
		})
		.style("opacity", function(d, i) {
			return 0.0;
		})
		.style('pointer-events', 'none')
		.attr("width", 100)
		.attr("height", 45)
		.call(force.drag);

	var nodes_tip_text = svg.selectAll("nodes_tip_text")
		.data(root.nodes)
		.enter()
		.append("text")
		.filter(function(d, i) {
			return d.shapeType.split("_")[0] == 'prop';
		})
		.attr("text-anchor", "middle")
		.style("opacity", function(d, i) {
			return 0.0;
		})
		.attr("dy", "0.1em")
		.attr('class', "nodetext")
		.text(function(d) {
			return d.nameDes;
		})
		.style('pointer-events', 'none')
		.call(force.drag);

	var nodes_people_tip = svg.selectAll("nodes_people_tip")
		.data(root.nodes)
		.enter()
		.append("image")
		.filter(function(d, i) {
			return(d.node_type == "family" || d.node_type == "owner" || d.node_type == "tenant" || d.node_type == "estate" || d.node_type == "people") && d.shapeType.split("_")[0] != 'prop';
		})
		.attr("xlink:href", function(d) {
			return imgUrlArr["tip_" + d.txtArr.length];
		})
		.style("opacity", function(d, i) {
			return 0.0;
		})
		.style('pointer-events', 'none')
		.call(force.drag);

	var nodes_people_tip_text1 = svg.selectAll("nodes_people_tip_text1")
		.data(root.nodes)
		.enter()
		.append("text")
		.filter(function(d, i) {
			return(d.node_type == "family" || d.node_type == "owner" || d.node_type == "tenant" || d.node_type == "estate" || d.node_type == "people") && d.shapeType.split("_")[0] != 'prop';
		})
		.attr("text-anchor", "start")
		.style("opacity", function(d, i) {
			return 0.0;
		})
		.attr("dy", function(d) {
			return "3em";
		})
		.attr('class', "nodetext")
		.text(function(d) {
			return d.txtArr[0];
		})
		.style('pointer-events', 'none')
		.call(force.drag);

	var nodes_people_tip_text2 = svg.selectAll("nodes_people_tip_text2")
		.data(root.nodes)
		.enter()
		.append("text")
		.filter(function(d, i) {
			return(d.node_type == "family" || d.node_type == "owner" || d.node_type == "tenant" || d.node_type == "estate" || d.node_type == "people") && d.shapeType.split("_")[0] != 'prop';
		})
		.attr("text-anchor", "start")
		.style("opacity", function(d, i) {
			return 0.0;
		})
		.attr("dy", function(d) {
			return "4.65em";
		})
		.attr('class', "nodetext")
		.text(function(d) {
			return d.txtArr[1];
		})
		.style('pointer-events', 'none')
		.call(force.drag);

	var nodes_people_tip_text3 = svg.selectAll("nodes_people_tip_text3")
		.data(root.nodes)
		.enter()
		.append("text")
		.filter(function(d, i) {
			return(d.node_type == "family" || d.node_type == "owner" || d.node_type == "tenant" || d.node_type == "estate" || d.node_type == "people") && d.shapeType.split("_")[0] != 'prop';
		})
		.attr("text-anchor", "start")
		.style("opacity", function(d, i) {
			return 0.0;
		})
		.attr("dy", function(d) {
			return "6.3em";
		})
		.attr('class', "nodetext")
		.text(function(d) {
			return d.txtArr[2];
		})
		.style('pointer-events', 'none')
		.call(force.drag);

	var nodes_people_tip_text4 = svg.selectAll("nodes_people_tip_text4")
		.data(root.nodes)
		.enter()
		.append("text")
		.filter(function(d, i) {
			return(d.node_type == "family" || d.node_type == "owner" || d.node_type == "tenant" || d.node_type == "estate" || d.node_type == "people") && d.shapeType.split("_")[0] != 'prop';
		})
		.attr("text-anchor", "start")
		.style("opacity", function(d, i) {
			return 0.0;
		})
		.attr("dy", function(d) {
			return "7.95em";
		})
		.attr('class', "nodetext")
		.text(function(d) {
			return d.txtArr[3];
		})
		.style('pointer-events', 'none')
		.call(force.drag);

	var nodes_people_tip_text5 = svg.selectAll("nodes_people_tip_text5")
		.data(root.nodes)
		.enter()
		.append("text")
		.filter(function(d, i) {
			return(d.node_type == "family" || d.node_type == "owner" || d.node_type == "tenant" || d.node_type == "estate" || d.node_type == "people") && d.shapeType.split("_")[0] != 'prop';
		})
		.attr("text-anchor", "start")
		.style("opacity", function(d, i) {
			return 0.0;
		})
		.attr("dy", function(d) {
			return "9.6em";
		})
		.attr('class', "nodetext")
		.text(function(d) {
			return d.txtArr[4];
		})
		.style('pointer-events', 'none')
		.call(force.drag);

	var nodes_people_tip_text6 = svg.selectAll("nodes_people_tip_text6")
		.data(root.nodes)
		.enter()
		.append("text")
		.filter(function(d, i) {
			return(d.node_type == "family" || d.node_type == "owner" || d.node_type == "tenant" || d.node_type == "estate" || d.node_type == "people") && d.shapeType.split("_")[0] != 'prop';
		})
		.attr("text-anchor", "start")
		.style("opacity", function(d, i) {
			return 0.0;
		})
		.attr("dy", function(d) {
			return "11.25em";
		})
		.attr('class', "nodetext")
		.text(function(d) {
			return d.txtArr[5];
		})
		.style('pointer-events', 'none')
		.call(force.drag);

	//	resetZoom();
	force.on("tick", function() {
		var firstRecordNode = {};

		edges_line.attr("x2", function(d) {
			if(d.target.node_type == 'door_record' && !isArrIsDistinctInArr(mainNodeArr, d.target.parentNode) && firstRecordNodeCloseFlag && d.target.nodeIndex > 0) {
				if(d.target.nodeIndex == 1) {
					firstRecordNode.doorLineX = d.target.x;
				}
				return firstRecordNode.doorLineX + recordCloseX * d.target.nodeIndex;
			}
			if(d.target.node_type == 'car_record' && !isArrIsDistinctInArr(mainNodeArr, d.target.parentNode) && firstRecordNodeCloseFlag && d.target.nodeIndex > 0) {
				if(d.target.nodeIndex == 1) {
					firstRecordNode.carLineX = d.target.x;
				}
				return firstRecordNode.carLineX + recordCloseX * d.target.nodeIndex;
			}
			return d.target.x;
		});
		edges_line.attr("y2", function(d) {
			if(d.target.node_type == 'door_record' && !isArrIsDistinctInArr(mainNodeArr, d.target.parentNode) && firstRecordNodeCloseFlag && d.target.nodeIndex > 0) {
				if(d.target.nodeIndex == 1) {
					firstRecordNode.doorLineY = d.target.y;
				}
				return firstRecordNode.doorLineY + recordCloseX * d.target.nodeIndex;
			}
			if(d.target.node_type == 'car_record' && !isArrIsDistinctInArr(mainNodeArr, d.target.parentNode) && firstRecordNodeCloseFlag && d.target.nodeIndex > 0) {
				if(d.target.nodeIndex == 1) {
					firstRecordNode.carLineY = d.target.y;
				}
				return firstRecordNode.carLineY + recordCloseX * d.target.nodeIndex;
			}
			return d.target.y;
		});
		edges_line.attr("x1", function(d) {
			return d.source.x;
		});
		edges_line.attr("y1", function(d) {
			return d.source.y;
		});

		edges_text.attr("x", function(d) {
			return(d.source.x + d.target.x) / 2;
		});
		edges_text.attr("y", function(d) {
			return(d.source.y + d.target.y) / 2;
		});　　　　　　　　　　
		nodes_circle.attr("cx", function(d) {
			return d.x
		});
		nodes_circle.attr("cy", function(d) {
			return d.y
		});
		nodes_circle.attr("r", function(d) {
			return d.w;
		});

		nodes_rect.attr("x", function(d, i) {
			if(d.node_type == 'door_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.doorX = d.x - d.w / 2;
				}
				return firstRecordNode.doorX + recordCloseX * d.nodeIndex;
			}
			if(d.node_type == 'car_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.carX = d.x - d.w / 2;
				}
				return firstRecordNode.carX + recordCloseX * d.nodeIndex;
			}
			return d.x - d.w / 2;
		});

		nodes_rect.attr("y", function(d) {
			if(d.node_type == 'door_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.doorY = d.y - d.h / 2;
				}
				return firstRecordNode.doorY + recordCloseX * d.nodeIndex;
			}
			if(d.node_type == 'car_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.carY = d.y - d.h / 2;
				}
				return firstRecordNode.carY + recordCloseX * d.nodeIndex;
			}
			return d.y - d.h / 2;
		});

		nodes_rect.style("fill-opacity", function(d, i) {
			if((d.node_type == 'door_record' || d.node_type == 'car_record') && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.opacity = 1;
				}
				return 1 - 0.1 * d.nodeIndex;
			}

			return 1;
		});

		node_text2.attr("x", function(d) {
			if(d.node_type == 'door_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.doortextX2 = d.x;
				}
				return firstRecordNode.doortextX2 + recordCloseX * d.nodeIndex;
			}
			if(d.node_type == 'car_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.cartextX2 = d.x;
				}
				return firstRecordNode.cartextX2 + recordCloseX * d.nodeIndex;
			}
			return d.x;
		});

		node_text.style("fill-opacity", function(d, i) {
			if((d.node_type == 'door_record' || d.node_type == 'car_record') && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					return 1;
				}
				return 0;
			}
			return 1;
		});

		node_text2.style("fill-opacity", function(d, i) {
			if((d.node_type == 'door_record' || d.node_type == 'car_record') && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					return 1;
				}
				return 0;
			}
			return 1;
		});

		node_text2.attr("y", function(d) {
			if(d.node_type == 'door_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.doortextY2 = d.y;
				}
				return firstRecordNode.doortextY2 + recordCloseX * d.nodeIndex;
			}
			if(d.node_type == 'car_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.cartextY2 = d.y;
				}
				return firstRecordNode.cartextY2 + recordCloseX * d.nodeIndex;
			}
			return d.y;
		});　

		nodes_img.attr("cx", function(d) {
			return d.x
		});
		nodes_img.attr("cy", function(d) {
			return d.y
		});

		nodes_prop_circle.attr("cx", function(d) {
			return d.x
		});
		nodes_prop_circle.attr("cy", function(d) {
			return d.y
		});

		nodes_prop_rect.attr("x", function(d) {
			return d.x - d.w / 2;
		});
		nodes_prop_rect.attr("y", function(d) {
			return d.y - d.h / 2;
		});

		node_text.attr("x", function(d) {
			if(d.node_type == 'door_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.doortextX = d.x;
				}
				return firstRecordNode.doortextX + recordCloseX * d.nodeIndex;
			}
			if(d.node_type == 'car_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.cartextX = d.x;
				}
				return firstRecordNode.cartextX + recordCloseX * d.nodeIndex;
			}
			return d.x;
		});
		node_text.attr("y", function(d) {
			if(d.node_type == 'door_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.doortextY = d.y;
				}
				return firstRecordNode.doortextY + recordCloseX * d.nodeIndex;
			}
			if(d.node_type == 'car_record' && !isArrIsDistinctInArr(mainNodeArr, d.parentNode) && firstRecordNodeCloseFlag && d.nodeIndex > 0) {
				if(d.nodeIndex == 1) {
					firstRecordNode.cartextY = d.y;
				}
				return firstRecordNode.cartextY + recordCloseX * d.nodeIndex;
			}
			return d.y;
		});　

		nodes_name.attr("x", function(d) {
			return d.x - 50;
		});
		nodes_name.attr("y", function(d) {
			return d.y - d.h / 2 - 26;
		});　

		nodes_tip.attr("x", function(d) {
			return d.x - 50;
		});
		nodes_tip.attr("y", function(d) {
			return d.y + d.h / 2 - 26;
		});

		nodes_tip_text.attr("x", function(d) {
			return d.x;
		});
		nodes_tip_text.attr("y", function(d) {
			return d.y + d.h / 2;
		});

		nodes_people_tip.attr("x", function(d) {
			return d.x;
		});
		nodes_people_tip.attr("y", function(d) {
			return d.y;
		});

		nodes_people_tip_text1.attr("x", function(d) {
			return d.x + 20;
		});
		nodes_people_tip_text1.attr("y", function(d) {
			return d.y;
		});

		nodes_people_tip_text2.attr("x", function(d) {
			return d.x + 20;
		});
		nodes_people_tip_text2.attr("y", function(d) {
			return d.y;
		});

		nodes_people_tip_text3.attr("x", function(d) {
			return d.x + 20;
		});
		nodes_people_tip_text3.attr("y", function(d) {
			return d.y;
		});

		nodes_people_tip_text4.attr("x", function(d) {
			return d.x + 20;
		});
		nodes_people_tip_text4.attr("y", function(d) {
			return d.y;
		});

		nodes_people_tip_text5.attr("x", function(d) {
			return d.x + 20;
		});
		nodes_people_tip_text5.attr("y", function(d) {
			return d.y;
		});

		nodes_people_tip_text6.attr("x", function(d) {
			return d.x + 20;
		});
		nodes_people_tip_text6.attr("y", function(d) {
			return d.y;
		});

		nodes_hasMore.attr("x", function(d) {
			if(d.x < canvasWidth / 2) {
				if(d.shapeType == 'circle') {
					return d.x - 13 - d.w - 8;
				}
				return d.x - 13 - d.w / 2 - 8;
			}
			if(d.shapeType == 'circle') {
				return d.x - 13 + d.w + 8;
			}
			return d.x - 13 + d.w / 2 + 8;

		});
		nodes_hasMore.attr("xlink:href", function(d) {
			if(d.x < canvasWidth / 2) {
				return imgUrlArr.arrowLeft;
			}
			return imgUrlArr.arrowRight;
		})
		nodes_hasMore.attr("y", function(d) {
			return d.y - 13;
		});
	});

}

var isNodeExist = function(node_id) {
	var flag = false;
	for(var i = 0; i < baseData.nodes.length; i++) {
		if(baseData.nodes[i].node_id == node_id) {
			flag = true;
			break;
		}
	}
	return flag;
}

var getLinkNode = function(id, arr) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].source_node == id) {
			return arr[i].target_node;
		}
		if(arr[i].target_node == id) {
			return arr[i].source_node;
		}
	}
	return "";
}

var getNewParentNodeArr = function(parentNodeId) {
	var arr = [];
	arr.push(parentNodeId);
	arr = arr.concat(getParentNodeArrByNodeId(parentNodeId));
	return arr;
}
var getParentNodeArrByNodeId = function(node_id) {
	for(var i = 0; i < baseData.nodes.length; i++) {
		if(baseData.nodes[i].node_id == node_id) {
			return baseData.nodes[i].parentNode;
			break;
		}
	}
}

var isArrIsDistinctInArr = function(arr1, arr2) {
	for(var i = 0; i < arr1.length; i++) {
		for(var j = 0; j < arr2.length; j++) {
			if(arr1[i] == arr2[j]) {
				return true;
				break;
			}
		}
	}
	return false;
}

function getNodeById(node_id) {
	for(var i = 0; i < baseData.nodes.length; i++) {
		if(baseData.nodes[i].node_id == node_id) {
			return baseData.nodes[i];
		}
	}
}

function getEdegDesByNodeId(id, arr) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].source_node == id) {
			return arr[i].des;
		}
		if(arr[i].target_node == id) {
			return arr[i].des;
		}
	}
	return "";
}

function resetSvg() {
	for(var i = baseData.nodes.length - 1; i >= 0; i--) {
		baseData.nodes[i].isNew = "N";
	}
	if(force) {
		force.stop();
	}
	render(baseData);
}

function getEstateTxtArr(str1, str2, str3, str4) {
	var txtArr = [];
	var txt1 = str1;
	var txt2 = txt1;

	txt1 = txt1.substr(0, 15);
	txtArr.push(txt1);

	if(txt2.length <= 15) {
		txt2 = "";
	} else if(txt2.length <= 30) {
		txt2 = txt2.substring(15, 30);
		txtArr.push(txt2);
	} else if(txt2.length > 30) {
		txt2 = txt2.substring(15, 28) + "...";
		txtArr.push(txt2);
	}

	var txt3 = str2;
	var txt4 = txt3;
	txt3 = txt3.substr(0, 15);
	txtArr.push(txt3);

	if(txt4.length <= 15) {
		txt4 = "";
	} else if(txt4.length <= 30) {
		txt4 = txt4.substring(15, 30);
		txtArr.push(txt4);
	} else if(txt4.length > 30) {
		txt4 = txt4.substring(15, 28) + "...";
		txtArr.push(txt4);
	}
	if(!isEmpty(str3)) {
		txtArr.push(str3);
	}
	if(!isEmpty(str4)) {
		txtArr.push(str4);
	}
	return txtArr;
}

function getPeopleTxtArr(str1, str2, str3) {
	var txtArr = [];
	var txt1 = str1;
	if(txt1.length > 15) {
		txt1 = txt1.substring(0, 15);
	}
	var txt2 = str2;
	var txt3 = str3;
	txtArr.push(txt1);
	txtArr.push(txt2);
	txtArr.push(txt3);
	return txtArr;
}