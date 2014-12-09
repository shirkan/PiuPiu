/**
 * Created by shirkan on 12/8/14.
 */

var PowerUp = cc.Class.extend({
    space:null,
    onHit:null,
    period:null,
    sprite:null,
    body:null,
    shape:null,
    ctor: function( parentNode, sprite, onHit, period, location) {
        this.space = parentNode.space;
        this.onHit = onHit;
        this.sprite = new cc.PhysicsSprite(sprite);

        //  Set starting position
        if (location == undefined) {
            //  Random location on last Q of screen
            var x = Math.random() * (PiuPiuGlobals.winSize.width / 4) + (PiuPiuGlobals.winSize.width * 3 / 4);
            var y = Math.random() * (PiuPiuGlobals.winSize.height);
            location = cc.p(x,y);
        }

        //  Register collision
        this.space.addCollisionHandler(SpriteTag.Bullet, SpriteTag.Powerup,
            this.callback.bind(this), null, null, null);

        // init physics
        this.body = new cp.Body(1,1);
        this.body.setPos(location);
        this.sprite.setBody(this.body);
        this.space.addBody(this.body);

        //  Calculate body shape
        this.shape = new cp.CircleShape(this.body, PiuPiuConsts.powerupRadius, PiuPiuConsts.powerupCenterPoint);
        this.shape.setCollisionType(SpriteTag.Powerup);
        this.shape.setSensor(true);
        this.space.addShape(this.shape);

        //  Display power up
        parentNode.addChild(this.sprite);

        //  Remove powerup in "period" seconds
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.scheduleRemoveFromParent, period, 0);
    },

    scheduleRemoveFromParent: function () {
        addPostStepCallback(this.removeFromParent.bind(this));
    },

    removeFromParent:function () {
        this.space.removeShape(this.shape);
        this.shape = null;
        this.space.removeBody(this.body);
        this.body = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    callback : function() {
        //  Update stats
        PiuPiuGlobals.totalPowerUps++;

        //  Unschedule auto remove from parent
        cc.director.getScheduler().unscheduleCallbackForTarget(this, this.scheduleRemoveFromParent);

        //  Schedule remove from parent on space post step
        this.scheduleRemoveFromParent();

        //  Invoke callback
        this.onHit();
    }
});

var MachineGunPowerup = PowerUp.extend({
    ctor: function (parentNode, onHit, period, location) {
        this._super(parentNode, res.PowerupMachineGun_png, onHit, period, location)
    }
});