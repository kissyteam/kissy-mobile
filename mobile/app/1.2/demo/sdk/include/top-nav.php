<!--script class="J-top-nav-tpl" type="text/template">
    <div class="c-inav">
        <section>
            <div class="back" style="visibility:hidden;">
                <span><em></em></span><a href="javascript:void(0);" onclick="Host.back();">返回</a>
            </div>
        </section>
        <section>
            <span class="J-title">${title}</span>
        </section>
        <section>
            <div class="other">
                <a href="about:blank"></a>
            </div>
        </section>
    </div>
</script-->
<!--div id="tbh5v0">
<header class="J-top-nav">
    <div class="c-inav">
        <section>
            <div class="back J-back" style="visibility:hidden;">
                <span><em></em></span><a href="javascript:void(0);" onclick="Host.back();">返回</a>
            </div>
        </section>
        <section>
            <span class="J-title">${title}</span>
        </section>
        <section>
            <div class="other J-icon" style="visibility:hidden">
            </div>
        </section>
    </div>
</header>
</div-->

<!--导航{{-->
<style>
.J-mok {
	height:44px;
}
.J-top-nav {
	height:44px;
	background:url('http://img04.taobaocdn.com/tps/i4/T10oWDXA8gXXbtxQw.-1-44.png') repeat-x;
	position:fixed;
	top:0px;
	width:100%;
	z-index:999;
}
.J-top-nav .u-back {
	position:absolute;
	top:10px;
	left:10px;
	width:23px;height:23px;
}
	
.J-top-nav .u-back a,.J-top-nav .u-icon a{
	height:23px;width:23px;
	display:block;
}
.J-top-nav .u-back a img,.J-top-nav .u-icon a img{
	width:100%;height:100%;
}
.J-top-nav .u-title {
	font-size:16px;
	text-align:center;
	height:100%;
	vertical-align:middle;
	line-height:44px;
	color:white;
	text-shadow: 1px 1px 1px gray;
}
.J-top-nav .u-icon {
	position:absolute;
	top:10px;
	right:10px;
	width:23px;height:23px;
}

</style>
<div class="J-mok">
	<div class="J-top-nav">
		<div class="u-nav">
			<section class="u-back">
				<a href="javascript:void(0);" onclick="Host.back();">
					<img src="http://img03.taobaocdn.com/tps/i3/T1qOmEXC4dXXbmeOrg-45-45.png" />
				</a>
			</section>
			<section class="u-title">
				<span class="J-title">男装</span>
			</section>
			<section class="u-icon">
				<!--a href="javascript:void(0);">
					<img src="http://img03.taobaocdn.com/tps/i3/T1qOmEXC4dXXbmeOrg-45-45.png" />
				</a-->
			</section>
		</div>
	</div>
</div>
<script>
KISSY.use('mobile/app/1.2/',function(S,AppFramework){
	var Nav;
	AppFramework.startup(function(){
		Nav = this.get('page').one('.J-top-nav');
		if(this.slide && this.slide.transitions){
			Nav = this.get('page').one('.J-top-nav');
			Nav.appendTo(S.one('body'));
		}
	});
	AppFramework.ready(function(){
		// alert(Nav);
		if(this.slide && this.slide.transitions){
			Nav.appendTo(this.get('page').get('.J-mok'));
			Nav.css({
				width:this.slide.animcon.width() + 'px'
			});
			Nav.one('.u-nav').css({
				width:'100%'
			});
		}
	});
	AppFramework.teardown(function(){
		if(this.slide && this.slide.transitions){
			var con = S.one('.J-top-nav');
			setTimeout(function(){
				Nav.remove();
			},600);
			// this.get('page').one('.J-top-nav').appendTo(this.get('page'));
		}
	});
});
</script>
<!--导航}}-->



