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
    hitToUpdate:"",
    enemySM:null,
    powerupsSM:null,
    autoFireFlag: false,

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

        //  Init spawning mechanisms
        enemySM = new SpawningMechanism(this, this.spawnEnemy);

        var m = new MachineGunPowerup(this.gameLayer, this.autoFireStart.bind(this), 19);
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
            //  Set machine gun mode off
            this.autoFireEnd();

            //  Game beginning initialization, occurs only on level 1
            if (PiuPiuGlobals.currentLevel == 1) {
                PiuPiuGlobals.livesLeft = 0;

                //  Add lives for start
                for (var i=0; i<PiuPiuConsts.livesOnGameStart; i++) {
                    this.addLife();
                }
                playSound(res.sound_ohedNichnasLamigrash);
            }
        PiuPiuGlobals.gameState = GameStates.Playing;

        //  Start spwaning
        enemySM.start();

        //  Start space updating
        this.scheduleUpdate();
    },

    //  Gameplay handling
    spawnEnemy : function () {
        if (PiuPiuGlobals.gameState != GameStates.Playing) {
            enemySM.stop();
            return;
        }

        this.gameLayer.addEnemy();

        //  Check if need to spawn more enemies
        PiuPiuLevelSettings.totalEnemiesToSpawn--;
        if (PiuPiuLevelSettings.totalEnemiesToSpawn == 0) {
            enemySM.stop();
            return;
        } else {
            enemySM.step();
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
        if (PiuPiuGlobals.gameState == GameStates.GameOver) {
            return false;
        }

        if (PiuPiuLevelSettings.totalEnemiesToSpawn == 0 &&
            PiuPiuLevelSettings.enemiesVanished >= PiuPiuLevelSettings.totalEnemiesToKill) {
            PiuPiuGlobals.gameState = GameStates.LevelCompleted;
            this.statusLayer.showLevelCompleted();
            return true;
        }

        return false;
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

    //  Powerups callbacks
    autoFireStart : function () {
        this.autoFireFlag = true;
        this.gameLayer.hands.setHandsMachineGun();
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.autoFireEnd, 10, 0);
    },

    autoFireEnd : function () {
        this.gameLayer.hands.setHandsNormal();
        this.autoFireFlag = false;
    },

    //  Touch handling
    shootBullet : function (pos, sound) {
        //  Angle limits - goes crazy beyond these angles
        if (pos.x < PiuPiuConsts.handsAnchor.x) {
            return false;
        }

        var bulletData = calculateTrigonometry(pos);
        bulletData.push(sound);

        this.gameLayer.addBullet(bulletData);
        PiuPiuGlobals.totalBulletsFired++;
    },

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
        playScene.autoFireFlag ? playScene.shootBullet(pos, res.sound_machineGun) : playScene.shootBullet(pos);

        return true;
    },

    onTouchMoved: function (touch, event) {
        var playScene = event.getCurrentTarget();

        if (playScene.autoFireFlag &&
            PiuPiuGlobals.gameState == GameStates.Playing) {
            var pos = touch.getLocation();
            playScene.shootBullet(pos, res.sound_machineGun);
            return true;
        }

        return false;
    },

    onTouchEnded: function (touch, event) {
    },

    //  Collisions handling
    collisionBulletEnemy: function (arbiter, space) {
        if (this.hitToUpdate > hitType.NoHit) {
            return;
        }
        this.hitToUpdate = hitType.BulletEnemy;

        var shapes = arbiter.getShapes();
        this.bodiesToRemove.push(shapes[0].body, shapes[1].body);
        //  Set post step callback
        this.space.addPostStepCallback(this.postStepCallBack.bind(this));


    },

    collisionBulletEnemyHead: function (arbiter, space) {
        if (this.hitToUpdate > hitType.NoHit) {
            return;
        }
        this.hitToUpdate = hitType.BulletEnemyHead;

        var shapes = arbiter.getShapes();
        this.bodiesToRemove.push(shapes[0].body, shapes[1].body);
        //  Set post step callback
        this.space.addPostStepCallback(this.postStepCallBack.bind(this));
    },

    collisionEnemyPlayer: function (arbiter, space) {
        if (this.hitToUpdate > hitType.NoHit) {
            return;
        }
        this.hitToUpdate = hitType.EnemyPlayer;

        var shapes = arbiter.getShapes();
        //  shapes[1] is Zehavi
        this.bodiesToRemove.push(shapes[0].body);
        //  Set post step callback
        this.space.addPostStepCallback(this.postStepCallBack.bind(this));
    },

    postStepCallBack : function () {
        // Simulation cpSpaceAddPostStepCallback
        for(var i = 0; i < this.bodiesToRemove.length; i++) {
            var body = this.bodiesToRemove[i];
            this.gameLayer.removeObjectByBody(body);
        }
        this.bodiesToRemove = [];

        if (this.hitToUpdate == hitType.NoHit) {
            return;
        }

        //  Update level settings
        PiuPiuLevelSettings.enemiesVanished++;

        //  Update stats according to hit type
        switch (this.hitToUpdate) {
            case hitType.BulletEnemy:
            {
                this.points += PiuPiuConsts.pointsPerEnemyKill;
                this.statusLayer.updatePoints(this.points);

                PiuPiuGlobals.totalPoints += PiuPiuConsts.pointsPerEnemyKill;
                PiuPiuGlobals.totalEnemyKilled++;

                break;
            }
            case hitType.BulletEnemyHead:
            {
                this.points += PiuPiuConsts.pointsPerEnemyHeadShot;
                this.statusLayer.updatePoints(this.points);
                this.statusLayer.displayHeadShot();

                PiuPiuGlobals.totalPoints += PiuPiuConsts.pointsPerEnemyHeadShot;
                PiuPiuGlobals.totalEnemyKilled++;
                PiuPiuGlobals.totalHeadShots++;

                break;
            }
            case hitType.EnemyPlayer:
            {
                this.removeLife();
            }
        }
        this.hitToUpdate = hitType.NoHit;
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
    }
});