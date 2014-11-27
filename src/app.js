
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

        var winSize = cc.director.getWinSize();
        var centerpos = cc.p(winSize.width / 2, winSize.height / 2);

        //  Add background
        var spritebg = new cc.TMXTiledMap(res.grass9_tmx);
        this.addChild(spritebg);

        //  Setup menu items
        cc.MenuItemFont.setFontSize(60);

        var menuItemPlay= new cc.MenuItemSprite(
            new cc.Sprite(res.Start_n_png), // normal state image
            new cc.Sprite(res.Start_s_png), //select state image
            this.onPlay, this);
        var menu = new cc.Menu(menuItemPlay);  //7. create the menu
        menu.setPosition(centerpos);
        this.addChild(menu);


        //  Show highscore
        labelHishScore = new cc.LabelTTF("High Score: " + PiuPiuGlobals.highScore, "Helvetica", fontSize);
        labelHishScore.setColor(cc.color(255,255,0)); //  Yellow
        labelHishScore.setPosition(winSize.width / 2, winSize.height / 2 - 40);
        this.addChild(labelHishScore);
    },

    onPlay : function(){
        cc.log("==onplay clicked");

        //var audioEngine = cc.AudioEngine.getInstance();
        cc.audioEngine.playEffect(s_music_hineZeBa);

        cc.director.runScene(new PlayScene());

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
