/**
 * Created by shirkan on 11/17/14.
 */

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.Background = 0;
    TagOfLayer.Game = 1;
    TagOfLayer.Status = 2;
};

if(typeof hitType == "undefined") {
    var hitType = {};
    hitType.NoHit = 0;
    hitType.BulletEnemy = 1;
    hitType.BulletEnemyHead = 2;
    hitType.EnemyPlayer = 3;
};

if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.Player = 0;
    SpriteTag.Bullet = 1;
    SpriteTag.Enemy = 2;
    SpriteTag.EnemyHead = 3;
    SpriteTag.Powerup = 4;
};

if(typeof GameStates == "undefined") {
    var GameStates = {};
    GameStates.Menu = 0;
    GameStates.Intro = 1;
    GameStates.Playing = 2;
    GameStates.GameOver = 3;
    GameStates.CutScene = 4;
    GameStates.LevelCompleted = 5;
    GameStates.Leaderboard = 6;
}

if (typeof PiuPiuConsts == "undefined") {
    var PiuPiuConsts = {};

    //  Styles
    PiuPiuConsts.fontName = "ArcadeClassic";
    PiuPiuConsts.fontSizeNormal = 44;
    PiuPiuConsts.fontStrokeSize = 2;
    PiuPiuConsts.fontSizeStatus = 24;
    PiuPiuConsts.fontSizeBig = 80;

    //  Points
    PiuPiuConsts.pointsPerEnemyKill = 7;
    PiuPiuConsts.pointsPerEnemyHeadShot = 10;

    PiuPiuConsts.sourcePoint = cc.p(110, 255);

    //  Bullet
    PiuPiuConsts.framesPerSeconds = 1000;
    PiuPiuConsts.bulletLocalZOrder = 5;

    //  Enemy
    PiuPiuConsts.enemyMoveToPoint = cc.p(30,240);
    PiuPiuConsts.enemyHeadRadius = 10;
    PiuPiuConsts.enemyHeadOffset = cp.v(-6,22);
    PiuPiuConsts.enemyLocalZOrder = 3;

    //  Player
    PiuPiuConsts.handsAnchor = cc.p(30,184);
    PiuPiuConsts.handsLength = 83;
    PiuPiuConsts.livesOnGameStart = 3;
    PiuPiuConsts.maxLives = 5;

    //  Powerups
    PiuPiuConsts.powerupRadius = 7;
    PiuPiuConsts.powerupCenterPoint = cp.v(0,0);
    PiuPiuConsts.powerupPeriod = 3;
    PiuPiuConsts.powerupTypes = ["MachineGunPowerup", "OneUpPowerUp"];
    PiuPiuConsts.powerupMachineGunPeriod = 10;
    PiuPiuConsts.powerupLocalZOrder = 1;

    //  Facebook
    PiuPiuConsts.FB_appid = "331202163734875";
    PiuPiuConsts.FBpermissionsNeeded = ["public_profile", "user_activities", "user_about_me", "user_friends", "publish_actions"];
    PiuPiuConsts.FBwaitForResultsInSeconds = 11;
    PiuPiuConsts.FBleaderboardShowTop = 7;
}

if (typeof PiuPiuGlobals == "undefined") {
    var PiuPiuGlobals = {};

    //  Application vars
    PiuPiuGlobals.winSize = "";

    //  Game vars
    PiuPiuGlobals.livesLeft = 0;
    PiuPiuGlobals.highScore = 0;
    PiuPiuGlobals.gameState = GameStates.Menu;
    PiuPiuGlobals.currentLevel = 0;
    PiuPiuGlobals.commonGrassMap = "";
    PiuPiuGlobals.soundEnabled = 1;

    //  Stats vars
    PiuPiuGlobals.statsNames = ["totalBulletsFired", "totalPowerUps", "totalEnemyKilled", "totalHeadShots", "totalPoints"];
    for (var i in PiuPiuGlobals.statsNames) {
        eval("PiuPiuGlobals." + PiuPiuGlobals.statsNames[i] + " = 0");
    }

    //  Facebook
    PiuPiuGlobals.FBpermissionsMissing = PiuPiuConsts.FBpermissionsNeeded;
    PiuPiuGlobals.FBpermissionsGranted = [];
    PiuPiuGlobals.FBallScoresData = null;
    PiuPiuGlobals.FBplayerScoreData = null;
    PiuPiuGlobals.FBpictureSize = 40;
}

if (typeof PiuPiuLevelSettings == "undefined") {
    var PiuPiuLevelSettings = {};

    //  Level vars
    PiuPiuLevelSettings.totalEnemiesToSpawn = 0;
    PiuPiuLevelSettings.enemiesVanished = 0;
    PiuPiuLevelSettings.specialNotations = [];
    PiuPiuLevelSettings.enemiesSpawnInterval = 0;
    PiuPiuLevelSettings.enemiesSpawnIntervalMin = 0;
    PiuPiuLevelSettings.enemiesSpawnIntervalMax = 0;
    PiuPiuLevelSettings.enemiesSpawnIntervalType = "";

}