var vm = new Vue({
	el: '#baseData',
	data: {
		dataArr: {
			baseData: {
				images: ""
			}
		},
		cid: getUrlParam("unit_id"), 
		pageSize: 10,
		ownerPageInddex: 1,
		tenantPageInddex: 1,
		carPageInddex: 1,
		vistorPageInddex: 1,
		unknow: "未知",
		builderArr: [],
		hourseArr: [],
		moreRecordType: "estate",
		moreRecordId: getUrlParam("unit_id"),
		moreRecordUnitName: getUrlParam("unit"),
		selectLinkIndex:'all',
		selectNodeIndex:'all',
		selectLinkDesArr:[],
		selectNodeArr:[]
	},
	methods: {
		show: function(e) {
			if($(e.target).find('i').hasClass('active')) {
				$($(e.target).data('to')).hide();
				$(e.target).find('i').removeClass('active')
			} else {
				$($(e.target).data('to')).show();
				$(e.target).find('i').addClass('active');
			}
		},
		queryPage: function(e) {
			if($(e.target).data('type') == "owner") {
				queryPage(this.cid, (this.ownerPageInddex + 1), "owner");
			}
			if($(e.target).data('type') == "tenant") {
				queryPage(this.cid, (this.tenantPageInddex + 1), "tenant");
			}
			if($(e.target).data('type') == "car") {
				queryPage(this.cid, (this.carPageInddex + 1), "car");
			}
			if($(e.target).data('type') == "vistor") {
				queryPage(this.cid, (this.vistorPageInddex + 1), "vistor");
			}
		},
		toCarRecord: function(num) {
			if(num == 0) {
				showError('没有更多数据');
				return;
			}
			$(".shadow").show();
			$(".car_record").show();
		},
		toDoorRecord: function(num) {
			if(num == 0) {
				showError('没有更多数据');
				return;
			}
			$(".shadow").show();
			$(".door_record").show();
		},
		changeBuilder: function(event) {
			for(var i = 0; i < this.builderArr.length; i++) {
				if(this.builderArr[i].b_id == $(event.target).val()) {
					vm.builderArr[i].rooms.sort(function(a, b) {
						return a.room - b.room;
					});
					vm.hourseArr = vm.builderArr[i].rooms;
					break;
				}
			}
			$("#selectHourse").get(0).selectedIndex = 0;
			if($("#selectBuilder").val() == "all" && $("#selectHourse").val() == "all") {
				queryPeople(this.cid);
			}
		},
		changeHourser: function(event) {
			if($(event.target).val() != "all") {
				queryRoom($(event.target).val());
			}
			if($("#selectBuilder").val() == "all" && $("#selectHourse").val() == "all") {
				queryPeople(this.cid);
			}
		},
		enterTip :function (event){
			$(event.target).next().css("visibility",'visible');
		},
		outTip :function (event){
			$(event.target).next().css("visibility",'hidden');
		}
	},
	mounted: function() {
		queryPeople(this.cid);
		queryEstateBuilder(this.cid);
	}
});

function queryPage(c_id, pageNo, type) {
	$.ajax({
		url: getServerUrl()+"/pagesearch.do?c_id=" + c_id + "&pageNo=" + pageNo + "&type=" + type + "&pageSize=" + vm.pageSize,
		type: 'get',
		success: function(jsonData) {
			if(jsonData.success) {
				if(type == "owner") {
					vm.ownerPageInddex++;
					vm.dataArr.baseData.owner = vm.dataArr.baseData.owner.concat(jsonData.data.data_list);
				}
				if(type == "tenant") {
					vm.tenantPageInddex++;
					vm.dataArr.baseData.tenant = vm.dataArr.baseData.tenant.concat(jsonData.data.data_list);
				}
				if(type == "car") {
					vm.carPageInddex++;
					vm.dataArr.baseData.car = vm.dataArr.baseData.car.concat(jsonData.data.data_list);
				}
				if(type == "vistor") {
					vm.vistorPageInddex++;
					vm.dataArr.baseData.vistor = vm.dataArr.baseData.vistor.concat(jsonData.data.data_list);
				}
				vm.$nextTick(resize);
			} else {
				showError('没有更多数据');
			}
		},
		error: function(xhr, type, errorThrown) {
			showError('请求错误');
		}
	});
}

function queryEstateBuilder(c_id) {
	$.ajax({
		url: getServerUrl()+"/roomsearch.do?c_id=" + c_id,
		type: 'get',
		success: function(jsonData) {
			if(jsonData.success) {
				jsonData.data.buildings.sort(function(a, b) {
					return a.building_code - b.building_code;
				});
				vm.builderArr = jsonData.data.buildings;
			} 
		},
		error: function(xhr, type, errorThrown) {
			showError('请求错误');
		}
	});
}

function queryPeople(uid) {
	$.ajax({
		url: getServerUrl()+"/community.do?c_id=" + uid,
		type: 'get',
		success: function(jsonData) {
			if(jsonData.success) {
				clearData();
				jsonData.data.baseData.selectUid = uid;
				jsonData.data.baseData.hourse_person = jsonData.data.baseData.total_person;
				vm.dataArr = jsonData.data;
				setBaseData();
				requestData(jsonData.data, true, 'estate');
			} else {
				showError('该小区没有数据');
			}
		},
		error: function(xhr, type, errorThrown) {
			showError('请求错误');
		}
	});
}

function clearData() {
	mainNodeArr = [];
	baseData = {
		nodes: [],
		edges: []
	};
}

function queryRoom(rid) {
	$.ajax({
		url: getServerUrl()+"/roomsearch.do?r_id=" + rid,
		type: 'get',
		success: function(jsonData) {
			if(jsonData.success) {
				clearData();
				jsonData.data.baseData.name = vm.dataArr.baseData.name ;
				jsonData.data.baseData.province_name = vm.dataArr.baseData.province_name ;
				jsonData.data.baseData.city_name = vm.dataArr.baseData.city_name ;
				jsonData.data.baseData.town_name = vm.dataArr.baseData.town_name ;
				jsonData.data.baseData.lng = vm.dataArr.baseData.lng ;
				jsonData.data.baseData.lat = vm.dataArr.baseData.lat ;
				jsonData.data.baseData.total_hourse = vm.dataArr.baseData.total_hourse;
				jsonData.data.baseData.total_person = vm.dataArr.baseData.total_person;
				jsonData.data.baseData.hourse_person = jsonData.data.baseData.tenant_count + jsonData.data.baseData.owner_count;
				vm.dataArr = jsonData.data;
				setBaseData();
				requestData(jsonData.data, true, 'estate');
			} else {
				showError('该房屋没有数据');
			}
		},
		error: function(xhr, type, errorThrown) {
			showError('请求错误');
		}
	});
}

function queryMorePeople(uid, node_id) {
	$.ajax({
		url: getServerUrl()+"/people.do?uid=" + uid,
		type: 'get',
		success: function(jsonData) {
			if(jsonData.success) {
				jsonData.data.baseData.selectUid = uid;
				jsonData.data.baseNode.baseNode = node_id;
				requestData(jsonData.data, false, 'family');
			}
		},
		error: function(xhr, type, errorThrown) {}
	});
}

function queryMoreCarRecord(plateNumber, node_id) {
	$.ajax({
		url: getServerUrl()+"/carrecord.do?plate_number=" + plateNumber +"&c_id="+vm.cid,
		type: 'get',
		success: function(jsonData) {
			if(jsonData.success) {
				addCarRecordNode(jsonData.data.car_records, node_id);
			} else {
				showError("该车辆没有数据");
			}
		},
		error: function(xhr, node_type, errorThrown) {
			showError("请求错误");
		}
	});
}

function setBaseData() {
	if(vm.dataArr.baseData.images == null || vm.dataArr.baseData.images == "") {
		vm.dataArr.baseData.images = imgUrlArr.estateList;
	}else{
		vm.dataArr.baseData.images = fromatImgUrl(vm.dataArr.baseData.images);
	}
	
	vm.dataArr.baseData.car_record = [];
	vm.dataArr.baseData.door_record = [];
	for (var i = 0; i < vm.dataArr.nodes.length; i++) {
		if(vm.dataArr.nodes[i].node_type == 'door_record'){
			vm.dataArr.baseData.door_record.push(vm.dataArr.nodes[i]);
		}
	}
	for (var i = 0; i < vm.dataArr.nodes.length; i++) {
		if(vm.dataArr.nodes[i].node_type == 'car_record'){
			vm.dataArr.baseData.car_record.push(vm.dataArr.nodes[i]);
		}
	}
	
	for (var i = 0; i < vm.dataArr.baseData.tenant.length; i++) {
		for (var j = 0; j < vm.dataArr.baseData.owner.length; j++) {
			if(vm.dataArr.baseData.tenant[i].au_id == vm.dataArr.baseData.owner[j].au_id){
				vm.dataArr.baseData.tenant[i].name = vm.dataArr.baseData.owner[j].name;
			}
		}
	}
	
	propIdArr = [];
	for(e in configArr) {
		propIdArr.push(vm.dataArr.baseNode.baseNode + "_" + configArr[e].id);
	}
	vm.$nextTick(function() {
		$("#baseData").css("visibility",'visible');
	})

}

$(".car_record").on('click', '.cancelBtn', function() {
	$(".shadow").hide();
	$(".car_record").hide();
})
$(".car_record").on('click', '.sureBtn', function() {
	if(vm.moreRecordType == "estate") {
		var params = {
			unit_id: vm.moreRecordId,
			strings: vm.moreRecordUnitName,
			unit: vm.moreRecordUnitName,
		};
		var url = oeasyBSFunction.ConstructHref(params, oeasyBSConst.pages.co_car);
		window.location.href = url;
	} else {
		var params = {
			uid: vm.moreRecordId
		};
		var url = oeasyBSFunction.ConstructHref(params, oeasyBSConst.pages.cu_car);
		window.location.href = url;
	}
})

$(".door_record").on('click', '.cancelBtn', function() {
	$(".shadow").hide();
	$(".door_record").hide();
})
$(".door_record").on('click', '.sureBtn', function() {
	if(vm.moreRecordType == "estate") {
		var params = {
			unit_id: vm.moreRecordId,
			strings: vm.moreRecordUnitName,
			unit: vm.moreRecordUnitName,
		};
		var url = oeasyBSFunction.ConstructHref(params, oeasyBSConst.pages.co_door);
		window.location.href = url;
	} else {
		var params = {
			uid: vm.moreRecordId
		};
		var url = oeasyBSFunction.ConstructHref(params, oeasyBSConst.pages.cu_door);
		window.location.href = url;
	}
})

function fromatImgUrl(imgUrl) {
	//	https://security.0easy.com/img/b641e11f04a2a0df46ab593912d3a2ba?p=0
	//	http://218.18.160.183:6300/0bdb9855bb58bfaead1e635ec2803b48?p=0
	if(imgUrl.indexOf("http://218.18.160.183:6300") != -1) {
		imgUrl = imgUrl.replace("http://218.18.160.183:6300", "http://zimg.0easy.com:6300");
	}
	if(imgUrl.length == 32) {
		imgUrl = "http://zimg.0easy.com:6300/" + imgUrl + "?p=0";
	}
	return imgUrl;
}
