/**
 * Created by shirkan on 11/17/14.
 */

if(typeof TagOfLayer == "undefined") {
    var TagOfLayer = {};
    TagOfLayer.Background = 0;
    TagOfLayer.Game = 1;
    TagOfLayer.Status = 2;
};

if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.Player = 0;
    SpriteTag.Bullet = 1;
    SpriteTag.Enemy = 2;
    SpriteTag.EnemyHead = 3;
};

if(typeof GameStates == "undefined") {
    var GameStates = {};
    GameStates.Menu = 0;
    GameStates.Intro = 1;
    GameStates.Playing = 2;
    GameStates.GameOver = 3;
}

if (typeof PiuPiuConsts == "undefined") {
    var PiuPiuConsts = {};

    //  Points
    PiuPiuConsts.pointsPerEnemyKill = 7;
    PiuPiuConsts.pointsPerEnemyHeadShot = 10;

    PiuPiuConsts.sourcePoint = cc.p(110, 255);

    //  Bullet
    PiuPiuConsts.framesPerSeconds = 640;

    //  Enemy
    PiuPiuConsts.enemyMoveToPoint = cc.p(30,240);
    PiuPiuConsts.enemyHeadRadius = 10;
    PiuPiuConsts.enemyHeadOffset = cp.v(-6,22);

    //  Player
    PiuPiuConsts.handsAnchor = cc.p(30,245);
    PiuPiuConsts.handsLength = 83;
    PiuPiuConsts.livesOnGameStart = 3;
    PiuPiuConsts.maxLives = 5;
}

if (typeof PiuPiuGlobals == "undefined") {
    var PiuPiuGlobals = {};

    //  Game vars
    PiuPiuGlobals.livesLeft = 0;
    PiuPiuGlobals.highScore = 0;
    PiuPiuGlobals.gameState = GameStates.Menu;

    //  Level vars
    PiuPiuGlobals.totalEnemies = 0;
    PiuPiuGlobals.specialNotations = [];
    PiuPiuGlobals.interval = 0;
    PiuPiuGlobals.intervalMin = 0;
    PiuPiuGlobals.intervalMax = 0;
    PiuPiuGlobals.intervalType = "";
}