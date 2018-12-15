define(function(){
	var url = location.search;
	
	if(url.indexOf('?') != -1){
		url = url.substr(1);
	}
	
	var bArr = url.split('&');  //[type=12,age=13]
	
	var params = {};
	
	bArr.forEach(function(item){
		var sArr = item.split('='); //[type,12]   [age,13]
		params[sArr[0]] = sArr[1];
	})
	
	return params //{type:12,age:13}
})