/*
	Written by Stanko
	RocketPageFlip
	https://github.com/Stanko/rocketPageFlip
	http://www.rocketlaunch.me
*/

var RocketPageFlip;

RocketPageFlip = function(selector, options){
	var defaultOptions = {
		current: 0, // page to display
		navigation: true, // show pagination
		directionalNav: true, // show prev/next navigation buttons
		prevText: 'prev', // text for prev button
		nextText: 'next' // text for next button
	};

	this.rotating = false;

	options = options || {};

	this.options = $.extend(defaultOptions, options);

	// Main elements
	this.el = {
		main: $(selector)
	};

	this.el.pages = this.el.main.find('> .page');

	this.init();
};

RocketPageFlip.prototype.init = function() {
	this.isModernBrowser = this.supports('Transition') && this.supports('Transform') && this.supports('Perspective');

	this.buildNavigation();

	this.showCurrent();
};

RocketPageFlip.prototype.supports = function(prop) {
	var div = document.createElement('div'),
		vendors = 'Khtml Ms O Moz Webkit'.split(' '),
		len = vendors.length;

	if (prop in div.style) {
		return true;
	}

	prop = prop.replace(/^[a-z]/, function(val) {
		return val.toUpperCase();
	});

	while(len--) {
		if ( vendors[len] + prop in div.style ) {
			// browser supports box-shadow. Do what you need.
			// Or use a bang (!) to test if the browser doesn't.
			return true;
		}
	}
	return false;
};


RocketPageFlip.prototype.buildNavigation = function() {
	var self = this, prev, next, navigation, i;

	// Build prev/next buttons
	if(this.options.directionalNav){
		prev = $('<a>')
			.html(this.options.prevText)
			.addClass('flip-directional flip-prev')
			.attr('href', '#')
			.click(function(e){
				e.preventDefault();
				if(!self.rotating){
					self.prev();
				}
			});

		next = $('<a>')
			.html(this.options.nextText)
			.addClass('flip-directional flip-next')
			.attr('href', '#')
			.click(function(e){
				e.preventDefault();
				if(!self.rotating){
					self.next();
				}
			});

		this.el.main.append(prev, next);
	}

	// Build pagination
	if(this.options.navigation){
		navigation = $('<div>').addClass('flip-navigation');

		i = 0;
		this.el.pages.each(function(){
			navigation.append($('<a>').attr('href', '#').data('page', i));
			i++;
		});

		navigation.find('a').click(function(e){
			e.preventDefault();
			if(!self.rotating){
				self.flip($(this).data('page'));
			}
		});

		this.el.navigation = navigation;
		this.el.main.append(navigation);
	}
};

RocketPageFlip.prototype.showCurrent = function() {
	var self = this;

	this.el.pages.hide().eq(this.options.current).show();

	if(this.options.navigation){
		self.el.navigation.find('a')
			.removeClass('active')
			.eq(this.options.current)
			.addClass('active');
	}
};

RocketPageFlip.prototype.flip = function(page) {
	var backwards,
		prev,
		next,
		leftHalf,
		rightHalf,
		flipPart,
		flipPartFront,
		flipPartBack,
		halfOverlay,
		pageOverlay,
		self = this;

	prevPage = this.options.current;

	if(prevPage === page){
		return;
	}
	if(page >= this.el.pages.length){
		page = 0;
	}
	if(page < 0){
		page = this.el.pages.length-1;
	}

	this.options.current = page;

	if(!this.isModernBrowser){
		this.showCurrent();
		return;
	}

	backwards = page < prevPage;

	halfOverlay = $('<div>').addClass('dark-overlay');
	pageOverlay = $('<div>').addClass('dark-overlay page-overlay darken');


	prev = this.el.pages.eq(this.options.current);
	next = this.el.pages.eq(prevPage);

	flipPartFront = $('<div>').addClass('side side-front').append(prev.clone());
		flipPartBack = $('<div>').addClass('side side-back').append(next.clone());

	if(backwards){
		rightHalf = $('<div>').addClass('half half-right').append(next.clone(), halfOverlay);
	}
	else{
		leftHalf = $('<div>').addClass('half half-left').append(next.clone(), halfOverlay);
	}

	flipPart = $('<div>').addClass('flip-part').append(flipPartFront, flipPartBack);

	if(backwards){
		flipPart.addClass('flipped');
	}
	else{
		flipPart.addClass('flip-reverse');
	}

	this.el.main.append(leftHalf, rightHalf, flipPart, pageOverlay);

	this.showCurrent();


	setTimeout(function(){
		flipPart.toggleClass('flipped');
		halfOverlay.addClass('darken');
		pageOverlay.removeClass('darken');
	}, 50);

	this.rotating = true;


	flipPart.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e) {
		// so children doesn't trigger it
		if (e.target === flipPart.get(0)) {
			self.rotating = false;

			halfOverlay.remove();
			pageOverlay.remove();
			if(leftHalf){
				leftHalf.remove();
			}
			if(rightHalf){
				rightHalf.remove();
			}
			flipPart.remove();
		}
	});
};

RocketPageFlip.prototype.next = function() {
	this.flip(this.options.current + 1);
};

RocketPageFlip.prototype.prev = function() {
	this.flip(this.options.current - 1);
};
