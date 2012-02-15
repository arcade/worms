/**
 * Basic unit class, to be used when creating the actual implementations
 *
 * Created by JetBrains PhpStorm.
 * User: arcade
 * Date: 5/6/11
 * Time: 1:20 AM
 */

var LOOP_ONCE = 0;
var LOOP_CONTINUOUS = 1;
var LOOP_REVERSE = 2;
var LOOP_ZIGZAG = 3;
var LOOP_DESTROY = 4;

var PLAYSTATE_STOPPED = 0;
var PLAYSTATE_PLAYING = 1;
var PLAYSTATE_REWIND = 2;

var PHYSX_NORMAL = 0;
var PHYSX_SPIN = 1;

var WORLD_NORMAL = 0;
var WORLD_WRAPPED_HORISONTAL = 1;
var WORLD_WRAPPED_VERTICAL = 2;
var WORLD_WRAPPED = 3;

var MOVEMENT_STOPPED = 0;
var MOVEMENT_STATE_RIGHT = 1;
var MOVEMENT_STATE_LEFT = -1;

var MOVEMENT_RATE_SLOW = 15;
var MOVEMENT_RATE_NORMAL = 5;
var MOVEMENT_RATE_FAST = 5;

var MOVEMENT_STEP_SIZE = 5;

var JUMP_ANGLE = 60;
var JUMP_POWER = 200;

var FORCE_GRAVITY = 0;
var FORCE_AIR_FRICTION = 1;

var Unit = Class.create({
		initialize: function () {
			this.x = 0;
			this.y = 0;
			this.offsetX = 0;
			this.offsetY = 0;
			this.speed = new Vector(0,0);
			this.accel = new Vector(0,0);
			this.rotationCenterX = 0;
			this.rotationCenterY = 0;
			this.rotationAngle = 0;
			this.rotationSpeed  = 0;
			this.rotationAccel = 0;
			this.rotationLength = 0;
			this.orientation = 0;
			this.airfriction = 0;
			this.speedLimit = 0;
			this.density = 1;
			this.mass = 0;
			this.elasticity = 0.5; // collision reflexion
			this.hasCollision = true;
			this.worldWrapping = WORLD_NORMAL;
			this.children = new Array();

			this.parent = null;
			this.model = 0;
			this.frameCount = 0;
			this.currentFrame = 0;
			this.frameWidth = 0;
			this.frameHeight = 0;
			this.physxMode = PHYSX_NORMAL;
			this.frameRate = 1;
			this.counter = 0;
			this.loopType = LOOP_CONTINUOUS;
			this.playState = PLAYSTATE_PLAYING;

            this.movement = MOVEMENT_STOPPED;
            this.movementStep = 0;
            this.movementRate = MOVEMENT_RATE_NORMAL;

            this.mainActor = false;

		},
		copyConfig: function( cfg) {
			if (cfg.model != undefined) {
				this.model = cfg.model;
			}
			if (cfg.frameCount != undefined) {
				this.frameCount = cfg.frameCount;
			}
			if (cfg.frameWidth != undefined) {
				this.frameWidth = cfg.frameWidth;
			}
			if (cfg.frameHeight != undefined) {
				this.frameHeight = cfg.frameHeight;
			}
			if (cfg.loopType != undefined) {
				this.loopType = cfg.loopType;
			}
			if (cfg.playState != undefined)	{
				this.playState = cfg.playState;
			}
			if (cfg.offsetX != undefined)	{
				this.offsetX = cfg.offsetX;
			}
			if (cfg.offsetY != undefined)	{
				this.offsetY = cfg.offsetY;
			}
		},
		animate: function () {
			if (this.playState == PLAYSTATE_STOPPED)
			return;
			this.counter++;
			if (this.counter == this.frameRate)
			{
				this.counter = 0;
				//window.log.error('wtf','rendering');
			}
			else
			{
				return;
			}

			switch (this.loopType)
			{
				case LOOP_CONTINUOUS:
					if(this.currentFrame >= this.frameCount-1) {
						this.currentFrame = 0;
					}
					break;
				case LOOP_REVERSE:
					if(this.currentFrame == 0) {
						this.currentFrame = this.frameCount-1;
					}
					break;
				case LOOP_ZIGZAG:
					if (this.currentFrame == 0) {
						this.playState = PLAYSTATE_PLAYING;
					}
					if (this.currentFrame>= this.frameCount-1) {
						this.playState = PLAYSTATE_REWIND;
					}
					break;
				case LOOP_DESTROY:
					if(this.currentFrame >= this.frameCount-1) {
						this.destroy();
					}
					break;
			}
			switch(this.playState)
			{
				case PLAYSTATE_PLAYING:
					this.currentFrame++;
					break;
				case PLAYSTATE_REWIND:
					this.currentFrame--;
					break;
			}
		},
		updatePhysx: function (){
			switch (this.physxMode)
			{
				case PHYSX_NORMAL:
                    if (this.mainActor)
                    {
                        var ty = TerrainScene.getHeight(this.x , this.y);
                        if (this.y == ty && this.speed.Y < 0)
                            return;
                        if (this.y < ty)
                        {
                            console.log('#Corrected at ' + this.y + ' ' + ty);
                            this.y = ty;
                            this.stance = TerrainScene.getTilt(this.x, this.y, this.direction);
                            return;
                        }
                    }
					if (this.mass)
					{
						if (!this.accel.value)
						{
							//this.accel.value = E.g;
							//this.accel.angle = -Math.PI/2;
							this.accel.set(E.g, -Math.PI/2);
							//this.accel.add(E.w*this.airfriction,E.w >0 ? 0 : Math.PI);
						}
						this.addSpeed(this.accel.value, this.accel.angle);
					}
					else
					{
						this.speed.X += this.accel.X;
						this.speed.Y += this.accel.Y;
					}

					this.x += this.speed.X;

                    if (this.mainActor)
                    {
                        var ty = TerrainScene.getHeight(this.x, this.y);
                        if (this.y + this.speed.Y < ty)
                        {
                            console.log('Corrected at ' + this.y + ' ' + ty + ' : ' + this.speed.Y);
                            this.y = ty;
                            this.stance = TerrainScene.getTilt(this.x, this.y, this.direction);
                        }
                        else if (this.y > ty)
                        {
                            this.y+=this.speed.Y;
                        }
                    }
                    else
                    {
                        this.y+=this.speed.Y;
                    }

					if (this.worldWrapping)
					{
						if (this.worldWrapping == WORLD_WRAPPED_HORISONTAL || this.worldWrapping == WORLD_WRAPPED)
						{

								if (this.x > VIEWPORT_WIDTH + SIDE_VIEW + 100)
									this.x = -200;
								if (this.x < -200)
									this.x = VIEWPORT_WIDTH + SIDE_VIEW + 100;
						}
						if (this.worldWrapping == WORLD_WRAPPED_VERTICAL || this.worldWrapping == WORLD_WRAPPED)
						{

								if (this.y > VIEWPORT_HEIGHT + TOP_VIEW + 100)
									this.y = -200;
								if (this.y < -200)
									this.y= VIEWPORT_HEIGHT + TOP_VIEW + 100;
						}
					}
					break;
				case PHYSX_SPIN:
					this.rotationAngle += this.rotationSpeed;
					this.rotationSpeed += this.rotationAccel;
					this.x = this.rotationCenterX + this.rotationLength * Math.Cos(this.rotationAngle);
					this.y = this.rotationCenterY + this.rotationLength * Math.Sin(this.rotationAngle);
					break;
			}
		},
		updateLogic: function() {

		},
        updateMovement: function() {
            if (this.movement == MOVEMENT_STOPPED)
            {
	            return;
            }
            this.movementStep++;
            if (this.movementStep !== this.movementRate)
            {
	            return;
            }

            this.movementStep = 0;
            var y = TerrainScene.getHeight(this.x + this.movement * MOVEMENT_STEP_SIZE, this.y);
            if (y - this.y < 10)
            {
                this.x += this.movement * MOVEMENT_STEP_SIZE;
                this.y = y;
                this.stance = TerrainScene.getTilt(this.x, this.y, this.direction);
                console.log('!!!!!set to stance:' + this.direction + '  ' + this.stance + ' => ' + this.model + ' f:' + this.currentFrame);
                this.copyConfig(worm.movement[this.direction][this.stance]);
            }
        },
		update: function () {
            this.updateMovement();
			this.updatePhysx();
			this.updateLogic();
			this.animate();
		},
		move: function (x, y) {

		},
        jump: function () {
            this.addSpeed(JUMP_POWER, -Math.PI/2);
            console.log('jump!' + this.speed.Y + ':' + this.speed.X);
        },
		applyImpulse: function (value, direction) {
			this.speed.add(value/this.mass, direction);
		},
		addSpeed: function (value, direction) {
			this.speed.add(value, direction);
			//console.log( this.speed.X + ', ' + this.speed.Y);
			this.speed.set(Math.min(this.speedLimit,this.speed.value),this.speed.angle);
		},
		play: function () {
			this.playState = PLAYSTATE_PLAYING;
		},
		stop: function () {
			this.playState = PLAYSTATE_STOPPED;
		},
		rewind: function () {
			this.playState = PLAYSTATE_REWIND;
		},
		addTo: function (scene) {
			this.parent = scene;
			this.parent.push(this);
		},
		destroy: function() {
			for (obj in this.parent)
			{
				if (this.parent[obj] == this)
				{
					this.parent.splice(obj,1);
				}
			}
		}
	});