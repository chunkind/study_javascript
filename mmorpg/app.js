window.addEventListener('load', onGameStart, false);
window.addEventListener('keydown', onKeydown, false);
window.addEventListener('keyup', onKeyup, false);

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

const DEFAULT_CHAR_WIDTH = 80;
const DEFAULT_CHAR_HEIGHT = 80;

const DIRECT_DOWN = 0 * DEFAULT_CHAR_HEIGHT;
const DIRECT_UP = 1 * DEFAULT_CHAR_HEIGHT;
const DIRECT_LEFT = 2 * DEFAULT_CHAR_HEIGHT;
const DIRECT_RIGHT = 3 * DEFAULT_CHAR_HEIGHT;

let dataIntervalId = 0;
let drawIntervalId = 0;
var isKeyPressed = [];
let fps = 20;

const allObj = {
  'player':{
    'name':'player',
    'imgsrc':'../images/janghoon.png',
    'speed': 10,
    'xpos': 100,
    'ypos': 100,
    'width': DEFAULT_CHAR_WIDTH,
    'height': DEFAULT_CHAR_HEIGHT,
    'direct': DIRECT_DOWN,
    'img':function(){
      let img = new Image();
      img.src = this.imgsrc;
      return img;
    }
  },
  'slime':{
    'name':'slime',
    'imgsrc':'../images/slime.png',
    'speed': 10,
    'xpos': 200,
    'ypos': 200,
    'width': DEFAULT_CHAR_WIDTH,
    'height': DEFAULT_CHAR_HEIGHT,
    'direct': DIRECT_LEFT,
    'img':function(){
      let img = new Image();
      img.src = this.imgsrc;
      return img;
    }
  },
  'shoot':{
    'name':'shoot',
    'imgsrc':'../images/shoot.png',
    'speed': 10,
    'xpos': 200,
    'ypos': 200,
    'width': DEFAULT_CHAR_WIDTH,
    'height': DEFAULT_CHAR_HEIGHT,
    'direct': DIRECT_LEFT,
    'img':function(){
      let img = new Image();
      img.src = this.imgsrc;
      return img;
    }
  }
};

let callCnt = 0;

function drawScreen(){
  callCnt++;
  let gameCanvas = document.getElementById("main_canvas");
  let context = gameCanvas.getContext("2d");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  movePlayer();
  if(callCnt%50 == 0){
    moveSlime();
  }
  drawObject(context, callCnt);

  let cnt = callCnt%3

}

function drawObject(context, callCnt){
  let cnt = callCnt%3;
  for(const key in allObj){
    context.drawImage(allObj[key].img()
      , allObj[key].width * cnt, allObj[key].direct, allObj[key].width, allObj[key].height
      , allObj[key].xpos, allObj[key].ypos, allObj[key].width, allObj[key].height);
  }
}

function movePlayer(){
  if(isKeyPressed[40]){ //아래쪽
    allObj["player"].ypos += allObj["player"].speed;
    allObj["player"].direct = 0;
    if(allObj["player"].ypos > SCREEN_HEIGHT-allObj["player"].height){
      allObj["player"].ypos = SCREEN_HEIGHT-allObj["player"].height;
    }
  }
  if(isKeyPressed[38]){ //위쪽
    allObj["player"].ypos -= allObj["player"].speed;;
    allObj["player"].direct = 80;
    if(allObj["player"].ypos < 0){
      allObj["player"].ypos = 0;
    }
  }
  if(isKeyPressed[37]){ //왼쪽
    allObj["player"].xpos -= allObj["player"].speed;;
    allObj["player"].direct = 160;
    if(allObj["player"].xpos < 0){
      allObj["player"].xpos = 0;
    }
  }
  if(isKeyPressed[39]){ //오른쪽
    allObj["player"].xpos += allObj["player"].speed;;
    allObj["player"].direct = 240;
    if(allObj["player"].xpos > SCREEN_WIDTH-allObj["player"].width){
      allObj["player"].xpos = SCREEN_WIDTH-allObj["player"].width;
    }
  }
}

function moveSlime(){
  let silme = allObj["slime"];
  let randomeCnt = Math.floor(Math.random()*4);
  if(randomeCnt==0){
    silme.direct = DIRECT_LEFT;
    silme.xpos -= silme.speed;
  }
  if(randomeCnt==1){
    silme.direct = DIRECT_RIGHT;
    silme.xpos += silme.speed;
  }
  if(randomeCnt==2){
    silme.direct = DIRECT_UP;
    silme.ypos -= silme.speed;
  }
  if(randomeCnt==3){
    silme.direct = DIRECT_DOWN;
    silme.ypos += silme.speed;
  }
}

function onGameStart(){
  drawIntervalId = setInterval(drawScreen, 1000/fps)
}

function onKeydown(e){
  this.isKeyPressed[e.keyCode] = true;
}

function onKeyup(e){
  this.isKeyPressed[e.keyCode] = false;
}