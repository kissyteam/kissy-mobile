
KISSY.add("mobile/bottom-box/1.0/index", function (S,Mask) {

	"use strict";

	function BB(id,cfg) {
		if (this instanceof BB) {

			this.con = S.one(id);

			BB.superclass.constructor.call(this, cfg);
			this.init();

		} else {
			return new BB(id,cfg);
		}
	}

	// ATTR Example
	BB.ATTRS = {
		id:{
			value:'BB-Wrapper-'+S.now()
		},
		zIndex:{
			value: 1000
		},
		duration:{
			value: 0.2
		},
		container:{
			setter:function(s){
				return S.one(s);
			},
			value:null
		},
		className:{
			value:''
		},
		modalOpacity: {
			value: 0.6
		},
		modalFade:{
			value: true
		}
	};

	S.extend(BB, S.Base, {

		init: function() {
			// your code here
			var that = this;
			that.id = that.get('id');
			that.zIndex = that.get('zIndex');
			that.duration = that.get('duration');
			that.className = that.get('className');
			that.container = that.get('container');
			that.modalOpacity = that.get('modalOpacity');
			that.modalFade = that.get('modalFade');
			that.con = S.Node('<div id="'+that.id+'" class="'+that.className+'"></div>');
			that.con.css({
				display:'none'	
			}).appendTo('body');
			that.initMask();
		},
		initMask: function(){
			var that = this;
			that.mask = new Mask({
				opacity:that.modalOpacity,
				fade:that.modalFade
			});
		},
		destroy:function(){

		},
		doAnimIn:function(container){
			var that = this;
			var height = container.height();
			var con = that.con;
			con.css({
				display:'block',
				width:S.DOM.viewportWidth() + 'px',
				height:height + 'px',
				position:'fixed',
				'z-index':that.zIndex,
				top:S.DOM.viewportHeight() + 'px'
			});
			container.css({
				display:'block'	
			});
			S.Anim(con,{
				top:(S.DOM.viewportHeight() - height) + 'px'
			},that.duration,'easeIn',function(){
				that.fire('boxShow',{
					container:container
				});
			}).run();
		},
		doAnimOut: function(){
			var that = this;
			var con = that.con;
			S.Anim(con,{
				top:S.DOM.viewportHeight() + 'px'
			},that.duration,'none',function(){
				that.fire('boxHide',{
					container:that.container	
				});
				con.css({
					display:'none'	
				});
				that.container.css({
					display:'none'	
				});
			}).run();
		},
		hide: function(){
			var that = this;
			var con = that.con;
			that.doAnimOut();
			if(that.mask.masked()){
				that.mask.removeMask();
			}
		},
		show: function(container){
			var that = this;
			var con = that.con;
			if(that.isShow()){
				return;
			}
			if(S.isUndefined(container)){
				if(S.isUndefined(that.container)){
					throw("容器未定义,请传入参数:show(container)");
					return;
				}
				container = that.container;
			}
			container = S.one(container);

			if(S.isUndefined(that.container) || S.isNull(that.container)){
				that.container = container;
			} else if(that.container === container){

			} else {
				that.container.css({
					display:'none'	
				}).appendTo('body');
				that.container = container;
			}

			if(container.parent() !== con){
				con.append(container);
			}
			that.doAnimIn(container);
			that.mask.addMask();
			that.mask.getMask().on(S.UA.mobile?'click':'click',function(){
				that.hide();
				that.mask.removeMask();
			});
		},
		isShow: function(){
			var that = this;
			var con = that.con;
			if(con.css('display') == 'block'){
				return true;
			} else {
				return false;
			}
		}

	});

	return BB;

}, {
	requires: ['mobile/simple-mask/1.0/','base','node']
});
