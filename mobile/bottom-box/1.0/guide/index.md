## Bottom Box

- by 拔赤

[Demo](/direct.php?type=demo&name=bottom-box)

底部划出的容器，带有背景蒙层

### 调用

	KISSY.use('mobile/bottom-box/1.0/',function(S,Bottombox){
		var bb = Bottombox({
			container:'.my-test1',// 可以在初始化时就指定box的内容容器，可留空
			className:'test' // 内容包装器的className，可留空
		});

		// var bb = new Bottombox(); //可以通过new来构造

		bb.show(); // 显示
		bb.hide(); // 隐藏

	});

### 用法：给构造器指定内容容器

box内容容器（container）由开发者写到页面中，作为参数传入BottomBox构造器或者show(container)函数

	var bb = new Bottombox({
		container:'.my-test1'
	});

	bb.show();

### 用法：临时指定内容容器

box内容容器（container）可以作为临时参数传入show函数中

	var bb = new Bottombox();

	bb.show('.my-test1');

### 构造参数

*container*:内容容器，由开发者写在页面中，默认为null，可留空

*zIndex*:指定弹出层的z-index，默认为1000

*duration*:划出的过渡时间，默认0.5

*className*:内容包装器的className，可留空

*modalOpacity*:蒙层的透明度

### 方法

*hide()*:隐藏bottombox

*show(container)*:显示bottombox，可以传入要显示的内容容器container，可以留空，若留空，取上一次显示的容器或者构造时定义的容器

*isShow()*:判断当前bottombox是否是显示状态。

### 事件

下面这两个事件都不能被阻止

*boxShow*:bottombox显示完毕

*boxHide*:bottombox隐藏完成
