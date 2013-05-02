

KISSY.add('mobile/base/exception' , function(S , Layout , Tool) {
	var result = {};
	
	result.redirect = function(){
		var tar = '?';
		var obj = Tool.searchJSON(location.search);
		if(!obj.numberStrings) return;
		for(var i in obj){
			if(i == 'sid'){
				tar += 'sid=' + obj.sid + '&mode=' + obj.mode + '&switchAnim=true'
			}
		}
		location.href = location.href.replace(location.search,tar);
	};
	
	result.removeWait = function(){
		Layout.removeMaskLayer();
		$('.wait').remove();
	};
	
	result.initialize = function(errcode){
		//debugger;
		this.removeWait();
		$('#errShow').html(C.Config.exception[errcode]);
		this.redirect();
		Layout.removeTaoPlus();
	};

	return result;

} , {

	requires: [
		'mobile/base/layout',	
		'mobile/base/tool',
		'mobile/lib/zepto'
	]

});

