/* 
----------------------------------------------
engine.js
udacity project nr. 3
Benedetto Lo Giudice
contains main 
--------------------------------------------------
*/

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

    // increased the size of the canvas
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    doc.body.appendChild(canvas);

    // start with no prize
    var prize=null;
    
    /* 
    ----------------------------------------------
    StartOrRestartGame
    performs a start or restart of the game
    --------------------------------------------------
    */
    var StartOrRestartGame = function() {
       // set the value of the button to "Restart Game"
       btn=doc.getElementById('game-button');
       if (btn === null) {
          console.log('button is null!');
       } else {
          btn.value='Restart Game!';
          // console.log("button is NOT null!");
       }
       // reset the player to new game
       player = new Player(PLAYER_START_X,
                         PLAYER_START_Y,
                         ENTITY_WIDTH,
                         ENTITY_HEIGHT);
       // reset the enemies
       allEnemies = [];
       // create the enemies
       for (var i=0;i<MAX_NUMBER_ENEMIES; i++) {
          // pick a random line (1, 2 or 3)
          var r = randomGenerator(0,2);
          var velocity = randomGenerator(1,5);
          // console.log("random: " + r);
          var enemy = new Enemy(ENTITY_WIDTH * -1, ENEMY_ROW_START+(r*83),velocity,ENTITY_WIDTH,ENTITY_HEIGHT);
          allEnemies.push(enemy);
       }
       STARTED = true;
       GAME_OVER = false;
       // timer=0;
       prize=null;
       doc.getElementById('timer').innerHTML = 'Prize coming soon!';
       doc.getElementById('timer').style.display = 'inline-block';
       init();
    };

    /* 
    ----------------------------------------------
    updateLivesAndScores
    updates ancillary info about the game in the HTML
    --------------------------------------------------
    */
    var updateLivesAndScores = function() {
       doc.getElementById('score').style.display = 'block';
       doc.getElementById('lives').style.display = 'block';
       doc.getElementById('score').innerHTML = 'Score: ' + player.score;
       doc.getElementById('lives').innerHTML = 'Lives: ' + player.lives;
    };

    /* 
    ----------------------------------------------
    collisionDetection
    detects collisions - or it should in theory..
    --------------------------------------------------
    */
    var collisionDetection = function(object1,object2) {
       // detect if the 2 object collide using the axis-aligned bounding box
       if (object1.x < object2.x + (object2.width/2) &&
          object1.x + object1.width > object2.x &&
          object1.y < object2.y + (object2.height/COLLISION_DIVIDER) &&
          (object1.height/COLLISION_DIVIDER) + object1.y > object2.y) 
       {
          return true;
       } else {
          return false;
       }
    };

    /* 
    ----------------------------------------------
    gameOver
    set variable to Game Over
    --------------------------------------------------
    */
    function gameOver() {
       GAME_OVER=true;
       STARTED=false;
    };

    /* 
    ----------------------------------------------
    resetPlayerPosition
    reset the player back to its starting point
    --------------------------------------------------
    */
    function resetPlayerPosition() {
       player.x=PLAYER_START_X;
       player.y=PLAYER_START_Y;
    };

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */

    /* 
    ----------------------------------------------
    main
    udacity provided main function within the engine
    --------------------------------------------------
    */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
       // if the game has not started or if it is over, do nothing
       if (!STARTED || GAME_OVER) {
          return;
       }
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
      // reset();
      lastTime = Date.now();
      main();
    };


    /* 
    ----------------------------------------------
    doPrize
    main engine for the prizes
    if a prize does not exists, it creates one
    using random values for location and life
    if a prize exists, it checks if the lifetime of the
    prize has elapsed, in which case it must be destroyed.
    --------------------------------------------------
    */
    function doPrize() {
       if (prize) {
          var seconds = new Date().getTime() / 1000;
          var diff = seconds - prize.starttime;
          var countdown = prize.lifetime - diff;
          doc.getElementById('timer').innerHTML = 'Prize Count Down: ' + countdown.toFixed(0);
          if (countdown <= 0) {
             // because the counter could go negative
             doc.getElementById('timer').innerHTML = 'Sorry you missed that!';
             // destroy the prize
             prize = null;
          }
       } else {
          // trying to be extra random: this represent the 
          // interval between prizes
          var r1 = randomGenerator(1,150);
          var r2 = randomGenerator(1,150);
          if (r1+r2 === 150 ) {
             var row = randomGenerator(1,8);
             var col = randomGenerator(2,4);
             var x = randomGenerator(0,7);
             prize = new Prize(TILE_WIDTH*x+10,
                      TILE_HEIGHT*col-10,
                      'images/Star.png',
                      PRIZE_WIDTH,PRIZE_HEIGHT);
             r = randomGenerator(6,18);
             // console.log(r);
             prize.starttime = new Date().getTime() / 1000;
             prize.lifetime = r;
          }
       }
    };

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
       // if the game is over or not started only, otherwise do nothing
       if (!GAME_OVER && STARTED) {
          doPrize();
          updateEntities(dt);
          checkCollisions();
          if (prize) {
             checkPrizeCollections();
          }
       }
    };

    /* 
    ----------------------------------------------
    checkPrizeCollections
    checks if the Player has collected a prize
    --------------------------------------------------
    */
    function checkPrizeCollections() {
       var t = collisionDetection(prize,player);
       if (t === true) {
          prize=null;
          player.score++;
          doc.getElementById('timer').innerHTML = 'Well done!';
       }
    };

    /* 
    ----------------------------------------------
    checkCollisions
    check for collisions between player and enemies
    using an exception to stop the forEach loop
    the break statement is not available in this case
    --------------------------------------------------
    */
    function checkCollisions() {
       if (typeof StopIteration == 'undefined') {
        StopIteration = new Error('StopIteration');
       }
       try
       {
          allEnemies.forEach(function(enemy) {
            if (collisionDetection(enemy,player)) {
                resetPlayerPosition();
                player.lives--;
                if (player.lives===0) {
                   updateLivesAndScores();
                   gameOver();
                   throw StopIteration;
                }
            };
          });
       } 
       catch(error) { if (error != StopIteration) throw error; }
    };

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
       if (! GAME_OVER && STARTED) {
          allEnemies.forEach(function(enemy) {
              enemy.update(dt);
          });
       }
    };

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
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
            numRows = NROWS,
            numCols = NCOLS,
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
        if (GAME_OVER) {
           ctx.fillStyle = 'blue';
           ctx.font = 'bold 48pt Arial';
           var msg='Game Over!';
           var textWidth=ctx.measureText(msg).width;
           // to keep the text centered horizontally and vertically
           ctx.fillText(msg, (canvas.width - textWidth)/2, ((canvas.height-48)/2)+48);
        } else { 
           if (STARTED) {
              renderEntities();
              // display scores and lives
              updateLivesAndScores();
           }
        }
        var img = new Image();
        img.src = player.sprite;
    };

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
       if (!STARTED) {
          return;
       }
       /* Loop through all of the objects within the allEnemies array and call
        * the render function you have defined.
        */
       // if (timer>0) {
       if (prize) {
          prize.render();
       }
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
    };

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
    };

    /* 
    ----------------------------------------------
    main code in the egine.js
    this is always executed
    --------------------------------------------------
    */
    // draw the the start button if necessary
    if (GAME_OVER || ! STARTED) {
       var btn = doc.createElement('input');
       btn.type = 'button';
       btn.value = 'Start Game';
       btn.id = 'game-button';
       btn.className='btn btn-default';
       btn.onclick = StartOrRestartGame;
       doc.getElementById('startgame').appendChild(btn);
       doc.getElementById('startgame').style.display = 'block';
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
