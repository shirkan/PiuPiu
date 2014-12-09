/**
 * Created by shirkan on 11/17/14.
 */

const yGap = 30;
const xGap = 100;
const gapBetweenLives = 3;
const fontSize = 20;

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
        this.labelHishScore = new cc.LabelTTF("Score: 0", "Helvetica", fontSize);
        this.labelHishScore.setColor(cc.color(255,255,0)); //  Yellow
        this.labelHishScore.setPosition(PiuPiuGlobals.winSize.width - xGap, PiuPiuGlobals.winSize.height - yGap);
        this.addChild(this.labelHishScore);

        //  Create sprite for lives
        var livesSprite = new cc.Sprite(res.Life_png);
        var livePos = cc.p(yGap, PiuPiuGlobals.winSize.height - livesSprite.height/2);
        livesSprite.setPosition(livePos);
        this.addChild(livesSprite);

        //  Create label for lives, position near the sprite
        this.labelLives = new cc.LabelTTF("X0", "Helvetica", fontSize);
        this.labelLives.setColor(cc.color(255,255,0)); //  Yellow
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
        var headShotSprite = new cc.LabelTTF("Head shot!", "Helvetica", fontSize);
        headShotSprite.setColor(cc.color(255,255,0)); //  Yellow
        headShotSprite.enableStroke(cc.color(0,0,255), 2); //Blue
        headShotSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - yGap);
        this.addChild(headShotSprite);
        headShotSprite.runAction(cc.FadeOut.create(0.5));
    },

    showGameOver : function () {
        var gameOverSprite = new cc.LabelTTF("Game Over", "Helvetica", fontSize * 3);
        gameOverSprite.setColor(cc.color(255,255,255)); //  White
        gameOverSprite.enableStroke(cc.color(255,0,0), 3); //   Red
        gameOverSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height / 2);
        var gameOverAnimation = cc.RepeatForever.create(new cc.Sequence(cc.ScaleBy.create(2, 1.5), cc.ScaleBy.create(2, 1/1.5)));
        this.addChild(gameOverSprite);
        gameOverSprite.runAction(gameOverAnimation);
    },

    showLevelCompleted: function () {
        this.labelLevelCompleted = new cc.LabelTTF("Level Completed!", "Helvetica", fontSize * 3);
        this.labelLevelCompleted.setColor(cc.color(255,255,0)); //  Yellow
        this.labelLevelCompleted.enableStroke(cc.color(0,0,255), 2); //Blue
        this.labelLevelCompleted.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height / 2);
        this.addChild(this.labelLevelCompleted, 0, PiuPiuConsts.levelCompletedTag);
    },

    hideLevelCompleted: function () {
        this.removeChild(this.labelLevelCompleted);
    }

})