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
    lives:0,

    ctor: function() {
        this._super();
        this.init();
    },

    init: function() {
        this._super();

        var winSize = cc.director.getWinSize();

        //  Create label for points
        this.labelPoints = new cc.LabelTTF("ניקוד: 0", "Helvetica", fontSize);
        this.labelPoints.setColor(cc.color(255,255,0)); //  Yellow
        this.labelPoints.setPosition(winSize.width - xGap, winSize.height - yGap);
        this.addChild(this.labelPoints);

        //  Add 3 lives for start
        for (var i=0; i<3; i++) {
            this.addLife();
        }

    },

    updatePoints: function ( pointsToAdd ) {
        this.points += pointsToAdd;
        this.labelPoints.setString("ניקוד: " + this.points);
    },

    addLife: function () {
        var winSize = cc.director.getWinSize();

        this.lives++;

        var newSprite = new cc.Sprite(res.Life_png);
        var newPos = cc.p(yGap + (this.lives * (newSprite.width + gapBetweenLives)), winSize.height - yGap);
        newSprite.setPosition(newPos);
        this.addChild(newSprite);

        this.livesSprites.push(newSprite);
    },

    removeLife: function () {
        var spriteToRemove = this.livesSprites.pop();
        this.removeChild(spriteToRemove);

        this.lives--;
        if (this.lives == 0) {
            console.log("Game Over Eran");
        }
    }
})