let resources, resourcesValue, galacticGlory;
resources = new BoxMorph();

function createUI() {
	resourcesValue = new TextMorph("Resources: 0", 20, "calibri");
  resources.setWidth(resourcesValue.bounds.width());
  resources.add(resourcesValue);
  resources.alpha = 0.01;
  resources.setPosition( new Point(worldCanvas.width/2 - resources.bounds.width()/2, 0));
	world.add(resources);
};

resources.reactToWorldResize = (newBounds) => {
    resources.setPosition(new Point(newBounds.width()/2 - resources.bounds.width()/2, 0));
};