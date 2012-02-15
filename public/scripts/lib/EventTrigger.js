/**
 * Event Trigger class that allows you to bind a custom event that will be triggered
 *
 * @author Alexandru Bularca <alexandru.bularca@synesthesia.ro>
 * @link http://www.synesthesia.ro/
 * @copyright Copyright &copy; 2008-2011 Synesthesia
 * @license http://www.synesthesia.ro/license/
 */

var EventTrigger = new Function();

EventTrigger.prototype = {
	constructor: EventTrigger,
	_listeners: {},

	bind: function (type, handler) {
		if(typeof this._listeners[type] == 'undefined') {
			this._listeners[type] = new Array();
		}

		this._listeners[type].push(handler);
	},

	fire: function(event) {
		if(typeof event == 'string') {
			event = { type: event };
		}

		if(!event.target) {
			event.target = this;
		}

		if(!event.type) {
			throw new EventException('Event object missing type property.');
		}

		if(this._listeners[event.type] instanceof Array) {
			var listeners = this._listeners[event.type];

			for(var i = 0, size = listeners.length; i < size; ++i) {
				listeners[i].call(this, event);
			}
		}
	},

	unbind: function(type, handler) {
		if(this._listeners[type] instanceof Array) {
			if(typeof handler == 'undefined') {
				this._listeners[type] = new Array();
				return;
			}

			var listeners = this._listeners[type];
			for(var i = 0, size = listeners.length; i < size; ++i) {
				if(listeners[i] === handler) {
					listeners.splice(i, 1);
					break;
				}
			}
		}
	}
}
