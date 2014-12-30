/**
 * Created by shirkan on 12/31/14.
 */

var SplashLayer = cc.LayerColor.extend({
    ctor : function(){
        //1. call super class's ctor function
        this._super();
    },
    init:function(){
        //call super class's super function
        this._super();

        //  Show logo
        var neeverland = new cc.LabelTTF("Neeverland", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeBig);
        neeverland.setFontFillColor(cc.color(255,255,255)); //White
        neeverland.setPosition(cc.p(PiuPiuGlobals.winSize.width / 2 , PiuPiuGlobals.winSize.height / 2));
        this.addChild(neeverland);

        var studios =  new cc.LabelTTF("Studios", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeBig);
        studios.setFontFillColor(cc.color(255,255,255)); //White
        studios.setPosition(cc.p(PiuPiuGlobals.winSize.width / 2 , PiuPiuGlobals.winSize.height / 2 - 50));
        this.addChild(studios);
    }
});

var SplashScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SplashLayer();
        layer.init();
        layer.bake();
        this.addChild(layer);

        //  Set game state as menu
        PiuPiuGlobals.gameState = GameStates.SplashScreen;

        //  Load level settings
        //loadLevelSettings();

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
            onTouchBegan: this.moveToNextScene.bind(this),
            onTouchMoved: function () {},
            onTouchEnded: function () {}}, this);

        cc.director.getScheduler().scheduleCallbackForTarget(this, function () { this.canContinue = true}, 0, 0, 2);
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.moveToNextScene, 0, 0, 3);
    },
    moveToNextScene : function () {
        if (!this.canContinue) {
            return;
        }
        var transition = new cc.TransitionFade(1, new MenuScene());
        cc.director.runScene(transition);
    }
});
