import { Grid } from "./grid";
const container = document.querySelector('#container'),
    canvas = document.createElement('canvas'),
    movesID = document.getElementById('moves')
    w=canvas.width=490,
    h=canvas.height=490,
    ctx = canvas.getContext('2d'),
    block = w/7;
container.appendChild(canvas);
let grid = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
],
    color1 = '#f00',
    color2 = '#00f',
    currentPaddle = {x: 0, y: 0, value: 1},
    state = 'stopped',
    playing = true,
    moves = 0;
function background(){
    ctx.fillStyle = '#1f1f1f'
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#333';
    for(let i = 2; i < h/block; i++)ctx.fillRect(0, i * block - 1, w, 2);
    for(let j = 1; j < w/block; j++)ctx.fillRect(j * block - 1, block, 2, h - block);
}
function restart(){
    grid = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ];
    moves = 0
    currentPaddle = {x : 0, y : 0, value : 1}
    playing = true
}
function drawGrid(){
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            if(grid[i][j]==0)continue
            ctx.save()
            ctx.beginPath()
            ctx.arc(i * block + block/2, j * block + block/2 + block, block/2 - 5, 0, 2 * Math.PI, false)
            if(grid[i][j]==1)ctx.fillStyle=color1
            else if(grid[i][j]==-1)ctx.fillStyle=color2
            ctx.fill()
            ctx.closePath()
            ctx.restore()
        }
    }
}
function drawCircle(x, y, radius, color){
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle=color
    ctx.fill()
    ctx.closePath()
    ctx.restore()
}
function drawMoves(){
    let moves_string = '';
    if(moves < 10)moves_string += '0'
    moves_string += moves.toString()
    movesID.innerHTML = moves_string
}
function drawShadowPaddle(){
    let copyPaddle = currentPaddle
    while(!check_bottom(copyPaddle)){copyPaddle.y++}
    let shadowColor = copyPaddle.value == 1 ? getShadowcolor(color1) : getShadowcolor(color2)
    drawCircle(copyPaddle.x * block + block/2, copyPaddle.y * block + block/2, block/2 - 5, shadowColor)
    console.log(copyPaddle)
}
function getShadowcolor(color){
    switch(color){
        case '#f00':
            return '#f004';
        case '#0f0':
            return '#0f04'
        case '#00f':
            return '#00f4'
        case '#f0f':
            return '#f0f4'
        case '#c9a0dc':
            return '#c9a0dc'
        case '#0ff':
            return '#0ff4'
        case '#ff0':
            return '#ff04'
        case '#fff':
            return '#fff4'
        case '#000':
            return '#0004'
    }
}
function drawCurrentPaddle(){
    let color = currentPaddle.value == 1 ? color1 : color2;
    drawCircle(currentPaddle.x * block + block/2, currentPaddle.y * block + block/2, block/2 - 5, color)
}
function check_bottom(paddle){
    if(paddle.y>= grid[0].length)return true
    if(grid[paddle.x][paddle.y + 1] != 0)return true
    return false
}
function check_full(){
    if(grid[currentPaddle.x][0]!=0)return false
    return true
}
function check_end(){
    let full = true
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            if(grid[i][j]==0)full=false
        }
    }
    if(full){
        ctx.fillStyle = '#1f1f1f'
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#ff2972";
        ctx.textAlign = "center";
        ctx.font = "bold 80px Poppins, sans-serif";
        ctx.fillText(`DRAW`, w / 2, h / 2);
        playing=false
    }
}
function check_win(){
    let count_paddle = 0;
    let distance;
    // Orizzontale
    for(let i = 0; i < grid[0].length; i++){
        if(grid[i][currentPaddle.y] == currentPaddle.value)count_paddle++;
        else{count_paddle = 0}
        if(count_paddle == 4)return currentPaddle.value
    }
    // Verticale
    for(let i = 0; i < grid.length; i++){
        if(grid[currentPaddle.x][i] == currentPaddle.value)count_paddle++;
        else{count_paddle = 0}
        if(count_paddle == 4)return currentPaddle.value
    }
    // Obliquo1
    for(let i = 0; i < grid[0].length; i++){
        distance = currentPaddle.y - currentPaddle.x
        if(grid[i][i + distance] == currentPaddle.value)count_paddle++
        else{count_paddle = 0}
        if(count_paddle == 4)return currentPaddle.value
    }
    // Obliquo2
    distance = currentPaddle.x + (grid[0].length - 1 - currentPaddle.y)
    console.log(distance)
    for(let i = 0; i + distance < grid.length-1; i++){
        if(grid[i + distance][grid[i].length-1-i]==currentPaddle.value)count_paddle++
        else{count_paddle=0}
        if(count_paddle == 4)return currentPaddle.value
    }
    return 0;
}
function listen(){
    document.addEventListener('keydown', (event) => {
        if(event.keyCode == 32 | event.keyCode == 40 | event.keyCode == 83)state = 'insert'
        if(event.keyCode == 65 | event.keyCode == 37)state = 'left'
        if(event.keyCode == 68 | event.keyCode == 39)state = 'right'
    })
}
function move(){
    if(state == 'left'){
        if(currentPaddle.x > 0)currentPaddle.x--
    }
    else if(state == 'right'){
        if(currentPaddle.x < grid.length - 1)currentPaddle.x++
    }
    else if(state == 'insert'){
        if(check_full()){
            insert();
            console.log(check_win())
        }
    }
    state = 'stopped'
}
function insert(){
    while(!check_bottom(currentPaddle)){currentPaddle.y++}
    grid[currentPaddle.x ][currentPaddle.y] = currentPaddle.value
    if(check_win() != 0){
        let winner = check_win() == 1 ? 'A' : 'B'
        ctx.fillStyle = '#1f1f1f'
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#ff2972";
        ctx.textAlign = "center";
        ctx.font = "bold 80px Poppins, sans-serif";
        ctx.fillText(`THE WINNER`, w / 2, h / 2 - 100);
        ctx.fillText(`IS`, w / 2, h / 2);
        ctx.fillText(`PLAYER`, w / 2, h / 2 + 100);
        ctx.fillStyle = winner == 'A' ? color1 : color2
        ctx.fillText(`${winner}`, w / 2, h / 2 + 100);
        playing = false
    }
    currentPaddle={x:currentPaddle.x, y:0, value:currentPaddle.value*=-1}
    if(currentPaddle.value==1)moves++
}
setInterval(() => {
    if(playing){
        background();
        drawGrid();
        drawCurrentPaddle();
        drawMoves();
        listen();
        move();
        check_end()
    }
    else{

    }
}, 1000 / 60);