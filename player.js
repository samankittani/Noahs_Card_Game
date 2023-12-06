let playerArea = new BoxMorph();


function createPlayer() {
  playerArea.color = new Color(130, 130, 255);
  playerArea.setWidth(world.width() + 20);
  playerArea.setHeight(world.height()/3);
	playerArea.setPosition(new Point(-10, world.height() - playerArea.bounds.height()));
	world.add(playerArea);
};

playerArea.reactToWorldResize = (newBounds) => {
	playerArea.setWidth(newBounds.width() + 20);
	playerArea.setHeight(newBounds.height()/3);
	playerArea.setPosition(new Point(-10, world.height() - playerArea.bounds.height()));
};
