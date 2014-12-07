// TODO: in engine.js, at line 190, add a health bar for player
//       fill it in red as the player loses lives. it must be in proportion
//       to the length of the bar and to the total number of lives
//       position it to cover the bottom part of the grass tiles at the bottom
//       width / total number of lives -> unit of the bar
//       initially the bar is green. every time a live is lost, one unit becomes red
//
// TODO: the game could consist in having to get to the top grass line to fetch something and 
//       then bring it back to the bottom grass line.
//       it could be just any object, but it could also be letters, randomly posted, to make real words
//       words would have to be validated against an authority, say cambridge or wm
// TODO: at game over, do NOT reset the player, leave it where it "died"
// TODO: the "feature" of a random sprite could be 'inherent' to the Prize class
//       bring the random choice of sprite inside the Prize object
// TODO: search for any hardcoded value and remove it

// some globals
// grid
var NROWS = 6;
var NCOLS = 8;
// canvas size
var CANVAS_WIDTH = 809;
var CANVAS_HEIGHT = 606;
// player
var PLAYER_START_X = 0;
var PLAYER_START_Y = 404;  
var PLAYER_WIDTH=78;
var PLAYER_HEIGHT=68;
var PLAYER_RIGHT_MOVE=101;
var PLAYER_LEFT_MOVE=101;
var PLAYER_UP_MOVE=83;
var PLAYER_DOWN_MOVE=83;
// player lives and scoring
var PLAYER_LIVES=5;

// TODO: delete following
// var PLAYER_POINTS=0;

// enemy
var ENEMY_WIDTH=78;
var ENEMY_HEIGHT=68;
var MAX_NUMBER_ENEMIES=5;
// tiles
var TILE_HEIGHT=83;
var TILE_WIDTH=99;
// char_boy is aligned at 238 
// char_boy is 101x171 pic size
// rock is 101x83
// char_boy is 68x78
var RIGHT_BORDER = 809;
var LEFT_BORDER = 0;
var TOP_BORDER = 83;
var DOWN_BORDER = 415;
var ENEMY_ROW_START = 155;
var FIRST_ROCKS_COL_START = 0;
var SECOND_ROCKS_ROW_START = 238;
var SECOND_ROCKS_COL_START = 0;
var THIRD_ROCKS_ROW_START = 321;
var THIRD_ROCKS_COL_START = 0;
// game engine control
var GAME_OVER = false;
var STARTED = false;
// prizes
var PRIZE_WIDTH = 73;
var PRIZE_HEIGHT = 68;

// helpers
// add 1 to cover the whole range min, max
var randomGenerator = function (min,max) {
   var realMax=max+1;
   var n = Math.floor(Math.random() * (realMax - min)) + min;
   // console.log("min: " + min + " max: " + max + " n: " + n);
   if (n<min || n>max) {
      console.log("ANOMALY! min: " + min + " max: " + max + " n: " + n);
   }
   return n;
}

// Enemies our player must avoid
// adding v for velocity
// adding w for width and h for height
var Enemy = function(x,y,v,w,h) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
   this.x = x;
   this.y = y;
   this.v = v;
   this.width = w;
   this.height=h;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    this.startLine = 0;
    // velocity increase multiplier
    this.velocityIncrease = 1;
    this.velocityCapping = 15;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
   // You should multiply any movement by the dt parameter
   // which will ensure the game runs at the same speed for
   // all computers.
   // my note: enemies are generated at a random line, with a 
   // random speed (within a range), moving from left to right.
   // they are reset when they reach the right margin
   // the speed increases by 2% at every update
   if (!GAME_OVER) {
      if (this.x > RIGHT_BORDER) {
         // reset this entity
         this.x=this.width * -1;
         // random line
         var r;
         do {
            r = ENEMY_ROW_START + (randomGenerator(0,2) * TILE_HEIGHT);
         } while (r===this.y);
         this.y = r;
         // random speed
         this.v = randomGenerator(1,5);
         if (this.velocityIncrease * this.v < this.velocityCapping) {
            this.v = this.v * this.velocityIncrease;
            this.velocityIncrease = this.velocityIncrease * 1.02;
            // console.log('[+] velocity: ' + this.v);
         }
         // go!
      } else {
         this.x+=101*dt*this.v;
      }
   }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// adding h for height
var Player = function(x,y,w,h) {
   this.sprite = 'images/char-cat-girl.png';
   this.x = x;
   this.y = y;
   this.width=w
   this.height=h;
   this.lives=PLAYER_LIVES;
   this.score=0;
   this.halfWidth=this.w/2;
   var ratio=this.width/this.height;
   this.halfHeight=this.width/(2*ratio);
}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// handle keyboard events
Player.prototype.handleInput = function(key) {
   if (GAME_OVER) { return; }
   switch(key) {
      // move right but prevent the character to go outside the right margin
      case "right":
         // console.log("RIGHT_BORDER: " + RIGHT_BORDER + " x+halfplayer: " + (this.x+PLAYER_WIDTH/2) + " rightborder - half width of the player: " + (RIGHT_BORDER-(PLAYER_WIDTH/2)));
         if (this.x+PLAYER_RIGHT_MOVE>RIGHT_BORDER-(PLAYER_RIGHT_MOVE/2)) {
            //alert("can't go any further right")
         } else {
            this.x+=PLAYER_RIGHT_MOVE;
         }
         break;
      // move left but prevent the sprite to go beyond the left margin
      case "left":
         // console.log("LEFT_BORDER: " + LEFT_BORDER + " x+halfplayer: " + (this.x+PLAYER_WIDTH/2));
         if (this.x-PLAYER_LEFT_MOVE/2<LEFT_BORDER) {
            // alert("can't go any further left");
         } else {
            this.x-=PLAYER_LEFT_MOVE;
         }
         break;
      // go up, not into the water!
      case "up":
         // console.log("TOP: " + TOP_BORDER + " y: " + this.y);
         if (this.y<TOP_BORDER) {
            // alert("can't go any further top");
         } else {
            this.y-=PLAYER_UP_MOVE;
         }
         break;
      // move down but not below the canvas
      case "down":
         // console.log("DOWN: " + DOWN_BORDER + " y: " + this.y);
         if (this.y+PLAYER_DOWN_MOVE>DOWN_BORDER) {
            // alert("can't go any further down");
         } else {
            this.y+=PLAYER_DOWN_MOVE;
         }
         break;
   }
}

/* 
 add another class for the prizes
 a prize attributes are:
 location (x,y)
 sprite (it should be generated randomly)
 adding h for height
*/
var Prize = function(x,y,spriteName,w,h) {
   this.x = x;
   this.y = y;
   this.sprite = spriteName;
   this.width = w;
   this.height=h;
   this.starttime=0;
   this.lifetime=0;
}

/*
TODO: do we need this ?
 what is update for a Prize? Not clear yet
*/
Prize.prototype.update = function() {
   //console.log("update prize");
}

Prize.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// set the inception location for enemies to -1 * ENEMY_WIDTH
// so that it appears to come from an invisible area before the 
// left margin of the canvas
var player = new Player(PLAYER_START_X,PLAYER_START_Y,PLAYER_WIDTH,PLAYER_HEIGHT);
var allEnemies = [];
// create the enemies
for (var i=0;i<MAX_NUMBER_ENEMIES; i++) {
   // pick a random line (1, 2 or 3)
   var r = randomGenerator(0,2);
   var velocity = randomGenerator(1,5);
   // console.log("random: " + r);
   var enemy = new Enemy(ENEMY_WIDTH * -1,ENEMY_ROW_START+(r*83),velocity,ENEMY_WIDTH,ENEMY_HEIGHT);
   allEnemies.push(enemy);
}

// prizes are not created here but later on, see engine.js

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
