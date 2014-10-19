var current_frame;
var frame_totals;
var pins;
var dice_rolls_1;
var dice_rolls_2;
var dice_rolls_3;
var equations;
var ball;

function initGame() {
    current_frame = 0;
    frame_totals = new Array();
    pins = new Array();
    dice_rolls_1 = new Array();
    dice_rolls_2 = new Array();
    dice_rolls_3 = new Array();
    equations = new Array();

    //initialize 10 sets of 10 pins to true
    //pins[frame][ball]
    for (i = 0; i < 10; i++) {
        pins[i] = new Array();
        for (j = 0; j < 10; j++) {
            pins[i][j] = true;
        }
    }
    
    //initialize frame totals to zero
    for (i = 0; i < 10; i++) {
        frame_totals[i] = new Array();
        for (j = 0; j < 10; j++) {
            frame_totals[i][j] = 0;
        }
    }
    
    //initialize frame equations (2d array of equations) array[frame][eq]
    for (i = 0; i < 10; i++) {
        equations[i] = new Array();
    }
    
    //initialize the first frame
    initFrame();
}

function initFrame() {
    ball = 0;
    for (i = 0; i < 10; i++) {
        dice_rolls_1[i] = new Array();
        dice_rolls_2[i] = new Array();
        dice_rolls_3[i] = new Array();
    }
    dice_rolls_1[current_frame][ball] = Math.floor(Math.random()*6+1);
    dice_rolls_2[current_frame][ball] = Math.floor(Math.random()*6+1);
    dice_rolls_3[current_frame][ball] = Math.floor(Math.random()*6+1);
    
    update();
}

//try to knock down pin, make sure not already knocked down.
function knockPin(pin) {
    if (!(pins[current_frame][pin])) {
        alert("pin already knocked over");
        return false;
    } else {
        pins[current_frame][pin] = false;
        drawCanvas();
        return true;
    }
}

function drawCanvas() {
    var canvas = document.getElementById("canvas");
	var canv = canvas.getContext("2d");
	var img1 = new Image();
    var img2 = new Image();
    var img3 = new Image();
    var img4 = new Image();
    var img5 = new Image();
    var img6 = new Image();
    var img7 = new Image();
    var img8 = new Image();
    var img9 = new Image();
    var img10 = new Image();
	var background = new Image();

	background.onload = function(){
		canv.drawImage(background,0,0);
		if(pins[current_frame][0]) { canv.drawImage(img1,280,275); }
   		if(pins[current_frame][1]) { canv.drawImage(img2,240,185); }
		if(pins[current_frame][2]) { canv.drawImage(img3,320,185); }
		if(pins[current_frame][3]) { canv.drawImage(img4,200,95); }
		if(pins[current_frame][4]) { canv.drawImage(img5,280,95); }
		if(pins[current_frame][5]) { canv.drawImage(img6,360,95); }
   		if(pins[current_frame][6]) { canv.drawImage(img7,160,5); }
		if(pins[current_frame][7]) { canv.drawImage(img8,240,5); }
		if(pins[current_frame][8]) { canv.drawImage(img9,320,5); }
		if(pins[current_frame][9]) { canv.drawImage(img10,400,5); }
    }
	img1.src="image/pin1.png";
    img2.src="image/pin2.png";
    img3.src="image/pin3.png";
    img4.src="image/pin4.png";
    img5.src="image/pin5.png";
    img6.src="image/pin6.png";
    img7.src="image/pin7.png";
    img8.src="image/pin8.png";
    img9.src="image/pin9.png";
    img10.src="image/pin10.png";
    
	background.src="image/lane.jpg";
}

//calculate and return current score.
function getScore() {
    var total = 0;
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            total += frame_totals[i][j];
        }
    }
    return total;
}

function runningScore() {
    var frameBase = new Array();
    var frameSum = new Array();
    var frameTotal = new Array();
    for(i = 0; i < 10; i++){
        frameBase[i] = 0;
        frameSum[i] = 0;
        frameTotal[i] = 0;
    }
    for(i = 0; i < 10; i++){
        frameBase[i] = frame_totals[i][0] + frame_totals[i][1];
    }
    for(i = 9; i >= 0; i--){
        if(i == 9){
            frameSum[i] = frameBase[i] + frame_totals[i][2];
        }
        else if(frame_totals[i][0] == 10){
            frameSum[i] = frameBase[i] + frame_totals[i+1][0] + frame_totals[i+1][1];
        }
        else if(frame_totals[i][0] + frame_totals[i][1] == 10){
            frameSum[i] = frameBase[1] + frame_totals[i+1][0];
        }
        else{
            frameSum[i] = frameBase[i];
        }
    }
    for(i = 0; i < 10; i++){
        if(i == 0){
            frameTotal[i] = frameSum[i];
        }
        else{
            frameTotal[i] = frameTotal[i-1] + frameSum[i];
        }
    }
    for (i = 0; i < 9; i++) {
        var col = document.getElementById('myTable').rows[i+1].cells;
        col[6].innerHTML = frameTotal[i];
    }
    var col = document.getElementById('myTable').rows[9+1].cells;
    col[7].innerHTML = frameTotal[9];
}

//populate dropdown select boxes
function fillNums(val1, val2, val3) {
    document.getElementById("num1").options[1] = new Option(val1, val1.toString());
    document.getElementById("num1").options[2] = new Option(val2, val2.toString());
    document.getElementById("num1").options[3] = new Option(val3, val3.toString());
    document.getElementById("num2").options[1] = new Option(val1, val1.toString());
    document.getElementById("num2").options[2] = new Option(val2, val2.toString());
    document.getElementById("num2").options[3] = new Option(val3, val3.toString());
}

//verify correct submission
function verify(submitted, expected) {
    if (submitted == expected) {
        //set values into doc, add, etc
        var operator = document.getElementById("operator").value;
        var num1 = parseInt(document.getElementById("num1").value);
        var num2 = parseInt(document.getElementById("num2").value);
        var col = document.getElementById('myTable').rows[current_frame+1].cells;
        if (knockPin(expected-1)) {
            frame_totals[current_frame][ball]++;
            equations[current_frame] += + num1 + operator + num2 + "=" + expected + "<br/>"
            col[3].innerHTML = equations[current_frame];
            update();
        }
    } else {
        alert("INCORRECT");
        update();
        nextBall();
    }
}

//user submits answer
function submit() {
    //do initial checks, update values, send to david?
    var operator = document.getElementById("operator").value;
    var num1 = parseInt(document.getElementById("num1").value);
    var num2 = parseInt(document.getElementById("num2").value);
    var submitted = parseInt(document.getElementById("answer").value);
    
    if (operator == "+") {
        verify(submitted, num1 + num2);
    } else if (operator == "-") {
        verify(submitted, num1 - num2);
    } else if (operator == "*") {
        verify(submitted, num1 * num2);
    } else if (operator == "/") {
        verify(submitted, num1 / num2);
    }
}

//user advances to the next frame
function nextFrame() {
    current_frame++;
    ball = 0;
    if(current_frame > 9) {
        //end game
        alert("Game Over");
        alert("Total Score: " + getScore());
        //resetgame
    }
    initFrame();
}

//reset game
function resetGame() {
    window.location = "index.html";
}

function adjustSelect1() {
    var index = document.getElementById("num1").selectedIndex;
    for (i = 0; i < 3; i++) {
        if (i == index) {
            document.getElementById("num2").options[i].style.visibility = "hidden";
        } else {
            document.getElementById("num2").options[i].style.visibility = "visible";
        }
    }
}

function adjustSelect2() {
    var index = document.getElementById("num2").selectedIndex;
    for (i = 0; i < 3; i++) {
        if (i == index) {
            document.getElementById("num1").options[i].style.visibility = "hidden";
        } else {
            document.getElementById("num1").options[i].style.visibility = "visible";
        }
    }
}

function update() {
    //tenth frame logic?
    var col = document.getElementById('myTable').rows[current_frame+1].cells;
    if (current_frame == 9) {
        col[7].innerHTML = frame_totals[current_frame][0] + frame_totals[current_frame][1];
    } else {
        col[6].innerHTML = frame_totals[current_frame][0] + frame_totals[current_frame][1];
    }
    fillNums(dice_rolls_1[current_frame][ball], dice_rolls_2[current_frame][ball], dice_rolls_3[current_frame][ball]);
    col[ball+1].innerHTML = dice_rolls_1[current_frame][ball].toString() + ", " +dice_rolls_2[current_frame][ball].toString() + ", " + dice_rolls_3[current_frame][ball].toString();
    col[ball+4].innerHTML = frame_totals[current_frame][ball];

    document.getElementById('totalscore').innerHTML = "Total Score: " + getScore();
    drawCanvas();
}

function nextBall() {
    //tenth frame logic?
    ball++;
    if (ball > 1) {
        nextFrame();
        return;
    }
    dice_rolls_1[current_frame][ball] = Math.floor(Math.random()*6+1);
    dice_rolls_2[current_frame][ball] = Math.floor(Math.random()*6+1);
    dice_rolls_3[current_frame][ball] = Math.floor(Math.random()*6+1);
    update();
}