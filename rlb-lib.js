/* rlb-lib.js
	 a library of useful generic functions that I have created
*/

/* a function to calc the combinations for n Choose k.
	 it will return either an array of the combos or the count
	 it can also run a callback function so that processing can take
	 place without the overhead of a huge array
*/
var rlb = {
	nCk: function (cards, k, listFlg, callbk) {

		listFlg = (listFlg == undefined) ? true : listFlg;
		var n = cards.length;
		var comboArray = new Array();
		var tmpArray = new Array(k);
		var cntArray = new Array(k);

		for (var i = 0; i < k; i++) {
			cntArray[i] = i;
			tmpArray[i] = cards[i];
		}

		var contFlg = true;

		while (contFlg) {
			if (listFlg) {
				comboArray.push(tmpArray.slice());
			}

			if (callbk) {
				callbk(tmpArray);
			}
			
			if (k === 0) {
				contFlg = false;
				continue;
			}

			for (var i = k - 1; i >= 0; i--) {
				if (cntArray[i] < n - (k - i)) {
					// increment that "bucket" and
					// reset any to the right
					cntArray[i]++;
					tmpArray[i] = cards[cntArray[i]];
					for (var j = i + 1; j < k; j++) {
						cntArray[j] = cntArray[j - 1] + 1;
						tmpArray[j] = cards[cntArray[j]];
					}
					break;
				} else {
					// we are at the end of that "bucket"
					// do nothing (increment will occur in
					// previous bucket)..unless we are at 0
					// and then we are done
					if (i == 0) {
						contFlg = false;
						break;
					}
				}
			}
		}
		return comboArray;
	}

}