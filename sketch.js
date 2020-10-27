var spaceShip,spaceShipImg;
var enemyIMG1,enemyIMG2,enemyIMG3;
var lazerGroup,enemyGroup;
var gameState,gameOver,backgroundIMG;
var count = 0,vader,win,score;
var star_destroyer,star_lazer;
var playerHealth = 4,counter = 0,counter2 = 0,star_destroyerHealth = 20;

var lazerImg,enemyLazer;
var b2,iSound;

function preload(){
  spaceShipImg = loadImage("images/X-wing.png");
  enemyIMG1 = loadImage("images/Tie-fighter.png");
  enemyIMG2 = loadImage("images/Tie-Fighter2.png");
  enemyIMG3 = loadImage("images/enemyer.png");
  gameOver = loadImage("images/real.png");
  backgroundIMG = loadImage("images/back.png");
  vader = loadImage("images/starDestroyer.png");
  win = loadImage("images/win.jpg");

  lazerImg = loadImage("images/lazer2.png");
  enemyLazer = loadImage("images/lazer.png")
  b2 = loadImage("images/conceptArt2.jpg");

}

function setup() {
  createCanvas(displayWidth,displayHeight);
  spaceShip = createSprite(displayWidth/2, displayHeight-100, 50, 50);
  spaceShip.addImage(spaceShipImg);
  spaceShip.scale = 0.4;

  lazerGroup = new Group();
  enemyGroup = new Group();
  star_lazer = new Group();

  gameState = "instruction";

  star_destroyer = createSprite(displayWidth/2,-100,50,50);
  star_destroyer.addImage(vader);
  star_destroyer.scale = 1;
  star_destroyer.visible = false;

}

function draw() {
  background(0);  

  if(gameState === "instruction"){
    background(b2);
    text1();
    spaceShip.visible = false;
    //PlaySound("sounds/MainTheme.mp3");
   // iSound.play();
  }

  if(gameState === "end"){
    background(gameOver);
  }

  if(gameState === "win"){
    background(win);
  }

  if(gameState === "boss_fight"){
   star_destroyer.visible = true;
   spaceShip.scale = 0.2;
   destroyer();
  }

  if(gameState === "play"){
    background(backgroundIMG);
    
    spaceShip.visible = true;
    spaceShip.x = mouseX;
    if(keyWentDown("space")){
      spawnLazers();
    }
    if(lazerGroup.isTouching(enemyGroup)){
      //console.log("destroyed");
      checkenemy(enemyGroup);
      count++;
    }
    if(count === Math.round(random(20,50))){
      gameState = "boss_fight";
      enemyGroup.destroyEach();
    }
    spawnEnemy();
    if(enemyGroup.isTouching(spaceShip)){
      gameState = "end";
      enemyGroup.destroyEach();
      spaceShip.destroy();
    }
  }

  drawSprites();
}

function vaderLazer(){
  if(frameCount % 40 === 0){
   // console.log("lazer has been spawned");
    var saber = createSprite(100,100,10,10);
    saber.addImage(enemyLazer);
    saber.scale = 0.3;
    saber.x = Math.round(random(displayWidth/2-50,displayWidth/2+100));
    saber.y = star_destroyer.y;
    saber.shapeColor = "green";
    saber.velocityY = 20;
    saber.lifetime = 200;
    star_lazer.add(saber);
  }
}

function spawnEnemy(){
  r1 = Math.round(random(10,displayWidth-100));
  r2 = Math.round(random(1,3))
  
  if(frameCount % 60 === 0){
    var enemy = createSprite(r1,100,100,100);
    enemyGroup.add(enemy);
    enemy.velocityY = 2 + Math.round(frameCount/1000);
   //console.log(enemy.velocityY);
    enemy.scale = 0.4;
    enemy.lifetime = 200;
    if(r2 === 1){
      enemy.addImage(enemyIMG1);
    }else if(r2 === 2){
      enemy.addImage(enemyIMG2);
    }else if(r2 === 3){
      enemy.addImage(enemyIMG3);
    }
  }
}
function destroyer(){
  background(0);
  vaderLazer();

  star_destroyer.velocityY = 0.5;
  spaceShip.x = mouseX;

  if(keyDown("space")){
    spawnLazers();
  }

  if(star_lazer.isTouching(spaceShip)){
    counter++;
    //console.log(counter);
    //console.log("///")
    if(counter === 5){
      playerHealth--;
      counter = 0;
     // console.log(playerHealth);
     // console.log(counter);
      if(playerHealth === 0){
        gameState = "end";
        spaceShip.visible = false;
        star_destroyer.destroy();
      }
    }
  }

  if(lazerGroup.isTouching(star_destroyer)){
    counter2++;
    //lazerGroup.destroyEach();
    if(counter2 === 20){
      star_destroyerHealth--;
      counter2 =0;
    }
    if(star_destroyerHealth === 0){
      gameState = "win";
      spaceShip.destroy();
      star_destroyer.destroy();
      alert("You Win.. mission complete")
    }
  }
}

function spawnLazers(){
  var lazer = createSprite(mouseX,displayHeight-100,5,10);
  lazer.addImage(lazerImg);
  lazer.scale = 0.2;
  lazerGroup.add(lazer);
  lazer.shapeColor = "red";
  lazer.velocityY = -20;
  lazer.lifetime = 200;
}

function text1(){
  fill("orange");
  textSize(35);
  text("STAR WARS",400,50);
  text("war to apocalypse",360,100)
  fill("cyan");
  textSize(25);
  text("message from general kenobi",340,150);
  text("Anakin,your mission is to destroy the last sith star-destroyer.",180,200);
  text("But be careful. Because the star-destroyer is not alone this time.",160,230);
  text("Troops of 66'th order report that they are having a large army of tie fighters.",110,260);
  text("This mission is very important",340,290);
  text("to stop the WAR",400,320);
  
  text("May the force be with you son",330,370);

  fill("gold")
  text("<use mouse to control your ship>",310,440);
  text("<use space key to fire lazer>",335,470);
  text("<destroy the star-destroyer to complete mission>",240,500);

  fill("yellow");
  text("press space to continue....",5,600);
 
  if(keyWentDown("space")){
    gameState = "play";
   // console.log("yes..")
  }
}

function checkenemy(bal){ 
  for(var i = 0;i<bal.size();i=i+1){
    if (lazerGroup.isTouching(bal[i])){ 
      bal[i].destroy(); 
      lazerGroup.destroyEach(); 
     // score = score + 2;
     }
   }
}
