/**
 * Created by shirkan on 11/17/14.
 */


var BackgroundLayer = cc.Layer.extend({
    map:null,
    ctor: function() {
        this._super();
        this.init();
    },

    init: function() {
        this._super();

        //  Set field as BG
        var mapNum = Math.floor(Math.random() * 6) + 1;
        var mapTMX = res["grass" + mapNum + "_tmx"];

        this.map = new cc.TMXTiledMap(mapTMX);
        //this.map = new cc.Sprite("res/grass4.png");
        this.addChild(this.map);

        //
        //var children = this.map.getChildren();
        //
        //for (var c in children) {
        //    children[c].getTexture().setAntiAliasTexParameters();
        //}


        //var winSize = cc.director.getWinSize();
        //var centerPos = cc.p(winSize.width / 2, winSize.height / 2);
        //var spriteBG = new cc.Sprite(res.Field_png);
        //spriteBG.setPosition(centerPos);
        //this.addChild(spriteBG);
    }
})