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
    points:0,
    winSize:null,
    ctor: function() {
        this._super();
        this.init();
    },

    init: function() {
        this._super();

        this.winSize = cc.director.getWinSize();

        //  Create label for points
        this.labelHishScore = new cc.LabelTTF("Score: 0", "Helvetica", fontSize);
        this.labelHishScore.setColor(cc.color(255,255,0)); //  Yellow
        this.labelHishScore.setPosition(this.winSize.width - xGap, this.winSize.height - yGap);
        this.addChild(this.labelHishScore);

        //  Add lives for start
        for (var i=0; i<PiuPiuConsts.livesOnGameStart; i++) {
            this.addLife();
        }

    },

    updatePoints: function ( pointsToAdd ) {
        this.points += pointsToAdd;
        this.labelHishScore.setString("Score: " + this.points);
    },

    addLife: function () {
        PiuPiuGlobals.livesLeft++;

        var newSprite = new cc.Sprite(res.Life_png);
        var newPos = cc.p(yGap + (PiuPiuGlobals.livesLeft * (newSprite.width + gapBetweenLives)), this.winSize.height - yGap);
        newSprite.setPosition(newPos);
        this.addChild(newSprite);

        this.livesSprites.push(newSprite);
    },

    removeLife: function () {
        var spriteToRemove = this.livesSprites.pop();
        this.removeChild(spriteToRemove);

        PiuPiuGlobals.livesLeft--;
        if (PiuPiuGlobals.livesLeft == 0) {

            //  Add game over label
            var gameOverSprite = new cc.LabelTTF("Game Over", "Helvetica", fontSize * 3);
            gameOverSprite.setColor(cc.color(255,0,0)); //  Red
            gameOverSprite.setPosition(this.winSize.width / 2, this.winSize.height / 2);
            this.addChild(gameOverSprite);

            //  Change game state
            PiuPiuGlobals.gameState = GameStates.GameOver;

            //  Check for high score update
            if (this.points > PiuPiuGlobals.highScore) {
                cc.sys.localStorage.highScore = PiuPiuGlobals.highScore = this.points;
            }
        }
    },

    displayHeadShot: function() {
        var headShotSprite = new cc.LabelTTF("Head shot!", "Helvetica", fontSize);
        headShotSprite.setColor(cc.color(255,0,0)); //  Red
        headShotSprite.setPosition(this.winSize.width / 2, this.winSize.height - yGap);
        this.addChild(headShotSprite);
        headShotSprite.runAction(cc.FadeOut.create(0.5));
    }
})