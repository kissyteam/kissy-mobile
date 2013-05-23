








KISSY.use('ajax,node,sizzle,event,json',function(S){

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
				if(url == 'mobile/startup/components.html'){
					showGallerys();
				}else{
					S.one('#doc').html(d).append([
						'<div class="comment">',
						'	<div id="disqus_thread"></div>',
						'</div>'
					 ].join(''));
					initCom();
				}
			},
			error:function(){
				S.one('#doc').html('<h2>404. Not Found</h2>');
			}
		});
	};	

	var showGallerys = function(){
		if(new S.Uri(window.location.href).getQuery().get('debug') !== undefined ){
			var r = 'repos.debug.json';
		}else{
			var r = 'repos.json';
		}
		S.IO({
			url:'/tools/skin/getrepos.php?'+r,	
			success:function(d){
				if(typeof d === 'string'){
					var data = S.JSON.parse(d);
				} else {
					var data = d;
				}
				S.one('#doc').html('<h2>Components</h2>').append([
					'<div>',
					'	<table class="table" id="gallerys">',
						'<tr>',
						'<td>',
							'<strong>名称</strong>',
						'</td>',
						'<td>',
							'<strong>描述</strong>',
						'</td>',
						'<td>',
							'',
						'</td>',
						'<td>',
							'',
						'</td>',
						'<td>',
							'',
						'</td>',
						'</tr>',
					'</table>',
					'</div>'
				 ].join(''));
				S.each(data,function(v,k){
					///////////////////////////////////////{{
					// 预处理部分
					if(v.name == 'kpm'){
						return;
					}
					if(v.name == 'app'){
						v.html_url = '/markdown.php?mobile/app/1.2/index.md';
					}
					///////////////////////////////////////}}
					S.one('#gallerys').append([
						'<tr>',
						'<td>',
							'<span class="label label-info">'+v.name+'</span>',
						'</td>',
						'<td>',
							v.description,
						'</td>',
						'<td>',
							'<a href="'+v.html_url+'">source</a> ',
						'</td>',
						'<td>',
							'<a href="/direct.php?type=demo&name='+v.name+'">demo</a>',
						'</td>',
						'<td>',
							'<a href="/direct.php?type=doc&name='+v.name+'">doc</a>',
						'</td>',
						'</tr>'
					].join(''));
				});
			},
			error:function(){
				S.one('#doc').html('<h2>服务器错误，稍候重试</h2>');
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
