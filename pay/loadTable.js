
		$(document).ready(function() {
			//alert('width: ' + window.screen.width);
			$('.paytable-item, .paytable-selected').click(function() {
				if ($(this).hasClass("paytable-item")) {
					loadPaytable(this);
				}

			});
		});

		function loadPaytable(paytable) {
			var tmpRows = '';
			var dispTableNum = $(paytable).data('pay');

			// update the title
			$('#paytable-title').text(payTableList[dispTableNum].getDesc());

			// update the table
			var dispTable = payTableList[dispTableNum].getDispTable();

			for (payType in dispTable) {
				tmpRows += '<tr><td class="paytable-name">' + payType + '</td> ' +
				'<td class="paytable-value">' + dispTable[payType] + '</td></tr>';
			}
		
			$(".paytable tbody").html(tmpRows);
	
			// update the classes
			setPaytableSelected(dispTableNum);
		}

		function setPaytableSelected(selectedNum) {
			// loop through, removing the old selected and
			// changing the selectedNum to selected
			
			var itemNum;

			$('.paytable-list').children().each(function() {
				var item = $(this);
				itemNum = item.data('pay');

				if (item.hasClass('paytable-selected') && itemNum !== selectedNum) {
					item.removeClass('paytable-selected').addClass('paytable-item');
				}
				if (! item.hasClass('paytable-selected') && itemNum === selectedNum) {
					item.addClass('paytable-selected').removeClass('paytable-item');	
				}
			})
		}