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
        levelSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - 30);
        this.addChild(levelSprite);
        
        //  Add level type
        var levelTypeSprite = new cc.LabelTTF(getLevelTypeString(), PiuPiuConsts.fontName, PiuPiuConsts.fontSizeNormal);
        levelTypeSprite.setFontFillColor(cc.color(255,220,80)); //  Yellow
        levelTypeSprite.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
        levelTypeSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - 70);
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
    listeners:null,
    init : function ( ){
        this._super();
    },
    onEnter:function () {
        this._super();
        var layer = new LevelCutSceneLayer();
        layer.init();
        this.addChild(layer);

        //  Add animation layer
        var anim = PiuPiuLevelSettings.animation;
        if (typeof anim != "undefined" && anim != "") {
            eval("var animLayer = new " + anim + "()");
            animLayer.init();
            this.addChild(animLayer);
        }

        //  Set game state as menu
        PiuPiuGlobals.gameState = GameStates.CutScene;

        this.listeners = [];

        //  Setup back button to exit for android
        this.listeners.push(cc.eventManager.addListener({
            swallowTouches: true,
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode, event){
                if(keyCode == cc.KEY.back || keyCode == cc.KEY.backspace)
                {
                    event.getCurrentTarget().moveToNextScene();
                }
            }
        }, this));

        this.listeners.push(cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                stopAllSounds();
                event.getCurrentTarget().moveToNextScene();
                return true;
            },
            onTouchMoved: null,
            onTouchEnded: null}, this));
    },
    moveToNextScene : function () {
        //  Reset post step callbacks
        resetPostStepCallback();
        this.onExit();
        var transition = new cc.TransitionFade(1, new PlayScene());
        cc.director.runScene(transition);
    },
    onExit : function (){
        LOG("exiting levelcut")
        for (var i = 0; i < this.listeners.length; i++) {
            cc.eventManager.removeListener(this.listeners[i]);
        }
    }
});
