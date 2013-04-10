![](http://img04.taobaocdn.com/tps/i4/T1IuoMXgNaXXaZVCTS-300-100.png)

> KISSY Mobile App Develop Toolkit（简称*KDK*）是[MSlide](https://github.com/zhenn/mslide)的增强版，是整个 KISSY<sup>Mobile</sup> 项目的根基。它给出了一套网页应用化的基本思路和开发实践，配备有多种典型的API，基于此可以快速完成_“应用化”_的web页面的架设，如果你希望让你的产品有OPOA一样的体验，你真的需要尝试一下。
> 初次使用该控件，请完整阅读本篇文档。下文将本控件简称为KDK。

- Version 1.0
- Author 拔赤
- Update 2012-12-24
- [Demo](mobile/app/1.0/demo/simple/mb.html#viewpath=mb/a.html)

<hr class="smooth large" />

## 基本需求

如何能基于Web Page做到类似原生移动设备App一样的体验呢？HTML5？CSS3？当然，是的，但远不够，除了新标签和更花哨的样式增强之外，还需要一套机制来管理页面切换行为，包括切换特效、多页面的管理、多页面的业务逻辑依赖关系等。这套机制实际上在一个页面中完成，整体交互模式和原生应用那种“划入”和“划出”完全一致。换句话说，我需要自行实现一套页面中的*浏览器*，管理上面提到的多页切换等功能。

对于交互模式来说，需求是：

- 进入操作（新页面从右侧划入）
- 退出操作（旧页面从左侧划入）
- 通过点击历史记录的前进后退，完成进入和退出的操作
- 跨页面退出（比如从很深的层级一次性退出到首页）
- 新页面对旧页面的修改（即新旧页面业务逻辑有耦合）
- 进入退出操作过程可以被录制（即可自动划入和划出，无须人工干预）

上述需求是从产品交互体验的角度来分析的，从开发者角度（一线前端工程师），需要了解KDK的这些需求特征：

- 快速将网页刷新的Wap站，切换为多页滑动的Wap应用，这种迁移应当容易理解并相对容易的做到
- KDK应当对URL规则做到侵入最小化（KDK目前无法做到对URL的无侵入）
- 工程师无需关注历史记录如何管理，只专心实现业务逻辑即可
- 多页面之间有逻辑耦合的情况，除了可以自行解决JS数据的多页共享，推荐使用KDK提供的API
- 页面的创建和销毁有多种状态，页面具有初始化和销毁两种互斥行为
- KDK提供API来解决页面多次显示和多次创建的问题

简言之，KDK考虑到了两种典型的应用场景，一是页面之间无耦合（只是纯粹的跳转），二是页面之间有耦合（下一帧的显示依赖于上一帧的操作结果）。KDK提供两种典型的交互：“进入”和“退出”。

<hr class="smooth large" />

## 实现原理

### 基本的交互模式

划入和划出无非是切换上一帧和下一帧。只是切换操作是由KDK更新URL（的hash）来触发，由KDK对hashchange的监听来完成切换操作。因此，KDK默认监听了页面中的所有`a`标签，`a`标签的`href`属性是要进入到的页面，比如：

	<a href="b.html">进入到B页面</a>

我们定义，所有`a`标签上的点击都是“进入”操作，即页面从右侧划入视口。也就是说，自然状态下，用户在页面（正文）中的操作都应当是“进入”，只有`history.back()`或点击页面导航的“后退”（大部分场景下也是调用`history.back()`）才会发生退出操作，即上一个页面从左侧划入。

![](http://img02.taobaocdn.com/tps/i2/T1P7wFXXBeXXba_uLI-504-409.png)

每个页面包含自己的HTML代码和JS代码，每次进入都会重新创建，因此JS代码可能会被多次执行，下文还会提到，KDK提供了四个基础方法来解决多次执行的问题。

<hr class="smooth" />

### 多页切换过程

KDK只关注页面与页面之间的调用关系，而不会关注层次关系，比如，从一个很深的目录层级可以跳级后退到根。因此，KDK管理的数据结构是一个链表，每个节点是一个页面，如图，从根（第一个页面）开始的访问过程可能是如下可能，每个叶子节点都是一种滑动过程的可能性，视口在节点树上移动，方向有左右两种，视口默认停留的节点始终保持链表的最后一个节点，之前的节点可以选择保留（层级少时可以避免后退时重新载入页面，提高速度），也可以选择不保留（防止层级过多带来DOM节点太多，导致动画性能下降）。

![](http://img03.taobaocdn.com/tps/i3/T1Z5IFXj0eXXXohXnQ-373-243.png)

现在描述一下某一时刻真实的页面状态和滑动路径的关系：

如果视口滑动到上图中的叶子节点，我们定义视口向左划为减法，向右划为加法，则路径分别为：

- e: a+b+c-d-e
- f: a+b+c-d+f
- h: a+b+c+g+h

由于我们规定视口只能停留于最右侧的页面，因此，减法会消除掉上一个节点，即当前节点替换上一个节点。加法则为简单的累加，比如，视口移动到节点C时的页面状态：

![](http://img04.taobaocdn.com/tps/i4/T10.sFXfXeXXaQ1djY-376-318.png)

这时视口向左移动（从视口的角度来看，页面是从左侧进入，类似“划出效果”），发生一次减法，节点d替换了节点c，页面状态为：

![](http://img01.taobaocdn.com/tps/i1/T10uEGXg8cXXX92XTQ-373-319.png)

这时视口向右移动（从视口的角度看，页面是从右测进入，即“划入效果”），发生一次加法，累加上了节点f，页面状态为：

![](http://img02.taobaocdn.com/tps/i2/T1okZGXkXbXXcO4b6n-355-322.png)

到这里，是整个滑动过程的复现，要注意，这里每一次滑动操作（不管向左还是向右），历史记录都会增加，而历史记录保存了整个过程，因此`history.back()`将会是每次滑动的逆操作，比如从节点f执行`history.back()`时，视口应当从f向左滑动到上一个节点，即d节点，是从d进入到f节点的逆操作，即“划出”。这时会销毁被划出的节点f，页面状态为：

![](http://img04.taobaocdn.com/tps/i4/T1fbAGXlBcXXcBKEvf-349-311.png)

这时再次`history.back()`时，视口将会从d“进入”到节点c，也是从c“退出”到d的逆操作，这时KDK会监听到这是一次`history.back()`，会将d也同时删除，保留c，这一步操作是和之前的描述不一致的，即历史记录后退时发生的前进操作，被划出的节点也会销毁，尽管这看起来是一次“划入”动作

![](http://img01.taobaocdn.com/tps/i1/T1ZhoHXddaXXaSxEDf-349-321.png)

这时，通过历史记录的后退，视口停留在c节点时，页面状态和从根节点进入到c节点时的状态一样。这就保证了数据结构对历史记录的真实复现，保证了操作的完整性。

<hr class="smooth" />

### 节点的构造和析构

在整个过程中，页面切换行为会触发四个事件，由于每个页面可能会被多次构造，则其包含的JS代码也会被执行多次，为了控制JS执行的次数，这里提炼了四个事件，这四个事件以方法的形式给出。

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
		划入视口
	</td>
	<td>
		startup
	</td>
	<td>
		只要某个页面划入视口都会触发，是划入时的初始化操作
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
		只有在页面首次构建时被触发的初始化，即使中途被销毁了，再次load该页面也不会再次执行
	</td>
</tr>
<tr>
	<td>
		页面被销毁
	</td>
	<td>
		destory
	</td>
	<td>
		只有在页面被销毁时被触发，页面当移出视口而没有被销毁时，不会触发他
	</td>
</tr>
</table>

当页面划入视口时，页面中的代码也会被渲染，JS代码会被解析，但注册事件只在首次有效，比如，我在某个子页面中注册了startup和teardown函数，这里的注册操作只被执行了一次，页面离开视口再次划入视口时，不会被二次绑定。子页面JS代码：

	KISSY.use('mobile/app/1.0/',function(S,MS){

		"use strict";

		// 获取划入视口的时间
		var s = S.now();

		alert(s); // 每划入视口时都会执行这里的代码，s 都是不一样的

		// 注册事件
		MS.startup(function(){
			alert(s);
			// 每划入视口都会执行这里的代码
			// 这里的 s 永远是第一次注册事件时的时间
		});
		MS.teardown(function(){
			alert(s);
			// 每划出视口都会执行这里的代码
			// 这里的 s 永远是第一次注册事件时的时间
		});
	});

`includeOnce`和`destory`事件也是如此。

### 节点重复问题

由于KDK的机制规定了最终页面状态和滑动的树的路径有关系，和节点本身具有的语义和层次没有直接关系。因此，有可能会出现页面重复的问题，即同一时刻，存在两个相同的节点在整个浏览器声明周期内。比如从深目录层级的某个节点一节回退到首页时，会出现这种问题，如图，我从c节点执行“回退”操作到a节点，这里所指的“回退”操作是开发者赋予的语义，在整个KDK的历史记录管理机制中，仍然认为这是一次写历史记录的步骤，即这个“后退操作”导致历史记录加一。真正的问题在于，浏览器内同时存在了两个a节点。

![](http://img03.taobaocdn.com/tps/i3/T1TYQGXlxcXXbu1N2d-351-311.png)

因此，每个页面如果可能出现重复的情况，则不能使用`id`选择器。

这种场景只有在配置了`forcereload:false`时才有可能出现，即当KDK被配置为只保留当前视口内的页面，视口范围外的页面均被销毁时，是不需要考虑这种场景的。

### 页面的缓存

页面默认是以异步形式加载进来的，加载过的页面可以缓存在本地，二次划入时不需重新加载，配置参数`pagecache:true`即可，该参数默认为`false`。

### 兼容性

整套历史记录管理机制依赖HTML5的History特性，因此整套机制不支持IE8及以下版本，在Android 4.2 及以下版本中由于不支持H5的History，因此采用了简化的实现，即只处理了单层的前进后退。如果需要夸级别后退，需要自行管理app.MS.AndroidHis对象，改对象记录当前状态下曾经访问过的页面，只要回退到访问过的页面，都认为是从左侧划入视口。

比如：有这样的访问路径，`a->b->c<-a`后，节点为`a->b->a`，这时需要手动清空`MS.AndroidHis = {}`。Android 4.2 以下的后退时scrollTop复原的操作，需要开发者自行添加（框架不知道是否是后退还是人为）。

<hr class="smooth large" />

## KDK 使用方法

### 框架搭建

分为框架页面和内容页面，框架页面只负责对页面框架进行初始化和配置，框架页面是完整的html，需要引入kissy：

	<script type="text/javascript" src="http://a.tbcdn.cn/s/kissy/1.3.0/seed-min.js"></script>

KISSY提供的reset css也要随之引入：

	<link rel="stylesheet" href="http://a.tbcdn.cn/s/kissy/1.3.0/css/dpl/base.css" />

页面样式需要自行引入，页面正文需要添加框架代码：

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

配置Mobile App KDK，这段代码中给出了一些配置参数

	KISSY.use('mobile/app/1.0/',function(S,MS){

		"use strict";

		var app = MS({
			viewpath:'a.html', // 默认加载的页面地址
			forcereload:true, //划过的页面均销毁
			fullrangewidth:false,//不要程序指定浏览器视口宽度
			pagecache:true, //加载过的页面是否要缓存
			webkitoptimize:true //是否在webkit中开启硬件加速
		});

	});

<hr class="smooth" />

### 内容页面代码

内容页面是通过Ajax加载进来的，页面地址为相对路径，比如框架页面地址为

	http://url.com/index.html

则相对路径`a.html`就对应：

	http://url.com/a.html

这里的`a.html`的内容可以是一个html片段，也可以是完整的页面，KDK会截取一段内容进行解析：

![](http://img01.taobaocdn.com/tps/i1/T11co5XlRfXXaUhmbj-178-97.jpg)

这段片段会被插入到框架HTML代码的`<div class="MS-pal" />`中。比如这样一个页面代码：

	<header class="header">
		页面标题
	</header>

	<section class="mainbody">
		<div class="content">
			页面正文
		</div>
	</section>
	<script>
		KISSY.use('mobile/app/1.0/',function(S,MS){

			"use strict";

			MS.startup(function(data){
				var app = this;
				// 注册 startup
				// 如果从别的页面跳转过来带有参数，则回写在data中
				// this 为MS的实例，即app
			});

			MS.teardown(function(){
				// 注册 teardown
			});

			MS.includeOnce(function(){
				// 注册 includeOnce
			});

			MS.destory(function(){
				// 注册destory
			});
		});
	</script>

JS代码会被解析，但注册操作只会在首次解析这段代码时执行，即注册操作不会因为页面被多次渲染而被执行多次。

<hr class="smooth" />

### 上下文

	KISSY.use('mobile/app/1.0/',function(S,MS){

		// 上下文1

		MS.startup(function(data){
			var app = this;

			// 上下文2
		});

		MS.teardown(function(){
			// 上下文2
		});

		MS.includeOnce(function(){
			// 上下文2
		});

		MS.destory(function(){
			// 上下文2
		});
	});

上下文1为KISSY默认上下文，MS为当前框架（app）的构造函数。

上下文2为当前框架（app）的实例（注意，不是页面）。上下文2中常用的方法为：

- app.get('page') // 得到当前页面的DOM根节点
- app.get('viewpath') // 得到当前页面对应的url片段，相当于页面的key
- app.get('stroage') // 得到当前页面的本地数据仓库，只在框架所在的生命周期内有效，不会写入本地存储，用于存取本地私有变量，比如`app.get('storage').get('mydate')`或`app.get('storage').set('mydate',{...})`

<hr class="smooth" />

### Hash规则

页面的跳转会体现在浏览器的hashchange中，KDK使用`#a=b&c=d`的形式来管理hash中的参数，开发者在开发页面时，也应当遵照这种规则来读写hash。

hash中只有一个参数`viewpath`指定当前视口所位于的页面相对路径。比如`viewpath=a.html`。如果直接通过url首次装载进来页面，页面会读取url中的hash里的`viewpath`参数，从参数值指定的路径加载初始数据，如果hash中没有此参数，会从框架页面的配置项中读取，若都没有指定，则默认加载`index.html`。

<hr class="smooth" />

### 跳转行为的触发

KDK提供两种触发页面跳转的方法，一类是通过监听`hashchange`，即只要hash有修改，KDK就会去hash中寻找新的`viewpath`参数，异步加载并处理滑动方向。因此`history.back()`是可以触发hashchange的，进而可以触发页面的跳转。

第二种触发页面跳转的方法是通过方法调用，有两个方法可以调用，`back()`和`forward()`，可以传参，传入的参数在目标页面的`startup`函数回调中可以拿到，给出要跳转的地址，两个方法分别是划出动作和划入动作。

<hr class="smooth" />

### KDK构造函数

KDK通过KISSY.use形式引入进来，传回的对象即是构造函数，我们称为`MS`。构造函数实例化的结果是配置好的应用，我们称为`app`。构造函数可以使用new来创建（`new MS({})`），也可以直接用工厂方法创建`MS({})`。

	KISSY.use('mobile/app/1.0/',function(S,MS){
		
		/*
		*	MS 为KDK构造器，通过new MS()或MS()初始化实例
		*	整个页面只能有一个框架实例
		*/

		var app = MS();

		/*
		*	其中 
		*	MS.APP == app
		*	app.MS == MS
		*/

		/*
		*	app 对外暴露两个API
		*	app.back();
		*	app.forward();
		*/

		/*
		*	获得当前页面的根节点
		*	app.get('page')
		*/

	});

对于开发者来说，最常用的两个对象就是全局`MS`对象和app实例对象（`MS.APP`）。

<hr class="smooth large" />

## API

KDK提供一个全局构造函数`MS`，类似`YUI`，用来生成app实例，理论上一个应用有一个app实例，`MS`挂有一些全局静态方法，整个浏览器生命周期内，只能构造一次，`var app = new MS({});`。`app`实例可以通过`MS.APP`来引用到，如果多次创建app实例，则MS.APP会被覆盖。`app`实例提供事件，但事件注册机制只是用方法来完成（比如MS.destory(callback)）。因为页面页面之间的关系理论上是平行的，原则上，一个页面无法知晓其他页面的存在，因此一个页面中的逻辑不能“主动”绑定其他页面的事件，只能绑定本页的事件，本页的事件为了避免多次绑定带来的代码冲突，只提供了通过方法来注册事件，而非app.on('eventType')的形式。

<hr class="smooth" />

### 全局静态方法

这四个全局静态方法类似于事件绑定，回调函数执行的上下文均为当前`MS`的实例对象。这些事件由于是“页面”具有的，因此和`onload`和`domready`一样，无法被阻止。

*includeOnce(callback)*

callback 为回调函数，注册当前页面中的`includeOnce`事件的句柄，句柄将会把整个`app`实例作为参数传回。只会在页面首次构建的时候执行回调，再次构建时不会执行回调。一个页面这个方法只能被注册一次。

*destory(callback)*

callback 为回调函数，注册当前页面中的`destory`事件的句柄，句柄会将整个`app`实例作为参数传回。只要本页被销毁，都会调用这个函数，执行时机为beforeDestory。一个页面这个方法只能被注册一次。

*startup(callback)*

页面划入视口时执行回调，它会将从别的页面带入的参数当作回调函数的参数传入。只要页面划入视口，不管是从左还是从右，都会执行这个回调。一个页面这个方法只能被注册一次。

	MS.startup(function(data){
		if(data){
			// YourApp.init(data);
		}
	});

*teardown(callback)*

页面划出视口时执行回调，划出回调先于下一个页面的划入回调而执行，如果划出后页面被销毁，先执行划出回调，再执行销毁回调。一个页面这个方法只能被注册一次。

<hr class="smooth" />

### 配置参数

构建`app`（`var app = MS({})`）实例的时候可以传入一些配置参数，这些参数包括：

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

<hr class="smooth" />

### 实例方法

这里列出了MS实例的方法

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

<hr class="smooth" />

### 跳转触发器标签的写法

实例化MS时，传入默认监听tapTrigger时，会监听全局的a标签，当点击a标签的时候，发生跳转。a标签属性的写法有三种。

*第一种*，普通的链接跳转，其中`data-param`给出了回写到hash里的参数

	<a href="b.html" data-param="a=1&b=2&c=3">跳转</a>

*第二种*，无链接跳转

	<a href="javascript:void(0);">这个链接不会被监听到</a>

*第三种*，打开新页面或页面刷新

	<a href="url" target="top">这个链接会刷新页面</a>
	<a href="url" target="_blank">这个链接会打开新页面</a>

只要a标签里定义了`target`属性，都不会使这个链接被监听到。

<hr class="smooth large" />

## TODO

- <del>loading & closeLoading</del>
- <del>页面缓存</del>
- <del>四个全局静态事件的阻止</del>
- 在当前视图增加查找hash参数的方法：query
- Ajax Error 处理
- 前进后退到已经加载过的页面，垂直位置的恢复
- 专门面向应用的配置，即考虑浏览器不存在地址栏的情况
- currentpannel 改为 page
- 补全demo
- 向下滚动
