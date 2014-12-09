
var MenuLayer = cc.Layer.extend({
    labelSound:null,
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
    },

    createMenu : function () {
        var menuItems = [];

        //  Start
        var labelStart = new cc.LabelTTF("Start", "Helvetica", 44);
        labelStart.setColor(cc.color(255,255,0)); //Yellow
        //labelStart.enableOutline((255,0,0),5);
        labelStart.enableStroke(cc.color(0,0,255), 2); //Blue

        var menuItemPlay = new cc.MenuItemLabel(
            labelStart,
            this.onPlay, this);
        menuItems.push(menuItemPlay);

        //  Sound on/off
        this.labelSound = new cc.LabelTTF("Sound on", "Helvetica", 44);
        this.labelSound.setColor(cc.color(255,255,0)); //Yellow
        //labelStart.enableOutline((255,0,0),5);
        this.labelSound.enableStroke(cc.color(0,0,255), 2); //Blue

        if (PiuPiuGlobals.soundEnabled == 0) {
            this.labelSound.setString("Sound off");
        }

        var menuItemSound = new cc.MenuItemLabel(
            this.labelSound,
            this.onModifySound, this);
        menuItems.push(menuItemSound);

        //  Statistics
        var labelStatistics = new cc.LabelTTF("Statistics", "Helvetica", 44);
        labelStatistics.setColor(cc.color(255,255,0)); //Yellow
        labelStatistics.enableStroke(cc.color(0,0,255), 2);

        var menuItemStatistics = new cc.MenuItemLabel(
            labelStatistics,
            this.onStatistics, this);
        menuItems.push(menuItemStatistics);

        //  Leaderboard
        var labelLeaderboard = new cc.LabelTTF("Leaderboard", "Helvetica", 44);
        labelLeaderboard.setColor(cc.color(255,255,0)); //Yellow
        labelLeaderboard.enableStroke(cc.color(0,0,255), 2);

        var menuItemLeaderboard = new cc.MenuItemLabel(
            labelLeaderboard,
            this.onLeaderboard, this);
        menuItems.push(menuItemLeaderboard);

        //  Achievements
        var labelAchievements = new cc.LabelTTF("Acheivements", "Helvetica", 44);
        labelAchievements.setColor(cc.color(255,255,0)); //Yellow
        labelAchievements.enableStroke(cc.color(0,0,255), 2); //Blue

        var menuItemAchievements = new cc.MenuItemLabel(
            labelAchievements,
            this.onAchievements, this);
        menuItems.push(menuItemAchievements);

        //  Exit
        var labelExit = new cc.LabelTTF("Exit", "Helvetica", 44);
        labelExit.setColor(cc.color(255,255,0)); //Yellow
        labelExit.enableStroke(cc.color(0,0,255), 2); //Blue

        var menuItemExit = new cc.MenuItemLabel(
            labelExit,
            this.onExitClicked, this);
        menuItems.push(menuItemExit);

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
    },

    onLeaderBoard : function () {
        console.log("leaderboard clicked");
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
    }

});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
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
            }
        }, this);
    },
    onExitClicked : function () {
        cc.director.end();
    }
});
