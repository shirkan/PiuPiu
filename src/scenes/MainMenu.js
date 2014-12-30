
var MenuLayer = cc.Layer.extend({
    labelSound:null,
    facebookSprite:null,
    isAnimatingFBLogin:false,
    isBouncingFBLogo:false,
    ctor : function(){
        //1. call super class's ctor function
        this._super();
    },
    init:function(){
        //call super class's super function
        this._super();

        //  Add background
        var spriteBG = new cc.TMXTiledMap(PiuPiuGlobals.commonGrassMap);
        this.addChild(spriteBG);

        //  Setup menu items
        this.createMenu();

        //  Check if need to add facebook login image
        FBisLoggedIn(this, FBonLoginUpdates(), this.showFacebookLogo);
    },

    createMenu : function () {
        var menuItems = [];

        //  Start
        var labelStart = new cc.LabelTTF("Start", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeNormal);
        labelStart.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelStart.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue

        var menuItemPlay = new cc.MenuItemLabel(
            labelStart,
            this.onPlay, this);
        menuItems.push(menuItemPlay);

        //  Sound on/off
        this.labelSound = new cc.LabelTTF("Sound on", "res/fonts/arcadepi.ttf", PiuPiuConsts.fontSizeNormal);
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
        var labelStatistics = new cc.LabelTTF("Statistics", "assets/res/fonts/arcadepi.ttf", PiuPiuConsts.fontSizeNormal);
        labelStatistics.setFontFillColor(cc.color(255,220,80)); //Yellow
        labelStatistics.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize);

        var menuItemStatistics = new cc.MenuItemLabel(
            labelStatistics,
            this.onStatistics, this);
        menuItems.push(menuItemStatistics);

        //  Leaderboard
        var labelLeaderboard = new cc.LabelTTF("Leaderboard", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeNormal);
        labelLeaderboard.setFontFillColor(cc.color(255,220,80)); //Blue
        labelLeaderboard.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize);

        var menuItemLeaderboard = new cc.MenuItemLabel(
            labelLeaderboard,
            this.onLeaderboard, this);
        menuItems.push(menuItemLeaderboard);

        //  Achievements
        var labelAchievements = new cc.LabelTTF("Acheivements", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeNormal);
        labelAchievements.setFontFillColor(cc.color(255,220,80)); //Blue
        labelAchievements.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue

        var menuItemAchievements = new cc.MenuItemLabel(
            labelAchievements,
            this.onAchievements, this);
        menuItems.push(menuItemAchievements);

        var menu = new cc.Menu(menuItems);

        menu.alignItemsVertically();

        menu.setPosition(cc.p(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height / 2 + 30 ));
        this.addChild(menu);
    },

    onPlay : function(){
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
        return;
        var transition = new cc.TransitionFade(1, new AchievementsScene());
        cc.director.pushScene(transition);
    },

    onLeaderboard : function () {
        console.log("leaderboard clicked");

        if (!FBisLoggedIn()) {
            this.animateLoginToFB();
            return;
        }

        //FBgetAllScores();
        var transition = new cc.TransitionFade(1, new LeaderboardScene());
        cc.director.pushScene(transition);

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

    showFacebookLogo : function () {

        this.facebookSprite = new cc.Sprite(res.FB_png);
        this.facebookSprite.setPosition(cc.p(PiuPiuGlobals.winSize.width - 30 , 50));
        this.addChild(this.facebookSprite);

        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
            swallowTouches: true,
            //onTouchBegan event callback function
            onTouchBegan: function (touch, event) {
                // event.getCurrentTarget() returns the *listener's* sceneGraphPriority node.
                var target = event.getCurrentTarget();
                var parent = target.parent;

                //Get the position of the current point relative to the button
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                //Check the click area
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    FBlogin(parent, function () { this.removeChild(this.facebookSprite)} );
                    return true;
                }
                return false;
            }
        });
        cc.eventManager.addListener(listener1, this.facebookSprite);
    },

    animateLoginToFB : function () {
        if (! this.isBouncingFBLogo) {
            //  Bouncing FB logo animation
            var bouncingAnimation = new cc.Sequence(
                cc.DelayTime.create(0),
                cc.Repeat.create(new cc.Sequence(
                    cc.MoveBy.create(0.1, cc.p(0,40)),
                    cc.MoveBy.create(0.8, cc.p(0,-40)).easing(cc.easeBounceOut(1))
                ), 3),
                new cc.CallFunc(function() { this.isBouncingFBLogo = false}, this)
            );
            this.isBouncingFBLogo = true;
            this.facebookSprite.runAction(bouncingAnimation);
        }
        if (!this.isAnimatingFBLogin) {
            var labelSprite = new cc.LabelTTF("You must login to Facebook to enable this feature. We are *NOT* going to post anything on your wall/timeline without clearly stating so.",
                PiuPiuConsts.fontName, PiuPiuConsts.fontSizeSmall);
            labelSprite.anchorX = 0;
            //labelSprite.anchorX = 1;
            //labelSprite.setPosition(cc.p(0, 20));
            labelSprite.setPosition(cc.p(PiuPiuGlobals.winSize.width, 20));
            labelSprite.setFontFillColor(cc.color(255,220,80)); //Yellow
            labelSprite.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSizeSmall); // Blue
            this.addChild(labelSprite);

            var labelAnimation = new cc.Sequence(
                cc.MoveBy.create(15, cc.p(-(PiuPiuGlobals.winSize.width + labelSprite.width), 0)),
                new cc.CallFunc(function() { this.removeFromParent()}, labelSprite),
                new cc.CallFunc(function() { this.isAnimatingFBLogin = false}, this)
            );

            this.isAnimatingFBLogin = true;
            labelSprite.runAction(labelAnimation);
        }
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
        PiuPiuGlobals.currentLevel = 1;
        //  Load level settings
        loadLevelSettings();

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
                if(keyCode == cc.KEY.d) {
                    FBdeleteMe();
                }
                if(keyCode == cc.KEY.p) {
                    FBgetPicture("me", event.getCurrentTarget(), event.getCurrentTarget().addimage);

                }
            }
        }, this);
    },
    onExitClicked : function () {
        cc.director.end();
    },
    addimage : function (userid, url) {

        var sprite = new cc.Sprite(url);
        //var tex = cc.textureCache.addImage(url);
        //sprite.setTexture(tex);
        sprite.setPosition(cc.p(110,110));
        this.addChild(sprite);
    }
});
