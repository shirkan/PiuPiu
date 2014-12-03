/**
 * Created by shirkan on 11/17/14.
 */

const yGap = 20;
const xGap = 100;
const gapBetweenLives = 3;
const fontSize = 20;

var StatusLayer = cc.Scene.extend({
    labelPoints:null,
    livesSprites:[],
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

    },

    updatePoints: function ( points ) {
        this.labelHishScore.setString("Score: " + points);
    },

    addLife: function () {
        var newSprite = new cc.Sprite(res.Life_png);
        var newPos = cc.p(yGap + (PiuPiuGlobals.livesLeft * (newSprite.width + gapBetweenLives)), PiuPiuGlobals.winSize.height - yGap);
        newSprite.setPosition(newPos);
        this.addChild(newSprite);

        this.livesSprites.push(newSprite);
    },

    removeLife: function () {
        var spriteToRemove = this.livesSprites.pop();
        this.removeChild(spriteToRemove);
    },

    displayHeadShot: function() {
        var headShotSprite = new cc.LabelTTF("Head shot!", "Helvetica", fontSize);
        headShotSprite.setColor(cc.color(255,0,0)); //  Red
        headShotSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - yGap);
        this.addChild(headShotSprite);
        headShotSprite.runAction(cc.FadeOut.create(0.5));
    },

    showGameOver : function () {
        var gameOverSprite = new cc.LabelTTF("Game Over", "Helvetica", fontSize * 3);
        gameOverSprite.setColor(cc.color(255,0,0)); //  Red
        gameOverSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height / 2);
        this.addChild(gameOverSprite);
    }
})