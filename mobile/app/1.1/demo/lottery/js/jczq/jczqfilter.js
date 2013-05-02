/**
 * 声明seajs模块
 */

KISSY.add('mobile/jczq/jczqfilter' , function(S , App) {

	return {
		initialize: function(){
			C.JCZQ = new App.app({
				lotteryTypeName: 'JCZQ'
			});
		}
	}
} , {
	requires: ['mobile/base/filter']
});

