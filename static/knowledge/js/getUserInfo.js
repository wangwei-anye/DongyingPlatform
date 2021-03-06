var userInfoFun = {
	//身份证验证
	obj: function(str) {
		return typeof(str) == 'object' ? true : false;
	},
	id_card: function(sId) {

		var card_area = {

			11: "北京",
			12: "天津",
			13: "河北",

			14: "山西",
			15: "内蒙古",
			21: "辽宁",

			22: "吉林",
			23: "黑龙江",
			31: "上海",

			32: "江苏",
			33: "浙江",
			34: "安徽",

			35: "福建",
			36: "江西",
			37: "山东",

			41: "河南",
			42: "湖北",
			43: "湖南",

			44: "广东",
			45: "广西",
			46: "海南",

			50: "重庆",
			51: "四川",
			52: "贵州",

			53: "云南",
			54: "西藏",
			61: "陕西",

			62: "甘肃",
			63: "青海",
			64: "宁夏",

			65: "新疆",
			71: "台湾",
			81: "香港",

			82: "澳门",
			91: "国外"

		};

		var iSum = 0

		var info = ""

		var card_info = Array(2);

		sId = sId.replace(/x$/i, "a");

		if(sId.length == 0) {
			return false;
		}

		if(card_area[parseInt(sId.substr(0, 2))] == null) {
			return false;
		}
		var nowDate = new Date();
		var age = nowDate.getFullYear() - parseInt(sId.substr(6, 4));

		for(var i = 17; i >= 0; i--) {
			iSum += (Math.pow(2, i) % 11) *
				parseInt(sId.charAt(17 - i), 11)
		}

		if(iSum % 11 != 1) {
			return false;
		}

		if(sId.length > 19) {
			return false;
		}
		card_info[0] = card_area[parseInt(sId.substr(0, 2))];
		card_info[1] = age;
		card_info[2] = sId.substr(16, 1) % 2 ? "男" : "女";
		return card_info;

	}
}
