window.addEventListener("load", drawScreen, false);
window.addEventListener("keydown", onKeydown, false);
window.addEventListener("keyup", onKeyup, false);

var strKeyEventType = "None";
var strKeyEventValue = "None";
var strKeyEventCode = "None";

function drawScreen(){
    var theCanvas = document.getElementById("main_canvas");
    var Context = theCanvas.getContext("2d");

    Context.fillStyle = "#000000";
    Context.fillRect(0, 0, 800, 600);

    Context.fillStyle = "#ffffff";
    Context.font = "25px Arial";
    Context.textBaseline = "top";
    Context.fillText("키이벤트: " + strKeyEventType, 5, 5);
    Context.fillText("키값 : " + strKeyEventValue, 5, 30);
    Context.fillText("키코드 : " + strKeyEventCode, 5, 55);
}

function onKeydown(e){
    strKeyEventType = e.type;
    strKeyEventValue = e.key;
    strKeyEventCode = e.keyCode;
    drawScreen();
}

function onKeyup(e){
    strKeyEventType = e.type;
    strKeyEventValue = e.key;
    strKeyEventCode = e.keyCode;
    drawScreen()
}