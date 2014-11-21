/**
 * Created by shirkan on 11/17/14.
 */


var BackgroundLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        this.init();
    },

    init: function() {
        this._super();

        //  Set field as BG
        var winSize = cc.director.getWinSize();
        var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
        var spriteBG = new cc.Sprite(res.Field_png);
        spriteBG.setPosition(centerPos);
        this.addChild(spriteBG);
    }
})