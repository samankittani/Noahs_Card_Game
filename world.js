//Create world morph and begin world loop 
var worldCanvas, world;

window.onload = function () {
	worldCanvas = document.getElementById('world');
	world = new WorldMorph(worldCanvas);
	world.isDevMode = true;
	createShop();
  createOpponent();
  createPlayer();
  createUI();
	loop();
};

function loop() {
	requestAnimationFrame(loop);
	world.doOneCycle();
};


Morph.prototype.myAnimation = function (endWidth, msecs) {
	var world = this.world(),
		horizontal = new Animation(
			width => {return this.setWidth(width)},
			() => {return this.width();},
			-(this.width() - endWidth),
			msecs === 0 ? 0 : msecs || 100,
			'elastic_out', 
			() => {this.whoAmI()}

		);
	world.animations.push(horizontal);
};

Morph.prototype.whoAmI = function() {
	console.log(`I am: `);
	console.log(this);
}