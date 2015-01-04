/**
 * Created by shirkan on 12/15/14.
 */

var LeaderboardLayer = cc.Layer.extend({
    loadingLabel:null,
    secondsWaiting:0,
    ctor : function(){
        this._super();

        //  Add background
        var spriteBG = new cc.TMXTiledMap(PiuPiuGlobals.commonGrassMap);
        this.addChild(spriteBG);

        //  Add Loading Sprite
        this.loadingLabel = new cc.LabelTTF("Loading...", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeBig);
        this.loadingLabel.setFontFillColor(cc.color(255,220,80)); //  Yellow
        this.loadingLabel.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
        this.loadingLabel.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height/2);
    },
    init:function() {
        this._super();
        this.addChild(this.loadingLabel);
    },
    showErrorLabel : function () {
        this.removeChild(this.loadingLabel);

        var errorLabel = new cc.LabelTTF("Error loading results... \nPlease check internet connectivity", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeStatus);
        errorLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        errorLabel.setFontFillColor(cc.color(255,220,80)); //  Yellow
        errorLabel.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
        errorLabel.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height/2);
        this.addChild(errorLabel);
    },

    showTables : function ( highscoresArr, spritesArr ) {
        this.removeChild(this.loadingLabel);

        //  High score
        var highScoreLabel = new cc.LabelTTF("High scores", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeStatus);
        highScoreLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        highScoreLabel.setFontFillColor(cc.color(255,220,80)); //  Yellow
        highScoreLabel.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
        highScoreLabel.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height - PiuPiuConsts.fontSizeNormal / 2 - 10);
        this.addChild(highScoreLabel);

        for (var i = 0; i < highscoresArr.length; i++) {
            var ordinalIndex = i+1;
            var yPos = highScoreLabel.y - PiuPiuConsts.fontSizeNormal/2 - (PiuPiuConsts.FBpictureSize * PiuPiuConsts.FBpictureScale + 5 ) *i - 10;
            var xPos = PiuPiuGlobals.winSize.width / 5;

            //  Trophy / medal logo
            var resourceSprite = eval("res.place" + ordinalIndex + "_png");
            var placeSprite = new cc.Sprite(resourceSprite);
            placeSprite.setPosition(xPos ,yPos);
            this.addChild(placeSprite);
            xPos += placeSprite.width + 10;

            //  Profile picture
            if (!cc.sys.isMobile) {
                var pictureSprite = spritesArr[highscoresArr[i].id];
                var pictureStencil = new cc.Sprite(res.stencil_png);
                var pictureClip = new cc.ClippingNode();
                pictureClip.setInverted(true);
                pictureClip.setStencil(pictureStencil);
                pictureClip.addChild(pictureSprite, 1);
                pictureClip.addChild(pictureStencil, 2);
                pictureClip.setAlphaThreshold(0);
                pictureClip.setContentSize(cc.size(pictureSprite.getContentSize().width / 2, pictureSprite.getContentSize().height / 2));
                pictureClip.setPosition(xPos, yPos);
                pictureClip.setScale(PiuPiuConsts.FBpictureScale);
                this.addChild(pictureClip);
            }
            xPos += PiuPiuConsts.FBpictureSize * PiuPiuConsts.FBpictureScale + 10;

            //  Name
            var labelName = new cc.LabelTTF(highscoresArr[i].name.toString(), PiuPiuConsts.fontName, PiuPiuConsts.fontSizeStatus);
            labelName.setFontFillColor(cc.color(255,220,80)); //  Yellow
            labelName.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
            labelName.anchorX = 0;
            xPos = PiuPiuGlobals.winSize.width / 2 - highScoreLabel.width / 2;
            labelName.setPosition(xPos, yPos);
            this.addChild(labelName);

            //  Score
            xPos = PiuPiuGlobals.winSize.width * 3 / 4;
            var labelScore = new cc.LabelTTF(highscoresArr[i].score.toString(), PiuPiuConsts.fontName, PiuPiuConsts.fontSizeStatus);
            labelScore.anchorX = 0;
            labelScore.setFontFillColor(cc.color(255,220,80)); //  Yellow
            labelScore.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
            labelScore.setPosition(xPos, yPos);
            this.addChild(labelScore);
        }


        ////  Total score
        //var totalScoreLabel = new cc.LabelTTF("Total scores", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeStatus);
        //totalScoreLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        //totalScoreLabel.setFontFillColor(cc.color(255,220,80)); //  Yellow
        //totalScoreLabel.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
        //totalScoreLabel.setPosition(PiuPiuGlobals.winSize.width * 3 / 4 , PiuPiuGlobals.winSize.height - PiuPiuConsts.fontSizeNormal / 2 - 10);
        //this.addChild(totalScoreLabel);
    }
});

var LeaderboardScene = cc.Scene.extend({
    layer:null,
    backEnabled:false,
    highscoresArr: null,
    spritesArr: null,
    loadDataCounter:0,
    secondsWaiting:0,
    ctor:function () {
        this._super();
        this.layer = new LeaderboardLayer();
        this.addChild(this.layer);

        //  Setup back button to exit for android
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode, event){
                if(keyCode == cc.KEY.back || keyCode == cc.KEY.backspace)
                {
                    LOG("LEADERBOARD back");
                    event.getCurrentTarget().moveToNextScene();
                    return true;
                }
            }
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                LOG("LEADERBOARD touch click");
                event.getCurrentTarget().moveToNextScene();
                return true;
            },
            onTouchMoved: null,
            onTouchEnded: null}, this);
    },
    onEnter:function () {
        this._super();
        this.layer.init();

        //  Set game state as menu
        PiuPiuGlobals.gameState = GameStates.Leaderboard;

        if (cc.sys.platform != cc.sys.ANDROID) {
            //  Get FB data
            PiuPiuGlobals.FBallScoresData = [];
            this.secondsWaiting = 0;
            FBgetAllScores(this, this.successGettingResults, this.errorGettingResults);
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.waitForResults, 1, PiuPiuConsts.FBwaitForResultsInSeconds);
        } else {
            this.successGettingResults();
        }
    },
    moveToNextScene : function () {
        if (!this.backEnabled) {
            return;
        }

        if (this.spritesArr) {
            for (var id in this.spritesArr) {
                LOG("releasing id " + id);
                this.spritesArr[id].release();
            }
        }
        var transition = new cc.TransitionFade(1, new MenuScene());
        cc.director.runScene(transition);
    },

    waitForResults : function () {
        var loadStr = "Loading."
        for (var i=0; i < (this.secondsWaiting % 3); i++) {
            loadStr += ".";
        }

        this.secondsWaiting++;
        this.layer.loadingLabel.setString(loadStr);

        if (this.secondsWaiting > PiuPiuConsts.FBwaitForResultsInSeconds) {
            this.errorGettingResults();
        }
    },

    errorGettingResults : function () {
        cc.director.getScheduler().unscheduleCallbackForTarget(this, this.waitForResults);
        this.backEnabled = true;

        this.layer.showErrorLabel();
    },

    successGettingResults : function () {

        LOG("Leaderbboard parse results:\n" + PiuPiuGlobals.FBallScoresData.length);
        this.loadDataCounter = Math.min(PiuPiuGlobals.FBallScoresData.length, PiuPiuConsts.FBleaderboardShowTop);
        this.highscoresArr = [];
        this.spritesArr = [];
        //var totalscores = [];
        for (var i = 0; (i < this.loadDataCounter); i++) {
            LOG("Leaderbboard parse results for " + i + ":\n" + PiuPiuGlobals.FBallScoresData[i]);
            this.highscoresArr[i] = [];
            var id = PiuPiuGlobals.FBallScoresData[i].user.id;
            var name = PiuPiuGlobals.FBallScoresData[i].user.name;
            var score = PiuPiuGlobals.FBallScoresData[i].score;

            this.highscoresArr[i].id = id;
            this.highscoresArr[i].name = name;
            this.highscoresArr[i].score = score;

            LOG("name: " + name + "     score: " +score );
            if (!cc.sys.isMobile) {
                FBgetPicture(id, this, this.addSpriteForUser);
            } else {

                this.alteraddSpriteForUser(id);
            }
        }

        if (cc.sys.isMobile) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.waitForResults);
            this.layer.showTables(this.highscoresArr, this.spritesArr);
            this.backEnabled = true;
        }
    },

    alteraddSpriteForUser : function (id, imageURL) {
        var sprite = new cc.Sprite();
        this.spritesArr[id] = sprite;
        this.spritesArr[id].retain();

        console.log("addSpriteForUser added sprite for id " + id)

        this.loadDataCounter--;
        this.isCompleteResults();
    },

    addSpriteForUser : function (id, imageURL) {
        var self = this;

        cc.loader.loadImg(imageURL, {isCrossOrigin : true}, function(err, texture)
        {
            self.spritesArr[id] = new cc.Sprite(imageURL);
            self.spritesArr[id].retain();

            LOG("addSpriteForUser added sprite for id " + id)

            self.loadDataCounter--;
            self.isCompleteResults();
        });
    },

    isCompleteResults : function () {
        if (this.loadDataCounter == 0) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.waitForResults);
            this.backEnabled = true;
            console.log("isCompleteResults completed!");

            //this.highscoresArr[2] = []
            //this.highscoresArr[2].id = 2;
            //this.highscoresArr[2].name = "Piu Piu player";
            //this.highscoresArr[2].score = 10;
            //this.spritesArr[2] = new cc.Sprite();
            //
            //this.highscoresArr[3] = []
            //this.highscoresArr[3].id = 3;
            //this.highscoresArr[3].name = "John Doe";
            //this.highscoresArr[3].score = 9;
            //this.spritesArr[3] = new cc.Sprite();
            //
            //this.highscoresArr[4] = []
            //this.highscoresArr[4].id = 4;
            //this.highscoresArr[4].name = "John dohhhhh";
            //this.highscoresArr[4].score = 8;
            //this.spritesArr[4] = new cc.Sprite();
            //
            //this.highscoresArr[5] = []
            //this.highscoresArr[5].id = 5;
            //this.highscoresArr[5].name = "Wanka's Willie";
            //this.highscoresArr[5].score = 7;
            //this.spritesArr[5] = new cc.Sprite();
            //
            //this.highscoresArr[6] = []
            //this.highscoresArr[6].id = 6;
            //this.highscoresArr[6].name = "Haver Shelanu";
            //this.highscoresArr[6].score = 1;
            //this.spritesArr[6] = new cc.Sprite();
            
            
            this.layer.showTables(this.highscoresArr, this.spritesArr);
        }
    }
});
