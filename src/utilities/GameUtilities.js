/**
 * Created by shirkan on 12/31/14.
 */

function calculateTrigonometry ( point ) {
    var endPoint = cc.p();
    var bulletStartPoint = cc.p();
    var endAngle = 0;

    //  Calculating ax+b = 0
    var a = calculateGradient(point, PiuPiuConsts.handsAnchor);
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

function calculateGradient (p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return (dy / dx);
}

function calculateHalfCirclePath( ps, pe, steps, direction, clockwise) {
    if (steps < 3) {
        return;
    }

    direction = (direction ? 1 : -1);
    clockwise = (clockwise ? 1 : -1);

    var points = [];
    var r = calculateLineLength(ps, pe) / 2;
    var beta = Math.atan(calculateGradient(ps, pe)) * 180 / Math.PI;
    var betaDiagonal = (90 - beta) / 180 * Math.PI ;
    beta = beta / 180 * Math.PI;
    var pm = cc.p((ps.x + pe.x) / 2, (ps.y + pe.y) / 2);

    for (var i=1; i <= steps; i++) {
        var alpha = i/steps * Math.PI;

        var rCosAlpha = Math.cos(alpha) * r;
        var rSinAlpha = Math.sin(alpha) * r;

        var xOnLine = clockwise * pm.x - rCosAlpha * Math.cos(beta) * direction;
        var yOnLine = clockwise * pm.y - rCosAlpha * Math.sin(beta) * direction;

        var x = clockwise * xOnLine - rSinAlpha * Math.cos(betaDiagonal) * direction;
        var y = clockwise * yOnLine + rSinAlpha * Math.sin(betaDiagonal) * direction;

        var point = cc.p(x, y);
        points.push(point);
    }

    return points;
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

function handleHighScore() {
    var localHighScore = PiuPiuGlobals.highScore;
    var storedHighScore = (cc.sys.localStorage.highScore ? cc.sys.localStorage.highScore : 0);
    if (FBisLoggedIn(this, FBgetScore)) {
        LOG("handleHighScore FB logged in!");
    } else {
        LOG("handleHighScore FB NOTTTTT logged in!");
    }
    var FBHighScore = (PiuPiuGlobals.FBplayerScoreData ? PiuPiuGlobals.FBplayerScoreData.score : 0);

    var highScore = Math.max(localHighScore, storedHighScore, FBHighScore);

    PiuPiuGlobals.highScore = cc.sys.localStorage.highScore = highScore;

    if (FBisLoggedIn()) {
        FBpostHighScore(highScore);
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

function loadAllLevels() {
    var self = this;
    var i = 1;
    var fileName = "src/levels/level" + i + ".json";
    while (isFileExist(fileName) && i <=4) {
        (function (_i) {
            cc.loader.loadJson(fileName, function (error, data) {
                LOG("loadAllLevels: loading level " + _i);
                PiuPiuLevels[_i] = {};
                //  Type of level
                PiuPiuLevels[_i].levelType = data["levelType"] || levelType.EliminateAllEnemies;
                //  Enemies to spawn
                PiuPiuLevels[_i].totalEnemiesToKill = PiuPiuLevels[_i].totalEnemiesToSpawn = data["totalEnemies"];
                PiuPiuLevels[_i].enemiesVanished = 0;
                PiuPiuLevels[_i].enemiesSpawnInterval = data["enemiesSpawnInterval"] || 2;
                PiuPiuLevels[_i].enemiesSpawnIntervalMin = data["enemiesSpawnIntervalMin"] || 0;
                PiuPiuLevels[_i].enemiesSpawnIntervalMax = data["enemiesSpawnIntervalMax"] || 0;
                PiuPiuLevels[_i].enemiesSpawnIntervalType = data["enemiesSpawnIntervalType"] || "constantTempo";

                //  Power ups policy
                PiuPiuLevels[_i].powerupsSpawnInterval = data["powerupsSpawnInterval"] || 2;
                PiuPiuLevels[_i].powerupsSpawnIntervalMin = data["powerupsSpawnIntervalMin"] || 0;
                PiuPiuLevels[_i].powerupsSpawnIntervalMax = data["powerupsSpawnIntervalMax"] || 0;
                PiuPiuLevels[_i].powerupsSpawnIntervalType = data["powerupsSpawnIntervalType"] || "none";
                PiuPiuLevels[_i].powerupsTypes = data["powerupsTypes"] || "";

                //  Special notations
                PiuPiuLevels[_i].specialNotations = data["specialNotations"] || [];
                PiuPiuLevels[_i].hint = data["hint"] || "";
            });
        })(i);

        var fileName = "src/levels/level" + (++i) + ".json";
    }
}

function loadLevelSettings() {
    LOG("loadLevelSettings: loading level " + PiuPiuGlobals.currentLevel);
    PiuPiuLevelSettings = PiuPiuLevels[PiuPiuGlobals.currentLevel];
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