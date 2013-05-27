## Simple-Mask

- by 拔赤

简单蒙层，显示蒙层时，阻止手指滑动事件

[Demo](http://mobile.kissyui.com/mobile/simple-mask/1.0/demo/)

### 调用：

	KISSY.use('mobile/simple-mask/1.0/',function(S,Mask){
		var m = Mask({
			zIndex:999,
			opacity:0.9
		});

		m.addMask();// 显示蒙层
		m.removeMask();// 隐藏蒙层
		
	});


### 构造参数

- *zIndex*:蒙层的z-index，默认为999
- *opacity*:蒙层透明度，默认为0.6
- *id*:蒙层id，默认为`J-Simple-Mask`
- *fade*:是否带有渐变，默认为true
- *duration*:带有渐变时，渐变速度，默认0.3秒

### 方法

- *addMask()* 显示蒙层
- *removeMask()* 删除蒙层
- *masked()* 是否当前已经显示蒙层

### 事件

- *maskReady*，蒙层显示完毕
- *maskRemoved*，蒙层被删除

