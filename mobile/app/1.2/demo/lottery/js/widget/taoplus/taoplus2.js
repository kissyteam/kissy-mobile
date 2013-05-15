
KISSY.add('mobile/app/1.2/demo/lottery/js/widget/taoplus/taoplus2', function(S) {
	var wrap,
		tpEl,
		tpTao,
		tpBtn,
		tpIcons,
		tpLogo,
		tpCircle,
		tpBtnTao,
		tpBtnMsg,
		tpBtnNum,
		tpCart,
		wwNum,
		logisNum,
		shade,
		tpBtnStr = false,
		toMoving = false
		;



	var TaoJia = {
		initialize : function(opt){

			var that = this;
			//环境变量
			that._checkSysType = (function(){
				var _checkSysType = 'm',
				host = location.host;
				if(!host.match('m.(taobao|tmall|etao|alibaba|alipay|aliyun)')){
					if(host=='localhost' || host.match('(?:.*\\.)?mtest\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')){
						_checkSysType = 'waptest';
					}else if (host.match('(?:.*\\.)?wapa\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')){
						_checkSysType = 'wapa';
					}else if (host.match('(?:.*\\.)?mtest\\.(taobao|tmall|etao|alibaba|alipay|aliyun)\\.com.*')){
						_checkSysType = 'mtest';
					}
				}
				return _checkSysType;
			})()
			;

			//检测ua
			that._browser = (function(){
				var ua = navigator.userAgent;
		        var filter = ['iPhone OS ', 'Android '];
		        var platform={
		           'iphone':false,
		           'adnroid':false
		        };
		        var version = '';
		        var vArray = [];
		        for (var i = 0; i < filter.length; i++) {
		           var index = ua.indexOf(filter[i]);
		           if (index > -1) {
		              switch(i){
		                 case 0:
		                    platform['iphone']=true;
		                    break;
		                 case 1:
		                    platform['adnroid']=true;
		                    break;  
		              }
		              var len = filter[i].length;
		              version = ua.substr(index + len, 6);
		              vArray = version.split( /_|\./ );
		           }
		        }
		        return{
		           'iphone':platform['iphone'],
		           'android':platform['adnroid'],
		           'version':parseFloat(vArray.join('.'))
		        }
			})();


			//判断url是否存在ttid
			var checkParam = (function(){
				var url = location.search,
				param = 'ttid=',
				value,
				reg = /ttid=(\w*)(?: |&|$)/;
				if(reg.test(url)){
					value = RegExp.$1;
				}
				var result = value && ('&' + param + value) || ''
				return result;
			})();

			that._opt = opt || {};
			wrap = $('body');

			//Dom插入
			var dom = {

				//插入DOM对象
				_generate:function(){
				    var urls = {};
				   
				    //urls.s = 'http://s.' + that._checkSysType + '.taobao.com/search.htm';
				    urls.s = 'http://' + that._checkSysType + '.taobao.com/channel/act/sale/searchlist.html?pds=search%23h%23taojia' + checkParam;//搜索
				    urls.cart = 'http://cart.' + that._checkSysType + '.taobao.com/my_cart.htm?pds=cart%23h%23taojia' + checkParam;//购物车
				    urls.my = 'http://my.' + that._checkSysType + '.taobao.com/my_taobao.htm?pds=mytaobao%23h%23taojia' + checkParam;//个人中心
				    urls.im = 'http://im.' + that._checkSysType + '.taobao.com/ww/ad_ww_lately_contacts.htm?pds=ww%23h%23taojia' + checkParam;//旺旺
				    urls.logis = 'http://tm.' + that._checkSysType + '.taobao.com/order_list.htm?statusId=5&pds=wuliu%23h%23taojia' + checkParam;//物流
				    //urls.home = 'http://' + that._checkSysType + '.taobao.com';
				    urls.more = 'http://' + that._checkSysType + '.taobao.com/channel/chn/mobile/application.html?pds=apply%23h%23taojia' + checkParam;//更多
					
					tpEl = $([
						'<div id="J_Shade" class="none"></div>',
						'<div id="J_Taojia" class="taoplus">',
					        '<div class="circle hide">',
					            '<div class="tpicons">',
					                '<ul>',
					                    '<li class="more"><a dataurl="'+ urls.more +'"></a><span class="bg"></span></li>',
					                    '<li class="logis"><a dataurl="'+ urls.logis +'"></a><span class="bg"></span></li>',
					                    '<li class="ww"><a dataurl="'+ urls.im +'"></a><span class="bg"></span></li>',
					                    '<li class="individ"><a dataurl="'+ urls.my +'"></a><span class="bg"></span></li>',
					                    '<li class="car"><a dataurl="'+ urls.cart +'"></a><span class="bg"></span></li>',
					                    '<li class="search"><a dataurl="'+ urls.s +'"></a><span class="bg"></span></li>',
					                '</ul>',
					            '</div>',
					            '<div class="tplogo">',
					                '<a href="http://m.taobao.com"></a><span class="bg"></span>',
					            '</div>',
					        '</div>',
					        '<div class="cart none">',
					        	'<img src="http://a.tbcdn.cn/mw/s/common/icons/nopic/avatar-40.png"/>',
					        	'<span></span>',
					        '</div>',
					        '<div class="tpbtn on">',
					        	'<div>',
						            '<ul>',
						                '<li class="icontao p"></li>',
						            '</ul>',
						        '</div>',
						        '<p class="num none">',
						        '</p>',
					        '</div>',
					    '</div>'
					].join(''));
					
					wrap.append(tpEl);

				}

			}

			
			dom._generate();				

			tpTao = $('#J_Taojia');
			tpBtn = tpEl.find('.tpbtn');
			tpIcons = tpEl.find('.tpicons a');
			tpLogo = tpEl.find('.tplogo a');
			tpCircle = tpEl.find('.circle');
			tpBtnTao = tpBtn.find('.icontao');
			tpBtnMsg = tpBtn .find('ul');
			tpBtnNum = tpBtn.find('.num');
			tpCart = tpEl.find('.cart');
			shade = $('#J_Shade');

			
			that.events();

			var msg = {
				init:function(){
					var ajaxurl = 'http://'+that._checkSysType+'.taobao.com/indexHeaderAjax.htm?callback=?';
					//var ajaxurl = 'http://10.13.123.78/mw/base/styles/component/taoplus/json/index.html'
					$.ajax({
						url:ajaxurl,
						type:'post',
						dataType:'json',
						//crossDomain:true,
						success:function(json){
							//console.log('成功')
							var result = json.result, //结果，true / false
								totalMsgCount = json.totalMsgCount, //总消息数目
								taobaoRadioMsgCount = json.taobaoRadioMsgCount, //推推消息数目
								wwMsgCout = json.wwMsgCout, //旺旺消息数目
								logisticsMsgCount = json.logisticsMsgCount; //物流消息数目
								carMsgCout = json.taobaoCartCounts;//购物车消息数目
							
							if(result){
								var ww = tpEl.find('.ww a'),
									car = tpEl.find('.car a'),
									logis = tpEl.find('.logis a');

								//消息为0的时候不显示数字，消息大于10的时候显示为‘N’
								if(wwMsgCout > 0){
									wwNum = wwMsgCout = wwMsgCout >= 10 ? 'N' : wwMsgCout
									ww.append('<strong class="num">' + wwMsgCout + '</strong>');
									btnTaoRemove('iconww');
									tpBtnNum.removeClass('none');								
									
								}
								if(logisticsMsgCount){
									logisNum = logisticsMsgCount = logisticsMsgCount >= 10 ? 'N' : logisticsMsgCount
									logis.append('<strong class="num">' + logisticsMsgCount + '</strong>');
									btnTaoRemove('iconlogis');
									tpBtnNum.removeClass('none');
								}

								//购物车
								if(carMsgCout > 0){
									car.append('<strong class="num">' + (carMsgCout >= 10 ? 'N' : carMsgCout) + '</strong>');
								}else if(carMsgCout < 0){
									var url = 'http://cart.'+ that._checkSysType +'.taobao.com/ajax/cartCounts.do?callback=?'
									$.ajax({
										url:url,
										type:'get',
										dataType:'jsonp',
										success:function(json){
											car.append('<strong class="num">' + (json >= 10 ? 'N' : json) + '</strong>');
										},
										error:function(xhr, type){
											console.log('购物车网络连接失败')
										}
									})
								}											

								(wwNum || logisNum) && that.getmsg()

								
								
							}

						},
						error:function(xhr, type){
							//console.log('网络连接失败')
						}
					})				


					

					function btnTaoRemove(icon){
						tpBtnMsg.append('<li class="'+ icon +'"></li>')
					}

					function setCookie(key,value){
					    var host = window.location.host;
					    var index = host.indexOf(".");
					    var subDomain=host.substring(0,index);
					     if(subDomain !='waptest' && subDomain!='wapa' && subDomain!='m')
					      {
					      host = host.substr(index+1);
					      } 
					    var exp  = new Date(); 
					     exp.setTime(exp.getTime() + 86400000);
					    document.cookie = key + "="+ escape (value) + ";path=/;domain="+host+";expires=" + exp.toGMTString();
					}




				}
			}
			msg.init();

			//加入购物车
			tpCart.css({
				'left':(wrap.width()-320)/2+230
			})
			window.onresize = function(){
				tpCart.css({
				'left':(wrap.width()-320)/2+230
				})
			}

			//ios4定位
			if((that._browser.iphone && that._browser.version < 5) 
	          		|| (that._browser.android && that._browser.version <= 2.1)){
	            
	            window.addEventListener('scroll', Scroll, false);
	            document.addEventListener('touchmove', touchMove, false); 

	            function Scroll(event) {
					tpEl.css({
						'opacity':'1',
						'-webkit-transition':'opacity 3s linear ',
					})
	            }
	            function touchMove(event) {
	            	tpEl.css({
	            		//'opacity':'0',
	            		'top':window.innerHeight + window.scrollY - 230 + 'px',
	            		'-webkit-transition':'none',
	            	})
	            }  
	            
	        }

	        //android4.1 fixed问题
	        if(that._browser.android && that._browser.version >= 4.1){
	        	tpTao.css({
	        		'-webkit-transform': 'translate3d(0, 0, 0)'
	        	})
	        }
			
			
		},

		events : function(){
			var that = this;
			
			
			tpBtn.on('click',taoact)
			function taoact(){
				sendUrl('click#h#taojia')	
				if(that.st() == 1){
					that.circleShow()
					
				}else{
					that.circleHide()
					
				}				
				
			}

			$(document).on('touchmove',function(e){
				tpBtnStr && e.preventDefault()				
			})

			shade.on('tap',shadeact)
			function shadeact(){				
				that.circleHide()
				
			}

			tpIcons.click(function(){
				var self = $(this),					
					href = self.attr('dataurl'),
					timer = null
					;

				
				that._opt.onHide && that._opt.onHide();
				timer = setTimeout(function(){	
					that.circleHide();				
					setTimeout(function(){window.location.href = href},300)
					clearTimeout(timer)
				},500)				

			})

			//埋点
		    function sendUrl(param){
				var c = param,
				host = location.host,
				http = that._checkSysType;
				$.ajax({
					url: "http://"+http+".taobao.com/monitor.htm?callback=?",
					type:"get",
					data : {
						'type':'jsonp',
						pds : c,
						t:new Date().getTime()
					}
				});
			}
		},

		circleShow : function(){
			if(toMoving) return;
			var that = this;
			that._opt.onShow && that._opt.onShow();
			tpBtn.removeClass('on').addClass('off');
			tpCircle.removeClass('hide').addClass('show');
			shade.removeClass('none');
			if((that._browser.iphone && that._browser.version < 5) 
	          		|| (that._browser.android && that._browser.version <= 2.1)){
				
            	shade.css({
            		'top':window.scrollY - 10 + 'px'
            	})
			}

			tpBtnStr = true;
		},

		circleHide : function(){
			if(toMoving) return;
			if(tpCircle.hasClass('hide')) return;
			toMoving = true;
			var that = this;
			that._opt.onHide && that._opt.onHide();

			var that = this,
				timer = null
				;
			tpBtn.removeClass('off').addClass('on');
			tpCircle.removeClass('show').addClass('hide');
			shade.animate({'opacity': '0'}, 350, 'linear', function() {
				shade.addClass('none')	;
				shade.attr('style','')	;
				toMoving = false;
				tpBtnStr = false;				
			});

		},

		taojiaHide : function(){
			var that = this;
			that.circleHide();
			tpTao.css({
				'opacity':'0'
			});
		},

		taojiaShow : function(){
			
			tpTao.css({
				'opacity':'1'
			});
		},

		//记录淘+状态
		st:function(){
			if(tpBtn.hasClass('on')){
				return 1;
			}else if(tpBtn.hasClass('off')){
				return 2;
			}
		},

		//消息动画
		getmsg : function(){

			var timer = null,
				i = 1,
				hasWwMsg = false
				;

			

			fn = function(){

				var li = tpBtnMsg.find('li'),
					li_l = li.length,
					h = tpBtnMsg.height(),
					act = tpBtnMsg.find('.iconact'),
					act_l = tpBtnMsg.find('.iconact').length,
					wwact = tpEl.find('.iconww'),
					logisact = tpEl.find('.iconlogis'),
					num = tpBtnMsg[0].offsetLeft/h
					;

				tpBtnMsg.width(li_l*h)

				
				if(li_l == 1){
					return false;
				}else if(num >= 0){					
					wwNum && (tpBtnNum.html(wwNum) ,hasWwMsg = true) || tpBtnNum.html(logisNum)
				}else{
					hasWwMsg && tpBtnNum.html(logisNum)
				}
				

				tpBtnMsg.animate({'left': -(act_l+1)*h}, 500, 'linear', function() {
					i++;															
					li.eq(i-1).addClass('iconact')
				});		
				
				if(act_l+2 >= li_l){
					clearTimeout(timer)	;
					hasWwMsg = false;				
				}else{
					timer = setTimeout(fn,2000)
				}
			}

			fn()
			
		},

		//加入购物车
		cart : function(src){
			
			if (toMoving) return;
			toMoving = true;

			var that = this,
				img = tpEl.find('.cart img'),
				li = tpBtnMsg.find('li'),
				car = tpCart.find('span'),
				bodyW = wrap.width(),
				cartW = tpCart.width(),
				contW = tpEl.width(),
				left1 = 60,
				left2 = wrap.find('.fullscreen')[0].offsetLeft,
				timer = null;

			tpCart.show();
			setTimeout(function(){
				tpCart.css({
					'opacity':'1',
				})				

				img.attr('src',src)
				img.addClass('down')
				car.addClass('addact')
				tpCart.animate({'-webkit-transform': 'translate('+ -100 +'px, 0px)'}, 800, 'linear', function() {
					car.addClass('addact')
					tpCart.animate({'-webkit-transform': 'translate('+ -(left2+190) +'px, 0px)'}, 500, 'linear', function() {
						tpCart.css({
							'opacity':'0',
					 		'-webkit-transform': 'translate(0px, 0px)',
					 		'display':'none'
						})
						img.removeClass('down')
						
						tpBtnMsg.append('<li class="iconcar"></li>');
						that.getmsg()
						tpBtnNum.hide();
						timer = setTimeout(function(){
							w = tpBtnMsg.height();
							left = tpBtnMsg[0].offsetLeft;
							tpBtnMsg.animate({'left': left+w}, 500, 'linear', function() {
								tpBtnMsg.find('.iconcar').remove()
								car.removeClass('addact')
								tpBtnNum.attr('style','')
								toMoving = false;
							})
							
						},2000)				

					})			
				});
			},1)


		}

	}

	return TaoJia;
} , {
	requires: [
	
	]
})

