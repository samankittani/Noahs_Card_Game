function handMorph() {
  this.init();
}

handMorph.prototype = new BoxMorph();
handMorph.prototype.constructor = handMorph;
handMorph.uber = BoxMorph.prototype;

handMorph.prototype.init = function(option) {
  handMorph.uber.init.call(this);

  const [width, height] = [720, 370];
  
  this.bounds.setWidth(width);
  this.bounds.setHeight(height);
  
  this.color = new Color(60, 60, 60, 1);

  this.fixLayout();

};

handMorph.prototype.fixLayout = function() {
  handMorph.uber.fixLayout.call(this);
  
  let sections = this.width() / this.children.length;
  
  for(let i = 0; i < this.children.length; i++ ){
    this.children[i].setCenter(new Point(this.bounds.left() + (sections * i + (sections / 2)), this.center().y)); /* This evenly distributes the cards based on how many there are */
    this.children[i].flip();
    // console.log(this.center);
    
  }
};