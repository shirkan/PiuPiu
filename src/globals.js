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
};

if (typeof PiuPiuConsts == "undefined") {
    var PiuPiuConsts = {};
    PiuPiuConsts.pointsPerEnemyKill = 7;
    PiuPiuConsts.sourcePoint = cc.p(110, 255);
    PiuPiuConsts.enemyMoveToPoint = cc.p(30,240);
    PiuPiuConsts.handsAnchor = cc.p(30,245);
    PiuPiuConsts.handsLength = 83;
}