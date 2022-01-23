function setLastState() {
	lastDisplayState = {};
	for(var i = 0; i < baseData.nodes.length; i++) {
		lastDisplayState[baseData.nodes[i].node_id] = baseData.nodes[i].display;
	}
}

function resetLastState() {
	for(var i = 0; i < baseData.nodes.length; i++) {
		baseData.nodes[i].display = lastDisplayState[baseData.nodes[i].node_id];
	}
}


function showError(txt) {
	$(".shadow").show();
	$(".errorWindow").show();
	$(".errorWindow .txt").text(txt);
	setTimeout(function() {
		$(".shadow").hide();
		$(".errorWindow").hide();
	}, 1500);
}

var a;
var isClickTime;
document.onmouseup = function() {
	isClickTime = setTimeout(function() {
		clearTimeout(isClickTime);
		isClick = false;
	}, 1000);
	if(!a) return;
	setTimeout(resetSvg, 200);
	document.all ? a.releaseCapture() : window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
	a = "";
};
document.onmousemove = function(d) {
	if(!a) return;
	if(!d) d = event;
	a.style.left = (d.clientX - b) + "px";
	a.style.top = (d.clientY - c) + "px";
};
document.ondblclick = function(e) {
	if($(e.target).attr("id") != 'svg') {
		return;
	}
	svg.selectAll('*').filter(function(d, i) {
		if(d && d.hasOwnProperty("fixed")) {
			d.fixed = false;
		}
	});
}
document.onmousedown = function(e) {
	isClick = true;
}

function dragDiv(o, e) {
	if($(e.target).attr("id") != 'svg') {
		return;
	}
	a = o;
	document.all ? a.setCapture() : window.captureEvents(Event.MOUSEMOVE);
	b = e.clientX - parseInt(a.style.left);
	c = e.clientY - parseInt(a.style.top);
}