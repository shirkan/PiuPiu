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

        //  Game setup
        PiuPiuGlobals.livesLeft = 0;

        //  Add lives for start
        for (var i=0; i<PiuPiuConsts.livesOnGameStart; i++) {
            this.addLife();
        }

        //  Run level
        this.schedule(this.spawnEnemy, 1.5);

        //  Update space
        this.scheduleUpdate();
    },

    //  Gameplay handling
    spawnEnemy : function () {
        if (PiuPiuGlobals.gameState != GameStates.Playing) {
            this.unschedule(this.spawnEnemy);
            return;
        }

        this.gameLayer.addEnemy();
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

        //  Update stats
        PiuPiuGlobals.totalPoints += PiuPiuConsts.pointsPerEnemyKill;
        PiuPiuGlobals.totalHits++;
        PiuPiuGlobals.totalEnemyKilled++;
    },

    collisionBulletEnemyHead: function (arbiter, space) {

        this.points += PiuPiuConsts.pointsPerEnemyHeadShot;
        this.statusLayer.updatePoints(this.points);
        this.statusLayer.displayHeadShot();

        var shapes = arbiter.getShapes();
        this.bodiesToRemove.push(shapes[0].body, shapes[1].body);

        //  Update stats
        PiuPiuGlobals.totalPoints += PiuPiuConsts.pointsPerEnemyHeadShot;
        PiuPiuGlobals.totalHits;
        PiuPiuGlobals.totalEnemyKilled++;
        PiuPiuGlobals.totalHeadShots++;
    },

    collisionEnemyPlayer: function (arbiter, space) {

        var shapes = arbiter.getShapes();
        //  shapes[1] is Zehavi
        this.bodiesToRemove.push(shapes[0].body);

        this.removeLife();
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
        console.log("ping " + dt);

        // Simulation cpSpaceAddPostStepCallback
        for(var i = 0; i < this.bodiesToRemove.length; i++) {
            var shape = this.bodiesToRemove[i];
            this.gameLayer.removeObjectByBody(shape);
        }
        this.bodiesToRemove = [];
    }
});