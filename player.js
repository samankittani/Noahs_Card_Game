const playerArea = new BoxMorph();

function createPlayer() {

	playerArea.color = new Color(130, 130, 255);
  playerArea.setWidth(world.width() + 20);
  playerArea.setHeight(world.height()/3);
	playerArea.setPosition(new Point(-10, world.height() - playerArea.bounds.height()));
	
	playerArea.addChild(playerArea.dis = new deckAreaMorph(DECKTYPES.pDis))
	playerArea.addChild(playerArea.deck = new deckAreaMorph(DECKTYPES.pD));
	playerArea.addChild(playerArea.hand = new handMorph());
	
	/* Testing *****************************************************
	playerArea.hand.addChild(new cardMorph(0, SUITS.club, 15))
	playerArea.hand.addChild(new cardMorph(0, SUITS.club, 15))
	playerArea.hand.addChild(new cardMorph(0, SUITS.club, 15))
	/* end of testing **********************************************/
	playerArea.hand.fixLayout()

	playerArea.fixLayout();
	world.add(playerArea);
};

playerArea.reactToWorldResize = (newBounds) => {
	playerArea.setWidth(newBounds.width() + 20);
	playerArea.setHeight(newBounds.height()/3);
	playerArea.setPosition(new Point(-10, world.height() - playerArea.bounds.height()));
};

playerArea.fixLayout = function (){

	console.log(playerArea.dis);
	if(playerArea.dis){
		playerArea.dis.setCenter(playerArea.center());
		playerArea.dis.setLeft(50);
	}
	if(playerArea.deck){
		playerArea.deck.setCenter(playerArea.center());
		playerArea.deck.setLeft(world.right() - 385);
	}
	if(playerArea.hand){
		playerArea.hand.setCenter(playerArea.center());
	}
}