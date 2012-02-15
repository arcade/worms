/**
 * Created by JetBrains PhpStorm.
 * User: SFera
 * Date: 5/10/11
 * Time: 1:35 PM
 * To change this template use File | Settings | File Templates.
 */

var E = {};

E.g = 1.8;
E.w = 0;
E.af = 1;

E.changeWeather = function (value)
{
//	E.w = Math.random() * 20 - 10;
	var left = document.getElementsByClassName('left')[0];
	var right = document.getElementsByClassName('right')[0];

	if(value < 0) {
		left.style.width = Math.abs(value) + 'px';
		right.style.width = '0px';
	}
	else if (value > 0) {
		right.style.width = Math.abs(value) + 'px';
		left.style.width = '0px';
	} else {
		left.style.width = '0px';
		right.style.width = '0px';
	}

	E.w = value/100;
	window.log.debug('Changing windspeed to '+ E.w,'Weather');
	Engine.ApplyWindToAll();
};