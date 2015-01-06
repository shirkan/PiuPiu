/**
 * Created by shirkan on 11/24/14.
 */

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isFileExist(filename)
{
    if (!filename) {
        return false;
    }
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', filename, false);
    xhr.send();

    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

function isRunningOnAndroid() {
    return (cc.sys.platform == cc.sys.ANDROID);
}

function isRunningOniOS() {
    return (cc.sys.platform == cc.sys.IPAD || cc.sys.platform == cc.sys.IPHONE);
}

function isRunningOnMobile() {
    return (cc.sys.isMobile);
}

function isDebugMode() {
    return cc.game.config["debugMode"];
}

function LOG (str) {
    console.log(str);
}

function randomNumber (min, max) {
    min = min || 0;
    max = max || 0;
    var range = max - min;
    return (Math.random() * range + min);
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
