const container = document.querySelector('#container'),
    score = document.getElementById('score'),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight),
    PI = Math.PI,
    BOX_SHOT = 40,
    WITH_DEBRIS = [50, 25, 10],
    distanceShot = 750,
    distanceToCursor = 20,
    DEFAULT_WEAPON={
    };
let scoring = 0;
let debriLastSpawn = 0;
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
function circle(x, y, radius, color='#fff6'){
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
    move(){
    //Segue il puntatore:
    //Calcola l'angolo tra il puntatore e la navicella e risale alle direzioni
      let diagonal = 0;
      document.addEventListener('mousemove', (e)=>{this.mouseX = e.x; this.mouseY = e.y})
      diagonal = distance(this.x, this.y, this.mouseX, this.mouseY);
      // Calcola l'angolo senza tenere conto del segno
      this.angle = Math.atan((this.y - this.mouseY) / (this.x - this.mouseX));
      if(this.angle < 0)this.angle *= -1 // Dopo questa riga l'angolo deve essere positivo
      if(this.mouseX < this.x)this.angle = PI - this.angle;// Se il coseno è negativo allora l'angolo è quello supplementare
      if(this.mouseY < this.y)this.angle *= -1;// Se il seno è negativo allora l'angolo deve essere negativo
      this.x += diagonal > distanceToCursor ? Math.cos(this.angle) * this.speed : 0;//Trovate le direzioni si incrementano le coordinate
      this.y += diagonal > distanceToCursor ? Math.sin(this.angle) * this.speed : 0;
    }
    shot(){// Crea un nuovo colpo ogni volta che clicco sullo schermo e lo cancella quando ha percorso una certa distanza
    window.addEventListener('click', ()=>{this.insert = true})
      if(this.insert){
        this.shooting.push({shot: new Shot(this.x, this.y, this.angle), dist: 0});
        this.insert = false;
      }
      for(let i = 0; i < this.shooting.length; i++){
        this.shooting[i].shot.draw();
        this.shooting[i].dist += this.shooting[i].shot.speed;
        if(this.shooting[i].shot.collision()){
          console.log("TRUE")
        }
        if(this.shooting[i].dist >= distanceShot | this.shooting[i].shot.walls()){
          deleteItem(this.shooting, i)
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
    line(this.x + this.dX/this.speed*this.length, this.y + this.dY/this.speed*this.length, this.x + this.dX, this.y + this.dY, '#0ff');
    this.x += this.dX
    this.y += this.dY
  }
  collision(){
    // Ritorna TRUE se il il proiettile colpisce l'asteroide
    debris.map(debri=>{
      debri.points.map(point=>{
        if(distance(point.x, point.y, this.x, this.y) < 100)return true;
      })
    })
    return false;
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
        this.points = [{x:0, y:0, faseX:0, faseY:0}]
        this.length = length
        this.x = Math.floor(Math.random()) == 0 ? Math.random() * w : 0
        this.y = this.x > 0 ? 0 : Math.random() * h
        this.dX = Math.random() * .25 - .125
        this.dY = Math.random() * .25 - .125
        this.rotation = Math.random() * PI/360 - PI/180
        this.generate()
    }
    
    draw(){
      for(let i = 1; i < this.points.length; i++){
        line(Math.cos(this.points[i - 1].x + this.rotation) * this.length + this.x + this.points[i - 1].faseX,
            Math.sin(this.points[i - 1].y + this.rotation) * this.length + this.y + this.points[i - 1].faseY,
            Math.cos(this.points[i].x + this.rotation) * this.length + this.x + this.points[i].faseX,
            Math.sin(this.points[i].y + this.rotation) * this.length + this.y + this.points[i].faseY)
        //this.points[i].x = (this.points[i].x + this.rotation)
        //this.points[i].y = (this.points[i].y + this.rotation)
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
                    x: i * angle,
                    y: i * angle,
                    faseX: Math.random() * this.length/2 - this.length/4,
                    faseY: Math.random() * this.length/2 - this.length/4
                })
        this.points.push(this.points[0])
    }
    update(){

    }
}
class Ufo{
  constructor(){

  }
  draw(){

  }
  move(){

  }
  generate_weapon(){

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
    dX: Math.random() * 1 - .5, dY: Math.random() * 1 - .5})
  }
  draw(){
    this.particles.map(particle=>{
      circle(particle.x, particle.y, 0.8)
      if(particle.x > w | particle.x < 0)particle.dX*=-1
      particle.x += particle.dX
      if(particle.y > h | particle.y < 0)particle.dY*=-1
      particle.y += particle.dY
    })
  }
}
let spacecraft = new Spacecraft();
let particles = new Particle(100);
let debris = [new Debris(12, 50)]
setInterval(()=>{
    ctx.imageSmoothingEnabled = false
    clear()
    now = new Date().getSeconds();
    if(now - debriLastSpawn > 2){debris.push(new Debris(12, Math.random() * 50 + 20)); debriLastSpawn = now}
    debris.map(debri=>{
      debri.draw()
    })
    spacecraft.draw();
    spacecraft.move();
    spacecraft.shot()
    particles.draw();
}, 1000 / 100);
