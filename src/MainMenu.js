
var MenuLayer = cc.Layer.extend({
    labelSound:null,
    facebookSprite:null,
    isAnimatingFBLogin:false,
    ctor : function(){
        //1. call super class's ctor function
        this._super();
    },
    init:function(){
        //call super class's super function
        this._super();

        //  Check for highscore
        if (cc.sys.localStorage.highScore) {
            PiuPiuGlobals.highScore = cc.sys.localStorage.highScore;
        }

        //  Add background
        var spriteBG = new cc.TMXTiledMap(PiuPiuGlobals.commonGrassMap);
        this.addChild(spriteBG);

        //  Setup menu items
        this.createMenu();

        //  Check if need to add facebook login image
        this.checkFacebook();
    },

    createMenu : function () {
        var menuItems = [];

        //  Start
        var labelStart = new cc.LabelTTF("Start", "Helvetica", PiuPiuConsts.fontSize);
        labelStart.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelStart.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue

        var menuItemPlay = new cc.MenuItemLabel(
            labelStart,
            this.onPlay, this);
        menuItems.push(menuItemPlay);

        //  Sound on/off
        this.labelSound = new cc.LabelTTF("Sound on", "Helvetica", PiuPiuConsts.fontSize);
        this.labelSound.setFontFillColor(cc.color(255,220,80)); //Yellow
        this.labelSound.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue

        if (PiuPiuGlobals.soundEnabled == 0) {
            this.labelSound.setString("Sound off");
        }

        var menuItemSound = new cc.MenuItemLabel(
            this.labelSound,
            this.onModifySound, this);
        menuItems.push(menuItemSound);

        //  Statistics
        var labelStatistics = new cc.LabelTTF("Statistics", "Helvetica", PiuPiuConsts.fontSize);
        labelStatistics.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelStatistics.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize);

        var menuItemStatistics = new cc.MenuItemLabel(
            labelStatistics,
            this.onStatistics, this);
        menuItems.push(menuItemStatistics);

        //  Leaderboard
        var labelLeaderboard = new cc.LabelTTF("Leaderboard", "Helvetica", PiuPiuConsts.fontSize);
        labelLeaderboard.setFontFillColor(cc.color(255,220,80)); //Blue
        labelLeaderboard.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize);

        var menuItemLeaderboard = new cc.MenuItemLabel(
            labelLeaderboard,
            this.onLeaderboard, this);
        menuItems.push(menuItemLeaderboard);

        //  Achievements
        var labelAchievements = new cc.LabelTTF("Acheivements", "Helvetica", PiuPiuConsts.fontSize);
        labelAchievements.setFontFillColor(cc.color(255,220,80)); //Blue
        labelAchievements.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue

        var menuItemAchievements = new cc.MenuItemLabel(
            labelAchievements,
            this.onAchievements, this);
        menuItems.push(menuItemAchievements);

        var menu = new cc.Menu(menuItems);

        menu.alignItemsVertically();

        var centerpos = cc.p(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height / 2);

        menu.setPosition(centerpos);
        this.addChild(menu);
    },

    onPlay : function(){
        PiuPiuGlobals.currentLevel++;
        cc.director.runScene(new IntroScene());
    },

    onExitClicked : function () {
        cc.director.end();
    },

    onAchievements : function () {
        console.log("achievements clicked");

        if (!FBisLoggedIn()) {
            this.animateLoginToFB();
        }

        FBgetScore();
    },

    onLeaderboard : function () {
        console.log("leaderboard clicked");

        if (!FBisLoggedIn()) {
            this.animateLoginToFB();
        }

        FBgetAllScores();

        return;
        //var facebook = plugin.FacebookAgent.getInstance();
        var info = {
            "app_id": PiuPiuConsts.FB_appid,
            "message": "Piu Piu is a great game!",
            "title": "Piu Piu"
        };
        var facebook = plugin.FacebookAgent.getInstance();
        facebook.appRequest(info, function (code, msg) {
            if(code == plugin.FacebookAgent.CODE_SUCCEED){
                cc.log("Sending request succeeded, code #" + code + ": " + msg.toString());
            } else {
                cc.log("Sending request failed, error #" + code + ": " + msg.toString());
            }
        });
    },


    onStatistics : function () {
        var transition = new cc.TransitionFade(1, new StatsScene());
        cc.director.runScene(transition);
    },

    onModifySound : function () {
        cc.sys.localStorage.soundEnabled = PiuPiuGlobals.soundEnabled = 1 - PiuPiuGlobals.soundEnabled;
        if (PiuPiuGlobals.soundEnabled == 0) {
            this.labelSound.setString("Sound off");
        } else {
            this.labelSound.setString("Sound on");
        }
    },

    checkFacebook : function () {
        if (FBisLoggedIn()) {
            return;
        }

        this.facebookSprite = new cc.Sprite(res.FB_png);
        this.facebookSprite.setPosition(cc.p(PiuPiuGlobals.winSize.width - 20 , 20));
        this.addChild(this.facebookSprite);

        //var scoreSprite = new cc.LabelTTF("", "Helvetica", PiuPiuConsts.fontSize);
        //scoreSprite.setPosition(cc.p(PiuPiuGlobals.winSize.width * 0.85, PiuPiuGlobals.winSize.height * 0.1));
        //this.addChild(scoreSprite);

        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
            swallowTouches: true,
            //onTouchBegan event callback function
            onTouchBegan: function (touch, event) {
                // event.getCurrentTarget() returns the *listener's* sceneGraphPriority node.
                var target = event.getCurrentTarget();

                //Get the position of the current point relative to the button
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                //Check the click area
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    FBlogin();
                    return true;
                }
                return false;
            }
        });
        cc.eventManager.addListener(listener1, this.facebookSprite);
    },

    animateLoginToFB : function () {
        if (this.isAnimatingFBLogin) {
            return;
        }
        var labelSprite = new cc.LabelTTF("You must login to Facebook to enable this feature->", "Helvetica", 22);
        labelSprite.anchorX = 1;
        labelSprite.setPosition(cc.p(0, 20));
        labelSprite.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelSprite.enableStroke(cc.color(0,0,255), 2); // Blue
        this.addChild(labelSprite);

        var labelAnimation = new cc.Sequence(
            cc.MoveBy.create(1, cc.p(PiuPiuGlobals.winSize.width - (this.facebookSprite.width + 10 + 5), 0)).easing(cc.easeOut(3)),
            cc.DelayTime.create(2.5),
            cc.MoveBy.create(1.5, cc.p(-(PiuPiuGlobals.winSize.width - (this.facebookSprite.width + 10 + 5)), 0)).easing(cc.easeIn(3)),
            new cc.CallFunc(function() { this.removeFromParent()}, labelSprite),
            new cc.CallFunc(function() { this.isAnimatingFBLogin = false}, this)
        );

        //  Bouncing FB logo animation
        var bouncingAnimation = new cc.Sequence(
            cc.DelayTime.create(1),
            cc.Repeat.create(new cc.Sequence(
                cc.MoveBy.create(0.1, cc.p(0,40)),
                cc.MoveBy.create(0.8, cc.p(0,-40)).easing(cc.easeBounceOut(1))
            ), 3)
        );

        labelSprite.runAction(labelAnimation);
        this.facebookSprite.runAction(bouncingAnimation);
        this.isAnimatingFBLogin = true;
    }

});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        layer.bake();
        this.addChild(layer);

        //  Set game state as menu
        PiuPiuGlobals.gameState = GameStates.Menu;
        PiuPiuGlobals.currentLevel = 0;

        //  Setup back button to exit for android
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode, event){
                if(keyCode == cc.KEY.back || keyCode == cc.KEY.backspace)
                {
                    event.getCurrentTarget().onExitClicked();
                }

                //FACEBOOK logout walkaround
                if(keyCode == cc.KEY.l) {
                    FBlogout();
                }
            }
        }, this);
    },
    onExitClicked : function () {
        cc.director.end();
    }
});
