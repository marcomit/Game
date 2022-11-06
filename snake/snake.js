let container = document.querySelector('#canvas'),
    canvas = document.createElement('canvas'),
    SCORE = document.getElementById('score'),
    RECORD = document.getElementById('maxscore'),
    line = 2,
    size = 20,
    size_particle = 10
    count = 20,
    w = (canvas.width =500),
    h = (canvas.height =500),
    block = (w/size),
    score = 0,
    maxScore = 0,
    set = 'grid',
    wall = 'tunnel',
    color = 'DEFAULT',
    paint = 'red'
    foodCount = 1,
    opacity = 1,
    FPS = 12.5,
    particle = [],
    ctx = canvas.getContext('2d'),
    playing = true;

container.appendChild(canvas);

// Main
setInterval(() => {
    block = w / size
    if(playing){
        ctx.imageSmoothingEnabled = false;
        mod()
        scoring()
        snake.listen2()
        snake.move()
        for(let i = 0; i < foodCount; i++){
            food[i].show()
            if(snake.eat(food[i].x, food[i].y)){
                sound('/sound/apple.mp3')
                generate(food[i].x + block / 2, food[i].y + block / 2)
                paint = food[i].color
                snake.add()
                food[i].spawn()
            }
        }
        explosion(paint)
        if(snake.collision()){
            generate(snake.bodies[0].x + block / 2, snake.bodies[0].y + block / 2)
            paint = snake.color
            playing = false
        }
    }
    else{
        explosion(paint)
        if(set == 'grid'){
            clear()
            grid()
        }
        else{
            background()
        }
        if(particle.length == 0){end()}
    }
}, 1000 / 12.5)
// Classe SNAKE
class Snake{
    constructor(){
        this.bodies = [
            {x: 3 * block, y: block * size / 2},
            {x: 2 * block, y: size / 2 * block},
            {x: block, y: size / 2 * block}
        ]
        this.max = 255
        this.state = 'stopped'
        this.color = '#ff2972'
    }
    default(){
        this.color = '#fff'
        ctx.globalCompositeOperation = "lighter";
        ctx.shadowBlur = 40;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.fillStyle = this.color;
        ctx.fillRect(this.bodies[0].x, this.bodies[0].y, block, block);
        ctx.globalCompositeOperation = "source-over";
        ctx.shadowBlur = 0;
        let opacity = 0.95;
        for(let i = 0; i < this.bodies.length; i++){
            ctx.fillRect(this.bodies[i].x, this.bodies[i].y, block, block)
            opacity >= 0.5 ? opacity -= 0.02 : null;
            ctx.fillStyle = `rgba(255, 255, 255, ` + opacity.toString() +')'
        }
    }
    show2(){
        // Da perfezionare
        // La coda
        /*let size = 0
        let position = {x: 0, y: 0, w: 0, h: 0}
        ctx.fillStyle = this.color
        ctx.fillRect(this.bodies[0].x, this.bodies[0].y, block, block)
        for(let i = 1; i < this.bodies.length - 1; i++){
            if(this.bodies[i].x != this.bodies[i + 1].x & this.bodies[i].y == this.bodies[i + 1].y){
                position = {x: this.bodies[i].x, y: this.bodies[i].y + size, w: block, h: block - 2 * size}
            }
            else if(this.bodies[i].x == this.bodies[i + 1].x & this.bodies[i].y != this.bodies[i + 1].y){
                position = {x: this.bodies[i].x + size, y: this.bodies[i].y, w: block - 2 * size, h: block}
            }
            size < 10 ? size += 0.2 : null;
            ctx.fillRect(position.x, position.y, position.w, position.h)
        }*/
        let color = this.color + 'aa'
        ctx.shadowBlur = 40;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color
        ctx.fillRect(this.bodies[0].x, this.bodies[0].y, block, block)
        ctx.shadowBlur = 0;
        for(let i = 0; i < this.bodies.length; i++){
            ctx.fillStyle = color
            ctx.fillRect(this.bodies[i].x, this.bodies[i].y, block, block)
        }
    }
    gradient(){
        let color = ['#00f',
        '#8000ff', '#f0f',
        '#ff0080', '#f00',
        '#ff8000','#ff0',
        '#80ff00','#0f0',
        '#00ff80','#0ff',
        '#0080ff', '#00f'
        ]
        let init = {x0: 0, y0: 0, x1: 0, y1: 0}
        for(let i = 0; i < this.bodies.length - 1; i++){
            if(this.bodies[i].x < this.bodies[i + 1].x & this.bodies[i].y == this.bodies[i + 1].y){
                init = {x0: this.bodies[i].x, y0: this.bodies[i].y,
                        x1: this.bodies[i + 1].x, y1: this.bodies[i].y
                    }
            }
            else if(this.bodies[i].x > this.bodies[i + 1].x & this.bodies[i].y == this.bodies[i + 1].y){
                init = {x0: this.bodies[i].x + block, y0: this.bodies[i].y,
                        x1: this.bodies[i].x, y1: this.bodies[i + 1].y
                    }
            }
            else if(this.bodies[i].x == this.bodies[i + 1].x & this.bodies[i].y < this.bodies[i + 1].y){
                init = {x0: this.bodies[i].x, y0: this.bodies[i].y,
                    x1: this.bodies[i].x, y1: this.bodies[i + 1].y
                }
            }
            else if(this.bodies[i].x == this.bodies[i + 1].x & this.bodies[i].y > this.bodies[i + 1].y){
                init = {x0: this.bodies[i].x, y0: this.bodies[i].y + block,
                    x1: this.bodies[i].x, y1: this.bodies[i].y
                }
            }
            let grd = ctx.createLinearGradient(init.x0, init.y0, init.x1, init.y1);
            grd.addColorStop(0, color[i%12])
            grd.addColorStop(1, color[(i%12)+1])
            ctx.fillStyle = grd;
            ctx.fillRect(this.bodies[i].x, this.bodies[i].y, block, block)
        }
    }
    move(){
        let body = {}
        do{
            if(this.state == 'stopped')return
            if(this.state == 'left'){
                body = {
                    x: this.bodies[0].x - block,
                    y: this.bodies[0].y
                }
            }
            else if(this.state == 'right'){
                body = {
                    x: this.bodies[0].x + block,
                    y: this.bodies[0].y
                }
            }
            else if(this.state == 'up'){
                body = {
                    x: this.bodies[0].x,
                    y: this.bodies[0].y - block
                }
            }
            else if(this.state == 'down'){
                body = {
                    x: this.bodies[0].x,
                    y: this.bodies[0].y + block
                }
            }
            break;
        }
        while(true);
        this.bodies.pop()
        this.bodies.unshift(body)
    }
    eat(x, y){
        if(this.bodies[0].x == x & this.bodies[0].y == y){
            score++;
            return true
        }
        return false
    }
    add(){
        let body = {}
        if(this.bodies[this.bodies.length - 1].x - this.bodies[this.bodies.length - 2].x > 0 & this.bodies[this.bodies.length - 1].y - this.bodies[this.bodies.length - 2].y == 0){
            body = {
                x: this.bodies[this.bodies.length - 1] + block,
                y: this.bodies[this.bodies.length - 1]
            }
        }
        else if(this.bodies[this.bodies.length - 1].x - this.bodies[this.bodies.length - 2].x < 0 & this.bodies[this.bodies.length - 1].y - this.bodies[this.bodies.length - 2].y == 0){
            body = {
                x: this.bodies[this.bodies.length - 1] - block,
                y: this.bodies[this.bodies.length - 1]
            }
        }
        else if(this.bodies[this.bodies.length - 1].y - this.bodies[this.bodies.length - 2].y < 0 & this.bodies[this.bodies.length - 1].x - this.bodies[this.bodies.length - 2].x == 0){
            body = {
                x: this.bodies[this.bodies.length - 1],
                y: this.bodies[this.bodies.length - 1] - block
            }
        }
        else if(this.bodies[this.bodies.length - 1].y - this.bodies[this.bodies.length - 2].y > 0 & this.bodies[this.bodies.length - 1].x - this.bodies[this.bodies.length - 2].x == 0){
            body = {
                x: this.bodies[this.bodies.length - 1],
                y: this.bodies[this.bodies.length - 1] + block
            }
        }
        this.bodies.push(body)
    }
    clamp(){
        for(let i = 0; i < this.bodies.length; i++){
            if(this.bodies[i].x < 0){this.bodies[i].x = w - block}
            else if(this.bodies[i].x > w - block){this.bodies[i].x = 0}
            if(this.bodies[i].y < 0){this.bodies[i].y = h - block}
            else if(this.bodies[i].y > h - block){this.bodies[i].y = 0}
        }
    }
    walls(){
        if(this.bodies[0].x < 0){playing = false}
        else if(this.bodies[0].x > w - block){playing = false}
        else if(this.bodies[0].y < 0){playing = false}
        else if(this.bodies[0].y > h - block){playing = false}
    }
    collision(){
        for(let i = 3; i < this.bodies.length; i++)
            if(this.bodies[0].x == this.bodies[i].x & this.bodies[0].y == this.bodies[i].y) return true
        return false
    }
    listen2(){
        document.onkeydown = (event)=>{
            if((event.keyCode == 87 || event.keyCode == 38) & this.state != 'down'){
                sound('/sound/down.mp3')
                this.state = 'up'
            }
            else if((event.keyCode == 68 || event.keyCode == 39) & this.state != 'left'){
                sound('/sound/left.mp3')
                this.state = 'right'
            }
            else if((event.keyCode == 83 || event.keyCode == 40) & this.state != 'up'){
                sound('/sound/up.mp3')
                this.state = 'down'
            }
            else if((event.keyCode == 65 || event.keyCode == 37) & this.state != 'right'){
                sound('/sound/right.mp3')
                this.state = 'left'
            }
            else if(event.keyCode == 32){restart()}
        }
    }
    listen(){
        document.onkeydown = (event)=>{
            if((event.keyCode == 87 || event.keyCode == 38) & this.state != 'down'){
                this.state = 'up'
            }
            else if((event.keyCode == 68 || event.keyCode == 39) & this.state != 'left'){
                this.state = 'right'
            }
            else if((event.keyCode == 83 || event.keyCode == 40) & this.state != 'up'){
                this.state = 'down'
            }
            else if((event.keyCode == 65 || event.keyCode == 37) & this.state != 'right'){
                this.state = 'left'
            }
            else if(event.keyCode == 32){restart()}
        }
    }
}
class Food{
    constructor(x, y){
        this.x = x
        this.y = y
        this.color = 'red'
        this.generate()
    }
    show(){
    /*
        ctx.shadowBlur = block;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, block, block);
        ctx.globalCompositeOperation = "source-over";
        ctx.shadowBlur = 0;
    */
        drawCircle(this.x + block/2, this.y + block/2, block/2, this.color)
    }
    spawn(){
        this.generate()
        let check = true;
        while(check){
            this.x = Math.floor(Math.random() * w/block - 1) * block + block
            this.y = Math.floor(Math.random() * h/block - 1) * block + block
            check = false
            for(let i = 0; i < snake.bodies.length; i++){
                if(snake.bodies[i].x == this.x & snake.bodies[i].y == this.y){
                    check = true
                }
            }
        }
    }
    generate(){
        let color = Math.floor(Math.random() * 6)
        switch(color){
            case 0:
                this.color = 'rgb(255, 255, 255)'
                break;
            case 1:
                this.color = 'rgb(0, 0, 255)'
                break;
            case 2:
                this.color = 'rgb(0, 255, 0)'
                break
            case 3:
                this.color = 'rgb(0, 255, 255)'
                break;
            case 4:
                this.color = 'rgb(255, 0, 0)'
                break;
            case 5:
                this.color = 'rgb(255, 0, 255)'
                break;
            case 6:
                this.color = 'rgb(255, 255, 0)'
        }
    }
}
function drawCircle(x, y, radius, color){
    ctx.save()
    ctx.beginPath()
    ctx.shadowBlur = block;
    ctx.shadowColor = color;
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = color
    ctx.fill()
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
    ctx.closePath()
    ctx.restore()
}
let snake = new Snake();
let food = []
food = [new Food((size - 2) * block, (size / 2 - 2) * block),
            new Food((size - 6) * block, (size / 2 - 2) * block),
            new Food((size - 2) * block, (size / 2 + 2) * block),
            new Food((size - 6) * block, (size / 2 + 2) * block),
            new Food((size - 4) * block, size / 2 * block)];
// Particle
generate = (x, y) => {
    particle = []
    for (let i = 0; i < count; i++) {
        let vly = i >= count/2 ? count/2 - i : i - count/2;
        particle.unshift({ x: x, y: y,
            vx: Math.random() * Math.cos(count / i * 180) * 15,
            vy: Math.random() * Math.sin(count / i * 180) * -15,
            size: block/2})
    }
}
explosion = (color) => {
    for(let i = 0; i < particle.length; i++){
        particle[i].x += particle[i].vx
        particle[i].y += particle[i].vy
        particle[i].size  <= 0 ? particle = [] : particle[i].size -= 2
        ctx.save()
        ctx.beginPath()
        ctx.arc(particle[i].x, particle[i].y, particle[i].size, 0, 2 * Math.PI, false)
        ctx.fillStyle = color
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
}
background = () =>{
    var i = 0;
    var j = 0;
    var k = 0;
    while(i < size){
        j = 0;
        if(i % 2 == 0){k = 0}
        else{k = 1}
        while(j < size){
            if(k % 2 == 0){ctx.fillStyle = "rgb(147, 203, 57)"}
            else{ctx.fillStyle = "rgb(168, 210 ,54)"}
            ctx.fillRect(i * block, j * block, block, block)
            j++;
            k++;
        }
        i++;
    }
}
grid = ()=>{
    ctx.lineWidth = line;
    ctx.strokeStyle = "#222";
    ctx.shadowBlur = 0;
    for (let i = 1; i < size; i++) {
        let f = block * i;
        ctx.beginPath();
        ctx.moveTo(f, 0);
        ctx.lineTo(f, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, f);
        ctx.lineTo(w, f);
        ctx.stroke();
        ctx.closePath();
    }
}
scoring = () => {
    score > maxScore ? maxScore = score : null;
    let sc = score < 10 ? '0' + score.toString() : score.toString()
    let mx = maxScore < 10 ? '0' + maxScore.toString() : maxScore.toString()
    RECORD.innerHTML = mx
    SCORE.innerHTML = sc
}
end = ()=>{
    clear()
    ctx.fillStyle = "#ff2972";
    ctx.textAlign = "center";
    ctx.font = "bold 50px Poppins, sans-serif";
    ctx.fillText("GAME OVER", w / 2, h / 2 - 100);
    ctx.font = "bold 20px Poppins, sans-serif";
    ctx.fillText(`SCORE  ${score} `, w / 2, h / 2);
    ctx.fillText(`MAXSCORE  ${maxScore}`, w / 2, h / 2 + 50);
    ctx.fillText(`${foodCount} FRUITS`, w / 2, h / 2 + 100);
    ctx.fillText(`WALLS: ${wall.toUpperCase()}`, w / 2, h / 2 + 150);
    ctx.fillText(`SIZE: ${size == 20 ? 'NORMAL' : size == 10 ? 'SMALL' : 'BIG'}`, w / 2, h / 2 + 200);
}
tryagain = ()=>{
    clear()
    ctx.fillStyle = "#ff2972";
    ctx.textAlign = "center";
    ctx.font = "bold 50px Poppins, sans-serif";
    ctx.fillText("TRY AGAIN...", w / 2, h / 2 - 100);
    ctx.fillText("YOU WILL BE LUCKIER", w / 2, h / 2);
}
love = () => {
    clear()
    ctx.fillStyle = '#9e5cbd';
    ctx.textAlign = 'center'
    ctx.font = 'bold 12em Tangerine, cursive';
    ctx.fillText('Ti amo', w / 2, h / 2);
    ctx.font = 'bold 6em Tangerine, cursive';
    ctx.fillText('amore mio della mia vita', w / 2, h / 2 + 100)
}
restart = ()=>{
    snake = new Snake();
    food = [new Food((size - 2) * block, (size / 2 - 2) * block),
            new Food((size - 6) * block, (size / 2 - 2) * block),
            new Food((size - 2) * block, (size / 2 + 2) * block),
            new Food((size - 6) * block, (size / 2 + 2) * block),
            new Food((size - 4) * block, size / 2 * block)];
    score = 0
    playing = true
}
clear = ()=>{
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, 0, w, h)
}
mod = () => {
    // BACKGOUND
    if(set == 'grid'){
        clear()
        grid()
    }
    else{
        background()
    }
    // COLOR BODY
    color == 'normal' ? snake.show2() : color == 'multicolor' ? snake.gradient() :  snake.default();
    // SET WALLS
    wall == 'block' ? snake.walls() : snake.clamp()
}
sizesmall = ()=>{
    size = 10;
    FPS = 6.25
    block = w / 10
    line = 4
    restart()
}
sizenormal = ()=>{
    size = 20;
    FPS = 12.5
    block = w / 20
    line = 2
    restart()
}
sizebig = ()=>{
    size = 30;
    FPS = 18.75
    block = w / 30
    line = 1
    restart()
}
sound = (snd) =>{
    var audio = new Audio();
    audio.src = snd;
    audio.play();
}
