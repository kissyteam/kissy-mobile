# 参与开发

## 准备权限

- 源码提交权限，联系承玉/拔赤，加入项目组
- 代码发布权限，申请`http://svn.taobao-develop.com/repos/assets/trunk/assets/s/kissy/`的写权限，提交晨宣审批

## 准备环境

- 安装发布工具（只提交源码，忽略此步）：<http://gitlab.alibaba-inc.com/jay.li/clam-tools/tree/master>
- markdown文档生成工具

通过npm安装
	
	npm install -g marked

将 kissy-tools 和 kissy-mobile 并列checkout

	git clone git@github.com:kissyteam/kissy-mobile.git
	git clone git@github.com:kissyteam/kissy-tools.git

`kissy-mobile`为项目目录

## 项目目录

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



## 构建和发布

一，**构建方法**

以上一个目录样板为例，在`1.0`目录下执行`ant`，会在`mobile-build/mobile/`下生成对应的构建完成的文件

二，**发布操作**

1. 在项目根目录下执行`install.sh`，将生成一个`svn`目录
2. 进入到组件版本目录中，执行`ant pub`，来发布构建完成的文件

三，**书写文档**

文档以`md`为后缀，markdown格式，写好后，在版本目录下执行`ant doc`，生成对应的html。

访问方式：`/index.html#path-to-markdown-html`

代码库由主干合并到分支`gh-pages`后，每晚11点自动更新到服务器上

## Demo开发

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

## 注意事项

- 打包规则：统一使用ant脚本来打包，不要手动拷贝
- 所有代码依赖kissy1.3.0
- 你的目录结构参照`mobile/yours/1.0/`中的写法
- 修改组件时，增加changelog，升级时，要注明升级点


