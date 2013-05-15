
KISSY.add("mobile/app/1.2/demo/lottery/js/reward/list-jczq" , function (S , Tool , Layout , Calendar , Reward) {

	return {
		initialize: function(){
			C.JCZQ = new Reward.app({
				lotteryType: 21,
				lotteryTypeName: 'JCZQ',
				lotteryTypeLocalName: '竞彩足球',
				tpl: $('#ZQItemTemp').html(),
				getData: function() {
					var self = this,
						date = new Date(),
						curDate = date.getFullYear() + '' + C.Template.bitHandle(date.getMonth() + 1, 2) + '' + C.Template.bitHandle(date.getDate(), 2);
					self.dateTime = curDate;
					
					//Calendar
					self.calendar = Calendar('#myCalendar',{
						trigger: '.type',
						onSelect: function(o){
							$('#myCalendar').addClass('hidden');
							self._tag = false;
							var t = o.year + '' + C.Template.bitHandle(o.month, 2) + '' + C.Template.bitHandle(o.date, 2);
							//如两次选择时间相同，跳出
							if(self.dateTime == t) return;
						
							Layout.transBox('正在努力请求数据');
							self.dateTime = t;
							var url = C.Config.getRewardMatchDataListUrl() + '?callback=C.JCZQ.initReward&lotteryTypeId=' + self.lotteryTypeName + '&dateTime=' + t + '&t=' + new Date().getTime();
							Tool.getScript(url);
						},
						disabledStart: date.getFullYear() + '' + C.Template.bitHandle(date.getMonth() + 1, 2) + '' + C.Template.bitHandle(date.getDate() + 1, 2)
					});				
					
					$(document).on('click',function(e){
						$('#myCalendar').addClass('hidden');
						Layout.removeTransBox();
						self._tag = false;
					});
					
					//get Data
					var url = C.Config.getRewardMatchDataListUrl() + '?callback=C.JCZQ.initReward&lotteryTypeId=' + self.lotteryTypeName + '&dateTime=' + self.dateTime + '&t=' + new Date().getTime();
					Tool.getScript(url);
				}
			});
		}
	}
} , {

	requires: [
		'mobile/app/1.2/demo/lottery/js/base/tool',
		'mobile/app/1.2/demo/lottery/js/base/layout',
		'mobile/app/1.2/demo/lottery/js/widget/calendar/calendar',
		'mobile/app/1.2/demo/lottery/js/reward/list-sport'
	]

});
		
