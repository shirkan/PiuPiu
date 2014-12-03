
var StatsLayer = cc.Layer.extend({
    ctor : function(){
        this._super();
    },
    init:function(){
        this._super();

        //  Check for highscore
        if (cc.sys.localStorage.highScore) {
            PiuPiuGlobals.highScore = cc.sys.localStorage.highScore;
        }

        //  Add background
        var spritebg = new cc.TMXTiledMap(PiuPiuGlobals.commonGrassMap);
        this.addChild(spritebg);

        //  Show Stats
        //["totalBulletsFired", "totalHits", "totalPowerUps", "totalEnemyKilled", "totalHeadShots"]
        var labelTotalBulletsFired = new cc.LabelTTF("Total bullets fired", "Helvetica", 30);
        labelTotalBulletsFired.setColor(cc.color(255,255,0)); //Yellow
        labelTotalBulletsFired.anchorX = 0;
        labelTotalBulletsFired.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 50));
        this.addChild(labelTotalBulletsFired);

        var totalBulletsFired = new cc.LabelTTF(PiuPiuGlobals.totalBulletsFired.toString(), "Helvetica", 30);
        totalBulletsFired.setColor(cc.color(255,255,0)); //Yellow
        totalBulletsFired.anchorX = 0;
        totalBulletsFired.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 50));
        this.addChild(totalBulletsFired);

        var labelTotalHits = new cc.LabelTTF("Total hits", "Helvetica", 30);
        labelTotalHits.setColor(cc.color(255,255,0)); //Yellow
        labelTotalHits.anchorX = 0;
        labelTotalHits.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 85));
        this.addChild(labelTotalHits);

        var totalHits = new cc.LabelTTF(PiuPiuGlobals.totalHits.toString(), "Helvetica", 30);
        totalHits.setColor(cc.color(255,255,0)); //Yellow
        totalHits.anchorX = 0;
        totalHits.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 85));
        this.addChild(totalHits);

        var labelhitRate = new cc.LabelTTF("Hit rate", "Helvetica", 30);
        labelhitRate.setColor(cc.color(255,255,0)); //Yellow
        labelhitRate.anchorX = 0;
        labelhitRate.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 115));
        this.addChild(labelhitRate);

        var actualHitRate = (PiuPiuGlobals.totalBulletsFired ? (PiuPiuGlobals.totalHits / PiuPiuGlobals.totalBulletsFired * 100).toFixed(0) : 0)
        var hitRate = new cc.LabelTTF(actualHitRate.toString() + "%", "Helvetica", 30);
        hitRate.setColor(cc.color(255,255,0)); //Yellow
        hitRate.anchorX = 0;
        hitRate.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 115));
        this.addChild(hitRate);

        var labelTotalPowerUps = new cc.LabelTTF("Total power ups", "Helvetica", 30);
        labelTotalPowerUps.setColor(cc.color(255,255,0)); //Yellow
        labelTotalPowerUps.anchorX = 0;
        labelTotalPowerUps.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 150));
        this.addChild(labelTotalPowerUps);

        var totalPowerUps = new cc.LabelTTF(PiuPiuGlobals.totalPowerUps.toString(), "Helvetica", 30);
        totalPowerUps.setColor(cc.color(255,255,0)); //Yellow
        totalPowerUps.anchorX = 0;
        totalPowerUps.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 150));
        this.addChild(totalPowerUps);

        var labelTotalEnemyKilled = new cc.LabelTTF("Total enemies killed", "Helvetica", 30);
        labelTotalEnemyKilled.setColor(cc.color(255,255,0)); //Yellow
        labelTotalEnemyKilled.anchorX = 0;
        labelTotalEnemyKilled.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 185));
        this.addChild(labelTotalEnemyKilled);

        var totalEnemyKilled = new cc.LabelTTF(PiuPiuGlobals.totalEnemyKilled.toString(), "Helvetica", 30);
        totalEnemyKilled.setColor(cc.color(255,255,0)); //Yellow
        totalEnemyKilled.anchorX = 0;
        totalEnemyKilled.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 185));
        this.addChild(totalEnemyKilled);

        var labelTotalHeadShots = new cc.LabelTTF("Total head shots", "Helvetica", 30);
        labelTotalHeadShots.setColor(cc.color(255,255,0)); //Yellow
        labelTotalHeadShots.anchorX = 0;
        labelTotalHeadShots.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 220));
        this.addChild(labelTotalHeadShots);

        var totalHeadShots = new cc.LabelTTF(PiuPiuGlobals.totalHeadShots.toString(), "Helvetica", 30);
        totalHeadShots.setColor(cc.color(255,255,0)); //Yellow
        totalHeadShots.anchorX = 0;
        totalHeadShots.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 220));
        this.addChild(totalHeadShots);

        var labelTotalPoints = new cc.LabelTTF("Total points", "Helvetica", 30);
        labelTotalPoints.setColor(cc.color(255,255,0)); //Yellow
        labelTotalPoints.anchorX = 0;
        labelTotalPoints.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 255));
        this.addChild(labelTotalPoints);

        var totalPoints = new cc.LabelTTF(PiuPiuGlobals.totalPoints.toString(), "Helvetica", 30);
        totalPoints.setColor(cc.color(255,255,0)); //Yellow
        totalPoints.anchorX = 0;
        totalPoints.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 255));
        this.addChild(totalPoints);

        var labelHighscore = new cc.LabelTTF("High score", "Helvetica", 30);
        labelHighscore.setColor(cc.color(255,255,0)); //Yellow
        labelHighscore.anchorX = 0;
        labelHighscore.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 290));
        this.addChild(labelHighscore);

        var highScore = new cc.LabelTTF(PiuPiuGlobals.highScore.toString(), "Helvetica", 30);
        highScore.setColor(cc.color(255,255,0)); //Yellow
        highScore.anchorX = 0;
        highScore.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 290));
        this.addChild(highScore);
    }
});

var StatsScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new StatsLayer();
        layer.init();
        this.addChild(layer);

        //  Setup back button to exit for android
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode, event){
                if(keyCode == cc.KEY.back || keyCode == cc.KEY.backspace)
                {
                    event.getCurrentTarget().onBackClicked();
                }
            }
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onBackClicked,
            onTouchMoved: function () {},
            onTouchEnded: function () {}}, this);
    },
    onBackClicked : function () {
        var transition = new cc.TransitionFade(1, new MenuScene());
        cc.director.runScene(transition);
    }
});
