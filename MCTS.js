const ACTIONS = {
  /* all possible actions */
  endTurn: "eTurn",
  buy: "buy",
  playBlack: "pClub",
  playRed: "pSpade",
};
const SUITS = {
  /* all possible 'suits' */
  spade: "spade",
  club: "club",
  diamond: "diamond",
  heart: "heart",
};
const ROLLOUTTYPES = {
  /* rollout types, s* = must simulate to end*/
  sBiasRand: "biasRand",
  smaxPointDiff: "maxPointDiff",
  pointDiff: "pointDiff",
};
const OUTCOMES = {
  /* rollout types, s* = must simulate to end*/
  rWin: "rWin",
  rLost: "rLost",
  draw: "draw",
};
Object.freeze(ACTIONS);
Object.freeze(SUITS);
/*  
card Class used in the MCTS. 
Only used for data. 
Cannot have methods.
Must be JSON.stringify compatible for easy copying*/
class cardClass {
  constructor(number, suit, cost, wPoints) {
    this.number = number;
    this.suit = suit;
    this.cost = cost;
    this.wPoints = wPoints;
  }
}
/*
state class used to keep track of the state in the current node.
Similar to cardClass, it must remain JSON stringify compatible */
class stateClass {
  constructor(
    human,
    oppD,
    myD,
    shopD,
    shopFD,
    shop,
    myHand,
    oppHand,
    myDis,
    oppDis
  ) {
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
/*
  Sort all decks and hands, 
  Generated by Google Bard.
  stateClass is DeepCopied, so this must be decoupled from the state
  Thanks Bard! */
sortState = function (obj) {
  for (const key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length > 1) {
      obj[key].sort((a, b) => {
        if (a.number === b.number) {
          return a.suit.localeCompare(b.suit);
          // Sort suits alphabetically if numbers are the same
        }
        return a.number - b.number;
        // Sort by number first
      });
    }
  }
  return obj;
};
/*
  Bard contribution, uniformly sample between min and max */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/******************************************************************************************************* 

one action and its respective data from a given node.
parameters:
  action:     one of the possible action in ACTIONS
  shopIndex:  used only if action is to buy. Specifies which card to buy
  nPicks:     the number of times this action was picked for expansion
  nWins:      the number of times this action lead to a win. 
              This value is the expectation of all of the nodes that this action can lead to
  winRatio:   expected nWins / nPicks
  UCB:        winRatio + sqrt(ln(root.i)/nPicks)
  node:     the node that the action is taken from. node holds state
  paths:      the possible outcomes of taking this action. 
  pathsLimit: the maximum number of paths that can be added to paths. Once full
              the action will randomly select from the 
  ****************************************************************************************************/
class actionClass {
  constructor(option, shopIndex, node) {
    this.action = option;
    this.shopIndex = shopIndex;
    this.UCB = Infinity;
    this.maxWiden = Infinity;
    this.nPicks = 0;
    this.expUtility = 0;

    this.node = node;
    this.paths = new Array();
  } /* 
  taking this action leads to paths.length number of possibilities.
  update nWins, nPick, and UCB. It is the expection of the paths.*/
  updateValues = function () {
    if (this.node.rolloutType === ROLLOUTTYPES.sBiasRand) {
      this.maxWiden =
        this.node.widenParam[0] * this.nPicks ** this.node.widenParam[1];
      this.expUtility = this.updateUtilityRand();
    } else {
      throw new Error(
        `Error: rolloutType ${this.node.rolloutType} not implemented`
      );
    }
  };
  /* 
  update the actions UCB value */
  updateUCB1 = function () {
    if (this.nPicks !== 0) {
      this.UCB =
        this.expUtility +
        this.node.exploreParam *
          Math.sqrt(Math.log(this.node.nSamples) / this.nPicks);
    }
  };
  /* 
  update utility. recalculate expected utility based off of children*/
  updateUtilityRand = function () {
    this.expUtility = 0;
    for (let i = 0; i < this.paths.length; i++) {
      let pathProb = this.paths[i].nSamples / this.nPicks;
      this.expUtility += this.paths[i].utility * pathProb;
    }
    return this.expUtility;
  };
  /*
  Either generate a new state, or sample from path.
  Use the widenParam from node to decide what to do*/
  getNextNode = function () {
    if (this.paths.length < this.maxWiden) {
      let nextState = this.generateNextState();
      let i = this.pathIndex(nextState);
      if (i !== -1) {
        /* in paths */
        return this.paths[i];
      } else {
        /* not in paths, create new path */
        let newNode = new MCTNodeClass(
          nextState,
          this.node.exploreParam,
          this.node.widenParam,
          this.node.rolloutType,
          this
        );
        this.paths.push(newNode);
        return newNode;
      }
      /* must sample from existing paths */
    } else {
      let rand = Math.random();
      for (let i = 0; i < this.paths.length; i++) {
        if (rand <= (this.paths[i].nSamples/this.nPicks)) {
          return this.paths[i];
        }
        rand = -(this.paths[i].nSamples/this.nPicks);
      }
    }
    throw new Error("getNextNode Error");
  };
  /*
  create copy of parent state, perform action on state.
  return new state*/
  generateNextState = function () {
    let nextState = JSON.parse(JSON.stringify(this.node.state));
    if (this.action !== ACTIONS.eTurn) {
      nextState = this.performAction(nextState);
      nextState = this.refreshHand(nextState);
    }
    nextState = this.swapActivePlayer(nextState);
    nextState = sortState(nextState);
    return nextState;
  };
  /* 
  Swap the active player out.
  switch all player based state properties */
  swapActivePlayer = function (nextState) {
    const flippedState = {
      human: !nextState.human,
      oppD: nextState.myD,
      myD: nextState.oppD,
      shopD: nextState.shopD,
      shopFD: nextState.shopFD,
      shop: nextState.shop,
      myHand: nextState.oppHand,
      oppHand: nextState.myHand,
      myDis: nextState.oppDis,
      oppDis: nextState.myDis,
    };
    return flippedState;
  };
  /* 
  attempt to refill hand of active player*/
  refreshHand = function (nextState) {
    while (nextState.myHand.length > 0) {
      nextState.myDis.push(nextState.myHand.pop());
    }
    while (
      nextState.myHand.length < 3 &&
      (nextState.myD.length || nextState.myDis.length)
    ) {
      if (nextState.myD.length === 0) {
        this.refreshDeck(nextState);
      }
      let rand = getRandomInt(0, nextState.myD.length - 1);
      nextState.myHand.push(nextState.myD.splice(rand, 1)[0]);
    }
    return nextState;
  };
  /* 
  set the respective deck to the discard
  set the discard to empty*/
  refreshDeck = function (nextState) {
    nextState.myD = nextState.myDis;
    nextState.myDis = new Array();
  };
  /* 
  modify a state based on his action instances action attribute 
  take a state and return that state modified*/
  performAction = function (nextState) {
    if (this.action === ACTIONS.endTurn) {
      /* do nothing*/
    } else if (this.action === ACTIONS.buy) {
      /* if we are buying, push the shop item into our discard */
      let card = nextState.shop.splice(this.shopIndex, 1)[0];
      nextState.myDis.push(card);
      if (card.wPoints === 15 && nextState.shopFD.length !== 0) {
        let randShopInd = getRandomInt(0, nextState.shopFD.length - 1);
        nextState.shop.push(nextState.shopFD.splice(randShopInd, 1)[0]);
      } else if (nextState.shopD.length !== 0) {
        let randShopInd = getRandomInt(0, nextState.shopD.length - 1);
        nextState.shop.push(nextState.shopD.splice(randShopInd, 1)[0]);
      }
    } else if (this.action === ACTIONS.playBlack) {
      nextState = this.performBlackAction(nextState);
    } else if (this.action === ACTIONS.playRed) {
      let rand = getRandomInt(0, nextState.oppHand.length - 1);
      nextState.myDis.push(nextState.oppHand.splice(rand, 1)[0]);
    }
    return nextState;
  };
  /*
  delete a random card from the opponent
  delete one of our lowest value cards*/
  performBlackAction = function (nextState) {
    if (nextState.oppHand.length < 1) {
      throw new Error("cant do black action on empty oppHand");
    }
    let rand = getRandomInt(0, nextState.oppHand.length - 1);
    nextState.oppHand.splice(rand, 1);

    let best = 0;
    for (let i = 0; i < nextState.myHand.length; i++) {
      if (nextState.myHand[i].cost < nextState.myHand[best].cost) {
        best = i;
      }
    }
    nextState.myHand.splice(best, 1);
    return nextState;
  };
  /* 
  check if state is one of the paths available in this action*/
  pathIndex = function (state) {
    for (let i = 0; i < this.paths.length; i++) {
      if (_.isEqual(state, this.paths[i].state)) {
        return i;
      }
    }
    return -1;
  };
}
/***********************************************************************************************************
 * NodeClass for MCTS
 *
 *
 ***********************************************************************************************************/
class MCTNodeClass {
  constructor(
    state,
    exploreParam,
    widenParam,
    rolloutType,
    parentAction = null
  ) {
    this.state = sortState(JSON.parse(JSON.stringify(state)));
    this.actions = new Array();
    this.nSamples = 0;
    this.expNWins = 0;
    this.utility = 0;

    this.parentAction = parentAction;

    /* Meta data to pass to actions unused in the node
       this data is used by the actions for UCB and selection behavior*/
    this.exploreParam = exploreParam;
    this.rolloutType = rolloutType;
    this.widenParam = widenParam;

    this.updateActions();
  }
  /*
  update Action meta values.
  used when backpropogating*/
  updateValues = function (res) {
    this.nSamples++;
    this.parentAction.nPicks++;
    this.expNWins += this.getENWinsReward(res) * (this.nSamples/this.parentAction.nPicks)
    this.utility = this.expNWins / this.nSamples;
    this.parentAction.updateValues(); 
    for (const action of this.actions) {
      if (action.nPicks !== 0) {
        action.updateUCB1();
        // this.expNWins += -1 * action.expUtility;
      }
    }
  };
  /*
  take the state given
  populate all possible actions for node*/
  updateActions = function () {
    this.actions = new Array();
    this.actions.push(new actionClass(ACTIONS.endTurn, -1, this));
    let sum = 0;
    let black = false,
        red = false;
    for (let i = 0; i < this.state.myHand.length; i++) {
      sum += this.state.myHand[i].number;
      if (
        this.state.myHand[i].wPoints === 15 &&
        this.state.myHand[i].suit === SUITS.club &&
        !black &&
        this.state.oppHand.length !== 0 &&
        this.state.myHand.length !== 0
      ) {
        this.actions.push(new actionClass(ACTIONS.playBlack, -1, this));
        black = true;
      }
      if (
        this.state.myHand[i].wPoints === 15 &&
        this.state.myHand[i].suit === SUITS.spade &&
        !red &&
        this.state.oppHand.length !== 0
      ) {
        this.actions.push(new actionClass(ACTIONS.playRed, -1, this));
        red = true;
      }
    }
    for (let i = 0; i < this.state.shop.length; i++) {
      if (this.state.shop[i].cost <= sum) {
        this.actions.push(new actionClass(ACTIONS.buy, i, this));
      }
    }
  };
  /* 
  return the next action to explore for this node*/
  getNextActionInd = function () {
    let bestIndex = this.actions.length - 1;
    for (let i = this.actions.length - 1; i >= 0; i--) {
      if (this.actions[i].UCB > this.actions[bestIndex].UCB) {
        bestIndex = i;
      }
    }
    return bestIndex;
  };
  /* 
  return the best action to play for this snode*/
  getBestActionInd = function () {
    for (let i = 0; i < node.actions.length; i++) {
      if (node.actions[i].expUtility > node.actions[bestIndex].expUtility) {
        bestIndex = i;
      }
    }
  };
  /* 
  use state to determine my points - opp points.
  this is relative to who the node is (human or not) */
  getPointDiff = function () {
    let mySum = this.getMyPoints();
    let oppSum = this.getOppPoints();
    return mySum - oppSum;
  };
  /*
  get winPoints sum for opponent */
  getMyPoints = function () {
    let mySum = 0;
    for (let i = 0; i < this.state.myD.length; i++) {
      mySum += this.state.myD[i].wPoints;
    }
    for (let i = 0; i < this.state.myHand.length; i++) {
      mySum += this.state.myHand[i].wPoints;
    }
    for (let i = 0; i < this.state.myDis.length; i++) {
      mySum += this.state.myDis[i].wPoints;
    }
    return mySum;
  };
  /* 
  get winPoints sum for active player */
  getOppPoints = function () {
    let oppSum = 0;
    for (let i = 0; i < this.state.oppD.length; i++) {
      oppSum += this.state.oppD[i].wPoints;
    }
    for (let i = 0; i < this.state.oppHand.length; i++) {
      oppSum += this.state.oppHand[i].wPoints;
    }
    for (let i = 0; i < this.state.oppDis.length; i++) {
      oppSum += this.state.oppDis[i].wPoints;
    }
    return oppSum;
  };
  /* 
  set initial utility for note */
  getENWinsReward = function (res) {
    if (res.outcome === OUTCOMES.rWin && this.state.human === true) {
      return 1;
    } else if (res.outcome === OUTCOMES.rWin && this.state.human === false) {
      return -1;
    } else if (res.outcome === OUTCOMES.rLost && this.state.human === true) {
      return -1;
    } else if (res.outcome === OUTCOMES.rLost && this.state.human === false) {
      return 1;
    } else {
      return 0;
    }
  };
  /*
  check to see if we got a stalemate*/
  stalemate = function () {
    let oppSum = 0,
      mySum = 0;
    let cheapestShopItem = Infinity;

    let myCards = this.state.myHand.concat(this.state.myD, this.state.myDis);
    let oppCards = this.state.oppHand.concat(
      this.state.oppD,
      this.state.oppDis
    );
    let shopItems = this.state.shop.concat(this.state.shopD, this.state.shopFD);

    for (const shopCard of shopItems) {
      if (cheapestShopItem > shopCard.cost) {
        cheapestShopItem = shopCard.cost;
      }
    }
    let large1 = 0, large2 = 0, large3 = 0;
    for (const myCard of myCards) {
      if(large1 <= myCard.number){
        large3 = large2;
        large2 = large1;
        large1 = myCard.number;
      }
    }
    mySum = large1 + large2 + large3;
    large1 = 0; large2 = 0; large3 = 0;
    for (const oppCard of oppCards) {
      if(large1 <= oppCard.number){
        large3 = large2;
        large2 = large1;
        large1 = oppCard.number;
      }
    }
    oppSum = large1 + large2 + large3;
    return ((oppSum < cheapestShopItem && mySum < cheapestShopItem) || this.state.myHand || this.state.oppHand);
  };
}
/* **********************************************************************************************************
overhead that manages the entire tree. 
  @widenParam: must be a two dimensional array
***********************************************************************************************************/
class MCTSClass {
  constructor(iter, widenParam, exploreParam, rolloutType) {
    this.maxIter = iter;
    this.widenParam = widenParam;
    this.exploreParam = exploreParam;
    this.root;
    this.rolloutType = rolloutType;
    this.init();
  }
  /*
  initialize root node to the known state of the game*/
  init = function () {
    // create initial state variables
    const [oppD, myD, myHand, oppHand] = this.initDeck();
    const [shopD, shopFD, initShop] = this.initShop();
    const [myDis, oppDis] = [new Array(), new Array()];
    // create initial state
    const initState = new stateClass(
      false,
      oppD,
      myD,
      shopD,
      shopFD,
      initShop,
      myHand,
      oppHand,
      myDis,
      oppDis
    );
    // create root node
    this.root = new MCTNodeClass(
      initState,
      this.exploreParam,
      this.widenParam,
      this.rolloutType
    );
    this.root.nSamples++;
  };
  /* 
  Run MCTS for the specified iterations*/
  run = function () {
    for(let i = 0; i < this.maxIter; i++){
        this.step();
    }
    console.log('done');
  }
  /* 
  get best action  */
  best = function () {
    let bestAction = this.root.actions[0];
    for(const action of this.root.actions){
      if(action.nPicks > bestAction.nPicks){
        bestAction = action;
      }
    }
    return bestAction;
  }
  /* 
  update root to play next turn*/
  updateRoot = function(newAction, newState){
    let action = getMatchingAction(newAction);
    //try to find matching state. if not available, create a new root from scratch
    newState = sortState(JSON.parse(JSON.stringify(newState)));
    for(const path of action.paths){
        if(_.isEqual(newState, path.state)){
            this.root = path;
            return this.root;
        }
        this.root = new MCTNodeClass(newState, this.exploreParam,this.widenParam, this.rolloutType);
    }
  };
  /* 
  get action that matches given action*/
  getMatchingAction = function (newAction) {
    for(let i = 0; i < this.root.actions.length; i++){
        if(newAction.action === this.root.actions[i].action && newAction.shopIndex === this.root.actions[i].shopIndex){
            return this.rroot.actions[i];
        }
    }
  }
  /* 
  Run MCTS. 
  does one iteration*/
  step = function () {
    console.log('getBestLeaf')
    let leaf = this.getBestLeaf();
    console.log('rollout')
    let res = this.rollout(leaf);
    console.log('backProp')
    this.backProp(res, leaf);
  };
  /*
  iteratively go down the tree
  if the node has never been visited before, 
  it is a leaf node and needs a rollout*/
  getBestLeaf = function () {
    let node = this.root;

    while (node.nSamples !== 0) {
      let bestActionInd = node.getNextActionInd();
      node = node.actions[bestActionInd].getNextNode();
    }
    return node;
  };
  /*
  use rollout policy to get a estimate of the value of this state
  */
  rollout = function (leaf) {
    let state = JSON.parse(JSON.stringify(leaf.state));
    if (this.rolloutType === ROLLOUTTYPES.sBiasRand) {
      return this.rolloutBRand(state);
    } else {
      throw new Error("This Rollout method has not been implemented yet");
    }
  };
  /* 
  start at leaf node.
  update values based on result
  update parentAction and repeat
  When we reach the root, we update GLOBAL_ITER */
  backProp = function (res, leaf) {
    let node = leaf;
    while (this.root !== node) { 
        node.updateValues(res);
        node = node.parentAction.node;
    }
    this.root.nSamples++;
    for (const action of this.root.actions) {
        if (action.nPicks !== 0) {
          action.updateUCB1();
        }
      }
  };
  
  /*
  implementation of the biasRand rollout
  take a state and modify it until an end state is reached. return winner
  state must be a deep copy.*/
  rolloutBRand = function (state) {
    let rolloutNode = new MCTNodeClass(state, 0, 0, 0, 0);
    while (
      (rolloutNode.state.shopFD.length !== 0 ||
        rolloutNode.state.shopD.length !== 0) &&
      !rolloutNode.stalemate()
    ) {
      if (rolloutNode.actions.length <= 1) {
        rolloutNode.state = rolloutNode.actions[0].generateNextState();
      } else {
        let randActInd = getRandomInt(1, rolloutNode.actions.length - 1);
        rolloutNode.state = rolloutNode.actions[randActInd].generateNextState();
      }

      rolloutNode.updateActions();
    }
    let pointDiff = rolloutNode.getPointDiff();
    return this.parseWinner(pointDiff, rolloutNode.state);
  };
  /* 
  take relative point difference and human or not
  return if the robot won or not, plus the pointDifference*/
  parseWinner = function (pointDiff, state) {
    if (pointDiff === 0) {
      return {
        outcome: OUTCOMES.draw,
        pointDiff,
      };
    } else if (pointDiff < 0 && state.human === true) {
      return {
        outcome: OUTCOMES.rWin,
        rPointDiff: -1 * pointDiff,
      };
    } else if (pointDiff < 0 && state.human === false) {
      return {
        outcome: OUTCOMES.rLost,
        rPointDiff: pointDiff,
      };
    } else if (pointDiff > 0 && state.human === true) {
      return {
        outcome: OUTCOMES.rLost,
        rPointDiff: -1 * pointDiff,
      };
    } else if (pointDiff > 0 && state.human === false) {
      return {
        outcome: OUTCOMES.rWin,
        rPointDiff: pointDiff,
      };
    }
  };
  /*
  Used on initialization
  randomly creates the starting hands
  TODO: modify to use the Morphic to generate start state*/
  initDeck = function () {
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
    while (myHand.length < 3) {
      randIndMe = getRandomInt(0, myD.length - 1);
      randIndOp = getRandomInt(0, oppD.length - 1);
      myHand.push(myD.splice(randIndMe, 1)[0]);
      oppHand.push(oppD.splice(randIndOp, 1)[0]);
    }
    return [oppD, myD, myHand, oppHand];
  };
  /*
  Used on initialization
  randomly creates the starting shop 
  TODO: modify to use the Morphic to generate start state*/
  initShop = function () {
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
    while (shop.length < 4 && shopD.length) {
      randIndSh = getRandomInt(0, shopD.length - 1);
      shop.push(shopD.splice(randIndSh, 1)[0]);
    }

    if (shop.length) {
      randIndSh = getRandomInt(0, shopFD.length - 1);
      shop.push(shopFD.splice(randIndSh, 1)[0]);
    }

    return [shopD, shopFD, shop];
  };
}
const MCTS = new MCTSClass(5000, [1, .01], .2, ROLLOUTTYPES.sBiasRand);
