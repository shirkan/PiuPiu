/**
 * Created by shirkan on 1/11/15.
 */

var AchievementsLayer = cc.Layer.extend({
    sprite: null,
    label: null,
    ctor: function() {
        this._super();
        this.init();
    },

    init: function() {
        this._super();
    },

    showAchievement: function ( text ) {

        this.sprite = new cc.Sprite(res.Achievement_png);
        this.sprite.setPosition(cc.p(PiuPiuGlobals.winSize.width / 2, 10 + this.sprite.height / 2));
        this.addChild(this.sprite);

        this.label = new cc.LabelTTF(text, PiuPiuConsts.fontName, PiuPiuConsts.fontSizeSmall);
        this.label.setFontFillColor(cc.color(255,220,80)); //  Yellow
        this.label.enableStroke(cc.color(0,0,255), 2); //Blue
        this.label.setPosition(PiuPiuGlobals.winSize.width / 2, this.sprite.y);
        this.addChild(this.label);

        playSound(res.sound_achievement_complete);
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.removeAchievement, 0, 0, 5);
    },

    removeAchievement: function ( ) {
        this.removeChild(this.label);
        this.removeChild(this.sprite);
    }
})