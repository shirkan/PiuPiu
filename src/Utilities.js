/**
 * Created by shirkan on 11/24/14.
 */

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function calculateTrigonometry ( point ) {
    var endPoint = cc.p();
    var bulletStartPoint = cc.p();
    var endAngle = 0;

    var dx = point.x - PiuPiuConsts.handsAnchor.x;
    var dy = point.y - PiuPiuConsts.handsAnchor.y;

    //  Calculating ax+b = 0
    var a = dy / dx ;
    var b = point.y - (a * point.x);

    //  Calculating end point
    if (a==0) {
        //  very rare, end point is right ahead after right border
        endPoint.x = PiuPiuGlobals.winSize.width;
        endPoint.y = point.y;
    } else {
        //  Calculate intersection of ax+b with x=winSize.width
        var xBorderEndX = PiuPiuGlobals.winSize.width;
        var xBorderEndY = a * xBorderEndX + b;

        //  Calculate intersection of ax+b with y=0 or y=winSize.height
        if (a>0) {
            var yBorderEndY = PiuPiuGlobals.winSize.height;
        } else {
            var yBorderEndY = 0;
        }

        var yBorderEndX = (yBorderEndY - b) / a;

        //  Determine which is closer, using Pitagoras
        var xBorderLength = Math.sqrt(Math.pow(xBorderEndX - PiuPiuConsts.sourcePoint.x, 2) + Math.pow(xBorderEndY - PiuPiuConsts.sourcePoint.y, 2));
        var yBorderLength = Math.sqrt(Math.pow(yBorderEndX - PiuPiuConsts.sourcePoint.x, 2) + Math.pow(yBorderEndY - PiuPiuConsts.sourcePoint.y, 2));

        if (xBorderLength < yBorderLength) {
            endPoint.x = xBorderEndX;
            endPoint.y = xBorderEndY;
        } else {
            endPoint.x = yBorderEndX;
            endPoint.y = yBorderEndY;
        }
    }

    //  Calculate rotation angle
    //  "a" is the tangent, so the angle should be tan(a
    endAngle = (Math.atan(a)).toFixed(2);

    //  Calculate bullet start point
    bulletStartPoint.x = PiuPiuConsts.handsAnchor.x + (PiuPiuConsts.handsLength * Math.cos(endAngle));
    bulletStartPoint.y = a * bulletStartPoint.x + b;

    return [endPoint, bulletStartPoint, endAngle];

}

function calculateLineLength( p1, p2) {
    return Math.sqrt( Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
}

function initGlobals() {
    PiuPiuGlobals.winSize = cc.director.getWinSize();
    PiuPiuGlobals.commonGrassMap = res.grass9_tmx;
    PiuPiuGlobals.currentLevel = 0;
    PiuPiuGlobals.soundEnabled = parseInt(cc.sys.localStorage.soundEnabled);
    if (PiuPiuGlobals.soundEnabled === undefined || isNaN(PiuPiuGlobals.soundEnabled)) {
        cc.sys.localStorage.soundEnabled = PiuPiuGlobals.soundEnabled = 1;
    }
}

function loadStats () {
    for (var i in PiuPiuGlobals.statsNames) {
        var val = parseInt(cc.sys.localStorage.getItem(PiuPiuGlobals.statsNames[i]));
        if (val != null && !isNaN(val)) {
            eval("PiuPiuGlobals." + PiuPiuGlobals.statsNames[i] +"= val");
        }
    }
    //  Check for highscore
    if (cc.sys.localStorage.highScore) {
        PiuPiuGlobals.highScore = cc.sys.localStorage.highScore;
    }
}

function updateStats() {
    for (var i in PiuPiuGlobals.statsNames) {
        var val = eval("PiuPiuGlobals." + PiuPiuGlobals.statsNames[i]);
        cc.sys.localStorage.setItem(PiuPiuGlobals.statsNames[i], val);
    }
}

function playSound ( sound ) {
    if (PiuPiuGlobals.soundEnabled) {
        cc.audioEngine.playEffect(sound);
    }
}

function stopAllSounds () {
    cc.audioEngine.stopAllEffects();
}

var powerupTag = SpriteTag.MinPowerup;
function getTag() {
    return powerupTag++;
}

function loadLevelSettings() {
    var fileName = "src/levels/level" + PiuPiuGlobals.currentLevel + ".json";
    cc.loader.loadJson(fileName, function(error, data){
        //  Type of level
        PiuPiuLevelSettings.levelType = data["levelType"] || levelType.EliminateAllEnemies;
        //  Enemies to spawn
        PiuPiuLevelSettings.totalEnemiesToKill = PiuPiuLevelSettings.totalEnemiesToSpawn = data["totalEnemies"];
        PiuPiuLevelSettings.enemiesVanished = 0;
        PiuPiuLevelSettings.enemiesSpawnInterval = data["enemiesSpawnInterval"] || 2;
        PiuPiuLevelSettings.enemiesSpawnIntervalMin = data["enemiesSpawnIntervalMin"] || 0;
        PiuPiuLevelSettings.enemiesSpawnIntervalMax = data["enemiesSpawnIntervalMax"] || 0;
        PiuPiuLevelSettings.enemiesSpawnIntervalType = data["enemiesSpawnIntervalType"] || "constantTempo";

        //  Power ups policy
        PiuPiuLevelSettings.powerupsSpawnInterval = data["powerupsSpawnInterval"] || 2;
        PiuPiuLevelSettings.powerupsSpawnIntervalMin = data["powerupsSpawnIntervalMin"] || 0;
        PiuPiuLevelSettings.powerupsSpawnIntervalMax = data["powerupsSpawnIntervalMax"] || 0;
        PiuPiuLevelSettings.powerupsSpawnIntervalType = data["powerupsSpawnIntervalType"] || "none";
        PiuPiuLevelSettings.powerupsTypes = data["powerupsTypes"] || "";

        //  Special notations
        PiuPiuLevelSettings.specialNotations = data["specialNotations"] || [];
        PiuPiuLevelSettings.hint = data["hint"] || "";
    });

    console.log("Completed loading level " + PiuPiuGlobals.currentLevel);
}

function getLevelTypeString() {
    switch (PiuPiuLevelSettings.levelType) {
        case levelType.EliminateAllEnemies: {
            return "Eliminate all enemies"
        }
        case levelType.Survival: {
            return "Survive X time"
        }
        case levelType.ShootPowerups: {
            return "Shoot powerups"
        }
        case levelType.TargetScore: {
            return "Achieve X points"
        }
    }
}

function specialNotationDoesContain( item ) {
    var i = PiuPiuLevelSettings.specialNotations.length;
    while (i--) {
        if (PiuPiuLevelSettings.specialNotations[i] === item) {
            return true;
        }
    }
    return false;
}

function isDebugMode() {
    return cc.game.config["debugMode"];
}

function LOG (str) {
    console.log(str);
}

function ifDebugOn (statement) {
    return (isDebugMode() ? eval(statement) : false);
}

//  This is a walkaround until this.space.addPostStepCallback() will be ready (already check in, check out cocos2d-js v3.2
var spaceCallbacks = [];
function addPostStepCallback(callback) {
    spaceCallbacks.push(callback);
}

function runPostStepCallbacks() {
    for (var i = 0; i < spaceCallbacks.length; ++i) {
        spaceCallbacks[i]();
    }
    resetPostStepCallback();
}

function resetPostStepCallback() {
    spaceCallbacks = [];
}

// ***** Facebook utilities *****
var FBInstance = plugin.FacebookAgent.getInstance();

function FBinit() {
    if (FBisLoggedIn()) {
        console.log("FACEBOOK: logged in!");
    } else {
        console.log("FACEBOOK: not logged in!");
        //  Try to get access token
        var token = FBInstance.getAccessToken();
        if (token){
            console.log("AccessToken: " + token);
        } else {
            console.log("No valid access token from the current user, trying to login");
            FBlogin();
        }

    }
    FBgetScore();
}

function FBlogin(target, success_callback, error_callback) {
    console.log("asking for  the following permissions: " +PiuPiuConsts.FBpermissionsNeeded);
    FBInstance.login(PiuPiuConsts.FBpermissionsNeeded, function(code, response){
        if(code == plugin.FacebookAgent.CODE_SUCCEED){
            console.log("login succeeded");
            LOG("FBonLoginUpdates AccessToken: " + response["accessToken"]);
            var allowedPermissions = response["permissions"];
            var str = "";
            for (var i = 0; i < allowedPermissions.length; ++i) {
                str += allowedPermissions[i] + " ";
            }
            LOG("FBonLoginUpdates Permissions: " + str);
            PiuPiuGlobals.FBpermissionsGranted = allowedPermissions;

            FBonLoginUpdates();

            if (success_callback) { success_callback.call(target) }
        } else {
            console.log("Login failed, error #" + code + ": " + JSON.stringify(response));
            if (error_callback) { error_callback.call(target) }
        }
    });
}

function FBonLoginUpdates() {

    LOG("FBonLoginUpdates Has all permission?: " + FBcheckPermissions());

    LOG("Getting score");
    FBgetScore();

    LOG("Getting all scores");
    FBgetAllScores();
}

function FBlogout() {
    if (FBisLoggedIn()) {
        FBInstance.logout();
    }
    console.log("Facebook logged out. IsloggedIn? " + FBisLoggedIn());
}

function FBisLoggedIn( target, loggedInCallback, notLoggedInCallback) {
    if (FBInstance.isLoggedIn()) {
        if (target && loggedInCallback) {
            loggedInCallback.call(target);
        }
        return true;
    } else {
        if (target && notLoggedInCallback) {
            notLoggedInCallback.call(target);
        }
        return false;
    }
}

function FBcheckPermissions() {
    PiuPiuGlobals.FBpermissionsMissing = [];
    for (var i = 0; i < PiuPiuConsts.FBpermissionsNeeded.length; ++i) {
        if (PiuPiuGlobals.FBpermissionsGranted.indexOf(PiuPiuConsts.FBpermissionsNeeded[i]) == -1) {
            console.log("Missing permission: " + PiuPiuConsts.FBpermissionsNeeded[i]);
            PiuPiuGlobals.FBpermissionsMissing.push(PiuPiuConsts.FBpermissionsNeeded[i]);
            //PiuPiuGlobals.FBhaveAllPermissions = false;
        }
    }

    return (PiuPiuGlobals.FBpermissionsMissing.length == 0);
}

function FBpostScore ( score ) {
    if (!FBisLoggedIn()) {
        return false;
    }

    var updateHighScore = function () {
        if (!isNumber(PiuPiuGlobals.FBplayerScoreData.score)){
            console.log("PiuPiuGlobals.FBplayerScoreData.score is not a number " + PiuPiuGlobals.FBplayerScoreData.score);
            return;
        }
        LOG("FB: " + PiuPiuGlobals.FBplayerScoreData.score + " < local: "+ PiuPiuGlobals.highScore);
        if (PiuPiuGlobals.FBplayerScoreData.score < PiuPiuGlobals.highScore) {
            console.log("Updated high score!");
            FBpostHighScore();
        } else {
            console.log("High score wasn't updated");
        }

    };

    //  We need to get high score from server and add the points of the last game.
    //  By doing this, we are aligned on all platforms and not only on local device :)
    var updateTotalScore = function ( score ) {
        FBpostTotalScore( parseInt(score) + parseInt(PiuPiuGlobals.FBplayerScoreData.totalscore))
    }

    FBgetScore(this, function() { updateHighScore()});

    //FBpostTotalScore();
    //FBpostHighScore();
}

function FBpostTotalScore( ) {
    FBInstance.api("/me/scores", plugin.FacebookAgent.HttpMethod.POST, {"totalscore" : PiuPiuGlobals.totalPoints}, function (type, response) {
        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
            console.log("FBpostScore: " + JSON.stringify(response));
        } else {
            console.log("FBpostScore: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
        }
    });
    return true;
}

function FBpostHighScore() {
    FBInstance.api("/me/scores", plugin.FacebookAgent.HttpMethod.POST, {"score" : PiuPiuGlobals.highScore}, function (type, response) {
        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
            console.log("FBpostHighScore: " + JSON.stringify(response));
        } else {
            console.log("FBpostHighScore: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
        }
    });
    return true;
}

function FBgetScore( target, success_callback, error_callback) {
    if (!FBisLoggedIn()) {
        return false;
    }
    PiuPiuGlobals.FBplayerScoreData = null;
    FBInstance.api("/me/scores", plugin.FacebookAgent.HttpMethod.GET, function (type, response) {
        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
            console.log("FBgetScore: " + JSON.stringify(response));
            PiuPiuGlobals.FBplayerScoreData = response.data[0];

            //  Check if score exists
            if (!PiuPiuGlobals.FBplayerScoreData.score) {
                PiuPiuGlobals.FBplayerScoreData.score = 0;
            }

            //  Check if need to update local high score
            if (PiuPiuGlobals.FBplayerScoreData.score > PiuPiuGlobals.highScore) {
                PiuPiuGlobals.highScore = PiuPiuGlobals.FBplayerScoreData.score;
                cc.sys.localStorage.setItem("highScore", PiuPiuGlobals.highScore);
            }
            if (success_callback) { success_callback.call(target) }
        } else {
            console.log("FBgetScore: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
            if (error_callback) { error_callback.call(target) }
        }
    });
}

function FBgetAllScores( target, success_callback, error_callback ) {
    if (!FBisLoggedIn()) {
        return false;
    }

    PiuPiuGlobals.FBallScoresData = null;

    FBInstance.api("/" + PiuPiuConsts.FB_appid+ "/scores", plugin.FacebookAgent.HttpMethod.GET, function (type, response) {
        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
            PiuPiuGlobals.FBallScoresData = response.data;
            console.log("FBgetAllScores: " + JSON.stringify(PiuPiuGlobals.FBallScoresData));
            if (success_callback) { success_callback.call(target) }
        } else {
            console.log("FBgetAllScores: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
            if (error_callback) { error_callback.call(target) }
        }
    });
}

function FBdeleteAll () {
    if (!FBisLoggedIn()) {
        return false;
    }
    FBInstance.api("/" + PiuPiuConsts.FB_appid+ "/scores", plugin.FacebookAgent.HttpMethod.DELETE, function (type, response) {
        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
            PiuPiuGlobals.FBallScoresData = null;
            console.log("FBdeleteAll: " + JSON.stringify(response));
        } else {
            console.log("FBdeleteAll: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
        }
    });
}

function FBdeleteMe () {
    if (!FBisLoggedIn()) {
        return false;
    }
    FBInstance.api("/me/scores", plugin.FacebookAgent.HttpMethod.DELETE, function (type, response) {
        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
            PiuPiuGlobals.FBallScoresData = null;
            console.log("FBdeleteMe: " + JSON.stringify(response));
        } else {
            console.log("FBdeleteMe: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
        }
    });
}

function FBgetPicture ( userid, target, cb ) {
    if (!FBisLoggedIn()) {
        return false;
    }

    FBInstance.api("/" + userid + "/picture", plugin.FacebookAgent.HttpMethod.GET,
        {"type" : "normal", "height" : PiuPiuConsts.FBpictureSize, "width" : PiuPiuConsts.FBpictureSize}, function (type, response) {
        if (type == plugin.FacebookAgent.CODE_SUCCEED) {
            console.log("FBgetPicture: " + JSON.stringify(response));
            cc.loader.loadImg(response.data.url, {isCrossOrigin : true}, function () { cb.call(target, userid, response.data.url)});
            //if (cb) { cb.call(target, userid, response.data.url) }
        } else {
            console.log("FBgetPicture: Graph API request failed, error #" + type + ": " + JSON.stringify(response));
        }
    });
}


