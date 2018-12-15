define(function(){
	var format = function(data,num){
		var len = Math.ceil(data.length/num);
		
		var target = [];
		
		for(var i = 0;i<len;i++){
			target.push(data.splice(0,num));
		}
		
		console.log(target);  //[[{},{},{}],[{},{},{}]]
		return target
	}
	return format
})