class shopClass{
  constructor(slot0, slot1, slot2, slot3, slotf){
    this.slot0 = slot0;
    this.slot1 = slot1;
    this.slot2 = slot2;
    this.slot3 = slot3;
    this.slotf = slotf;
  }
}

class handClass{
  constructor(slot0, slot1, slot2){
    this.slot0 = slot0;
    this.slot1 = slot1;
    this.slot2 = slot2;
  }
}

const SUITS = {
  spade: 'spade',
  club: 'club',
  diamond: 'diamond',
  heart: 'heart'
  }

class cardClass{
  constructor(number, suit, cost, wPoints){
    this.number = number;
    this.suit = suit;
    this.cost = cost;
    this.wPoints = wPoints;

  }
}

class stateClass{
  constructor(human, oppD, myD, shopD, shop, myHand, oppHand){
    this.human = human;
    this.oppD = oppD;
    this.myD = myD;
    this.shopD = shopD;
    this.shop = shop;
    this.myHand = myHand;
    this.oppHand = oppHand;
  }
}

class actionClass{
  constructor(option){
    this.action = option;
    this.utility = 0;
  }  
}

class MCTNodeClass{
  constructor(state, actions){
    this.state = state;
    this.actions = actions;
    this.i;    
  }
}

class MCTSClass{
  constructor(){
    this.root;
    
  }

}

MCTS.prototype.initDeck = () => {
  const oppD = new Array();
  const myD = new Array();
  const myHand = new Array();
  const oppHand = new Array();

  for (let i = 1; i < 6; i++) {
    oppD.push(new cardClass(i, SUITS.spade, i, i));
    myD.push(new cardClass(i, SUITS.club, i, i));
  }

  oppD.push(new cardClass(0, SUITS.spade, 15, 15));
  myD.push(new cardClass(0, SUITS.club, 15, 15));

  // sample from deck and populate hand
  let randIndOp;
  let randIndMe;

  // while hand is not full, pop a random one from deck and push to hand
  while(myHand.length < 3){
    randIndMe = Math.floor(Math.random() * myD.length);
    randIndOp = Math.floor(Math.random() * oppD.length);
    myHand.push(myD.splice(randIndMe, 1)[0]);
    oppHand.push(oppD.splice(randIndOp, 1)[0]);
  }
  return [oppD, myD, myHand, oppHand];
}


MCTS.prototype.initShop = () => {
  const shopD = new Array();
  const shop = new Array();

  for (let i = 6; i < 11; i++) {
    shopD.push(new cardClass(i, SUITS.spade, i, i));
    shopD.push(new cardClass(i, SUITS.club, i, i));
  }
  for (let i = 0; i < 2; i++) {
    shopD.push(new cardClass(0, SUITS.spade, 15, 15))
    shopD.push(new cardClass(0, SUITS.club, 15, 15))
  }

  // sample from deck and populate hand
  let randIndSh;

  // while hand is not full, pop a random one from deck and push to hand
  while(shop.length < 4){
    randIndSh = Math.floor(Math.random() * shopD.length);
    shop.push(shopD.splice(randIndOp, 1)[0]);
  }

  return [shopD, shop];
}


MCTS.prototype.initActions = () => {
  
  const actions = new actionClass()
  return actions
}

MCTS.prototype.init = () => {
  // create initial state variables
  const [oppD, myD, myHand, oppHand] = this.initDeck();
  const [shopD, initShop] = this.initShop();
  
  // create initial state
  const initState = new state(false, oppD, myD, shopD, initShop, myHand, oppHand);

  // use initial state to create possible actions

  // create root node
  this.root = new MCTNode(initState)
}

