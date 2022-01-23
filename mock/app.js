const express = require('express')
const path = require('path')
var bodyParser = require('body-parser');
const app = express()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 允许所有的请求形式
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.join(__dirname, 'dist/community-manage-control')))

app.listen(8088, () => {
  console.log(`App listening at port 8088`)
})

const appData = require('./data.json');
const router = express.Router();  


//获取列表数据       get
router.get('/getList', function (req, res) {
	var pageIndex = req.query.pageIndex;
	var pageSize = req.query.pageSize;
	var arr = [];
	for (var i = (pageIndex - 1) * pageSize; i < Math.min(appData.length,pageIndex * pageSize); i++) {
		arr.push(appData[i]);
	}
	res.json({
		data: arr,
		totalNum:appData.length,
		totalPage:parseInt((appData.length - 1) / pageSize) + 1
	});
});

//获取列表数据       post
router.post('/getList', function (req, res) {
	var pageIndex = req.body.pageIndex;
	var pageSize = req.body.pageSize;
	var arr = [];
	for (var i = (pageIndex - 1) * pageSize; i < Math.min(appData.length,pageIndex * pageSize); i++) {
		arr.push(appData[i]);
	}
	res.json({
		data: arr,
		totalNum:appData.length,
		totalPage:parseInt((appData.length - 1) / pageSize) + 1
	});
});

app.use('/api', router);

module.exports = app;


