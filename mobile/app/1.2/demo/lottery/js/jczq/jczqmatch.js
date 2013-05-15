/**
 * 声明seajs模块
 */

KISSY.add("mobile/app/1.2/demo/lottery/js/jczq/jczqmatch" , function(S , Match) {
	return {
		initialize: function(){
			C.JCZQ = new Match.app({
				id: 'C.JCZQ',
				lotteryType: 21,
				lotteryTypeName: 'JCZQ'
			});
		}	
	};
} , {
	requires: [
		'mobile/app/1.2/demo/lottery/js/base/match'
	]	
});

