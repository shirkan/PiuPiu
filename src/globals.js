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

if (typeof PiuPiuConsts == "undefined") {
    var PiuPiuConsts = {};
    PiuPiuConsts.pointsPerEnemyKill = 7;
    PiuPiuConsts.pointsPerEnemyHeadShot = 10;
    PiuPiuConsts.sourcePoint = cc.p(110, 255);

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
    PiuPiuGlobals.livesLeft = 0;
    PiuPiuGlobals.highScore = 0;
}