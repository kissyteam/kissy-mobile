;(function($){
	
	$.Route = function(){
		this.initialize.apply(this,arguments);
	};
	
	$.Route.prototype = {
		//CFG
		/**
		 * {
		    	routes: {
		    		'p1/p2': 'c1',   // #p1/p2
		            ':p1/p2': 'c2',  // #query/p2
		            'p1/:p2': 'c3',     // #p1/query
		            ':p1/:p2': 'c4',    // #query1/query2
		            'p1/:p2/p3': 'c5'   // #p1/query/p3
		    	},
		    	c1: function(){		    	},
		    	c2: function(param){		        },
		        c3: function(param){		        },
		    	c4: function(param1,param2){		        },
		        c5: function(param){		        }
		    }
		 */
		initialize: function(CFG){
			this.CFG = CFG;
			for(var i in CFG){
				this[i] = CFG[i];
			}
		},
		bindEvent: function(){
			var self = this;
			$(window).on('hashchange',function(e){
				self.hashMap.call(self,e);
			});
		},
		getHashFromString: function(url){
			var reg = /#.+/gi;
			return url.match(reg) === null ? '' : url.match(reg)[0].replace('#','');
		},
		handleHashBox: function(e){
			var oldURL = e.oldURL, newURL = e.newURL;	
			this.oldHash = this.getHashFromString(oldURL);
			this.newHash = this.getHashFromString(newURL);
		},
		hashMap: function(e){
			try{
				this.handleHashBox(e);
			}catch(e){}
			;
			var hash = location.href.replace('http://' + location.hostname + location.pathname + location.search,'').replace(/(#)|(\/$)/gi,'');
			//静态匹配
			if(hash in this.CFG.routes){
				try{
					this.CFG[this.CFG.routes[hash]].call(this);
				}catch(e){
					//throw '请在配置中声明方法：' + this.CFG.routes[hash];
				}
				
			}else{
				//动态匹配
				for(var i in this.CFG.routes){
					var routePathArr = i.split('/'),
						curPath = hash.split('/'),
						pathdep = curPath.length;
					//路由配置中含动态匹配参数，且路由层级和当前hash层级一致
					if(i.indexOf(':') >= 0 && routePathArr.length == pathdep){
						
						for(var j=curPath.length;j--;){
							if(routePathArr.indexOf(curPath[j]) == j){
								curPath.splice(j,1);
							}
						}
						//除去在路由配置中已经匹配到的静态层级，剩余层级数等于路由配置中的动态层级数
						//或者路由配置中全部是动态层级（即查询参数）
						if((curPath.length == i.match(/:/gi).length) || i.match(/:/gi).length == routePathArr.length){
							try{
								this.CFG[this.CFG.routes[i]].apply(this,curPath);
							}catch(e){
								//throw '请在配置中声明方法：' + this.CFG.routes[i];
							}
							
						}
						
					}
					
				}
				
			}
			//alert('2');
		},
		start: function(){
			this.bindEvent();
			this.hashMap();
		},
		//动态获取hash参数
		//#a/?x=1&y=2
		// return {x:1,y:2}
		query: function(){
			var hash = location.hash,
				obj = {},
				arr = hash.split('/');
			if(arr.length <= 1){
				return obj;
			}else{
				var str = arr[arr.length - 1].replace('?','');
				var _arr = str.split('&');
				for(var i=0;i<_arr.length;i++){
					var a = _arr[i].split('=');
					obj[a[0]] = a[1];
				}
				return obj;
			}
		}
		
	};
	

}(Zepto));
