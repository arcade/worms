/**
 * Asset management class
 *
 * Created by JetBrains PhpStorm.
 * User: arcade
 * Date: 5/5/11
 * Time: 10:03 PM
 * To change this template use File | Settings | File Templates.
 */

window.AM = {};

AM.imagesPath = '/images/';
AM.soundsPath = '/sounds/';
AM.images = [];
AM.sounds = [];
AM.loaded = 0;
AM.lastImageId = 1;
AM.lastSoundId = 1;
AM.toLoad = 0;

AM.addImage = function(image, onload) {
	var image = {
		path: this.imagesPath + image,
		success: false,
		error: '',
		onload: onload
	};

	this.images[this.lastImageId] = image;
	this.toLoad++;

	this.loadImage(this.lastImageId);

	return this.lastImageId++;
}

AM.addSound = function(sound, onload) {
	var image = {
		path: this.soundsPath + sound,
		success: false,
		error: '',
		onload: onload
	};

	this.sounds[this.lastSoundId] = image;
	this.toLoad++;

	this.loadSound(this.lastSoundId);

	return this.lastSoundId++;
}

AM.loadImage = function(imageId) {
	var image = this.images[imageId];

	image.data = new Image();
	image.data.internalId = imageId;

	image.data.onload = function() {
		AM.images[this.internalId].success = true;
		if(AM.images[this.internalId].onload) {
			AM.images[this.internalId].onload(this.internalId);
		}
		AM.loaded++;
	}


	image.data.src = image.path;
}

AM.loadSound = function(soundId) {
	var sound = this.sounds[soundId];

	sound.data = new Audio();
	sound.data.internalId = soundId;

	sound.data.loadeddata = function() {
		console.log('loaded');
		AM.sounds[this.internalId].success = true;
		/*if(AM.images[this.internalId].onload) {
			AM.images[this.internalId].onload(this.internalId);
		}*/
		AM.loaded++;
	}

	sound.data.src = sound.path;
}

AM.play = function (soundId) {
	var sound = this.sounds[soundId];
	sound.data.play();
}