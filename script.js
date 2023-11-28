//Create world morph and begin world loop 
let worldCanvas, world;

window.onload = function () {
	worldCanvas = document.getElementById('world');
	world = new WorldMorph(worldCanvas);
	world.isDevMode = true;
	loop();
};

function loop() {
	requestAnimationFrame(loop);
	world.doOneCycle();
}

function getWorld(){
	return world;
}