function isEmpty(str){
	if(str == "" || str == "\\N" || str == "null" || str == "None" || str == null) {
		return true;
	}
	return false;
}


function objClone(myObj) {
	if(typeof(myObj) != 'object') return myObj;
	if(myObj == null) return myObj;
	var myNewObj = new Object();
	for(var i in myObj)
		myNewObj[i] = objClone(myObj[i]);
	return myNewObj;
}
Array.prototype.clone = function() { //为数组添加克隆自身方法，使用递归可用于多级数组
	var newArr = new Array();
	for(var i = 0; i <= this.length - 1; i++) {
		var itemi = this[i];
		if(itemi.length && itemi.push) itemi = itemi.clone(); //数组对象，进行递归
		else if(typeof(itemi) == "object") itemi = objClone(itemi); //非数组对象，用上面的objClone方法克隆
		newArr.push(itemi);
	}
	return newArr;
}

//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function() {
	var that = this;
	if(/^(rgb|RGB)/.test(that)) {
		var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
		var strHex = "#";
		for(var i = 0; i < aColor.length; i++) {
			var hex = Number(aColor).toString(16);
			if(hex === "0") {
				hex += hex;
			}
			strHex += hex;
		}
		if(strHex.length !== 7) {
			strHex = that;
		}
		return strHex;
	} else if(reg.test(that)) {
		var aNum = that.replace(/#/, "").split("");
		if(aNum.length === 6) {
			return that;
		} else if(aNum.length === 3) {
			var numHex = "#";
			for(var i = 0; i < aNum.length; i += 1) {
				numHex += (aNum + aNum);
			}
			return numHex;
		}
	} else {
		return that;
	}
};
/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function() {
	var sColor = this.toLowerCase();
	if(sColor && reg.test(sColor)) {
		if(sColor.length === 4) {
			var sColorNew = "#";
			for(var i = 1; i < 4; i += 1) {
				sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
			}
			sColor = sColorNew;
		}
		//处理六位的颜色值
		var sColorChange = [];
		for(var i = 1; i < 7; i += 2) {
			sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
		}
		return sColorChange.join(",");
	} else {
		return sColor;
	}
};

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return decodeURI(decodeURI(r[2]));
	} else {
		return '';
	}
}