function deckAreaMorph(option) {
  this.init(option);
}

deckAreaMorph.prototype = new BoxMorph();
deckAreaMorph.prototype.constructor = deckAreaMorph;
deckAreaMorph.uber = BoxMorph.prototype;

deckAreaMorph.prototype.init = function(option) {
  deckAreaMorph.uber.init.call(this);
  // console.log(this);

  this.count = 0;

  const [width, height] = [340, 370];
  
  this.bounds.setWidth(width);
  this.bounds.setHeight(height);
  
  this.color = new Color(60, 60, 60, 1);
  
  this.initDeck(option);

  this.fixLayout();

};

deckAreaMorph.prototype.fixLayout = function() {
  deckAreaMorph.uber.fixLayout.call(this);
  for(let i = 0; i < this.children.length; i++ ){
    this.children[i].setCenter(new Point(this.center().x + (i * 2.7), this.center().y - (i * 1.8)))
    // console.log(this.center);
    
  }
};


deckAreaMorph.prototype.initDeck = function(option) {
  // console.log(this);
  if(option === 'shopD'){
    for(let i = 6; i < 11; i += 1){
      this.addChild(new cardMorph(i, SUITS.club, i))
      this.addChild(new cardMorph(i, SUITS.spade, i))
    }

  }else if(option === 'shopFD'){
    for(let i = 0; i < 2; i++){
      this.addChild(new cardMorph(0, SUITS.club, 15))
      this.addChild(new cardMorph(0, SUITS.spade, 15))
    }

  }else if(option === SUITS.spade){
    for(let i = 1; i < 6; i += 1){
      this.addChild(new cardMorph(i, SUITS.spade, i))
    }
    this.addChild(new cardMorph(0, SUITS.spade, 15))

  }else if(option === SUITS.club){
    for(let i = 1; i < 6; i += 1){
      this.addChild(new cardMorph(i, SUITS.club, i))
    }
    this.addChild(new cardMorph(0, SUITS.club, 15))
        
  }else if(option === 'empty'){
    /* do nothing */
  }
}