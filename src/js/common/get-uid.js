define(function(){
	var getUid = function(fn){
		var uid = window.localStorage.getItem('uid') || '';
		
		if(!uid){
			mui.ajax('/users/api/addUser',{
				data:{
					nickname:''
				},
				type:'post',
				dataType:'json',
				success:function(res){
					console.log(res);
					if(res.code === 1){
						window.localStorage.setItem('uid',res.uid);
						fn(res.uid);
					}else{
						alert(res.msg);
					}
				},
				error:function(error){
					console.warn(error);
				}
			})
		}else{
			fn(uid);
		}
	}
	
	return getUid
})