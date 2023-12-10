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

const Faces = {
  jack: 'jack',
  king: 'king',
  queen: 'queen',
  }

const SUITS = {
  spade: 'spade',
  club: 'club',
  diamond: 'diamond',
  heart: 'heart'
  }

class cardClass{
  constructor(number, suit, cost, wPoints,face){
    this.number = number;
    this.suit = suit;
    this.cost = cost;
    this.wPoints = wPoints;
    this.face=face

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
  constructor(state, actions,parent=null,parent_action=null,terminal,reward=0){
    this.state = state;

    this.parent=parent;
    this.parent_action=parent_action;
    this.terminal=terminal;
    this.children = [];
    this.number_of_visits = 0;
    this.result = new Proxy({}, {
      get: (target, name) => name in target ? target[name] : 0
    })
    this.actions = actions;
    this.untried_actions=[];
    if (this.state.human)
    {
    this.untried_actions=this.get_possible_actions(this.state.oppHand);
    }
    else
    {
      this.untried_actions=this.get_possible_actions(this.state.myHand);
    }

    this.i;    
  }
}

class MCTSClass{
  constructor(){
    this.root;
    
  }

}

function argMax(array) {
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}

MCTSClass.prototype.initDeck = () => {
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


MCTSClass.prototype.initShop = () => {
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


MCTSClass.prototype.initActions = () => {
  
  const actions = new actionClass()
  return actions
}

MCTSClass.prototype.init = () => {
  // create initial state variables
  const [oppD, myD, myHand, oppHand] = this.initDeck();
  const [shopD, initShop] = this.initShop();
  
  // create initial state
  const initState = new state(false, oppD, myD, shopD, initShop, myHand, oppHand);

  // use initial state to create possible actions

  // create root node
  this.root = new MCTNodeClass(initState)
}

MCTNodeClass.get_possible_actions = (hand) =>
{//this returns buymax but needs to return cards, choosen and played

  buy_list =[];
  play_list=[];
  buy_max=null
  for (cards in this.state.shopD)//assumes that shopD are the cards available at the turn
  { 
    if (cards.cost<=sum(hand))
    {
      buy_list.push(cards);
    }
    
  }

  for (cards in hand)
  { 
    if (cards.face!=null)
    {
      play_list.push(cards);
    }
    
  }

  buy_max=buy_list[argMax(buy_list)];
  

  possible_actions = new Array();
  if (buy_list.length!=0)
  {
    possible_actions.push( [buy_max,null]);
  }//read up on appending and extending arrays in js


  for (h in play_list)
  {
    possible_actions.push([null,h]);
  }

  return possible_actions;

}

MCTNodeClass.spade = (state) =>
{
  if (state.human)
  {

    steal=state.myHand.pop();
    state.oppD.push(steal);
    return state;
  }
  else
  {
    steal=state.oppHand.pop();
    state.myD.push(steal);
    return state;
  }
}

MCTNodeClass.club =(state)=>
{
  if (state.human)
  {
  state.myHand=[];
  return state;
  }
  else
  {
    state.oppHand=[];
    return state;
  }
}

MCTNodeClass.AIStep = (state,action) =>
{
  
  next_state=state
  if (action[0] !=null)
    {
      next_state.myD.push(action[0]);
      next_state.human=!next_state.human;
    }
  else 
  {
    if (state.action[1].suit =='spade')
    {
      next_state=this.spade(state);
      next_state.myD.push(action[0]);
      next_state.human=!next_state.human;
    }
    else if (state.action[1].suit =='club')
    {
      next_state=this.club(state);
      hand_ind=next_state.myHand.indexOf(action[1]);
      next_state.shopD=next_state.myHand.splice(hand_ind,1);
    }
  }
  next_state.myD=next_state.myD.concat(next_state.myHand);

  next_state.myHand=random(3,myD);//how to pick 3 random elements from a list

  if (action[0]!=null)
  {

    shop_ind=next_state.shopD.indexOf(action[0]);
    next_state.shopD=next_state.shopD.splice(shop_ind,1);
    //next_state.shopD.remove(action[0])//need to find the remove element function for this 
    //next_state.shopD.remove(action[1])
  }

    
  
  next_state.shopD.push(shop.pop());
  return next_state;
}

MCTNodeClass.humanStep = (state,action) =>
{
  
  next_state=state;

  if (action[0] !=null)
    {next_state.oppD.push(action[0]);}
  else 
  {
    if (state.action[1].suit =='spade')
    {
      next_state=this.spade(state);
      next_state.oppD.push(action[0]);
      next_state.human=!next_state.human;
    }
    else if (state.action[1].suit =='club')
    {
      next_state=this.club(state);
      hand_ind=next_state.oppHand.indexOf(action[1]);
      next_state.shopD=next_state.oppHandand.splice(hand_ind,1);
    }
  }
  
  next_state.oppD=next_state.oppD.concat(next_state.oppHand);

  next_state.oppHand=random(3,oppD);//how to pick 3 random elements from a list


  if (action[0]!=null)
  {

    shop_ind=next_state.shopD.indexOf(action[0]);
    next_state.shopD=next_state.shopD.splice(shop_ind,1);
    //next_state.shopD.remove(action[0])//need to find the remove element function for this 
    //next_state.shopD.remove(action[1])
  }

    
  
  next_state.shopD.push(shop.pop())
  return next_state
}

MCTNodeClass.step = (state,action) =>
{
  var next_state;
  var terminal=0;
  var reward=0;
  if (state.human)
  {
    
    next_state=this.humanStep(state,action);
  }
  else
  {
    next_state=this.AIStep(state,action);
  }


  if (next_state.shopD.length==0 && next_state.shop.length==0)
  {
    terminal=1;
    myVal=0
    oppVal=0

    for (card in myD)
    {
      myVal+=card.wPoints
    }
    for (card in oppD)
    {
      oppVal+=card.wPoints
    }

    if (myVal>oppVal)
    {
      reward=1
    }
    else if (oppVal>myVal)
    {
      reward=-1
    }

    return [next_state,reward,terminal];

  }

}



MCTNodeClass.expand = () => {

  action = this.untried_actions.pop();//ith action taken would be relate to ith child of the parent node
  next_state_result = this.step(this.state,action);
  next_state=next_state_result[0];
  reward=next_state_result[1];
  terminal=next_state_result[2];
  child_node = MCTS(next_state, parent=this, parent_action=action,terminal=terminal,reward=reward);//how do you call the constructor
  this.children.push(child_node);
  return child_node ;

}

MCTNodeClass.backpropogate = (result) =>
{
  this.number_of_visits += 1;
  this.results[result] += 1;
  if (this.parent)
    {this.parent.backpropagate(result);}
}

MCTNodeClass.is_fully_expanded =()=>
{
    return this.untried_actions.length == 0;
}




mcts_test=new MCTNodeClass()