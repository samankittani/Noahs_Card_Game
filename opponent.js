const opponentArea = new BoxMorph();

function createOpponent() {
	opponentArea.color = new Color(255, 120, 120);
  opponentArea.setPosition(new Point(-10, 0));
  opponentArea.setWidth(world.width() + 20);
  opponentArea.setHeight(world.height()/3);


  opponentArea.addChild(opponentArea.dis = new deckAreaMorph(DECKTYPES.oDis));
  opponentArea.addChild(opponentArea.deck = new deckAreaMorph(DECKTYPES.oD));
	opponentArea.addChild(opponentArea.hand = new handMorph());
	
	/* Testing *****************************************************
	for(let i = 0; i < 5; i++){
		opponentArea.hand.addChild(new cardMorph(0, SUITS.spade, 15))
	}
	/* end of testing **********************************************/
	opponentArea.hand.fixLayout()

	opponentArea.fixLayout();
  world.add(opponentArea);
};

opponentArea.reactToWorldResize = function(newBounds) {
  
  this.setWidth(world.width() + 20);
  this.setHeight(world.height()/3);
};

opponentArea.fixLayout = function () {
	if(this.dis){
		this.dis.setCenter(this.center());
		this.dis.setLeft(50);
	}
	if(this.deck){
		this.deck.setCenter(this.center());
		this.deck.setLeft(world.right() - 385);
	}
	if(this.hand){
		this.hand.setCenter(this.center());
	}
}

opponentArea.draw = function (option) {
	if(option === DECKTYPES.oD)
		this.myAnimation(1000, 1000);
	else if(option === DECKTYPES.mDis);
}
