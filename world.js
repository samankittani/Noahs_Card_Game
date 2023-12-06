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

