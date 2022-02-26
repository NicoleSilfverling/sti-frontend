const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


canvas.style.border = "10px solid #0c1f4f";
ctx.lineWidth = 3;

const BG_IMG = new Image();
BG_IMG.src = "/images/bg3.png"

const lifeImg = new Image();
lifeImg.src = "/images/neon-heart.png";

const coinImg = new Image();
coinImg.src = "/images/coin.png";


let life = 3;
let showHeart = false;
let showCoin = false;
let score = 0;
const SCORE_UNIT = 10;
let GAME_OVER = false;
let level = 1;

const heart = {
    w: 30,
    h: 30,
    x: 20,
    y: 0,
    dx: 0,
    dy: 1
}

const coin = {
    w: 30,
    h: 30,
    x: 250,
    y: 0,
    dx: 0,
    dy: 1.5
}

//paddle
const paddleWidth = 100;
const paddleHeight = 20;
const paddleMarginBottom = 30;

const paddle = {
    x: (canvas.width - paddleWidth)/2, 
    y:canvas.height - paddleHeight - paddleMarginBottom,
    width: paddleWidth,
    height: paddleHeight,
    dx: 5
}

//ball
const ballRadius = 10;
const ball = {
    x: canvas.width/2,
    y: paddle.y - ballRadius,
    radius: ballRadius,
    speed: 5,
    dx: 3 * (Math.random() * 2-1),
    dy: -3
}

// skapa bricks
const brick = {
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: '#0c1f4f',
    strokeColor : "#0dfafa",
    strokeColor2: '#ed27ec'
}

let bricks = [];

function createBricks(){
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * (brick.width + brick.offSetLeft) + brick.offSetLeft,
                y: r * (brick.height + brick.offSetTop) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}
createBricks();

function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            if(b.status){

              
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                
                //glow
                if(level%2 == 1){
                    ctx.shadowColor = brick.strokeColor;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowBlur = 10; 
    
                    ctx.strokeStyle = brick.strokeColor;

                }else{

                ctx.shadowColor = brick.strokeColor2;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 10; 

                ctx.strokeStyle = brick.strokeColor2;
                
                }
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);

            }
        }
    }
}

function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    ball.dy = - ball.dy;
                    b.status = false; 
                    score += SCORE_UNIT;
                }
            }
        }
    }
}


function gameStats(text, textX, textY, img, imgX, imgY){
    ctx.fillStyle = '#FFF';
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    ctx.drawImage(img, imgX, imgY, 25, 25);
}
//gameStats(score, 35, 25, )

function gameStatsText(text, textX, textY){
    ctx.fillStyle = '#FFF';
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
}



function drawExtraLife(){
    if(showHeart){
        ctx.shadowBlur = 0; 
        ctx.drawImage(lifeImg, heart.x, heart.y, heart.w, heart.h);
    }
}
function fallingHeart(){
    if(score == 40 || score == 100 ||score == 220 || score == 550 || score == 830 || score == 1100 ||  score == 1400|| showHeart == true){
        showHeart = true;
        drawExtraLife();
        heart.y += heart.dy;
    }
    
}

function heartPaddleCollision(){
    if(heart.y > paddle.y && heart.x > paddle.x && paddle.y < paddle.y + paddle.height && heart.x < paddle.x + paddle.width ){
        if (life < 3){
            showHeart = false;
            life++;
            heart.y = 0;
            heart.x = Math.floor(Math.random() * canvas.width) + 1;
        }
    }

    if(heart.y >= canvas.height){
        showHeart = false;
        heart.y = 0;
        heart.x = Math.floor(Math.random() * canvas.width) + 1;
    }
}

//coin
function drawCoin(){
    if(showCoin){
        ctx.shadowBlur = 5; 
        ctx.shadowColor = 'yellow';
        ctx.drawImage(coinImg, coin.x, coin.y, coin.w, coin.h);
    }
}
function fallingCoin(){
    if(score == 30 || score == 130 ||score == 270 || score == 520 || score == 800 || score == 1150 ||  score == 1450|| showCoin == true){
        showCoin = true;
        drawCoin();
        coin.y += coin.dy;
    }
    
}

function coinPaddleCollision(){
    if(coin.y > paddle.y && coin.x > paddle.x && paddle.y < paddle.y + paddle.height && coin.x < paddle.x + paddle.width ){ 
        showCoin = false;
        score += 30;
        coin.y = 0;
        coin.x = Math.floor(Math.random() * canvas.width) + 1;
    }

    if(coin.y >= canvas.height){
        showCoin = false;
        coin.y = 0;
        coin.x = Math.floor(Math.random() * canvas.width) + 1;
    }
}


//move paddle
var rightArrow = false;
var leftArrow = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightArrow = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftArrow = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightArrow = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftArrow = false;
    }
}


function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width/2;
  }
}


function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < canvas.width){
        paddle.x += paddle.dx;
    }
    else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx; 
    }
}

function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = paddle.y - ballRadius;
    ball.dx = 3 * (Math.random() * 2-1);
    //ball.dy = -3;
    ball.dy = -ball.speed;
}

function ballWallCollision(){
    if(ball.x + ball.radius > canvas.width || ball.x - ballRadius < 0){
        ball.dx = -ball.dx;
    }
    if(ball.y - ball.radius < 0){
        ball.dy = - ball.dy;
    }
    if (ball.y + ball.radius > canvas.height) {
        life--;
        resetBall();
    }

}

function ballPaddleCollision(){
    if(ball.y > paddle.y && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.x < paddle.x + paddle.width ){
        
        // vart bollen träffar paddeln
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        
        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width/2);
        
        // vinkel bollen
        let angle = collidePoint * Math.PI/3;
            
            
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}



function drawPaddle(){
    ctx.fillStyle = '#0c1f4f';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)

    // Color of the shadow;  RGB, RGBA, HSL, HEX, and other inputs are valid.
    ctx.shadowColor = '#ed27ec'; // string
    // Horizontal distance of the shadow, in relation to the text.
    ctx.shadowOffsetX = 0; // integer
    // Vertical distance of the shadow, in relation to the text.
    ctx.shadowOffsetY = 0; // integer
    // Blurring effect to the shadow, the larger the value, the greater the blur.
    ctx.shadowBlur = 10; // integer

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ed27ec';
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = '#0c1f4f';
    ctx.fill();
    ctx.strokeStyle = '#ed27ec';
    ctx.stroke();
    
    
    ctx.closePath();
}

function draw(){
    drawPaddle();
    drawBall();
    drawBricks();
    gameStats(life, canvas.width -35, 25, lifeImg, canvas.width-65, 5);
    gameStatsText(score +"p", 25, 25);
    gameStatsText("lvl " + level, (canvas.width/2) -20 , 25);
    drawExtraLife();
    drawCoin();
}

function gameOver(){
    if(life <= 0){
        GAME_OVER = true;

        document.getElementById("score").value = score;
    }
}

function lvlUp(){
    let isLvlCompleted = true;

    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLvlCompleted = isLvlCompleted && !bricks[r][c].status;
        }
    }

    if(isLvlCompleted){
        if (level < 4) {
            brick.row++;
        }
        createBricks();
        ball.speed += 0.7;
        resetBall();
        level++;
    }
}

function update(){
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    heartPaddleCollision();
    coinPaddleCollision();
    fallingHeart()
    fallingCoin();
    gameOver();
    lvlUp();
    
}

function loop(){
    ctx.drawImage (BG_IMG, 0,0);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();
    update();

    if (!GAME_OVER) {
        requestAnimationFrame(loop);
    }

    //requestAnimationFrame(loop);
    
}
loop();




function get_scores(callback){
    var xhr = new XMLHttpRequest()
    xhr.open("GET", "http://localhost:3001/top5")

    xhr.onload = function(){
        var data = JSON.parse(this.response)
        let scores = JSON.stringify(data);
        console.log(scores);
        callback(scores);
    }
    xhr.send()
}

// display highs core list
const List = document.getElementById("highscores");

var list_scores = function(scores) {
    let object = JSON.parse(scores);

      for (let i=0; i<object.length; i++) {
        let li = document.createElement("LI");
        let text = document.createTextNode(object[i].name + " ... " + object[i].score);
        li.appendChild(text);
        List.appendChild(li);
   }
}

//reload hs when submitting form
function resetForm(){
    while(list.hasChildNodes()){
        List.removeChild(List.firstChild);
    }

    //fetch data & make highscore
    get_scores(list_scores);
    //reset
    document.getElementById("score").value = 0;
    score = 0;
}







// const Errors = document.getElementById("error");

// function get_scores(callback){
//     let file = "/js/scores.json";
//     fetch(file, {cache: 'no-cache'})
//     .then(function(response){
//         //if response is not ok
//         if (response.status !== 200) {
//             Errors.innerHTML = response.status;
//         }
//         // if response is ok
//         response.json().then(function(data){
//             let scores = JSON.stringify(data);
//             console.log(scores);
//             callback(scores);
//         })
//     })
//     .catch(function(err) {
//         Errors.innerHTML = err;
//     })
// }

// // display highs core list
// const List = document.getElementById("highscores");

// var list_scores = function(scores) {
//     let object = JSON.parse(scores);
//     //lowest score saved for later
//     let lowest_score = object[9].score;
//     document.getElementById("lowscore").value = lowest_score;

//       for (let i=0; i<object.length; i++) {
//         // console.log(object[i]);
//         let li = document.createElement("LI");
//         let text = document.createTextNode(object[i].name + " ... " + object[i].score);
//         li.appendChild(text);
//         List.appendChild(li);

//         if (i===0) {
//         li.setAttribute('class',"top1");
//         }
//         if (i===1) {
//         li.setAttribute('class',"top2");
//         }
//         if (i===2) {
//         li.setAttribute('class',"top3");
//     }
//    }
// }

// //reload
// function resetForm(){
//     while(list.hasChildNodes()){
//         List.removeChild(List.firstChild);
//     }

//     //fetch data & make highscore
//     get_scores(list_scores);
//     //reset
//     document.getElementById("score").value = 0;
//     score = 0;
// }

// //submit form
// // listening for click submit button
// myform.addEventListener("submit", function(event){
//     //dont reload page
//     event.preventDefault();

//     //lowest highscore
//     var tenth_score = document.getElementById("lowscore").value;
    
//     //Form Data Object
//     var formData = new FormData(this);
//     formData.append('score', score);

//     // fetch request
//     fetch ("/js/highscore.php", {
//       method: "post",
//       body: formData
//     })
//     .then (function (response){
//       return response.text();
//     })
//     .then(function(text) {
//       resetForm();
//       console.log(text);
//     })
//     .catch(function (err) {
//       errors.innerHTML = err;
//     })

// })
