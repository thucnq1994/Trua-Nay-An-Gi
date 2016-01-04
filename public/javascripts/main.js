/////////////////////////////
////    client side     ////
///////////////////////////


function OrderByDate(orderDate, foodId){
	var parameters = { orderDate : orderDate, foodId : foodId };
	$.post( '/order', parameters, function(data) {
		var ret = JSON.parse(data);
		$("#result").html('<div class="alert alert-dismissable alert-'+ret.type+'"><button class="close" data-dismiss="alert" type="button">×</button>'+ret.content+'</div>');
		if(ret.content === 'Deleted order successfully!' || ret.content === 'You can not order for pass day!') {
			$('#menu-list a').removeClass('active');
		}
  });
}

function LoadMoreHistory(curDate, curUserId){
	var parameters = { curDate : curDate, curUserId : curUserId };
	$.post( '/history', parameters, function(data) {
		var ret = JSON.parse(data);
		if(ret.type === 'success') {
			var html = '';
			ret.data.forEach(function(history){
				html += '<div class="panel panel-primary"><div class="panel-heading">'+history.date+'</div><div class="panel-body">';
				history.orders.forEach(function(order){
					html += '<p>';
					html += order.actTime + ' - <b>' + order.username + '</b> had ordered <b>' + order.foodName + '</b> for lunch at ' + order.orderDate + '.';
					html += '</p>';
				});
				html += '</div></div>';
			});
			$("#history-list").append(html);
			$("#load-more").attr("onclick","LoadMoreHistory('"+ret.nextDate+"')");
		} else {
			console.log('That"s all')
		}
  });
}

function LoadMoreHistory1(curDate, curUserId){
	var parameters = { curDate : curDate, curUserId : curUserId };
	$.post( '/history', parameters, function(data) {
		var ret = JSON.parse(data);
		if(ret.type === 'success') {
			var html = '';
			console.log(ret.data);
			$("#history-list").append(html);
			$("#load-more").attr("onclick","LoadMoreHistory('"+ret.nextDate+"')");
		} else {
			console.log('That"s all')
		}
  });
}

$(function(){
  	$('#menu-list a').click(function() {
	  	$('#menu-list a').removeClass('active');
  		$(this).addClass('active'); 
	});
});