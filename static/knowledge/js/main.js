var vm = new Vue({
	el: '#baseData',
	data: {
		dataArr: {
		},
		uid: getUrlParam("uid"),
		houseUserId: getUrlParam("houseUserId"),
		unitId: getUrlParam("unitId"),
		apiAddr: getUrlParam("apiAddr"),
		cityCode: getUrlParam("cityCode"),
	},
	methods: {
	},
	mounted: function() {
		if(this.uid){
			queryPeople(this.apiAddr,this.uid,this.houseUserId,this.cityCode); 
		}
		if(this.unitId){
			queryUnit(this.apiAddr,this.unitId); 
		}
	}
});

function queryPeople(apiAddr,uid,houseUserId,cityCode) {
	if(uid == ""){
		showError('该用户没有数据');
		return;
	}
	$.ajax({
		url: apiAddr+'/personInformation/findRelationShip.do?user_id='+uid+"&id="+houseUserId+"&city_code="+cityCode,
		type: 'get',
		xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
		success: function(jsonData) {
			if(jsonData && jsonData.success && jsonData.data != null) {
				vm.dataArr = jsonData.data;
				requestData(jsonData.data, true);
			}else{
				showError('该用户没有数据');
			}
		},
		error: function(xhr, node_type, errorThrown) {
			showError("请求错误");
		}
	});
}
function queryUnit(apiAddr,unitId) {
	if(unitId == ""){
		showError('该小区没有数据');
		return;
	}
	$.ajax({
		url: apiAddr+'/unitInformation/findRelationShip.do?unit_id='+unitId,
		type: 'get',
		xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
		success: function(jsonData) {
			if(jsonData && jsonData.success && jsonData.data != null) {
				vm.dataArr = jsonData.data;
				requestData(jsonData.data, true);
			}else{
				showError('该小区没有数据');
			}
		},
		error: function(xhr, node_type, errorThrown) {
			showError("请求错误");
		}
	});
}

function queryEstate(uid) {
	if(uid == ""){
		showError('该小区没有数据');
		return;
	}
	$.ajax({
		url: apiAddr+'/personInformation/findRelationShip.do?user_id='+uid+"&city_code="+cityCode,
		type: 'get',
		success: function(jsonData) {
			if(jsonData && jsonData.success && jsonData.data != null) {
				vm.dataArr = jsonData.data;
				requestData(jsonData.data, true, "estate");
			}else{
				showError('该小区没有数据');
			}
		},
		error: function(xhr, type, errorThrown) {
			showError('请求错误');
		}
	});
}

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

