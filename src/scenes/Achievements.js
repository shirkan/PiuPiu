/**
 * Created by shirkan on 12/15/14.
 */

var AchievementsLayer = cc.Layer.extend({
    loadingLabel:null,
    secondsWaiting:0,
    ctor : function(){
        this._super();
    },
    init:function() {
        this._super();

        //  Add background
        var spriteBG = new cc.Sprite(PiuPiuGlobals.commonGrassMap);
        this.addChild(spriteBG);
    },
    test: function ( ) {
        var size = PiuPiuGlobals.winSize;

        var clip = this.clipper();
        var clipSize = clip.getContentSize();
        clip.setPosition(cc.p(size.width / 2, size.height / 2));
        var gameTitle = new cc.Sprite("https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/v/t1.0-1/c23.101.380.380/s40x40/1185708_10151702829728197_1243295359_n.jpg?oh=1e0e9c55087076b0104f06f1848d8fec&oe=553EE8C0&__gda__=1427216806_967de4fa188d3d927b3b350615152f92");
        var spark = new cc.Sprite(res.stencil_png);
        clip.addChild(gameTitle, 1);//before add gametitle, it will be all display
        spark.setPosition(-size.width / 2,0);
        clip.addChild(spark,2);//will be cut
        this.addChild(clip,4);

        //var moveAction = cc.MoveTo.create(0.6, cc.p(clipSize.width, 0));
        //var moveBackAction = cc.MoveTo.create(0.6, cc.p(-clipSize.width, 0));
        //var seq = new cc.Sequence(moveAction, moveBackAction);
        //var repeatAction = cc.RepeatForever.create(seq);
        //spark.runAction(repeatAction);//do move left to right and right to left action

    },

    clipper : function (){  //create a template that its size is the same as the game title picture
        var clipper = new cc.ClippingNode();
        var gameTitle = new cc.Sprite("https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/v/t1.0-1/c23.101.380.380/s40x40/1185708_10151702829728197_1243295359_n.jpg?oh=1e0e9c55087076b0104f06f1848d8fec&oe=553EE8C0&__gda__=1427216806_967de4fa188d3d927b3b350615152f92");
        clipper.setStencil(gameTitle);
        clipper.setAlphaThreshold(1);
        clipper.setContentSize(cc.size(gameTitle.getContentSize().width, gameTitle.getContentSize().height));
        return clipper;
    }

});

var AchievementsScene = cc.Scene.extend({
    layer:null,
    backEnabled:false,
    highscoresArr: null,
    spritesArr: null,
    loadDataCounter:0,
    onEnter:function () {
        this._super();
        this.layer = new AchievementsLayer();
        this.layer.init();
        this.addChild(this.layer);

        //  Set game state as menu
        PiuPiuGlobals.gameState = GameStates.Leaderboard;

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
                event.getCurrentTarget().moveToNextScene();
                return true;
            },
            onTouchMoved: null,
            onTouchEnded: null}, this);

        this.layer.test();

    },
    moveToNextScene : function () {
        cc.director.popScene();
    }
});
