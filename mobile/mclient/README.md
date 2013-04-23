### 跨移动终端的客户端通用接口调用

##### 背景

Native2H5 是一套协议规范，用以定义H5页面和Native之间的相互调用的通用方法和行为，指导SDK的开发。目标是形成各个环境中的SDK。

SDK有至少四个版本，H5（多页）、H4（单页）、Android、iPhone。HMTL页面在各种环境中都可以运行

比如：我的HTML页面代码为：

	<html>
	<head>
		<script src="**-sdk.js" /><!--在Android和iPhone中的webview环境提供-->
	</head>
	<body>
		<a href="javascript:MC.open('url')">跳转</a>
	</body>
	</html>

各个环境中点击`a`标签的行为：

- 单页面（浏览器）中发生普通的页面跳转（刷新）
- Android/iphone中进行activity、webview创建，并执行专场动画
- H5框架（浏览器）中，执行专场动画加载新页面（无刷新）

##### 面向Android和iOS的JS调用原理

1. `Android` 通过桥（客户端暴露在WebView全局对象下的一个对象，内挂各种API方法）的方式进行调用，如`window['Android_Bridge']['method'](JSON)`。

2. `iOS`通过自定义`Scheme`（如`native://method?data=JSON`）方式调用。

3. 需要回调的接口需要将函数名称在调用时一并传给客户端，同时将回调函数通过唯一名称挂在全局，待客户端执行回调后移除该全局函数。
4. 客户端需要在WebView打开的URI后附着`&client_type`参数。

##### M_Client

`MClient` 是基于上述实现原理和调用方式约定的 `JavaScript` 通用方法封装，`MClient` 会根据客户端类型自动采用相应的调用方法。

##### 常见的API接口约定

###### a. 单VIEW操作

| 方法名                 |说明				 | 需要的参数名         |
| -----------------------|:------------------|:-------------------|
| open_system_browser    |用浏览器打开url 		|url                |
| client_appstore_call   |跳转到appstroe 		|url                |
| set_browser_title      |设置顶部title			 |title              |
| client_page_back       |客户端页面回退（back到webview上一页） |-                  |
| client_alert           |警告提示框，要求客户端自定义风格 |title, msg, ok_wording, callback |
| client_confirm         |确认提示框，俩按钮的提示框 |title, msg, ok_wording, cancle_wording, ok_callback, cancel_callback |
| get_client_info        |获取客户端类型/版本信息 |callback           |
| get_client_location    |获取客户端定位信息 |callback, failback |
| show_loading    			|显示菊花  | |
| close_loading    			|关闭菊花  | |

###### b. 多VIEW操作

| 方法名                 |说明				 | 需要的参数名         |
| -----------------------|:------------------|:-------------------|
| open      		      |跳转(进入)到下一个view	|url, param, callback   	 |
| back		              |回退到上一个view			|callback      			     |

##### 调用举例

```
var mc = new M_Client('Android_Bridge'); // 如果是Android需要指定桥名

$('.J_confirm').click(function() {
    mc.pushBack('client_confirm', {
        title: '弹框标题在此',
        msg: '弹框内容在此',
        ok_wording: '确定！',
        cancel_wording: '取消！',
        ok_callback: function() {
            alert('client_confirm_ok_callback');
        },
        cancel_callback: function() {
            alert('client_confirm_cancel_callback');
        }
    });

	// 打开新的view（页面）
    mc.pushBack('open',{
        url:'目标url地址',
        param:{
            a:1,b:2 // 需要额外带入的参数
        },
        callback:function(){
            alert('view_jump_callbck');
        }
    });

	// view（页面）回退
	mc.pushBack('back');
});
```

##### TODO

- Native 调用 js
- 交易相关接口
