
var MenuLayer = cc.Layer.extend({
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

        //  Set game state as menu
        PiuPiuGlobals.gameState = GameStates.Menu;

        //  Add background
        var spritebg = new cc.TMXTiledMap(PiuPiuGlobals.commonGrassMap);
        this.addChild(spritebg);

        //  Setup menu items
        this.createMenu();

        //  Show highscore
        labelHishScore = new cc.LabelTTF("High Score: " + PiuPiuGlobals.highScore, "Helvetica", fontSize);
        labelHishScore.setColor(cc.color(255,255,0)); //  Yellow
        labelHishScore.setPosition(PiuPiuGlobals.winSize.width / 2, 40);
        this.addChild(labelHishScore);
    },

    createMenu : function () {
        var menuItems = [];

        //var menuItemPlay = new cc.MenuItemSprite(
        //    new cc.Sprite(res.Start_n_png), // normal state image
        //    new cc.Sprite(res.Start_s_png), //select state image
        //    this.onPlay, this);

        //  Start
        var labelStart = new cc.LabelTTF("Start", "Helvetica", 44);
        labelStart.setColor(cc.color(255,255,0)); //Yellow

        var menuItemPlay = new cc.MenuItemLabel(
            labelStart,
            this.onPlay, this);
        menuItems.push(menuItemPlay);

        var labelAchievements = new cc.LabelTTF("Acheivements", "Helvetica", 44);
        labelAchievements.setColor(cc.color(255,255,0)); //Yellow

        var menuItemAchievements = new cc.MenuItemLabel(
            labelAchievements,
            this.onAchievements, this);
        menuItems.push(menuItemAchievements);

        //  Exit
        var labelExit = new cc.LabelTTF("Exit", "Helvetica", 44);
        labelExit.setColor(cc.color(255,255,0)); //Yellow

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
        cc.log("==onplay clicked");

        cc.audioEngine.playEffect(s_music_hineZeBa);
        cc.director.runScene(new PlayScene());
    },

    onExitClicked : function () {
        cc.director.end();
    },

    onAchievements : function () {
        console.log("achievements clicked");
    }

});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);

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
