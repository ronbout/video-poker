var PayTable = function () {
	
		// the payTable is composed of payouts inside 
		// array(s) with the following layout:
		// array [ High Card,
		//  			 Pair - array [ 2 - Ace ],
		//				 Three of Kind,
		//				 Three of Kind,
		//				 Straight,
		//				 Flush,
		//				 Full House,
		//				 Four of Kind - array [ 2 - Ace ],
		//				 Straight Flush (non royal),
		//				 Royal Flush,
		//	]
		// it is not a name:pair object because using
		// arrays lets me correlate card numbers to 
		// array indices in the calcPayout routine
	
		var _id;
		var _desc;
		var _payTable;
		var _dispTable;
	
		this.setId = function (id) {
			_id = id;
		}
		this.getId = function () {
			return _id;
		}
		this.setDesc = function (desc) {
			_desc = desc;
		}
		this.getDesc = function () {
			return _desc;
		}
		this.setPayTable = function (table) {
			_payTable = table;
		}
		this.getPayTable = function () {
			return _payTable;
		}
		this.setDispTable = function (disp) {
			_dispTable = disp;
		}
		this.getDispTable = function () {
			return _dispTable;
		}
	}