// TODO: enemies only appear in first 2 top lines, why not on 3rd line?
// TODO: enemies appear on first column instead of outside of screen

// some globals
var PLAYER_START_X = 0;
var PLAYER_START_Y = 404;  
var PLAYER_WIDTH=78;
var PLAYER_HEIGHT=68;
var PLAYER_RIGHT_MOVE=101;
var PLAYER_LEFT_MOVE=101;
var PLAYER_UP_MOVE=83;
var PLAYER_DOWN_MOVE=83;
var ENEMY_WIDTH=78;
var TILE_HEIGHT=83;
// char_boy is aligned at 238 
// char_boy is 101x171 pic size
// rock is 101x83
// char_boy is 68x78
var RIGHT_BORDER=809;
var LEFT_BORDER=0;
var TOP_BORDER=83;
var DOWN_BORDER=415;
var FIRST_ROCKS_ROW_START=155;
var FIRST_ROCKS_COL_START=0;
var SECOND_ROCKS_ROW_START=238;
var SECOND_ROCKS_COL_START=0;
var THIRD_ROCKS_ROW_START=321;
var THIRD_ROCKS_COL_START=0;
var MAX_NUMBER_ENEMIES=5;
// scoring
var PLAYER_LIVES=1;
var PLAYER_POINTS=0;
// game engine control
var GAME_OVER = false;

// helpers
var random_generator = function (min,max) {
   return Math.floor( (Math.random() * max) + min);
}

// Enemies our player must avoid
// adding v for velocity
var Enemy = function(x,y,v) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
   this.x = x;
   this.y = y;
   this.v = v;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
    this.speed = 0;
    this.startLine = 0;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
   // You should multiply any movement by the dt parameter
   // which will ensure the game runs at the same speed for
   // all computers.
   // my note: enemies are generated at a random line of the 3 rockie tracks
   // they then launch to the right at random speed (within a range)
   // they are reset when they reach the right margin
   // my note: need to animate the enemies
   //console.log("inside update Enemy");
   // console.log(this.x);
   // console.log(RIGHT_BORDER-(ENEMY_WIDTH));
   if (!GAME_OVER) {
      if (this.x > RIGHT_BORDER) {
         // reset this entity
         this.x=ENEMY_WIDTH * -1;
         // random line
         var r;
         do {
            r = FIRST_ROCKS_ROW_START + (random_generator(0,2+1) * TILE_HEIGHT);
         } while (r===this.y);
         this.y = r;
         // random speed
         this.v = random_generator(1,6);
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
var Player = function(x,y) {
   this.sprite = 'images/char-cat-girl.png';
   this.x = x;
   this.y = y;
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// set the inception location for enemies to -1 * ENEMY_WIDTH
// so that it appears to come from an invisible area before the 
// left margin of the canvas
var player = new Player(PLAYER_START_X,PLAYER_START_Y);
var allEnemies = [];
// create the enemies
for (var i=0;i<MAX_NUMBER_ENEMIES; i++) {
   // pick a random line (1, 2 or 3)
   var r = random_generator (0,2+1);
   var v = random_generator(1,6);
   // console.log("random: " + r);
   var enemy = new Enemy(ENEMY_WIDTH * -1,FIRST_ROCKS_ROW_START+(r*83),v);
   allEnemies.push(enemy);
}

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
