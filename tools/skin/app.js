








KISSY.use('ajax,node,sizzle,event',function(S){

	var hash = function(str){
		return str.replace(/[\/\.]/ig,'');
	};

	var showDetail = function(uri){
		S.one('#doc').css({
			'padding-top':'20px'
		});
		S.one('#doc').empty().append('<h2>loading...</h2>');
		if(typeof uri == "undefined"){
			var url = window.location.hash.replace('#','');
		}else{
			url = uri;
		}
		var initCom = new Function;
		if(url == ""){
			url = "mobile/startup/index.html"
			var initCom = function(){
				initComment();
			};
		}
		S.IO({
			url:url+'?t='+S.now(),
			success:function(d){
				S.one('#doc').html(d).append([
					'<div class="comment">',
					'	<div id="disqus_thread"></div>',
					'</div>'
				 ].join(''));
				initCom();
			},
			error:function(){
				S.one('#doc').html('<h2>404. Not Found</h2>');
			}
		});
	};	

	S.Event.on(window,'hashchange',function(e){
		showDetail();
	});
	
	showDetail();
	
});


function initComment(key){
	/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
	window.disqus_shortname = 'mobilekissyuicom'; // required: replace example with your forum shortname
	window.disqus_identifier = 'mobile-index';

	/* * * DON'T EDIT BELOW THIS LINE * * */
	(function() {
		var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
		dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
		(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	})();
}
