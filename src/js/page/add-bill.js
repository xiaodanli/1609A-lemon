require(['../js/config.js'],function(){
	require(['mui','dom','getUid','format'],function(mui,dom,getUid,format){
		
		
		function init(){
			mui.init();
			//添加点击事件
			addEvent();
			
			//加载分类的数据
			loadClassify();
		}
		
		
		//加载分类的数据
		
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
							renderClassify(res.data);
						}
					},
					error:function(error){
						console.warn(error)
					}
				})
			})
			
		}
		
		var type = "支出";
		
		//渲染分类的数据
		function renderClassify(data){
			/**
			 * {
				 "支出"：[],
				 "收入":[]
			   }
			 */
			
			var targetObj = {};
			
			data.forEach(function(item){
				if(!targetObj[item.type]){  //支出
					targetObj[item.type] = [];
				}
				targetObj[item.type].push(item);
			});
			
			console.log(targetObj);
			
			var target = format(targetObj[type],8);
			
			var str = '';
			
			target.forEach(function(item){
				str += `
					<div class="mui-slider-item">
						<div class="swiper">`
				str += renderDl(item);			
				str+=		`</div>
					</div>
				`
			});
			
			dom('.mui-slider-group').innerHTML = str;
			
			mui('.mui-slider').slider();
			
			var items = Array.from(dom('.mui-slider-group').querySelectorAll('.mui-slider-item'));
			
			var lastItem = items[items.length-1];
			
			var dls = Array.from(lastItem.querySelectorAll('dl'));
			
			var swiper = lastItem.querySelector('.swiper');
			
			var custom = `<dl class="custom">
							<dt>
								<span class="mui-icon mui-icon-plus"></span>
							</dt>
							<dd>自定义</dd>
						</dl>`;
			
			if(dls.length === 8){
				dom('.mui-slider-group').innerHTML += `
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
			}else{
				swiper.innerHTML += custom;
			}
			
			console.log(target)
		}
		
		function renderDl(data){
			return data.map(function(item){
				return `
					<dl>
						<dt>
							<span class="${item.c_icon}"></span>
						</dt>
						<dd>${item.c_name}</dd>
					</dl>
				`
			}).join('');
		}
		
		function addEvent(){
			
			//点击分类
			mui('.mui-slider-group').on('tap','dl',function(){
				var className = this.className;
				
				if(className === 'custom'){
					location.href="../../page/add-classify.html?type="+type;
				}
			})
			var _money = dom('.money');
			//点击键盘
			mui('.keyword').on('tap','span',function(){
				var val = this.innerHTML;
				
				var moneyVal = _money.innerHTML;  //8
				console.log(typeof 'x');
				
				if(val === 'x'){
					_money.innerHTML = moneyVal.slice(0,moneyVal.length-1);
					if(moneyVal.length == 1){
						_money.innerHTML = '0.00';
					}
					return 
				}
				
				if(moneyVal == '0.00'){
					_money.innerHTML = '';
					_money.innerHTML += val;
					return 
				}else if(moneyVal.indexOf('.') != -1 && val === '.'){
					_money.innerHTML = moneyVal;
				}else if(moneyVal.indexOf('.') != -1 && moneyVal.split('.')[1].length == 2){
					_money.innerHTML = moneyVal;
				}else{
					_money.innerHTML += val;
				}
				
				
				
				
				
				
			})
		}
		
		init();
	})
})