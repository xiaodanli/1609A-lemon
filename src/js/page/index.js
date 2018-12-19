require(['./js/config.js'], function() {
	require(['mui', 'dom', 'echarts', 'getUid','moment','dtpicker', 'picker', 'poppicker'], function(mui, dom, echarts,getUid,moment,dtpicker) {
		console.log(echarts)

		function init() {
			mui.init();

			dom('.mui-inner-wrap').addEventListener('drag', function(event) {
				event.stopPropagation();
			});

			//初始化滚动
			initScroll();

			//初始化时间
			initDate();

			//添加点击事件
			addEvent();

			//初始化图表
			initTable();
			
			//加载数据
			loadData();
		}
		
		function loadData(){
			//加载账单
			loadBill();
			
			//加载分类
			loadClassify();
		}
		
		function loadClassify(){
			getUid(function(uid){
				mui.ajax('/classify/api/getClassify',{
					data:{
						uid:uid
					},
					dataType:'json',
					success:function(res){
						console.log(res);
						if(res.code === 1){
							//渲染分类
							renderClassify(res.data);
						}
					},
					error:function(error){
						console.warn(error);
					}
				})
			})
			
		}
		
		//渲染分类
		function renderClassify(data){
			var cObj = {};
			
			data.forEach(function(item){
				if(!cObj[item.type]){
					cObj[item.type] = [];
				}
				cObj[item.type].push(item);
			})
			
			console.log(cObj);
			dom('.pay-c').innerHTML = renderCli(cObj['支出']);
			dom('.com-c').innerHTML =renderCli(cObj['收入']);
		}
		
		
		function renderCli(data){
			return data.map(function(item){
				return `<li>${item.c_name}</li>`
			}).join('')
		}
		
		var monthTotalPay = 0,  //本月总花费
			monthTotalCom = 0,  //本月总收入
			_payWrap = dom('.pay-wrap'),
			_comWrap = dom('.comming-wrap');
		
		//加载账单
		function loadBill(classifyArr){
			var timer = _selectDate.innerHTML,
				time_type = status === 'month' ? 2 : 1,
				classifyArr = classifyArr || '';
			getUid(function(uid){
				mui.ajax('/bill/api/getBill',{
					data:{
						timer:timer,
						time_type:time_type,
						classify:classifyArr,
						uid:uid
					},
					dataType:'json',
					success:function(res){
						console.log(res);
						if(res.code === 1){
							if(status === 'month'){
								//渲染月的视图
								renderMonthBill(res.data);
							}else{
								//渲染年的视图
								renderYearBill(res.data);
							}
						}
					},
					error:function(error){
						console.warn(error);
					}
				})
			})
		}
		
		//渲染月的视图
		function renderMonthBill(data){
			var obj = {};
			
			var target = [];
			// moment().format('MM-DD');
			data.forEach(function(item){
				var time = moment(item.timer).format('MM-DD');
				console.log(moment(item.timer).format('MM-DD'));
				
				/**
				 * {
					 "12-11":{
						 time:,
						 totapPay:,
						 list:
					 },
					 "12-12":{
					 	time:,
					 	totapPay:,
					 	list:
					 }
				 }
				 * 
				 */
				if(!obj[time]){
					obj[time] = {
						time:time,
						list:[],
						totalPay:0
					}
				}
				obj[time].list.push(item);
				if(item.type === '支出'){
					obj[time].totalPay += item.money*1;
					monthTotalPay += item.money*1;
				}else{
					monthTotalCom += item.money*1;
				}
			})
			_payWrap.innerHTML = `本月花费：<span>${monthTotalPay}</span>`;
			
			_comWrap.innerHTML = `本月收入：<span>${monthTotalCom}</span>`;
			// console.log(obj);
			
			for(var i in obj){
				target.push(obj[i]);
			}
			
			console.log(target);
			
			var mStr = '';
			
			target.forEach(function(item){
				mStr += `
					<div class="day-item">
						<div class="day-title">
							<div>
								<span class="mui-icon mui-icon-chatboxes"></span>
								${item.time}
							</div>
							<div>
								花费
								<span class="money">${item.totalPay}</span>
							</div>
						</div>
						<ul class="mui-table-view">`
				mStr += renderLi(item.list);			
				mStr+=		`</ul>
					</div>
				`;
			})
			
			dom('.month-wrap').innerHTML = mStr;
			
		}
		
		//渲染年的视图
		function renderYearBill(data){
			var obj = {};
			
			var target = [];
			// moment().format('MM-DD');
			data.forEach(function(item){
				var time = moment(item.timer).format('MM');
				console.log(moment(item.timer).format('MM'));
				
				/**
				* {
					"12-11":{
						time:,
						totapPay:,
						list:
					},
					"12-12":{
						time:,
						totapPay:,
						list:
					}
				}
				* 
				*/
				if(!obj[time]){
					obj[time] = {
						time:time,
						list:[],
						totalPay:0,
						totalCom:0
					}
				}
				obj[time].list.push(item);
				if(item.type === '支出'){
					obj[time].totalPay += item.money*1;
				}else{
					obj[time].totalCom += item.money*1;
				}
			})
			
			// console.log(obj);
			
			for(var i in obj){
				target.push(obj[i]);
			}
			
			console.log(obj);
			
			yStr = '';
			
			target.forEach(function(item){
				yStr += `
						<div class="month-item">
							<ul class="mui-table-view">
								<li class="mui-table-view-cell mui-collapse">
									<a class="mui-navigate-right" href="#">
										<ul class="m-title">
											<li>
												<span class="mui-icon mui-icon-chatboxes"></span>
												<span>${item.time}</span>
											</li>
											<li class="red">
												<span>花费</span>
												<span>${item.totalPay}</span>
											</li>
											<li class="green">
												<span>收入</span>
												<span>${item.totalCom}</span>
											</li>
											<li class="gray">
												<span>结余</span>
												<span>${item.totalCom-item.totalPay}</span>
											</li>
										</ul>
									</a>
									<div class="mui-collapse-content">
										<ul class="mui-table-view">`
				yStr += renderLi(item.list);							
				yStr+=	`</ul>
									</div>
								</li>
							</ul>
						</div>
					
				`
			})
			
			dom('.year-wrap').innerHTML = yStr;
		}
		
		function renderLi(data){
			return data.map(function(item){
				return `
					<li class="mui-table-view-cell">
						<div class="mui-slider-right mui-disabled">
							<a class="mui-btn mui-btn-red" data-type="${item.type}" data-money="${item.money}" data-lid="${item.lid}">删除</a>
						</div>
						<div class="mui-slider-handle">
							<div>
								<span class="${item.c_icon} y-bg"></span>
								<span>${item.c_name}</span>
							</div>
							<div class="${item.type === '支出' ? 'red' :'green'}">${item.money}</div>
						</div>
					</li>
				`
			}).join('');
		}

		function initTable() {
			// 基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));

			// 指定图表的配置项和数据
			var option = {
				graphic: {
					type: 'text',
					left: 'center',
					top: 'center',
					style: {
						text: '用户统计\n' + '100', //使用“+”可以使每行文字居中
						textAlign: 'center',
						font: 'italic bolder 16px cursive',
						fill: '#000',
						width: 30,
						height: 30
					}
				},
				series: [{
					name: '访问来源',
					type: 'pie',
					radius: ['40%', '55%'],
					data: [{
							value: 335,
							name: '直达'
						},
						{
							value: 310,
							name: '邮件营销'
						},
						{
							value: 234,
							name: '联盟广告'
						},
						{
							value: 135,
							name: '视频广告'
						},
						{
							value: 1048,
							name: '百度'
						},
						{
							value: 251,
							name: '谷歌'
						},
						{
							value: 147,
							name: '必应'
						},
						{
							value: 102,
							name: '其他'
						}
					]
				}]
			};

			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);
		}

		//初始化滚动
		function initScroll() {
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		}

		var picker = null,
			dtPicker = null,
			curYear = new Date().getFullYear(),
			curMonth = new Date().getMonth() + 1,
			_selectDate = dom('.select-date'),
			status = 'month';

		//初始化时间
		function initDate() {
			//初始化选择年月
			picker = new mui.PopPicker();
			picker.setData([{
				value: 'month',
				text: '月'
			}, {
				value: 'year',
				text: '年'
			}]);

			//初始化选择时间
			dtPicker = new mui.DtPicker({
				type: 'month'
			});

			_selectDate.innerHTML = curYear + '-' + curMonth;
		}

		//添加点击事件
		function addEvent() {
			var _monthWrap = dom('.month-wrap'),
				_yearWrap = dom('.year-wrap');
			//点击年月
			dom('.select-type').addEventListener('tap', function() {
				var that = this;
				picker.show(function(selectItems) {
					that.innerHTML = selectItems[0].text;
					console.log(selectItems[0].text); //年/月
					console.log(selectItems[0].value); //month/year 
					status = selectItems[0].value;
					var config = {
						isShow: 'inline-block',
						w: "50%"
					}
					if (status === 'month') {
						_selectDate.innerHTML = curYear + '-' + curMonth;
						config = {
							isShow: 'inline-block',
							w: "50%"
						};
						_monthWrap.style.display = "block";
						_yearWrap.style.display = "none";
					} else {
						_selectDate.innerHTML = curYear;
						config = {
							isShow: 'none',
							w: "100%"
						};
						_monthWrap.style.display = "none";
						_yearWrap.style.display = "block";
					}

					dom('h5[data-id="title-m"]').style.display = config.isShow;
					dom('h5[data-id="title-y"]').style.width = config.w;

					dom('.mui-picker[data-id="picker-m"]').style.display = config.isShow;
					dom('.mui-picker[data-id="picker-y"]').style.width = config.w;
				
					//加载账单
					loadBill();
				})
			})

			//点击选择时间
			dom('.select-date').addEventListener('tap', function() {
				dtPicker.show((function(selectItems) {
					console.log(selectItems); //{text: "2016",value: 2016} 
					console.log(selectItems.m); //{text: "05",value: "05"} 
					if (status === 'month') {
						_selectDate.innerHTML = selectItems.value;
					} else {
						_selectDate.innerHTML = selectItems.y.text;
					}
					loadBill();
				}))
				
			})

			//打开侧边栏
			dom('.open-aside').addEventListener('tap', function() {
				mui('.mui-off-canvas-wrap').offCanvas('show');
			})

			//关闭侧边栏
			dom('.close-aside').addEventListener('tap', function() {
				mui('.mui-off-canvas-wrap').offCanvas('close');
			})

			var _billWrap = dom('.bill-wrap'),
				_tableWrap = dom('.table-wrap'),
				_tabItems = Array.from(dom('.tab-list').querySelectorAll('span'));

			//点击tab-list
			mui('.tab-list').on('tap', 'span', function() {
				var id = this.getAttribute('data-id');

				if (id == 0) {
					_billWrap.style.display = 'block';
					_tableWrap.style.display = 'none';
				} else {
					_billWrap.style.display = 'none';
					_tableWrap.style.display = 'block';
				}

				for (var i = 0; i < _tabItems.length; i++) {
					_tabItems[i].classList.remove('active');
				}

				this.classList.add('active');
			})
		
			//去添加账单界面
			dom('.go-bill').addEventListener('tap',function(){
				location.href="../../page/add-bill.html";
			})
		
			//点击全部收入和支出
			mui('.c-type').on('tap','li',function(){
				var id = this.getAttribute('data-id');  //0  1
				
				var classify = document.querySelectorAll('.classify');
				
				var curClass = this.className;
				
				var lis = classify[id].querySelectorAll('li');
				if(curClass.indexOf('active') != -1){
					for(var i = 0;i<lis.length;i++){
						lis[i].classList.remove('active');
						this.classList.remove('active');
					}
				}else{
					for(var i = 0;i<lis.length;i++){
						lis[i].classList.add('active');
						this.classList.add('active');
					}
				}
				
				var activeLis =  dom('.c-wrap').querySelectorAll('.active');
				
				var classifyArr = [];
				
				console.log(activeLis.length);
				
				for(var c = 0;c<activeLis.length;c++){
					console.log(activeLis)
					classifyArr.push(activeLis[c].innerHTML);
				}
				
				console.log(classifyArr)
				loadBill(classifyArr);
			})
			
			mui('.classify').on('tap','li',function(){
				var classify = document.querySelectorAll('.classify');
				
				var id = this.parentNode.getAttribute('data-id');
				
				if(this.className.indexOf('active') != -1){
					this.classList.remove('active');
				}else{
					this.classList.add('active');
				}
				
				var activeLis = classify[id].querySelectorAll('.active');
				
				var lis = classify[id].querySelectorAll('li');
				
				var cTypeLis = dom('.c-type').querySelectorAll('li');
				
				if(activeLis.length == lis.length){
					cTypeLis[id].classList.add('active');
				}else{
					cTypeLis[id].classList.remove('active');
				}
				
				
				var classifyArr = [];
				
				var allActiveLis = dom('.c-wrap').querySelectorAll('.active');
				
				for(var c = 0;c<allActiveLis.length;c++){
					classifyArr.push(allActiveLis[c].innerHTML);
				}
				
				loadBill(classifyArr);
			})
			
			//点击删除
			mui('.bill-wrap').on('tap', '.mui-btn', function(event) {
				var elem = this;
				var li = elem.parentNode.parentNode;
				btnArray = ["确定","取消"];
				
				var money = this.getAttribute('data-money'),
					lid = this.getAttribute('data-lid'),
					type = this.getAttribute('data-type');
				mui.confirm('确认删除该条记录？', '提示', btnArray, function(e) {
					if (e.index == 0) {
						mui.ajax('/bill/api/delBill',{
							data:{
								lid:lid
							},
							dataType:'json',
							success:function(res){
								console.log(res);
								if(res.code === 1){
									if(status === 'month'){
										var item = li.parentNode.parentNode;
										var _money = item.querySelector('.money');
										if(type==='支出'){
											monthTotalPay -= money*1;
											_payWrap.innerHTML = `本月花费：<span>${monthTotalPay}</span>`;
											_money.innerHTML -= money*1;
										}else{
											monthTotalCom -= money*1;
											_comWrap.innerHTML = `本月收入：<span>${monthTotalCom}</span>`;
										}
										if(li.parentNode.children.length>1){
											li.parentNode.removeChild(li);
										}else{
											dom('.month-wrap').removeChild(item);
										}
										
									}
									

								}
							}
						})
						
						// 
					} else {
						setTimeout(function() {
							mui.swipeoutClose(li);
						}, 0);
					}
				});
			});
		}

		init(); //初始化
	})
})
