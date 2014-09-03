var RocketPageFlip;

RocketPageFlip = function(selector, options){
	var defaultOptions = {
		current: 0
	};

	options = options || {};

	this.options = $.extend(defaultOptions, options);

	this.el = {
		main: $(selector),
		next: $('.next-page')
	};

	this.el.pages = this.el.main.find('> .page');

	this.init();
};

RocketPageFlip.prototype.init = function() {
	this.showCurrent();
	this.bindings();
};

RocketPageFlip.prototype.bindings = function() {
	var self = this;

	this.el.next.click(function(){
		self.next();
	});
};

RocketPageFlip.prototype.showCurrent = function() {
	this.el.pages.hide().eq(this.options.current).show();
};

RocketPageFlip.prototype.flip = function(prevPage) {
	var prev,
		next,
		leftHalf,
		rightHalf,
		flipPart,
		flipPartFront,
		flipPartBack;

	next = this.el.pages.eq(this.options.current);
    prev = this.el.pages.eq(prevPage);

	leftHalf = $('<div/>').addClass('half half-left').html(prev.clone());
	rightHalf = $('<div/>').addClass('half half-right').html(next.clone());

	flipPartFront = $('<div/>').addClass('side side-front').html(prev.clone());
	flipPartBack = $('<div/>').addClass('side side-back').html(next.clone());

	flipPart = $('<div/>').addClass('flip-part').append(flipPartFront, flipPartBack);

	this.el.main.append(leftHalf, rightHalf, flipPart);

	this.showCurrent();


	setTimeout(function(){
		flipPart.addClass('flipped');
	}, 50);

	setTimeout(function(){
		leftHalf.remove();
		rightHalf.remove();
		flipPart.remove();
	}, 1550);
};

RocketPageFlip.prototype.next = function() {
	var prevPage = this.options.current;

	this.options.current++;
	if(this.options.current >= this.el.pages.length){
		this.options.current = 0;
	}
	this.flip(prevPage);
};

RocketPageFlip.prototype.prev = function() {
	var prevPage = this.options.current;

	this.options.current--;
	if(this.options.current === this.el.pages.length){
		this.options.current = this.el.pages.length - 1;
	}
	this.flip(prevPage);
};