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
        var mapNum = Math.floor(randomNumber(1, 7));
        //var mapNum = Math.floor(Math.random() * 6) + 1;
        var mapTMX = res["grass" + mapNum + "_tmx"];

        this.map = new cc.TMXTiledMap(mapTMX);
        //this.map = new cc.Sprite("res/grass4.png");
        this.addChild(this.map);

        this.bake();
    }
})