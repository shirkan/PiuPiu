/**
 * Created by shirkan on 12/31/14.
 */
// ***** Facebook utilities *****
var FBInstance = plugin.FacebookAgent.getInstance();

function FBinit() {
    if (FBisLoggedIn()) {
        console.log("FBinit: logged in!");
    } else {
        console.log("FBinit: not logged in!");
        //  Try to get access token
        var token = FBInstance.getAccessToken();
        if (token){
            console.log("FBinit: AccessToken: " + token);
        } else {
            console.log("FBinit: No valid access token from the current user, trying to login");
            FBlogin();
        }

    }
    FBgetScore();
    FBonLoginUpdates();
}

function FBlogin(target, success_callback, error_callback) {
    console.log("FBlogin: asking for  the following permissions: " +PiuPiuConsts.FBpermissionsNeeded);
    FBInstance.login(PiuPiuConsts.FBpermissionsNeeded, function(code, response){
        if(code == plugin.FacebookAgent.CODE_SUCCEED){
            LOG("FBlogin: login succeeded");
            var allowedPermissions = response["permissions"];
            var str = "";
            for (var i = 0; i < allowedPermissions.length; ++i) {
                str += allowedPermissions[i] + " ";
            }
            LOG("FBlogin Permissions: " + str);
            PiuPiuGlobals.FBpermissionsGranted = allowedPermissions;

            FBonLoginUpdates();

            if (success_callback) { success_callback.call(target) }
        } else {
            console.log("FBlogin Login failed, error #" + code + ": " + JSON.stringify(response));
            if (error_callback) { error_callback.call(target) }
        }
    });
}

function FBonLoginUpdates() {

    LOG("FBonLoginUpdates Has all permission?: " + FBcheckPermissions());

    LOG("FBonLoginUpdates Getting score");
    FBgetScore();

    LOG("FBonLoginUpdates Getting all scores");
    FBgetAllScores();
}

function FBlogout() {
    if (FBisLoggedIn()) {
        FBInstance.logout();
    }
    console.log("FBlogout Facebook logged out. IsloggedIn? " + FBisLoggedIn());
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
            console.log("FBcheckPermissions Missing permission: " + PiuPiuConsts.FBpermissionsNeeded[i]);
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

            ////  Check if need to update local high score
            //if (PiuPiuGlobals.FBplayerScoreData.score > PiuPiuGlobals.highScore) {
            //    PiuPiuGlobals.highScore = PiuPiuGlobals.FBplayerScoreData.score;
            //    cc.sys.localStorage.setItem("highScore", PiuPiuGlobals.highScore);
            //}
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
