<template>
	<div class="stefan">
		<h1>组件开发 - 陈源</h1>
    <Tabs value="ProgressBar">
      <!-- 表格（斑马线） -->
      <Tab-Pane label="表格（斑马线）" name="stripe-table">
        <Table class="stripe-table" :columns="columns1" :data="data1"></Table>
      	<p></p>
      	<Table class="stripe-table" :columns="columns2" :data="data2"></Table>
      </Tab-Pane>
      <!-- 表格（边框线） -->
      <Tab-Pane label="表格（边框线）" name="border-table">
      	<Table class="border-table" :columns="columns3" :data="data3"></Table>
      	<p></p>
      	<Table class="border-table" :columns="columns4" :data="data4"></Table>
      </Tab-Pane>
      <!-- 表格（间隔色） -->
      <Tab-Pane label="表格（间隔色）" name="hover-table">
      	<Table class="hover-table" :columns="columns5" :data="data5"></Table>
      </Tab-Pane>
      <!-- 时间轴 -->
      <Tab-Pane label="时间轴" name="timeline">
        <Timeline class="plan-watch">
          <TimelineItem>计划巡查次数</TimelineItem>
          <TimelineItem>
            <div slot="dot">30<small>次</small></div>
            <div class="time-info">2017/01/06&nbsp;&nbsp;22:00&nbsp;-&nbsp;00:00</div>
            <div class="basic-info">
              <div class="watch-detail watch-detail-blue">
                <i class="icon iconfont icon-yiwancheng"></i>
                <label>80</label><span>已完成</span>
              </div>
              <div class="watch-detail watch-detail-blue">
                <i class="icon iconfont icon-weiwancheng"></i>
                <label>10</label><span>未完成</span>
              </div>
              <div class="watch-detail watch-detail-blue">
                <i class="icon iconfont icon-hegeshuai"></i>
                <label>90</label><span>合格率</span>
              </div>
              <div class="watch-detail watch-detail-orange">
                <i class="icon iconfont icon-loujian"></i>
                <label>6</label><span>漏检</span>
              </div>
              <div class="watch-detail watch-detail-orange">
                <i class="icon iconfont icon-yanwu"></i>
                <label>6</label><span>延误</span>
              </div>
            </div>
          </TimelineItem>
          <TimelineItem>
            <div slot="dot">80<small>次</small></div>
            <div class="time-info">2017/01/06&nbsp;&nbsp;18:00&nbsp;-&nbsp;22:00</div>
            <div class="basic-info">
              <div class="watch-detail watch-detail-orange">
                <label>6</label><span>延误</span>
                <i class="icon iconfont icon-yanwu"></i>
              </div>
              <div class="watch-detail watch-detail-orange">
                <label>6</label><span>漏检</span>
                <i class="icon iconfont icon-loujian"></i>
              </div>
              <div class="watch-detail watch-detail-blue">
                <label>90</label><span>合格率</span>
                <i class="icon iconfont icon-hegeshuai"></i>
              </div>              
              <div class="watch-detail watch-detail-blue">
                <label>10</label><span>未完成</span>
                <i class="icon iconfont icon-weiwancheng"></i>
              </div>
              <div class="watch-detail watch-detail-blue">
                <label>80</label><span>已完成</span>
                <i class="icon iconfont icon-yiwancheng"></i>
              </div>
            </div>
          </TimelineItem>
          <TimelineItem class="no-data">
            <div slot="dot">20<small>次</small></div>
            <div class="time-info">2017/01/06&nbsp;&nbsp;00:00&nbsp;-&nbsp;04:00</div>
            <div class="basic-info">暂无消息</div>
          </TimelineItem>
        </Timeline>
      </Tab-Pane>
      <!-- 网页字体 -->
      <Tab-Pane label="网页字体" name="webfont">
        <ul class="icon_lists clear">
          <li>
            <i class="icon iconfont icon-yanwu"></i>
            <div class="name">延误</div>
          </li>           
          <li>
            <i class="icon iconfont icon-loujian"></i>
            <div class="name">漏检</div>
          </li>            
          <li>
            <i class="icon iconfont icon-hegeshuai"></i>
            <div class="name">合格率</div>
          </li>           
          <li>
            <i class="icon iconfont icon-weiwancheng"></i>
            <div class="name">未完成</div>
          </li>           
          <li>
            <i class="icon iconfont icon-yiwancheng"></i>
            <div class="name">已完成</div>
          </li>      
          <li>
          <i class="icon iconfont icon-fangwu"></i>
              <div class="name">房屋</div>
          </li>           
          <li>
            <i class="icon iconfont icon-xiaoqu"></i>
            <div class="name">小区</div>
          </li>           
          <li>
            <i class="icon iconfont icon-shouye"></i>
            <div class="name">首页</div>
          </li>           
          <li>
            <i class="icon iconfont icon-renkou"></i>
            <div class="name">人口</div>
          </li>           
          <li>
            <i class="icon iconfont icon-sousuo"></i>
            <div class="name">搜索</div>
          </li>           
          <li>
            <i class="icon iconfont icon-gaojing"></i>
            <div class="name">告警</div>
          </li>
          <li>
            <i class="icon iconfont icon-chuhang"></i>
            <div class="name">出行</div>
          </li>
          <li>
            <i class="icon iconfont icon-anfang"></i>
            <div class="name">安防</div>
          </li>
          <li>
            <i class="icon iconfont icon-jiankong"></i>
            <div class="name">监控</div>
          </li>
          <li>
            <i class="icon iconfont icon-fangfan"></i>
            <div class="name">防范</div>
          </li>
          <li>
            <i class="icon iconfont icon-teshu"></i>
            <div class="name">特殊</div>
          </li>
          <li>
            <i class="icon iconfont icon-xungeng"></i>
            <div class="name">巡更</div>
          </li>            
          <li>
            <i class="icon iconfont icon-zhishu"></i>
            <div class="name">指数</div>
          </li>           
          <li>
            <i class="icon iconfont icon-ditu"></i>
            <div class="name">地图</div>
          </li>
          <li>
            <i class="icon iconfont icon-yonghu"></i>
            <div class="name">用户</div>
          </li>
          <li>
            <i class="icon iconfont icon-biaozhi"></i>
            <div class="name">标志</div>
          </li>     
          <li>
            <i class="icon iconfont icon-zhuzhai"></i>
            <div class="name">住宅</div>
          </li>
          <li>
            <i class="icon iconfont icon-ranqi"></i>
            <div class="name">然气</div>
          </li>
          <li>
            <i class="icon iconfont icon-yongshui"></i>
            <div class="name">用水</div>
          </li>
          <li>
            <i class="icon iconfont icon-yongdian"></i>
            <div class="name">用电</div>
          </li>
        </ul>
      </Tab-Pane>
      <!-- 进度条 -->
      <Tab-Pane label="进度条" name="ProgressBar">
<!--         <div class="goods">
          <div class="progressbar"></div>
        </div>
        <p></p>
        <div class="property">
          <div class="progressbar"></div>
        </div>
        <p></p>
        <div class="special">
          <div class="progressbar"></div>
        </div>
        <p></p>
        <div class="ranking">
          <div class="rank-dark"></div>
          <div class="rank-light"></div>
        </div>
        <p></p> -->
        <div class="chart-item">
          <vChartBox boxType='polygon' iconName='prevent' :w="350" :h="290" boxTitle="物防数据">
            <IGoods></IGoods>
          </vChartBox>
        </div>
        <div class="chart-item">
          <vChartBox boxType='polygon' iconName='prevent' :w="413" :h="290" boxTitle="特殊人员">
            <ISpecial></ISpecial>
          </vChartBox>          
        </div>
        <div class="chart-item">
          <vChartBox boxType='polygon' iconName='prevent' :w="413" :h="290" boxTitle="电、水、天然气用量">
            <IProperty></IProperty>
          </vChartBox>          
        </div>
        <div class="chart-item">
          <v-chart-box boxType='orthogon' iconName='ranking' :w="413" :h="311" boxTitle="小区发案指数排行">
            <IRanking></IRanking>
          </v-chart-box>
        </div>
      </Tab-Pane>
    </Tabs>
	</div>
</template>

<script>
  import vChartBox from '@/components/ChartBox'
  import IGoods from '@/components/chart/IGoods'
  import ISpecial from '@/components/chart/ISpecial'
  import IProperty from '@/components/chart/IProperty'
  import IRanking from '@/components/chart/IRanking'
	export default {
		name: 'stefan',
    components: {
      vChartBox,
      IGoods,
      ISpecial,
      IRanking,
      IProperty
    },
    data () {
      return {
        // 表格 - 1
        columns1: [
          { key: 'rolename', title: '角色名称' },
          { 
            key: 'rolestatus', title: '状态', width: 150,
            render: (h, params) => {
              return h('span', {
                style: { color: params.row.rolestatus == '正常' ? '#1cb1ff' : '#f76037' }
              }, params.row.rolestatus)
            }
          },
          { 
            key: 'roleset', title: '操作', width: 450,
            render: (h, params) => {
              if(params.row.rolename == '全国超级管理员') {
                return h('span', { style: { display: 'inline-block', lineHeight: '31px' } }, '／')
              }
              else {
                return h('div', [
                  h('Button', { 
                    class: 'ivu-btn-userrole', on: { click: (e) => { this.$emit('click', e) } }
                  }, params.row.rolestatus == '正常' ? '禁 用' : '启 用'),
                  h('label', { style: { display: 'inline-block', width: '15px' } }, ''),
                  h('Button', { 
                    class: 'ivu-btn-userrole', on: { click: (e) => { this.$emit('click', e) } }
                  }, '创建角色')
                ])
              }
            }
          }
        ],
        data1: [
          { rolename: '全国超级管理员', rolestatus: '正常', roleset: '／' },
          { rolename: '全国普通管理员', rolestatus: '正常', roleset: '／' },
          { rolename: '广东省超级管理员', rolestatus: '禁用', roleset: '／' }
        ],
        // 表格 - 2
        columns2: [
          { key: 'username', title: '名称' },
          { key: 'userid', title: '账户' },
          { key: 'userrole', title: '角色' },
          { 
            key: 'userstatus', title: '状态', width: 150,
            render: (h, params) => {
              return h('span', {
                style: { color: params.row.userstatus == '正常' ? '#1cb1ff' : '#f76037' }
              }, params.row.userstatus)
            }
          },
          { 
            key: 'userset', title: '操作', width: 450,
            render: (h, params) => {
              return h('div', [
                h('Button', { 
                  class: 'ivu-btn-userrole', on: { click: (e) => { this.$emit('click', e) } }
                }, '分配资源'),
                h('label', { style: { display: 'inline-block', width: '15px' } }, ''),
                h('Button', { 
                  class: 'ivu-btn-userrole', on: { click: (e) => { this.$emit('click', e) } }
                }, '重设密码'),
                h('label', { style: { display: 'inline-block', width: '15px' } }, ''),
                h('Button', { 
                  class: 'ivu-btn-userrole', on: { click: (e) => { this.$emit('click', e) } }
                }, params.row.rolestatus == '正常' ? '禁 用' : '启 用'),
                h('label', { style: { display: 'inline-block', width: '15px' } }, ''),
                h('Button', { 
                  class: 'ivu-btn-userrole', on: { click: (e) => { this.$emit('click', e) } }
                }, '删 除')
              ])
            }
          }
        ],
        data2: [
          { username: '产品-1', userid: 'oeasy01', userrole: '全国超级管理员', userstatus: '正常' },
          { username: '产品-2', userid: 'oeasy02', userrole: '全国普通管理员', userstatus: '正常' },
          { username: '产品-3', userid: 'oeasy03', userrole: '广东省超级管理员', userstatus: '禁用' }
        ],
        // 表格 - 3
        columns3: [
          { 
            key: 'photo', title: '图像',
            render: (h, params) => {
              return h('img', {
                attrs: { src: require('../../assets/image/userpic.png'), alt: '暂无图片' },
                style: { verticalAlign: 'middle' }
              })
            }
          },
          { key: 'name', title: '姓名' },
          { key: 'sex', title: '性别' },
          { key: 'age', title: '年龄' },
          { key: 'type', title: '类型' },
          { key: 'estate', title: '小区' },
          { key: 'phone', title: '电话' },
          { key: 'idcard', title: '身份证', ellipsis: true },
          { 
            key: 'more', title: '更多',
            render: (h, params) => {
              return h('i', {
                class: 'ivu-icon ivu-icon-more', on: { click: (e) => { this.$emit('click', e) } }
              })
            }
          }
        ],
        data3: [
          {
          	name: '周卫国', sex: '男', age: '64', type: '流动人口', estate: '万和星城',
          	phone: '13555487997', idcard: '430124195604048879'
          },
          {
          	name: '周卫国', sex: '男', age: '64', type: '流动人口', estate: '万和星城',
          	phone: '13555487997', idcard: '430124195604048879'
          },
          {
          	name: '周卫国', sex: '男', age: '64', type: '流动人口', estate: '万和星城',
          	phone: '13555487997', idcard: '430124195604048879'
          }
        ],
        // 表格 - 4
        columns4: [
          { key: 'id', type: 'selection' },
          { key: 'estate', title: '小区' },
          { 
            key: 'photo', title: '图像',
            render: (h, params) => {
              return h('img', {
                attrs: { src: require('../../assets/image/userpic.png'), alt: '暂无图片' },
                style: { verticalAlign: 'middle' }
              })
            }
          },
          { key: 'name', title: '姓名' },
          { key: 'idcard', title: '身份证', ellipsis: true },
          { key: 'phone', title: '电话' },
          { key: 'usertype', title: '人员类型', filters: [ { label: '重点人员', value: 1 } ] },
          { key: 'category', title: '人员类目', filters: [ { label: '社区矫正人员', value: 1 } ] },
          { key: 'daycount', title: '当天出行次数' },
          { key: 'monthcount', title: '本月出行次数' },
          { 
            key: 'more', title: '更多',
            render: (h, params) => {
              return h('i', {
                class: 'ivu-icon ivu-icon-more', on: { click: (e) => { this.$emit('click', e) } }
              })
            }
          }
        ],
        data4: [
          {
          	estate: '冲广坪', name: '刘晓芳', idcard: '400385198805122205', phone: '15654521329', usertype: '重点人员',
          	category: '社区矫正人员', daycount: '7', monthcount: '7'
          },
          {
          	estate: '冲广坪', name: '刘晓芳', idcard: '400385198805122205', phone: '15654521329', usertype: '重点人员',
          	category: '社区矫正人员', daycount: '7', monthcount: '7'
          },
          {
          	estate: '冲广坪', name: '刘晓芳', idcard: '400385198805122205', phone: '15654521329', usertype: '重点人员',
          	category: '社区矫正人员', daycount: '7', monthcount: '7'
          }
        ],
        // 表格 - 5
        columns5: [
          { key: 'datetime', title: '时间 - 日期' },
          { key: 'username', title: '用户名' },
          { key: 'estate', title: '小区' },
          { key: 'parking', title: '车场', ellipsis: true },
          { key: 'carid', title: '车牌' },
          { 
            key: 'carstatus', title: '通行情况',
            render: (h, params) => {
              return h('span', {
                style: { color: params.row.carstatus == '成功' ? '#1cb1ff' : '#f76037' }
              }, params.row.carstatus)
            }
          },
          { 
            key: 'photo', title: '抓拍图片',
            render: (h, params) => {
              return h('img', {
                attrs: { src: require('../../assets/image/userpic.png'), alt: '暂无图片' },
                style: { verticalAlign: 'middle' }
              })
            }
          }
        ],
        data5: [
          {
          	datetime: '2017/11/22 13:00:00', username: '刘美华', estate: '万和星城', parking: '停车场A区',
          	carid: '粤B5613', carstatus: '成功'
          },
          {
          	datetime: '2017/11/22 13:00:00', username: '刘美华', estate: '万和星城', parking: '停车场A区',
          	carid: '粤B5613', carstatus: '成功'
          },
          {
          	datetime: '2017/11/22 13:00:00', username: '刘美华', estate: '万和星城', parking: '停车场A区',
          	carid: '粤B5613', carstatus: '失败'
          }
        ]
      }
    }
	}
</script>

<style lang="scss">
	.ivu-tabs-nav .ivu-tabs-tab {
		color: #fff; font-size: 14px; font-weight: bold;
	}
  .ivu-tabs .ivu-tabs-tabpane {
  	padding: 0 15px;
  }
  .stefan {
    background-image: url('../../assets/image/appBg.jpg'); background-position: left top;
    position: absolute; top: 0; right: 0; bottom: 0; left: 0;
  }
	h1 {
		line-height: 60px; text-align: center; color: #fff;
	}
	.container-ul {
		width: 450px; height: 250px;
	}

  p {
  	margin-bottom: 15px;
  }

  /******** icon_lists ********/
  .clear:after {
    content: '\20';
    display: block;
    height: 0;
    clear: both;
  }
  .clear {
    *zoom: 1;
  }
  ul, ol { list-style: none; }
  .icon_lists{
    width: 100% !important;
  }
  .icon_lists li{
    float:left;
    width: 100px;
    height: 100px;
    font-size: 14px;
    font-weight: bold;
    color:#fff;
    text-align: center;
    list-style: none !important;
  }
  .icon_lists .icon{
    font-size: 42px;
    margin: 10px 0;
    color:#fff;
    font-weight: normal;
    -webkit-transition: font-size 0.25s ease-out 0s;
    -moz-transition: font-size 0.25s ease-out 0s;
    transition: font-size 0.25s ease-out 0s;
  }

  /******** 进度条 ********/
  // .goods {
  //   width: 168px; height: 8px; background: rgba(25, 71, 117, .5); border-radius: 2px;
  //   .progressbar {
  //     width: 90%; height: 8px; background: linear-gradient(90deg, #956901, #fff951); border-radius: 4px;
  //   }
  // }
  .property {
    width: 240px; height: 20px; border: 1px solid #00609c; border-radius: 10px; box-sizing: border-box;
    .progressbar {
      width: 90%; height: 18px; background: linear-gradient(90deg, #327ec9, #00ffc9); border-radius: 9px;
    }
  }
  // .special {
  //   width: 200px; height: 19px; border: 2px solid #00609c; box-sizing: border-box;
  //   .progressbar {
  //     width: 90%; height: 15px; background: linear-gradient(90deg, #327ec9, #00ffc9);
  //   }
  // }
  .ranking {
    position: relative; width: 190px; height: 15px;
    .rank-dark {
      position: absolute; width: 100%; height: 15px; background-image: url('../../assets/image/rankDark.png');
    }
    .rank-light {
      position: absolute; width: 160px; height: 15px; background-image: url('../../assets/image/rankLight.png');
    }
  }
  .chart-item{
    float: left; margin-right: 15px; margin-bottom: 15px;
  }
</style>