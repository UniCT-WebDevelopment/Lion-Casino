window.scrollTo(0, 0);var resizeTimer;


var squares = new Array(48);
var betFixArray = [];

(function ($) {

	// table
	(function () {
		"use strict"

		function getButtonCells(btn) {
			var cells = btn.data('cells');
			if (!cells || !cells.length) {
				cells = [];
				switch (btn.data('type')) {
					case 'sector':
						var nums = sectors[btn.data('sector')];
						for (var i = 0, len = nums.length; i < len; i++) {
							cells.push(table_nums[nums[i]]);
						}
						return cells;
						break;
					case 'num':
					default:
						var nums = String(btn.data('num')).split(',');
						for (var i = 0, len = nums.length; i < len; i++) {
							cells.push(table_nums[nums[i]]);
						}
						btn.data('cells', cells)
						return btn.data('cells');
						break;
				}
			}
			return cells;
		};

		// props
		var active = true,
			selectors = {
				roulette: '.roulette',
				num: '.num',
				sector: '.sector',
				table_btns: '.controlls .btnRoulette'
			},
			classes = {
				red: 'red',
				black: 'black',
				green: 'green',
				hover: 'hover'
			},
			numbers = {
				red: [],
				black: [],
				green: []
			},
			sectors = {
				'1': [], // 1st row
				'2': [], // 2nd row
				'3': [], // 3rd row
				'4': [], // 1st 12
				'5': [], // 2nd 12
				'6': [], // 3rd 12
				'7': [], // 1 to 18
				'8': [], // EVEN
				'9': [], // RED
				'10': [], // BLACK
				'11': [], // ODD
				'12': [], // 19 to 36
			},
			table_nums = {},
			table_sectors = {};

		// init
		$(selectors.num).each(function () {
			var $this = $(this),
				color,
				num = Number($this.text());
			// add to instances array
			table_nums[num] = $this;
			// add to colors array
			for (var color in numbers) {
				if ($this.hasClass(classes[color])) {
					numbers[color].push(num);
					$this.data('color', color);
				}
			}
		})

		$(selectors.sector).each(function () {
			var $this = $(this),
				color;
			if ($this.hasClass(classes.red)) {
				color = 'red';
			} else if ($this.hasClass(classes.black)) {
				color = 'black';
			} else {
				color = 'sector';
			}
			$this.data('color', color);
			table_sectors[$this.data('sector')] = $this;
		});

		// sort numbers
		for (var color in numbers) {
			numbers[color].sort(function (a, b) { return a - b; });
		}

		// populate sectors
		for (var i = 1; i <= 36; i++) {
			// 1st row, 2nd row, 3rd row
			switch (i % 3) {
				case 0:
					sectors['1'].push(i);
					break;
				case 1:
					sectors['3'].push(i);
					break;
				case 2:
					sectors['2'].push(i);
					break;
			}

			// 1st 12, 2nd 12, 3rd 12
			if (i <= 12) {
				sectors['4'].push(i);
			} else if (i <= 24) {
				sectors['5'].push(i);
			} else {
				sectors['6'].push(i);
			}

			// 1 to 18, 19 to 36
			if (i <= 18) {
				sectors['7'].push(i);
			} else {
				sectors['12'].push(i);
			}

			// ODD, EVEN
			if (i % 2) {
				sectors['11'].push(i);
			} else {
				sectors['8'].push(i);
			}

			if (numbers.red.indexOf(i) != -1) {
				sectors['9'].push(i);
			} else if (numbers.black.indexOf(i) != -1) {
				sectors['10'].push(i);
			}
		}

		// buttons
		var table_btns = $(selectors.table_btns).hover(
			function () {
				hovering = 1;
				if (active) {
					var $this = $(this),
						cells = getButtonCells($this);
					for (var i = 0, len = cells.length; i < len; i++) {
						cells[i].addClass(classes.hover);
					}
					var sector = $this.data('sector');
					if (sector) {
						table_sectors[sector].addClass(classes.hover);
					}
				}
			},
			function () {
				hovering = 0;
				var $this = $(this),
					cells = getButtonCells($this);
				for (var i = 0, len = cells.length; i < len; i++) {
					cells[i].removeClass(classes.hover);
				}
				var sector = $this.data('sector');
				if (sector) {
					table_sectors[sector].removeClass(classes.hover);
				}
			}
		).mousedown(function (e) {
			var numbers = [];
			if (typeof $(this).data('sector') != 'undefined') {
				console.log("SECTOR " + $(this).data('sector'));

				if (e.button == 2) {	betFixArray.push({id:36 + $(this).data('sector'),amount:-1})
				ChangeBet(36 + $(this).data('sector'), -1);}
				// else ChangeBet(36+$(this).data('sector'),+1);
				else{
					betFixArray.push({id:36 + $(this).data('sector'),amount:CurrentTier})
					ChangeBet(36 + $(this).data('sector'), CurrentTier);
			
			}
				// else ChangeBet(36+$(this).data('sector'),CurrentTier);
			}
			else {
				numbers = $(this).data('num');

				if (typeof numbers.length === 'undefined') numbers = [numbers];
				else numbers = numbers.split(',');

				if (e.button == 2) for (var i = 0; i < numbers.length; i++){ChangeBet(numbers[i], -1);			
							betFixArray.push({id:numbers[i],amount:-1})
			}
				// else for(var i=0;i<numbers.length;i++)ChangeBet(numbers[i],+1);
				else for (var i = 0; i < numbers.length; i++) {ChangeBet(numbers[i], CurrentTier);
					betFixArray.push({id:numbers[i],amount:CurrentTier})
				}
				// else ChangeBet(36+$(this).data('sector'),CurrentTier);
			}
		});
	})();

	document.oncontextmenu = function () { if (hovering) return false; };

})(jQuery);

window.addEventListener('resize', function (event) {

		if(document.body.clientWidth<800)	document.getElementById("containerTable").style.width="100%"
		else document.getElementById("containerTable").style.width="unset"


		if(document.body.clientWidth<800)	document.getElementById("supercontainer").style.width="100%"
		else document.getElementById("supercontainer").style.width="unset"

	

	let offRoulette = document.getElementsByClassName("roulette")[0].offsetWidth;

	// -10 : 775 = x : offRoulette


	let zeroOffset = document.getElementsByClassName("num green zero")[0]
	let numberfix = document.querySelector("[dim-fix-number]");



	// 	let spanList = document.getElementsByClassName("span")
	let controlList = document.querySelectorAll("[data-num]");

	let sectorList = document.querySelectorAll("div[data-type='sector']");



	for (let i = 0; i < controlList.length; i++) {


		let attr = controlList[i].getAttribute("data-num");
		let offCol = (controlList[i].parentElement.parentElement.className).replace(/col/, "")
		// console.log(attr.split(",").length==0)

		if (attr.split(",").length == 1) {

			if (controlList[i].getAttribute("data-num") == "0") {
				controlList[i].style.height = zeroOffset.clientHeight;
				controlList[i].style.width = zeroOffset.clientWidth;

			} else {
				controlList[i].style.height = numberfix.clientHeight;
				controlList[i].style.width = numberfix.clientWidth;

			}

			controlList[i].style.left = +(document.getElementsByClassName("num green zero")[0].offsetWidth + ((+offCol - 1) * numberfix.clientWidth)) + (2 * (offCol));

			// if(+(attr.split(",")[0])>12)
			// controlList[i].style.marginLeft=-12 //	(- 2*offCol )
			// else  controlList[i].style.marginLeft=-2 

			controlList[i].style.marginLeft = -9

			console.log(document.getElementsByClassName("num green zero")[0].offsetWidth)

		}


		if (attr.split(",").length == 2) {


			// controlList[i].style.height= numberfix.clientHeight ;
			// controlList[i].style.width= numberfix.clientWidth ;

			controlList[i].style.left = +(document.getElementsByClassName("num green zero")[0].offsetWidth + ((+offCol - 1) * numberfix.clientWidth));

			// if(+(attr.split(",")[0])>12)
			// controlList[i].style.marginLeft=-12 //	(- 2*offCol )
			// else  controlList[i].style.marginLeft=-2 

			// controlList[i].style.marginLeft=-9


		}


		if (attr.split(",").length == 4) {

			controlList[i].style.zIndex = 15;

			controlList[i].style.left = +(document.getElementsByClassName("num green zero")[0].offsetWidth + ((+offCol - 1) * numberfix.clientWidth));


		}

		if (attr.split(",").length == 3) {

			controlList[i].style.zIndex = 15;

			controlList[i].style.left = +(document.getElementsByClassName("num green zero")[0].offsetWidth + ((+offCol - 1) * numberfix.clientWidth));


		}


		if (attr.split(",").length == 6) {

			controlList[i].style.zIndex = 16;

			controlList[i].style.left = +(document.getElementsByClassName("num green zero")[0].offsetWidth + ((+offCol - 1) * numberfix.clientWidth));


		}

	}


	for (let i = 0; i < sectorList.length; i++) {


		let offCol = (sectorList[i].parentElement.parentElement.className).replace(/col/, "")





		if (sectorList[i].getAttribute("data-sector") > 3 && sectorList[i].getAttribute("data-sector") < 7) {

			sectorList[i].style.height = document.querySelector("[dim-fix-sectordown='true']").offsetHeight;
			sectorList[i].style.width = document.querySelector("[dim-fix-sectordown='true']").offsetWidth;
			sectorList[i].style.marginLeft = 0;




			if (sectorList[i].getAttribute("data-sector") == 5)
				sectorList[i].style.left = +(document.getElementsByClassName("num green zero")[0].offsetWidth + ((1) * document.querySelector("[dim-fix-sectordown='true']").offsetWidth));

			else if (sectorList[i].getAttribute("data-sector") == 4) {
				sectorList[i].style.left = +(document.getElementsByClassName("num green zero")[0].offsetWidth + ((+offCol - 1) * document.querySelector("[dim-fix-sectordown='true']").offsetWidth));

			}
			else {
				sectorList[i].style.left = +(document.getElementsByClassName("num green zero")[0].offsetWidth + ((2) * document.querySelector("[dim-fix-sectordown='true']").offsetWidth));

			}


		} else if (sectorList[i].getAttribute("data-sector") > 6 && sectorList[i].getAttribute("data-sector") < 13) {

			sectorList[i].style.height = document.querySelector("[dim-fix-red='true']").offsetHeight;
			sectorList[i].style.width = document.querySelector("[dim-fix-red='true']").offsetWidth;
			sectorList[i].style.marginLeft = 0;

			sectorList[i].style.left = +(document.getElementsByClassName("num green zero")[0].offsetWidth + ((sectorList[i].getAttribute("data-sector") - 7) * document.querySelector("[dim-fix-red='true']").offsetWidth));

		} else {





			sectorList[i].style.height = numberfix.clientHeight;
			sectorList[i].style.width = numberfix.clientWidth;

			sectorList[i].style.left = +(document.getElementsByClassName("num green zero")[0].offsetWidth + ((+offCol - 1) * numberfix.clientWidth)) + (2 * (offCol));

			style = getComputedStyle(sectorList[i]);
			console.log(style.top)


			// if(+(attr.split(",")[0])>12)
			// controlList[i].style.marginLeft=-12 //	(- 2*offCol )
			// else  controlList[i].style.marginLeft=-2 

			sectorList[i].style.marginLeft = -9

			console.log(document.getElementsByClassName("num green zero")[0].offsetWidth)
		}



	}



	// console.log()


	// var divs = document.getElementsByTagName("div");
	// for (var i = 0; i < divs.length; i++) {
		
	// 	var attr = divs[i].getAttribute("data-num");
	// 	if (attr == null) {
	// 		attr = divs[i].getAttribute("data-sector");
	// 		if (attr == null) continue;
	// 		var index = 36 + parseInt(attr);

	// 		var rekt = divs[i].getBoundingClientRect();
	// 		squares[index] = new Array(2);
	// 		squares[index][1] = rekt.top + 10+document.getElementsByTagName("body")[0].scrollTop;
	// 		squares[index][0] = rekt.left + 16;
	// 	} else {
	// 		if (attr.indexOf(',') != -1) continue;
	// 		var rekt = divs[i].getBoundingClientRect();
	// 		squares[attr] = new Array(2);
	// 		squares[attr][1] = rekt.top + 10+document.getElementsByTagName("body")[0].scrollTop;
	// 		squares[attr][0] = rekt.left + 16;
	// 	}
	// }

	

	// var bets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	// var tb = TotalBets();

	// UpdateBalance();

	// for(let i = 0;i<betFixArray.length;i++){
	// 	ChangeBet(betFixArray[i].id,betFixArray[i].amount);
	// }


	// betFixArray=[];



});



$(window).on('resize', function(e) {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(async function() {
console.log("ciao")
	var divs = document.getElementsByTagName("div");
	for (var i = 0; i < divs.length; i++) {
		
		var attr = divs[i].getAttribute("data-num");
		if (attr == null) {
			attr = divs[i].getAttribute("data-sector");
			if (attr == null) continue;
			var index = 36 + parseInt(attr);

			var rekt = divs[i].getBoundingClientRect();
			squares[index] = new Array(2);
			squares[index][1] = rekt.top + 10+document.getElementsByTagName("body")[0].scrollTop;
			squares[index][0] = rekt.left + 16;
		} else {
			if (attr.indexOf(',') != -1) continue;
			var rekt = divs[i].getBoundingClientRect();
			squares[attr] = new Array(2);
			squares[attr][1] = rekt.top + 10+document.getElementsByTagName("body")[0].scrollTop;
			squares[attr][0] = rekt.left + 16;
		}
	}
	//  bets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	// UpdateBalance();

	resetBetsAndFiches();

	for(let i = 0;i<betFixArray.length;i++){
		console.log("okBetfix");
		// await delay(1000);
		 ChangeBet(betFixArray[i].id,betFixArray[i].amount,false);
	}

	console.log(betFixArray);


	//  betFixArray=[];
    // Run code here, resizing has "stopped"
            
  }, 250);

});

// window.addEventListener('resize', function(event) {
//     (function($) {

// 		// table
// 		(function() {
// 			"use strict"

// 			function getButtonCells(btn) {
// 				var cells = btn.data('cells');
// 				if (!cells || !cells.length) {
// 					cells = [];
// 					switch (btn.data('type')) {
// 						case 'sector':
// 							var nums = sectors[btn.data('sector')];
// 							for (var i = 0, len = nums.length; i < len; i++) {
// 								cells.push(table_nums[nums[i]]);
// 							}
// 							return cells;
// 							break;
// 						case 'num':
// 						default:
// 							var nums = String(btn.data('num')).split(',');
// 							for (var i = 0, len = nums.length; i < len; i++) {
// 								cells.push(table_nums[nums[i]]);
// 							}
// 							btn.data('cells', cells)
// 							return btn.data('cells');
// 							break;
// 					}
// 				}
// 				return cells;
// 			};

// 			// props
// 			var active = true,
// 				selectors = {
// 					roulette : '.roulette',
// 					num : '.num',
// 					sector : '.sector',
// 					table_btns : '.controlls .btnRoulette'
// 				},
// 				classes = {
// 					red : 'red',
// 					black : 'black',
// 					green : 'green',
// 					hover : 'hover'
// 				},
// 				numbers = {
// 					red : [],
// 					black : [],
// 					green : []
// 				},
// 				sectors = {
// 					'1' : [], // 1st row
// 					'2' : [], // 2nd row
// 					'3' : [], // 3rd row
// 					'4' : [], // 1st 12
// 					'5' : [], // 2nd 12
// 					'6' : [], // 3rd 12
// 					'7' : [], // 1 to 18
// 					'8' : [], // EVEN
// 					'9' : [], // RED
// 					'10' : [], // BLACK
// 					'11' : [], // ODD
// 					'12' : [], // 19 to 36
// 				},
// 				table_nums = {},
// 				table_sectors = {};

// 			// init
// 			$(selectors.num).each(function() {
// 				var $this = $(this),
// 					color,
// 					num = Number($this.text());
// 				// add to instances array
// 				table_nums[num] = $this;
// 				// add to colors array
// 				for (var color in numbers) {
// 					if ($this.hasClass(classes[color])) {
// 						numbers[color].push(num);
// 						$this.data('color', color);
// 					}
// 				}
// 			})

// 			$(selectors.sector).each(function() { 
// 				var $this = $(this),
// 					color;
// 				if ($this.hasClass(classes.red)) {
// 					color = 'red';
// 				} else if ($this.hasClass(classes.black)) {
// 					color = 'black';
// 				} else {
// 					color = 'sector';
// 				}
// 				$this.data('color', color);
// 				table_sectors[$this.data('sector')] = $this;
// 			});

// 			// sort numbers
// 			for (var color in numbers) {
// 				numbers[color].sort(function(a, b) { return a - b; });
// 			}

// 			// populate sectors
// 			for (var i = 1; i <= 36; i++) {
// 				// 1st row, 2nd row, 3rd row
// 				switch (i%3) {
// 					case 0:
// 						sectors['1'].push(i);
// 						break;
// 					case 1:
// 						sectors['3'].push(i);
// 						break;
// 					case 2:
// 						sectors['2'].push(i);
// 						break;
// 				}

// 				// 1st 12, 2nd 12, 3rd 12
// 				if (i <= 12) {
// 					sectors['4'].push(i);
// 				} else if (i <= 24) {
// 					sectors['5'].push(i);
// 				} else {
// 					sectors['6'].push(i);
// 				}

// 				// 1 to 18, 19 to 36
// 				if (i <= 18) {
// 					sectors['7'].push(i);
// 				} else {
// 					sectors['12'].push(i);
// 				}

// 				// ODD, EVEN
// 				if (i%2) {
// 					sectors['11'].push(i);
// 				} else {
// 					sectors['8'].push(i);
// 				}

// 				if (numbers.red.indexOf(i) != -1) {
// 					sectors['9'].push(i);
// 				} else if (numbers.black.indexOf(i) != -1) {
// 					sectors['10'].push(i);
// 				}
// 			}

// 			// buttons
// 			var table_btns = $(selectors.table_btns).hover(
// 				function() {
// 					hovering=1;
// 					if (active) {
// 						var $this = $(this),
// 							cells = getButtonCells($this);
// 						for (var i = 0, len = cells.length; i < len; i++) {
// 							cells[i].addClass(classes.hover);
// 						}
// 						var sector = $this.data('sector');
// 						if (sector) {
// 							table_sectors[sector].addClass(classes.hover);
// 						}
// 					}
// 				},
// 				function() {
// 					hovering=0;
// 					var $this = $(this),
// 						cells = getButtonCells($this);
// 					for (var i = 0, len = cells.length; i < len; i++) {
// 						cells[i].removeClass(classes.hover);
// 					}
// 					var sector = $this.data('sector');
// 					if (sector) {
// 						table_sectors[sector].removeClass(classes.hover);
// 					}
// 				}
// 			).mousedown(function(e) {
// 				var numbers=[];
// 				if(typeof $(this).data('sector') != 'undefined'){
// 					console.log("SECTOR "+$(this).data('sector'));

// 					if(e.button==2)ChangeBet(36+$(this).data('sector'),-1);
// 					// else ChangeBet(36+$(this).data('sector'),+1);
// 					else ChangeBet(36+$(this).data('sector'),CurrentTier);
// 					// else ChangeBet(36+$(this).data('sector'),CurrentTier);
// 				}
// 				else{
// 					numbers=$(this).data('num');

// 					if(typeof numbers.length ==='undefined')numbers=[numbers];
// 					else numbers=numbers.split(',');

// 					if(e.button==2)for(var i=0;i<numbers.length;i++)ChangeBet(numbers[i],-1);
// 					// else for(var i=0;i<numbers.length;i++)ChangeBet(numbers[i],+1);
// 					else for(var i=0;i<numbers.length;i++)ChangeBet(numbers[i],CurrentTier);
// 					// else ChangeBet(36+$(this).data('sector'),CurrentTier);
// 				}
// 			});
// 		})();

// 	document.oncontextmenu = function() {if(hovering)return false;};

// 	})(jQuery);
// }, true);

// var squares=new Array(48);
var divs = document.getElementsByTagName("div");
for (var i = 0; i < divs.length; i++) {
	var attr = divs[i].getAttribute("data-num");
	if (attr == null) {
		attr = divs[i].getAttribute("data-sector");
		if (attr == null) continue;
		var index = 36 + parseInt(attr);

		var rekt = divs[i].getBoundingClientRect();
		squares[index] = new Array(2);
		squares[index][1] = rekt.top + 10 + document.getElementsByTagName("body")[0].scrollTop;
		squares[index][0] = rekt.left + 16;
	} else {
		if (attr.indexOf(',') != -1) continue;
		var rekt = divs[i].getBoundingClientRect();
		squares[attr] = new Array(2);
		squares[attr][1] = rekt.top + 10 + document.getElementsByTagName("body")[0].scrollTop;
		squares[attr][0] = rekt.left + 16;
	}
}



function resetBetsAndFiches() {
	for (var i = 0; i < bets.length; i++) {
		bets[i] = 0;
		if (chips[i] != null) for (var j = 0; chips[i].length > 0; j++)document.body.removeChild(chips[i].pop());
	}
}

function Reset() {


	for (var i = 0; i < bets.length; i++) {
		bets[i] = 0;
		if (chips[i] != null) for (var j = 0; chips[i].length > 0; j++)document.body.removeChild(chips[i].pop());
	}



	ball.css("animation", "ballReset");
	ball.style = "";
	wrap.css("transform", "rotate(0deg)");
	wrap.animate({ $blah: 0 }, {

		start: function (promise) {

		},

		step: function (now, fx) {
			now = 0;


			$(this).css('transform', `rotate(${now}deg)`);
			i = i + 3;
		}, duration: 0,
		complete: function () {
			wrap.css("animation", "stop");
		}

	});

}

function TotalBets() {
	var r = 0;
	for (var i = 0; i < bets.length; i++)r += bets[i];
	return r;
}

function rInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var chips = new Array(48);
var img;
function ChangeBet(id, amount,updateBal=true) {
	console.log("click bet")
	console.log("id: " + id);
	if (updateBal && balance - amount < 0) {
		//maybe some beep

		new AWN().warning('Credito insufficiente', { labels: { warning: "Info" }, durations: { warning: 3000 } });

		var audio = new Audio('./assets/sounds/error.mp3');
		audio.play();
		return;
	}

	if (amount > 0) {
		img = document.createElement('img');
		img.setAttribute("fiches",true)

		switch (fichesSelezionata) {
			case 0.1:
				img.src = "img/fiches1-modified.png";
				CurrentTier = tiers[0];
				break;
			case 0.5:
				img.src = "img/fiches1-modified\ \(1\).png";
				CurrentTier = tiers[1];
				break;
			case 1:
				img.src = "img/fiches1-modified\ \(2\).png";
				CurrentTier = tiers[2];
				break;
			case 5:
				img.src = "img/fiches1-modified\ \(3\).png";
				CurrentTier = tiers[3];
				break;
			case 25:
				img.src = "img/fiches2-modified.png";
				CurrentTier = tiers[4];
				break;
			case 100:
				img.src = "img/fiches2-modified\ \(1\).png";
				CurrentTier = tiers[5];
				break;
		}
		img.style.zIndex = "0";
		img.style.position = "absolute";

		var rX = rInt(-16, 16);
		var rY = rInt(-16, 16);

		img.style.left = (squares[id][0] + rX) + "px";
		img.style.top = (squares[id][1] + rY) + "px";

		img.style.width = "20px";
		img.style.pointerEvents = "none";

		document.body.appendChild(img);

		if (chips[id] == null) chips[id] = new Array(0);
		chips[id].push(img);
		var audio = new Audio('./assets/sounds/fiches.mp3');
		audio.play();
	} if (amount < 0 && chips[id] != null && chips[id].length > 0) document.body.removeChild(chips[id].pop());

	bets[id] += amount;
	console.log("balance" + balance);
	balance = balance - CurrentTier;
	console.log("balance" + balance);
	if (bets[id] < 0) bets[id] = 0;

	if(updateBal)
	UpdateBalance();
}

function UpdateBalance() {
	var e = document.getElementById("saldo");
	e.innerHTML = "Saldo: " + balance.toFixed(2) + " EUR";
	var tb = TotalBets();

	if (tb > 0) e.innerHTML += " (" + tb.toFixed(2) + ")";
}

function Place(data) {
	var bet = 0, differenza = 0;
	for (var i = 0; i < bets.length; i++)if (bets[i] != 0) bet += bets[i];

	if (bet > balance) {
		differenza = balance - bet;
		balance = balance + bet;
		console.log("insufficiente", balance);
		UpdateBalance();
		return;
	}

	var result = data

	var win = 0, win2 = 0;
	if (bets[result] != 0) win += bets[result] * 36;
	for (var i = 37; i < bets.length; i++)if (bets[i] != 0) win += bets[i] * sectormultipliers[i - 37][result];
	win2 = win;
	win -= bet;
	var betdiv = document.getElementById("result");
	var vintos;
	if (win >= bet || win2 > 0) vintos = true;
	else vintos = false;
	lanciaPallina(result, vintos);

}
var bets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var balance = 0;
// startbalance();
function startBalance(balanceInput, betsInput) {

	balance = +balanceInput;
	bets = betsInput;
	var e = document.getElementById("saldo");
	e.innerHTML = "Saldo: " + balance.toFixed(2) + " EUR";
}

var CurrentTier;

var tiers = [
	0.1,
	0.5,
	1,
	5,
	25,
	100
];

var sectors = [
	"3rd column",
	"2nd column",
	"1st column",
	"1st 12",
	"2nd 12",
	"3rd 12",
	"1 to 18",
	"Even",
	"Red",
	"Black",
	"Odd",
	"19 to 36"
];

var hovering = 0;
var rossi = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, , 21, 23, 25, 27, 30, 32, 34, 36];
var neri = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
var sectormultipliers = [
	[0, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3],//3rd column
	[0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0],//2nd column
	[0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0, 3, 0, 0],//1st column
	[0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//1st 12
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//2nd 12
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],//3rd 12
	[0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//1 to 18
	[0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2],//even
	[0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 2],//Red
	[0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 2, 0, 2, 0, 2, 0, 2, 0],//Black
	[0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0],//odd
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2] //19 to 36
];





function lanciaPallina(result) {
	var audio = new Audio('./assets/sounds/rouletteSpin.mp3');
	audio.play();
	// socket.emit('pallina', "HO LANCIATO LA PALLINA!");
	// socket.emit('puntate', bets);
	$(".flex-item").off();
	throwBall.off();
	let winningNumber = result;
	let rotation = degrees[winningNumber];
	let i = 0;
	var numero = 5;
	var valore = 1;
	//The following code found using the following link to push values into transform keyframe http://jsfiddle.net/LTNPs/2706/
	ball.css("animation", "ballDrop 6s forwards ease-in-out");
	//console.log(rotation,winningNumber);
	wrap.animate({ $blah: rotation }, {

		start: function (promise) {

		},

		step: function (now, fx) {



			$(this).css('transform', `rotate(${now}deg)`);
			i = i + 3;
		}, duration: 10000,
		complete: function () {


			//TODO SHOW MODAL WIN

			if ((lastWin || lastWin == 0) && bets) {
				console.log("fine vincita mex", lastWin)

			}
			betFixArray=[];
			updateWin(newBalance);


			$('#my-table tr').each(function () {
				let str = "";
				if (rossi.indexOf(winningNumber) == -1) str = "<td id=\"" + numero + "\">" + winningNumber + "</td>";
				else str = "<td class=\"" + "red" + "\"" + " id=\"" + numero + "\">" + winningNumber + "</td>";
				numero++;
				$(this).append(str);
				if (document.getElementById("my-table").children[0].children[0].children[0]) document.getElementById("my-table").children[0].children[0].children[0].remove();

				valore++
			});


			wrap.css("animation", "stop");
		}

	});






	$('#addRowChild').click(function () {
		$('#my-table tbody').append(`<tr>${$('#default-row').html()}</tr>`);
	});
}




//parte relativa alle fiches


var fichesSelezionata = 0;
document.getElementsByClassName('fiche')[0]
	.addEventListener('click', function (event) {
		ingrandiscifiche(0);
		fichesSelezionata = 0.1;

	});
document.getElementsByClassName('fiche')[1]
	.addEventListener('click', function (event) {
		ingrandiscifiche(1);
		fichesSelezionata = 0.5;

	});
document.getElementsByClassName('fiche')[2]
	.addEventListener('click', function (event) {
		ingrandiscifiche(2);
		fichesSelezionata = 1;

	});
document.getElementsByClassName('fiche')[3]
	.addEventListener('click', function (event) {
		ingrandiscifiche(3);
		fichesSelezionata = 5;

	});
document.getElementsByClassName('fiche')[4]
	.addEventListener('click', function (event) {
		ingrandiscifiche(4);
		fichesSelezionata = 25;

	});
document.getElementsByClassName('fiche')[5]
	.addEventListener('click', function (event) {
		ingrandiscifiche(5);
		fichesSelezionata = 100;

	});
function ingrandiscifiche(index) {
	let i;

	for (i = 0; i < 6; i++) {

		if (i == index) {
			console.log(i + " " + index);
			document.getElementsByClassName('fiche')[index].style.width = "60px";
			document.getElementsByClassName('fiche')[index].style.height = "60px";
			CurrentTier = tiers[index];

		} else {
			document.getElementsByClassName('fiche')[i].style.width = "40px";
			document.getElementsByClassName('fiche')[i].style.height = "40px";
		}
	}
}


const data = document.getElementById("ora");


function updateClock() {
	let h = new Date().getHours();
	let m = new Date().getMinutes();
	let s = new Date().getSeconds();
	let ampm = "AM";

	if (h > 12) {
		h = h - 12;
		ampm = "PM";
	}

	h = h < 10 ? "0" + h : h;
	m = m < 10 ? "0" + m : m;
	s = s < 10 ? "0" + s : s;
	let testo = "Ora:" + h + ":" + m + ":" + s

	data.innerText = testo;

	setTimeout(() => {
		updateClock();
	}, 1000);
}

updateClock();


// function vincita(vittoria) {
// 	updateWin(vittoria.winat);
// }




function updateWin(cifra) {
	balance = cifra;
	var e = document.getElementById("saldo");
	e.innerHTML = "Saldo: " + cifra.toFixed(2) + " EUR";
	var tb = TotalBets();

	if (tb > 0) e.innerHTML += " (" + tb.toFixed(2) + ")";
	console.log("valore del balance" + balance);
}

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
  }