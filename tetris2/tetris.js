const canvas = document.createElement('canvas'),
    container = document.querySelector('#container'),
    nextSHAPE = document.querySelector('#nextShape'),
    canvas2 = document.createElement('canvas'),
    block = 24,
    w = (canvas.width=10 * block),
    h = (canvas.height=20 * block),
    img = document.getElementById('img'),
    ctx = canvas.getContext('2d'),
    nctx = canvas2.getContext('2d'),
    nw_h = (canvas2.width = 5 * block),
    FPS = 120,
    shadowColor = [
        'rgba(117, 251, 156, 0.4)',
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
            [0, 0, 0]]
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
    image = [2 * block, 0, 5 * block, 3 * block, 4 * block, block, 6 * block];
container.appendChild(canvas);
canvas2.height = 5 * block
nextSHAPE.appendChild(canvas2);
let frameForUpdate = 4
let countFrame = 0;
function drawImg(context, x, y, value){
  context.drawImage(img, 0, image[value - 1], block, block, x, y, block, block)
}
function rect(x, y, color){
  ctx.fillStyle = color;
  ctx.fillRect(x, y, block, block);
}
function clear(context, width, height){
  context.clearRect(0, 0, width, height)
}
class Grid{
  constructor(width, height){
    this.width = width
    this.height = height
    this.grid = []
    this.init();
  }
  init(){
    let row = []
    for(let i = 0; i < 20; i++){
      row = []
      for(let j = 0; j < 10; j++)row.push(0);
      this.grid.push(row);
    }
  }
  draw(){
    for(let i = 0; i < this.grid.length; i++)
      for(let j = 0; j < this.grid[i].length; j++)
        if(this.grid[i][j] != 0)drawImg(ctx, j * block, i * block, this.grid[i][j]);
  }
}
class Shape{
  constructor(x, y){
    this.x = x
    this.y = y
    this.shape = this.getRandomShape();
    this.direction = 'stopped'
  }
  getRandomShape(){
    return shapes[Math.floor(Math.random() * (shapes.length - 1))]
  }
  draw(context, shape){
    for(let i = 0; i < shape.length; i++)
      for(let j = 0; j < shape[i].length; j++)
        if(i + this.y >= 0)
          if(shape[i][j] != 0)drawImg(context, (this.x + j) * block, (this.y + i) * block, shape[i][j])
  }
  update(){
    countFrame++;
    if(countFrame > FPS / frameForUpdate){
      countFrame = 0;
      if(this.bottom(this.y))this.y++;
      else respawn()
    }
  }
  input(){
    document.addEventListener('keydown', (event)=>{
      if(event.keyCode == 37 | event.keyCode == 65)this.direction = 'left'
      if(event.keyCode == 38 | event.keyCode == 87)this.direction = 'rotate'
      if(event.keyCode == 39 | event.keyCode == 68)this.direction = 'right'
      if(event.keyCode == 40 | event.keyCode == 83)this.direction = 'down'
      if(event.keyCode == 32)this.direction = 'insert'
    })
  }
  insert(){
    for(let i = 0; i < this.shape.length; i++)
      for(let j = 0; j < this.shape[i].length; j++)
        if(this.shape[i][j] != 0)grid.grid[i + this.y][j + this.x] = this.shape[i][j]
  }
  bottom(y){
    for(let i = 0; i < this.shape.length; i++){
      for(let j = 0; j < this.shape[i].length; j++){
        if(this.shape[i][j] == 0) continue;
        if(i + y >= grid.grid.length - 1) return false;
        if(grid.grid[i + y + 1][j + this.x] != 0)return false;
      }
    }
    return true
  }
  left(){
    for(let i = 0; i < this.shape.length; i++){
      for(let j = 0; j < this.shape[i].length; j++){
        if(this.shape[i][j] == 0) continue;
        if(j + this.x < 0) return false;
        if(grid.grid[i + this.y + 1][j + this.x - 1] != 0)return false;
      }
    }
    return true
  }
  right(){
    for(let i = 0; i < this.shape.length; i++){
      for(let j = 0; j < this.shape[i].length; j++){
        if(this.shape[i][j] == 0) continue;
        if(j + this.x >= grid.grid.length - 1) return false;
        if(grid.grid[i + this.y][j + this.x + 1] != 0)return false;
      }
    }
    return true
  }
  checkMaxY(){
    let y = this.y;
    while(this.bottom(y))y++;
    return y;
  }
  shadow(){
    let y = this.checkMaxY();
    for(let i = 0; i < this.shape.length; i++)
      for(let j = 0; j < this.shape[i].length; j++)
        if(this.shape[i][j] != 0)rect((j + this.x) * block, (i + y) * block, shadowColor[this.shape[i][j] - 1])
  }
  rotateShape(){
    let shapeRotate = [];
    let lines = [];
    for(let i = 0; i < this.shape.length; i++){
      lines = []
      for(let j = 0; j < this.shape[i].length; j++)lines.push(this.shape[j][this.shape.length - 1 - i]);
      shapeRotate.push(lines);
    }
    return shapeRotate
  }
  rotate(){
    let shape = this.rotateShape()
    for(let i = 0; i < shape.length; i++){
      for(let j = 0; j < shape[i].length; j++){
        if(shape[i][j] == 0)continue;
        while(j + this.x< 0)this.x++;
        while(j + this.x>= shape.length)this.x--;
        if(grid.grid[i + this.y][j + this.x] == 0)return false;
      }
    }
    return true
  }
  move(){
    this.input()
    switch(this.direction){
      case 'left':
        console.log(this.left())
        if(this.left())this.x--;
        break;
      case 'right':
        if(this.right())this.x++
        break;
      case 'down':
        frameForUpdate = 100;
        break;
      case 'rotate':
        this.shape = this.rotateShape()
        // Controlla se il blocco può essere ruotato e in caso lo ruota
        break;
      case 'insert':
        // Inserisce direttamente il blocck all'interno della mappa
        this.y = this.checkMaxY();
        respawn()
        break;
    }
    if(this.direction != 'down')frameForUpdate = 4
    this.direction = 'stopped'
  }
}
function respawn(){
  current.insert();
  current = new Shape(4, 0);
  current.shape = next.shape;
  next = new Shape(1, 1);
}
let current = new Shape(4, 0);
let next = new Shape(1, 1);
let grid = new Grid(w/block, h/block);
let audio = new Audio('./tetris.mp3')
audio.play()
// Main
setInterval(()=>{
  clear(ctx, w, h);
  clear(nctx, nw_h, nw_h);
  grid.draw();;
  current.shadow();
  current.draw(ctx, current.shape);
  next.draw(nctx, next.shape);
  current.move()
  current.update();
}, 1000 / FPS);
