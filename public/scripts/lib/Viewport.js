/**
 * Created by JetBrains PhpStorm.
 * User: arcade
 * Date: 5/6/11
 * Time: 3:29 AM
 */

var Viewport = {};

/**
 * Tracks mouse movement over the viewport and positions the viewport to match the changes
 *
 * @param x the horizontal position of the cursor
 * @param  y the vertical position of the cursor
 */
Viewport.track = function (x, y) {
	var width = window.innerWidth;
	var height = window.innerHeight;
	var vieaswport = document.getElementById('viewport');

	var left = Math.round((VIEWPORT_WIDTH + SIDE_VIEW) / 2 - (VIEWPORT_WIDTH + SIDE_VIEW - width) * x/width) + 'px';
	if ((VIEWPORT_HEIGHT + TOP_VIEW) > height) {
		vieaswport.style.bottom = Math.round(-(VIEWPORT_HEIGHT + TOP_VIEW - height) * (height - y) / height) + 'px';
	}

	vieaswport.style.left = left;

	for(unitId in Engine.scene.background) {
		unit = Engine.scene.background[unitId];
		unit.x = 640* unitId + 500 * x/width - 320;
	}
}