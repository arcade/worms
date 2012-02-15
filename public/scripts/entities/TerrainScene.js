/**
 * Created by JetBrains PhpStorm.
 * User: arcade
 * Date: 5/6/11
 * Time: 1:46 AM
 * To change this template use File | Settings | File Templates.
 */

window.TerrainScene = new Object();

TerrainScene.terrain = null;
TerrainScene.imageData = null;

TerrainScene.init = function(asset) {
	context.terrain.drawImage(AM.images[asset].data, SIDE_VIEW/2, TOP_VIEW - 130);
	this.sync();
}

TerrainScene.render = function() {
	//context.terrain.putImageData(this.terrain);
	//this.sync();
}

TerrainScene.sync = function () {
	this.imageData = context.terrain.getImageData(0, 0, VIEWPORT_WIDTH + SIDE_VIEW, VIEWPORT_HEIGHT + TOP_VIEW);
}

TerrainScene.getHeight = function(x, y) {
	if (this.isTerrainAt(x, y))
	{
		for(var i = y;i<VIEWPORT_HEIGHT+TOP_VIEW-130;i++)
		{
			if (!this.isTerrainAt(x, i))
				return i+1;
		}
	}
	else
	{
		for (var i=y-1; i>130; i--)
		{
			if (this.isTerrainAt(x, i))
				return i+1;
		}

	}
}

TerrainScene.getTilt = function( x, y, direction) {
	var a = y;
	var b = y;
	var d = 2;
	var h = 15;
	if (this.isTerrainAt(x-d, y))
	{
		for(a = y;a<y+h;a++)
		{
			if (!this.isTerrainAt(x-d, a))
				break;
		}
	}
	else
	{
		for(a = y;a>y-h;a--)
		{
			if (this.isTerrainAt(x-d, a))
				break;
		}
	}
	if (this.isTerrainAt(x+d, y))
	{
		for(b = y;b<y+h;b++)
		{
			if (!this.isTerrainAt(x+d, b))
				break;
		}
	}
	else
	{
		for(b = y;b>y-h;b--)
		{
			if (this.isTerrainAt(x+d, b))
				break;
		}
	}
	if (Math.abs(a-b) < 1)
		return MOVE_HORISONTAL;
	if (b-a <= -1)
		return direction * MOVE_UP;
	return (1-direction) * MOVE_UP;
}


TerrainScene.canFitWorm = function(x,y) {
	return (!this.isTerrainAt(x-WORM_WIDTH,y+WORM_HEIGHT) && !this.isTerrainAt(x+WORM_WIDTH,y+WORM_HEIGHT));
}

TerrainScene.isTerrainAt = function ( x, y) {
    if (!this.imageData)
        return true;
	//var bgdata = context.terrain.getImageData(x,y,1,1);
    if (x < 0 || x > VIEWPORT_WIDTH + SIDE_VIEW  || y < 0 || y > VIEWPORT_HEIGHT + TOP_VIEW )
        return false;
	var bgdata = this.imageData.data[x*4 + (VIEWPORT_HEIGHT + TOP_VIEW -y)*(VIEWPORT_WIDTH + SIDE_VIEW) * 4 + 3];
	return bgdata != 0;
}

TerrainScene.getPixel = function ( x, y) {
	//var bgdata = context.terrain.getImageData(x,y,1,1);
	var pixel = new Array();
	pixel[0] = this.imageData.data[x*4 + (VIEWPORT_HEIGHT + TOP_VIEW -y)*(VIEWPORT_WIDTH + SIDE_VIEW) * 4 +0];
	pixel[0] = this.imageData.data[x*4 + (VIEWPORT_HEIGHT + TOP_VIEW -y)*(VIEWPORT_WIDTH + SIDE_VIEW) * 4 +1];
	pixel[0] = this.imageData.data[x*4 + (VIEWPORT_HEIGHT + TOP_VIEW -y)*(VIEWPORT_WIDTH + SIDE_VIEW) * 4 +2];
	pixel[0] = this.imageData.data[x*4 + (VIEWPORT_HEIGHT + TOP_VIEW -y)*(VIEWPORT_WIDTH + SIDE_VIEW) * 4 +3];
	return pixel;
}
