

KISSY.add("mobile/app/1.2/demo/lottery/js/jczq/jczqbet" , function (S , App) {
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
	requires: ['mobile/app/1.2/demo/lottery/js/base/sportbet']
});

