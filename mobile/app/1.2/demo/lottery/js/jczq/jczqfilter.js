/**
 * 声明seajs模块
 */

KISSY.add('mobile/app/1.2/demo/lottery/js/jczq/jczqfilter' , function(S , App) {

	return {
		initialize: function(){
			C.JCZQ = new App.app({
				lotteryTypeName: 'JCZQ'
			});
		}
	}
} , {
	requires: ['mobile/app/1.2/demo/lottery/js/base/filter']
});

