/**
 * @fileoverview slider组件
 * 依赖zepto
 * @author caochun.cr@taobao.com (曹纯)
*/

KISSY.add('mobile/app/1.2/demo/lottery/js/widget/slide/slide' , function(S , css3) {
	var	has3d = css3.has3d(),
		hasTransform = css3.hasTransform(),
		gp = hasTransform ? 'translateX' : 'left',
		gv1 = has3d ? 'translate3d(' : 'translate(',
		gv2 = has3d ? ',0)' : ')';
	$.touchSlider = function(options,container){
		this.op = {
			container : ".slider",  //大容器，包含状态，上下页等
			wrap : ".slider-outer",  //滑动显示区域
			wrapUl : ".slider-wrap",  //滑动容器
			wrapStatus : "null",  //状态容器
			margin : 0,  //滑动容器内子元素的间距
			cls : "sel",  //状态容器内子元素选中的样式
			prev : null,  //上一页
			next : null,  //下一页
			lazy : 'dataimg', //延时属性
			anitime : 400, //滑动持续时间
			easeing : "ease-out",  //滑动公式
			isLoop : false,  //循环
			isPlay : false,  //自动播放
			bounce : true,  //边界反弹
			inter : 5000,  //播放间隔时间
			isHide : true,  //prev和next在头尾是否需要隐藏
			ontouchstart : null, //滑动开始触发事件
			ontouchend : null //滑动结束后触发事件
		};
		if(container){this.op.container = container} 
		$.extend(this.op,options); //op内的container优先级高
		if($(this.op.container).length == 0){return null;}
		var android = (/android/gi).test(navigator.appVersion);
		if(android){
			this.op.bounce = false;
		}
		this.init();
	}
	$.extend($.touchSlider.prototype,{
		init : function(){
			var op = this.op;
			this._container = $(op.container);
			this._prev = op.prev && this._container.find(op.prev)[0];  //上一个按钮
			this._next = op.prev && this._container.find(op.next)[0];  //下一个按钮
			this._wrap = this._container.find(op.wrap);
			if(this._wrap.length == 0){return null;}
			var wul = this._wul = this._container.find(op.wrapUl);
			if(wul.length == 0){return null;}
			var childs = this._childs = wul.children();  //滑动容器内子元素
			if(childs.length == 0){return null;}
			var step = this._step = op.step || this._wrap.width(),  //滑动步长
			len = this._len = childs.length;  //子元素的个数
			this._wrapStatus = this._container.find(op.wrapStatus);  //slider状态容器
			this._cls = op.cls;
			var single = childs[0].offsetWidth,  //单个子元素的宽度
			margin = op.margin,
			status = this._status = Math.floor(this._step/single),  //每页显示子元素的个数
			allWidth = single*this._len;  //滑动容器的宽度
			if(status < 1){return null;}  //出错，childs宽度不能大于_wrap宽度
			if(status > 1 || op.step){op.isLoop = false;}  //如果一页显示的子元素超出1个，或设置了步长，则不支持循环；若自动播放，则只支持一次
			if(op.isLoop){
				allWidth = single * (len+2);
				this.op.bounce = true;
			}
			if(hasTransform){
				this._wrap.css({'-webkit-transform-style':'preserve-3d'});
				//wul.css({'-webkit-perspective':1000,'-webkit-backface-visibility':'hidden'});
				childs.css({'-webkit-transform':gv1+'0,0'+gv2});
			}
			//是否初始位置
			var initLeft = op.left;
			if(initLeft){
				hasTransform && wul.css('-webkit-transform',gv1+initLeft+'px,0'+gv2) || wul.css('left',initLeft);
			}
			//console.log(allWidth);
			if(margin && typeof margin == 'number'){  //如果有margin
				allWidth += (this._len-1)*margin;  //总宽度增加
				this._step += margin;
			}
			var pages = this._pages = Math.ceil(len/status);  //总页数
			//状态容器添加子元素
			if(this._wrapStatus.length > 0){  //如果状态容器存在
				var temp='',
				childstu = this._wrapStatus.children();
				if(childstu.length == 0){  //子元素不存在
					for(var i=0;i<pages;i++){
						temp += '<span'+(i==0?" class="+this._cls+"":"")+'></span>';
					}
					this._wrapStatus.html(temp);
				}
				//console.log(temp);
			}
			//如果没超出一页，则不需要滑动
			//延时加载的图片
			var selector = 'img['+op.lazy+']';
			this.lazyimg = wul.find(selector);
			this.getImg();
			if(pages <= 1){
				if(this._prev){this._prev.style.display = 'none';}
				if(this._next){this._next.style.display = 'none';}
				this._wrapStatus.hide();
				return null;
			}
			wul.css('width',allWidth);
			//复制收尾元素，以便循环
			if(op.isLoop){
				$(childs[0].cloneNode(true)).appendTo(wul);
				$(childs[len-1].cloneNode(true)).css({'position':'relative','left':-step*(len+2)}).appendTo(wul);
				this._childs = wul.children();
				/* 重置lazy图片数组 */
				this.lazyimg.push(1);
				this.lazyimg = $(this.lazyimg.concat($(this._childs[len+1]).find(selector)));
			}
			//定义事件
			this.eventInit();
		},
		eventInit : function(){
			var that = this,
			initLeft = that.op.left;
			that._coord = {};  //存储开始的event坐标
			that._moveCoord = {};  //存储移动过程的event坐标
			that._cmax = initLeft || 0;  //最大滑动坐标
			that._cmin = -(that._pages-1)*that._step;  //最小滑动坐标
			initLeft && (that._cmin += initLeft);
			that._left = initLeft || 0;  //滑动容器的x坐标
			that._current = 0;  //当前所在页
			if(that._wrapStatus.length > 0){
				that._statusChild = that._wrapStatus.children();  //状态元素
				that._selChild = that._statusChild[that._current];  //当前状态元素
			}
			that._minpage = 0;  //最小页
			that._maxpage = that._pages -1;  //最大页
			that._isScroll = false;  //滑动
			that._movestart = false; //是否执行了move
			that._playTimer = null;
			//添加事件
			that.increaseEvent();
		},
		increaseEvent : function(){
			var that = this,
			op = that.op,
			_wrap = that._wrap[0];
			/*that._wrap[0][that._touchstart] = that._start;
			that._wrap[0]['ontouchcancel'] = that._end;*/
			if(_wrap.addEventListener){
				_wrap.addEventListener('touchstart', that, false);
				_wrap.addEventListener('touchmove', that, false);
				_wrap.addEventListener('touchend', that, false);
			}
			if(op.isPlay){that.begin();}
			if(that._prev){
				that._prev['onclick'] = function(e){that.prev.call(that,e)};
			}
			if(that._next){
				that._next['onclick'] = function(e){that.next.call(that,e)};
			}
			if(that._prev && that._next){
				that.updateArrow();
			}
		},
		handleEvent : function(e){
			var that = this;
			switch(e.type){
				case 'touchstart':
					that.start(e);break;
				case 'touchmove':
					that.move(e);break;
				case 'touchend':
				case 'touchcancel':
					that.end(e);break;
			}
		},
		getImg : function(n){  //还原图片
			var that = this,
			isFirst = n === undefined ? true : false,
			loop = that.op.isLoop,
			lazy = that.op.lazy,
			status = that._status,
			childs = that._childs,
			len = childs.length,
			m = n && parseInt(n,10) || 0,
			lazyimg = that.lazyimg,
			imgarr = [];
			if(lazyimg.length == 0){return;}
			if(m < 0){  //循环
				lazyimg.each(function(n,node){
					if(node == 1) return;
					if(n == (len + m) || n == (len + m - 2)){
						imgarr.push(node);
						lazyimg[n] = 1;
					}
				});
			}
			else{
				m += 1;
				var lisignlen,startn,endn;
				if(status > 1){
					startn = (isFirst ? (m - 1) : m)*status;
					endn = (m + 1)*status;
					/*if(start < len - 1){
						var alen = Math.min((m + 1)*status,len);
						for(var i = start + 1;i<alen;i++){
							imgarr = imgarr.add($(childs[i]).find(selector));
						}
					}*/
				}
				else{
					var lisignlen = $(childs[m]).children().length,
					startn = (isFirst ? m-1 : m)*lisignlen,
					endn = (m+1)*lisignlen;
				}
				lazyimg.each(function(n,node){
					if(node == 1) return;
					if(n >= startn && n < endn){
						imgarr.push(node);
						lazyimg[n] = 1;
					}
				});
			}
			//console.log(imgarr);
			if(imgarr.length == 0){return;}
			var src,nobj;
			$(imgarr).each(function(n,item){
				nobj = $(item);
				src = nobj.attr(lazy);
				if(src){
					nobj.attr('src',src);
					nobj.removeAttr(lazy);
				}
			});
		},
		getXY : function(e){
			var touchs = e.touches ? e.touches[0] : e;
			return {x:touchs.clientX,y:touchs.clientY};
		},
		start : function(e){  //触摸开始
			//console.log(this);
			var that = this,
			op = that.op;
			//console.log(that._isScroll);
			if(that._isScroll){return;}  //滑动未停止，则返回
			that._movestart = false;
			that.stop();
			that._coord = that.getXY(e);
			/*that._wrap[0][that._touchmove] = that._move;
			if(that.isTouch){
				that._wrap[0][that._touchend] = that._end;
			}
			else{
				document[that._touchend] = that._end;
			}*/
			if(op.ontouchstart){op.ontouchstart();}
		},
		move : function(e){
			var that = this;
			that._moveCoord = that.getXY(e);
			var newdisx = that._moveCoord.x - that._coord.x,
			newdisy = that._moveCoord.y - that._coord.y,
			//current = 0,
			initLeft = that.op.left,
			tmleft;
			if(!that._movestart){
				that._scrollx = Math.abs(newdisx) > Math.abs(newdisy);
				if(that._scrollx){
					e.preventDefault();
					//current = (newdisx > 0) && (_current - 1) || (_current + 1);
					//that.getImg(current);
				}
				that._movestart = true;
			}
			else if(that._scrollx){  //如果是左右
				e.preventDefault();
				tmleft = (initLeft || 0) - that._current * that._step + newdisx;
				if(!that.op.bounce){
					if(that._left < that._cmin){tmleft = that._cmin;}
					if(that._left > that._cmax){tmleft = that._cmax;}
				}
				//console.log(newdisx,that._left);
				if(hasTransform){
					that._wul.css("-webkit-transform",gv1+tmleft+'px,0'+gv2);
				}
				else{
					that._wul.css("left",tmleft);
				}
				that._left = tmleft;
			}
		},
		end : function(e){
			var that = this,
			op = that.op;
			if(that._movestart && that._scrollx){  //如果执行了move
				e.preventDefault();
				var distance = that._moveCoord.x - that._coord.x;
				if(distance < -10){
					that.next();
				}else if(distance > 10){
					that.prev();
				}
				if(op.ontouchend){op.ontouchend(that._current);}
			}else{
				that.begin();
			}
			/*that._wrap[0][that._touchmove] = null;
			if(that.isTouch){
				that._wrap[0][that._touchend] = null;
			}
			else{
				document[that._touchend] = null;
			}*/
			that._coord = {};
			that._moveCoord = {};
			distance = null;
		},
		prev : function(e){
			if(e&&e.preventDefault){e.preventDefault()}
			//if(this._current <=0){return;}
			var that = this;
			//console.log(that._current);
			that._current -= 1;
			if(that._current < that._minpage){
				if(!that.op.isLoop){that._current = that._minpage;}
				else{that._current = that._minpage - 1;}
			}
			this.touchf();
		},
		next : function(e){
			if(e&&e.preventDefault){e.preventDefault()}
			//if(this._current >= this._pages -1){return;}
			var that = this;
			that._current += 1;
			//console.log(that._current,that._maxpage);
			if(that._current > that._maxpage){
				if(!that.op.isLoop){that._current = that._maxpage;}
				else{that._current = that._maxpage + 1;}
			}
			that.touchf();
		},
		touchf : function(str){
			var that = this,
			op = that.op,
			initLeft = op.left,
			leftt = that._left,
			leftend = (initLeft || 0) - that._current*that._step;
			that._isScroll = true;
			that.stop();
			if(leftt == leftend){
				that._isScroll = false;
			}
			else{
				that.getImg(that._current);
				var tob = {};
				tob[gp] = leftend + 'px';
				that._wul.animate(tob,op.anitime,op.easeing,function(){
					if(op.isLoop){
						if(that._current >= (that._maxpage+1)){
							that._current = 0;
						}else if(that._current <= (that._minpage-1)){
							that._current = that._maxpage;
						}
					}
					that._left = (initLeft || 0) - that._current*that._step;
					if(hasTransform){
						$(this).css('-webkit-transform',gv1 + that._left + 'px,0'+gv2);
					}
					else{
						$(this).css('left',that._left);
					}
					that.update();
					if(!(!op.isLoop && that._current == that._maxpage)){
						that.begin();
					}
					else{
						that.op.isPlay = false;
					}
					that._isScroll = false;
					if(that._prev && that._next){
						that.updateArrow();
					}
				});
			}
		},
		update : function(){
			var that = this;
			//$('#J_search').html(that._statusChild.className+'|'+that._selChild.className);
			if(that._statusChild && that._statusChild[that._current] && that._selChild){
				$(that._selChild).removeClass(that._cls);
				$(that._statusChild[that._current]).addClass(that._cls);
				that._selChild = that._statusChild[that._current];
			}
		},
		updateArrow : function(){  //左右箭头状态
			var that = this;
			if(!that._prev && !that._next){return;}
			if(that.op.isLoop){return;}  //如果是循环，则不需要隐藏
			if(that.op.isHide){
				if(that._current <= 0){
					$(that._prev).hide();
				}
				else{
					$(that._prev).show();
				} 
				if(that._current >= that._maxpage){
					$(that._next).hide();
				}
				else{
					$(that._next).show();
				}
			}
		},
		begin : function(){
			var that = this,
			op = that.op;
			if(op.isPlay){  //自动播放
				that.stop();
				that._playTimer = setInterval(function(){
					that.next();
				},op.inter);
			}
		},
		stop : function(){
			var that = this,
			op = that.op;
			if(op.isPlay && that._playTimer){
				clearInterval(that._playTimer);
				that._playTimer = null;
			}
		},
		destroy : function(){
			var that = this;
			that._container[0].removeAttribute('isLoad');
			if(that._pages <= 1){return;}
			//that._wrap[0][this._touchstart] = null;
			var _wrap = that._wrap[0];
			_wrap.removeEventListener('touchstart', that, false);
			_wrap.removeEventListener('touchmove', that, false);
			_wrap.removeEventListener('touchend', that, false);
			if(that._prev){that._prev['onclick'] = null;}
			if(that._next){that._next['onclick'] = null;}
		}
	});
	$.touchSlider.cache = [];
	$.fn.slider = function(options){
		return this.each(function(n,item){
			if(!item.getAttribute('isLoad')){
				item.setAttribute('isLoad',true);
				$.touchSlider.cache.push(new $.touchSlider(options,item));
			}
		});
	}
	$.touchSlider.destroy = function(){
		var cache = $.touchSlider.cache,
		len = cache.length;
		//console.log($.touchSlider.cache);
		if(len < 1){return;}
		for(var i=0;i<len;i++){
			cache[i].destroy();
		}
		$.touchSlider.cache = [];
		//console.log($.touchSlider.cache);
	}
	return $.touchSlider;
} , {
	requires: [
		'mobile/app/1.2/demo/lottery/js/widget/slide/css3'
	]
});


