window.addEventListener("load", drawScreen, false);
window.addEventListener("keydown", onKeydown, false);
window.addEventListener("keyup", onKeyup, false);

var imgBackground = new Image();
imgBackground.src = "../images/background.png";

var imgPlayer = new Image();
imgPlayer.src = "../images/player.png"

var imgMissile = new Image();
imgMissile.src = "../images/missile.png";

var GAME_START_READY = 0;
var GAME_START_GAME = 1;
var GAME_START_OVER = 2;

var gameState = GAME_START_READY;

var arrMissiles = new Array();

var isKeyPressed = [];

var intPlayerX = 350, intPlayerY = 250, intPlayerSpeed = 10; //플래이어 x,y좌표, 속도
var fps = 40; //초당 프레임수
var intervalId = 0; //timer id값
var intTime = 0; //수치값 계산

//========================리스터 핸들러===========================

//수치가 계산된 내용을 그려주는 역활
function drawScreen(){
    var theCanvas =  document.getElementById("GameCanvas");
    var Context = theCanvas.getContext("2d");

    Context.fillStyle = "#000000";
    Context.fillRect(0, 0, 800, 600); // start_x, start_y, width, height

    Context.drawImage(imgBackground, 0, 0);
    Context.drawImage(imgPlayer, intPlayerX, intPlayerY);

    Context.fillStyle = "#FFFFFF";
    Context.font = "50px Arial";
    Context.textBaseline = "top";

    if(gameState == GAME_START_READY){    
        Context.fillText("준비", 330, 180);
    }

    if(gameState == GAME_START_GAME){
        for(var i=0; i<arrMissiles.length; i++){
            Context.drawImage(imgMissile, arrMissiles[i].x, arrMissiles[i].y);
        }
    }

    if(gameState == GAME_START_OVER){
        Context.fillText("게임오버", 300, 180);
    }
}

function onKeydown(e){
    if(gameState == GAME_START_READY)
        if(e.keyCode == 13) onGameStart();
    if(gameState == GAME_START_GAME)
        this.isKeyPressed[e.keyCode] = true;
    if(gameState == GAME_START_OVER)
        if(e.keyCode == 13) onGameReady();
}

function onKeyup(e){
    this.isKeyPressed[e.keyCode] = false;
}

//========================게임관련 로직===========================
function onGameStart(){
    gameState = GAME_START_GAME;

    //미사일 초기에 50개 그려줄거임
    var intX, intY, intGoX, intGoY;
    for(var i=0; i<50; i++){
        var MisiileType = RandomNextInt(4);
        switch(MisiileType){
            case 1: //왼쪽 총알
            intX = 0;
            intY = RandomNextInt(600);
            intGoX = RandomNextInt(2);
            intGoY = -2 + RandomNextInt(4);
                break;
            case 2: //오른쪽 총알
            intX = 800;
            intY = RandomNextInt(600);
            intGoX = -RandomNextInt(2);
            intGoY = -2 + RandomNextInt(4);
                break;
            case 3: //위쪽 총알
            intX = RandomNextInt(800);
            intY = 0;
            intGoX = -2 + RandomNextInt(4);
            intGoY = RandomNextInt(2);
                break;
            case 4: //아래쪽 총알
            intX = RandomNextInt(800);
            intY = 600;
            intGoX = -2 + RandomNextInt(4);
            intGoY = -RandomNextInt(2);
                break;
        }
        arrMissiles.push({x:intX, y:intY, go_x:intGoX, go_y:intGoY});
    }

    intervalId = setInterval(InGameUpdate, 1000/fps);
}

function onGameReady(){
    gameState = GAME_START_READY;

    //타이머 초기화
    intTime = 0;

    //좌표 초기화
    intPlayerX = 350;
    intPlayerY = 250;

    //미사일 초기화.
    while(arrMissiles.length != 0){
        arrMissiles.pop();
    }

    drawScreen();
}

function onGameOver(){
    gameState = GAME_START_OVER;
    clearInterval(intervalId);
}

function InGameUpdate(){
    var intX=0, intY=0, intGoX=0, intGoY=0;
    if(intTime % 5000 == 0){
        for(var i=0; i<4; i++){
            switch(i){
                case 0: //왼쪽 총알
                intX = 0;
                intY = RandomNextInt(600);
                intGoX = RandomNextInt(2);
                intGoY = -2 + RandomNextInt(4);
                    break;
                case 1: //오른쪽 총알
                intX = 800;
                intY = RandomNextInt(600);
                intGoX = -RandomNextInt(2);
                intGoY = -2 + RandomNextInt(4);
                    break;
                case 2: //위쪽 총알
                intX = RandomNextInt(800);
                intY = 0;
                intGoX = -2 + RandomNextInt(4);
                intGoY = RandomNextInt(2);
                    break;
                case 3: //아래쪽 총알
                intX = RandomNextInt(800);
                intY = 600;
                intGoX = -2 + RandomNextInt(4);
                intGoY = -RandomNextInt(2);
                    break;
            }
            arrMissiles.push({x:intX, y:intY, go_x:intGoX, go_y:intGoY});
        }
    }
    intTime+=100;

    MoveMissile();

    MoveCharator();

    drawScreen();
}

function RandomNextInt(max){
    return 1 + Math.floor(Math.random() * max);
}

function MoveCharator(){
    if(isKeyPressed[37]){
        intPlayerX-=intPlayerSpeed;
        if(intPlayerX < 0){
            intPlayerX = 0;
        }
    }
    if(isKeyPressed[38]){
        intPlayerY-=intPlayerSpeed;
        if(intPlayerY < 0){
            intPlayerY = 0;
        }
    }
    if(isKeyPressed[39]){
        intPlayerX+=intPlayerSpeed;
        if(intPlayerX > 742){
            intPlayerX = 742;
        }
    }
    if(isKeyPressed[40]){
        intPlayerY+=intPlayerSpeed;
        if(intPlayerY > 544){
            intPlayerY = 544;
        }
    }
}


function MoveMissile(){
    //움직임을 봐쭤주는 로직 작성..
    for(var i=0; i<arrMissiles.length; i++){
       arrMissiles[i].x += arrMissiles[i].go_x;
       arrMissiles[i].y += arrMissiles[i].go_y;

       if(IsCollisionWithPlayer(arrMissiles[i].x, arrMissiles[i].y)){
           onGameOver();
       }
    }
}

function IsCollisionWithPlayer(missileX, missileY){
    var isLeft = false;
    var isRight = false;
    var isTop = false;
    var isBottom = false;

    if(intPlayerX + 5 < missileX + 55){
        isLeft = true;
    }
    if(intPlayerX + 55 > missileX + 5){
        isRight = true;
    }
    if(intPlayerY + 55 > missileY + 5){
        isTop = true;
    }
    if(intPlayerY + 5 < missileY + 55){
        isBottom = true;
    }

    if(isLeft && isRight && isTop && isBottom){
        return true;
    }

    return false;
}