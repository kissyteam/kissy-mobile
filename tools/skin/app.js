








KISSY.use('ajax,node,sizzle,event',function(S){

	var showDetail = function(uri){
		S.one('#doc').empty().append('<h2>loading...</h2>');
		if(typeof uri == "undefined"){
			var url = window.location.hash.replace('#','');
		}else{
			url = uri;
		}
		if(url == ""){
			S.one('#doc').css('display','none');
			S.one('#index').css('display','block');
		}else{
			S.one('#doc').css('display','block');
			S.one('#index').css('display','none');
			S.IO.get(url+'?t='+S.now(),function(d){
				S.one('#doc').html(d);
			});
		}
	};	

	S.Event.on(window,'hashchange',function(e){
		showDetail();
	});
	
	showDetail();
	
});
