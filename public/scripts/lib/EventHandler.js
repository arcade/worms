/**
 * This class handles event handling and dispatching
 *
 * User: arcade
 * Date: 5/14/11
 * Time: 12:51 AM
 */

var EVENT_CLICK = 0;
var EVENT_DBLKEY = 1;
var EVENT_MOUSEMOVE = 2;
var EVENT_KEYDOWN = 3;
var EVENT_KEYUP = 4;
var EVENT_RIGHTCLICK = 5;


var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_ENTER = 13;

window.EventHandler = {};

EventHandler.queue = [];
EventHandler.queue[EVENT_CLICK] = [];
EventHandler.queue[EVENT_RIGHTCLICK] = [];
EventHandler.queue[EVENT_DBLKEY] = [];
EventHandler.queue[EVENT_MOUSEMOVE] = [];
EventHandler.queue[EVENT_KEYDOWN] = [];
EventHandler.queue[EVENT_KEYUP] = [];
EventHandler.timers = [];
EventHandler.hit = [];
EventHandler.timers[EVENT_DBLKEY] = null;
EventHandler.hit[EVENT_DBLKEY] = null;


EventHandler.bind = function(event, func) {
	if(!this.queue[event])
		throw new Error('This event is not defined');

	if(!func || typeof func != 'function')
		throw new Error('You failed to specify a valid function for this event ');

	this.queue[event].push(func);
}

EventHandler.dispatch = function(event, data) {
	for(func in this.queue[event]) {
		this.queue[event][func].apply(null, [data]);
	}
}

window.onmousedown = function (event) {
	var posX = event.clientX;
	var posY = event.clientY;

	var x = Math.round(posX / window.innerWidth * (VIEWPORT_WIDTH + SIDE_VIEW));
	var y = (VIEWPORT_HEIGHT + TOP_VIEW) - Math.round(posY / window.innerHeight * (VIEWPORT_HEIGHT + TOP_VIEW));

    if(event.which) {
        if(event.which == 3) {
            EventHandler.dispatch(EVENT_RIGHTCLICK, {x: x, y: y});
            return;
        }
    }

    if(event.button) {
        if(event.button == 2) {
            EventHandler.dispatch(EVENT_RIGHTCLICK, {x: x, y: y});
            return;
        }
    }

	EventHandler.dispatch(EVENT_CLICK, {x: x, y: y});
	return false;
}

window.oncontextmenu = function (event) {
	return false;
}

window.onmousemove = function (event) {
	EventHandler.dispatch(EVENT_MOUSEMOVE, {x: event.clientX, y: event.clientY});
}

window.onkeypress = function (event) {
	if(!this.hit[EVENT_DBLKEY])
	{
		this.hit[EVENT_DBLKEY] = true;
		this.timers[EVENT_DBLKEY] = setTimeout(function () {
			EventHandler.hit[EVENT_DBLKEY] = false;
		}, 200);
	} else {
		var keyNum = null;
		if(window.event) // IE
		{
			keyNum = event.keyCode
		}
		else if(event.which) // Netscape/Firefox/Opera
		{
			keyNum = event.which
		}

		clearTimeout(this.timers[EVENT_DBLKEY]);
		EventHandler.dispatch(EVENT_DBLKEY, keyNum);
		if (keyNum != 116)
		{
			return false;
		}
	}
}

window.onkeydown = function (event) {
	var keyNum = null;
	if(window.event) // IE
	{
		keyNum = event.keyCode
	}
	else if(event.which) // Netscape/Firefox/Opera
	{
		keyNum = event.which
	}
	EventHandler.dispatch(EVENT_KEYDOWN, keyNum);
	if (keyNum != 116)
	{
		return false;
	}
}

window.onkeyup = function (event) {
	var keyNum = null;
	if(window.event) // IE
	{
		keyNum = event.keyCode
	}
	else if(event.which) // Netscape/Firefox/Opera
	{
		keyNum = event.which
	}
	EventHandler.dispatch(EVENT_KEYUP, keyNum);
	if (keyNum != 116)
	{
		return false;
	}
}