

KISSY.add("mobile/jczq/jczqbet" , function (S , App) {
	return {
		initialize: function(){
			C.JCZQ = new App.app({
				id: 'C.JCZQ',
				lotteryType: 21,
				lotteryTypeName: 'JCZQ'
			});
		}
	}
} , {
	requires: ['mobile/base/sportbet']
});

