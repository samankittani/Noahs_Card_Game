const ACTIONS = {
  endTurn: 'eTurn',
  buy: 'buy',
  playBlack: 'pClub',
  playRed: 'pSpade',
}

const SUITS = {
  spade: 'spade',
  club: 'club',
  diamond: 'diamond',
  heart: 'heart'
  }

Object.freeze(ACTIONS);
Object.freeze(SUITS);


class cardClass{
  constructor(number, suit, cost, wPoints){
    this.number = number;
    this.suit = suit;
    this.cost = cost;
    this.wPoints = wPoints;
  }
}

class stateClass{
  constructor(human, oppD, myD, shopD, shopFD, shop, myHand, oppHand, myDis, oppDis){
    this.human = human;
    this.oppD = oppD;
    this.myD = myD;
    this.shopD = shopD;
    this.shopFD = shopFD;
    this.shop = shop;
    this.myHand = myHand;
    this.oppHand = oppHand;
    this.myDis = myDis;
    this.oppDis = oppDis;
  }
}

class actionClass {
  constructor(option, shopIndex, parent) {
    this.action = option;
    this.shopIndex = shopIndex;
    this.utility = Infinity;
    this.nPicks = 0;
    this.nWins = 0;
    this.winRatio;

    this.parent = parent;
    this.paths = new Array();
  }

  updateUtility = function () {
    for (let i = 0; i < this.paths.length; i++) {}
  };

  sampleNextState = function () {
    let nextState = JSON.parse(JSON.stringify(this.parent.state));
    let prob = 1;
    nextState = this.performAction(nextState);
    if (true) {
    }
    return nextState;
  };

  performAction = function (nextState) {
    if (this.action === ACTIONS.endTurn) {
      //do nothing
    } else if (this.parent.human === false) {
      if (this.action === ACTIONS.buy) {
        nextState.myDis.push(nextState.shop.splice(shopIndex, 1)[0]);
      } else if (this.action === ACTIONS.playBlack) {
        let rand = Math.floor(Math.random() * oppHand.length);
        nextState.oppD.splice(rand, 1);

        let best = 0;
        for (let i = 0; i < myHand; i++) {
          if (state.myHand[i].cost < state.myHand[best].cost) {
            best = i;
          }
        }
      } else if (this.action === ACTIONS.playRed) {
        let rand = Math.floor(Math.random() * oppHand.length);
        nextState.myDis.push(nextState.oppHand.splice(rand, 1)[0]);
      }
    } else if (this.parent.human === true) {
      if (this.action === ACTIONS.buy) {
        nextState.oppDis.push(nextState.shop.splice(shopIndex, 1)[0]);
      } else if (this.action === ACTIONS.playBlack) {
        let rand = Math.floor(Math.random() * myHand.length);
        nextState.myD.splice(rand, 1);

        let best = 0;
        for (let i = 0; i < myHand; i++) {
          if (state.oppHand[i].cost < state.oppHand[best].cost) {
            best = i;
          }
        }
      } else if (this.action === ACTIONS.playRed) {
        let rand = Math.floor(Math.random() * myHand.length);
        nextState.oppDis.push(nextState.myHand.splice(rand, 1)[0]);
      }
    }

    return nextState;
  };
}

class MCTNodeClass{
  constructor(state, parent = null){
    this.state = state;
    this.actions = new Array();
    this.aveWinRatio;
    this.nPicks = 0;
    this.nWins = 0;

    this.parent = parent;

    this.updateActions();
  }

  updateActions = function() {

    let sum = 0; 

    if(this.state.human === false){
      for(let i = 0; i < this.state.myHand.length; i++){
        sum += this.state.myHand[i].number;
        if(this.state.myHand[i].wPoints === 15 && this.state.myHand[i].suit === SUITS.club && this.actions.indexOf(ACTIONS.playBlack) === -1){
          this.actions.push(new actionClass(ACTIONS.playBlack, i, this))
        }
        if(this.state.myHand[i].wPoints === 15 && this.state.myHand[i].suit === SUITS.spade && this.actions.indexOf(ACTIONS.playRed) === -1){
          this.actions.push(new actionClass(ACTIONS.playRed, i, this))
        }
      }

    }else{
      for(let i = 0; i < this.state.oppHand.length; i++){
        sum += this.state.oppHand[i].number;
        if(this.state.oppHand[i].wPoints === 15 && this.state.oppHand[i].suit === SUITS.club && this.actions.indexOf(ACTIONS.playBlack) === -1){
          this.actions.push(new actionClass(ACTIONS.playBlack, i, this))
        }
        if(this.state.oppHand[i].wPoints === 15 && this.state.oppHand[i].suit === SUITS.spade && this.actions.indexOf(ACTIONS.playRed) === -1){
          this.actions.push(new actionClass(ACTIONS.playRed, i, this))
        }
      }
    }

    for(let i = 0; i < this.state.shop.length; i++){
      if(this.state.shop[i].cost <= sum){
        this.actions.push(new actionClass(ACTIONS.buy, i, this))
      }
    }
  }
}

class MCTSClass{
  constructor(iter){
    this.maxIter = iter;
    this.root;
    this.init();
  }

  run = function(){
    this.getBestLeaf();
    this.rollOut();
    this.backProp();
    this.updateAllUtil();
  }

  getBestLeaf = function(){

    let node = this.root;
    let bestIndex = 0;

    while(true){
      for(let i = 0; i < node.actions.length; i++){
        if(node.actions[i].utility > node.actions[bestIndex].utility){
          bestIndex = i;
        }
      
        node.actions[i]

      }
    }
  }

  init = function(){
    // create initial state variables
    const [oppD, myD, myHand, oppHand] = this.initDeck();
    const [shopD, shopFD, initShop] = this.initShop();
    const [myDis, oppDis] = [new Array(), new Array()];
    // create initial state
    const initState = new stateClass(false, oppD, myD, shopD, shopFD, initShop, myHand, oppHand, myDis, oppDis);

    // create root node
    this.root = new MCTNodeClass(initState)
  }

  initDeck = function(){
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

  initShop = function(){
    const shopD = new Array();
    const shopFD = new Array();
    const shop = new Array();
    
    for (let i = 6; i < 11; i++) {
      shopD.push(new cardClass(i, SUITS.spade, i, i));
      shopD.push(new cardClass(i, SUITS.club, i, i));
    }
    for (let i = 0; i < 2; i++) {
      shopFD.push(new cardClass(0, SUITS.spade, 15, 15));
      shopFD.push(new cardClass(0, SUITS.club, 15, 15));
    }

    // sample from deck and populate hand
    let randIndSh;

    // while hand is not 
    // full, pop a random one from deck and push to hand
    while(shop.length < 4 && shopD.length){
      randIndSh = Math.floor(Math.random() * shopD.length);
      shop.push(shopD.splice(randIndSh, 1)[0]);
    }

    if(shop.length){
      randIndSh = Math.floor(Math.random() * shopFD.length);
      shop.push(shopFD.splice(randIndSh, 1)[0]);
    }

    return [shopD, shopFD, shop];
  }

}


const MCTS = new MCTSClass(10000);
let state = JSON.parse(JSON.stringify(MCTS.root.state))
console.log(state);
Object.defineProperty(state.__proto__, 'restock', {
  value: function (){console.log('biscuit');}})
state.restock();
console.log()