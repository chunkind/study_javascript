//필요한 클래스 포함
var Game = SGF.require("Game");
var Input = SGF.require("Input");
var Rectangle = SGF.require("Rectangle");
var Label = SGF.require("Label");

//게임 인스턴스에 대한 참조를 얻는다.
var myGame = Game.getInstance();

//게임의 입력 인스턴스에 대한 참조를 얻는다.
var myInput = myGame.input;
var game_height = 400;
var game_width = 400;

myGame.getScript("Paddle.js", function(){
    //좌측 라켓
    myGame.leftPaddle = new Paddle();
    myGame.leftPaddle.setPosition(0, 150);
    myGame.addComponent(myGame.leftPaddle);
})

