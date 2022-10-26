const canvas = document.createElement('canvas'),
    container = document.querySelector('#container'),
    nextSHAPE = document.querySelector('#nextShape'),
    canvas2 = document.createElement('canvas'),
    block = 27,
    w = (canvas.width=10 * block),
    h = (canvas.height=20 * block),
    img = document.getElementById('img'),
    ctx = canvas.getContext('2d'),
    nctx = canvas2.getContext('2d'),
    nw_h = (canvas2.width = 5 * block),
    scoreID = document.getElementById('score'),
    maxscoreID = document.getElementById('maxscore'),
    linesID = document.getElementById('lines'),
    FPS = 120,
    level = [2, 4, 6, 8, 10],
    blockimg = 17,
    color = [
        '#ff8000',
        '#00f',
        '#f00',
        '#0f0',
        '#ff0',
        '#0ff',
        '#800080'
    ],
    shadowColor = [
        '#ff7f0044',
        '#00f4',
        '#f004',
        '#0f04',
        '#ff04',
        '#0ff4',
        '#80008044'
    ],
    shapes = [
        [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0]
        ],
        [
            [3, 3, 0],
            [0, 3, 3],
            [0, 0, 0]],
        
        [
            [0, 4, 4],
            [4, 4, 0],
            [0, 0, 0]
        ],
        [
            [5, 5],
            [5, 5]
        ],
        [
            [0, 6, 0, 0],
            [0, 6, 0, 0],
            [0, 6, 0, 0],
            [0, 6, 0, 0]
        ],
        [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0]
        ],
    ],
    image = [6 * 18, 0, 2 * 18, 3 * 18, 4 * 18, 5 * 18, 18];
container.appendChild(canvas);
canvas2.height = 5 * block
nextSHAPE.appendChild(canvas2);
let gameMap = [],
    playing = true,
    realX = 0, realY = 0,
    score = 0,
    maxscore = 0,
    FramePerSecondsShape = 4,
    delay = 0,
    appo = 0,
    FrameForScore = 0,
    linesStroke = 0,
    state = 'stopped';
let nextShape = shapes[Math.floor(Math.random()*shapes.length)]
let currentShape = shapes[Math.floor(Math.random()*shapes.length)];
bottom = (shape, posX, posY) => {
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]==0)continue;
            if(i + posY == gameMap[0].length-1)return false;
            if(gameMap[j + posX][i + posY + 1] > 0)return false;
        }
    }
    return true;
}
right = (shape, posX, posY) => {
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]==0)continue;
            if(j + posX == gameMap.length-1)return false;
            if(gameMap[j + posX + 1][i + posY] > 0)return false;
        }
    }
    return true;
}
left = (shape, posX, posY) => {
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]==0)continue;
            if(j + posX == 0)return false;
            if(gameMap[j + posX - 1][i + posY] > 0)return false;
        }
    }
    return true;
}
listen = () => {
    document.addEventListener('keydown', (event) => {
        if(event.keyCode == 37 | event.keyCode == 65)state = 'left'
        else if(event.keyCode == 38 | event.keyCode == 87)state = 'rotate'
        else if(event.keyCode == 39 | event.keyCode == 68)state = 'right'
        else if(event.keyCode == 40 | event.keyCode == 83)state = 'down'
        else if(event.keyCode == 32)state = 'double down'
    })
}
rotate = (ShapeToRotate) => {
    let shape = ShapeToRotate
    if(shape.length == 3){
        let angolo = shape[0][0];
        let spigolo = shape[0][1];
        shape[0][0] = shape[2][0];
        shape[2][0] = shape[2][2];
        shape[2][2] = shape[0][2];
        shape[0][2] = angolo
        shape[0][1] = shape[1][0];
        shape[1][0] = shape[2][1];
        shape[2][1] = shape[1][2];
        shape[1][2] = spigolo
    }
    else if(shape.length == 4){
        let angolo = shape[0][0],
            spigolo1 = shape[1][0],
            spigolo2 = shape[2][0],
            spigolo3 = shape[1][1];
        shape[0][0] = shape[3][0];
        shape[3][0] = shape[3][3]
        shape[3][3] = shape[0][3];
        shape[0][3] = angolo
        shape[1][0] = shape[3][1];
        shape[3][1] = shape[2][3];
        shape[2][3] = shape[0][2];
        shape[0][2] = spigolo1
        shape[2][0] = shape[3][2];
        shape[3][2] = shape[1][3];
        shape[1][3] = shape[0][1];
        shape[0][1] = spigolo2
        shape[1][1] = shape[2][1];
        shape[2][1] = shape[2][2];
        shape[2][2] = shape[1][2]
        shape[1][2] = spigolo3;
    }
    return shape;
}
move = () => {
    switch(state){
        case 'right':
            right(currentShape, realX + 3, realY) ? realX++ : null;
            break;
        case 'left':
            left(currentShape, realX + 3, realY) ? realX-- : null;
            break;
        case 'down':
            FramePerSecondsShape = 100;
            if(FrameForScore >= FPS / FramePerSecondsShape){
                FrameForScore = 0;
                score++
            }
            FrameForScore++;
            break;
        case 'double down': break;
        case 'rotate':
            let copia = currentShape
            if(checkRotate(rotate(copia)) & bottom(rotate(copia), realX + 3, realY))
            currentShape = rotate(currentShape)
            state = 'stopped'
            break;
        case 'stopped': FramePerSecondsShape = 4
    }
    if(delay > 0 & state != 'stopped'){
        delay = 0
    }
    state = 'stopped'
}
checkRotate = (shape) => {
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]==0)continue;
            // Move the shape far from walls
            while(j + realX + 3 > gameMap.length - 1)realX--
            while(j + realX + 3 < 0)realX++

            if(gameMap[j + realX + 3][i + realY] != 0)return false;
        }
    }
    return true;
}
generateRandomShape = () => {
    realX = 0;
    realY = 0;
    currentShape = nextShape;
    nextShape = shapes[Math.floor(Math.random()*shapes.length)];
}
update = () => {
    if(appo >= FPS / FramePerSecondsShape){
        appo = 0;
        realY++
    }
    appo++;
}
insertShape = () => {
    for(let i = 0; i < currentShape.length; i++){
        for(let j = 0; j < currentShape[i].length; j++){
            if(currentShape[i][j]==0)continue;
            gameMap[j + realX + 3][i + realY] = currentShape[i][j];
        }
    }
}
drawShape = (shape, x, y) => {
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]==0)continue;
            ctx.fillStyle = color[shape[i][j] - 1]
            ctx.fillRect((j + x)*block + 1,
                        (i + y)*block + 1,
                        block - 2,
                        block - 2)
        }
    }
}
drawShapeImage = (context, shape, x, y) => {
    for(let i = 0; i < shape.length; i++){
        for(let j = 0; j < shape[i].length; j++){
            if(shape[i][j]==0)continue;
            context.drawImage(img, image[shape[i][j] - 1], 0, blockimg, blockimg,
                (j + x) * block, (i + y) * block, block, block)
        }
    }
}
drawAllShapes = () => {
    for(let i = 0; i < gameMap.length; i++){
        for(let j = 0; j < gameMap[i].length; j++){
            if(gameMap[i][j]==0)continue;
            ctx.fillStyle = color[gameMap[i][j] - 1];
            ctx.fillRect(i*block + 1, j*block + 1, block - 2, block - 2)
        }
    }
}
drawAllImages = () => {
    for(let i = 0; i < gameMap.length; i++){
        for(let j = 0; j < gameMap[i].length; j++){
            if(gameMap[i][j]==0)continue;
            ctx.drawImage(img, image[gameMap[i][j] - 1], 0, blockimg, blockimg, i * block, j * block, block, block)
        }
    }
}
drawNextShape = () => {
    for(let i = 0; i < nextShape.length; i++){
        for(let j = 0; j < nextShape[i].length; j++){
            if(nextShape[i][j]==0)continue;
            nctx.fillStyle = color[nextShape[i][j] - 1]
            nctx.fillRect((j + 1)*block + 1,
                        (i + 1)*block + 1,
                        block - 2,
                        block - 2)
        }
    }
}
grid = (context, width, height) => {
    context.fillStyle = '#1f1f1f'
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#333';
    for(let i = 1; i < height/block; i++)context.fillRect(0, i * block - 1, width, 2);
    for(let j = 1; j < width/block; j++)context.fillRect(j * block - 1, 0, 2, height);
}
setMap = (map = []) => {
    let column = [];
    for(let i = 0; i < w/block; i++){
        column = []
        for(let j = 0; j < h/block; j++){
            column.push(0);
        }
        map.push(column);
    }
    return map;
}
checkGameOver = () => {
    for(let i = 0; i < currentShape.length; i++){
        for(let j = 0; j < currentShape[i].length; j++){
            if(currentShape[i][j]==0)continue;
            if(i + realY  < 3){
                if(gameMap[j + 3 + realX][i + realY] != 0)return true
            }
        }
    }
    return false
}
checkLines = () => {
    let lines = []
    let check = true;
    for(let i = 0; i < gameMap[0].length; i++){
        check = true
        for(let j = 0; j < gameMap.length; j++){
            if(gameMap[j][i] == 0){
                check = false
            }
        }
        if(check){
            lines.push(i)
        }
    }
    let point = 0
    switch(lines.length){
        case 1:
            point = 40;
            break;
        case 2: point = 100;
            break;
        case 3: point = 300;
            break;
        case 4: point = 1200;
            break;
    }
    score += point
    for(let k = 0; k < lines.length; k++){
        linesStroke++
        for(let i = lines[k]; i > 0; i--){
            for(let j = 0; j < gameMap.length; j++){
                gameMap[j][i] = gameMap[j][i-1]
            }
        }
    }
}
drawEnd = () => {
    ctx.fillStyle = '#1f1f1f';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#ff2972";
    ctx.textAlign = "center";
    ctx.font = "bold 45px Poppins, sans-serif";
    ctx.fillText("GAME OVER", w / 2, h / 2 - 50);
    ctx.font = "bold 20px Poppins, sans-serif";
    ctx.fillText(`SCORE  ${score} `, w / 2, h / 2);
    ctx.fillText(`HIGHSCORE  ${maxscore}`, w / 2, h / 2 + 50);
    ctx.fillText(`LINES  ${linesStroke}`, w / 2, h / 2 + 100);
}
love = () => {
    ctx.fillStyle = '#1f1f1f';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#9e5cbd';
    ctx.textAlign = 'center'
    ctx.font = 'bold 5em Tangerine, cursive';
    ctx.fillText('Ti amo, ti amo', w / 2, 60);
    ctx.fillText('ti amo, ti amo', w / 2, 120);
    ctx.fillText('ti amo, ti amo', w / 2, 180);
    ctx.fillText('ti amo, ti amo', w / 2, 240);
    ctx.fillText('ti amo, ti amo', w / 2, 300);
    ctx.fillText('ti amo, ti amo', w / 2, 360);
    ctx.fillText('ti amo, ti amo', w / 2, 420);
    ctx.fillText('ti amo, ti amo', w / 2, 480);
    ctx.fillText('ti amo, ti amo', w / 2, 540);
}
clear = () => {
    ctx.fillStyle = '#1f1f1f';
    ctx.fillRect(0, 0, w, h);
}
draw = () => {
    clear();
    nctx.fillStyle = '#1f1f1f'
    nctx.fillRect(0, 0, nw_h, nw_h);
    drawShapeImage(ctx, currentShape, realX + 3, realY);
    drawAllImages();
    drawShadowShape();
    drawShapeImage(nctx, nextShape, 1, 1);
}
play = () => {
    var audio = new Audio();
    audio.src = 'song.mp3';
    audio.autoplay = false;
}
play()
scoring = () => {
    if(maxscore < score) maxscore = score
    let scoring = '', record = '', line = '';
    line = linesStroke < 10 ? '0' + linesStroke.toString() : linesStroke.toString();
    scoring = score < 10 ? '0' + score.toString() : score.toString();
    record = maxscore < 10 ? '0' + maxscore.toString() : maxscore.toString();
    scoreID.innerHTML = scoring;
    maxscoreID.innerHTML = record;
    linesID.innerHTML = line;
}
restart = () => {
    gameMap = setMap();
    playing = true;
    nextShape = shapes[Math.floor(Math.random() * shapes.length)]
    realY = 0, realX = 0, score = 0;
    currentShape = shapes[Math.floor(Math.random() * shapes.length)]
    linesStroke = 0
}
drawShadowShape = () => {
    let copyOfShape = currentShape;
    let y = 0;
    while(bottom(copyOfShape, realX + 3, realY + y)){
        y++
    }
    for(let i = 0; i < copyOfShape.length; i++){
        for(let j = 0; j < copyOfShape[i].length; j++){
            if(copyOfShape[i][j]==0)continue;
            ctx.fillStyle = shadowColor[copyOfShape[i][j] - 1]
            ctx.fillRect((j + realX + 3)*block,
                        (i + realY + y)*block,
                        block,
                        block)
        }
    }
    if(state == 'double down'){realY +=y; score += y; state = 'stopped'}
}
gameMap=setMap();
setInterval(() => {
    if(playing){
        draw();
        if(!bottom(currentShape, realX + 3, realY)){
            if(delay >= FPS / FramePerSecondsShape){
                delay = 0;
                insertShape()
                generateRandomShape();
                checkLines();
            }
            delay++;
        }
        else{
            update();
        }
        move();
        listen()
        checkGameOver() ? playing = false: null;
        scoring();
    }
    else{
        drawEnd();
    }
}, 1000 / FPS);