window.addEventListener('load', onGameStart, false);
window.addEventListener('keydown', onKeydown, false);
window.addEventListener('keyup', onKeyup, false);

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 400;

const DEFAULT_CHAR_WIDTH = 80;
const DEFAULT_CHAR_HEIGHT = 80;
const DEFAULT_YPOS = DEFAULT_CHAR_HEIGHT * 3;

const DIRECT_RIGHT = 0;
const DIRECT_LEFT = 1;

const ACT_IDLE = 0;
const ACT_MOVE = 2;
const ACT_JUMP = 4;

let dataIntervalId = 0;
let drawIntervalId = 0;
var isKeyPressed = [];
let fps = 15;

const PLAY_IMG = new Image();
PLAY_IMG.src = '../images/player_ck.png';

const SLIME_IMG = new Image();
SLIME_IMG.src = '../images/greenslime.png';

const MAP_IMG = new Image();
MAP_IMG.src = '../images/map.png';

const allObj = {
  'player':{
    'name':'player',
    'speed': 20,
    'xpos': 0,
    'ypos': DEFAULT_YPOS,
    'width': DEFAULT_CHAR_WIDTH,
    'height': DEFAULT_CHAR_HEIGHT,
    'direct': DIRECT_RIGHT,
    'act': ACT_IDLE,
    'img': PLAY_IMG
  },
  'slime':{
    'name':'slime',
    'speed': 10,
    'xpos': SCREEN_WIDTH-DEFAULT_CHAR_WIDTH,
    'ypos': DEFAULT_YPOS,
    'width': DEFAULT_CHAR_WIDTH,
    'height': DEFAULT_CHAR_HEIGHT,
    'direct': DIRECT_LEFT,
    'act': ACT_IDLE,
    'img': SLIME_IMG
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
  moveSlime();
  drawObject(context);
  drawGraund(context);

}

function drawObject(context){
  let cnt = Math.floor(callCnt/2)%4;
  for(const key in allObj){
    let pic_start_x = (allObj[key].direct + allObj[key].act) * DEFAULT_CHAR_HEIGHT;
    let pic_img = allObj[key].img;
    context.drawImage(pic_img
      , allObj[key].width * cnt, pic_start_x, allObj[key].width, allObj[key].height
      , allObj[key].xpos, allObj[key].ypos, allObj[key].width, allObj[key].height);
  }
}


const map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];

function drawGraund(context){
  for(let y=0; y<map.length; y++){
    let ymax = map[y].length;
    for(let x=0; x<ymax; x++){
      let tileType = 0;
      if(x == 0){
        tileType = 0;
      }else if(x == ymax-1){
        tileType = 160;
      }else{
        tileType = 80;
      }
      
      if(map[y][x] == 2){
        context.drawImage(MAP_IMG
          ,tileType , DEFAULT_CHAR_WIDTH * 0, DEFAULT_CHAR_WIDTH, DEFAULT_CHAR_HEIGHT
          ,DEFAULT_CHAR_WIDTH * x, DEFAULT_CHAR_HEIGHT * y, DEFAULT_CHAR_WIDTH, DEFAULT_CHAR_HEIGHT);
      }
    }
  }
}

let jump = 4;
function movePlayer(){

  console.log(`jump:${isKeyPressed[38]}`);

  if(allObj["player"].act != ACT_JUMP && isKeyPressed[38]){ // 위쪽
    allObj["player"].act = ACT_JUMP;
    jump = 0;
  }
  if(allObj["player"].act != ACT_JUMP && isKeyPressed[39]){ //오른쪽
    allObj["player"].xpos += allObj["player"].speed;
    allObj["player"].direct = DIRECT_RIGHT;
    allObj["player"].act = ACT_MOVE;
    if(allObj["player"].xpos > SCREEN_WIDTH-allObj["player"].width){
      allObj["player"].xpos = SCREEN_WIDTH-allObj["player"].width;
    }
  }
  if(allObj["player"].act != ACT_JUMP && isKeyPressed[37]){ //왼쪽
    allObj["player"].xpos -= allObj["player"].speed;
    allObj["player"].direct = DIRECT_LEFT;
    allObj["player"].act = ACT_MOVE;
    if(allObj["player"].xpos < 0){
      allObj["player"].xpos = 0;
    }
  }

  if(allObj["player"].act == ACT_JUMP && isKeyPressed[39]){ //오른쪽
    allObj["player"].xpos += allObj["player"].speed;
    allObj["player"].direct = DIRECT_RIGHT;
    if(allObj["player"].xpos > SCREEN_WIDTH-allObj["player"].width){
      allObj["player"].xpos = SCREEN_WIDTH-allObj["player"].width;
    }
  }
  if(allObj["player"].act == ACT_JUMP && isKeyPressed[37]){ //왼쪽
    allObj["player"].xpos -= allObj["player"].speed;
    allObj["player"].direct = DIRECT_LEFT;
    if(allObj["player"].xpos < 0){
      allObj["player"].xpos = 0;
    }
  }

  if(jump < 4 && allObj["player"].act == ACT_JUMP){
    if(jump == 0){
      allObj["player"].ypos -= allObj["player"].speed * 3;
    }
    else if(jump == 1){
      allObj["player"].ypos -= allObj["player"].speed * 3;
    }
    else if(jump == 2){
      allObj["player"].ypos += allObj["player"].speed * 3;
    }
    else if(jump == 3){
      allObj["player"].ypos += allObj["player"].speed * 3;
      allObj["player"].act = ACT_IDLE;
    }

    jump++;
  }
}

function moveSlime(){
  let slime = allObj["slime"];
  let randomeCnt = Math.floor(Math.random()*2);
  if(callCnt%50 == 0){
    if(randomeCnt==0){
      slime.direct = DIRECT_LEFT;
      slime.act = ACT_MOVE;
      slime.xpos -= slime.speed;
      if(slime.xpos < 0){
        slime.xpos = 0;
      }
    }else if(randomeCnt==1){
      slime.direct = DIRECT_RIGHT;
      slime.act = ACT_MOVE;
      slime.xpos += slime.speed;
      if(slime.xpos > SCREEN_WIDTH-slime.width){
        slime.xpos = SCREEN_WIDTH-slime.width;
      }
    }
  }else{
    slime.act = ACT_IDLE;
  }
  
}

function onGameStart(){
  drawIntervalId = setInterval(drawScreen, 1000/fps)
}

function onGameStop(){
  clearInterval(drawIntervalId);
}

function onKeydown(e){
  this.isKeyPressed[e.keyCode] = true;
}

function onKeyup(e){
  this.isKeyPressed[e.keyCode] = false;
}

