var imgUrlArr = {
	head:"img/head.png",
	estate:"img/estate.png",
	hourse:"img/hourse.png",
	headList:"img/headList.png",
	estateList:"img/estateList.png",
	car:"img/default_car.png",
	family:"img/default_family.png",
	tenant:"img/default_tenant.png",
	vistor:"img/default_vistor.png",
	nameBg:"img/name_bg.png",
	tipBtn:"img/tipBtn.png",
	arrowLeft:"img/icon-arrow-left.png",
	arrowRight:"img/icon-arrow-right.png",
	node_car:"img/node_car.png",
	node_family:"img/node_family.png",
	node_owner:"img/node_owner.png",
	node_telphone:"img/node_telphone.png",
	node_vistor:"img/node_vistor.png",
	node_address:"img/node_address.png",
	node_tenant:"img/node_tenant.png",
	tip_3:"img/tip_3.png",
	tip_4:"img/tip_4.png",
	tip_5:"img/tip_5.png",
	tip_6:"img/tip_6.png",
}

var canvasWidth = 8000;
var canvasHeight = 8000;
var firstRecordNodeCloseFlag = false;
var force;

var mainNodeWidtgh = 170;
var propNodeWidth = 40;
var normalNodeWidth = 120;

var rectNodeSmallWidth = 120;
var rectNodeSmallHeight = 50;
var rectNodeWidth = 200;
var rectNodeHeight = 60;

var firstNodeLinkLen = 250;
var secondNodeLinkLen = 150;
var thirdNodeLinkLen = 140;

var normalFontSize = 14;
var recordFontSize = 12;

var recordCloseX = 5;

var propIdArr = [];

var firstBaseNodeId = "";
var mainNodeArr = [];

var dragstarttime = 0;
var isClick = false;
var clickNum = 0;
var setimeId = 0;



var lastTranslate = [0,0];
var lastScale = 1;


var lastDisplayState = {};
var firstNodeFlag = false;
var secondFlag = false;

var allLinkDesArr = ['从属','家属','拜访','活动','租赁'];
var configArr = {
	"family": {
		color: "#325CFC",
		fontSize: 25,
		linkDes: "家属",
		w: 80,
		h: 80,
		id: "familyNode",
		name: "家属",
		shapeType: "circle",
		img: imgUrlArr.node_family,
		fromNode: "family",
		hasChildNode:"N"
	},
	"owner": {
		color: "#325CFC",
		fontSize: 25,
		linkDes: "从属",
		w: 80,
		h: 80,
		id: "ownerNode",
		name: "业主",
		shapeType: "circle",
		img: imgUrlArr.node_owner,
		fromNode: "estate",
		hasChildNode:"N"
	},
	"tenant": {
		color: "#008AFF",
		fontSize: 25,
		linkDes: "租赁",
		w: 80,
		h: 80,
		id: "tenantNode",
		name: "租客",
		shapeType: "circle",
		img: imgUrlArr.node_tenant,
		fromNode: "estate",
		hasChildNode:"N"
	},
	"car": {
		color: "#00B4FF",
		fontSize: 25,
		linkDes: "从属",
		w: 80,
		h: 80,
		id: "carNode",
		name: "车辆",
		shapeType: "circle",
		img: imgUrlArr.node_car,
		fromNode: "both",
		hasChildNode:"N"
	},
	"vistor": {
		color: "#008AFF",
		fontSize: 25,
		linkDes: "拜访",
		w: 80,
		h: 80,
		id: "vistorNode",
		name: "访客",
		shapeType: "circle",
		img: imgUrlArr.node_vistor,
		fromNode: "both",
		hasChildNode:"N"
	},
	"address": {
		color: "#5F5AF5",
		fontSize: 25,
		linkDes: "从属",
		w: 80,
		h: 60,
		id: "addressNode",
		name: "房屋",
		shapeType: "rect",
		img: imgUrlArr.node_address,
		fromNode: "family",
		hasChildNode:"N"
	},
	"telphone": {
		color: "#875BFA",
		fontSize: 25,
		linkDes: "从属",
		w: 80,
		h: 60,
		id: "phoneNode",
		name: "手机",
		shapeType: "rect",
		img: imgUrlArr.node_telphone,
		fromNode: "family",
		hasChildNode:"N"
	},
	"door_record": {
		color: "#22938D",
		fontSize: 25,
		linkDes: "活动",
		w: 140,
		h: 60,
		id: "doorRecordNode",
		name: "门禁记录",
		shapeType: "rect",
		fromNode: "both",
		hasChildNode:"N"
	},
	"car_record": {
		color: "#22944E",
		fontSize: 25,
		linkDes: "活动",
		w: 140,
		h: 60,
		id: "carRecordNode",
		name: "车行记录",
		shapeType: "rect",
		fromNode: "both",
		hasChildNode:"N"
	}
};

var baseData = {
	nodes: [],
	edges: []
};

