/**
 * Created by shirkan on 12/3/14.
 */


var IntroLayer = cc.Layer.extend({
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
        levelSprite.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - 80);
        this.addChild(levelSprite);

        //  Add goal
        var goalSprite = new cc.Sprite(res.Goal_png);
        goalSprite.anchorX = 1;
        goalSprite.setPosition(cc.p(PiuPiuGlobals.winSize.width, PiuPiuGlobals.winSize.height / 3));
        this.addChild(goalSprite);

        //  Add player
        var player = new cc.Sprite(res.Player_png);
        player.setAnchorPoint(0,0);
        player.setPosition(cc.p(player.width * -0.9, 0));
        this.addChild(player);

        //  Add ball
        var ball = new cc.Sprite(res.Ball_png);
        ball.setPosition(cc.p(player.width * 0.05, ball.height / 2));
        this.addChild(ball);

        //  Generate animation
        var playerAnimation = cc.MoveTo.create(2.5, cc.p(player.x + 200, player.y));
        var ballAnimation = new cc.Sequence(
            new cc.Spawn(cc.MoveTo.create(2.5, cc.p(player.x + (player.width * 0.95) + 200, ball.y)),
                cc.RotateBy.create(2.5, 720)),
            new cc.Spawn(cc.MoveTo.create(1, cc.p(470, 150)),
                cc.RotateBy.create(1, 1080)),
            new cc.Spawn(cc.MoveTo.create(0.5, cc.p(510, 100)),
                cc.RotateBy.create(0.5, 540)),
            new cc.Spawn(cc.MoveTo.create(2, cc.p(440, 50)),
                cc.RotateBy.create(2, 540))
        );

        //  Assign animations and go
        player.runAction(playerAnimation);
        ball.runAction(ballAnimation);
        playSound(res.sound_hineZeBa);
        this.schedule(function() { playSound(res.sound_shaar); }, 0, 0, 3.4);
    }

});

var IntroScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new IntroLayer();
        layer.init();
        this.addChild(layer);

        //  Set game state as menu
        PiuPiuGlobals.gameState = GameStates.Intro;

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

                //var pos = touch.getLocation();
                //console.log(pos.x + " " + pos.y);
                //
                stopAllSounds();
                event.getCurrentTarget().moveToNextScene();
                return true;
            },
            onTouchMoved: null,
            onTouchEnded: null}, this);
    },
    moveToNextScene : function () {
        var transition = new cc.TransitionFade(1, new PlayScene());
        cc.director.runScene(transition);
    }
});
