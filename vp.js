const START_BET = 5;
const DEAL = 0;
const DRAW = 1;

var game;

(function ($) {
	var Vp = function () {
		var _deck = new Deck();
		var _pokerHand = new PokerHand();
		var _curPayNbr = 0;
		var _oldPayNbr = 0; // in case Cancel is used on paytable screen
		var _curPayTable = payTableList[_curPayNbr];
		var _curBet = START_BET;
		var _curMode = DEAL;
		var _curBank = 1000;
		var _curHand = new Array(5);
		var _holdCards = [0, 0, 0, 0, 0];

		this.getCurPayNbr = function () {
			return _curPayNbr;
		};

		this.getOldPayNbr = function () {
			return _oldPayNbr;
		};

		this.getCurPayTable = function () {
			return _curPayTable;
		};

		this.getCurBet = function () {
			return _curBet;
		};

		this.getCurMode = function () {
			return _curMode;
		};

		this.getCurHand = function () {
			return _curHand;
		};

		this.getCurBank = function () {
			return _curBank;
		};

		/*  NEW FUNCTION FOR SETTING PAYTABLE...ADD TO
		    loadTable.js ***/
		this.setCurPayTable = function (nbr) {
			_oldPayNbr = _curPayNbr;
			_curPayNbr = nbr;
			_curPayTable = payTableList[_curPayNbr];
		};

		this.setCurBet = function (curBet) {
			_curBet = curBet;
		};

		this.setCurHand = function (cards) {
			_curHand = cards;
		};

		this.setHoldCard = function (i) {
			_holdCards[i] = _holdCards[i] ? 0 : 1;
		};

		this.incCurBet = function () {
			if (_curBet < 100 && _curBet < _curBank) {
				_curBet += 5;
			}
			return _curBet;
		};

		this.decCurBet = function () {
			if (_curBet > 5) {
				_curBet -= 5;
			}
			return _curBet;
		};

		this.setDealMode = function () {
			// set up ui elements
			$("#draw-btn").hide();
			$("#deal-btn").show();

			$("#pay").removeClass("disable");
			$("#over").css("visibility", "visible");

			$("#calc-odds").prop("disabled", true);
			$("#ev").val("0.00");

			$(".bet-btn").prop("disabled", false);

			_curMode = DEAL;
		};

		this.setDrawMode = function () {
			// set up ui elements
			for (var i = 1; i <= 5; i++) {
				$("#hold" + i).html("&nbsp;");
			}

			$("#deal-btn").hide();
			$("#draw-btn").show();

			$("#pay").addClass("disable");
			// have to keep the layout position of the over
			$("#over").css("visibility", "hidden");
			$("#calc-odds").prop("disabled", false);
			$(".bet-btn").prop("disabled", true);

			_curMode = DRAW;
		};

		this.dealHand = function () {
			_deck.shuffle();
			_curHand = _deck.deal(HAND_SIZE);

			_curHand.forEach(function (card, i) {
				$("#card" + (i + 1))
					.prop("src", Deck.getCardImage(card))
					.prop("alt", Deck.getCardDesc(card))
					.prop("title", Deck.getCardDesc(card));
			});

			_holdCards = [0, 0, 0, 0, 0];

			// remove bet amount from bank
			_curBank -= _curBet;
		};

		this.clickCard = function (i) {
			if (_holdCards[i - 1] === 0) {
				$("#hold" + i).html("HOLD");
				_holdCards[i - 1] = 1;
			} else {
				$("#hold" + i).html("&nbsp;");
				_holdCards[i - 1] = 0;
			}
		};

		this.draw = function () {
			_holdCards.forEach(function (holdCard, i) {
				if (!holdCard) {
					// replace new card by dealing another off deck
					_curHand[i] = _deck.deal(1)[0];
					// display new card
					var card = _curHand[i];
					var cardImage = Deck.getCardImage(card);
					$("#card" + (i + 1))
						.prop("src", cardImage)
						.prop("alt", Deck.getCardDesc(card))
						.prop("title", Deck.getCardDesc(card));
				}
			});
			// determine hand type
			_pokerHand.setHand(_curHand);
			var handRank = _pokerHand.getHandRank();
			var payout = this.calcPayout(handRank);

			_curBank += payout;

			return { payout: payout, handRank: handRank };
		};

		this.calcPayout = function (handRank) {
			var payout;
			var payStructure = _curPayTable.getPayTable();

			switch (handRank[5]) {
				case HIGH_CARD:
				case TWO_PAIR:
				case THREE_KIND:
				case STRAIGHT:
				case FLUSH:
				case FULL_HOUSE:
				case STRT_FLUSH:
				case ROYAL_FLUSH:
					payout = payStructure[handRank[5]] * _curBet;
					break;
				case FOUR_KIND:
				case PAIR:
					// check rank of high card and pull pay from array
					payout =
						payStructure[handRank[5]][Deck.getRank(handRank[4]) - 2] * _curBet;
			}
			return payout;
		};

		this.calcEv = function () {
			var totalPayout = 0;
			var comboCnt = 0;
			var tmpHand;

			// if no hold cards, do no
			// make array of just hold cards
			var tmpHoldCards = _curHand.filter(function (card, ndx) {
				return _holdCards[ndx];
			});

			//console.time('combos');

			// create array of combos using nCk
			var tmpDeck = _deck.deal(47, false);
			var k = HAND_SIZE - tmpHoldCards.length;

			var getPayout = this.calcPayout.bind(this);

			var comboFn = function (combo) {
				comboCnt++;
				if (!(comboCnt % 10000)) {
					console.log("cnt: " + comboCnt);
				}
				var tmpHand = tmpHoldCards.concat(combo);
				// calc return for this combo
				var tmpPokerHand = new PokerHand(tmpHand);
				var handRank = tmpPokerHand.getHandRank();
				var payout = getPayout(handRank);
				totalPayout += payout;
			};

			//console.log('k: ' + k);
			rlb.nCk(tmpDeck, k, false, comboFn);

			console.log("comboCnt: " + comboCnt);
			console.log("total payout: " + totalPayout);

			//console.timeEnd('combos');

			var returnEv = totalPayout / comboCnt;
			return returnEv;
		};

		Vp.showCards = function (cards) {
			cards.forEach(function (card, ndx) {
				console.log(ndx + ": " + Deck.getCardDesc(card));
			});
		};

		this.setDealMode();
	};

	$(document).ready(function () {
		// is anyone even looking??
		$.get("log_ips.php", { logname: "log-vp.dat" });
		//alert('width: ' + window.screen.width);
		var dealBtn = $("#deal-btn");
		var drawBtn = $("#draw-btn");
		var betPlus = $("#betplus");
		var betMinus = $("#betminus");
		var paytables = $("#paytables-img");
		var cards = $(".card");
		var betDisp = $("#bet");
		var bankDisp = $("#bank");
		var msgBox = $("#msg");
		var msgOver = $("#over");
		var heading = $("#heading");
		var ev = $("#ev");
		var calcOdds = $("#calc-odds");
		var oddsHelp = $("#odds-help");
		var msgModal = $("#msg-modal-p");
		var modalClose = $("#modal-close");

		var gameDeck = new Deck();
		var msgs = {
			init: 'Bet +/- to set Bet amount.   "DEAL" to play.',
			draw: 'Click on Cards to hold.   "DRAW" to draw.',
			lost: "Sorry. You lost.",
			won: "You won $%%_amt_%%!",
			odds:
				"The Calc Odds/EV button looks at every combination of hands \n" +
				"possible given the cards that you are holding and determines \n" +
				"an average payout based on your bet size.\n" +
				"\nNote:  Running the odds calculator with no cards held may take \n" +
				"a few moments (1,533,939 combos).  The EV for such a calc is in \n" +
				"the 0.32-0.34 range ($1.6-1.7 per $5 bet)",
		};

		game = new Vp();

		bindEvents();
		msgBox.html(msgs.init);
		oddsHelp.prop("title", msgs.odds);
		msgModal.html(
			msgs.odds.replace(/\nNote/g, "<br><br>Note").replace(/\n/g, "")
		);

		function bindEvents() {
			dealBtn.click(function (e) {
				e.preventDefault();
				game.dealHand();
				game.setDrawMode();
				msgBox.html(msgs.draw);
				bankDisp.val(game.getCurBank());
			});

			drawBtn.click(function (e) {
				e.preventDefault();
				var result = game.draw();
				var payout = result.payout;
				var handRank = result.handRank;

				var getBank = game.getCurBank.bind(game);

				var showResult = function () {
					if (payout) {
						msgOver.html(HAND_DESCS[handRank[5]]);
						msgBox.html(msgs.won.replace("%%_amt_%%", payout));
					} else {
						msgOver.html("GAME OVER");
						msgBox.html(msgs.lost);
					}
					game.setDealMode();
					bankDisp.val(getBank());
				};

				// for playability  purposes, put a little delay into
				// showing Game Over
				setTimeout(showResult, 650);
			});

			betPlus.click(function (e) {
				e.preventDefault();
				if (game.getCurMode() === DRAW) {
					return;
				}
				var bet = game.incCurBet();
				betDisp.val(bet);
			});

			betMinus.click(function (e) {
				e.preventDefault();
				if (game.getCurMode() === DRAW) {
					return;
				}
				var bet = game.decCurBet();
				betDisp.val(bet);
			});

			cards.click(function (e) {
				e.preventDefault();
				if (game.getCurMode() === DEAL) {
					return;
				}
				game.clickCard($(this).data("card"));
			});

			calcOdds.click(function (e) {
				e.preventDefault();
				var evReturn;
				ev.val("calc....");
				// due to timing issues, need to use SetInterval or
				// the calc display will never be shown
				var getEv = game.calcEv.bind(game);
				var intId = setInterval(function () {
					if (ev.val() == "calc....") {
						clearInterval(intId);
						evReturn = getEv();
						ev.val(evReturn.toFixed(2) + " credits");
					}
				}, 5);
			});

			oddsHelp.click(function (e) {
				e.preventDefault();
				dispModalMsg();
			});

			modalClose.click(function (e) {
				e.preventDefault();
				closeModalMsg();
			});

			$(".paytable-item, .paytable-selected").click(function () {
				var payTable = $(this);
				if (payTable.hasClass("paytable-item")) {
					loadPaytable(payTable.data("pay"), game);
				}
			});

			paytables.click(function (e) {
				e.preventDefault();
				if (game.getCurMode() === DRAW) {
					return;
				}
				openPay();
			});
		}

		function dispModalMsg() {
			$("#modal-layer").css("display", "flex");
		}

		function closeModalMsg() {
			$("#modal-layer").css("display", "none");
		}

		$("#pay-cancel").click(function () {
			// check if paytable was changed and turn back if so
			if (game.getOldPayNbr() !== game.getCurPayNbr()) {
				loadPaytable(game.getOldPayNbr());
			}
			closePay();
		});

		$("#pay-submit").click(function () {
			closePay();
		});
	});

	function openPay() {
		$("#game-container").hide();
		$("#paytable-page").show();
	}

	function closePay() {
		$("#paytable-page").hide();
		$("#game-container").show();
	}

	function loadPaytable(dispTableNum) {
		var tmpRows = "";

		// update the title
		$("#paytable-title").text(payTableList[dispTableNum].getDesc());

		// update the table
		var dispTable = payTableList[dispTableNum].getDispTable();

		for (payType in dispTable) {
			tmpRows +=
				'<tr><td class="paytable-name">' +
				payType +
				"</td> " +
				'<td class="paytable-value">' +
				dispTable[payType] +
				"</td></tr>";
		}

		$(".paytable tbody").html(tmpRows);

		// update the classes
		setPaytableSelected(dispTableNum);

		// update game
		game.setCurPayTable(dispTableNum);
	}

	function setPaytableSelected(selectedNum) {
		// loop through, removing the old selected and
		// changing the selectedNum to selected

		var itemNum;

		$(".paytable-list")
			.children()
			.each(function () {
				var item = $(this);
				itemNum = item.data("pay");

				if (item.hasClass("paytable-selected") && itemNum !== selectedNum) {
					item.removeClass("paytable-selected").addClass("paytable-item");
				}
				if (!item.hasClass("paytable-selected") && itemNum === selectedNum) {
					item.addClass("paytable-selected").removeClass("paytable-item");
				}
			});
	}
})(jQuery);
