(function() {
    
    var PROXY_ID = 0;
    var M_Client = function() {
        this.init.apply(this, arguments);
    };

    M_Client.prototype = {
        init: function(bridgeName) {
            var that = this;
            that.platform = that.getRequestParam(window.location.search, 'client_type') || 'ios';
            that.bridgeName = bridgeName || 'trip_android_bridge';
            that.bridge = window[that.bridgeName];
            
            //modified by huya.nzb
        },

        //modified by huya.nzb
        send: function(uri, newProxy) {
            var proxy = this.mClientProxy;
            
            if (newProxy) {
                //fix同时发多次请求的bug
                this.buildProxy(uri);
            } else {
                //fix domready之前buildProxy的bug
                //fix 初始化时发空请求的bug
                if (proxy || (proxy = document.querySelector('#J_MClientProxy'))) {
                    proxy.attr('src', uri);
                } else {
                    proxy = this.buildProxy(uri);
                }
                this.mClientProxy = proxy;
            }
            
            return this;
        },
        
        //modified by huya.nzb
        buildProxy: function(uri) {
            var proxy = $('<iframe id="J_MClientProxy_' + (PROXY_ID++) + '" class="hidden mclient-proxy" style="width:0;height:0;opacity:0;display:none;" src="' + uri + '"></iframe>');
            $('body').append(proxy);
            return proxy;
        },

        pushBack: function(host, data, newProxy) {
            var that = this;
            var uri = 'native://' + host + '?data=';
            var callbackName;

            for(var i in data) {
                if(data.hasOwnProperty(i)) {
                    if(typeof(data[i]) === 'function') {
                        callbackName = 'M_Client_Callbacks_' + host + '_' + new Date().getTime() + '_' + parseInt(Math.random() * 1000000);

                        window[callbackName] = (function(cb, callbackName) {
                            return function() {
                                cb.apply(this, arguments);
                                delete window[callbackName];
                            };
                        })(data[i], callbackName);

                        data[i] = callbackName;
                    }
                }
            }

            if(that.platform === 'android') {
                //alert('回调客户端命令：' + host);
                that.bridge && that.bridge[host] && that.bridge[host](JSON.stringify(data));
                //console.info('回调客户端命令：%s', host);
                //console.info('回传数据：%s', JSON.stringify(data));
                return;
            }

            uri += encodeURIComponent(JSON.stringify(data));
            
            //modified by huya.nzb
            that.send(uri, newProxy);
            //console.info('回调客户端命令：%s', host);
            //console.info('回传数据：%s', JSON.stringify(data));
        },

        getRequestParam: function(uri, param) {
            var value = uri.match(new RegExp('[\?\&]' + param + '=([^\&]*)(\&?)', 'i'));
            return value ? value[1] : value;
        }
    };

    this.M_Client = M_Client;

}).call(this);
