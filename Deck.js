
	// Deck Class
	var Deck = function () {

		Deck.cardImageIds = ["h2", "h3", "h4", "h5", "h6", "h7", "h8", "h9", "h10", "hj", "hq", "hk", "ha",
		"d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "dj", "dq", "dk", "da",
		"c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "cj", "cq", "ck", "ca",
		"s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "sj", "sq", "sk", "sa"];

		Deck.suitNames = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

		Deck.rankNames = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

		Deck.imageLoc = "cards/";
		Deck.imageExt = "png";

		Deck.getRank = function (cardNbr) {
			return cardNbr % 13 + 2;
		}
	
		Deck.getSuit = function (cardNbr) {
			return Math.floor(cardNbr / 13);
		}

		Deck.getCardDesc = function (cardNbr) {
			return Deck.rankNames[Deck.getRank(cardNbr)-2] + ' of ' + Deck.suitNames[Deck.getSuit(cardNbr)];
		}
	
		Deck.getCardImage = function (cardNbr) {
			return Deck.imageLoc + Deck.cardImageIds[cardNbr] + "." + Deck.imageExt;
		}


		var _deckCnt = 0;

		var _deck = new Array(DECK_SIZE);
		for (var i = 0; i < DECK_SIZE; i++) {
			_deck[i] = i;
		}

		this.deal = function (numCards, updateCntFlg) {
			if (numCards > DECK_SIZE - _deckCnt) {
				return false;
			}

			// updateCntFlg can be turned off to deal
			// cards for odds purposes w/o actually
			// dealing cards
			updateCntFlg = (updateCntFlg == undefined) ? true : updateCntFlg;
			var tmpCnt = _deckCnt;

			var hand = new Array(numCards);
			for (var j = 0; j < numCards; j++) {
				hand[j] = _deck[tmpCnt++];
			}

/////// TEST!!!
/*  		if (_deckCnt == 0) {
			hand = [new Card(6),
			new Card(7),
			new Card(8),
			new Card(22),
			new Card(36)];
		}  */

			if (updateCntFlg) {
				_deckCnt = tmpCnt;
			}

			return hand;
		}

		this.shuffle = function () {
			var tmp, i, j;

			_deckCnt = 0;

			for (i = DECK_SIZE - 1; i > 0; i--) {
				j = Math.floor(Math.random() * (i + 1))
				tmp = _deck[i];
				_deck[i] = _deck[j];
				_deck[j] = tmp;
			}
		}

		this.shuffle();
		//for (var z = 0; z < DECK_SIZE; z++) {
			//console.log(_deck[z].cardNbr());
		//}
	}


	// End of Deck Class