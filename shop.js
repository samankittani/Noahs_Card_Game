let shopArea = new BoxMorph();

function createShop() {
	
	shopArea.fixLayout = () => {
		shopArea.setPosition(new Point(world.center().x, world.center().y));
	}
	
	shopArea.color = new Color(85, 85, 85);
	console.log(world.center());
	shopArea.fixLayout();
	shopArea.keepWithin(world);
	world.add(shopArea);
};

shopArea.reactToWorldResize = (newBounds) => {
	shopArea.setPosition(new Point(newBounds.center().x, newBounds.center().y));
};