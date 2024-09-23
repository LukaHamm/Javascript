window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1')
    const ctx = canvas.getContext("2d");
    canvas.width= 1300;
    canvas.height = 720;
    let enemies = [];
    let score = 0;
    let gameOver = false;

    class InputHandler{
        constructor(){
            this.keys = [];
            this.touchY = ''
            this.touchThreshold = 30;
            window.addEventListener('keydown', e =>{
                if((e.key === 'ArrowDown'
                    || e.key === 'ArrowUp'
                    || e.key === 'ArrowLeft'
                    || e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1){
                    this.keys.push(e.key)
                } else if (e.key === 'Enter' && gameOver){
                    restartGame();
                }
            })

            window.addEventListener('keyup', e =>{
                if(e.key === 'ArrowDown' 
                    || e.key === 'ArrowUp'
                    || e.key === 'ArrowLeft'
                    || e.key === 'ArrowRight'){
                    this.keys.splice(this.keys.indexOf(e.key),1)
                }
            })

            window.addEventListener('touchstart', e => {
                console.log('start')
                this.touchY = e.changedTouches[0].pageY;
            })

            window.addEventListener('touchmove', e => {
                const swipeDistance = e.changedTouches[0].pageY -this.touchY;
                if(swipeDistance < -this.touchThreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up');
                else if (swipeDistance > this.touchThreshold && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down');
                    if(gameOver) restartGame();
                }
            })

            window.addEventListener('touchend', e => {
                this.keys.splice(this.keys.indexOf('swipe up'),1)
                this.keys.splice(this.keys.indexOf('swipe down'),1)
            })

           
        }
    }
    class Player{
        constructor(gameWidth, gameHeight){
            this.gameWidth=gameWidth;
            this.gameHeight=gameHeight;
            this.width = 200;
            this.heigt = 200;
            this.x = 0,
            this.y = this.gameHeight-this.heigt;
            this.image = document.getElementById('playerImage')
            this.frameX = 0;
            this.maxFrame = 8;
            this.frameY = 0;
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;
            this.frameTimer = 0;
            this.fps =20;
            this.frameInterval = 1000/this.fps
        }

        restart(){
            this.x=100;
            this.y = this.gameHeight-this.heigt;
            this.maxFrame=8;
            this.frameY=0;
        }

        draw(context){
            context.strokeStyle = "white"
            context.strokeRect(this.x,this.y,this.width,this.heigt);
            context.beginPath();
            context.arc(this.x + this.width/2,this.y + this.heigt/2,this.width/2,0,Math.PI*2)
            context.stroke();
            context.fillStyle = 'white';
            context.drawImage(this.image,this.width*this.frameX,this.heigt*this.frameY,this.width,
                this.heigt,this.x,this.y,this.width,this.heigt);
        }

        update(input, deltaTime, enemies){
            //collision detection
            enemies.forEach(enemy => {
                const dx = enemy.x + enemy.width/2 -(this.x + this.width/2);
                const dy = enemy.y + enemy.height/2 -(this.y + this.heigt/2);
                const distance = Math.sqrt(Math.pow(dy,2) + Math.pow(dx,2))
                if(distance < enemy.width/2 + this.width/2){
                    gameOver = true;
                }
            })
            //sprite animation 
            if(this.frameTimer > this.frameInterval){
                if(this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }

            //controls
            if(input.keys.indexOf("ArrowRight") > -1){
                this.speed=5;
            } else if (input.keys.indexOf("ArrowLeft") > -1){
                this.speed=-5
            }else if((input.keys.indexOf("ArrowUp") >-1 || input.keys.indexOf("swipe up") > -1) && this.onGround()){
                this.vy -=30;
            }else {
                this.speed=0;
            }
            // horizontal movement
            this.x += this.speed;
            if(this.x < 0) this.x = 0;
            if(this.x + this.width > this.gameWidth) this.x = this.gameWidth-this.width;

            //vertical movement
            this.y += this.vy;
            if(!this.onGround()){
                this.vy += this.weight;
                this.maxFrame = 5
                this.frameY = 1;
            }else {
                this.vy = 0;
                this.maxFrame = 8;
                this.frameY = 0;
            }
            if(this.y > this.gameHeight -this.heigt) this.y = this.gameHeight -this.heigt;
        }

        onGround(){
            return this.y >= this.gameHeight -this.heigt;
        }

    }
    class Background{
        constructor(gameWidth,gameHeight,x){
            this.gameWidth=gameWidth;
            this.gameHeight=gameHeight;
            this.image = document.getElementById('backgroundImage')
            this.x=x;
            this.y=0;
            this.width=2400;
            this.height=720;
            this.speed=7;
        }

        restart(){
            this.x=0;
        }

        draw(context){
            context.drawImage(this.image,this.x,this.y,this.width,this.height);
            context.drawImage(this.image,this.x + this.width,this.y,this.width,this.height);
        }

        update(){
            this.x -= this.speed;
            if(this.x < 0 -this.width) this.x=0;
        }
    }
    class Enemy{
        constructor(gameWidth,gameHeight){
            this.gameWidth=gameWidth;
            this.gameHeight=gameHeight;
            this.width=160;
            this.height=119;
            this.image=document.getElementById('enemyImage');
            this.x=this.gameWidth;
            this.y=this.gameHeight-this.height;
            this.frameX =0;
            this.speed = 8;
            this.maxFrame = 5;
            this.frameTimer = 0;
            this.fps =20;
            this.frameInterval = 1000/this.fps
            this.markedForDeletion = false;
        }

        draw(context){
            context.strokeStyle = "white"
            context.strokeRect(this.x,this.y,this.width,this.height);
            context.beginPath();
            context.arc(this.x + this.width/2,this.y + this.height/2,this.width/2,0,Math.PI*2)
            context.stroke();
            context.drawImage(this.image,this.frameX*this.width,0*this.height,
                this.width,this.height,this.x,this.y,this.width,this.height)
        }

        update(deltatime){
            if(this.frameTimer > this.frameInterval){
                if(this.frameX >= this.maxFrame) this.frameX=0;
                else this.frameX++; 
                this.frameTimer =0;
            }else{
                this.frameTimer += deltatime;
            }
            
            this.x-=this.speed;
            if(this.x < 0-this.width){
                this.markedForDeletion = true;
                score++;
            }
        }
    }

    
    function handleEnemies(deltaTime){
        if(enemyyTimer > enemyTimerInterval + randomEnemyInterval){
            enemies.push(new Enemy(canvas.width,canvas.height))
            randomEnemyInterval = Math.random()*1000 +500;
            enemyyTimer=0;
        }else{
            enemyyTimer += deltaTime;
        }
        enemies.forEach((enemy =>{
            enemy.draw(ctx);
            enemy.update(deltaTime);
        }))
        enemies = enemies.filter(enemy => !enemy.markedForDeletion)
    }

    function displayStatusText(context){
        context.font = "40px Hellvetica";
        context.fillStyle = "black";
        context.fillText("Score: " + score,20,50);
        context.fillStyle = "white";
        context.fillText("Score: " + score,22,52);
        if(gameOver){
            context.textAlign = "left";
            context.fillStyle = 'black';
            context.fillText("GAME OVER, press Enter to restart",canvas.width/2,200);
            context.fillStyle = 'white';
            context.fillText("GAME OVER, press Enter to restart",canvas.width/2+2,202);

        }
    }

    function restartGame(){
        player.restart();
        background.restart();
        enemies = []
        gameOver = false;
        animate(0);
    }


    const input = new InputHandler();
    const player = new Player(canvas.width,canvas.height);
    const background = new Background(canvas.width,canvas.height,0)
    let lastTime = 0;
    let enemyyTimer = 0;
    let enemyTimerInterval = 1000;
    let randomEnemyInterval = Math.random()*1000 +500

    function animate(timeStamp){
        const deltaTime = timeStamp -lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input,deltaTime, enemies);
        handleEnemies(deltaTime);
        displayStatusText(ctx);
        if (!gameOver)requestAnimationFrame(animate);
    }   
    animate(0);

    

})