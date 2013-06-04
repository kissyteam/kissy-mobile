## 快速开始

引入 kissy 种子

	<script src="http://a.tbcdn.cn/s/kissy/1.3.0/seed-min.js" data-config='{combine:true}'></script>

Web无线项目，只需依赖`node`和`ajax`：

	<script>
		KISSY.use('node',function(S){
			S.one('.selector').html('ok');	
		});
	</script>

## js文件体积

项目开发的最基本功能的最小依赖（gzip）

- seed（14k）（包含loader和lang）
- node（22k）（包含base和event）
- ajax（4k）

总大小：40k

## 调用KS Mobile提供的模块

	<script>
		// 将Tip模块引入进来，回调中传入KISSY对象和Tip构造器
		KISSY.use('mobile/app/1.2/',function(S,AppFramework){
			// 这里添加你的代码
		});
	</script>

## 调试

url带参数`url?ks-debug`

## Nothing More

- [第三方模块列表](http://mobile.kissyui.com)
- [第一方模块列表](http://mobile.kissyui.com/#mobile/startup/components.html)


