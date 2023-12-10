const shopArea = new BoxMorph();

function createShop() {
	shopArea.color = new Color(130, 130, 130);
	// console.log(world.center());
	shopArea.addChild(shopArea.deck = new deckAreaMorph('shopD'));
	shopArea.addChild(shopArea.fDeck = new deckAreaMorph('shopFD'));
	shopArea.fixLayout();
	world.add(shopArea);
};

shopArea.reactToWorldResize = function(newBounds){
	this.fixLayout();
};

shopArea.fixLayout = function () {
	shopArea.setPosition(new Point(-10, world.center().y - world.height() / 3 / 2));
	shopArea.bounds.setWidth(world.width() + 20);
	shopArea.bounds.setHeight(world.height() / 3);
	
	shopArea.deck.setCenter(shopArea.center());
	shopArea.deck.setLeft(50);

	shopArea.fDeck.setCenter(shopArea.center());
	shopArea.fDeck.setLeft(world.right() - 385);


}