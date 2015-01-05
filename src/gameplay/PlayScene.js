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
    isMachineGunMode: false,
    isCaptainMode: false,
    isStopwatchMode: false,
    canContinueToNextScene:false,

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

        //  Create new spawning mechanisms
        this.enemySM = new SpawningMechanism();
        this.powerupSM = new SpawningMechanism();
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
            //  Set machine gun mode off, captain mode off
            this.machineGunEnd();
            this.captainEnd();
            this.stopwatchEnd();
            this.canContinueToNextScene = false;

            //  Game beginning initialization, occurs only on level 1
            if (PiuPiuGlobals.currentLevel == 1) {
                PiuPiuGlobals.livesLeft = PiuPiuConsts.livesOnGameStart;
                this.statusLayer.setLives(PiuPiuGlobals.livesLeft);
                playSound(res.sound_ohedNichnasLamigrash);
            }
        PiuPiuGlobals.gameState = GameStates.Playing;

        //  Init & start enemies spwaning
        this.enemySM.init(this, this.spawnEnemy, PiuPiuLevelSettings.enemiesSpawnIntervalType,
            PiuPiuLevelSettings.enemiesSpawnInterval, PiuPiuLevelSettings.enemiesSpawnIntervalMin,
            PiuPiuLevelSettings.enemiesSpawnIntervalMax);
        this.enemySM.start();

        //  Init $ start powerups spawning
        if (PiuPiuLevelSettings.powerupsTypes == "all") {
            PiuPiuLevelSettings.powerupsTypes = PiuPiuConsts.powerupTypes;
        }
        this.powerupSM.init(this, this.spawnPowerup, PiuPiuLevelSettings.powerupsSpawnIntervalType,
            PiuPiuLevelSettings.powerupsSpawnInterval, PiuPiuLevelSettings.powerupsSpawnIntervalMin,
            PiuPiuLevelSettings.powerupsSpawnIntervalMax);
        this.powerupSM.start();

        //  Start space updating
        this.scheduleUpdate();
    },

    //  Gameplay handling
    spawnEnemy : function () {
        if (PiuPiuGlobals.gameState != GameStates.Playing) {
            this.enemySM.stop();
            return;
        }

        this.gameLayer.addEnemy();

        //  Check if need to spawn more enemies
        PiuPiuLevelSettings.totalEnemiesToSpawn--;
        if (PiuPiuLevelSettings.totalEnemiesToSpawn == 0) {
            this.enemySM.stop();
        } else {
            this.enemySM.step();
        }
    },

    spawnPowerup : function () {
        var powerup = PiuPiuLevelSettings.powerupsTypes[Math.floor(randomNumber(0, PiuPiuLevelSettings.powerupsTypes.length))];
        //var powerup = PiuPiuLevelSettings.powerupsTypes[Math.floor(Math.random() * PiuPiuLevelSettings.powerupsTypes.length)];

        switch (powerup) {
            case "MachineGunPowerUp": {
                this.gameLayer.addPowerUp("mg", this.gameLayer, res.PowerupMachineGun_png, this.machineGunStart.bind(this), PiuPiuConsts.powerupPeriod);
                break;
            }
            case "OneUpPowerUp": {
                this.gameLayer.addPowerUp("1up", this.gameLayer, res.Powerup1Up_png, this.addLife.bind(this), PiuPiuConsts.powerupPeriod);
                break;
            }
            case "CaptainPowerUp": {
                this.gameLayer.addPowerUp("cap", this.gameLayer, res.PowerupCaptain_png, this.captainStart.bind(this), PiuPiuConsts.powerupPeriod);
                break;
            }
            case "StopwatchPowerUp": {
                this.gameLayer.addPowerUp("sw", this.gameLayer, res.PowerupStopwatch_png, this.stopwatchStart.bind(this), PiuPiuConsts.powerupPeriod);
                break;
            }
        }

        this.powerupSM.step();
    },

    addLife : function () {
        PiuPiuGlobals.livesLeft++;
        this.statusLayer.setLives(PiuPiuGlobals.livesLeft);
    },

    removeLife : function () {
        PiuPiuGlobals.livesLeft--;
        if (PiuPiuGlobals.livesLeft < 0) {
            this.endGame( true, false);

        } else {
            this.statusLayer.setLives(PiuPiuGlobals.livesLeft);
        }
    },

    stopPlaying : function () {
        this.enemySM.stop();
        this.powerupSM.stop();
        runPostStepCallbacks();
        this.gameLayer.removeAllObjects();
    },

    checkLevelComplete : function () {
        if (PiuPiuGlobals.gameState == GameStates.GameOver) {
            return false;
        }

        if (PiuPiuLevelSettings.totalEnemiesToSpawn == 0 &&
            PiuPiuLevelSettings.enemiesVanished >= PiuPiuLevelSettings.totalEnemiesToKill) {
            PiuPiuGlobals.gameState = GameStates.LevelCompleted;
            this.stopPlaying();
            this.statusLayer.showLevelCompleted();

            PiuPiuGlobals.currentLevel++;
            //  load next level settings, gotta use some of them in the cut scene
            loadLevelSettings();

            //  Enable pause for 2 seconds
            cc.director.getScheduler().scheduleCallbackForTarget(this, function () {this.canContinueToNextScene = true}, 0, 0, 2);

            return true;
        }

        return false;
    },

    endGame : function ( showGameOverBanner, transitToMainMenu) {
        //  Set flag to remove all objects on next step
        this.clearAllObjectsFlag = true;

        //  Change game state
        PiuPiuGlobals.gameState = GameStates.GameOver;
        this.stopPlaying();

        //  Show game over banner
        if (showGameOverBanner) {
            this.statusLayer.showGameOver();
        }

        //  Update high score
        //this.updateHighScore();
        //  Update stats
        handleHighScore();

        updateStats();
        //  Update Facebook stats
        FBpostScore();

        if (transitToMainMenu) {
            cc.director.popScene();
        } else {
            //  Enable pause for 2 seconds
            cc.director.getScheduler().scheduleCallbackForTarget(this, function () {this.canContinueToNextScene = true}, 2, 0);

        }
    },

    //  Powerups callbacks
    machineGunStart : function () {
        if (this.isMachineGunMode) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.machineGunEnd);
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.machineGunEnd, PiuPiuConsts.powerupMachineGunPeriod, 0);
        } else {
            this.isMachineGunMode = true;
            this.updateHandsType();
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.machineGunEnd, PiuPiuConsts.powerupMachineGunPeriod, 0);
        }
    },

    machineGunEnd : function () {
        this.isMachineGunMode = false;
        this.updateHandsType();
    },

    captainStart : function () {
        if (this.isCaptainMode) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.captainEnd);
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.captainEnd, PiuPiuConsts.powerupCaptainPeriod, 0);
        } else {
            this.isCaptainMode = true;
            PiuPiuGlobals.currentPointsMultiplier = PiuPiuConsts.powerupCaptainMultiplier;
            this.updateHandsType();
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.captainEnd, PiuPiuConsts.powerupCaptainPeriod, 0);
        }
    },

    captainEnd : function () {
        this.isCaptainMode = false;
        PiuPiuGlobals.currentPointsMultiplier = PiuPiuConsts.pointsNormalMultiplier;
        this.updateHandsType();
    },

    stopwatchStart: function () {
        if (this.isStopwatchMode) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.stopwatchEnd);
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.stopwatchEnd, PiuPiuConsts.powerupStopwatchPeriod, 0);
        } else {
            this.isStopwatchMode = true;
            PiuPiuGlobals.currentUpdateRate = PiuPiuConsts.powerupStopwatchUpdateRate;
            this.gameLayer.updateAllSpeeds(PiuPiuConsts.powerupStopwatchUpdateRate);
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.stopwatchEnd, PiuPiuConsts.powerupStopwatchPeriod, 0);
        }
    },

    stopwatchEnd: function () {
        this.isStopwatchMode = false;
        PiuPiuGlobals.currentUpdateRate = PiuPiuConsts.normalUpdateRate;
        this.gameLayer.updateAllSpeeds(1/PiuPiuConsts.powerupStopwatchUpdateRate);
    },

    updateHandsType : function () {
        if (this.isMachineGunMode) {
            //  Machine Gun mode on
            if (this.isCaptainMode) {
                //  Captain mode on
                this.gameLayer.hands.setHandsMachineGunCaptain();
            } else {
                //  Captain Mode off
                this.gameLayer.hands.setHandsMachineGun();
            }
        } else {
            //  Machine Gun mode off
            if (this.isCaptainMode) {
                //  Captain mode on
                this.gameLayer.hands.setHandsCaptain();
            } else {
                //  Captain Mode off
                this.gameLayer.hands.setHandsNormal();
            }
        }
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
        var playScene = event.getCurrentTarget();
        //  If game over state, return to menu
        if (PiuPiuGlobals.gameState == GameStates.GameOver) {
            if (!playScene.canContinueToNextScene) {
                return true;
            }

            cc.director.popScene();
            return true;
        }

        //  If level completed, continue to cut scene of next level
        if (PiuPiuGlobals.gameState == GameStates.LevelCompleted) {
            if (!playScene.canContinueToNextScene) {
                return true;
            }

            //  Hide level completed label from previous level
            playScene.statusLayer.hideLevelCompleted();

            var transition = new cc.TransitionFade(1, PiuPiuGlobals.scenes.levelCutScene);
            cc.director.runScene(transition);
            return true;
        }

        var pos = touch.getLocation();
        playScene.isMachineGunMode ? playScene.shootBullet(pos, res.sound_machineGun) : playScene.shootBullet(pos);

        return true;
    },

    onTouchMoved: function (touch, event) {
        var playScene = event.getCurrentTarget();

        if (playScene.isMachineGunMode &&
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
        addPostStepCallback(this.postStepCallBack.bind(this));
    },

    collisionBulletEnemyHead: function (arbiter, space) {
        if (this.hitToUpdate > hitType.NoHit) {
            return;
        }
        this.hitToUpdate = hitType.BulletEnemyHead;
        playSound(res.sound_headshot);

        var shapes = arbiter.getShapes();
        this.bodiesToRemove.push(shapes[0].body, shapes[1].body);
        //  Set post step callback
        addPostStepCallback(this.postStepCallBack.bind(this));
    },

    collisionEnemyPlayer: function (arbiter, space) {
        if (this.hitToUpdate > hitType.NoHit) {
            return;
        }
        this.hitToUpdate = hitType.EnemyPlayer;

        var shapes = arbiter.getShapes();
        //  shapes[1] is Player
        this.bodiesToRemove.push(shapes[0].body);
        //  Set post step callback
        addPostStepCallback(this.postStepCallBack.bind(this));
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

        var currentHitType = this.hitToUpdate;
        this.hitToUpdate = hitType.NoHit;

        //  Update stats according to hit type
        switch (currentHitType) {
            case hitType.BulletEnemy:
            {
                this.points += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyKill);
                this.statusLayer.updatePoints(this.points);

                PiuPiuGlobals.totalPoints += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyKill);
                PiuPiuGlobals.totalEnemyKilled++;

                break;
            }
            case hitType.BulletEnemyHead:
            {
                this.points += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyHeadShot);
                this.statusLayer.updatePoints(this.points);
                this.statusLayer.displayHeadShot();

                PiuPiuGlobals.totalPoints += (PiuPiuGlobals.currentPointsMultiplier * PiuPiuConsts.pointsPerEnemyHeadShot);
                PiuPiuGlobals.totalEnemyKilled++;
                PiuPiuGlobals.totalHeadShots++;

                break;
            }
            case hitType.EnemyPlayer:
            {
                this.removeLife();
            }
        }
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

        runPostStepCallbacks();
    }
});



