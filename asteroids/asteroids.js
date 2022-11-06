const container = document.querySelector('#container'),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight),
    PI = Math.PI,
    countDebris = 20;
container.appendChild(canvas);
function line(x1, y1, x2, y2){
    ctx.beginPath();
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}
function clear(){
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h);
}
function setDebris(){
  let freeDebris = countDebris - debris.length;
  for(let i = 0; i < freeDebris; i++)debris.push(new Debris(12, 50))
}
class Spacecraft{
    constructor(){
        this.angle = 0
        this.x = w / 2
        this.y = h / 2
        this.dX = 0
        this.dY = 0
        this.speed = .5
    }
    draw(){
      line(Math.cos(11*PI/6 + this.angle) * 10 + this.x, Math.sin(11*PI/6 + this.angle) * 10 + this.y,
          Math.cos(7*PI/6 + this.angle) * 10 + this.x, Math.sin(7*PI/6 + this.angle) * 10 + this.y)
      line(Math.cos(11*PI/6 + this.angle) * 10 + this.x, Math.sin(11*PI/6 + this.angle) * 10 + this.y,
          Math.cos(PI/2 + this.angle) * 20 + this.x, Math.sin(PI/2 + this.angle) * 20 + this.y)
      line(Math.cos(7*PI/6 + this.angle) * 10 + this.x, Math.sin(7*PI/6 + this.angle) * 10 + this.y,
          Math.cos(PI/2 + this.angle) * 20 + this.x, Math.sin(PI/2) * 20 + this.angle + this.y)
    }
    move(){
      let angle = 0
      document.addEventListener('mousemove', (e)=>{
        angle = Math.atan((this.y - e.pageY) / (this.x - e.pageX))
        this.dX = this.speed*Math.cos(angle)
        this.dY = this.speed*Math.sin(angle)
      })
      this.x+=this.dX
      this.y+=this.dY
    }
    shot(){
        
    }
    collision(){

    }
}
class Debris{
    constructor(line, length){
        this.line = line
        this.points = [{x:0, y:0, faseX:0, faseY:0}]
        this.length = length
        this.x = w / 2
        this.y = h / 2
        this.generate()
        this.dX = Math.random() * .25 - .125
        this.dY = Math.random() * .25 - .125
        this.rotation = Math.random() * PI/16
    }
    draw(){
        for(let i = 1; i < this.points.length; i++){
            line(this.points[i - 1].x + this.x + this.points[i - 1].faseX,
              this.points[i - 1].y + this.y + this.points[i - 1].faseY,
              this.points[i].x + this.x + this.points[i].faseX,
              this.points[i].y + this.y + this.points[i].faseY)

            if(this.x > w)this.x = 0
            else if(this.x < 0)this.x = w
            this.x += this.dX
            if(this.y > h)this.y = 0
            else if(this.y < 0)this.y = h
            this.y += this.dY
        }
    }
    generate(){
        this.points.shift()
        let angle = PI / this.line * 2
        for(let i = 0; i < this.line; i++)
            this.points.push(
                {
                    x: Math.cos(i * angle) * this.length,
                    y: Math.sin(i * angle) * this.length,
                    faseX: Math.random() * this.length/2 - this.length/4,
                    faseY: Math.random() * this.length/2 - this.length/4
                })
        this.points.push(this.points[0])
    }
    update(){

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
      circle(particle.x, particle.y, 1)
      if(particle.x > w | particle.x < 0)particle.dX*=-1
      particle.x += particle.dX
      if(particle.y > h | particle.y < 0)particle.dY*=-1
      particle.y += particle.dY
    })
  }
}
function circle(x, y, radius){
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = '#fff6'
    ctx.fill()
    ctx.closePath()
    ctx.restore()
}
let spacecraft = new Spacecraft();
let particles = new Particle(250);
let debris = []
setInterval(()=>{
    clear()
    setDebris()
    debris.map(debri=>{
      debri.draw()
    })
    spacecraft.draw();
    spacecraft.move();
    particles.draw();
}, 1000 / 100);
