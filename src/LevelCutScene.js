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
        levelSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - 50);
        this.addChild(levelSprite);
        
        //  Add level type
        var levelTypeSprite = new cc.LabelTTF(getLevelTypeString(), PiuPiuConsts.fontName, PiuPiuConsts.fontSizeNormal);
        levelTypeSprite.setFontFillColor(cc.color(255,220,80)); //  Yellow
        levelTypeSprite.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
        levelTypeSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - 80);
        this.addChild(levelTypeSprite);

        //  Add level hint
        var levelHintSprite = new cc.LabelTTF(PiuPiuLevelSettings.hint, PiuPiuConsts.fontName, PiuPiuConsts.fontSizeSmall);
        levelHintSprite.setFontFillColor(cc.color(255,220,80)); //  Yellow
        levelHintSprite.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSizeSmall); //Blue
        levelHintSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - 100);
        this.addChild(levelHintSprite);
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
        //  Reset post step callbacks
        resetPostStepCallback();

        cc.director.popScene();
    }
});
