/**
 * @file index.js
 * @brief 
 * @author jayli, bachi@taobao.com
 * @version 
 * @date 2013-05-27
 */

KISSY.add('mobile/simple-mask/1.0/index',function (S) {

	"use strict";

	function Mask(id,cfg) {
		if (this instanceof Mask) {

			this.con = S.one(id);

			Mask.superclass.constructor.call(this, cfg);
			this.init();

		} else {
			return new Mask(id,cfg);
		}
	}

	// ATTR Example
	Mask.ATTRS = {
		id:{
			value: 'J-Simple-Mask'
		},
		zIndex:{
			value: 999
		},
		opacity:{
			value: 0.6
		},
		fade:{
			value: true
		},
		duration:{
			value: 0.3 
		}
	},

	S.extend(Mask, S.Base, {

		init: function() {
			// your code here
			var that = this;
			that.id = that.get('id');
			that.zIndex = that.get('zIndex');
			that.opacity = that.get('opacity');
			that.fade = that.get('fade');
			that.duration = that.get('duration');
		},
		addMask:function(){
			var that = this;
			if(S.one("#"+that.id)){
				return this;
			}
			var node = S.Node('<div id="'+that.id+'"></div>');
			node.css({
				display:'none',
				'z-index':that.zIndex,
				'background-color':'black',
				left:0,
				position:'fixed',
				top:0,
				width:S.DOM.viewportWidth() + 'px',
				opacity:that.fade ? 0 : that.opacity,
				height:S.DOM.viewportHeight() + 'px'
			});
			S.one('body').append(node);
			if(that.fade){
				node.css('display','block');
				S.Anim(node,{
					opacity:that.opacity	
				},that.duration,'none',function(){
					that.fire('maskReady');
				}).run();
			} else {
				node.css('display','block');
				that.fire('maskReady');
			}
			node.on('touchmove',function(e){
				e.halt();	
			});
			return this;
		},
		removeMask:function(){
			var that = this;
			var node = S.one('#'+that.id);
			if(!node){
				return false;
			}
			if(that.fade){
				S.Anim(node,{
					opacity:0
				},that.duration,'none',function(){
					node.remove();
					that.fire('maskRemoved');
				}).run();
			} else {
				S.one('#'+that.id).remove();
				that.fire('maskRemoved');
			}
			return this;
		},
		masked:function(){
			var that = this;
			if(S.one('#'+that.id)){
				return true;
			} else {
				return false;
			}
		},
		destory: function(){

		}
	});

	return Mask;

}, {
	requires: ['base','node']
});
