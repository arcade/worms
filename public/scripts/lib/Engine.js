/**
 * Created by JetBrains PhpStorm.
 * User: arcade
 * Date: 5/6/11
 * Time: 1:35 AM
 */

var Engine = {};

Engine.scene = {
	terrain: [],
	main: [],
	water: [],
	effects: [],
	background: [],
	backWater: [],
	ui: []
};
Engine.lastRender = 0;
Engine.accelX = 0;
Engine.accelY = 0;
Engine.speedX = 0;
Engine.speedY = 0;

Engine.render = function () {
	context.main.clearRect(0, 0, VIEWPORT_WIDTH + SIDE_VIEW, VIEWPORT_HEIGHT + TOP_VIEW);
	context.water.clearRect(0, 0, VIEWPORT_WIDTH + SIDE_VIEW, VIEWPORT_HEIGHT + TOP_VIEW);
	context.effects.clearRect(0, 0, VIEWPORT_WIDTH + SIDE_VIEW, VIEWPORT_HEIGHT + TOP_VIEW);
	context.main.fillStyle = 'rgb(48, 58, 122)';
	context.main.fillRect(0, VIEWPORT_HEIGHT + TOP_VIEW - 120, VIEWPORT_WIDTH + SIDE_VIEW, VIEWPORT_HEIGHT + TOP_VIEW);
	context.effects.fillStyle = 'rgb(48, 58, 122)';
	context.effects.fillRect(0, VIEWPORT_HEIGHT + TOP_VIEW - 160, VIEWPORT_WIDTH + SIDE_VIEW, VIEWPORT_HEIGHT + TOP_VIEW);

	this.renderChildren(context.main, this.scene.main, 0, 0);
	this.renderChildren(context.main, this.scene.water, 0, 0);
	this.renderChildren(context.effects, this.scene.effects, 0, 0);
	this.renderChildren(context.effects, this.scene.background, 0, 0);
	this.renderChildren(context.effects, this.scene.backWater, 0, 0);
	//this.renderChildren(context.ui, this.scene.ui, 0, 0);
}

Engine.ApplyWindToAll = function() {
	this.applyWind(this.scene.effects);
	this.applyWind(this.scene.main);
}

Engine.applyWind = function (units)
{
	for(var unitId in units)
	{
		if (units[unitId].airfriction)
		{
			units[unitId].accel.set(E.g, -Math.PI/2);
			units[unitId].accel.add(Math.abs(E.w*units[unitId].airfriction), ((E.w > 0 ) ? 0 : Math.PI));
			//console.log('add('+ E.w*units[unitId].airfriction + ', ' + ((E.w > 0 ) ? 0 : Math.PI));
		}
		for(unit in units[unitId].children)
		{
			this.applyWind(units[unitId].children[unit]);
		}
	}
}

Engine.renderChildren = function (context2d, units, x, y) {
	for(var unitId in units)
	{
		var unit = units[unitId];
		try {
			context2d.drawImage(AM.images[unit.model].data, 0, unit.frameHeight * unit.currentFrame, unit.frameWidth, unit.frameHeight, unit.x + x - unit.offsetX - unit.frameWidth/2, VIEWPORT_HEIGHT + TOP_VIEW - unit.y +y - unit.offsetY - unit.frameHeight/2 , unit.frameWidth, unit.frameHeight);
			//console.log( (unit.frameHeight * unit.currentFrame) + ', ' +  unit.frameWidth + ', '+ unit.frameHeight + ', ' +  unit.x + ', ' + (VIEWPORT_HEIGHT + TOP_VIEW - unit.y) + ', ' +  unit.frameWidth + ', ' +  unit.frameHeight);
		} catch(e) {
			log.error(e);
		}
		for(unit in unit.children)
		{
			this.renderChilds(context2d, unit.children, unit.x, unit.y);
		}
		unit.update();
	}
}

Engine.start = function () {
	var FpsStats = new Stats();
	FpsStats.setMode(0);

	// Align top-left
	FpsStats.domElement.style.position = 'absolute';
	FpsStats.domElement.style.left = '0px';
	FpsStats.domElement.style.top = '0px';

	document.body.appendChild( FpsStats.domElement );

	var MsStats = new Stats();
	MsStats.setMode(0);

	// Align top-left
	MsStats.domElement.style.position = 'absolute';
	MsStats.domElement.style.left = '80px';
	MsStats.domElement.style.top = '0px';

	document.body.appendChild( FpsStats.domElement );
	document.body.appendChild( MsStats.domElement );

	log.debug('starting engine');
	requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	(function animloop() {
        FpsStats.begin();
        MsStats.begin();
	    requestAnimationFrame(animloop);
	    Engine.render();
        FpsStats.end();
        MsStats.end();
    })();
	//this.render();
	//setInterval('Engine.render()', 40);
}
