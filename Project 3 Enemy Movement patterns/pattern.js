/**@type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;
const numberOfEnemies = 100;
const enmieArray = [];
let gameframe = 0;
class Enemy {
    constructor() {
        this.image = new Image();
        this.image.src = 'enemy4.png'
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = 213;
        this.spriteHeight = 213;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteHeight / 2;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.newX = Math.random() * canvas.width;
        this.newY = Math.random() * canvas.height;
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3+1);
        this.interval = Math.floor(Math.random()*200+50);
    }

    update() {
        if(gameframe %this.interval ===0){
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);

        }
        let dx = this.x -this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/70;
        this.y -= dy/70;
        //this.x = 0;
    
        //this.y = 0;
        if(this.x + this.width < 0) this.x = canvas.width;
        //animate sprites
        if(gameframe % this.flapSpeed === 0){
        this.frame > 4 ? this.frame = 0: this.frame++;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.spriteWidth*this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

for (let i = 0; i < numberOfEnemies; i++) {
    enmieArray.push(new Enemy());
}
console.log(enmieArray);
function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    enmieArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    })
    gameframe++;
    requestAnimationFrame(animate);
}

animate();
