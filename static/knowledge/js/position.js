function getViewportSize(w) {
	var w = w || window;
	if(w.innnerWidth !== null) return { w: w.innerWidth, h: w.innerHeight };
	var d = w.document;
	if(document.compatMode == "CSS1Compat") {
		return {
			w: d.documentElement.clientWidth,
			h: d.documentElement.clientHeight
		};
	}
	return { w: d.body.clientWidth, h: d.body.clientHeight };
}

initSvg();
//设置画布居中
function initSvg() {
	var obj = getViewportSize();
	$("#svg").css('left', (obj.w * 0.5 - canvasWidth / 2 + 960) + "px");
	$("#svg").css('top', (obj.h * 0.5 - canvasHeight / 2 + 400) + "px");
}
