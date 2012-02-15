/**
 *  Main file
 *
 * @author Alexandru Bularca <alexandru.bularca@synesthesia.ro>
 * @link http://www.synesthesia.ro/
 * @copyright Copyright &copy; 2008-2011 Synesthesia
 * @license http://www.synesthesia.ro/license/
 */

var container = {
	terrain: null,
	effects: null,
	main: null,
	water: null,
	ui: null
}
var context = {
	terrain: null,
	effects: null,
	main: null,
	water: null
}
var explosion = {
	circle: new Array(),
	elipse: new Array(),
	text: new Array(),
	smoke: new Array(),
	smokeLight: new Array(),
	pieces: new Array(),
	sounds: new Array()
}
var explosionTexts = ['foom', 'poot', 'biff', 'pow' ];

var WORM_ACTION_SPAWN = 1;
var WORM_ACTION_WALK_COMPRESS = 2;
var WORM_ACTION_WALK_EXPAND = 3;
var WORM_ACTION_SELECT = 4;
var WORM_ACTION_SPRING = 5;
var WORM_ACTION_TELEPORT = 6;
var WORM_ACTION_UNFREEZE = 7;

var SOUND_START_ROUND = 1;
var SOUND_SUDDEN_DEATH = 2;

var WORM_SOUNDS = Array(
	WORM_ACTION_SPAWN = 'wormpop',
	WORM_ACTION_WALK_COMPRESS = 'walk-compress',
	WORM_ACTION_WALK_EXPAND = 'walk-expand',
	WORM_ACTION_SELECT = 'wormselect',
	WORM_ACTION_SPRING = 'wormspring',
	WORM_ACTION_TELEPORT = 'teleport',
	WORM_ACTION_UNFREEZE = 'unfreeze'
);

var direction = ['_left',''];
var stance = ['_down','','_up'];

var MOVE_DOWN = 0;
var MOVE_HORISONTAL = 1;
var MOVE_UP = 2;
var MOVE_RIGHT = 0;
var MOVE_LEFT = 1;

var WORM_WIDTH = 3;
var WORM_HEIGHT = 15;

var SPAWN_WORM = 0;

var worms = new Array();
var myWorm = 0;

var worm = {
	movement: new Array(),
	ideling: new Array(),
	switchWeapon: new Array(),
	weaponTargeting: new Array(),
	sounds: new Array()
}

function animateWind()
{
	var left = document.getElementsByClassName('left')[0];
	var right = document.getElementsByClassName('right')[0];
	console.log(left.style.backgroundPosition);
}

var setupViewport = function () {
	/*var viewport = document.getElementById('viewport');
	viewport.style.width = (VIEWPORT_WIDTH + SIDE_VIEW/2) + 'px';
	viewport.style.height = (VIEWPORT_HEIGHT + TOP_VIEW/2) + 'px';*/

	container.terrain = document.getElementById('terrain');
	container.effects = document.getElementById('effects');
	container.main = document.getElementById('main');
	container.water = document.getElementById('main');
	container.ui = document.getElementById('UI');

	container.terrain.width = VIEWPORT_WIDTH + SIDE_VIEW;
	container.terrain.height = VIEWPORT_HEIGHT + TOP_VIEW;

	container.effects.width = VIEWPORT_WIDTH + SIDE_VIEW;
	container.effects.height = VIEWPORT_HEIGHT + TOP_VIEW;

	container.main.width = VIEWPORT_WIDTH + SIDE_VIEW;
	container.main.height = VIEWPORT_HEIGHT + TOP_VIEW;

	container.water.width = VIEWPORT_WIDTH + SIDE_VIEW;
	container.water.height = VIEWPORT_HEIGHT + TOP_VIEW;
}

var kaboom = function(x,y,range) {

	console.log('kaboom at '+ x + ', '+ y + ' a:' + range);
	var circle = new Unit();
	circle.copyConfig(explosion.circle[range]);
	var elipse = new Unit();
	elipse.copyConfig(explosion.elipse[range]);
	circle.x = x;
	circle.y = y;
	elipse.x = x;
	elipse.y = y;

	context.terrain.globalCompositeOperation = 'destination-out';
	context.terrain.beginPath();
	context.terrain.arc(x, VIEWPORT_HEIGHT + TOP_VIEW - y, range * 25 +3, 0, Math.PI * 2, true);
	context.terrain.closePath();
	context.terrain.fill();
	context.terrain.globalCompositeOperation = 'source-atop';
	context.terrain.fillStyle = "#bfbfe5";
	context.terrain.beginPath();
	context.terrain.arc(x, VIEWPORT_HEIGHT + TOP_VIEW - y, range * 25 +8, 0, Math.PI * 2, true);
	context.terrain.closePath();
	context.terrain.fill();

	TerrainScene.sync();

	console.log('r:' + explosion.sounds[Math.ceil(Math.random()*2)]);
	AM.play(explosion.sounds[Math.ceil(Math.random()*2)]);

	circle.addTo(Engine.scene.main);
	elipse.addTo(Engine.scene.main);
}

var spawnWorm = function(x,y) {
	if (SPAWN_WORM > 5)
	{
		return;
	}
	myWorm = worms.length;
	console.log('my worm:' + myWorm);
	worms[myWorm] = new Worm();
	worms[myWorm].mass = 10;
	worms[myWorm].mainActor = true;

	worms[myWorm].speedLimit = 40;
	worms[myWorm].x =x;// Math.round(SIDE_VIEW/2 + Math.random()*1900);
	console.log('set to x:' + worms[myWorm].x);
	worms[myWorm].y = y;// TerrainScene.getHeight(worms[myWorm].x, y);
	/*if (!TerrainScene.canFitWorm(worms[myWorm].x,worms[myWorm].y))
	{
		console.log('can`t fit!');
		return;
	}*/
	console.log('set to y:' + worms[myWorm].y);
	//console.log(TerrainScene.getPixel(x,y));
	if (worms[myWorm].y == undefined)
		return;
	worms[myWorm].direction = Math.round(Math.random());
	console.log('set to direction:' + worms[myWorm].direction);
	worms[myWorm].stance = TerrainScene.getTilt(worms[myWorm].x, worms[myWorm].y, worms[myWorm].direction);
	console.log('set to stance:' + worms[myWorm].stance);
	worms[myWorm].copyConfig(worm.ideling[worms[myWorm].direction][worms[myWorm].stance]);
	worms[myWorm].addTo(Engine.scene.main);
	AM.play(worm.sounds[WORM_ACTION_SPAWN]);
	SPAWN_WORM++;
}


window.onload = function () {
	window.log = new Console('console');

	setupViewport();

	context.terrain = container.terrain.getContext('2d');
	context.main = container.main.getContext('2d');
	context.water = container.water.getContext('2d');
	context.effects = container.effects.getContext('2d');

	var map = AM.addImage('maps/cars.png', function (imageId) {
			TerrainScene.init(imageId);
	});

	var drumId = null;
	var drum = null;

	/*/
	for (var i=0;i<5000;i++) {
		drumId = AM.addImage('mapobjects/oildrum1.png');
		drum = new Unit();
		drum.model = drumId;
		drum.frameCount = 20;
		drum.currentFrame = Math.round(Math.random()*20);
		drum.frameWidth = 32;
		drum.frameHeight = 36;
		drum.x = Math.round(i % 70) * 35;
		drum.y = Math.round(i / 70) * 40;

		drum.addTo(Engine.scene.main);
	}
	/*/

	/* Load Explosion Sprites */

	for (var i = 0;i<WORM_SOUNDS.length;i++)
	{
		worm.sounds[i] =  AM.addSound('effects/' + WORM_SOUNDS[i] + '.ogg');
		console.log('loaded '+ WORM_SOUNDS[i] + ' as ' + worm.sounds[i]);
	}

	for (var i = 1;i<5;i++)
	{
		explosion.circle[i] = new Object();
		explosion.circle[i].model = AM.addImage('effects/circle' + 25*i + '.png');
		explosion.circle[i].frameWidth = 52 + 48 * (i-1);
		explosion.circle[i].frameCount = i < 3 ? 8 : 4;
		explosion.circle[i].loopType = LOOP_DESTROY;

		explosion.elipse[i] = new Object();
		explosion.elipse[i].model = AM.addImage('effects/elipse' + 25*i + '.png');
		explosion.elipse[i].frameCount = i < 3 ? 20 : 10;
		explosion.elipse[i].loopType = LOOP_DESTROY;

		explosion.text[i] = new Object();
		explosion.text[i].model = AM.addImage('effects/ex_'+ explosionTexts[i-1] + '.png');
		explosion.text[i].frameCount = i < 3 ? 20 : 12;
		explosion.text[i].loopType = LOOP_DESTROY;

		explosion.smokeLight[i] = new Object();
		explosion.smokeLight[i].model = AM.addImage('effects/smklt' + 25*i + '.png');
		explosion.smokeLight[i].loopType = LOOP_DESTROY;

		if (i<4)
		{
			explosion.sounds[i] = AM.addSound('effects/Explosion' + i + '.ogg');

			explosion.smoke[i] = new Object();
			explosion.smoke[i].model = AM.addImage('effects/smkdrk' + (10 + 10*i) + '.png');
			explosion.smoke[i].loopType = LOOP_DESTROY;
		}

	}

	explosion.circle[1].frameHeight = 48;
	explosion.circle[2].frameHeight = 98;
	explosion.circle[3].frameHeight = 144;
	explosion.circle[4].frameHeight = 193;

	explosion.elipse[1].frameWidth = 69;
	explosion.elipse[2].frameWidth = 136;
	explosion.elipse[3].frameWidth = 200;
	explosion.elipse[4].frameWidth = 264;

	explosion.elipse[1].frameHeight = 26;
	explosion.elipse[2].frameHeight = 53;
	explosion.elipse[3].frameHeight = 80;
	explosion.elipse[4].frameHeight = 106;

	/* End of explosion sprite caching */

	/* Worm sprite caching */

	for (var i = 0;i<2; i ++)
	{
		worm.movement[i] = new Array();
		for (var j = 0;j < 3; j++)
		{
			worm.movement[i][j] = new Object();
			worm.movement[i][j].model = AM.addImage('movement/walk' + direction[i] + stance[j]+ '.png');
			worm.movement[i][j].frameCount = 15;
			worm.movement[i][j].frameWidth = 31;
			worm.movement[i][j].playState = PLAYSTATE_PLAYING;
			worm.movement[i][j].loopType = LOOP_CONTINUOUS;
			worm.movement[i][j].offsetY = 5;
		}
		worm.movement[i][0].frameHeight = 30;
		worm.movement[i][1].frameHeight = 29;
		worm.movement[i][2].frameHeight = 36;
	}
	for (var i = 0;i<2; i ++)
	{
		worm.ideling[i] = new Array();
		for (var j = 0;j < 3; j++)
		{
			worm.ideling[i][j] = new Object();
			worm.ideling[i][j].model = AM.addImage('idleing/brth1' + direction[i] + stance[j]+ '.png');
			worm.ideling[i][j].frameCount = 15;
			worm.ideling[i][j].offsetY = 5;

			worm.ideling[i][j].loopType = LOOP_ZIGZAG;
		}
		worm.ideling[i][0].frameHeight = 28;
		worm.ideling[i][1].frameHeight = 28;
		worm.ideling[i][2].frameHeight = 31;

		worm.ideling[i][0].frameWidth = 24;
		worm.ideling[i][1].frameWidth = 25;
		worm.ideling[i][2].frameWidth = 21;
	}

	/*
	for (var i = 0;i<2; i ++)
	{
		worm.ideling[i] = new Array();
		for (var j = 0;j < 3; j++)
		{
			worm.ideling[i][j] = new Object();
			worm.ideling[i][j].model = AM.addImage('movement/walk' + direction[i] + stance[j]+ '.png');
			worm.ideling[i][j].frameCount = 36;
			worm.ideling[i][j].frameWidth = 31;
			worm.ideling[i][j].playState = PLAYSTATE_STOPPED;
			worm.ideling[i][j].loopType = LOOP_CONTINUOUS;
		}
		worm.ideling[i][0].frameHeight = 26;
		worm.ideling[i][1].frameHeight = 30;
		worm.ideling[i][2].frameHeight = 31;
	}

	accuse.png
	*/

	/* End of Worm sprite caching */

	drumId = AM.addImage('mapobjects/oildrum1.png');
	drum = new Unit();
	drum.model = drumId;
	drum.frameCount = 20;
	drum.frameWidth = 32;
	drum.frameHeight = 36;
	drum.x = 2366;
	drum.y = 604;
	/**/


	drum.addTo(Engine.scene.main);

	/*var crateId = AM.addImage('mapobjects/ucratev.png');
	var crate = new Unit();
	crate.model = crateId;
	crate.frameCount = 20;
	crate.frameWidth = 32;
	crate.frameHeight = 21;
	crate.x = 1350;
	crate.y = 210;

	crate.addTo(Engine.scene.main);*/


	var backId = AM.addImage('backgrounds/back_1.png');
	var back = null;

	var count = Math.round((VIEWPORT_WIDTH + SIDE_VIEW) / 640) + 1;
	for(var i = 0; i < count; i++) {
		back = new Unit();
		back.model = backId;
		back.frameCount = 1;
		back.frameWidth = 640;
		back.frameHeight = 157;
		back.x = 640 * i;
		back.y = 228;
		back.playState = PLAYSTATE_STOPPED;

		back.addTo(Engine.scene.background);
		back = null;
	}

	var waterId = AM.addImage('water/blue/layer.png');
	var water = null;
	var count = Math.round((VIEWPORT_WIDTH + SIDE_VIEW) / 256) + 1;
	for(var i = 0; i <= count; i++) {
		water = new Unit();
		water.model = waterId;
		water.currentFrame = 13;
		water.frameCount = 12;
		water.frameWidth = 256;
		water.frameHeight = 37;
		water.x = 256 * i - 210;
		water.y = 159;

		water.addTo(Engine.scene.backWater);
		water = null;
	}

	var waterId = AM.addImage('water/blue/layer.png');
	var water = null;
	var count = Math.round((VIEWPORT_WIDTH + SIDE_VIEW) / 256) + 1;
	for(var i = 0; i <= count; i++) {
		water = new Unit();
		water.model = waterId;
		water.currentFrame = 3;
		water.frameCount = 12;
		water.frameWidth = 256;
		water.frameHeight = 37;
		water.x = 256 * i - 170;
		water.y = 140;
		water.addTo(Engine.scene.backWater);
		water = null;
	}

	var waterId = AM.addImage('water/blue/layer.png');
	var water = null;
	var count = Math.round((VIEWPORT_WIDTH + SIDE_VIEW) / 256) + 1;
	for(var i = 0; i <= count; i++) {
		water = new Unit();
		water.model = waterId;
		water.currentFrame = 9;
		water.frameCount = 12;
		water.frameWidth = 256;
		water.frameHeight = 37;
		water.x = 256 * i - 150;
		water.y = 120;

		water.addTo(Engine.scene.water);
		water = null;
	}
	var count = Math.round((VIEWPORT_WIDTH + SIDE_VIEW) / 256) + 1;
	for(var i = 0; i <= count; i++) {
		water = new Unit();
		water.model = waterId;
		water.currentFrame = 7;
		water.frameCount = 12;
		water.frameWidth = 256;
		water.frameHeight = 37;
		water.x = 256 * i - 200;
		water.y = 100;

		water.addTo(Engine.scene.water);
		water = null;
	}
	for(var i = 0; i <= count; i++) {
		water = new Unit();
		water.model = waterId;
		water.frameCount = 12;
		water.frameWidth = 256;
		water.frameHeight = 37;
		water.x = 256 * i - 200;
		water.y = 80;

		water.addTo(Engine.scene.water);
		water = null;
	}

	/**/

	var falloutId = AM.addImage('environment/debris_12.png'); //debris_12
	var fallout = null;
	for(var i = 0; i < 200; i++) {
		fallout = new Unit();
		fallout.model = falloutId;
		fallout.currentFrame = Math.random() * 127;
		fallout.frameCount = 127;
		fallout.frameWidth = 17;
		fallout.frameHeight = 16;
		/*/
		fallout.x = 2500;
		fallout.y = 700;
		/*/
		fallout.x = Math.random()*3000 - 8;//2500;
		fallout.y = Math.random() * 1100 + 8;//700;
		/**/
		fallout.worldWrapping = WORLD_WRAPPED;
		fallout.airfriction = 1 + Math.random() * 5;
		fallout.speedLimit = 1 + Math.random() * 10;
		fallout.mass = 1;
		/*fallout.speed.Y = 0;
		fallout.speed.X = Math.pow(-1, parseInt(Math.random()*2)) * (parseInt(Math.random() * 5 + 1));*/
		fallout.addTo(Engine.scene.effects);
		//console.log(Engine.scene.effects.length-1);
	}

	/*/

	var falloutId = AM.addImage('environment/fallout.png'); //debris_12
	var fallout = null;
	for(var i = 0; i < 200; i++) {
		fallout = new Unit();
		fallout.model = falloutId;
		fallout.frameCount = 32;//127;
		fallout.frameWidth = 24;//17;
		fallout.frameHeight = 25;//16;
		fallout.x = Math.random()*3000;
		fallout.y = Math.random() * 1100;
		fallout.worldWrapping = WORLD_WRAPPED;
		fallout.speed.Y = -1 * (parseInt(Math.random() * 5) + 1);
		fallout.speed.X = Math.pow(-1, parseInt(Math.random()*2)) * (parseInt(Math.random() * 5 + 1));

		fallout.addTo(Engine.scene.effects);
	}
	/**/

	var cloudId = AM.addImage('environment/cloud_medium.png');
	var cloud = null;

	for(var i = 0; i < 5; i++) {
		cloud = new Unit();
		cloud.model = cloudId;
		cloud.frameCount = 20;
		cloud.frameWidth = 124;
		cloud.frameHeight = 47;
		cloud.x = Math.random()*2000 - 64;
		cloud.y = Math.random() * 50 + 1000 + 23;
		cloud.speed.set(Math.pow(-1, parseInt(Math.random())) * parseInt(Math.random() * 5), 0);
		cloud.worldWrapping = WORLD_WRAPPED_HORISONTAL;
		cloud.frameRate = 3;
		cloud.loopType = LOOP_ZIGZAG;

		cloud.addTo(Engine.scene.effects);
	}

	var cloudsId = AM.addImage('environment/clouds.png');
	var clouds = null;

	for(var i = 0; i < 5; i++) {
		clouds = new Unit();
		clouds.model = cloudsId;
		clouds.frameCount = 20;
		clouds.frameWidth = 54;
		clouds.frameHeight = 31;
		clouds.x = Math.random()*2000 - 27;
		clouds.y = Math.random() * 50 + 1000 + 15;
		clouds.speed.set(Math.pow(-1, parseInt(Math.random())) * parseInt(Math.random() * 5), 0);
		clouds.worldWrapping = WORLD_WRAPPED_HORISONTAL;
		clouds.frameRate = 3;
		clouds.loopType = LOOP_ZIGZAG;

		cloud.addTo(Engine.scene.effects);
	}

	var cloudSmallId = AM.addImage('environment/cloud_low.png');
	var cloudSmall = null;

	for(var i = 0; i < 5; i++) {
		cloudSmall = new Unit();
		cloudSmall.model = cloudSmallId;
		cloudSmall.frameCount = 20;
		cloudSmall.frameWidth = 145;
		cloudSmall.frameHeight = 72;
		cloudSmall.x = Math.random()*2000 - 72;
		cloudSmall.y = Math.random() * 50 + 1000 + 36;
		cloudSmall.speed.set(Math.pow(-1, parseInt(Math.random())) * parseInt(Math.random() * 5), 0);
		cloudSmall.worldWrapping = WORLD_WRAPPED_HORISONTAL;
		cloudSmall.frameRate = 3;
		cloudSmall.loopType = LOOP_ZIGZAG;
		cloudSmall.addTo(Engine.scene.effects);
	}


	Engine.start();

	EventHandler.bind(EVENT_MOUSEMOVE, function(event) {
		Viewport.track(event.x, event.y);
	});

	log.write('initialised successfully!!!');
	//E.changeWeather();

	EventHandler.bind(EVENT_CLICK, function(event) {
		//kaboom(event.x, event.y, 3);
		spawnWorm(event.x, event.y);
//		NetworkManager.send(MOUSE_CLICK, event, true);
	});

	EventHandler.bind(EVENT_RIGHTCLICK, function(event) {
		kaboom(event.x, event.y, 3);
		//NetworkManager.send(MOUSE_CLICK, event, true);
	});

	EventHandler.bind(EVENT_KEYDOWN, function(key) {
		console.log('User pressed: ' + key);
		switch(key)
		{
            case KEY_ENTER:
                worms[myWorm].jump();
                break;
			case KEY_RIGHT:
				if (worms[myWorm].direction != MOVE_RIGHT)
				{
					worms[myWorm].stance = 2 - worms[myWorm].stance;
					worms[myWorm].direction = MOVE_RIGHT;
				}
                worms[myWorm].copyConfig(worm.movement[worms[myWorm].direction][worms[myWorm].stance]);
                worms[myWorm].movement = MOVEMENT_STATE_RIGHT;
				break;
			case KEY_LEFT:
				if (worms[myWorm].direction != MOVE_LEFT)
				{
					worms[myWorm].stance = 2 - worms[myWorm].stance;
					worms[myWorm].direction = MOVE_LEFT;
				}
                worms[myWorm].copyConfig(worm.movement[worms[myWorm].direction][worms[myWorm].stance]);
                worms[myWorm].movement = MOVEMENT_STATE_LEFT;
				break;
			case KEY_UP:
				break;
			case KEY_DOWN:
				break;
		}
	});

	EventHandler.bind(EVENT_KEYUP, function(key) {
		console.log('User up: ' + key);
		switch(key)
		{
			case KEY_RIGHT:
				if (worms[myWorm].direction != MOVE_RIGHT)
				{

				}
                worms[myWorm].copyConfig(worm.ideling[worms[myWorm].direction][worms[myWorm].stance]);
                worms[myWorm].movement = MOVEMENT_STOPPED;
				break;
			case KEY_LEFT:
				if (worms[myWorm].direction != KEY_LEFT)
				{

				}
                worms[myWorm].copyConfig(worm.ideling[worms[myWorm].direction][worms[myWorm].stance]);
                worms[myWorm].movement = MOVEMENT_STOPPED;
				break;
			case KEY_UP:
				break;
			case KEY_DOWN:
				break;
		}
	});
}