/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
function find(list, f) {
	return list.filter(f)[0]
}

/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */
export function deepCopy(obj, cache = []) {
	// just return if obj is immutable value
	if(obj === null || typeof obj !== 'object') {
		return obj
	}

	// if obj is hit, it is in circular structure
	const hit = find(cache, c => c.original === obj)
	if(hit) {
		return hit.copy
	}

	const copy = Array.isArray(obj) ? [] : {}
	// put the copy into cache at first
	// because we want to refer it in recursive deepCopy
	cache.push({
		original: obj,
		copy
	})

	Object.keys(obj).forEach(key => {
		copy[key] = deepCopy(obj[key], cache)
	})

	return copy
}

/**
 * forEach for object
 */
export function forEachValue(obj, fn) {
	Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isObject(obj) {
	return obj !== null && typeof obj === 'object'
}

export function isPromise(val) {
	return val && typeof val.then === 'function'
}

export function assert(condition, msg) {
	if(!condition) throw new Error(`[vuex] ${msg}`)
}

export function formatTime(val) {
	val = val.toString();
	if(val.length == 1) {
		return "0" + val;
	}
	return val;
}

/**
 * 时间戳格式转化为 00:00:00
 * @param millisec 时间戳, 单位(毫秒)
 * @return {*} 格式化后的时间, 附带年月日时分秒
 */
 
export function millisec_to_time(millisec) {
  function add0(m) {return m < 10 ? '0' + m : m;}
  
  var time = millisec ? new Date(millisec) : new Date();
  var Y = time.getFullYear();
  var M = time.getMonth() + 1;
  var D = time.getDate();
  var h = time.getHours();
  var m = time.getMinutes();
  var s = time.getSeconds();

  return {
    formatTime: Y + '-' + add0(M) + '-' + add0(D) + ' ' + add0(h) + ':' + add0(m) + ':' + add0(s),
    Y: Y,
    M: M,
    D: D,
    h: h,
    m: m,
    s: s
  } 
}

export function millisec_to_Date(millisec) {
    function add0(m) {return m < 10 ? '0' + m : m;}

    var time = millisec ? new Date(millisec) : new Date();
    var Y = time.getFullYear();
    var M = time.getMonth() + 1;
    var D = time.getDate();
    var h = time.getHours();
    var m = time.getMinutes();
    var s = time.getSeconds();

    return {
        formatTime: Y + '-' + add0(M) + '-' + add0(D),
        Y: Y,
        M: M,
        D: D,
        h: h,
        m: m,
        s: s
    }
}

// 用来获取 sessionStorage 中存储的字符串化的对象
// 原始类型的数据可以直接使用 sessionStorage API
export function getObjectFromSessionStorage(key) {
  let item = sessionStorage.getItem(key);

  try {
    return item ? JSON.parse(item) : false;
  } catch(e) {
    console.log(e);
  }
}

export function setObjectToSessionStorage(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function checkIdCode(idCode) {
    function isDate(dateString) {
        dateString = String(dateString);
        if (dateString.trim() == "") {
            return false;
        }
        var r = dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) {
            return false;
        }
        var d = new Date(r[1], r[3] - 1, r[4]);
        var num = (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
        return num;
    }

    var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }

    var iSum = 0;
    if(!idCode) {
        return {
            check: false,
            msg: "您输入的身份证号码为空！"
        };
    }
    if (!/^\d{17}(\d|x)$/i.test(idCode)) return {
        check: false,
        msg: "您输入的身份证号码长度或格式错误！"
    };
    idCode = idCode.replace(/x$/i, "a");
    if (aCity[parseInt(idCode.substr(0, 2))] == null) return {
        check: false,
        msg: "您输入的身份证号码地区非法！"
    };
    var sYear = idCode.substr(6, 4);
    var sMonth = Number(idCode.substr(10, 2));
    sMonth = sMonth > 9 ? sMonth : ('0' + sMonth);
    var sDay = Number(idCode.substr(12, 2));
    sDay = sDay > 9 ? sDay : ('0' + sDay);
    var sBirthday = sYear + "-" + sMonth + "-" + sDay;

    if(!isDate(sBirthday)) {
        return {
            check: false,
            msg: "您输入的身份证号码上的出生日期非法！"
        };
    }

    /*var d = new Date(sBirthday.replace(/-/g, "/"));
    if (sBirthday !== (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) return {
        check: false,
        msg: "身份证号码上的出生日期非法"
    };*/

    for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(idCode.charAt(17 - i), 11);
    if (iSum % 11 != 1) return {
        check: false,
        msg: "您输入的身份证号码非法！"
    };
    console.log(aCity[parseInt(idCode.substr(0, 2))] + "," + sBirthday + "," + (idCode.substr(16, 1) % 2 ? "男" : "女")); //此次还可以判断出输入的身份证号的人性别
    return {
        check: true,
        info: {
            birthDate: sBirthday,
            gender: idCode.substr(16, 1) % 2 ? "男" : "女"
        }
    };
}
