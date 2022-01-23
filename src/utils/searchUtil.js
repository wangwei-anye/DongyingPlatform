import store from '@/store'
import {city_name as cityName} from '@/config'//城市名称 别名

// 构造搜索人员高亮结果
export function constructPersonHighLightStr(str, keyWord, isblack) {
    let result = "<label style='cursor: pointer;'>" + str + "</label>";;
    if (str && keyWord) {
        if (str.indexOf(keyWord) !== -1) {
            let notHighLightStrList = str.split(keyWord);
            if (notHighLightStrList && notHighLightStrList.length > 0) {
                let filterArr = notHighLightStrList.filter(function (item) {
                    return item === "";
                });
                result = "";
                if (filterArr.length === notHighLightStrList.length) {//全是包含关键词的字符串，不包含其他字符串
                    for (let j = 0; j < notHighLightStrList.length - 1; j++) {
                        result += "<label style='color: #f76037;cursor: pointer;'>" + keyWord + "</label>";
                    }
                } else {//不全是包含关键词的字符串，包含其他字符串
                    let startIndex = 0;
                    if (notHighLightStrList[0] === "") {
                        startIndex = 1;
                        result += "<label style='color: #f76037;cursor: pointer;'>" + keyWord + "</label>";
                    }
                    for (let j = startIndex; j < notHighLightStrList.length - 1; j++) {
                        if (notHighLightStrList[j] === "") {
                            result += "<label style='color: #f76037;cursor: pointer;'>" + keyWord + "</label>";
                        } else {
                            result += isblack ? "<label style='color: red;cursor: pointer;'>" + notHighLightStrList[j] + "</label>" : "<label style='cursor: pointer;'>" + notHighLightStrList[j] + "</label>";
                        }
                        result += "<label style='color: #f76037;cursor: pointer;'>" + keyWord + "</label>";
                    }
                    if (notHighLightStrList[notHighLightStrList.length - 1] !== "") {
                        result += isblack ? "<label style='color: red;cursor: pointer;'>" + notHighLightStrList[notHighLightStrList.length - 1] + "</label>" : "<label style='cursor: pointer;'>" + notHighLightStrList[notHighLightStrList.length - 1] + "</label>";
                    }
                }
            }
        } else {
            result = isblack ? "<label style='color: red;cursor: pointer;'>" + str + "</label>" : "<label style='cursor: pointer;'>" + str + "</label>";
        }
    }
    return result;
}

// 构造搜索车辆 或 地点 高亮结果
export function constructHighLightStr(str, keyWord, isPlateNum) {
    if(isPlateNum){//如果是车牌号
        keyWord = keyWord.toLocaleUpperCase();
    }
    let result = "<label style='cursor: pointer;'>" + str + "</label>";
    if(str && keyWord && str.indexOf(keyWord) !== -1){
        let notHighLightStrList = str.split(keyWord);
        if(notHighLightStrList && notHighLightStrList.length > 0){
            let filterArr = notHighLightStrList.filter(function (item) {
                return item === "";
            });
            result = "";
            if(filterArr.length === notHighLightStrList.length){//全是包含关键词的字符串，不包含其他字符串
                for(let j = 0; j < notHighLightStrList.length - 1; j++){
                    result += "<label style='color: #f76037;cursor: pointer;'>" + keyWord + "</label>";
                }
            }else{//不全是包含关键词的字符串，包含其他字符串
                let startIndex = 0;
                if(notHighLightStrList[0] === ""){
                    startIndex = 1;
                    result += "<label style='color: #f76037;cursor: pointer;'>" + keyWord + "</label>";
                }
                for(let j = startIndex; j < notHighLightStrList.length - 1; j++){
                    if(notHighLightStrList[j] === ""){
                        result += "<label style='color: #f76037;cursor: pointer;'>" + keyWord + "</label>";
                    }else{
                        result += "<label style='cursor: pointer;'>" + notHighLightStrList[j] + "</label>";
                    }
                    result += "<label style='color: #f76037;cursor: pointer;'>" + keyWord + "</label>";
                }
                if(notHighLightStrList[notHighLightStrList.length - 1] !== ""){
                    result += "<label style='cursor: pointer;'>" + notHighLightStrList[notHighLightStrList.length - 1] + "</label>";
                }
            }
        }
    }
    return result;
}

// 敏感信息处理
export function hideInfo(str, type, isHide) {
    let result = str;
    let arr = str;
    if(str && str.indexOf('*') === -1 && isHide){
        //身份证 只显示前4后2
        let hideArr = [];
        if(type === 1){
            for(let h = 4; h < str.split('').length - 1; h++){
                hideArr.push('*');
            }
            result = str.substring(0, 4);
            result += str.substring(str.split('').length - 3);
            arr = result.split('');
            arr.splice(4, 1, hideArr.join(''));
            arr = arr.join('');
        }
        //电话号码 只显示前3后4
        if(type === 2){
            for(let h = 3; h < str.split('').length - 3; h++){
                hideArr.push('*');
            }
            result = str.substring(0, 3);
            result += str.substring(str.split('').length - 5);
            arr = result.split('');
            arr.splice(3, 1, hideArr.join(''));
            arr = arr.join('');
        }
    }
    return arr;
}

// 处理人员搜索结果界面展示数据
export function getCommonSearchPersonList(searchPersonList, showSearch, keyWord) {
    //处理界面展示数据
    //constructPersonHighLightStr 和 constructHighLightStr 均为工具类内部调用
    let personList = [];
    if (showSearch && keyWord) {
        for (let i = 0; i < searchPersonList.length; i++) {
            let person = searchPersonList[i];
            person.face_image = person.face_image || "";//人员图片
            person.ogn_user_name = person.name;
            person.id_code = person.id_code ? constructPersonHighLightStr(person.id_code, keyWord, person.isblack) : "<label style='display: inline-block;'></label>"
            person.name = person.name ? constructPersonHighLightStr(person.name, keyWord, person.isblack) : "<label style='display: inline-block;'></label>"
            person.telephone = person.telephone ? constructPersonHighLightStr(person.telephone, keyWord, person.isblack) : "<label style='display: inline-block;'></label>"
            person.gender = person.isblack ? "<label style='color: red;cursor: pointer;'>未知</label>" : "<label style='cursor: pointer;'>未知</label>";
            if (person.sex) {
                person.gender = person.isblack ? "<label style='color: red;cursor: pointer;'>" + person.sex + "</label>" : "<label style='cursor: pointer;'>" + person.sex + "</label>";
            }
            let c = '';
            switch (person.special_person) {
                case 0:
                    c = '普通人员';
                    break;
                case 1:
                    c = '涉毒人员';
                    break;
                case 2:
                    c = '社区矫正人员';
                    break;
                // case 3:
                //     c = '服刑及涉毒人员';
                //     break;
                case 4:
                    c = '刑释解戒人员';
                    break;
                case 5:
                    c = '重点青少年';
                    break;
                case 6:
                    c = '重点信访人员';
                    break;
                case 7:
                    c = '精神病人';
                    break;
                case 8:
                    c = '涉邪人员';
                    break;
                case 9:
                    c = '优抚对象';
                    break;
                case 10:
                    c = '残疾人员';
                    break;
                case 11:
                    c = '离休干部';
                    break;
                case 12:
                    c = '低保人员';
                    break;
                case 13:
                    c = '重大疾病人员';
                    break;
                case 14:
                    c = '孤寡老人';
                    break;
                case 15:
                    c = '留守人员';
                    break;
                default:
                    break;
            }

            switch (person.type) {
                case 1:
                    c += ' 租客';
                    break;
                case 2:
                    c += ' 业主';
                    break;
                case 3:
                    c += ' 家属';
                    break;
                default:
                    break;
            }
            person.person_type = c;
            personList.push(person);
        }
    }
    return personList;
    //处理界面展示数据
}

// 处理车辆搜索结果界面展示数据
export function getCommonSearchCarList(searchCarList, showSearch, keyWord) {
    //处理界面展示数据
    //constructPersonHighLightStr 和 constructHighLightStr 均为工具类内部调用
    let carList = [];
    if (showSearch && keyWord) {
        for (let i = 0; i < searchCarList.length; i++) {
            let car = searchCarList[i];
            car.car_image = car.car_image || "";//车辆图片
            car.ogn_plate_number = car.plate;
            car.ogn_id_code = car.id_code;
            car.ogn_owner_name = car.name;
            car.ogn_color = car.car_color;
            car.ogn_type = car.car_model;
            car.ogn_telephone = car.telephone;
            car.plate_number = car.plate ? constructHighLightStr(car.plate, keyWord, true) : "<label style='display: inline-block;'></label>";
            car.owner_name = car.name ? constructHighLightStr(car.name, keyWord) : "<label style='display: inline-block;'></label>";
            car.color = car.car_color ? ("<label style='cursor: pointer'>" + car.car_color + "</label>") : "<label style='display: inline-block;'></label>";
            car.type = car.car_model ? ("<label style='cursor: pointer'>" + car.car_model + "</label>") : "<label style='display: inline-block;'></label>";
            carList.push(car);
        }
    }
    return carList;
    //处理界面展示数据
}

// 处理地点搜索结果界面展示数据
export function getCommonSearchPlaceList(searchPlaceList, showSearch, keyWord) {
    //处理界面展示数据
    //constructPersonHighLightStr 和 constructHighLightStr 均为工具类内部调用
    let placeList = [];
    if (showSearch && keyWord) {
        for (let i = 0; i < searchPlaceList.length; i++) {
            let place = searchPlaceList[i];
            let province_name = place.province_name || "";
            let city_name = place.city_name || "";
            let town_name = place.town_name || "";
            let township_name = place.township_name || "";
            let village_name = place.village_name || "";
            let unit_name = place.name || "";
            let preName = province_name;
            let showName = "";
            if(town_name){
                preName = province_name + "  " + city_name;
                showName = town_name;
            }else{
                preName = "";
                showName = cityName;//如果没有区县名 则显示城市名 从配置文件读取
                //showName = "铜仁市";
            }
            if(township_name){
                preName = province_name + "  " + city_name + "  " + town_name;
                showName = township_name;
            }
            if(village_name){
                preName = province_name + "  " + city_name + "  " + town_name + "  " + township_name;
                showName = village_name;
            }
            if(unit_name){
                preName = province_name + "  " + city_name + "  " + town_name + "  " + township_name + "  " + village_name;
                showName = unit_name;
            }
            let place_name = province_name + "  " + city_name + "  " + town_name + "  " + township_name + "  " + village_name + "  " + unit_name;
            place.name = place_name ? constructHighLightStr(place_name, keyWord) : "<label style='display: inline-block;'></label>";
            place.preName = preName;
            place.showName = showName;
            place.place_image = place.place_image || "";//地点图片
            placeList.push(place);
        }
    }
    return placeList;
    //处理界面展示数据
}

// 处理全部搜索结果界面展示数据
export function getCommonSearchAllList(searchAllList, showSearch, keyWord) {
    //处理界面展示数据
    //constructPersonHighLightStr 和 constructHighLightStr 均为工具类内部调用
    let allList = [];
    if (showSearch && keyWord) {
        store.commit('search/updateNoResult', false);
        if (searchAllList.length === 0) {
            store.commit('search/updateNoResult', true);
            return;
        }
        for (let i = 0; i < searchAllList.length; i++) {
            let all = searchAllList[i];
            //person
            if (all.data_type === "person") {
                all.face_image = all.face_image || "";
                all.ogn_user_name = all.name;
                all.id_code = all.id_code ? constructPersonHighLightStr(all.id_code, keyWord, all.isblack) : "<label style='display: inline-block;'></label>"
                all.name = all.name ? constructPersonHighLightStr(all.name, keyWord, all.isblack) : "<label style='display: inline-block;'></label>"
                all.telephone = all.telephone ? constructPersonHighLightStr(all.telephone, keyWord, all.isblack) : "<label style='display: inline-block;'></label>"
                all.gender = all.isblack ? "<label style='color: red;cursor: pointer;'>未知</label>" : "<label style='cursor: pointer;'>未知</label>";
                if (all.sex) {
                    all.gender = all.isblack ? "<label style='color: red;cursor: pointer;'>" + all.sex + "</label>" : "<label style='cursor: pointer;'>" + all.sex + "</label>";
                }
                let c = '';
                switch (String(all.special_person)) {
                    case "0":
                        c = '普通人员';
                        break;
                    case "1":
                        c = '涉毒人员';
                        break;
                    case "2":
                        c = '社区矫正人员';
                        break;
                    // case 3:
                    //     c = '服刑及涉毒人员';
                    //     break;
                    case "4":
                        c = '刑释解戒人员';
                        break;
                    case "5":
                        c = '重点青少年';
                        break;
                    case "6":
                        c = '重点信访人员';
                        break;
                    case "7":
                        c = '精神病人';
                        break;
                    case "8":
                        c = '涉邪人员';
                        break;
                    case "9":
                        c = '优抚对象';
                        break;
                    case "10":
                        c = '残疾人员';
                        break;
                    case "11":
                        c = '离休干部';
                        break;
                    case "12":
                        c = '低保人员';
                        break;
                    case "13":
                        c = '重大疾病人员';
                        break;
                    case "14":
                        c = '孤寡老人';
                        break;
                    case "15":
                        c = '留守人员';
                        break;
                    default:
                        break;
                }

                switch (String(all.type)) {
                    case "1":
                        c += ' 租客';
                        break;
                    case "2":
                        c += ' 业主';
                        break;
                    case "3":
                        c += ' 家属';
                        break;
                    default:
                        break;
                }
                all.person_type = c;
                all.typeCls = {
                    "right-top2-person": true
                };
                allList.push(all);
            }
            //car
            if (all.data_type === "car") {
                all.car_image = all.car_image || "";
                all.ogn_plate_number = all.plate;
                all.ogn_id_code = all.id_code;
                all.ogn_owner_name = all.name;
                all.ogn_color = all.car_color;
                all.ogn_type = all.car_model;
                all.ogn_telephone = all.telephone;
                all.plate_number = all.plate ? constructHighLightStr(all.plate, keyWord, true) : "<label style='display: inline-block;'></label>";
                all.owner_name = all.name ? constructHighLightStr(all.name, keyWord) : "<label style='display: inline-block;'></label>";
                all.color = all.car_color ? ("<label style='cursor: pointer'>" + all.car_color + "</label>") : "<label style='display: inline-block;'></label>";
                all.type = all.car_model ? ("<label style='cursor: pointer'>" + all.car_model + "</label>") : "<label style='display: inline-block;'></label>";
                all.typeCls = {
                    "right-top2-car": true
                };
                allList.push(all);
            }
            //place
            if (all.data_type === "place") {
                let province_name = all.province_name || "";
                let city_name = all.city_name || "";
                let town_name = all.town_name || "";
                let township_name = all.township_name || "";
                let village_name = all.village_name || "";
                let unit_name = all.name || "";
                let preName = province_name;
                let showName = "";
                if(town_name){
                    preName = province_name + "  " + city_name;
                    showName = town_name;
                }else{
                    preName = "";
                    showName = cityName;//如果没有区县名 则显示城市名 从配置文件读取
                    //console.log("cityName: " + cityName);
                }
                if(township_name){
                    preName = province_name + "  " + city_name + "  " + town_name;
                    showName = township_name;
                }
                if(village_name){
                    preName = province_name + "  " + city_name + "  " + town_name + "  " + township_name;
                    showName = village_name;
                }
                if(unit_name){
                    preName = province_name + "  " + city_name + "  " + town_name + "  " + township_name + "  " + village_name;
                    showName = unit_name;
                }
                all.preName = preName;
                all.showName = showName;
                let place_name = province_name + "  " + city_name + "  " + town_name + "  " + township_name + "  " + village_name + "  " + unit_name;
                all.name = place_name ? constructHighLightStr(place_name, keyWord) : "<label style='display: inline-block;'></label>";
                all.place_image = all.place_image || "";
                all.typeCls = {
                    "right-top2-place": true
                };
                allList.push(all);
            }
        }
    }
    return allList;
    //处理界面展示数据
}
