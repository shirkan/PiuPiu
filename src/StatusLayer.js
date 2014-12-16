/**
 * Created by shirkan on 11/17/14.
 */

const yGap = 30;
const xGap = 100;
const gapBetweenLives = 3;

var StatusLayer = cc.Scene.extend({
    labelPoints:null,
    labelHighScore:null,
    labelLevelCompleted:null,
    labelLives:null,
    ctor: function() {
        this._super();
        this.init();
    },

    init: function() {
        this._super();

        //  Create label for points
        this.labelHishScore = new cc.LabelTTF("Score: 0", "Helvetica", PiuPiuConsts.fontSizeStatus);
        this.labelHishScore.setFontFillColor(cc.color(255,220,80)); //  Yellow
        this.labelHishScore.enableStroke(cc.color(0,0,255), 2); //Blue
        this.labelHishScore.setPosition(PiuPiuGlobals.winSize.width - xGap, PiuPiuGlobals.winSize.height - yGap);
        this.addChild(this.labelHishScore);

        //  Create sprite for lives
        var livesSprite = new cc.Sprite(res.Life_png);
        var livePos = cc.p(yGap, PiuPiuGlobals.winSize.height - livesSprite.height/2);
        livesSprite.setPosition(livePos);
        this.addChild(livesSprite);

        //  Create label for lives, position near the sprite
        this.labelLives = new cc.LabelTTF("X0", "Helvetica", PiuPiuConsts.fontSizeStatus);
        this.labelLives.setFontFillColor(cc.color(255,220,80)); //  Yellow
        this.labelLives.enableStroke(cc.color(0,0,255), 2); //Blue
        this.labelLives.setPosition(yGap + gapBetweenLives +livesSprite.width, PiuPiuGlobals.winSize.height - livesSprite.height/2);
        this.addChild(this.labelLives);
    },

    updatePoints: function ( points ) {
        this.labelHishScore.setString("Score: " + points);
    },

    setLives: function ( lives ) {
        this.labelLives.setString("X" + lives);
    },

    displayHeadShot: function() {
        var headShotSprite = new cc.LabelTTF("Head shot!", "Helvetica", PiuPiuConsts.fontSizeStatus);
        headShotSprite.setFontFillColor(cc.color(255,220,80)); //  Yellow
        headShotSprite.enableStroke(cc.color(0,0,255), 2); //Blue
        headShotSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - yGap);
        this.addChild(headShotSprite);
        headShotSprite.runAction(cc.FadeOut.create(0.5));
    },

    showGameOver : function () {
        var gameOverSprite = new cc.LabelTTF("Game Over", "Helvetica", PiuPiuConsts.fontSizeBig);
        gameOverSprite.setFontFillColor(cc.color(255,0,0)); //  Red
        gameOverSprite.enableStroke(cc.color(255,255,255), 3); //   White
        gameOverSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height / 2);
        var gameOverAnimation = cc.RepeatForever.create(new cc.Sequence(cc.ScaleBy.create(2, 1.5), cc.ScaleBy.create(2, 1/1.5)));
        this.addChild(gameOverSprite);
        gameOverSprite.runAction(gameOverAnimation);
    },

    showLevelCompleted: function () {
        this.labelLevelCompleted = new cc.LabelTTF("Level Completed!", "Helvetica", PiuPiuConsts.fontSizeBig);
        this.labelLevelCompleted.setFontFillColor(cc.color(255,220,80)); //  Yellow
        this.labelLevelCompleted.enableStroke(cc.color(0,0,255), 2); //Blue
        this.labelLevelCompleted.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height / 2);
        this.addChild(this.labelLevelCompleted, 0);
    },

    hideLevelCompleted: function () {
        this.removeChild(this.labelLevelCompleted);
    }

})