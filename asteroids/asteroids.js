const container = document.querySelector('#container'),
    scoreID = document.getElementById('score'),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight),
    PI = Math.PI,
    BOX_SHOT = 40,
    WITH_DEBRIS = [50, 25, 10],
    distanceShot = 750,
    delayShot = 500,
    dom = {
      start: document.getElementById('start').style,
      gameover: document.getElementById('gameover').style,
      scoreLabel: document.getElementById('scoreLabel').style,
      scoring: document.getElementById('scoring').style
    }
    distanceToCursor = 25,
    DEFAULT_WEAPON={
    };
let score = 0;
let debriLastSpawn = 0;
let lastShot = 0;
let now;
container.appendChild(canvas);
function line(x1, y1, x2, y2, color='rgba(255, 255, 255, 1)', width=1){
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}
function circle(x, y, radius, color='#fff'){
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
    ctx.restore()
}
function clear(){
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h);
}
function min(num1, num2){
  return num1 < num2 ? num1 : num2;
}
function max(num1, num2){
  return num1 > num2 ? num1 : num2;
}
function deleteItem(list, index){
  let copy = list[index];
  list[index] = list[list.length - 1]
  list[list.length - 1] = copy;
  list.pop()
}
//<===========| ASTEROIDS |============>
function distance(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}
class Spacecraft{
    constructor(){
        this.angle = 0
        this.x = w / 2
        this.y = h / 2
        this.dX = 0
        this.dY = 0
        this.speed = 1.2
        this.mouseX = 0
        this.mouseY = 0
        this.shooting = []
        this.size = 7.5
        this.insert = false
    }
    draw(){
      line(Math.cos(this.angle) * 2 * this.size + this.x, Math.sin(this.angle) * 2 * this.size + this.y,
          Math.cos(2*PI/3 + this.angle) * this.size + this.x, Math.sin(2*PI/3 + this.angle) * this.size + this.y)
      line(Math.cos(this.angle) * 2 * this.size + this.x, Math.sin(this.angle) * 2 * this.size + this.y,
          Math.cos(4*PI/3 + this.angle) * this.size + this.x, Math.sin(4*PI/3 + this.angle) * this.size + this.y)
      line(Math.cos(2*PI/3 + this.angle) * this.size + this.x, Math.sin(2*PI/3 + this.angle) * this.size + this.y,
          this.x, this.y);
      line(Math.cos(4*PI/3 + this.angle) * this.size + this.x, Math.sin(4*PI/3 + this.angle) * this.size + this.y, this.x, this.y)
    }
    collision(){
      debris.map(debri=>{
        if(distance(debri.x, debri.y, this.x, this.y) < debri.length)playing = false;
      })
    }
    move(){
    //Segue il puntatore:
    //Calcola l'angolo tra il puntatore e la navicella e risale alle direzioni
      let diagonal = 0;
      document.addEventListener('mousemove', (e)=>{this.mouseX = e.x; this.mouseY = e.y})
      diagonal = distance(this.x, this.y, this.mouseX, this.mouseY);
      // Calcola l'angolo senza tenere conto del segno
      this.angle = Math.abs(Math.atan((this.y - this.mouseY) / (this.x - this.mouseX)));// Dopo questa riga l'angolo deve essere positivo
      if(this.mouseX < this.x)this.angle = PI - this.angle;// Se il coseno è negativo allora l'angolo è quello supplementare
      if(this.mouseY < this.y)this.angle *= -1;// Se il seno è negativo allora l'angolo deve essere negativo
      this.x += diagonal > distanceToCursor ? Math.cos(this.angle) * this.speed : 0;//Trovate le direzioni si incrementano le coordinate
      this.y += diagonal > distanceToCursor ? Math.sin(this.angle) * this.speed : 0;
    }
    shot(){// Crea un nuovo colpo ogni volta che clicco sullo schermo e lo cancella quando ha percorso una certa distanza
      window.addEventListener('click', ()=>{this.insert = true})
      if(this.insert & now - lastShot > delayShot){
        lastShot = now;
        this.shooting.push(new Shot(this.x, this.y, this.angle));
        this.insert = false;
      }
      for(let i = 0; i < this.shooting.length; i++){
        this.shooting[i].draw();
        let debrisCollisioned = this.shooting[i].collision();
        if(debrisCollisioned != -1){// Entra se ha colpito un asteroide
          particles.generateFramework(this.shooting[i].x, this.shooting[i].y, 10)// Genera il fuoco d'artificio
          if(debris[debrisCollisioned].length > 30){
            score += 10
            debris[debrisCollisioned].length -= 10;
            //debris[debrisCollisioned].line = debris[debrisCollisioned].length / 5;
            debris[debrisCollisioned].generate()
          }
          else{
            deleteItem(debris, debrisCollisioned);
            score += 50
          }
          deleteItem(this.shooting, i)
          if(this.shooting.length == 0)break;
        }
        if(this.shooting[i].walls()){
          deleteItem(this.shooting, i)
          if(this.shooting.length == 0)break;
        }
      }
    }
}
class Shot{
  constructor(x, y, angle){
    this.x = x
    this.y = y
    this.angle = angle
    this.length = 20
    this.speed = 4
    this.dX = 0
    this.dY = 0
  }
  draw(){
    this.dY = Math.sin(this.angle) * this.speed
    this.dX = Math.cos(this.angle) * this.speed
    line(this.x + this.dX/this.speed*this.length,
        this.y + this.dY/this.speed*this.length,
        this.x + this.dX,
        this.y + this.dY, '#fff');
    this.x += this.dX
    this.y += this.dY
  }
  collision(){
    // Ritorna TRUE se il il proiettile colpisce l'asteroide
    for(let i = 0; i < debris.length; i++)
        if(distance(debris[i].x, debris[i].y, this.x, this.y) < debris[i].length)return i;
    return -1;
  }
  walls(){
    if(this.x >= w | this.x <= 0)return true;
    if(this.y >= h | this.y <= 0)return true;
    return false;
  }
}
class Debris{
    constructor(line, length){
        this.line = line
        this.points = [{angle:0, faseX:0, faseY:0}]
        this.length = length
        this.x = Math.floor(Math.random()) == 0 ? Math.random() * w : 0
        this.y = this.x > 0 ? 0 : Math.random() * h
        this.dX = Math.random() * .2 - .1
        this.dY = Math.random() * .2 - .1
        this.rotation = -PI/360
        this.generate()
    }
    draw(){
      this.points[0] = this.points[this.points.length - 1];
      for(let i = 1; i < this.points.length; i++){
        line(Math.cos(this.points[i - 1].angle) * this.length + this.x + this.points[i - 1].faseX,
            Math.sin(this.points[i - 1].angle) * this.length + this.y + this.points[i - 1].faseY,
            Math.cos(this.points[i].angle) * this.length + this.x + this.points[i].faseX,
            Math.sin(this.points[i].angle) * this.length + this.y + this.points[i].faseY)
      }
    }
    update(){
      for(let i = 1; i < this.points.length; i++){
        if(this.x < 0)this.x = w
        else if(this.x >= w) this.x = 0
        if(this.y < 0)this.y = h
        else if(this.y >= h) this.y = 0
        this.x += this.dX
        this.y += this.dY
      }
    }
    generate(){
        this.points = [{x:0, y:0, faseX:0, faseY:0}]
        this.points.shift()
        let angle = PI / this.line * 2
        for(let i = 0; i < this.line; i++)
            this.points.push(
                {
                    angle: i * angle,
                    faseX: Math.random() * this.length/2 - this.length/4,
                    faseY: Math.random() * this.length/2 - this.length/4
                })
        this.points.push(this.points[0])
    }
}
class Particle{
  constructor(count){
    this.particles = [{x:0, y:0, dX: Math.random() * 1 - .5, dY: Math.random() * 1 - .5}]
    this.count = count
    this.generate()
  }
  generate(){
    for(let i = 0; i < this.count; i++)this.particles.push({x: Math.random() * w, y: Math.random() * h,
    dX: Math.random() * 4 - 0, dY: 0})
    // dY: Math.random() * 1 - .5
  }
  generateFramework(x, y, count){
    while(this.particles.length > 200)this.particles.shift()
    for(let i = 0; i < count; i++){
      this.particles.push({x: x, y: y,
      dX: Math.random() * 2.5 - 1.25,
      dY: Math.random() * 2.5 - 1.25})
    }
  }
  draw(){
    this.particles.map(particle=>{
      if(particle.dX > .5)particle.dX -= 0.01
      if(particle.dX < -.5)particle.dX += 0.01
      if(particle.dY > .5)particle.dY -= 0.01
      if(particle.dY < -.5)particle.dY += 0.01
      circle(particle.x, particle.y, 0.5)
      if(particle.x > w | particle.x < 0)particle.dX*=-1
      particle.x += particle.dX
      if(particle.y > h | particle.y < 0)particle.dY*=-1
      particle.y += particle.dY
    })
  }
}
class Ufo{
  constructor(x, y){
    this.x = x
    this.y = y
    this.width = 40
    this.height = 20
  }
  draw(){
    line(this.x - this.width/2, this.y, this.x + this.width/2, this.y);
    line(this.x - this.width/2 + 10, this.y + 5, this.x + this.width/2 - 10, this.y + 5);
    line(this.x - this.width/2 + 10, this.y - 5, this.x + this.width/2 - 10, this.y - 5);
    line(this.x - this.width/2 + 15, this.y - 10, this.x + this.width/2 - 15, this.y - 10);
    line(this.x - this.width/2, this.y, this.x - this.width/2 + 10, this.y - 5);
    line(this.x + this.width/2, this.y, this.x + this.width/2 - 10, this.y - 5);
  }
  move(){

  }
}
function start(){
  playing = true
  scoreFormatting = "";
  spacecraft = new Spacecraft();
  particles = new Particle(100);
  debris = [new Debris(5, 50)]
}
function format(){
  let scoreFormatting = "";
  scoreFormatting = ''
  if(score < 99)
    if(score < 9) scoreFormatting = ` 00${score}`
    else scoreFormatting = ` 0${score}`
  else scoreFormatting = ` ${score}`;
  scoreID.innerHTML = '';
  scoreID.innerHTML = scoreFormatting;
  document.getElementById('scoring').innerHTML = scoreFormatting;
  if(playing){
    dom.start.display = 'none';
    dom.scoreLabel.display = 'none';
    dom.gameover.display = 'none';
    dom.scoring.display='none'
  }
  else{
    dom.scoring.display = 'flex'
    dom.start.display = 'flex';
    dom.scoreLabel.display = 'flex';
    dom.gameover.display = 'flex';
    dom.scoreLabel.fontSize = '1.25rem'
    dom.start.fontSize = '1.25rem'
    dom.gameover.fontSize = '3rem'
    dom.scoring.fontSize = '1.25rem'
    dom.scoring.translate = `${w/2 + 55}px ${h/2}px`
    dom.scoreLabel.translate = `${w/2 - 100}px ${h/2}px`
    dom.start.translate = `${w/2 - 40}px ${h/2 + 30}px`
    dom.gameover.translate = `${w/2 - 140}px ${h/2 - 70}px`
  }
}
function gameover(){
}
let playing = false
let generateParticlesEnd = true;
let spacecraft = new Spacecraft();
let ufo = new Ufo(w/2, h/2);
let particles = new Particle(100);
let debris = [new Debris(5, 100)]
debris[0].x = w/2 - 200;
debris[0].y = h / 2
setInterval(()=>{
    ctx.imageSmoothingEnabled = false
    clear()
    debris.map(debri=>{
      debri.draw()
    })
    format()
    ufo.draw()
    if(playing){
      spacecraft.draw();
      generateParticlesEnd = true;
      now = new Date().getTime();
      if(now - debriLastSpawn > 999){
        debris.push(new Debris(15, Math.random() * 30 + 20));
        debriLastSpawn = now
      }
      debris.map(debri=>{debri.update()})
      spacecraft.collision();
      spacecraft.move();
      spacecraft.shot()
    }
    else{
      if(generateParticlesEnd){
        particles.generateFramework(spacecraft.x, spacecraft.y, 50);
        generateParticlesEnd = false;
      }
    }
    particles.draw();
}, 1000 / 100);
