let opponentArea = new BoxMorph();

function createOpponent() {
    opponentArea.color = new Color(255, 120, 120);
    opponentArea.setPosition(new Point(-10, 0));
    opponentArea.setWidth(world.width() + 20);
    opponentArea.setHeight(world.height()/3);
    world.add(opponentArea);
};

opponentArea.reactToWorldResize = (newBounds) => {
  opponentArea.setWidth(world.width() + 20);
  opponentArea.setHeight(world.height()/3);
};