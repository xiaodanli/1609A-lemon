require(['../js/config.js'],function(){
	require(['mui','dom','getUid','getParams','format'],function(mui,dom,getUid,getParams,format){
		
		function init(){
			mui.init();
			
			//加载图标数据
			loadIconList();
			
			//添加点击事件
			addEvent();
		}
		
		//加载图标数据
		
		function loadIconList(){
			mui.ajax('/classify/api/selectIcon',
			{
				dataType:'json',
				success:function(res){
					console.log(res);
					if(res.code === 1){
						//渲染slider
						renderslider(res.data);
					}
				}
			})
		}
		
		//渲染slider
		function renderslider(data){
			var target = format(data,15);
			
			var str = '';
			
			target.forEach(function(item){
				str += `
					<div class="mui-slider-item">
						<ul class="icon-list">`
				str+= renderLi(item);			
				str+= `</ul></div>`;
			})
			
			dom('.mui-slider-group').innerHTML = str;
			
			mui('.mui-slider').slider();
		}
		
		//渲染li
		
		function renderLi(data){ 
			return data.map(function(item){
				return `
					<li>
						<span class="${item.icon_name}"></span>
					</li>
				`;
			}).join('')
		}
		
		
		//添加点击事件
		function addEvent(){
			
			//点击保存
			dom('.save-btn').addEventListener('tap',function(){
				//uid c_icon c_name type
				var type = decodeURI(getParams.type),
					c_icon = dom('#target-icon').className,
					c_name = dom('.c_name').value;
				console.log(type)
				
				if(!c_name || !type){
					alert("分类名或分类类型不存在");
				}else{
					getUid(function(uid){
						mui.ajax('/classify/api/addClassify',{
							type:'post',
							data:{
								uid:uid,
								type:type,
								c_icon:c_icon,
								c_name:c_name
							},
							dataType:'json',
							success:function(res){
								if(res.code === 1){
									location.href="../../page/add-bill.html";
								}
							}
						})
					})
				}
				
				
				
				
				
			})
			
			//点击分类
			mui('.mui-slider').on('tap','span',function(){
				dom('#target-icon').className = this.className;
			})
		}
		
		init();
	})
})