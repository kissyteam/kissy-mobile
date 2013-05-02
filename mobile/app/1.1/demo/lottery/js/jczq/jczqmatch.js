/**
 * 声明seajs模块
 */

KISSY.add("mobile/jczq/jczqmatch" , function(S , Match) {
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
		'mobile/base/match'
	]	
});

