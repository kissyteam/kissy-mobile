
KISSY.add("mobile/app/1.2/demo/lottery/js/appnav/nav", function (S , Tool , Layout , Backbone , _) {

	var NavApp = Backbone.View.extend({
		el: '#appnav',
		logined: false,
		events: {
			'click .myLottery a': 'showOrder',
			'click .native a': 'download',
			'touchstart li , .return': 'tap',
			'touchend li': 'untap',
			'touchend .return': 'untap1'
		},
		tap: function(e){
			var obj = $(e.currentTarget);
			obj.addClass('tap');
		},
		untap1: function(e){
			var obj = $(e.currentTarget);
			obj.removeClass('tap');
		},
		untap: function(e){
			var lis = this.$el.find('li');
			lis.removeClass('tap');
		},
		/**
		 * 初始化
		 * @memberOf NavApp	 
		 */
		initialize: function(){
			this.fetchIssueData().setLogin().getNick();
			localStorage.setItem('cp_mode',Tool.searchJSON().mode);
		},
		
		/**
		 * 抓取各彩种的当前彩期
		 * @memberOf NavApp
		 * @return NavApp
		 */
		fetchIssueData: function(){
			Tool.getScript(C.Config.getIssueDataUrl() + '?typeId=' + C.Config.doneLot.toString() + '&callback=C.navapp.issueHandle&t=' + new Date().getTime());
			return this;
		},
		/**
		 * 根据sid获取用户名
		 */
		getNick: function(){
			var sid = this.getSid();
			if(sid === undefined) return;
			Tool.getScript(C.Config.getCheckLoginUrl() + '?sid=' + sid + '&callback=C.navapp.handleNick');
		},
		setLogin: function(){
			var l = this.l = this.$('.user-info .l a'),
				r =  this.r = this.$('.user-info .r a'),
				kf = this.$('.cr-sv'); 
			var loginUrl = C.Config.getLoginUrl() + '?tpl_redirect_url=' + encodeURIComponent(location.href.replace(location.hash,''));
			l.html('登录').attr('href',loginUrl);
			r.html('注册').attr('href',C.Config.getRegisterUrl());
			kf.attr('href',kf.attr('href') + '?sid=' + Tool.searchJSON().sid)
			return this;
		},
		/**
		 * 管理获得的nickname
		 * @param obj{object} 服务器返回对象，格式如：{nick:'xxx',status:true}
		 */
		handleNick: function(obj){
			var sid = Tool.searchJSON().sid;
			if(!obj.status) return;
			this.logined = true;
			this.l.html(obj.nick).attr('href',C.Config.getMyTao() + '?sid=' + sid);
			this.r.html('退出').attr('href',C.Config.getLogoutUrl() + '?sid=' + sid);
		},
		/**
		 * 管理各彩种的彩期显示
		 * @name handleIssue
		 * @memberOf NavApp 
		 */
		issueHandle: function(obj){
			var lis = this.$el.find('li');
			if(obj.status){
				_.each(obj.results,function(n){
					if(!n.status){
						for(var i=0,len=lis.length;i<len;i++){
							if(C.Config.lotTypeNumberId[lis.eq(i).attr('rel')] == n.lotteryType){
								if(n.resultCode == 'stop_sale' || n.resultCode == 'issue_stop_sale'){
									lis.eq(i).addClass('stopSale');
									lis.eq(i).find('.txt p').eq(1).html('抱歉，本彩种暂停销售');
								}
								break;
							}
						}
					}
					localStorage.setItem('issueData_' + n.lotteryType , JSON.stringify(n));
				});
			}
		},
		/**
		 * 获得sid
		 * @memberOf NavApp
		 * @name getSid
		 * @return sid{string} sid 
		 */
		getSid: function(){
			var obj = Tool.searchJSON() , sid ;
			if(obj.sid){
				sid = obj.sid;
				localStorage.setItem('sid',sid);
			}else if(localStorage.getItem('sid')){
				sid = localStorage.getItem('sid');
			}
			return sid;
		},
		/**
		 * 查看我的订单
		 * @name showOrder
		 * @memberOf NavApp 
		 */
		showOrder: function(e){
			var self = this, 
				obj = $(e.currentTarget) , 
				sid = this.getSid();
			if(this.logined){
				obj.attr('href' , C.Config.getMyOrderUrl() + '&sid=' + sid);
			}else{
				obj.attr('href' , C.Config.getLoginUrl() + '?tpl_redirect_url=' + encodeURIComponent(C.Config.getMyOrderUrl()));				
			}
		},
		/**
		 * 下载客户端
		 * @name download
		 * @memberOf NavApp
		 */
		download: function(e){
			var self = this,
				obj = $(e.currentTarget);
			if (Tool.platform === 'ios') {
				obj.attr('href','http://itunes.apple.com/cn/app/id399737960?mt=8');
			}else if(Tool.platform === 'android'){
				obj.attr('href','http://download.taobaocdn.com/nbdev-client/client4lottery/release/1.5.0/taobao_caipiao_v1.5.0.apk');
			}else{
				alert('很抱歉，此客户端暂不支持您的系统');
				return false;
			}
		}
	});
	
	return {
		initialize: function() {
			C.navapp = new NavApp();
		}
	};

}, {
	requires: ['mobile/app/1.2/demo/lottery/js/base/tool' , 'mobile/app/1.2/demo/lottery/js/base/layout' , 'mobile/app/1.2/demo/lottery/js/lib/backbone' , 'mobile/app/1.2/demo/lottery/js/lib/underscore']
});



