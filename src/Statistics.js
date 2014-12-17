
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
        var labelTotalBulletsFired = new cc.LabelTTF("Total bullets fired", PiuPiuConsts.fontName, 30);
        labelTotalBulletsFired.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelTotalBulletsFired.enableStroke(cc.color(0,0,255), 2); //Blue
        labelTotalBulletsFired.anchorX = 0;
        labelTotalBulletsFired.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 50));
        this.addChild(labelTotalBulletsFired);

        var totalBulletsFired = new cc.LabelTTF(PiuPiuGlobals.totalBulletsFired.toString(), PiuPiuConsts.fontName, 30);
        totalBulletsFired.setFontFillColor(cc.color(255,220,80)); //Yellow
        totalBulletsFired.enableStroke(cc.color(0,0,255), 2); //Blue
        totalBulletsFired.anchorX = 0;
        totalBulletsFired.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 50));
        this.addChild(totalBulletsFired);

        var labelTotalHits = new cc.LabelTTF("Total hits", PiuPiuConsts.fontName, 30);
        labelTotalHits.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelTotalHits.enableStroke(cc.color(0,0,255), 2); //Blue
        labelTotalHits.anchorX = 0;
        labelTotalHits.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 85));
        this.addChild(labelTotalHits);

        var totalHitsValue = PiuPiuGlobals.totalEnemyKilled + PiuPiuGlobals.totalPowerUps;
        var totalHits = new cc.LabelTTF(totalHitsValue.toString(), PiuPiuConsts.fontName, 30);
        totalHits.setFontFillColor(cc.color(255,220,80)); //Yellow
        totalHits.enableStroke(cc.color(0,0,255), 2); //Blue
        totalHits.anchorX = 0;
        totalHits.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 85));
        this.addChild(totalHits);

        var labelhitRate = new cc.LabelTTF("Hit rate", PiuPiuConsts.fontName, 30);
        labelhitRate.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelhitRate.enableStroke(cc.color(0,0,255), 2); //Blue
        labelhitRate.anchorX = 0;
        labelhitRate.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 115));
        this.addChild(labelhitRate);

        var actualHitRate = (PiuPiuGlobals.totalBulletsFired ? (totalHitsValue / PiuPiuGlobals.totalBulletsFired * 100).toFixed(0) : 0)
        var hitRate = new cc.LabelTTF(actualHitRate.toString() + "%", PiuPiuConsts.fontName, 30);
        hitRate.setFontFillColor(cc.color(255,220,80)); //Yellow
        hitRate.enableStroke(cc.color(0,0,255), 2); //Blue
        hitRate.anchorX = 0;
        hitRate.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 115));
        this.addChild(hitRate);

        var labelTotalEnemyKilled = new cc.LabelTTF("Total enemies killed", PiuPiuConsts.fontName, 30);
        labelTotalEnemyKilled.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelTotalEnemyKilled.enableStroke(cc.color(0,0,255), 2); //Blue
        labelTotalEnemyKilled.anchorX = 0;
        labelTotalEnemyKilled.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 185));
        this.addChild(labelTotalEnemyKilled);

        var totalEnemyKilled = new cc.LabelTTF(PiuPiuGlobals.totalEnemyKilled.toString(), PiuPiuConsts.fontName, 30);
        totalEnemyKilled.setFontFillColor(cc.color(255,220,80)); //Yellow
        totalEnemyKilled.enableStroke(cc.color(0,0,255), 2); //Blue
        totalEnemyKilled.anchorX = 0;
        totalEnemyKilled.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 185));
        this.addChild(totalEnemyKilled);

        var labelTotalHeadShots = new cc.LabelTTF("Total head shots", PiuPiuConsts.fontName, 30);
        labelTotalHeadShots.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelTotalHeadShots.enableStroke(cc.color(0,0,255), 2); //Blue
        labelTotalHeadShots.anchorX = 0;
        labelTotalHeadShots.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 220));
        this.addChild(labelTotalHeadShots);

        var totalHeadShots = new cc.LabelTTF(PiuPiuGlobals.totalHeadShots.toString(), PiuPiuConsts.fontName, 30);
        totalHeadShots.setFontFillColor(cc.color(255,220,80)); //Yellow
        totalHeadShots.enableStroke(cc.color(0,0,255), 2); //Blue
        totalHeadShots.anchorX = 0;
        totalHeadShots.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 220));
        this.addChild(totalHeadShots);

        var labelTotalPowerUps = new cc.LabelTTF("Total power ups", PiuPiuConsts.fontName, 30);
        labelTotalPowerUps.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelTotalPowerUps.enableStroke(cc.color(0,0,255), 2); //Blue
        labelTotalPowerUps.anchorX = 0;
        labelTotalPowerUps.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 150));
        this.addChild(labelTotalPowerUps);

        var totalPowerUps = new cc.LabelTTF(PiuPiuGlobals.totalPowerUps.toString(), PiuPiuConsts.fontName, 30);
        totalPowerUps.setFontFillColor(cc.color(255,220,80)); //Yellow
        totalPowerUps.enableStroke(cc.color(0,0,255), 2); //Blue
        totalPowerUps.anchorX = 0;
        totalPowerUps.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 150));
        this.addChild(totalPowerUps);

        var labelTotalPoints = new cc.LabelTTF("Total points", PiuPiuConsts.fontName, 30);
        labelTotalPoints.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelTotalPoints.enableStroke(cc.color(0,0,255), 2); //Blue
        labelTotalPoints.anchorX = 0;
        labelTotalPoints.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 255));
        this.addChild(labelTotalPoints);

        var totalPoints = new cc.LabelTTF(PiuPiuGlobals.totalPoints.toString(), PiuPiuConsts.fontName, 30);
        totalPoints.setFontFillColor(cc.color(255,220,80)); //Yellow
        totalPoints.enableStroke(cc.color(0,0,255), 2); //Blue
        totalPoints.anchorX = 0;
        totalPoints.setPosition(cc.p(PiuPiuGlobals.winSize.width - 150, PiuPiuGlobals.winSize.height - 255));
        this.addChild(totalPoints);

        var labelHighscore = new cc.LabelTTF("High score", PiuPiuConsts.fontName, 30);
        labelHighscore.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelHighscore.enableStroke(cc.color(0,0,255), 2); //Blue
        labelHighscore.anchorX = 0;
        labelHighscore.setPosition(cc.p(30, PiuPiuGlobals.winSize.height - 290));
        this.addChild(labelHighscore);

        var highScore = new cc.LabelTTF(PiuPiuGlobals.highScore.toString(), PiuPiuConsts.fontName, 30);
        highScore.setFontFillColor(cc.color(255,220,80)); //Yellow
        highScore.enableStroke(cc.color(0,0,255), 2); //Blue
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
        return true;
    }
});
