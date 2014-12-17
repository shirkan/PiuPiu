/**
 * Created by shirkan on 12/15/14.
 */

var LeaderboardLayer = cc.Layer.extend({
    loadingLabel:null,
    secondsWaiting:0,
    ctor : function(){
        this._super();
    },
    init:function() {
        this._super();

        //  Add background
        var spriteBG = new cc.TMXTiledMap(PiuPiuGlobals.commonGrassMap);
        this.addChild(spriteBG);

        //  Add Loading Sprite
        this.loadingLabel = new cc.LabelTTF("Loading...", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeBig);
        this.loadingLabel.setFontFillColor(cc.color(255,220,80)); //  Yellow
        this.loadingLabel.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
        this.loadingLabel.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height/2);
        this.addChild(this.loadingLabel);
    },
    showErrorLabel : function () {
        this.removeChild(this.loadingLabel);

        var errorLabel = new cc.LabelTTF("Error loading results... \nPlease check internet connectivity", PiuPiuConsts.fontName, PiuPiuConsts.fontSizeStatus);
        errorLabel.textAlign = cc.TEXT_ALIGNMENT_CENTER;
        errorLabel.setFontFillColor(cc.color(255,220,80)); //  Yellow
        errorLabel.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
        errorLabel.setPosition(PiuPiuGlobals.winSize.width / 2, PiuPiuGlobals.winSize.height/2);
        this.layer.addChild(errorLabel);
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
            var yPos = highScoreLabel.y - PiuPiuConsts.fontSizeNormal/2 - (PiuPiuGlobals.FBpictureSize + 5 ) *i - 10;
            var xPos = PiuPiuGlobals.winSize.width / 5;
            console.log("xPos0: " + xPos);

            //  Trophy / medal logo
            var placeSprite = new cc.Sprite(eval("res.place" + ordinalIndex +"_png"));
            placeSprite.setPosition(xPos ,yPos);
            this.addChild(placeSprite);
            xPos += placeSprite.width + 10;
            console.log("xPos1: " + xPos);

            //  Profile picture
            var pictureSprite = spritesArr[highscoresArr[i].id];
            var pictureStencil = new cc.Sprite(res.stencil_png);
            var pictureClip = new cc.ClippingNode();
            pictureClip.setInverted(true);
            pictureClip.setStencil(pictureStencil);
            pictureClip.addChild(pictureSprite, 1);
            pictureClip.addChild(pictureStencil, 2);
            pictureClip.setAlphaThreshold(0);
            pictureClip.setContentSize(cc.size(pictureSprite.getContentSize().width/2, pictureSprite.getContentSize().height/2));
            pictureClip.setPosition( xPos, yPos);
            this.addChild(pictureClip);
            xPos += PiuPiuGlobals.FBpictureSize + 10;
            console.log("xPos2: " + xPos);

            //  Name
            var labelName = new cc.LabelTTF(highscoresArr[i].name, PiuPiuConsts.fontName, PiuPiuConsts.fontSizeStatus);
            //labelName.textAlign = cc.TEXT_ALIGNMENT_CENTER;

            labelName.setFontFillColor(cc.color(255,220,80)); //  Yellow
            labelName.enableStroke(cc.color(0,0,255), PiuPiuConsts.fontStrokeSize); //Blue
            labelName.anchorX = 0;
            //xPos = PiuPiuGlobals.winSize.width / 2 - labelName.width / 2;
            xPos = PiuPiuGlobals.winSize.width / 2 - highScoreLabel.width / 2;
            labelName.setPosition(xPos, yPos);
            this.addChild(labelName);

            //  Score
            xPos = PiuPiuGlobals.winSize.width * 3 / 4;
            console.log("xPos3: " + xPos);
            var labelScore = new cc.LabelTTF(highscoresArr[i].score, PiuPiuConsts.fontName, PiuPiuConsts.fontSizeStatus);
            //labelScore.textAlign = cc.TEXT_ALIGNMENT_CENTER;
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
    onEnter:function () {
        this._super();
        this.layer = new LeaderboardLayer();
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
                stopAllSounds();
                event.getCurrentTarget().moveToNextScene();
                return true;
            },
            onTouchMoved: null,
            onTouchEnded: null}, this);


        FBgetAllScores( this, this.successGettingResults, this.errorGettingResults);
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.waitForResults, 1, PiuPiuConsts.FBwaitForResultsInSeconds);
    },
    moveToNextScene : function () {
        if (!this.backEnabled) {
            return;
        }
        cc.director.popScene();
    },

    waitForResults : function () {
        this.secondsWaiting++;
        var loadStr = "Loading."

        for (var i=0; i < (this.secondsWaiting % 3); i++) {
            loadStr += ".";
        }

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

        this.loadDataCounter = Math.min(PiuPiuGlobals.FBallScoresData.length, PiuPiuConsts.FBleaderboardShowTop);
        this.highscoresArr = [];
        this.spritesArr = [];
        //var totalscores = [];
        for (var i = 0; (i < PiuPiuGlobals.FBallScoresData.length) && (i < PiuPiuConsts.FBleaderboardShowTop); i++) {
            this.highscoresArr[i] = [];
            var id = PiuPiuGlobals.FBallScoresData[i].user.id;
            var name = PiuPiuGlobals.FBallScoresData[i].user.name;
            var score = PiuPiuGlobals.FBallScoresData[i].score;

            this.highscoresArr[i].id = id;
            this.highscoresArr[i].name = name;
            this.highscoresArr[i].score = score;

            console.log("name: " + name + "     score: " +score );
            FBgetPicture(id, this, this.addSpriteForUser);
        }
        //this.layer.showTables(this.highscoresArr);
    },

    testSprite : function ( tex ) {
        tex = tex = "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/v/t1.0-1/c23.101.380.380/s40x40/1185708_10151702829728197_1243295359_n.jpg?oh=1e0e9c55087076b0104f06f1848d8fec&oe=553EE8C0&__gda__=1427216806_967de4fa188d3d927b3b350615152f92"
        console.log("in testSPrite with tex " + tex);
        var s = new cc.Sprite(tex);
        s.setPosition(100, 100);
        this.addChild(s);
    },

    addSpriteForUser : function (id, imageURL) {
        var sprite = new cc.Sprite(imageURL);
        this.spritesArr[id] = sprite;

        console.log("addSpriteForUser added sprite for id " + id)

        this.loadDataCounter--;
        this.isCompleteResults();
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
