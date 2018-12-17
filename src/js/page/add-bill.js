require(['../js/config.js'], function() {
	require(['mui', 'dom', 'getUid', 'format', 'picker', 'dtpicker'], function(mui, dom, getUid, format) {


		function init() {
			mui.init();
			//添加点击事件
			addEvent();

			//加载分类的数据
			loadClassify();

			//初始化时间
			initDate();
		}

		var dtpicker = null,
			curYear = new Date().getFullYear(),
			curMonth = new Date().getMonth() + 1,
			curDay = new Date().getDate(),
			_time = dom('.time');

		function initDate() {
			_time.innerHTML = curYear + '-' + curMonth + '-' + curDay;
			dtPicker = new mui.DtPicker({
				type: 'date'
			});

		}



		//加载分类的数据

		function loadClassify() {
			getUid(function(uid) {
				mui.ajax('/classify/api/getClassify', {
					data: {
						uid: uid
					},
					dataType: 'json',
					success: function(res) {
						console.log(res);
						if (res.code === 1) {
							renderClassify(res.data);
						}
					},
					error: function(error) {
						console.warn(error)
					}
				})
			})

		}

		var type = "支出";

		var targetObj = {};


		//渲染分类的数据
		function renderClassify(data) {
			/**
			 * {
				 "支出"：[],
				 "收入":[]
			   }
			 */
			data.forEach(function(item) {
				if (!targetObj[item.type]) { //支出
					targetObj[item.type] = [];
				}
				targetObj[item.type].push(item);
			});

			console.log(targetObj);
			//按收支类型渲染数据
			renderTypeC(targetObj[type]);

		}

		function renderTypeC(data) {
			data = data.slice(0);

			var target = format(data, 8);

			var str = '';

			target.forEach(function(item) {
				str += `
								<div class="mui-slider-item">
									<div class="swiper">`
				str += renderDl(item);
				str += `</div>
								</div>
							`;
			});

			dom('.mui-slider-group').innerHTML = str;

			var slider = mui('.mui-slider').slider();

			slider.gotoItem(0, 0);

			var items = Array.from(dom('.mui-slider-group').querySelectorAll('.mui-slider-item'));

			var lastItem = items[items.length - 1];

			var firstDl = Array.from(items[0].querySelectorAll('dl'))[0];

			firstDl.classList.add('active');

			var dls = Array.from(lastItem.querySelectorAll('dl'));

			var swiper = lastItem.querySelector('.swiper');

			var custom =
				`<dl class="custom">
					<dt>
						<span class="mui-icon mui-icon-plus"></span>
					</dt>
					<dd>自定义</dd>
				</dl>`;

			if (dls.length === 8) {
				dom('.mui-slider-group').innerHTML +=
					`
								<div class="mui-slider-item">
									<div class="swiper">
										<dl class="custom">
											<dt>
												<span class="mui-icon mui-icon-plus"></span>
											</dt>
											<dd>自定义</dd>
										</dl>
									</div>
								</div>
							`
			} else {
				swiper.innerHTML += custom;
			}

		}

		function renderDl(data) {
			return data.map(function(item) {
				return `
					<dl data-id="${item.cid}">
						<dt>
							<span class="${item.c_icon}"></span>
						</dt>
						<dd>${item.c_name}</dd>
					</dl>
				`
			}).join('');
		}

		//添加账单
		var _money = dom('.money');
		function addBill(){
			//cid  money  uid timer
			var cid = dom('.mui-slider-group').querySelector('.active').getAttribute('data-id'),
					money = _money.innerHTML,
					timer = dom('.time').innerHTML;
				
			getUid(function(uid){
				mui.ajax('/bill/api/addBill',{
					data:{
						uid:uid,
						cid:cid,
						money:money,
						timer:timer
					},
					dataType:'json',
					type:'post',
					success:function(res){
						console.log(res);
						if(res.code === 1){
							_money.innerHTML = "0.00";
							location.href="../../index.html";
						}
					},
					error:function(error){
						console.warn(error);
					}
				})
			})
			
		}

		function addEvent() {

			//点击分类
			mui('.mui-slider-group').on('tap', 'dl', function() {
				var className = this.className;

				if (className === 'custom') {
					location.href = "../../page/add-classify.html?type=" + type;
				}
			})
			
			//点击键盘
			mui('.keyword').on('tap', 'span', function() {
				var val = this.innerHTML;

				var moneyVal = _money.innerHTML; //8
				console.log(typeof 'x');

				if (val === 'x') {
					_money.innerHTML = moneyVal.slice(0, moneyVal.length - 1);
					if (moneyVal.length == 1) {
						_money.innerHTML = '0.00';
					}
					return
				}else if(val === '完成'){
					//添加账单
					addBill();
					return 
				}

				if (moneyVal == '0.00') {
					_money.innerHTML = '';
					_money.innerHTML += val;
					return
				} else if (moneyVal.indexOf('.') != -1 && val === '.') {
					_money.innerHTML = moneyVal;
				} else if (moneyVal.indexOf('.') != -1 && moneyVal.split('.')[1].length == 2) {
					_money.innerHTML = moneyVal;
				} else {
					_money.innerHTML += val;
				}






			})
			//选择时间
			_time.addEventListener('tap', function() {
				var that = this;
				dtPicker.show(function(selectItems) {
					console.log(selectItems.y); //{text: "2016",value: 2016} 
					console.log(selectItems.m); //{text: "05",value: "05"} 

					console.log(selectItems)
					that.innerHTML = selectItems.text;
				})
			})

			//点击分类
			mui('.mui-slider-group').on('tap', 'dl', function() {
				var dls = Array.from(dom('.mui-slider-group').querySelectorAll('dl'));
				for (var i = 0; i < dls.length; i++) {
					dls[i].classList.remove('active');
				}

				this.classList.add('active');
			})

			//点击收入和支出
			mui('.tab-list').on('tap', 'span', function() {
				var spans = Array.from(dom('.tab-list').querySelectorAll('span'));
				for (var i = 0; i < spans.length; i++) {
					spans[i].classList.remove('active');
				}
				this.classList.add('active');
				type = this.innerHTML;

				renderTypeC(targetObj[type]);
			})
		}

		init();
	})
})
