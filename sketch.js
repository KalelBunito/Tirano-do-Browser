 var PLAY = 1
 var END = 0
 var gameState = PLAY

 var trex, trex_running, trex_collided;
 var ground, groundImage, edges;
 var invisibleGround
 var cloud, cloudsGroup, cloudImage
 var obstacleGroup, obstacle1, obstacle2, obstacle3,  obstacle4, obstacle5, obstacle6

 var gameOver, gameOverImg, restart, restartImg
 var checkPointSound, dieSound, jumpSound
 var score

 function preload(){
 trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png")
 groundImage = loadImage("ground2.png")

 cloudImage = loadImage("cloud.png")
 obstacle1 = loadImage("obstacle1.png")
 obstacle2 = loadImage("obstacle2.png")
 obstacle3 = loadImage("obstacle3.png")
 obstacle4 = loadImage("obstacle4.png")
 obstacle5 = loadImage("obstacle5.png")
 obstacle6 = loadImage("obstacle6.png")
 trex_collided = loadAnimation("trex_collided.png")

 restartImg = loadImage("restart.png")
 gameOverImg = loadImage("gameOver.png")
 checkPointSound = loadSound("checkPoint.mp3")
 jumpSound = loadSound("jump.mp3")
 dieSound = loadSound("die.mp3")
}

function setup(){
 createCanvas(windowWidth, windowHeight);
  score = 0
  trex = createSprite(70, height-50, 20, 50)
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.75;
  trex.x = 50;

  ground = createSprite(width/2, height-20, width, 125)
 ground.addImage("ground", groundImage)
 ground.velocityX = -4
 ground.x = ground.width /2

 obstacleGroup = createGroup()
 cloudsGroup = createGroup()

 invisibleGround = createSprite(width/2, height-10, width, 125)
  invisibleGround.visible = false;
  var rand = Math.round(random(10, 60))
  console.log(rand)
 edges = createEdgeSprites();

 gameOver = createSprite(width/2, height/2 - 50)
 gameOver.addImage(gameOverImg)
 gameOver.scale = 0.75

 restart = createSprite(width/2, height/2)
 restart.addImage(restartImg)
 restart.scale = 0.75
 
 

}
 function draw(){
  background(180);
  //exibindo pontuacãO
  fill('yellow')
  textSize(20)
  text("Score: " + score, 400, 50)
  if(gameState === PLAY){
    score += Math.round(getFrameRate()/60)
    //mover o solo
    ground.velocityX = -( 6 + score/500)
    gameOver.visible = false
    restart.visible = false
    if(score > 0  && score % 200 === 0){
      checkPointSound.play()
    }
        if (ground.x < 0){
      ground.x = ground.width/2;

    }
    
    //pular quando a tecla de espaço for pressionada
    if(touches.lenght> 0 || keyDown("space")&& trex.y >= height-100) {
        trex.velocityY = -14;
        jumpSound.play()
        touches = []
    }
    
    //adicione gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gere as nuvens
    spawnClouds();
  
    //gere obstáculos no solo
    spawnObstacles();
    
    if(obstacleGroup.isTouching(trex)){
        gameState = END;
        dieSound.play()
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     gameOver.visible = true
     restart.visible = true
     obstacleGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);

     obstacleGroup.setLifetimeEach(-1)
     cloudsGroup.setLifetimeEach(-1)
     
     trex.changeAnimation("collided", trex_collided);
     trex.velocityY = 0
     if(touches.lenght> 0 || keyDown("SPACE")){
        reset() 
        touches = []
     }
   }
  //impedir que o trex caia
  trex.collide(ground);
  
  drawSprites();
 }
   function reset(){
    gameState = PLAY
    gameOver.visible = false
    restart.visible = false
    trex.changeAnimation("running", trex_running)
    obstacleGroup.destroyEach()
    cloudsGroup.destroyEach()
    score = 0
} 

  function spawnClouds(){
    if(frameCount % 60 === 0){
        cloud = createSprite(width+20, height-300, 40, 10)
        cloud.addImage(cloudImage)
        cloud.y = Math.round(random(30,300))
        cloud.scale = 1
        cloud.velocityX = -3
        cloud.lifetime = 1000
        cloud.depth = trex.depth
        trex.depth = trex.depth + 1
        cloudsGroup.add(cloud)
    }
  } 

  function spawnObstacles(){
  if(frameCount % 60 === 0){
     var obstacle = createSprite(width-10, height-40, 20, 300)
     obstacle.velocityX = -( 6 + score/500)
     obstacle.scale = 0.65
     obstacle.lifetime = 300
     var rand = Math.round(random(1,6))
     
     switch(rand){
        case 1: obstacle.addImage(obstacle1)
          break
        case 2: obstacle.addImage(obstacle2)
          break
        case 3: obstacle.addImage(obstacle3)
          break
        case 4: obstacle.addImage(obstacle4)
          break
        case 5: obstacle.addImage(obstacle5)
          break
        case 6: obstacle.addImage(obstacle6)
          break
        default: break
     }
     obstacleGroup.add(obstacle)
   }
  }
  function windowResized(){
    resizeCanvas(windowWidth, windowHeight)
  }






