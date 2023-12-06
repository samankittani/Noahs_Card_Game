let shopArea = new BoxMorph();

function createShop() {
	shopArea.color = new Color(130, 130, 130);
	console.log(world.center());
	shopArea.fixLayout();
	world.add(shopArea);
};

shopArea.reactToWorldResize = (newBounds) => {
	shopArea.fixLayout();
};

shopArea.fixLayout = () => {
	shopArea.setPosition(new Point(-10, world.center().y - world.height() / 3 / 2));
	shopArea.bounds.setWidth(world.width() + 20);
	shopArea.bounds.setHeight(world.height() / 3);
}