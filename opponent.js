const opponentArea = new BoxMorph();

function createOpponent() {
	opponentArea.color = new Color(255, 120, 120);
  opponentArea.setPosition(new Point(-10, 0));
  opponentArea.setWidth(world.width() + 20);
  opponentArea.setHeight(world.height()/3);


  opponentArea.addChild(opponentArea.dis = new deckAreaMorph(DECKTYPES.oDis))
  opponentArea.addChild(opponentArea.deck = new deckAreaMorph(DECKTYPES.oD));
	
	opponentArea.fixLayout();
  world.add(opponentArea);
};

opponentArea.reactToWorldResize = (newBounds) => {
  opponentArea.setWidth(world.width() + 20);
  opponentArea.setHeight(world.height()/3);
};

opponentArea.fixLayout = function () {


	if(opponentArea.dis){
		opponentArea.dis.setCenter(opponentArea.center());
		opponentArea.dis.setLeft(50);
	}
	if(opponentArea.deck){
		opponentArea.deck.setCenter(opponentArea.center());
		opponentArea.deck.setLeft(world.right() - 385);
	}
}