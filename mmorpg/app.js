window.addEventListener('load', onGameStart, false);
window.addEventListener('keydown', onKeydown, false);
window.addEventListener('keyup', onKeyup, false);

const DEFAULT_CHAR_WIDTH = 80;
const DEFAULT_CHAR_HEIGHT = 80;
const DEFAULT_YPOS = DEFAULT_CHAR_HEIGHT * 3;

const DIRECT_RIGHT = 0;
const DIRECT_LEFT = 1;

const ACT_IDLE = 0;
const ACT_MOVE = 2;
const ACT_JUMP = 4;
const ACT_PNCH = 6;

let dataIntervalId = 0;
let drawIntervalId = 0;
var isKeyPressed = [];
let fps = 5;

const PLAY_IMG = new Image();
PLAY_IMG.src = '../images/player_ck.png';

const SLIME_IMG = new Image();
SLIME_IMG.src = '../images/greenslime.png';

const MAP_IMG = new Image();
MAP_IMG.src = '../images/map.png';

let callCnt = 0;

const CANVAS = document.createElement('canvas');
const CONTEXT = CANVAS.getContext('2d');

let canvasWidth = DEFAULT_CHAR_WIDTH * 10;
let canvasHeight = DEFAULT_CHAR_HEIGHT * 5;

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
    'xpos': canvasWidth - DEFAULT_CHAR_WIDTH,
    'ypos': DEFAULT_YPOS,
    'width': DEFAULT_CHAR_WIDTH,
    'height': DEFAULT_CHAR_HEIGHT,
    'direct': DIRECT_LEFT,
    'act': ACT_IDLE,
    'img': SLIME_IMG
  }
};

const map = [
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [ 0,  1,  2, -1,  0,  1,  1,  1,  2, -1,  0,  1,  1,  1,  1,  1,  1,  1,  1,  2]
];

function onGameStart(){
  document.body.appendChild(CANVAS);

  window.addEventListener('resize', resize, false);
  resize();

  drawIntervalId = setInterval(drawScreen, 1000/fps)
}

function resize(){
  CANVAS.width = canvasWidth;
  CANVAS.height = canvasHeight;
  CONTEXT.scale(1, 1);
}

function drawScreen(){
  callCnt++;
  
  CONTEXT.fillStyle = "#fff";
  CONTEXT.fillRect(0, 0, canvasWidth, canvasHeight);

  movePlayer();
  moveSlime();
  drawObject(CONTEXT);
  drawGraund(CONTEXT);

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

function drawGraund(context){
  for(let y=0; y<map.length; y++){
    let ymax = map[y].length;
    for(let x=0; x<ymax; x++){
      // let tileType = 0;
      // if(x == 0){
      //   tileType = 0;
      // }else if(x == ymax-1){
      //   tileType = 160;
      // }else{
      //   tileType = 80;
      // }
      
      if(map[y][x] > -1){
        context.drawImage(MAP_IMG
          ,map[y][x] * 80 , DEFAULT_CHAR_WIDTH * 0, DEFAULT_CHAR_WIDTH, DEFAULT_CHAR_HEIGHT
          ,DEFAULT_CHAR_WIDTH * x, DEFAULT_CHAR_HEIGHT * y, DEFAULT_CHAR_WIDTH, DEFAULT_CHAR_HEIGHT);
      }
    }
  }
}

let jump = 4;
function movePlayer(){
  //Action
  if(allObj["player"].act == ACT_JUMP){
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

  if(isKeyPressed[32]){ //스페이스 바
    if(allObj["player"].act != ACT_JUMP){
      allObj["player"].act = ACT_PNCH;
    }
  }

  if(isKeyPressed[38]){ // 위쪽
    if(allObj["player"].act != ACT_JUMP){
      allObj["player"].act = ACT_JUMP;
      jump = 0;
    }
  }
  if(isKeyPressed[39]){ //오른쪽
    allObj["player"].xpos += allObj["player"].speed;
    allObj["player"].direct = DIRECT_RIGHT;
    if(allObj["player"].act != ACT_JUMP && allObj["player"].act != ACT_PNCH){
      allObj["player"].act = ACT_MOVE;
    }
    if(allObj["player"].xpos > canvasWidth-allObj["player"].width){
      allObj["player"].xpos = canvasWidth-allObj["player"].width;
    }
  }
  if(isKeyPressed[37]){ //왼쪽
    allObj["player"].xpos -= allObj["player"].speed;
    allObj["player"].direct = DIRECT_LEFT;
    if(allObj["player"].act != ACT_JUMP && allObj["player"].act != ACT_PNCH){
      allObj["player"].act = ACT_MOVE;
    }
    if(allObj["player"].xpos < 0){
      allObj["player"].xpos = 0;
    }
  }

  //방향키 안눌렀을때 숨쉬기 상태.
  if(!isKeyPressed[37] && !isKeyPressed[38] && !isKeyPressed[39] && !isKeyPressed[40] && !isKeyPressed[32]){
    if(allObj["player"].act != ACT_JUMP){
      allObj["player"].act = ACT_IDLE;
    }
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
      if(slime.xpos > canvasWidth-slime.width){
        slime.xpos = canvasWidth-slime.width;
      }
    }
  }else{
    slime.act = ACT_IDLE;
  }
  
}

function onGameStop(){
  clearInterval(drawIntervalId);
}

function onKeydown(e){
  // console.log(`keyCode:${e.keyCode}`);
  this.isKeyPressed[e.keyCode] = true;
}

function onKeyup(e){
  this.isKeyPressed[e.keyCode] = false;
}

