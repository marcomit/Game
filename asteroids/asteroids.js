//<===========| ASTEROIDS |============>
const container = document.querySelector('#container'),
    scoreID = document.getElementById('score'),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    PI = Math.PI,
    distanceShot = 750,
    delayUfoShot = 4,
    delaySpecialAmmo = 10, // seconds
    dom = {
        start: document.getElementById('start').style
    },
    color = ['rgb(255, 0, 0)',
        'rgb(225, 30, 0)',
        'rgb(195, 60, 0)',
        'rgb(160, 100, 0)',
        'rgb(125, 125, 0)',
        'rgb(100, 150, 0)',
        'rgb(75, 180, 0)',
        'rgb(50, 205, 0)',
        'rgb(25, 230, 0)',
        'rgb(0, 255, 0)'
    ]
distanceToCursor = 25,
    WEAPON = [
        {
            name: 'default'.toUpperCase(),
            speed: 4,
            width: 20,
            color: '#fff',
            blur: 0,
            lineWidth: 1,
            deleteShot: true,
            delay: 500,
            lastShot: 0,
            shotToPush: function (shot, x, y, angle) { shot.push(new Shot(x, y, angle, weaponIndex)) },
            collisionDebris: function (shot, index, indexDebri) {
                particles.generateFirework(shot[index].x, shot[index].y, 10)
                let anglec = -Math.sin(
                    angle(spacecraft.x, spacecraft.y, debris[indexDebri].x, debris[indexDebri].y) -
                    angle(shot[index].x, shot[index].y, debris[indexDebri].x, debris[indexDebri].y));
                debris[indexDebri].rotation += anglec * PI / 90
                if (debris[indexDebri].length > 20) {
                    score += 10
                    debris[indexDebri].length -= 15;
                    debris[indexDebri].generate()
                }
                else {
                    deleteItem(debris, indexDebri);
                    score += 50
                }
                deleteItem(shot, index);
                index--
            },
            collisionUfo: function (shot, index) {
                particles.generateFirework(shot[index].x, shot[index].y, 10)
                ufo.health--
                if (ufo.health < 1) {
                    ammo = new Ammo(ufo.x, ufo.y);
                    timeAmmo = new Date().getSeconds();
                    ufo = new Ufo(50, 50);
                    ufo.health = 5;
                }
                score += 50
                deleteItem(shot, index);
                index--
            }
        },
        {
            name: 'laser'.toUpperCase(),
            speed: 20,
            width: 40,
            color: '#0ff',
            blur: 100,
            lineWidth: 3,
            deleteShot: true,
            delay: 500,
            lastShot: 0,
            shotToPush: function (shot, x, y, angle) { shot.push(new Shot(x, y, angle, weaponIndex)) },
            collisionDebris: function (shot, index, indexDebri) {
                particles.generateFirework(shot[index].x, shot[index].y, 10)
                let anglec = -Math.sin(
                    angle(spacecraft.x, spacecraft.y, debris[indexDebri].x, debris[indexDebri].y) -
                    angle(shot[index].x, shot[index].y, debris[indexDebri].x, debris[indexDebri].y));
                debris[indexDebri].rotation += anglec * PI / 90
                if (debris[indexDebri].length > 30) {
                    score += 10
                    debris[indexDebri].length -= 10;
                    debris[indexDebri].generate()
                }
                else {
                    deleteItem(debris, indexDebri);
                    score += 50
                }
            },
            collisionUfo: function (shot, index) {
                particles.generateFirework(shot[index].x, shot[index].y, 10)
                ufo.health--
                if (ufo.health < 1) {
                    ammo = new Ammo(ufo.x, ufo.y);
                    timeAmmo = new Date().getSeconds();
                    ufo = new Ufo(50, 50);
                    ufo.health = 5;
                }
                score += 50
            }
        },
        {
            name: 'power'.toUpperCase(),
            speed: 4,
            width: 20,
            color: '#f00',
            blur: 40,
            lineWidth: 3,
            deleteShot: true,
            delay: 750,
            lastShot: 0,
            shotToPush: function (shot, x, y, angle) { shot.push(new Shot(x, y, angle, weaponIndex)) },
            collisionDebris: function (shot, index, indexDebri) {
                particles.generateFirework(shot[index].x, shot[index].y, 10)
                deleteItem(debris, indexDebri);
                score += 50
                deleteItem(shot, index);
                index--
            },
            collisionUfo: function (shot, index) {
                particles.generateFirework(shot[index].x, shot[index].y, 10)
                ammo = new Ammo(ufo.x, ufo.y);
                timeAmmo = new Date().getSeconds();
                ufo = new Ufo(50, 50);
                ufo.health = 5;
                score += 50
                deleteItem(shot, index);
                index--
            }
        },
        {
            name: 'speed'.toUpperCase(),
            speed: 4,
            width: 100,
            color: '#f80',
            blur: 40,
            lineWidth: 3,
            deleteShot: true,
            delay: 100,
            lastShot: 0,
            shotToPush: function (shot, x, y, angle) { shot.push(new Shot(x, y, angle, weaponIndex)) },
            collisionDebris: function (shot, index, indexDebri) {
                particles.generateFirework(shot[index].x, shot[index].y, 10)
                let anglec = -Math.sin(
                    angle(spacecraft.x, spacecraft.y, debris[indexDebri].x, debris[indexDebri].y) -
                    angle(shot[index].x, shot[index].y, debris[indexDebri].x, debris[indexDebri].y));
                debris[indexDebri].rotation += anglec * PI / 90
                if (debris[indexDebri].length > 30) {
                    score += 10
                    debris[indexDebri].length -= 10;
                    debris[indexDebri].generate()
                }
                else {
                    deleteItem(debris, indexDebri);
                    score += 50
                }
                deleteItem(shot, index);
                index--
            },
            collisionUfo: function (shot, index) {
                particles.generateFirework(shot[index].x, shot[index].y, 10)
                ufo.health--
                if (ufo.health < 1) {
                    ammo = new Ammo(ufo.x, ufo.y);
                    ufo = new Ufo(50, 50);
                    ufo.health = 5;
                }
                score += 50
                deleteItem(shot, index);
                index--
            }
        },
        {
            name: 'triple'.toUpperCase(),
            speed: 4,
            width: 20,
            color: '#0f0',
            blur: 100,
            lineWidth: 3,
            deleteShot: true,
            delay: 500,
            lastShot: 0,
            shotToPush: function (shot, x, y, angle) {
                shot.push(new Shot(x, y, angle, weaponIndex));
                shot.push(new Shot(x, y, angle - PI / 16, weaponIndex));
                shot.push(new Shot(x, y, angle + PI / 16, weaponIndex));
            },
            collisionDebris: function (shot, index, indexDebri) {
                particles.generateFirework(shot[index].x, shot[index].y, 10)
                let anglec = -Math.sin(
                    angle(spacecraft.x, spacecraft.y, debris[indexDebri].x, debris[indexDebri].y) -
                    angle(shot[index].x, shot[index].y, debris[indexDebri].x, debris[indexDebri].y));
                debris[indexDebri].rotation += anglec * PI / 90
                if (debris[indexDebri].length > 30) {
                    score += 10
                    debris[indexDebri].length -= 10;
                    debris[indexDebri].generate()
                }
                else {
                    deleteItem(debris, indexDebri);
                    score += 50
                }
                deleteItem(shot, index);
                index--
            },
            collisionUfo: function (shot, index) {
                particles.generateFirework(shot[index].x, shot[index].y, 10)
                ufo.health--
                if (ufo.health < 1) {
                    ammo = new Ammo(ufo.x, ufo.y);
                    timeAmmo = new Date().getSeconds();
                    ufo = new Ufo(50, 50);
                    ufo.health = 5;
                }
                score += 50
                deleteItem(shot, index);
                index--
            }
        }
    ];
let w = (canvas.width = window.innerWidth);
let h = (canvas.height = window.innerHeight);
let score = 0;
let highscore = 0;
let weaponIndex = 0;
let debriLastSpawn = 0;
let lastShot = 0;
let lastShotUfo = 0;
let lastAmmoSpawn = 0;
let timeAmmo = 0;
let now;
container.appendChild(canvas);
function line(x1, y1, x2, y2, color = '#ffff', width = 1, blur = 0) {
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = blur;
    ctx.shadowColor = `${color}a`;
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.lineWidth = width
    ctx.strokeStyle = color
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
}
function circle(x, y, radius, color = '#fff6') {
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
    ctx.restore()
}
function angle(x1, y1, x2, y2) {
    let angle = Math.abs(Math.atan((y1 - y2) / (x1 - x2)))
    if (x2 < x1) angle = PI - angle
    if (y2 < y1) angle *= -1
    return angle
}
function clear() {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h);
}
function stringFormat(number) {
    let textFormat = "";
    if (number < 99)
        if (number < 9) textFormat = `00${number}`
        else textFormat = `0${number}`
    else textFormat = `${number}`
    return textFormat
}
function deleteItem(list, index) {
    let copy = list[index];
    list[index] = list[list.length - 1]
    list[list.length - 1] = copy;
    list.pop()
}
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}
// ! Events
document.addEventListener('mousemove', (e) => { spacecraft.mouseX = e.x; spacecraft.mouseY = e.y })
document.addEventListener('click', () => { spacecraft.insert = true })
class Spacecraft {
    constructor() {
        this.angle = 0
        this.x = w / 2
        this.y = h / 2
        this.dX = 0
        this.dY = 0
        this.speed = 1.2
        this.mouseX = 0
        this.mouseY = 0
        this.shooting = [new Shot(0, 0, 0, 0)]
        this.size = 7
        this.insert = false
    }
    draw() {
        line(Math.cos(this.angle) * 2 * this.size + this.x, Math.sin(this.angle) * 2 * this.size + this.y,
            Math.cos(2 * PI / 3 + this.angle) * this.size + this.x, Math.sin(2 * PI / 3 + this.angle) * this.size + this.y)
        line(Math.cos(this.angle) * 2 * this.size + this.x, Math.sin(this.angle) * 2 * this.size + this.y,
            Math.cos(4 * PI / 3 + this.angle) * this.size + this.x, Math.sin(4 * PI / 3 + this.angle) * this.size + this.y)
        line(Math.cos(2 * PI / 3 + this.angle) * this.size + this.x, Math.sin(2 * PI / 3 + this.angle) * this.size + this.y,
            this.x, this.y);
        line(Math.cos(4 * PI / 3 + this.angle) * this.size + this.x, Math.sin(4 * PI / 3 + this.angle) * this.size + this.y, this.x, this.y)
    }
    collision() {
        debris.map(debri => {// Controlla se si è scontrato con un'asteroide
            if (distance(debri.x, debri.y, this.x, this.y) < debri.length) playing = false;
        })
        //Controlla se si è scontrato con l'ufo
        if (ufo.health > 0) if (this.x > ufo.x - ufo.width / 2 & this.x < ufo.x + ufo.width & this.y > ufo.y - ufo.height / 4 * 3 & this.y < ufo.y + ufo.height / 4 * 3) playing = false;
        // Controlla se si scontra con l'esagono
        let day = new Date();
        if (ammo != null)
            if (distance(this.x, this.y, ammo.x, ammo.y) <= ammo.size + this.size) {
                weaponIndex = ammo.weapon;
                ammo = null;
                lastShot = day.getSeconds();
            }
    }
    move() {
        //Segue il puntatore:
        //Calcola l'angolo tra il puntatore e la navicella e risale alle direzioni
        let diagonal = 0;
        let day = new Date().getSeconds();
        if (weaponIndex > 0 & 10 - (day - lastShot) >= 0) {
            ctx.font = '15px Poppins'
            ctx.fillStyle = color[10 - (day - lastShot)]
            ctx.fillText(`${10 - (day - lastShot)}`, this.mouseX + 5, this.mouseY - 5, 400);
        }
        diagonal = distance(this.x, this.y, this.mouseX, this.mouseY);
        this.angle = angle(this.x, this.y, this.mouseX, this.mouseY)
        this.x += diagonal > distanceToCursor ? Math.cos(this.angle) * this.speed : 0;//Trovate le direzioni si incrementano le coordinate
        this.y += diagonal > distanceToCursor ? Math.sin(this.angle) * this.speed : 0;
    }
    shot() {// Crea un nuovo colpo ogni volta che clicco sullo schermo e lo cancella quando ha percorso una certa distanza
        let day = new Date();
        if (this.insert & now - WEAPON[weaponIndex].lastShot > WEAPON[weaponIndex].delay) {
            if (day.getSeconds() - lastShot > 10) weaponIndex = 0;
            WEAPON[weaponIndex].lastShot = now;
            WEAPON[weaponIndex].shotToPush(this.shooting, this.x, this.y, this.angle);
            this.insert = false;
        }
        console.log(this.shooting.length)
        for (let i = 0; i < this.shooting.length; i++) {
            this.shooting[i].draw();
            // Collision ufo
            if (this.shooting[i].collisionUfo()) {
                WEAPON[weaponIndex].collisionUfo(this.shooting, i);
                if (this.shooting.length == 0) break;
            }
            // Collision debris
            let debrisCollisioned = this.shooting[i] != undefined ? this.shooting[i].collision() : -1;
            if (debrisCollisioned != -1) {// Entra se ha colpito un asteroide
                WEAPON[weaponIndex].collisionDebris(this.shooting, i, debrisCollisioned)
                if (this.shooting.length == 0) break;
            }
            if (i >= 0)
                if (this.shooting[i] != undefined)
                    if (this.shooting[i].walls()) {
                        deleteItem(this.shooting, i)
                        if (this.shooting.length == 0) break;
                    }
        }
    }
}
class Shot {
    constructor(x, y, angle, index) {
        this.x = x
        this.y = y
        this.angle = angle
        this.length = WEAPON[index].width
        this.speed = WEAPON[index].speed
        this.dX = 0
        this.dY = 0
        this.color = WEAPON[index].color
        this.lineWidth = WEAPON[index].lineWidth
    }
    draw() {
        this.dY = Math.sin(this.angle) * this.speed
        this.dX = Math.cos(this.angle) * this.speed
        line(this.x + this.dX / this.speed * this.length,
            this.y + this.dY / this.speed * this.length,
            this.x + this.dX,
            this.y + this.dY, this.color, this.lineWidth, 40);
        this.x += this.dX
        this.y += this.dY
    }
    collision() {
        // Ritorna TRUE se il il proiettile colpisce l'asteroide
        for (let i = 0; i < debris.length; i++)
            if (distance(debris[i].x, debris[i].y, this.x, this.y) < debris[i].length) return i;
        return -1;
    }
    collisionUfo() {
        // Ritorna true se il proiettile colpisce l'ufo
        if (this.x >= ufo.x - ufo.width / 2 & this.x <= ufo.x + ufo.width / 2)
            if (this.y >= ufo.y - ufo.height / 4 * 3 & this.y <= ufo.y + ufo.height / 4)
                return true;
        return false;
    }
    collisionSpacecraft() {
        return distance(this.x, this.y, spacecraft.x, spacecraft.y) <= spacecraft.size
    }
    walls() {
        if (this.x >= w | this.x <= 0) return true;
        if (this.y >= h | this.y <= 0) return true;
        return false;
    }
}
class Debris {
    constructor(line, length) {
        this.line = line
        this.points = [{ angle: 0, faseX: 0, faseY: 0 }]
        this.length = length
        this.x = Math.floor(Math.random()) == 0 ? Math.random() * w : 0
        this.y = this.x > 0 ? 0 : Math.random() * h
        this.dX = Math.random() * .2 - .1
        this.dY = Math.random() * .2 - .1
        this.rotation = Math.random() * PI / 180 - PI / 360
        this.generate()
    }
    update() {
        for (let i = 1; i < this.points.length; i++) {
            if (this.x < 0) this.x = w
            else if (this.x >= w) this.x = 0
            if (this.y < 0) this.y = h
            else if (this.y >= h) this.y = 0
            this.x += this.dX
            this.y += this.dY
        }
    }
    generate() {
        this.points = [{ x: 0, y: 0, fase: 0 }]
        this.points.shift()
        let angle = PI / this.line * 2
        for (let i = 0; i < this.line; i++)
            this.points.push(
                {
                    angle: i * angle,
                    fase: Math.random() * this.length / 2 - this.length / 4,
                })
        this.points.push(this.points[0])
    }
    draw() {
        for (let i = 1; i < this.points.length; i++) {
            line(Math.cos(this.points[i - 1].angle) * (this.length + this.points[i - 1].fase) + this.x,
                Math.sin(this.points[i - 1].angle) * (this.length + this.points[i - 1].fase) + this.y,
                Math.cos(this.points[i].angle) * (this.length + this.points[i].fase) + this.x,
                Math.sin(this.points[i].angle) * (this.length + this.points[i].fase) + this.y)
            this.points[i].angle += this.rotation
        }
    }
}
class Particle {
    constructor(count) {
        this.particles = [{ x: 0, y: 0, dX: Math.random() * 1 - .5, dY: Math.random() * 1 - .5 }]
        this.count = count
        this.generate()
    }
    generate() {
        for (let i = 0; i < this.count; i++)this.particles.push({
            x: Math.random() * w, y: Math.random() * h,
            dX: Math.random() * 4 - 0, dY: 0
        })
        // dY: Math.random() * 1 - .5
    }
    generateFirework(x, y, count) {
        let angle = 2 * PI / count
        while (this.particles.length > 200) this.particles.shift()// Elimina tutte le particelle se sono più di 200
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                dX: Math.cos(i * angle) * Math.random() * 2,
                dY: Math.sin(i * angle) * Math.random() * 2
            })
        }
    }
    draw() {
        this.particles.map(particle => {
            if (particle.dX > .5) particle.dX -= 0.01
            if (particle.dX < -.5) particle.dX += 0.01
            if (particle.dY > .5) particle.dY -= 0.01
            if (particle.dY < -.5) particle.dY += 0.01
            circle(particle.x, particle.y, 1)
            if (particle.x > w | particle.x < 0) particle.dX *= -1
            particle.x += particle.dX
            if (particle.y > h | particle.y < 0) particle.dY *= -1
            particle.y += particle.dY
        })
    }
}
class Ufo {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = 30
        this.height = 15
        this.health = 4
        this.directionTime = Math.random() * 100 + 200;
        this.speed = 1.5
        this.angle = PI / 8 * Math.floor(Math.random() * 8)
        this.dX = Math.cos(this.angle) * this.speed;
        this.dY = Math.sin(this.angle) * this.speed;
        this.shooting = [new Shot(0, 0, 0, 0)]
    }
    draw() {
        line(this.x - this.width / 2, this.y, this.x + this.width / 2, this.y);
        line(this.x - this.width / 4, this.y + this.height / 4, this.x + this.width / 4, this.y + this.height / 4);
        line(this.x - this.width / 2, this.y, this.x - this.width / 4, this.y + this.height / 4);
        line(this.x + this.width / 2, this.y, this.x + this.width / 4, this.y + this.height / 4);
        line(this.x - this.width / 4, this.y - this.height / 4, this.x + this.width / 4, this.y - this.height / 4);
        line(this.x - this.width / 2, this.y, this.x - this.width / 4, this.y - this.height / 4);
        line(this.x + this.width / 2, this.y, this.x + this.width / 4, this.y - this.height / 4);
        line(this.x - this.width / 8, this.y - this.height / 8 * 5, this.x + this.width / 8, this.y - this.height / 8 * 5);
        line(this.x + this.width / 8, this.y - this.height / 8 * 5, this.x + this.width / 4, this.y - this.height / 4);
        line(this.x - this.width / 8, this.y - this.height / 8 * 5, this.x - this.width / 4, this.y - this.height / 4);
    }
    move() {
        this.directionTime--
        if (this.directionTime <= 0) {
            this.angle = PI / 4 * Math.floor(Math.random() * 7)
            this.dX = Math.cos(this.angle) * this.speed;
            this.dY = Math.sin(this.angle) * this.speed;
            this.directionTime = Math.random() * 100 + 200;
        }
        this.x += this.dX
        this.y += this.dY
        if (this.x + 50 > w | this.x < 50) this.dX *= -1
        if (this.y + 50 > h | this.y < 50) this.dY *= -1
        if (score > 1000) this.shot()
    }
    shot() {
        for (let i = 0; i < this.shooting.length; i++) {
            this.shooting[i].draw()
            if (this.shooting[i].collisionSpacecraft()) playing = false;
            if (this.shooting[i].walls()) deleteItem(this.shooting, i)
            if (this.shooting.length == 0) break;
        }
        let day = new Date().getSeconds();
        if (day - lastShotUfo > delayUfoShot) {
            lastShotUfo = day;
            this.shooting.push(new Shot(this.x, this.y, angle(this.x, this.y, spacecraft.x, spacecraft.y), 0))//
        }
    }
}
class Ammo {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.size = 10
        this.dX = Math.random() * 0.2 - 0.1
        this.dY = Math.random() * 0.2 - 0.1
        this.weapon = Math.floor(Math.random() * (WEAPON.length - 1) + 1);
        this.rotation = Math.random() * PI / 90 - PI / 180
        this.points = []
        this.generate()
    }
    generate() {
        for (let i = 0; i < 7; i++)this.points.push(PI / 3 * i);
        this.points.push(this.points[0])
    }
    draw() {
        circle(this.x, this.y, 1.5, WEAPON[this.weapon].color)
        for (let i = 0; i < this.points.length - 2; i++) {
            circle(Math.cos(this.points[i]) * this.size + this.x, Math.sin(this.points[i]) * this.size + this.y, 1.5, WEAPON[this.weapon].color)
            line(Math.cos(this.points[i]) * this.size + this.x,
                Math.sin(this.points[i]) * this.size + this.y,
                Math.cos(this.points[i + 1]) * this.size + this.x,
                Math.sin(this.points[i + 1]) * this.size + this.y, WEAPON[this.weapon].color)
            line(Math.cos(this.points[i]) * this.size + this.x,
                Math.sin(this.points[i]) * this.size + this.y,
                this.x, this.y, WEAPON[this.weapon].color)
            this.points[i] += this.rotation
        }
        this.points[this.points.length - 2] += this.rotation
        this.points[this.points.length - 1] += this.rotation
        this.x += this.dX
        this.y += this.dY
    }
}
function start() {
    score = 0;
    playing = true
    scoreFormatting = "";
    weaponIndex = 0;
    ufo = new Ufo(Math.random() * (w - 50) + 50, 50)
    spacecraft = new Spacecraft();
    //particles = new Particle(100);
    debris = [new Debris(12, 50)]
    ammo = null
}
function format() {
    if (highscore < score) highscore = score;
    dom.start.display = 'none'
    let scoreFormatting = stringFormat(score);
    ctx.font = '20px Poppins'
    ctx.fillStyle = 'white'
    ctx.fillText(`SCORE: ${scoreFormatting}`, 10, 22, 200);
    ctx.fillText(`HIGHSCORE: ${stringFormat(highscore)}`, 10, 50, 200);
    ctx.fillText(`WEAPON: ${WEAPON[weaponIndex].name}`, 150, 22, 200)
    if (!playing) {
        ctx.fillText(`SCORE: ${scoreFormatting}`, w / 2 - 50, h / 2, 400)
        ctx.font = '40px Poppins'
        ctx.fillText("ASTEROIDS", w / 2 - 100, h / 2 - 50, 400);
        dom.start.display = 'flex'
        dom.start.translate = `${w / 2 - 30}px ${h / 2}px`
    }
}
let playing = false
let generateParticlesEnd = true;
let spacecraft = new Spacecraft();
let ufo = new Ufo(Math.random() * (w - 80) + 50, 50);
let particles = new Particle(100);
let debris = [];
let ammo = new Ammo(100, 100);
setInterval(() => {
    let day = new Date().getSeconds();
    w = (canvas.width = window.innerWidth);
    h = (canvas.height = window.innerHeight);
    ctx.imageSmoothingEnabled = true
    clear()
    debris.map(debri => { debri.draw() })
    if (ammo != null) {
        ammo.draw()
        if (day - timeAmmo > 4) {
            lastAmmoSpawn = day;
            ammo = null;
        }
    }
    format()
    if (ufo.health > 0) ufo.draw()
    if (playing) {
        if (ufo.health > 0) ufo.move()
        spacecraft.draw();
        generateParticlesEnd = true;
        now = new Date().getTime();
        if (now - debriLastSpawn > 999 & debris.length <= 20) {
            debris.push(new Debris(15, Math.random() * 30 + 20));
            debriLastSpawn = now
            //console.log(debris.length)
        }
        debris.map(debri => { debri.update() })
        spacecraft.collision();
        spacecraft.move();
        spacecraft.shot()
    }
    else {
        if (generateParticlesEnd) {
            particles.generateFirework(spacecraft.x, spacecraft.y, 100);
            generateParticlesEnd = false;
        }
    }
    particles.draw();
}, 1000 / 100);