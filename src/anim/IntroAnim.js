/**
 * Created by shirkan on 12/3/14.
 */


var IntroAnim = cc.Layer.extend({
    enemy1: null,
    enemy2: null,
    enemy3: null,
    ctor : function(){
        this._super();
    },
    init:function() {
        this._super();

        //  Add background
        var spriteBG = new cc.TMXTiledMap(PiuPiuGlobals.commonGrassMap);
        this.addChild(spriteBG);

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

        //  Add enemy
        this.enemy1 = new cc.Sprite(res.Enemy_png);
        this.enemy1.setPosition(cc.p(PiuPiuGlobals.winSize.width - this.enemy1.width / 2, PiuPiuGlobals.winSize.height + this.enemy1.height / 2));
        this.addChild(this.enemy1);

        //  Add enemy
        this.enemy2 = new cc.Sprite(res.Enemy_png);
        this.enemy2.setPosition(cc.p(PiuPiuGlobals.winSize.width + this.enemy2.width / 2, PiuPiuGlobals.winSize.height + this.enemy1.height / 2));
        this.addChild(this.enemy2);

        //  Add enemy
        this.enemy3 = new cc.Sprite(res.Enemy_png);
        this.enemy3.setPosition(cc.p(PiuPiuGlobals.winSize.width + this.enemy3.width / 2, PiuPiuGlobals.winSize.height - this.enemy1.height / 2));
        this.addChild(this.enemy3);

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
                cc.RotateBy.create(2, 540)),
            new cc.CallFunc(this.triggerEnemies.bind(this), this)
        );

        //  Assign animations and go
        player.runAction(playerAnimation);
        ball.runAction(ballAnimation);
        playSound(res.sound_hineZeBa);
        this.schedule(function() { playSound(res.sound_shaar); }, 0, 0, 3.4);
    },
    triggerEnemies : function () {
        this.enemy1.runAction(cc.MoveBy.create(1.5, cc.p(-this.enemy2.width , -this.enemy1.height)));
        this.enemy2.runAction(cc.MoveBy.create(1.5, cc.p(-this.enemy2.width, -this.enemy1.height)));
        this.enemy3.runAction(cc.MoveBy.create(1.5, cc.p(-this.enemy3.width, -this.enemy1.height)));
    }

});

var IntroScene = cc.Scene.extend({
    listeners:null,
    onEnter:function () {
        this._super();
        var layer = new IntroAnim();
        layer.init();
        this.addChild(layer);

        //  Set game state as menu
        PiuPiuGlobals.gameState = GameStates.Intro;

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

                //var pos = touch.getLocation();
                //console.log(pos.x + " " + pos.y);
                //
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

        //cc.eventManager.removeListener(this.listener);
        this.onExit();
        var transition = new cc.TransitionFade(1, PiuPiuGlobals.scenes.levelCutScene);
        cc.director.runScene(transition);
    },
    onExit : function (){
        LOG("exiting intro")
        for (var i = 0; i < this.listeners.length; i++) {
            cc.eventManager.removeListener(this.listeners[i]);
        }
    }
});
