// PokerHand Class
var PokerHand = function (hand) {
	var _hand = hand;
	var _handRank = new Array(HAND_SIZE);
	var _sortedHand = new Array(HAND_SIZE);

	// need to have a Static compare
	// routine for the sort function
	PokerHand.compareRanks = function (card1, card2) {
		return Deck.getRank(card2) - Deck.getRank(card1);
	};

	this.setHand = function (hand) {
		_hand = hand;
	};

	this.getHand = function () {
		return _hand;
	};

	this.getHandRank = function () {
		this.setHandRank();
		return _handRank;
	};

	this.getSortedHand = function () {
		return _sortedHand;
	};

	this.setHandRank = function () {
		var strtFlg = false;
		var flushFlg = false;
		var ranks = new Array(HAND_SIZE);

		// sort hand into _sortedHand  using .sort
		// after copying the objects into a new array
		// with new objects

		_sortedHand = new Array(HAND_SIZE);
		for (var i = 0; i < HAND_SIZE; i++) {
			//_sortedHand[i] = Object.create(_hand[i]);
			_sortedHand[i] = _hand[i];
		}

		_sortedHand.sort(PokerHand.compareRanks);

		for (var i = 0; i < HAND_SIZE; i++) {
			ranks[i] = Deck.getRank(_sortedHand[i]);
		}
		strtFlg = this.isStraight(ranks);
		flushFlg = this.isFlush();

		_handRank[5] = HIGH_CARD; // default hand rank
		if (strtFlg || flushFlg) {
			if (strtFlg && flushFlg)
				if (ranks[4] == 10) _handRank[5] = ROYALFLUSH;
				else _handRank[5] = STRT_FLUSH;
			else if (strtFlg) _handRank[5] = STRAIGHT;
			else _handRank[5] = FLUSH;
		} else {
			if (this.isFour(ranks)) _handRank[5] = FOUR_KIND;
			else if (this.isFull(ranks)) _handRank[5] = FULL_HOUSE;
		}
		if (_handRank[5] != HIGH_CARD) {
			// load hand rank and exit--do not want to mix up 2 pairs w 4kind, etc
			this.loadHandRank(ranks);
			return;
		}
		// check for 3 of a kind
		if (this.isThree(ranks)) _handRank[5] = THREE_KIND;
		else if (this.isTwoPair(ranks)) _handRank[5] = TWO_PAIR;
		else if (this.isPair(ranks)) _handRank[5] = PAIR;
		this.loadHandRank(ranks);
		return;
	}; // end of setHandRank

	this.isStraight = function (ranks) {
		// check for wheel
		if (
			ranks[0] == ACE &&
			ranks[1] == 5 &&
			ranks[2] == 4 &&
			ranks[3] == 3 &&
			ranks[4] == 2
		)
			return true;

		// check for all other straights
		if (
			ranks[0] == ranks[1] + 1 &&
			ranks[1] == ranks[2] + 1 &&
			ranks[2] == ranks[3] + 1 &&
			ranks[3] == ranks[4] + 1
		)
			return true;
		return false;
	};

	this.isFlush = function () {
		var suits = new Array(HAND_SIZE);
		for (var i = 0; i < HAND_SIZE; i++) {
			suits[i] = Deck.getSuit(_sortedHand[i]);
		}

		if (
			suits[0] == suits[1] &&
			suits[1] == suits[2] &&
			suits[2] == suits[3] &&
			suits[3] == suits[4]
		)
			return true;
		return false;
	};

	this.isFour = function (ranks) {
		if (
			(ranks[0] == ranks[1] && ranks[1] == ranks[2] && ranks[2] == ranks[3]) ||
			(ranks[1] == ranks[2] && ranks[2] == ranks[3] && ranks[3] == ranks[4])
		)
			return true;
		else return false;
	};

	this.isFull = function (ranks) {
		if (
			(ranks[0] == ranks[1] && ranks[1] == ranks[2] && ranks[3] == ranks[4]) ||
			(ranks[0] == ranks[1] && ranks[2] == ranks[3] && ranks[3] == ranks[4])
		)
			return true;
		else return false;
	};

	this.isThree = function (ranks) {
		if (
			(ranks[0] == ranks[1] && ranks[1] == ranks[2]) ||
			(ranks[1] == ranks[2] && ranks[2] == ranks[3]) ||
			(ranks[2] == ranks[3] && ranks[3] == ranks[4])
		)
			return true;
		else return false;
	};

	this.isTwoPair = function (ranks) {
		if (
			(ranks[0] == ranks[1] && ranks[2] == ranks[3]) ||
			(ranks[0] == ranks[1] && ranks[3] == ranks[4]) ||
			(ranks[1] == ranks[2] && ranks[3] == ranks[4])
		)
			return true;
		else return false;
	};

	this.isPair = function (ranks) {
		if (
			ranks[0] == ranks[1] ||
			ranks[1] == ranks[2] ||
			ranks[2] == ranks[3] ||
			ranks[3] == ranks[4]
		)
			return true;
		else return false;
	};

	this.loadHandRank = function (ranks) {
		// load cards into hand rank depending on hand type
		//  i.e. flush Q 10 9 5 3, but 2 pair  J J 8 8 K  NOT K J J 8 8

		var hand_type = _handRank[5];
		var tmp;
		switch (hand_type) {
			//	need to make sure that cards are sorted by relevance, i.e. pairs before kickers
			//	flush, and high card require no special processing
			case STRT_FLUSH:
			case STRAIGHT:
				// check for A 5 4 3 2, swap to 5 4 3 2 A
				if (ranks[0] == ACE && ranks[1] == 5) {
					tmp = _sortedHand[0];
					for (var i = 0; i < 4; i++) _sortedHand[i] = _sortedHand[i + 1];
					_sortedHand[4] = tmp;
				}
				break;
			case PAIR:
				// move pair to top of hand
				if (ranks[0] != ranks[1]) {
					if (ranks[1] == ranks[2]) {
						// A Q Q 8 7  -->  Q Q A 8 7
						tmp = _sortedHand[0];
						_sortedHand[0] = _sortedHand[2];
						_sortedHand[2] = tmp;
					} else if (ranks[2] == ranks[3]) {
						// A Q 8 8 7  -->  8 8 A Q 7
						tmp = _sortedHand[0];
						_sortedHand[0] = _sortedHand[3];
						_sortedHand[3] = _sortedHand[1];
						_sortedHand[1] = _sortedHand[2];
						_sortedHand[2] = tmp;
					} else {
						// A Q 8 7 7  -->  7 7 A Q 8
						tmp = _sortedHand[4];
						_sortedHand[4] = _sortedHand[2];
						_sortedHand[2] = _sortedHand[0];
						_sortedHand[0] = _sortedHand[3];
						_sortedHand[3] = _sortedHand[1];
						_sortedHand[1] = tmp;
					}
				}
				break;
			case TWO_PAIR:
				// check for A Q Q 7 7, swap to Q Q 7 7 A
				if (ranks[0] != ranks[1]) {
					tmp = _sortedHand[0];
					for (i = 0; i < 4; i++) _sortedHand[i] = _sortedHand[i + 1];
					_sortedHand[4] = tmp;
				} else if (ranks[2] != ranks[3]) {
					tmp = _sortedHand[2];
					_sortedHand[2] = _sortedHand[4];
					_sortedHand[4] = tmp;
				}
				break;
			case THREE_KIND:
				// check for 9 7 7 7 4 and 9 8 7 7 7, swap to 7 7 7 x x
				if (ranks[2] == ranks[3]) {
					tmp = _sortedHand[0];
					_sortedHand[0] = _sortedHand[3];
					_sortedHand[3] = tmp;
					if (ranks[0] != ranks[1]) {
						tmp = _sortedHand[1];
						_sortedHand[1] = _sortedHand[4];
						_sortedHand[4] = tmp;
					}
				}
				break;
			case FULL_HOUSE:
				// check for 8 8 7 7 7, swap to 7 7 7 8 8
				if (ranks[1] != ranks[2]) {
					tmp = _sortedHand[0];
					_sortedHand[0] = _sortedHand[4];
					_sortedHand[4] = tmp;
					tmp = _sortedHand[1];
					_sortedHand[1] = _sortedHand[3];
					_sortedHand[3] = tmp;
				}
				break;
			case FOUR_KIND:
				// check for 8 7 7 7 7, swap to  7 7 7 7 8
				if (ranks[0] != ranks[1]) {
					tmp = _sortedHand[0];
					_sortedHand[0] = _sortedHand[4];
					_sortedHand[4] = tmp;
				}
				break;
		}
		// reverse order into handRank so that it is easy
		// to convert into single value based on hex digits
		for (var i = 4; i >= 0; i--) {
			_handRank[i] = _sortedHand[4 - i];
		}
		return;
	};

	this.convertHandRank = function () {
		// convert hand_rank array to hex number
		// highest val is hand type, followed by card ranks
		// not used in Video Poker but would be used in
		// other games where relative hand strength is required
		// like actual poker

		var retVal = 0;

		for (var i = 0; i < HAND_SIZE; i++)
			retVal += Deck.getRank(_handRank[i]) * Math.pow(16.0, i);

		retVal += _handRank[5] * Math.pow(16.0, 5);

		return retVal;
	};
};
// End of PokerHand Class
