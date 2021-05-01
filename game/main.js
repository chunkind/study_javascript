window.addEventListener("load", drawScreen, false);

var imgBackground = new Image();
imgBackground.src = "../images/background.png";
imgBackground.addEventListener("load", drawScreen, false);

var imgPlayer = new Image();
imgPlayer.src = "../images/player.png";
imgPlayer.addEventListener("load", drawScreen, false);

function drawScreen(){
    var theCanvas = document.getElementById("main_canvas");
    var Context = theCanvas.getContext("2d");

    Context.fillStyle = "#000000";
    Context.fillRect(0, 0, 800, 600); // start_x, start_y, width, height

    Context.drawImage(imgBackground, 0, 0);

    Context.drawImage(imgPlayer, 350, 250);

    //350, 250 좌표에 비행기를 그려보시오.
}