/**
 * Created by shirkan on 12/3/14.
 */


var LevelCutSceneLayer = cc.Layer.extend({
    ctor : function(){
        this._super();
    },
    init:function() {
        this._super();

        //  Add background
        var spriteBG = new cc.TMXTiledMap(PiuPiuGlobals.commonGrassMap);
        this.addChild(spriteBG);

        //  Add Level banner
        var levelSprite = new cc.LabelTTF("Level " + PiuPiuGlobals.currentLevel, PiuPiuConsts.fontName, PiuPiuConsts.fontSizeBig);
        levelSprite.setFontFillColor(cc.color(255,220,80)); //  Yellow
        levelSprite.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
        levelSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - 120);
        this.addChild(levelSprite);
    }

});

var LevelCutScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new LevelCutSceneLayer();
        layer.init();
        this.addChild(layer);

        //  Set game state as menu
        PiuPiuGlobals.gameState = GameStates.CutScene;

        //  Load level settings
        loadLevelSettings();

        //  Setup back button to exit for android
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode, event){
                if(keyCode == cc.KEY.back || keyCode == cc.KEY.backspace)
                {
                    event.getCurrentTarget().moveToNextScene();
                }
            }
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                stopAllSounds();
                event.getCurrentTarget().moveToNextScene();
                return true;
            },
            onTouchMoved: null,
            onTouchEnded: null}, this);
    },
    moveToNextScene : function () {
        cc.director.popScene();
    }
});
