/**
 * Class NetworkManager
 *
 *
 * User: arcade
 * Date: 5/14/11
 * Time: 11:39 AM
 */

var MOUSE_CLICK = 1;
var CHANGE_WEATHER = 2;

if ("WebSocket" in window) {
	window.NetworkManager = {};

	NetworkManager.socket = new WebSocket('ws://worms.synesthesia.ro:8888');
	NetworkManager.socket.onmessage = function (event) {
		var packet = event.data;

		NetworkManager.handle(JSON.parse(packet));
	}

	NetworkManager.handlers = {};
	NetworkManager.handlers[MOUSE_CLICK] = function (data) {
		kaboom(data.x, data.y, 3);
	}
	NetworkManager.handlers[CHANGE_WEATHER] = function (data) {
		E.changeWeather(data.value);
	}

	NetworkManager.handle = function (packet) {
		var opcode = packet.opcode;
		var success = packet.success;
		var error = packet.error;
		var data = packet.data;

		if(!this.handlers[opcode]) {
			console.log('Opcode ' + opcode + ' is not implemented');
			return;
		}

		if(!success) {
			console.log('Error: ' + error);

			return;
		}

		this.handlers[opcode].apply(null, [data]);
	}

	NetworkManager.send = function(opcode, data, success) {
		if(!success)
			success = true;

		this.socket.send(JSON.stringify({opcode: opcode, success: success, data: data}) + '\r\n');
	}
}