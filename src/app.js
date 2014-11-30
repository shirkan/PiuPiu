
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

        ////  Set game state as menu
        //PiuPiuGlobals.gameState = GameStates.Menu;

        var winSize = cc.director.getWinSize();
        var centerpos = cc.p(winSize.width / 2, winSize.height / 2);

        //  Add background
        var spritebg = new cc.TMXTiledMap(res.grass9_tmx);
        this.addChild(spritebg);

        //  Setup menu items
        var menuItems = [];
        cc.MenuItemFont.setFontSize(44);

        //var menuItemPlay = new cc.MenuItemSprite(
        //    new cc.Sprite(res.Start_n_png), // normal state image
        //    new cc.Sprite(res.Start_s_png), //select state image
        //    this.onPlay, this);

        var labelStart = new cc.LabelTTF("Start", "Helvetica", 44);
        labelStart.setColor(cc.color(255,255,0)); //Yellow

        var menuItemPlay = new cc.MenuItemLabel(
            labelStart,
            this.onPlay, this);
        menuItems.push(menuItemPlay);

        var labelExit = new cc.LabelTTF("Exit", "Helvetica", 44);
        labelExit.setColor(cc.color(255,255,0)); //Yellow

        var menuItemExit = new cc.MenuItemLabel(
            labelExit,
            this.onExitClicked, this);
        menuItems.push(menuItemExit);

        var menu = new cc.Menu(menuItems);  //7. create the menu

        //menu.alignItemsInRows(2);
        menu.alignItemsVertically();
        menu.setPosition(centerpos);
        this.addChild(menu);

        //  Show highscore
        labelHishScore = new cc.LabelTTF("High Score: " + PiuPiuGlobals.highScore, "Helvetica", fontSize);
        labelHishScore.setColor(cc.color(255,255,0)); //  Yellow
        labelHishScore.setPosition(winSize.width / 2, 40);
        this.addChild(labelHishScore);
    },

    onPlay : function(){
        cc.log("==onplay clicked");

        cc.audioEngine.playEffect(s_music_hineZeBa);
        cc.director.runScene(new PlayScene());
    },

    onExitClicked : function () {
        cc.director.end();
    }
});

var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        layer.init();
        this.addChild(layer);
    }
});
