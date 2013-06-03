(function() {
    
    var M_Client = function() {
        this.init.apply(this, arguments);
    };

    M_Client.prototype = {
        init: function(bridgeName) {
            var that = this;
            that.platform = that.getRequestParam(window.location.search, 'client_type') || 'ios';
            that.bridgeName = bridgeName || 'trip_android_bridge';
            that.bridge = window[that.bridgeName];

            if(that.platform === 'ios') {
                that.buildProxy();
            }
        },

        buildProxy: function() {
            var that = this;
            var mClientProxy = document.querySelector("#J_MClientProxy");
            var IFRAME ='<iframe id="J_MClientProxy" class="hidden" style="width:0;height:0;opacity:0;display:none;" src="native://"></iframe>';

            if(mClientProxy) {
                that.mClientProxy = mClientProxy;
                return;
            }

            mClientProxy = $(IFRAME);
            $('body').append(mClientProxy);
            that.mClientProxy = mClientProxy;
        },

        pushBack: function(host, data) {
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
            that.mClientProxy.attr('src', uri);
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
