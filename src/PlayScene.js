/**
 * Created by shirkan on 11/17/14.
 */

var PlayScene = cc.Scene.extend({
    space:null,
    bodiesToRemove:[],
    statusLayer:null,
    gameLayer:null,
    backgroundLayer:null,
    points:0,
    clearAllObjectsFlag:false,

    ctor: function() {
        this._super();

        //  Init physics matters
        this.initPhysics();

        //  Add three layer in the right order
        this.gameLayer = (new GameLayer(this.space));
        this.backgroundLayer = new BackgroundLayer();
        this.statusLayer = new StatusLayer();

        this.addChild(this.backgroundLayer, 0, TagOfLayer.Background);
        this.addChild(this.gameLayer, 0, TagOfLayer.Game);
        this.addChild(this.statusLayer, 0, TagOfLayer.Status);

        //  Touch handler
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded}, this);

        //  Setup back button to get back to main menu
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode, event){
                if(keyCode == cc.KEY.back || keyCode == cc.KEY.backspace)
                {
                    event.getCurrentTarget().endGame( false, true);
                }
            }
        }, this);
    },

    initPhysics:function() {
        this.space = new cp.Space();

        this.space.addCollisionHandler(SpriteTag.Bullet, SpriteTag.Enemy,
            this.collisionBulletEnemy.bind(this), null, null, null);
        this.space.addCollisionHandler(SpriteTag.Enemy, SpriteTag.Player,
            this.collisionEnemyPlayer.bind(this), null, null, null);
        this.space.addCollisionHandler(SpriteTag.Bullet, SpriteTag.EnemyHead,
            this.collisionBulletEnemyHead.bind(this), null, null, null);
    },

    onEnter:function () {
        this._super();

        //  Game setup
            //  Game beginning initialization, occurs only on level 1
            if (PiuPiuGlobals.currentLevel == 1) {
                PiuPiuGlobals.livesLeft = 0;

                //  Add lives for start
                for (var i=0; i<PiuPiuConsts.livesOnGameStart; i++) {
                    this.addLife();
                }
                playSound(res.sound_ohedNichnasLamigrash);
            } else {
                var livesLeft = PiuPiuGlobals.livesLeft;
                PiuPiuGlobals.livesLeft = 0;
                for (var i=0; i<livesLeft; i++) {
                    this.addLife();
                }
            }
        PiuPiuGlobals.gameState = GameStates.Playing;

        //  Run level, wait 1 second before actually starting the level
        //console.log("command line: this.schedule(this.spawnEnemy, "+ PiuPiuLevelSettings.enemiesSpawnInterval+", "+(PiuPiuLevelSettings.totalEnemiesToKill - 1)+", 1);");
        //this.schedule(this.spawnEnemy, PiuPiuLevelSettings.enemiesSpawnInterval, -1, 1);
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.spawnEnemy, PiuPiuLevelSettings.enemiesSpawnInterval, cc.REPEAT_FOREVER, 1);

        //  Update space
        this.scheduleUpdate();
    },

    //  Gameplay handling
    spawnEnemy : function () {
        if (PiuPiuGlobals.gameState != GameStates.Playing) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.spawnEnemy);
            //this.unschedule(this.spawnEnemy);
            return;
        }

        this.gameLayer.addEnemy();

        //  Check if need to spawn more enemies
        PiuPiuLevelSettings.totalEnemiesToSpawn--;
        if (PiuPiuLevelSettings.totalEnemiesToSpawn == 0) {
            //this.unschedule(this.spawnEnemy);
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.spawnEnemy);
            return;
        }
    },

    addLife : function () {
        PiuPiuGlobals.livesLeft++;
        this.statusLayer.addLife();
    },

    removeLife : function () {
        this.statusLayer.removeLife();

        PiuPiuGlobals.livesLeft--;
        if (PiuPiuGlobals.livesLeft == 0) {
            this.endGame( true, false);
        }
    },

    checkLevelComplete : function () {
        if (PiuPiuLevelSettings.totalEnemiesToSpawn == 0 &&
            PiuPiuLevelSettings.enemiesVanished == PiuPiuLevelSettings.totalEnemiesToKill) {
            PiuPiuGlobals.gameState = GameStates.LevelCompleted;
            this.statusLayer.showLevelCompleted();
        }
    },

    endGame : function ( showGameOverBanner, transitToMainMenu) {
        //  Set flag to remove all objects on next step
        this.clearAllObjectsFlag = true;

        //  Change game state
        PiuPiuGlobals.gameState = GameStates.GameOver;

        //  Show game over banner
        if (showGameOverBanner) {
            this.statusLayer.showGameOver();
        }

        this.updateHighScore();
        updateStats();

        if (transitToMainMenu) {
            var transition = new cc.TransitionFade(1, new MenuScene());
            cc.director.runScene(transition);
        }
    },

    updateHighScore : function() {
        if (this.points > PiuPiuGlobals.highScore) {
            cc.sys.localStorage.highScore = PiuPiuGlobals.highScore = this.points;
        }
    },

    //  Touch handling
    onTouchBegan: function (touch, event) {
        //  If game over state, return to menu
        if (PiuPiuGlobals.gameState == GameStates.GameOver) {
            var transition = new cc.TransitionFade(1, new MenuScene());
            cc.director.runScene(transition);
            return true;
        }

        //  If level completed, continue to cut scene of next level
        if (PiuPiuGlobals.gameState == GameStates.LevelCompleted) {
            PiuPiuGlobals.currentLevel++;

            //  Hide level completed label from previous level
            event.getCurrentTarget().statusLayer.hideLevelCompleted();

            var transition = new cc.TransitionFade(1, new LevelCutScene());
            cc.director.pushScene(transition);
            return true;
        }

        var pos = touch.getLocation();
        var playScene = event.getCurrentTarget();

        //  Angle limits - goes crazy beyond these angles
        if (pos.x < PiuPiuConsts.handsAnchor.x) {
            return false;
        }

        var data = calculateTrigonometry(pos);

        playScene.gameLayer.addBullet(data);
        PiuPiuGlobals.totalBulletsFired++;
        return true;
    },

    onTouchMoved: function (touch, event) {
    },

    onTouchEnded: function (touch, event) {
    },

    //  Collisions handling
    collisionBulletEnemy: function (arbiter, space) {

        var shapes = arbiter.getShapes();

        //  Bug fix: sometimes the bullet already touched the head and we still get here
        for (var i = 0; i < this.bodiesToRemove.length; i++) {
            if (this.bodiesToRemove[i] == shapes[0].body ||
                this.bodiesToRemove[i] == shapes[1].body ) {
                return;
            }
        }

        this.bodiesToRemove.push(shapes[0].body, shapes[1].body);

        this.points += PiuPiuConsts.pointsPerEnemyKill;
        this.statusLayer.updatePoints(this.points);

        //  Update level settings
        PiuPiuLevelSettings.enemiesVanished++;

        //  Update stats
        PiuPiuGlobals.totalPoints += PiuPiuConsts.pointsPerEnemyKill;
        PiuPiuGlobals.totalEnemyKilled++;

        this.checkLevelComplete();
    },

    collisionBulletEnemyHead: function (arbiter, space) {

        this.points += PiuPiuConsts.pointsPerEnemyHeadShot;
        this.statusLayer.updatePoints(this.points);
        this.statusLayer.displayHeadShot();

        var shapes = arbiter.getShapes();
        this.bodiesToRemove.push(shapes[0].body, shapes[1].body);

        //  Update level settings
        PiuPiuLevelSettings.enemiesVanished++;

        //  Update stats
        PiuPiuGlobals.totalPoints += PiuPiuConsts.pointsPerEnemyHeadShot;
        PiuPiuGlobals.totalEnemyKilled++;
        PiuPiuGlobals.totalHeadShots++;

        this.checkLevelComplete();
    },

    collisionEnemyPlayer: function (arbiter, space) {

        var shapes = arbiter.getShapes();
        //  shapes[1] is Zehavi
        this.bodiesToRemove.push(shapes[0].body);

        this.removeLife();

        PiuPiuLevelSettings.enemiesVanished++;
        this.checkLevelComplete();
    },

    update: function (dt) {

        if (this.clearAllObjectsFlag) {
            this.gameLayer.removeAllObjects();

            //  Stop updating mechanism
            this.unscheduleUpdate();
            this.unschedule(this.spawnEnemy);

            return;
        }

        this.space.step(dt);

        // Simulation cpSpaceAddPostStepCallback
        for(var i = 0; i < this.bodiesToRemove.length; i++) {
            var shape = this.bodiesToRemove[i];
            this.gameLayer.removeObjectByBody(shape);
        }
        this.bodiesToRemove = [];
    }
});