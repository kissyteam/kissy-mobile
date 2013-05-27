![](http://img04.taobaocdn.com/tps/i4/T1IuoMXgNaXXaZVCTS-300-100.png)

> Kissy Mobile App Toolkit 是一款实现web页面应用化的框架，可以快速完成"应用化"的web页面搭建
> 除了专场动画的AppFramework之外，1.2版还提供一套SDK规范，用以将你的页面运行于Native环境

扩展阅读：<https://speakerdeck.com/lijing00333/kissy-mobile>

- Version 1.2
- Author 拔赤
- Update 2013-05-15
- [Demo with SDK](mobile/app/1.2/demo/sdk/demo.html)，[Source](https://github.com/kissyteam/kissy-mobile/tree/master/mobile/app/1.2/demo/sdk)
- [Demo](mobile/app/1.2/demo/simple/mb.html)
- [1.0版文档](http://mobile.kissyui.com/markdown.php?mobile/app/1.0/index.md)

<hr class="smooth large" />

## 使用场景

多页应用实现原理，[参照1.0版文档](http://mobile.kissyui.com/markdown.php?mobile/app/1.0/index.md)。

页面之间的切换是通过监听hashchange来实现的，如果冠以sdk，则监听通过sdk完成，Mobile App Toolkit不监听。最终触发跳转行为都是通过函数调用来完成。

单个页面是一个独立的html片段，包含普通页面应当包含的所有特征，页面中的富应用交由页面开发者负责，包括模板、样式、初始化等。

View的行为：

![](http://img02.taobaocdn.com/tps/i2/T1P7wFXXBeXXba_uLI-504-409.png)


### 框架初始化

页面样式需要自行引入，页面正文都需要添加HTML代码：

	<section id="MS"><!--控件所在的容器-->
		<div class="MS-con"><!--页面内容所在的包裹器-->
			<div class="MS-pal"><!--第一个页面默认所在的面板容器-->
				<!-- 这里的内容可以自定义，通常为loading -->
				loading...
				<!--/-->
			</div>
		</div>
	</section>

全局 CSS 样式示例：

	#MS {
		/* 占视口100%宽度 */
		position:relative;
		width:100%;
	}
	#MS-nav {
		display:none; /*默认隐藏Slide控件中的触碰点*/
	}
	.MS-con {
		position:relative;
	}
	.MS-pal {
		float:left;
		position:relative;
		/* 建议加上这一句，优化移动设备中的动画性能 */
		-webkit-backface-visibility:hidden;
	}

JavaScript:

	KISSY.use('mobile/app/1.2/',function(S,AppFramework){

		"use strict";

		var app = AppFramework({
			viewpath:'a.html', // 默认加载的页面地址
			forcereload:true, //划过的页面均销毁
			fullrangewidth:false,//不要程序指定浏览器视口宽度
			pagecache:true, //加载过的页面是否要缓存
			webkitoptimize:true //是否在webkit中开启硬件加速
			//...
		});

	});

### 节点（WebView）的构造和析构

在页面加载和销毁的全过程中，供包含五个事件，由于每个页面可能会被多次构造，开发者需要按照下文规范使用这五个方法。

<table class="table table-bordered">
<tr style="font-weight:bold;">
	<td>
		事件
	</td>
	<td>
		名称
	</td>
	<td>说明</td>
</tr>
<tr>
	<td>
		划入视口（前）
	</td>
	<td>
		startup
	</td>
	<td>
		只要某个页面划入视口都会触发，是划入时（页面加载完，执行专场动画之前）的初始化操作
	</td>
</tr>
<tr>
	<td>
		划入视口（后）
	</td>
	<td>
		ready
	</td>
	<td>
		只要某个页面划入视口都会触发，是划入时（页面加载完，执行专场动画之后）的初始化操作
	</td>
</tr>
<tr>
	<td>
		划出视口
	</td>
	<td>
		teardown
	</td>
	<td>
		只要某个页面划出视口都会被触发，是划出时的清理操作
	</td>
</tr>
<tr>
	<td>
		页面初始化
	</td>
	<td>
		includeOnce
	</td>
	<td>
		只有在页面首次构建时被触发的初始化，即使中途被销毁了，再次load该页面也不会再次执行，一个页面只能有一个
	</td>
</tr>
<tr>
	<td>
		页面被销毁
	</td>
	<td>
		destroy
	</td>
	<td>
		只有在页面被销毁时被触发，页面当移出视口而没有被销毁时，不会触发他，一个页面只能有一个
	</td>
</tr>
</table>

样例：

	<script src="kissy.js" /><!--kissy 种子文件-->
	<script src="sdk/h4.js" /><!--sdk文件（单页面）-->
	...
	<script>
		KISSY.use('mobile/app/1.2/',function(S,AppFramework){

			// 页面加载时执行
			AppFramework.startup(function(){
				alert('hello kissy mobile');
			});

			// 退出页面时执行
			AppFramework.teardown(function(){
				alert('goodbye kissy mobile');	
			});
			
		});
	</script>

加载时这几个事件的执行顺序：

includeOnce -> startup -> ready

退出时的执行顺序：

teardown -> destroy

### 节点重复问题

因为每个页面如果可能出现重复的情况，则不推荐使用`id`选择器。

这种场景只有在给AppFramework配置了`forcereload:false`时才有可能出现，即当Mobile App Toolkit被配置为只保留当前视口内的页面，视口范围外的页面均被销毁时，此外是不需要考虑这种场景的。

### 页面的缓存

页面默认是以异步形式加载进来的，加载过的页面可以缓存在本地，二次划入时不需重新加载，给AppFramework配置参数`pagecache:true`即可，该参数默认为`false`。

### 兼容性

整套历史记录管理机制依赖HTML5的History特性，因此整套机制不支持IE8及以下版本，在Android 4.2 及以下版本中由于不支持H5的History，因此采用了简化的实现，即只处理了单层的前进后退。如果需要夸级别后退，需要自行管理app.MS.AndroidHis对象，改对象记录当前状态下曾经访问过的页面，只要回退到访问过的页面，都认为是从左侧划入视口。

比如：有这样的访问路径，`a->b->c<-a`后，节点为`a->b->a`，这时需要手动清空`AppFramework.AndroidHis = {}`。Android 4.2 以下的后退时scrollTop复原的操作，需要开发者自行添加（框架不知道是否是后退还是人为）。

<hr class="smooth large" />

## Mobile App Toolkit 使用方法

### 单页场景和多页场景在网页内容上的交集

单页面中的一段内容会被AppFramework拿出来解析，注释过滤方法为：

![](http://img01.taobaocdn.com/tps/i1/T11co5XlRfXXaUhmbj-178-97.jpg)

中间的这段片段会被插入到框架HTML代码的`<div class="MS-pal" />`中。

<hr class="smooth" />

### 上下文

	KISSY.use('mobile/app/1.2/',function(S,AppFramework){

		// 上下文1

		AppFramework.startup(function(data){
			var app = this;

			app.forward();
			app.back();
			app...

			// 上下文2
		});

		AppFramework.teardown(function(){
			// 上下文2
		});

		AppFramework.includeOnce(function(){
			// 上下文2
		});

		AppFramework.destroy(function(){
			// 上下文2
		});
	});

上下文1为KISSY默认上下文，AppFramework为当前框架（app）的构造函数。

上下文2为当前框架的实例（App）（注意，不是页面）。上下文2中常用的方法为：

- app.get('page') // 得到当前页面的DOM根节点
- app.get('viewpath') // 得到当前页面对应的url片段，相当于页面的key
- app.get('stroage') // 得到当前页面的本地数据仓库，只在框架所在的生命周期内有效，不会写入本地存储，用于存取本地私有变量，比如`app.get('storage').get('mydate')`或`app.get('storage').set('mydate',{...})`

### Hash规则

hash中只有一个参数`viewpath`指定当前视口所位于的页面相对路径。比如`viewpath=a.html`。如果直接通过url首次装载进来页面，页面会读取url中的hash里的`viewpath`参数，从参数值指定的路径加载初始数据，如果hash中没有此参数，会从框架页面的配置项中读取，若都没有指定，则默认加载`index.html`。

### 跳转行为的触发

App Toolkit提供两种触发页面跳转的方法，一类是通过监听`hashchange`，即只要hash有修改，KDK就会去hash中寻找新的`viewpath`参数，异步加载并处理滑动方向。因此`history.back()`是可以触发hashchange的，进而可以触发页面的跳转。

第二种触发页面跳转的方法是通过方法调用，有两个方法可以调用，`App.back()`和`App.forward()`，可以传参，传入的参数在目标页面的`startup`函数回调中可以拿到，给出要跳转的地址，两个方法分别是划出动作和划入动作。

<hr class="smooth" />

## Mobile App Toolkit API

App Toolkit提供一个全局构造函数`AppFramework`，类似`YUI`，用来生成app实例，理论上一个应用有一个app实例，`AppFramework`挂有一些全局静态方法，整个浏览器生命周期内，只能构造一次，`var app = new AppFramework({});`。`app`实例可以通过`AppFramework.APP`来引用到，如果多次创建app实例，则AppFramework.APP会被覆盖。`app`实例提供事件，但事件注册机制只是用方法来完成（比如AppFramework.destroy(callback)）。因为页面页面之间的关系理论上是平行的，原则上，一个页面无法知晓其他页面的存在，因此一个页面中的逻辑不能“主动”绑定其他页面的事件，只能绑定本页的事件，本页的事件为了避免多次绑定带来的代码冲突，只提供了通过方法来注册事件，而非app.on('eventType')的形式。

### 全局静态方法

这五个全局静态方法类似于事件绑定，回调函数执行的上下文均为当前`AppFramework`的实例对象。这些事件由于是“页面”具有的，因此和`onload`和`domready`一样，无法被阻止。

*ready(callback)*

页面划入视口时执行callback，执行时机为转场动画完毕后。

*includeOnce(callback)*

callback 为回调函数，注册当前页面中的`includeOnce`事件的句柄，句柄将会把整个`app`实例作为参数传回。只会在页面首次构建的时候执行回调，再次构建时不会执行回调。一个页面这个方法只能被注册一次。

*destroy(callback)*

callback 为回调函数，注册当前页面中的`destroy`事件的句柄，句柄会将整个`app`实例作为参数传回。只要本页被销毁，都会调用这个函数，执行时机为beforeDestroy。一个页面这个方法只能被注册一次。

*startup(callback)*

页面划入视口时执行回调，它会将从别的页面带入的参数当作回调函数的参数传入。只要页面划入视口，不管是从左还是从右，都会执行这个回调。一个页面这个方法只能被注册一次。

	AppFramework.startup(function(data){
		if(data){
			// YourApp.init(data);
		}
	});

*teardown(callback)*

页面划出视口时执行回调，划出回调先于下一个页面的划入回调而执行，如果划出后页面被销毁，先执行划出回调，再执行销毁回调。一个页面这个方法只能被注册一次。

<hr class="smooth" />

### 配置参数

构建`app`（`var app = AppFramework({})`）实例的时候可以传入一些配置参数，这些参数包括：

*viewpath* (String)

如果url中hash参数里不带viewpath，将默认取这里的配置，如果不写此配置，默认值为`index.html`

*forceReload* (Boolean)

切换时，不论前进后退，都进行重新加载，即只保持视口范围内的一个页面存在于浏览器中，默认为true，如果配置为false，则后退出去的页面，也会保留在浏览器里。

> forceReload 和下面提到的 pageCache 的区别：forceReload 指的是加载过的页面划出视口时是否被销毁，用来决定当前视口中是否同时存在多个页面，哪怕页面被隐藏起来。pageCache 指的是加载过的页面是否缓存到本地，再次加载时从缓存中取，而非重新从服务器拉取。

*page* (Object)

不需要在初始化时传入，用来获得当前视口总的页面容器的Node节点。

*anim* (Boolean)

是否开启动画，true为开启，false为不开启，默认为开启

*basepath* (String)

Ajax取各自页面时的根路径，如果不传，和框架所在的目录路径保持一致，当框架页面和Ajax页面的跟路径不在同一个路径下是需要配置此参数。

*signet* (Object)

不需要在初始化时传入，用来记录当前访问过的记录镜像。

*fullRangeWidth* (Function|Boolean)

用来获取切换视口的宽度，如果不设置，则默认取浏览器视口宽度，为false时不取宽度，切换视口宽度始终不变。如果传入函数，则需要返回一个数字。

*webkitOptimize* (Boolean)

是否开启Webkit中的动画硬件加速，默认为true，如果设置为false，则所有的动画均采用JavaScript而非CSS3来完成。

*pageCache* (Boolean)

加载过的page是否保存在缓存中，以便再次载入时不需要重新下载，默认为false

*positionMemory* (Boolean)

加载过的页面，回退时是否定位到之前加载的位置，默认为true，这时要注意如果页面有很多动态加载的内容时，可能需要额外的手动操作来作定位。

*animWrapperAutoHeightSetting* (Boolean)

页面切换过程中，是否总是以目标页面的高度尺寸为基准进行切换，默认为true，即从一个很长的页面中间某位置进入到另一个很短的页面时，默认为首先调整切换视口高度为目标页面高度（这时往往伴随着scrollTop的变化，因而会有闪屏），再做切换。而要实现无scrollTop变化的切换，则需要动态监听页面高度定时器，会有性能损耗，因此，此属性请酌情使用，考虑到体验，建议设置为false，考虑到性能，建议设置为true。

*tapTrigger* (String)

触发点击发生跳转的选择器，默认为'a'，跳转链接依然写在href属性中

*initPostData* (Object)

如果首页加载方式为post，则需要通过此属性将数据对象传入，这些数据只应用于首页

*containerHeighTimmer* (Boolean)

如果页面固定高度，或者页面高度是我自己来计算，而不需要框架来自适应，此项设为false，此项默认为true。

*hideURIbar*

在App的模式中比较常用，动画结束后是否隐藏地址栏，这时页面的高度需要页面开发者自行控制

<hr class="smooth" />

### 实例方法

这里列出了AppFramework实例的方法，如果引入了SDK，可以直接调用`App.dosth()`，如果没有引入SDK，可以这样调用：

	AppFramework.startup(function(){
		var App = this;
		App.dosth();
	});

方法列表：

*error()* （未实现）

外部页面加载失败时调用，给出提示

*loading()*

无参数，显示loading画面

*closeLoading()*

无参数，关闭loading画面

*postback(o)*

通过post方式将数据传回到某个页面，页面总是从新加载，path属性若留空，则返回到上一页，历史记录为进入状态

	app.postback({
		path:'mb/b.html',
		data:{
			a:1,
			b:2
		}
	});

或

	app.postback({
		data:{
			a:1,
			b:2
		}
	});

*postforward(o)*

通过post方式进入到某个页面，带入数据，使用方法同上

*back(path,param,callback)*

从左侧加载页面，如果不传path，则相当于执行`history.back()`，可以省略path直接传入callback，callback回调参数和上下文均为app实例，即

	app.back(function(app){
		// this 上下文也是app
		alert(this.get('viewpath'));// 执行back()完毕后显示当前viewpath	
	});

如果传入path，则历史记录会加一。可以有如下传参方式

	back(path)
	back(path,callback)
	back(path,param)
	back(param)
	back(path,param,callback)

back如果涉及到新页面的加载，则以get方式载入

*forward(path,callback)*

从右侧加载页面，必须传入path，callback可以省略，callback用法同上，可以有如下传参方式

	forward(path)
	forward(path,callback)
	forward(path,param)
	forward(path,param,callback)

使用方法同上，加载新页面以get方式

*isSinglePage()*

返回当前场景是否是单页面场景

*isMultiplePage()*

返回当前场景是否是多页面场景

<hr class="smooth" />

### 跳转触发器标签的写法

实例化AppFramework时，传入默认监听tapTrigger时，会监听全局的a标签，当点击a标签的时候，发生跳转。a标签属性的写法有三种。

*第一种*，普通的链接跳转，其中`data-param`给出了回写到hash里的参数

	<a href="b.html" data-param="a=1&b=2&c=3">跳转</a>

*第二种*，无链接跳转

	<a href="javascript:void(0);">这个链接不会被监听到</a>

*第三种*，打开新页面或页面刷新

	<a href="url" target="top">这个链接会刷新页面</a>
	<a href="url" target="_blank">这个链接会打开新页面</a>

只要a标签里定义了`target`属性，都不会使这个链接被监听到。

<hr class="smooth large" />

## SDK

- What：SDK 是对AppFramework的封装，提供一些典型的方法调用，实现了更加通用的view。这种view被设计运行于三种典型场景
- How：[sdk-h5.js](http://a.tbcdn.cn/s/kissy/mobile/sdk-h5/1.0/index.js)，[sdk-h4.js](http://a.tbcdn.cn/s/kissy/mobile/sdk-h4/1.0/index.js)
- Why：让H5页面在不修改和少修改情况下，就可以运行于浏览器和Native环境中。

三种典型的场景：

- 单页面，运行于浏览器环境，可以是iphone和android里的浏览器，类似传统的wap页
- 单页面，运行于App Native的 WebView内，Native带动转场动画
- 多页面，运行于iPhone中safari里，由浏览器本身驱动转场动画，运行于ios环境。**多页面的实现原理参照[文档1.0版](http://mobile.kissyui.com/markdown.php?mobile/app/1.0/index.md)**

三个概念：框架（AppFramework）/页面（WebView）/SDK（Host）

- 框架（AppFramework）：单框架下辖多页面，用来管理多页面的前进和后退
- 页面（WebView）：一个页面单元，承载页面的内容
- SDK（Host）：SDK提供一些标准方法，供JS调用，根据不同的场景和硬件环境，将这次调用转发至具体的实现


带有SDK的页面跳转，例如：跳转链接写成：

	<a href="b.html">进入到B页面</a>

进入B页面时，会自动带上`?client_type=xx&client_nav=xx`。

自然会退始终是`history.back()`。在SDK中实现为`Host.back();`。

<hr class="smooth" />

### SDK 和 AppFramework 的关系

AppFramework（框架部分）可以独立运行在多页面场景中，SDK 是为了实现另外两种场景的兼容，因此SDK中包含了对AppFramework的初始化。统一对外提供两个全局对象：

- *App*：AppFramework（MS）的实例
- *Host*：SDK 中提供的工具集

如果引入了SDK，开发者默认知晓这两个已经存在的全局对象

![](http://img01.taobaocdn.com/tps/i1/T1SqGGXq8eXXbO8wws-533-386.png)

### SDK 中约定的导航条的行为

- 回退，显示与不显示
- title，标题，文本
- 右侧操作区，点击触发回调

尺寸：

- 回退和右侧icon尺寸：原图尺寸 45x45，展现大小：23x23
- 导航条高度：44px

### 给带有SDK的页面传递指令

url中带有一些参数，来告知页面当前的运行环境，和是否带有导航，两个重要参数，形如

	url?client_type=ios&client_nav=false   （当前是ios App环境，页面本身不需显示导航，导航由Native提供）

*client_type*

当前环境类型，三个取值：ios、android、pc，不传值默认为pc

*client_nav*

页面是否需要带导航，两个取值：true，false，不传默认为true

注意：在多页面环境中，导航始终存在，但导航内容的提供，应当包含在页面中，而非框架里

### SDK 方法集

> SDK里包含了对AppFramework的初始化，引入了SDK之后，即引入了两个重要全局对象：`App`和`Host`。含义和用法参照下文api。

SDK引用地址：

`sdk-h4`

	http://a.tbcdn.cn/s/kissy/mobile/sdk-h4/1.0/index-min.js

`sdk-h5`

	http://a.tbcdn.cn/s/kissy/mobile/sdk-h5/1.0/index-min.js

用法：在单页面中需要引入`sdk-h4.js`，[参照代码](https://github.com/kissyteam/kissy-mobile/blob/master/mobile/app/1.2/demo/sdk/a.php)。在框架页首页中需要引入`sdk-h5.js`。[参照代码](https://github.com/kissyteam/kissy-mobile/blob/master/mobile/app/1.2/demo/sdk/mb.php)。

### SDK对A标签的监听

SDK提供了对普通链接（a标签）的事件监听，发生跳转时会带上当前状态`client_type=pc&client_nav=true`，a标签属性的写法有三种。

*第一种*，普通的链接跳转，其中`data-param`给出了回写到hash里的参数

	<a href="b.html" data-param="a=1&b=2&c=3">跳转</a>

*第二种*，无链接跳转

	<a href="javascript:void(0);">这个链接不会被监听到</a>

*第三种*，打开新页面或页面刷新

	<a href="url" target="top">这个链接会刷新页面</a>
	<a href="url" target="_blank">这个链接会打开新页面</a>

手动指定跳转的方向（不推荐使用，新页面应当总是“进入”）：

	<a href="" dir="back">回退</a>
	<a href="" dir="forward">前进</a>

只要a标签里定义了`target`属性，都不会使这个链接被监听到。

### SDK Api

SDK提供全局对象App和Host，App即AppFramework的实例，Host是SDK包含工具集的命名空间，Host包含这些方法：

*open(url)* 

执行`Host.open(url)`为打开（或切换至）新的view

*back(callback)*

回退

*set`_`browser`_`title(title)*

设置导航条或浏览器的title

*set`_`back(flag)*

设置是否显示导航条的回退按钮，flag为true或false

*set`_`icon(img,callback)*

设置导航条右上角的图标，以及点击图标的回调

*nav`_`exist()*

判断导航是否存在，也可以根据url中的参数判断

<hr class="smooth large" />

## Changelog

- MS.startup/ready/teardown 的沙箱特性
- view的autoHeight的bugfix
- 配合iscroll执行的代码
- SDK和AppFramework的解偶和分层
- SDK的设计与实现（第一版）

以上
