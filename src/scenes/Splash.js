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
        var logoSprite = new cc.LabelTTF("Neeverland\nStudios", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeBig);
        logoSprite.setFontFillColor(cc.color(255,255,255)); //White
        logoSprite.setPosition(cc.p(PiuPiuGlobals.winSize.width / 2 , PiuPiuGlobals.winSize.height / 2));
        logoSprite.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        this.addChild(logoSprite);
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
        this.canContinue = true
        cc.director.getScheduler().scheduleCallbackForTarget(this, function () { this.canContinue = true}, 0, 0, 2);
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.moveToNextScene, 0, 0, 3);
        this.loadAll();
    },

    moveToNextScene : function () {
        if (!this.canContinue) {
            return false;
        }
        var transition = new cc.TransitionFade(1, new MenuScene());
        cc.director.runScene(transition);
        return true;
    },

    loadAll : function () {
        //  Load stats
        loadStats();

        //  Loads hands
        LOG("adding sprites frame for hands");
        cc.spriteFrameCache.addSpriteFrames(res.Hands_plist);

        //  Init Facebook
        FBinit();

        handleHighScore();

        //  Load all levels
        //  PAY ATTENTION! THIS CAUSE A FAILURE AND STOPS LOADING OTHER THINGS AFTERWARDS!
        loadAllLevels();
    }
});
