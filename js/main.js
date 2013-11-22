$(document).ready(function() {
	
	// Set header height
	var _headerHeight = $(window).height();
	$('header, footer').height(_headerHeight);
	
	// Position logo
	var _logoHeight = $('.header-large').height();
	var _logoPos = (_headerHeight - _logoHeight) / 2;
	
	$('.header-large').css('top', _logoPos);
	$('footer .rose').css('top', _logoPos);
	
	var roses = [];
	
	$('.rose').each(function() {
		
		var petalCount = $(this).data('petal-count');
		var petalSize = $(this).data('petal-size');
		var gravity = $(this).data('petal-gravity') ? $(this).data('petal-gravity') : 1;
		
		var rose = new Rose(petalCount, petalSize, $(this), gravity);
		
		roses.push(rose);
		
	});

	$('header').waypoint(function(direction) {
	
		if (!$('body').hasClass('fixed-header')) {
			if (direction == "down") {
				$('body').addClass('fixed-header');
				$('html, body').scrollTop(0);
				$.waypoints('refresh');
			} else {
			//	$(this).removeClass('small');
			}
		}
		
	}, {
		offset: function() {
			return -$(window).height() + 62;
		}
	});
	
});

var Rose = function(petalCount, petalSize, context, gravity) {
	
	var globals = {};
	
	// Init variables
	globals.petalCount = petalCount;
	globals.petalSize = petalSize;
	globals.gravity = gravity;
	
	globals.context = context; // context = jQ element
	
	globals.petalAngle = 360 / petalCount;
	
	var init = function() {
		drawRose();
		config();
		movePetals(0);
	//	setPositions();
	}
	
	var drawRose = function() {
		// insert markup
		var containerSize = petalSize * 2;
		var container = $('<div class="rose-container"></div>');
		
		container.css({
			'width': containerSize,
			'height': containerSize
		});
		
		globals.context.append(container);

		// draw petals
		var petalBorderRadius = petalSize / 2;
		var initPosition = petalSize / 2;
		
		for (i=0; i<globals.petalCount; i++) {

			var petal = $('<div class="rose-petal"></div>');
			petal.css({
				'width': globals.petalSize,
				'height': globals.petalSize,
				'border-radius': petalBorderRadius,
				'top': initPosition,
				'left': initPosition
			});
			container.append(petal);
		}

	};
	
	var config = function() {
		
		globals.roseContainer = globals.context.find('.rose-container');
		globals.rosePetals = globals.roseContainer.find('.rose-petal');
		
		globals.positions = [];
		
		globals.rotateInterval;
		
		var petalPiece = 2 * Math.PI / globals.petalCount;
		var petalRadius = (globals.petalSize * globals.gravity) / 2;
		var posOffset = globals.petalSize / 2;
		
		for (var radians = 0; radians < 2 * Math.PI; radians += petalPiece) {
			
			var x = (petalRadius * Math.sin(radians)) + posOffset;
			var y = (petalRadius * Math.cos(radians)) + posOffset;
			
			globals.positions.push({x: x, y: y});
			
		}
		
	};
	
	var movePetals = function(petalCount) {
		
		var movePetal = setTimeout(function() {
			
			setPosition(globals.rosePetals[petalCount], petalCount);
			
			petalCount++;
			
			if (petalCount < globals.petalCount) {
				
				movePetals(petalCount);
				
			} else {
				
				setBinds();
				
			}
			
		}, 100);

	};
	
	var setPosition = function(petal, position, interval) {
		
		var interval = typeof interval == 'undefined' ? 0 : interval;
		
		var positionObj = globals.positions[position];
		
		setTimeout(function() {
			
			$(petal).css({
				'left': positionObj.x,
				'top': positionObj.y
			});
			
			$(petal).data('petal-position', position);
			
		});
		
	};
	
	var setBinds = function() {
		
		$(globals.roseContainer).hover(function() {
			
			startRotating('clockwise', 1000);
			
		}, function() {
			
			stopRotating();
			
		});

	};
	
	var startRotating = function(direction, interval) {
		
		globals.rotateInterval = setInterval(function() {
			
			rotatePetals(direction);
			
		}, interval);
		
	};
	
	var stopRotating = function() {
		
		clearInterval(globals.rotateInterval);
		
	};
	
	var rotatePetals = function(direction) {
		
		globals.rosePetals.each(function(i) {
			
			var currentPos = $(this).data('petal-position');
			
			var nextPos;
			
			if (direction === 'clockwise') {
				
				nextPos = currentPos === 0 ? globals.positions.length - 1 : parseInt(currentPos - 1);
				
			} else {
				
				nextPos = currentPos === globals.positions.length - 1 ? 0 : parseInt(currentPos + 1);
				
			}
			
			setPosition($(this), nextPos, 0);
			
		});
		
	};
	
	init();
	
};