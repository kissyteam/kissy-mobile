
## 无限滚动控件

- by 栋寒

依赖iscroll的无限滚动列表控件

[Demo](http://mobile.kissyui.com/mobile/no-limit-scroll/1.0/demo/)

### 用法

	KISSY.use('mobile/no-limit-scroll/1.0/' , function(S , nlScroll) {

		var myscroll = new nlScroll({
			threshold: 5,
			initWrapHeight: function() {
				window.scrollTo(0 , 1);
				return window.innerHeight - 40 + 'px';
			},
			getMoreInfo: function(index) {
				// this 指向当前实例对象
				var self = this;
				S.io.get('moreinfo.php?page='+index , function(data) {
					self.addContent(data);

					// 恢复加载更多区域 的初始状态 (必须)
					self.resetLoad();
				});

			}
		});
	});

### 说明

*new nlScroll(config)*

config为配置参数，需要传入这几个值

- threshold，(number)，默认为3，当scroll内部视图（最小显示单元）超过threshold时，则会触发优化操作，相反的，小于threshold时则不会做任何处理
- initWrapHeight，(function)，初始化高度，无回调参数
- getMoreInfo，（function），获得更多信息的方法，回调参数为调用接口的次数

无暴露事件和方法

### threshold 参数说明

无线滚动为了防止dom数量快速累加，对于不在视口内的节点均清空，因此如果内容直接绑定了事件，有可能被清除，如果有事件绑定，建议采用事件委托
