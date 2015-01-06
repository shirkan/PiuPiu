/**
 * Created by shirkan on 1/5/15.
 */

var Level1Anim = cc.Layer.extend({
    TIME_shootToEnemy: 0.2,
    TIME_enter: 1.5,
    TIME_delayEnemyEnter: 1.5,
    TIME_delayUntilShoot: 3,
    player:null,
    enemy:null,
    hands:null,
    bullet:null,
    ctor : function(){
        this._super();
    },
    init:function() {
        this._super();

        //  Add player
        //  Place player on left side
        this.player = new cc.Sprite(res.Player_png);
        this.player.anchorX = 0;
        //this.player.setAnchorPoint(0,0);
        this.player.setPosition(cc.p(-this.player.width, this.player.height / 2 + PiuPiuConsts.fontSizeSmall + 5));
        this.addChild(this.player);

        this.hands = new cc.Sprite("#hands.png");
        this.hands.setAnchorPoint(0,0);
        this.hands.setPosition(cc.p(-this.player.width + 23, this.player.y - 15));
        this.addChild(this.hands);

        //  Add enemy
        this.enemy = new cc.Sprite(res.Enemy_png);
        this.enemyStartPos = cc.p(PiuPiuGlobals.winSize.width + this.enemy.width / 2, (PiuPiuGlobals.winSize.height /2));
        this.enemy.setPosition(this.enemyStartPos);
        this.addChild(this.enemy);

        //  Generate animation
        var playerAnimation = cc.MoveBy.create(this.TIME_enter, cc.p(100, 0));
        //var enemyAnimation =
        var enemyAnimation = new cc.Sequence(
            new cc.DelayTime(this.TIME_delayEnemyEnter),
            cc.MoveTo.create(this.TIME_enter, cc.p(PiuPiuGlobals.winSize.width -this.enemy.width * 2, this.hands.y + this.hands.height/2))
        );

        //  Assign animations and go
        this.player.runAction(playerAnimation);
        this.hands.runAction(playerAnimation.clone());
        this.enemy.runAction(enemyAnimation);

        cc.director.getScheduler().scheduleCallbackForTarget(this, this.shootBullet, 0, 0, this.TIME_delayUntilShoot);
    },

    shootBullet : function () {
        //  Add bullet
        this.bullet = new cc.Sprite(res.Bullet_png);

        var p1 = cc.p(this.hands.x + this.hands.width, this.hands.y + this.hands.height/2);
        var p2 = this.enemy.getPosition();
        LOG("p2 is " + p2.x + " " + p2.y)

        this.bullet.setPosition(p1);
        this.addChild(this.bullet);

        var speed = calculateDistanceBetween2Points(p1, p2) / PiuPiuConsts.framesPerSeconds;

        //  Shoot towards enemy
        var shootToEnemy = new cc.Sequence(
            cc.MoveTo.create(speed,p2),
            new cc.CallFunc(function() { this.removeChild(this.bullet); this.removeChild(this.enemy);}, this)
        );
        this.bullet.runAction(shootToEnemy);
    }

});