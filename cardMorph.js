function cardMorph(value, suit, cost) {
  this.init(value, suit, cost);
}

cardMorph.prototype = new BoxMorph();
cardMorph.prototype.constructor = cardMorph;
cardMorph.uber = BoxMorph.prototype;

cardMorph.prototype.init = function(value, suit, cost) {
  cardMorph.uber.init.call(this);
  // console.log(this);

  this.value = value;
  this.suit = suit;
  this.cost = cost;

  this.back = true;
  this.maxWidth = 238;

  const [width, height] = [238, 350];
  
  this.bounds.setWidth(width);
  this.bounds.setHeight(height);
  this.color = new Color(45, 45, 45,1);

  this.addChild(this.display = new Morph());

  this.setImage();  
  this.display.toggleVisibility();

  this.fixLayout();
  

};

cardMorph.prototype.setImage = function() {
  if(this.value > 0){
    this.display.addChild(this.display.text = new StringMorph(`${this.value}`, 70, 'times', true))
    this.display.text.setPosition(this.display.topLeft());
    this.setColor();
 
  }
  else if(this.suit === SUITS.spade){
    this.display.texture = 'http://localhost:8000/images/newMoon.svg';
  }
  else if(this.suit === SUITS.club){
    this.display.texture = 'http://localhost:8000/images/NewBlackhole.svg';
  }
}
/* 
this function is used to select the right color.
used only for the number cards 
TODO: pick good rgb values for the value cards, 
or get an SVG that looks good without taking away
from the number*/
cardMorph.prototype.setColor = function () {
  if(this.suit === SUITS.spade){
    // this.display.color = new Color( 89, 4, 4, 1);
  }else if(this.suit === SUITS.club){
    // this.display.color = new Color(1, 1, 1, 1);
  }
}

cardMorph.prototype.fixLayout = function() {
  cardMorph.uber.fixLayout.call(this);

  if(this.display){
    let [dWidth, dHeight] = [226, 340];
    this.display.bounds.setWidth(dWidth); 
    this.display.bounds.setHeight(dHeight);
    this.display.setCenter(this.center());
    this.toggleIsDraggable();
  }
};

cardMorph.prototype.flip = function () {
  const flipSpeed = 10;

  if(this.back === true){
    this.back = false;
    this.display.toggleVisibility();
  }else if(this.back === false){
    this.back = true;
    this.display.toggleVisibility();
  }

  this.step = () => {

    this.step = null;
    this.changed();
  }
}

cardMorph.prototype.mouseClickRight = function () {
  this.escalateEvent('draw', this.parent.option);   
}


