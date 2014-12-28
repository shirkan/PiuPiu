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
    parentNode:null,
    canBeRedeemed:true,
    ctor: function( parentNode, sprite, onHit, period, location) {
        this.space = parentNode.space;
        this.onHit = onHit;
        this.parentNode = parentNode;
        this.sprite = new cc.PhysicsSprite(sprite);

        //  Set starting position
        if (location == undefined) {
            //  Random location on last Q of screen
            var x = Math.random() * (PiuPiuGlobals.winSize.width / 2) + (PiuPiuGlobals.winSize.width / 2 - this.sprite.width);
            var y = Math.random() * (PiuPiuGlobals.winSize.height - this.sprite.height) + this.sprite.height / 2;
            location = cc.p(x,y);
        }

        //  Register collision
        var tag = Date.now();
        this.space.addCollisionHandler(SpriteTag.Bullet, tag,
            this.callback.bind(this), null, null, null);

        // init physics
        this.body = new cp.Body(1,1);
        this.body.setPos(location);
        this.sprite.setBody(this.body);
        this.space.addBody(this.body);

        //  Calculate body shape
        this.shape = new cp.CircleShape(this.body, PiuPiuConsts.powerupRadius, PiuPiuConsts.powerupCenterPoint);
        this.shape.setCollisionType(tag);
        this.shape.setSensor(true);
        this.space.addShape(this.shape);

        //  Display power up
        this.parentNode.addChild(this.sprite, PiuPiuConsts.powerupLocalZOrder);

        //  Remove powerup in "period" seconds
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.scheduleRemoveFromParent, period, 0);
    },

    scheduleRemoveFromParent: function () {
        addPostStepCallback(this.removeFromParent.bind(this));
    },

    removeFromParent:function () {
        this.parentNode.removeObject(this.body);
        this.space.removeShape(this.shape);
        this.shape = null;
        this.space.removeBody(this.body);
        this.body = null;
        this.sprite.removeFromParent();
        this.sprite = null;
    },

    callback : function() {
        if (!this.canBeRedeemed) {
            return;
        }
        this.canBeRedeemed = false;
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

var MachineGunPowerUp = PowerUp.extend({
    ctor: function (parentNode, onHit, period, location) {
        this._super(parentNode, res.PowerupMachineGun_png, onHit, period, location)
    }
});

var OneUpPowerUp = PowerUp.extend({
    ctor: function (parentNode, onHit, period, location) {
        this._super(parentNode, res.Powerup1Up_png, onHit, period, location)
    }
});

var CaptainPowerUp = PowerUp.extend({
    ctor: function (parentNode, onHit, period, location) {
        this._super(parentNode, res.PowerupCaptain_png, onHit, period, location)
    }
});

var StopwatchPowerUp = PowerUp.extend({
    ctor: function (parentNode, onHit, period, location) {
        this._super(parentNode, res.PowerupStopwatch_png, onHit, period, location)
    }
});