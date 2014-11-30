/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    // canvas.width = 505;
    // canvas.height = 606;
    // increased the size of the canvas
    canvas.width = 809;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    // a timer for prizes
    var timer=0;
    var prize;

    /* new collision detection function */
    
    var collisionDetection = function(object1,object2) {
       // console.log("obj1: (" + object1.x + "," + object1.y + "," + object1.width + ")" );
       // console.log("obj2: (" + object2.x + "," + object2.y + "," + object2.width + ")" );
       // return false;
       // my own bounding box collision detection
       if (object2.x >= object1.x && object2.x <= (object1.x + object1.width) &&
            object2.y >= object1.y && object2.y <= (object1.y + object1.height))
       {
          //console.log(object1 + " collides with " + object2);
          return true;
       } else {
          // console.log(object1 + " DOES NOT collides with " + object2);
          return false;
       }
    }

    // this function checks if the sprite of 2 objects are overlapping in the 
    // canvas and returns True or False
    // in input 2 objects plus the width of obj2 as size reference
    var imagesOverlap = function (obj1,obj2) {
       //console.log("ob")
       var distance=5;
       // if ( (obj1.x >= player.x - ( obj2Width - distance) &&
       // ( (if left margin of obj1 is within width of obj2) or 
       if ( (obj1.x+obj1.width >= obj2.x + 5 && 
            obj1.x+obj1.width <= obj2.x+obj2.width) &&
            (obj1.y === obj2.y)) 
       {
          console.log("CLASH at y: " + player.y);
          return true;
       };
       return false;
    }

    // game over
    function gameOver() {
       GAME_OVER=true;
       console.log("inside gameOver: " + ctx);
       // write GameOVer
    }

    // reset the player to starting point
    function resetPlayer() {
       player.x=PLAYER_START_X;
       player.y=PLAYER_START_Y;
    }
    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;
        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }
    
    // manage prizes
    function createPrize() {
       // is a prize already active?
       if (timer>0) {
          timer--; 
          if (timer === 0) {
             // timeout, retire prize
             console.log("deleting the prize");
             prize={};
          }
       } else {
          // throw a dice and show a prize for a period of time
          // if it's a 6 and no prize exists, go ahead
          var r = randomGenerator(1,100);
          if (r === 6 ) {
             //console.log("crea prize");
             // TODO: need random coordinates and random type
              // 'images/gemblue.png',
              // 'images/gemgreen.png',
              // 'images/gemorange.png'
             var row = randomGenerator(1,8);
             // canvas is: 
             // var tile_height = CANVAS_HEIGHT / 6;
             // console.log("tile_height calcolata: " + tile_height);
             // console.log("tile height constant: " + TILE_HEIGHT);
             var n = randomGenerator(2,4);
             console.log("n: " + n + "(should be 2-4)");
             var x = randomGenerator(0,7);
             console.log("star: x: "+TILE_WIDTH*x+" y:"+TILE_HEIGHT*n);
             prize=new Prize(TILE_WIDTH*x+10,TILE_HEIGHT*n-10,'images/Star.png',PRIZE_WIDTH,PRIZE_HEIGHT);
             timer = randomGenerator(150,700);
             console.log("timer: " + timer);
          }
       }
    }
    
    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
       if (!GAME_OVER) {
          createPrize();
          updateEntities(dt);
          checkCollisions();
          if (timer>0) {
             checkPrizeCollections();
          }
       }
    }
    
    // checks if the Player has collected a prize
    function checkPrizeCollections() {
       //console.log("checking prize collections");
       // console.log("player.x: " + player.x + " player.y: " + player.y);
       // console.log("prize.x: " + prize.x + " prize.y: " + prize.y);
       var t = collisionDetection(player,prize);
       if (t === true) {
          timer=0;
          PLAYER_POINTS++;
          console.log("points: " + PLAYER_POINTS);
          
       }
       
    }
    
    /* check for collisions between player and enemies*/
    function checkCollisions() {
       // using an exception to stop the forEach loop
       // the break statement is not available in this case
       if(typeof StopIteration == "undefined") {
        StopIteration = new Error("StopIteration");
       }
       try 
       {
          allEnemies.forEach(function(enemy) {
            if (collisionDetection(enemy,player)) {
                resetPlayer();
                PLAYER_LIVES--;
                if (PLAYER_LIVES===0) {
                   gameOver();
                   throw StopIteration;
                }
            };
          });
       } 
       catch(error) { if (error != StopIteration) throw error; }
       // console.log("outside forEach");
       // return;
    }
    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    
    // this is the "heart" of the game
    function updateEntities(dt) {
       //console.log("inside updateEntities");
       if (! GAME_OVER) {
          allEnemies.forEach(function(enemy) {
              enemy.update(dt);
          });
          player.update();
          if (timer>0) { 
             prize.update();
          }
       }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    // adding the gameover text
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 8,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        // TODO: add here the health bar for player
        
        
        renderEntities();
        if (GAME_OVER) {
           ctx.fillStyle = "blue";
           ctx.font = "bold 48pt Arial";
           var msg="Game Over!";
           var t=ctx.measureText(msg).width;
           //console.log(t);
           ctx.fillText(msg, (canvas.width - t)/2, ((canvas.height-48)/2)+48);
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
       if (timer>0) {
          prize.render();
       }
        allEnemies.forEach(function(enemy) {
            // console.log("rendering enemy");
            enemy.render();
        });
        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
       // noop
       PLAYER_POINTS=0;
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/gemblue.png',
        'images/gemgreen.png',
        'images/gemorange.png',
        'images/Key.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
