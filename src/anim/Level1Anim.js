/**
 * Created by shirkan on 1/5/15.
 */

var Level1Anim = cc.Layer.extend({
    TIME_shootToEnemy: 0.2,
    TIME_enter: 1.5,
    TIME_ballSpinAfterShoot: 3,
    TIME_enemyReentrantDelay: 5,
    ctor : function(){
        this._super();
        //  Add background
        var spriteBG = new cc.TMXTiledMap(PiuPiuGlobals.commonGrassMap);
        this.addChild(spriteBG);
    },
    init:function() {
        this._super();

        //  Add player
        //  Place player on left side
        this.player = new cc.Sprite(res.Player_png);
        this.player.setAnchorPoint(0,0);
        this.player.setPosition(cc.p(-this.player.width, this.player.y + PiuPiuConsts.fontSizeSmall + 5));
        this.addChild(this.player);

        var hands = new cc.Sprite("#hands.png");
        hands.setAnchorPoint(0,0);
        hands.setPosition(cc.p(-this.player.width + 15, this.player.y + 40 + PiuPiuConsts.fontSizeSmall + 5));
        this.addChild(hands);

        //  Add enemy
        this.enemy = new cc.Sprite(res.Enemy_png);
        this.enemyStartPos = cc.p(PiuPiuGlobals.winSize.width + this.enemy.width / 2, (PiuPiuGlobals.winSize.height /2));
        this.enemy.setPosition(this.enemyStartPos);
        this.addChild(this.enemy);

        //  Generate animation
        var playerAnimation = cc.MoveBy.create(this.TIME_enter, cc.p(100, 0));
        var enemyAnimation = cc.MoveTo.create(this.TIME_enter, cc.p(PiuPiuGlobals.winSize.width -this.enemy.width * 2, this.hands.y));

        //  Assign animations and go
        this.player.runAction(playerAnimation);
        hands.runAction(playerAnimation.clone());
        this.enemy.runAction(enemyAnimation);

        cc.director.getScheduler().scheduleCallbackForTarget(this, this.shootBullet, 0, 0, 3);
    },

    shootBullet : function (oldball) {
        //  Add bullet
        this.bullet = new cc.Sprite(res.Bullet_png);

        var p1 = cc.p(this.hands.x + this.hands.width, this.hands.y);
        var p2 = this.enemy.getPosition();
        LOG("p2 is " + p2.x + " " + p2.y)

        this.bullet.setPosition(p1);
        this.addChild(this.bullet);

        //  Shoot and rotate the ball towards enemy
        var shootToEnemy = new cc.Sequence(
            cc.moveTo.create(1,p2),
            new cc.CallFunc(function() { this.removeChild(this.bullet); this.removeChild(this.enemy);}, this)
        );
        this.bullet.runAction(shootToEnemy);
    }

});