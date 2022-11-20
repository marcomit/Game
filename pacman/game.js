const canvas = document.createElement('canvas'),
    container = document.querySelector('#canvas'),
    ctx = canvas.getContext('2d'),
    w = (canvas.width = 400),
    h = (canvas.height = 400),
    color = ['#00f', '#000'],
    block = w/17,
    size = block / 4;
container.appendChild(canvas);
canvas.style.border = '2.5px solid #55f';
let grid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 5, 1, 5, 5, 5, 1, 5, 1, 5, 5, 5, 1, 5, 5, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 5, 1, 5, 1, 5, 5, 5, 5, 5, 1, 5, 1, 5, 5, 1],
    [1, 1, 1, 1, 5, 1, 1, 1, 5, 1, 1, 1, 5, 1, 1, 1, 1],
    [5, 5, 5, 1, 5, 5, 5, 1, 5, 1, 5, 5, 5, 1, 5, 5, 5],
    [5, 5, 5, 1, 5, 1, 1, 1, 1, 1, 1, 1, 5, 1, 5, 5, 5],
    [1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1],
    [5, 5, 5, 1, 5, 1, 5, 5, 5, 5, 5, 1, 5, 1, 5, 5, 5],
    [5, 5, 5, 1, 5, 1, 1, 1, 1, 1, 1, 1, 5, 1, 5, 5, 5],
    [1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 5, 1, 5, 5, 5, 1, 5, 1, 5, 5, 5, 1, 5, 5, 1],
    [1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1],
    [5, 1, 5, 1, 5, 1, 5, 5, 5, 5, 5, 1, 5, 1, 5, 1, 5],
    [1, 1, 1, 1, 5, 1, 1, 1, 5, 1, 1, 1, 5, 1, 1, 1, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 5, 1, 5, 5, 5, 5, 5, 5, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
function draw(){
    for(let i = 0; i < grid.length; i++)
        for(let j = 0; j < grid[i].length; j++){
            if(grid[i][j] == 1)
            rect(j * block, i * block, block, block, '#000')
            if(grid[i][j] != 5)
                rect(j * block + block / 2 - size/2,
                    i * block + block / 2 - size/2,
                    size, size, '#ff0');
            else rect(j * block, i * block, block, block, '#00f')
        }
}
function rect(x, y, w, h, color='#fff'){
    ctx.fillStyle = color
    ctx.fillRect(x, y, w, h);
}
function circle(x, y, radius, color='#fff6', angle=0){
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, radius, 0 + angle, 2 * Math.PI - angle, false)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
    ctx.restore()
}
setInterval(()=>{
    draw();
})