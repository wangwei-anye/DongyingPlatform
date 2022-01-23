import { wsAddr, wsAddrPort } from '../config'

var ws = null;
var isConnected = false;

var initWS = function(token,provinceCode,cityCode,townCode,townshipCode,villageCode,estateCode) {
	ws = new Paho.MQTT.Client(wsAddr, wsAddrPort, token);
	ws.connect({
		invocationContext: {
			host: wsAddr,
			port: wsAddrPort,
			path: ws.path,
			clientId: token
		},
		timeout: 5,
		keepAliveInterval: 50,
		cleanSession: true,
		useSSL: false,
		userName: 'SecurityCenter',
		password: 'SecurityCenter',
		onSuccess: function() {
			isConnected = true;
			console.log('连接成功');
			console.log('/Alarm/' + (provinceCode ? provinceCode : '+') + '/' + (cityCode ? cityCode : '+') + '/' + (townCode ? townCode : '+') + '/' + (townshipCode ? townshipCode : '+') + '/' + (villageCode ? villageCode : '+') + '/' + (estateCode ? estateCode : '+') + '/#');
			ws.subscribe('/Alarm/' + (provinceCode ? provinceCode : '+') + '/' + (cityCode ? cityCode : '+') + '/' + (townCode ? townCode : '+') + '/' + (townshipCode ? townshipCode : '+') + '/' + (villageCode ? villageCode : '+') + '/' + (estateCode ? estateCode : '+') + '/#')
		},
		onFailure: function(error) {
			isConnected = false;
			console.log('连接失败')
		}
	})
}


var listen = function(callback) {
	console.log('开始监听')
	ws.onMessageArrived = callback;
}

export {
	isConnected,
	sendMsg,
	listen,
	initWS
}