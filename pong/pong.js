const canvas = document.createElement('canvas'),
    container = document.getElementById('container'),
    w = canvas.width=800,
    h = canvas.height = 500,
    paddleh = 100,
    paddlew = 15,
    radius = 8,
    ctx = canvas.getContext('2d'),
    score1ID = document.getElementById('score1'),
    score2ID = document.getElementById('score2');
container.appendChild(canvas);
let paddle1 = {x: 10, y : h/2 - paddleh/2, state: 'stopped'},
    paddle2 = {x: w - 10 - paddlew, y: h/2 - paddleh/2, state: 'stopped'},
    ball = {x: w/2, y: h/2 - radius/2},
    FPS = 360,
    dX = 1,
    dY = 0,
    score1 = 0, score2 = 0,
    playing = true,
    player1 = true;
function rect(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}
function showBall(x, y, rad){
    ctx.beginPath()
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, rad, 0, 2 * Math.PI, false)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()
    ctx.restore()
}
function moveBall(){
    if(ball.y < radius | ball.y > h - radius)dY*=-1
    if(ball.y < paddle1.y + paddleh & ball.y > paddle1.y){
        if(ball.x <= paddle1.x + paddlew){
            dX*=-1
            if(paddle1.state == 'up')dY-=.5
            else if(paddle1.state == 'down')dY+=.5
            console.log(dY)
        }
    }
    if(ball.y < paddle2.y + paddleh & ball.y > paddle2.y){
        if(ball.x >= paddle2.x){
            dX*=-1
            if(paddle2.state == 'up')dY-=.5
            else if(paddle2.state == 'down')dY+=.5
            console.log(dY)
        }
    }
    ball.x+=dX
    ball.y+=dY
}
function listen(){
    document.addEventListener('keydown', (event)=>{
        if(event.keyCode == 38) {paddle2.state = 'up'}
        else if(event.keyCode == 40){paddle2.state = 'down'}
        if(event.keyCode == 87){paddle1.state = 'up'}
        else if(event.keyCode == 83){paddle1.state = 'down'}
    })
}
function move(paddle){
    if(paddle.state == 'up'){
        if(paddle.y > 0)paddle.y--
    }
    else if(paddle.state == 'down'){
        if(paddle.y < h - paddleh)paddle.y++
    }
}
function checkScore(){
    if(!player1){
        if(ball.x - radius > paddle2.x){
            dX = 1
            dY = 0
            score1++
            replay()
        }
        if(ball.x < paddle1.x - paddlew){
            dX = -1
            dY = 0
            score2++
            replay()
        }
    }
    else{
        if(ball.x + radius > w - 11){
            dX*=-1
            score1++
        }
        if(ball.x < paddle1.x){
            playing = false
            dX = 1
            dY = 0
            drawEnd2();
        }
    }
}
function showScore(){
    let score;
    score = score1 < 10 ? '0' + score1.toString() : score1.toString();
    score1ID.innerHTML = score
    if(!player1){
        score = score2 < 10 ? '0' + score2.toString() : score2.toString();
        score2ID.innerHTML = score
    }
    else{
        if(score2 < score1)score2 = score1;
        score = score2 < 10 ? '0' + score2.toString() : score2.toString();
        score2ID.innerHTML = score;
    }
}
function replay(){
    paddle1 = {x: 10, y : h/2 - paddleh/2, state: 'stopped'}
    paddle2 = {x: w - 10 - paddlew, y: h/2 - paddleh/2, state: 'stopped'}
    ball = {x: w/2, y: h/2 - radius/2}
}
function drawPaddle(paddle){
    rect(paddle.x, paddle.y, paddlew, paddleh, '#fff')
    showBall(paddle.x + paddlew/2, paddle.y, paddlew/2);
    showBall(paddle.x + paddlew/2, paddle.y + paddleh, paddlew/2);
}
function checkWin(){
    if(!player1){
        if(score1 > 9){
            playing = false
            drawEnd('PLAYER 1')
        }
        if(score2 > 9){
            playing = false
            drawEnd('PLAYER 2');
        }
    }
}
function drawEnd2(){
    let score = score1 < 10 ? '0' + score1.toString() : score1.toString();
    rect(0, 0, w, h, '#1f1f1f');
    ctx.fillStyle = "#ff2972";
    ctx.textAlign = "center";
    ctx.font = "bold 60px Poppins, sans-serif";
    ctx.fillText(`YOUR SCORE`, w / 2, h / 2 - 80);
    ctx.fillText('IS', w / 2, h / 2 );
    ctx.fillText(`${score} POINT`, w / 2, h / 2 + 80);
    ctx.fillText(`HI: ${score} POINT`, w / 2, h / 2 + 160);
}
function restart(){
    playing = true
    replay();
    if(!player1){score2 = 0;}
    score1 = 0;
}
function drawEnd(winner){
    rect(0, 0, w, h, '#1f1f1f');
    ctx.fillStyle = "#ff2972";
    ctx.textAlign = "center";
    ctx.font = "bold 60px Poppins, sans-serif";
    ctx.fillText(`THE WINNER`, w / 2, h / 2 - 100);
    ctx.fillText('IS', w / 2, h / 2 );
    ctx.fillText(`${winner}`, w / 2, h / 2 + 100)
}
function twoPlayer(){
    if(!playing)return
    rect(0, 0, w, h, '#1f1f1f');
    rect(w/2 - 1, 0, 2, h, '#ccc');
    listen()
    drawPaddle(paddle1);
    drawPaddle(paddle2)
    showBall(ball.x, ball.y, radius);
    moveBall();
    move(paddle1);
    move(paddle2);
    checkScore();
    showScore();
    checkWin();
}
function onePLayer(){
    if(!playing)return
    listen()
    rect(0, 0, w, h, '#1f1f1f');
    rect(w - 10, 0, 2, h, '#ccc');
    drawPaddle(paddle1);
    move(paddle1);
    showBall(ball.x, ball.y, radius);
    moveBall();
    showScore();
    checkScore();
}
function mod1(){
    player1 = true
    playing = true
    restart()
}
function mod2(){
    player1 = false
    playing = true
    restart()
}
setInterval(()=>{
    if(!player1){
        twoPlayer()
    }
    else{
        onePLayer();
    }
}, 1000 / FPS);