# 开发者指南

15分钟完成环境搭建。我们有一套主干代码，在<https://github.com/kissyteam/kissy-mobile>，用于同步文档和开放之用。另外有一个[github的group](https://github.com/kissymobileteam)，用以存放各自维护代码的主干，项目构建和发布依赖于这个group中的主干代码。如此，为kissy mobile提交并发布代码有两种选择，`单机一条龙`和`Hack瞎折腾`。第一次提交请从“单机一条龙”开始：

<hr class="smooth large" />

## 第一种路线：单机一条龙

### 概述

开发者需要做什么事情

- 弄一块地盘：创建组件的项目（占用你1%的时间）
- 种地：开发、维护、发布（占用你99%的时间）

在发布阶段需要将你的代码整理符合规范，使用工具（kissy gallery 组件build工具）来初始化目录结构和build（build后才能发布）。

关键节点：

![](http://img02.taobaocdn.com/tps/i2/T13OaIXC8bXXbPw9IG-542-321.png)

<hr class="smooth large" />

### 第一部分：创建属于你的组件项目

1，起好你的组件的名字，到你自己github中创建一个项目（以后的开发维护都基于这个库）

2，fork你的项目到<https://github.com/kissymobileteam>（若无权限，找拔赤，常胤，完颜，鬼道）

3，进入[kpm](https://github.com/kissymobileteam/kpm/issues)项目，创建一个issue（若无权限，找拔赤，常胤，完颜，鬼道），以[app](https://github.com/kissymobileteam/app)项目为例

将你的库的项目路径拷贝下来

![](http://img03.taobaocdn.com/tps/i3/T1na1uXApjXXc07tYt-569-209.jpg)

粘贴在刚新创建的issue正文里，issue标题随便添

![](http://img04.taobaocdn.com/tps/i4/T1gbyIXshdXXb8cewg-495-212.png)

4，将issue关联至kpm系统（kissy publish management）

进入<http://kpm.f2e.taobao.net>，密码问拔赤要，并保存到你的浏览器中

进入mobile选项卡，添加issue id和组件名称（比如app）

![](http://img04.taobaocdn.com/tps/i4/T1chSJXvFXXXXl6RH6-594-212.png)

完成

<hr class="smooth large" />

### 第二部分：使用工具来初始化项目

首先安装工具，依赖node和npm环境。

1，安装 kissy gallery 组件工具

	npm install yo grunt-cli -g
	npm install generator-kissy-gallery -g

若第一步报错，需要安装bower

	npm install -g yo grunt-cli bower

2，创建组件目录结构

将第一部分创建的git仓库（空）clone到本地，进入到组件跟目录中，执行

	yo kissy-gallery 1.0

过程中输入维护者姓名和邮箱，其中`yo kissy-gallery`为固定写法，`1.0`是你要开发组件的版本，生成好后的目录结构为：

	.
	├── app						组件名称，小写，中横线分隔
		├── node_modules/		本地所需的node模块
		├── .gitignore
		├── abc.json			组件描述信息
		├── Gruntfile.js		工具文件
		├── package.json		工具文件
		├── README.md			
	    └── 1.0					版本，两个数字表示 x.x
			├── build/			存放打包后的文件
			├── demo/			存放demo
			├── doc/			文档
			├── guide/
	        │   └── index.md 	文档首页	
	        ├── demo/			存放demo
	        │   └── index.html
	        ├── meta/			comboMap文件所在目录
	        ├── plugin/			组件的插件，可以没有
	        ├── spec/			测试用例
	        └── index.js		入口文件

完成

<hr class="smooth large" />

### 第三部分：组件的开发与调试

注意两点

- 调试页面代码需要带参数`url?ks-debug`
- 源js文件中add的时候都不写组件名称，build时会被补全，比如

		// app/1.0/index.js
		KISSY.add(function(){
			// your code	
		},{
			requires:['./slide']	
		});

<hr class="smooth large" />

### 第四部分：build和发布

1，build：在项目跟目录下执行：

	grunt

打包成功后，会在build目录下生成index.js和index-min.js。

2，将打包后的代码提交到你的git库里，并pull request到共用组项目(<https://github.com/kissygalleryteam>)中

![](http://img01.taobaocdn.com/tps/i1/T1wJmIXv4bXXacm02t-569-213.png)

<del>3，进入[主项目](https://github.com/kissymobileteam)中（若无权限，通知拔赤/常胤/完颜操作），merge代码</del>，可忽略

4，进入[kpm](http://kpm.f2e.taobao.net)，发布你的项目代码

完成

<hr class="smooth large" />

### 第五部分：文档同步到服务器

开发者可忽略

将你的项目添加为[kissymobile主干代码](https://github.com/kissyteam/kissy-mobile)的子项目

	git submodule add 目标项目路径

文档自动同步，每天一次

<http://mobile.kissyui.com/#mobile/startup/components.html>

文档地址访问：通过 `http://mobile.kissyui.com/markdown.php?你的文件路径`来访问

<hr class="smooth large" />

**如果你的组件依赖了第三方的库，请参照[首页的第三方库](http://mobile.kissyui.com)列表，通过KISSY依赖载入**

<img src="http://img03.taobaocdn.com/tps/i3/T1KbGFXvlbXXcJX92I-400-400.gif" width=300 height=300 />

----------------------完成任务分割线------------------------

如果你还想继续折腾，继续往下阅读

## 第二条路线：瞎折腾

### 准备权限

- 源码提交权限，联系承玉/拔赤，加入项目组
- 代码发布权限，申请`http://svn.taobao-develop.com/repos/assets/trunk/assets/s/kissy/`的写权限，提交晨宣审批

### 准备环境

- 安装发布工具（只提交源码，忽略此步）：<http://gitlab.alibaba-inc.com/jay.li/clam-tools/tree/master>
- markdown文档生成工具

通过npm安装

	npm install -g marked

将 kissy-tools 和 kissy-mobile 并列checkout

	git clone git@github.com:kissyteam/kissy-mobile.git
	git clone git@github.com:kissyteam/kissy-tools.git

`kissy-mobile`为项目目录

### 项目目录

源码目录：

mobile根目录下提交各自的组件，以目录形式存放，例子：

	.
	├── app						组件名称，小写，中横线分隔
	    └── 1.0					版本，两个数字表示 x.x
	        ├── build.xml		构建脚本，直接从yours/1.0/下拷贝至此
			├── assets/			存放组件依赖的css
	        ├── demo/			存放demo
	        │   ├── demo1 
	        │   │   └── a.html
	        │   └── demo2
	        │       ├── a.html
	        │       └── b.html
	        ├── index.js		入口文件
	        ├── slide.js		组件代码
	        ├── util.js			组件代码
	        ├── ...				其他组件代码
	        ├── index.md		api文档，markdown格式
	        └── index.md.html	在当前目录执行ant doc，将md文件生成html

CDN上的目录说明：

	.
	├── app
	    └── 1.0
			├── assets/			皮肤文件
			├── index.js		打包后的文件
			└── index-min.js	打包后的文件压缩版本



### 构建和发布

一，**构建方法**

以上一个目录样板为例，在`1.0`目录下执行`ant`，会在`mobile-build/mobile/`下生成对应的构建完成的文件

二，**发布操作**

1. 在项目根目录下执行`install.sh`，将生成一个`svn`目录
2. 进入到组件版本目录中，执行`ant pub`，来发布构建完成的文件

三，**书写文档**

文档以`md`为后缀，markdown格式，写好后，在版本目录下执行`ant doc`，生成对应的html。

访问方式：`/index.html#path-to-markdown-html`

代码库由主干合并到分支`gh-pages`后，每晚11点自动更新到服务器上

### Demo开发

开发demo时，需要指定mobile的配置

	<script>
	KISSY.config({
		packages:[
			{
				name:"mobile",
				tag:"20111220",
				path:"../../../",  // 开发时目录, 发布到cdn上需要适当修改
				charset:"utf-8"
			}
		]
	});
	</script>

添加模块：

	KISSY.add('mobile/app/1.0/',function(S){
		// 逻辑代码
	},{
		requires:['node','event']	
	});

使用模块：

	KISSY.use('mobile/app/1.0/',function(S,APP){
		// 逻辑代码
	});

### 注意事项

- 打包规则：统一使用ant脚本来打包，不要手动拷贝
- 所有代码依赖kissy1.3.0
- 你的目录结构参照`mobile/yours/1.0/`中的写法
- 修改组件时，增加changelog，升级时，要注明升级点


