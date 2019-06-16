
	// Card Class
	var Card = function (cardNbr) {
		var _cardNbr = cardNbr;

		Card.cardImageIds = ["h2", "h3", "h4", "h5", "h6", "h7", "h8", "h9", "h10", "hj", "hq", "hk", "ha",
			"d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "d10", "dj", "dq", "dk", "da",
			"c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "cj", "cq", "ck", "ca",
			"s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "sj", "sq", "sk", "sa"];

		Card.imageLoc = "cards/";
		Card.imageExt = "png";

		this.cardNbr = function () {
			return _cardNbr;
		}

		this.setCardNbr = function (i) {
			_cardNbr = i;
		}
	}

	Card.prototype.getRank = function () {
		return this.cardNbr() % 13 + 2;
	}

	Card.prototype.getSuit = function () {
		return Math.floor(this.cardNbr() / 13);
	}

	Card.prototype.getCardImage = function () {
		return Card.imageLoc + Card.cardImageIds[this.cardNbr()] + "." + Card.imageExt;
	}

	// End of Card Class