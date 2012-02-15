/**
 * Created by JetBrains PhpStorm.
 * User: SFera
 * Date: 5/10/11
 * Time: 6:59 PM
 * To change this template use File | Settings | File Templates.
 */

var Vector = Class.create({
	initialize: function () {
		this.value = 0;
		this.angle = 0;
		this.X = 0;
		this.Y = 0;
	},
	sync: function () {
		this.X = Math.round(this.value * Math.cos(this.angle));
		this.Y = Math.round(this.value * Math.sin(this.angle));
	},
	set: function(val, angle) {
		this.value = val;
		this.angle = angle;
		this.sync();
		//console.log(this);
	},
	add: function (val, angle) {

		//console.log('old:' + this.value + ', ' + this.angle);
		if (!this.value)
		{
			this.value = val;
			this.angle = angle;
			this.sync();
		}
		else
		{
			/*/
			this.X += Math.cos(angle) * val;
			this.Y += Math.sin(angle) * val;
			this.value = Math.sqrt(Math.pow(this.X,2), Math.pow(this.Y,2));
			this.angle = Math.atan(this.Y/this.X);
			/*/

			if (Math.abs(this.angle - angle) == Math.PI)
			{
				this.angle = this.value > val ? this.angle : angle;
				this.value -= val;
				this.sync();
			}
			else
			if (!(this.angle - angle))
			{
				this.value += val;
				this.sync();
			}
			else
			{
				this.value = Math.sqrt(this.value*this.value + val*val + 2*Math.cos(this.angle - angle)*this.value*val);

				if (val == 1)
				{
					//console.log('val:' + val + ' angle ' + (this.angle-angle) + ' sin: ' + Math.sin(this.angle - angle) + ' val:' + this.value);
					//console.log(val*Math.sin(this.angle-angle)/this.value + ' for angle:' + angle + ' and value ' + val);
					//console.log( Math.asin(val*Math.sin(this.angle-angle)/this.value) + ' with: ' + this.angle + ' or ' + angle);
				}

				var offset = this.angle < 0 ? this.angle < angle ? angle : this.angle : angle;
				if (!this.value)
				{
					this.angle = 0;
				}
				else
				{
					this.angle = offset + Math.asin(val*Math.sin(this.angle-angle)/this.value);
				}
			}

			this.sync();
			/**/
		}
		//console.log('new:' + this.value + ', ' + this.angle);
	}
});
